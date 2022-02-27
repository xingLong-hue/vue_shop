<template>
	<div>

		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
 
		<el-card>
			<el-row :gutter="20">
				<el-col :span="9">
					<el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear="getUsersList">
						<el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="6">
					<el-button type="primary" @click="addUser">添加用户</el-button>
				</el-col>
			</el-row>

			<el-table :data="usersList" border>
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="username" label="姓名"></el-table-column>
				<el-table-column prop="email" label="邮箱"></el-table-column>
				<el-table-column prop="mobile" label="电话"></el-table-column>
				<el-table-column prop="role_name" label="角色"></el-table-column>
				<el-table-column label="状态" width="180">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.mg_state" @change="statusChange(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="edit_user(scope.row.id)"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="delete_user(scope.row.id)"></el-button>
						<el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
							<el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			 :page-sizes="[2, 6, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total">

			</el-pagination>
		</el-card>
		<!-- 添加用户对话框 -->
		<el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="dialogClose">
			<!-- 表单主体内容 -->
			<el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addUserForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addUserForm.password"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addUserForm.email"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="addUserForm.mobile"></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="sure_adduser">确 定</el-button>
			</span>

		</el-dialog>
		<!-- 编辑对话框 -->
		<el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClose">
			<!-- 表单主体内容 -->
			<el-form :model="edit_form" ref="edit_formRef" :rules="editFormRules" label-width="70px">
				<el-form-item label="用户名">
					<el-input v-model="edit_form.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="edit_form.email"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="edit_form.mobile"></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="sure_alter">确 定</el-button>
			</span>

		</el-dialog>
		
		<!-- 分配角色对话框 -->
		<el-dialog title="分配角色" :visible.sync="setRoletDialogVisible" width="30%" @close="CloseRoletDialogVisible">
			<el-form :model="role_form" ref="role_formRef"  label-width="90px">				
				<div>
					<p>当前的用户 :  {{role_form.username}}</p>
					<p>当前的角色 :  {{role_form.role_name }}</p>
					<p>分配新角色 :
					  <el-select v-model="newRoles">
					    <el-option
					      v-for="item in roleList"
					      :key="item.id"
					      :label="item.roleName"
					      :value="item.id">
					    </el-option>
					  </el-select>
					 </p>		
				</div>
			</el-form>
		
			<span slot="footer" class="dialog-footer">
				<el-button @click="setRoletDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveNewRole">确 定</el-button>
			</span>
		
		</el-dialog>



	</div>
</template>

<script>
	export default {

		data() {

			var checkEmail = (rule, value, callback) => {
				//验证邮箱的正则表达式
				const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
				if (regEmail.test(value)) {
					return callback()
				}
				callback(new Error("邮箱格式错误！"))

			}

			var checkTel = (rule, value, callback) => {
				//验证电话的正则表达式
				const regMobile = /^(0|86| 17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[571])[0-9]{8}$/

				if (regMobile.test(value)) {
					return callback()
				}
				callback(new Error("电话格式错误，请重新输入！"))

			}
			return {
				usersList: [],
				// 请求参数
				queryInfo: {
					query: '',
					pagenum: 1, //当前的页码
					pagesize: 2 //每页显示的条数
				},
				total: 0,
				//控制用户弹框的显隐
				dialogVisible: false,
				addUserForm: {
					username: '',
					password: '',
					meail: '',
					mobile: ''
				},
				addUserFormRules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '长度在 3 到 10 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 10,
							message: '长度在 3 到 10 个字符',
							trigger: 'blur'
						}
					],
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							validator: checkEmail,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入电话',
							trigger: 'blur'
						},
						{
							validator: checkTel,
							trigger: 'blur'
						}
					]
				},
				editDialogVisible: false,
				edit_form: {},
				// 修改用户信息的验证规则
				editFormRules: {
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: 'blur'
						},
						{
							validator: checkEmail,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输入电话',
							trigger: 'blur'
						},
						{
							validator: checkTel,
							trigger: 'blur'
						}
					]
				},
				setRoletDialogVisible:false,
				// 角色表单
				role_form:{},
				// 所有的角色列表
				roleList:[],
				// 新分配的角色
				newRoles:''
			}
		},
		// 页面创建期间会调用这个函数
		created() {
			this.getUsersList()
		},
		methods: {
			async getUsersList() {

				const {
					data: res
				} = await this.$http.get('users', {
					params: this.queryInfo
				})

				// console.log(res)

				if (res.meta.status !== 200) {
					return this.$message.error(res.meta.msg)
				} else {
					this.usersList = res.data.users
					//总数据条数
					this.total = res.data.total
				}
			},
			// 监听pagesize  每页显示的条数的改变
			handleSizeChange(newSizes) {

				//给原来变量重新赋值
				this.queryInfo.pagesize = newSizes
				//每改变一次重新请求获取新的数据渲染
				this.getUsersList()
			},
			// 监听当前页码值的改变  
			handleCurrentChange(newPages) {
				this.queryInfo.pagenum = newPages
				this.getUsersList()
			},
			// 修改用户状态    使用put提交方式
			async statusChange(userInfo) {
				const {
					data: res
				} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
				if (res.meta.status !== 200) {
					userInfo.mg_state = !userInfo.mg_state
					return this.$message.error("用户状态更新失败")
				}
				this.$message.success("用户状态更新成功")

			},
			// 弹出添加用户对话框
			addUser() {
				this.dialogVisible = true
			},
			// 监听对话框的关闭事件   进行表单的重置
			dialogClose() {
				this.$refs.addUserFormRef.resetFields();

			},
			// 确认添加用户操作
			sure_adduser() {

				// alert("0980")

				// 预校验
				this.$refs.addUserFormRef.validate(async (vaild) => {
					// 
					if (!vaild) return
					// 如果为真则可以发起请求 添加用户

					const {
						data: res
					} = await this.$http.post('users', this.addUserForm)
					if (res.meta.status !== 201) {
						this.$message.error("添加用户失败")
					} else {
						this.$message.success('添加用户成功！')
						// 关闭添加用户对话框
						this.dialogVisible = false
						// 重新渲染显示界面列表
						this.getUsersList()
					}

				})
			},

			async edit_user(id) {

				// console.log(id)
				// 通过id查询 
				const {
					data: res
				} = await this.$http.get('users/' + id)
				console.log(res)
				if (res.meta.status != 200) {
					return this.$message.error("查询失败")
				}
				//把数据赋值给编辑修改的表单 进行显示
				this.edit_form = res.data
				// 隐藏对话框
				this.editDialogVisible = true

			},
			editDialogClose() {
				this.$refs.edit_formRef.resetFields()
			},
			sure_alter() {
				// 预校验
				this.$refs.edit_formRef.validate(async (vaild) => {
					// 
					if (!vaild) return
					// 如果为真则可以发起请求 修改用户

					const {
						data: res
					} = await this.$http.put('users/' + this.edit_form.id, {
						email: this.edit_form.email,
						mobile: this.edit_form.mobile
					})
					if (res.meta.status !== 200) {
						this.$message.error("修改用户失败")
					} else {

						// 关闭添加用户对话框
						this.editDialogVisible = false

						// 重新渲染显示界面列表
						this.getUsersList()

						this.$message.success('修改用户成功！')
					}

				})
			},

			async delete_user(id) {
				const result = await this.$confirm('此操作将永久删除该用户吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch((err )=>{
					return err
				} );

				// console.log(result)
				
				if(result!='confirm'){
					return this.$message.info("你已取消操作")
				}
				
				const {data:res} = await this.$http.delete('users/'+id)
				
				if (res.meta.status !== 200) {
					return this.$message.error("删除用户失败")
				}
				
				this.$message.success('删除用户成功！')
				
				// 重新渲染显示界面列表
				this.getUsersList()
				

			},
			// 打开分配角色对话框
			async setRole(scope){
				
				// console.log(scope)
				// role_name   
				
				this.role_form=scope
				
				// 发起角色列表请求
				const {data:res} = await this.$http.get('roles')
				// console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error("获取角色列表失败")
				}
				
				this.roleList=res.data
				
				this.setRoletDialogVisible=true
				
			
			},
			// 确定保存新的角色
			async saveNewRole(){
				if(!this.newRoles){
					return this.$message.error("请选择要分配的角色")
				}
				const {data:res} = await this.$http.put(`users/${this.role_form.id}/role`,{rid:this.newRoles})
				if (res.meta.status !== 200) {
					return this.$message.error("分配角色失败")
				}
				this.$message.success('分配角色成功！')
				
				// // 重新渲染显示界面列表
				this.getUsersList()
				
				 this.setRoletDialogVisible=false
			
			},
			CloseRoletDialogVisible(){
				this.newRoles =''
				this.role_form ={}
			}
		}
		
	}
</script>

<style>
	.el-table{
		margin-top: 30px;
	}
</style>
