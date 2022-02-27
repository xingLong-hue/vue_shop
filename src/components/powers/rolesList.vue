<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>

		</el-breadcrumb>
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary">添加角色</el-button>
				</el-col>
			</el-row>
			<el-table :data="roleslist" border>
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['tbbottom',index1===0 ? 'tbtop':'','vcenter']">
							<!-- 渲染一级权限 -->
							<el-col :span="5">
								<el-tag class="tagclasss" closable @close="removeByid(scope.row,item1.id)" >{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 二级权限和三级权限 -->
							<el-col :span="19">
								<el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="[ index2===0 ? '':'tbtop','vcenter']">
									<!-- 渲染二级级权限 -->
									<el-col :span="6">
										<el-tag type="success" closable @close="removeByid(scope.row,item2.id)" >{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<!-- 三级权限 -->
									<el-col :span="18">
										<el-tag type="warning" closable @close="removeByid(scope.row,item3.id)" v-for="(item3,index3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
									</el-col>

								</el-row>
							</el-col>

						</el-row>

					</template>
				</el-table-column>
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="roleName" label="角色名称"></el-table-column>
				<el-table-column prop="roleDesc" label="角色描述"></el-table-column>
				<el-table-column label="角色操作">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
						<el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
							<el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetpower(scope.row)"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		
		<!-- 分配权限对话框 -->
		<el-dialog title="分配权限" :visible.sync="powerDialogVisible" width="35%" @close="powerdialogClose">
			<!-- 树形组件 -->
			<el-tree :data="list" :props="treeProps" ref="treeRef"   show-checkbox node-key="id" default-expand-all  :default-checked-keys="defkeys"></el-tree>
			<span slot="footer" class="dialog-footer">
				<el-button @click="powerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="SetRolepower" >确 定</el-button>
			</span>
		
		</el-dialog>
		
		
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 角色列表
				roleslist: [],
				powerDialogVisible:false,
				// 所有的权限列表
				list:[],
				// 树形属性控件对象
				treeProps:{
					label:'authName',
					children:'children'
				},
				// 当前默认显示的权限的id的数组
				defkeys:[105,116],
				// 当前角色的ID
				roleId:''
			}
		},
		created() {
			this.getRoleslist()
		},
		methods: {
			async getRoleslist() {
				// 获取角色列表
				const {
					data: res
				} = await this.$http.get('roles')
				if (res.meta.status != 200) {
					return this.$message.error("失败！")
				}
				this.roleslist = res.data
				// console.log(this.roleslist)
			},
			// 删除权限的操作
			async removeByid(role,id) {
				// 弹框提示
				const result = await this.$confirm('此操作将永久删除此权限吗, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch((err) => {
					return err
				});

				// console.log(result)

				if (result != 'confirm') {
					return this.$message.info("你已取消操作")
				}
				const {data:res1}=await this.$http.delete(`roles/${role.id}/rights/${id}`)
				
				if (res1.meta.status !== 200) {
					return this.$message.error("删除权限失败")
				}
				this.$message.success('删除权限成功！')
				// 重新赋值显示界面
				role.children=res1.data
			},
			// 分配权限
			async showSetpower(role){
				// 请求获取权限数据  显示当前角色已有的权限
				this.roleId=role.id
				const {data:res2}=await this.$http.get('rights/tree')
				if (res2.meta.status !== 200) {
					return this.$message.error("获取权限列表失败")
				}
				this.list=res2.data
				// 递归获取第三级权限  的id
				this.getleadfId(role,this.defkeys)
				// 关闭对话框 
				this.powerDialogVisible=true
			},
			// 递归获取第三级权限  的id  并保存到arr数组中  即 defkeys
			getleadfId(node,arr){
				// 结点没有children 属性 则为第三极权限  ，则把它的id记录
				if(!node.children){
					return  arr.push(node.id)
				}
				node.children.forEach(item=>{
					this.getleadfId(item,arr)
				})
			},
			// 关闭对话框  进行重置
			powerdialogClose() {
				this.defkeys=[];
			
			},
			// 点击确定为角色分配权限
			async SetRolepower(){
				
				const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
				const Idstr= keys.join(',')
				console.log(this.roleId)
				const {data:result}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:Idstr})
				if (result.meta.status !== 200) {
					return this.$message.error("分配权限失败")
				}
				this.$message.success('分配权限成功！')
				this.getRoleslist()
				this.powerDialogVisible=false
			}
			

		}
	}
</script>

<style>
	.el-tag {
		margin: 7px;
	}

	.tbtop {
		border-top: 1px solid #CCCCCC;
	}

	.tbbottom {
		border-bottom: 1px solid #CCCCCC;
	}

	.vcenter {
		display: flex;
		align-items: center;
	}
</style>
