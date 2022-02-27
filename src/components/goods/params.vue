<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
			<el-breadcrumb-item>分类参数</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-alert title="注意! 只能为第三级分类设置相关参数." type="warning" show-icon :closable="false"></el-alert>
			<el-row class="sh_text">
				<el-col>
					<span>选择商品分类：</span>
					<el-cascader :options="list" :props="cascaderProps" v-model="selectKey" @change="handlechange"> </el-cascader>
				</el-col>
			</el-row>
			<br>
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<el-tab-pane label="动态参数" name="many">
					<el-button type="primary" size="mini" :disabled="isbtndisable" @click="addCateDate"> 添加参数</el-button>

					<!-- 动态表格 -->

					<el-table :data="manytableDate" border>
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable  @close="closeTag(scope.row,i)">{{item}}</el-tag>
								<el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
								 @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

							</template>
						</el-table-column>
						<el-table-column type="index"></el-table-column>
						<el-table-column prop="attr_name" label="参数名称"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="editDate(scope.row.attr_id)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParama(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>


				</el-tab-pane>

				<el-tab-pane label="静态属性" name="only">
					<el-button type="primary" size="mini" :disabled="isbtndisable" @click="addCateDate">添加属性</el-button>
					<el-table :data="onlytableDate" border>
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable  @close="closeTag(scope.row,i)">{{item}}</el-tag>
								<el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
								 @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
						
							</template>
						</el-table-column>
						<el-table-column type="index" label="#"></el-table-column>
						<el-table-column prop="attr_name" label="属性名称"></el-table-column>
						<el-table-column prop="attr_opt" label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="editDate(scope.row.attr_id)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParama(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>

			</el-tabs>

		</el-card>
		<!-- 对话框 -->
		<el-dialog :title="'添加'+titleText()" :visible.sync="DialogVisible" width="35%" @close="closeDialog">
			<!-- 表单主体内容 -->
			<el-form :model="addCateDateForm" ref="addCateDateFormRef" :rules="addCateDateFormRules" label-width="100px">
				<el-form-item :label="titleText()" prop="attr_name">
					<el-input v-model="addCateDateForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="DialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="sure_addDate">确 定</el-button>
			</span>

		</el-dialog>

		<!-- 编辑对话框 -->
		<el-dialog :title="'编辑'+titleText()" :visible.sync="editDialogVisible" width="35%" @close="editCloseDialog">
			<!-- 表单主体内容 -->
			<el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="100px">
				<el-form-item :label="titleText()" prop="attr_name">
					<el-input v-model="editForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="AddeditParams">确 定</el-button>
			</span>

		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				// 请求参数条件
				cascaderProps: {
					value: 'cat_id',
					label: 'cat_name',
					children: 'children',
					expandTrigger: 'hover'
				},
				selectKey: [],
				activeName: 'many',
				manytableDate: [],
				onlytableDate: [],
				DialogVisible: false,
				addCateDateForm: {
					attr_name: ''
				},
				addCateDateFormRules: {
					attr_name: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}]
				},
				editDialogVisible: false,
				editForm: {
					attr_name: ''
				},
				editFormRules: {
					attr_name: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}]
				},
				// inputVisible: false,
				// inputValue: '',

			}
		},
		created() {
			this.getCateList()
		},
		computed: {
			isbtndisable() {
				if (this.selectKey.length !== 3) {
					return true
				} else {
					return false
				}
			},
			// 当前选中三级分类id
			cateid() {
				if (this.selectKey.length === 3) {
					return this.selectKey[2]
				} else {
					return null
				}
			}
		},
		methods: {
			// 请求获取商品数据列表
			async getCateList() {

				const {
					data: res
				} = await this.$http.get('categories')
				
				
				// console.log(res)

				if (res.meta.status !== 200) {
					return this.$message.error("获取失败")
				} else {
					this.list = res.data

				}

			},
			handlechange() {
				// console.log(this.selectKey)
				this.getParamsList()
			},
			handleTabClick() {
				console.log(this.activeName)
				this.getParamsList()
			},
			async getParamsList() {
				if (this.selectKey.length !== 3) {
					this.selectKey = []
					return
				}
				// console.log(this.selectKey)

				// 根据所选的分类的id 相应的数据
				const {
					data: res
				} = await this.$http.get(`categories/${this.cateid}/attributes`, {
					params: {
						sel: this.activeName
					},
				})

				if (res.meta.status !== 200) {
					return this.$message.error("获取数据失败了！！！！")
				}
				console.log(res.data)


				res.data.forEach(item => {
					// item.attr_vals =item.attr_vals.split(' ')
					item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [],
					// 文本输入框的值
					item.inputValue='',
					item.inputVisible=false
					
				})


				if (this.activeName === 'many') {
					this.manytableDate = res.data
				} else {
					this.onlytableDate = res.data
				}

			},
			titleText() {
				if (this.activeName === 'many') {
					return '动态参数'
				} else {
					return '静态属性'
				}
			},
			addCateDate() {
				this.DialogVisible = true
			},
			closeDialog() {
				this.$refs.addCateDateFormRef.resetFields()
			},
			sure_addDate() {

				this.$refs.addCateDateFormRef.validate(async valid => {
					if (!valid) {
						return
					}
					const {
						data: res
					} = await this.$http.post(`categories/${this.cateid}/attributes`, {
						attr_name: this.addCateDateForm.attr_name,
						attr_sel: this.activeName,

					})

					if (res.meta.status !== 201) {
						return this.$message.error("添加参数失败！")
					} else {

						this.$message.success("添加参数成功！")
						this.getCateList()
						this.DialogVisible = false
					}

				})
			},
			async editDate(attr_id) {
				// 查询当前参数的信息
				const {
					data: res
				} = await this.$http.get(`categories/${this.cateid}/attributes/${attr_id}`, {
					params: {
						attr_sel: this.activeName,
					},
				})

				if (res.meta.status !== 200) {
					return this.$message.error("获取参数失败！")
				}

				// console.log(res.data)
				this.editForm = res.data
				this.editDialogVisible = true


			},
			editCloseDialog() {
				this.$refs.editFormRef.resetFields()
			},
			AddeditParams() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) {
						return
					}
					const {
						data: res
					} = await this.$http.put(`categories/${this.cateid}/attributes/${this.editForm.attr_id}`, {
						attr_name: this.editForm.attr_name,
						attr_sel: this.activeName,

					})

					if (res.meta.status !== 200) {
						return this.$message.error("修改参数失败！")
					} else {

						this.$message.success("修改参数成功！")
						this.getCateList()
						this.editDialogVisible = false
					}

				})
			},
			async removeParama(attr_id) {
				// 先来个提示
				const result = await this.$confirm('此操作将永久删除该用户吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch((err) => {
					return err
				});

				console.log(result)
				console.log(attr_id)
				if (result != 'confirm') {
					return this.$message.info("你已取消操作")
				}
				// 发送请求删除
				const {
					data: res
				} = await this.$http.delete(`categories/${this.cateid}/attributes/${attr_id}`)

				if (res.meta.status !== 200) {
					return this.$message.error("删除失败")
				}

				this.$message.success('删除成功！')

				// 重新渲染显示界面列表
				this.getCateList()
			},
			
			// 文本失去焦点
		     handleInputConfirm(row) {
				if(row.inputValue.trim().length===0){
					row.inputValue=''
					row.inputVisible=false
					return
				}
				
				row.attr_vals.push(row.inputValue.trim())
				row.inputValue=''
				row.inputVisible=false
				this.save(row)
			
				
			},
			showInput(row) {
				row.inputVisible = true
				// 让文本框自动获得焦点
				this.$nextTick(_ => {
				          this.$refs.saveTagInput.$refs.input.focus();
				        });
			},
			// 删除对应的可选参数项
			closeTag(row,i){
				row.attr_vals.splice(i,1)
				this.save(row)
			},
			// 对attr_vals的操作，保存到数据库
			async save(row){
				// 发起请求保存
				const {data: res} = await this.$http.put(`categories/${this.cateid}/attributes/${row.attr_id}`, {
					attr_name:row.attr_name,
					attr_sel: this.activeName,
					attr_vals:row.attr_vals.join(' ')
				
				})
				console.log(row.atte_sel)
				console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error("修改添加参数失败！")
				} else {
				
					this.$message.success("修改添加参数成功！")
				
				}
			}


		}
	}
</script>

<style>
	.sh_text {
		margin-top: 15px;
	}
	.input-new-tag{
		width: 110px !important;
	}
</style>
