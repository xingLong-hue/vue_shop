<template>
	<div>

		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
			<el-breadcrumb-item>分类参数</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<!-- 添加分类区 -->
			<el-row>
				<el-col>
					<el-button type="primary" @click="addCate">添加分类</el-button>
				</el-col>
			</el-row>
			<!-- 表格区 -->
			<tree-table class="treetable" index-text="#" show-index border :data="cateList" :columns="columns" :selection-type="false"
			 :expand-type="false">
				<template slot="isok" slot-scope="scope">
					<i class="el-icon-success" style="color:green" v-if="scope.row.cat_deleted===false"></i>
					<i class="el-icon-error" style="color:red" v-else></i>
				</template>
				<template slot="order" slot-scope="scope">
					<el-tag v-if="scope.row.cat_level===0">一级</el-tag>
					<el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
					<el-tag type="warning" v-else>三级</el-tag>
				</template>
				<template slot="option" slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
				</template>
			</tree-table>


			<!-- 分页区 -->

			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pagenum"
			 :page-sizes="[3, 5, 10, 15]" :page-size="query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">

			</el-pagination>

		</el-card>
		
		<!-- 添加分类对话框 -->
		<el-dialog title="添加分类" :visible.sync="dialogVisible" width="30%" @close="dialogClose">
			<!-- 表单主体内容 -->
			<el-form :model="addCateForm" ref="addCateFormRef" :rules="addCateFormRules" label-width="90px">
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="addCateForm.cat_name"></el-input>
				</el-form-item>
				<el-form-item label="父级分类" >
					<el-cascader expandTrigger="hover"  :options="parentCatlist" :props="cascaderProps" clearable v-model="selectKeys" @change="parentsChange"></el-cascader>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="sure_cate">确 定</el-button>
			</span>

		</el-dialog>
		

	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 商品分类的数据列表
				cateList: [],
				// 请求参数条件
				query: {
					type: 3,
					pagenum: 1,
					pagesize: 5
				},
				// 总数据条数
				total: 0,
				columns: [{
						label: "分类名称",
						prop: 'cat_name'
					},
					{
						label: "是否有效",
						type: 'template',
						template: "isok"
					},
					{
						label: "排序",
						type: 'template',
						template: "order"

					},
					{
						label: "操作",
						type: 'template',
						template: "option"

					}
				],
				dialogVisible: false,
				addCateForm: {
					cat_name: '',
					cat_pid: 0,
					cat_level: 1
				},
				addCateFormRules: {
					cat_name: [{
							required: true,
							message: '请输入分类名称',
							trigger: 'blur'
						},
						// {
						// 	min: 3,
						// 	max: 10,
						// 	message: '长度在 3 到 10 个字符',
						// 	trigger: 'blur'
						// }

					]
				},
				parentCatlist:[],
				cascaderProps:{
					value:'cat_id',
					label:'cat_name',
					children:'children',
					checkStrictly:true
				},
				selectKeys:[]

			}
		},
		created() {
			this.getCateList()
		},
		methods: {
			// 请求获取商品数据列表
			async getCateList() {

				const {
					data: res
				} = await this.$http.get('categories', {
					params: this.query
				})

				// console.log(res)

				if (res.meta.status !== 200) {
					return this.$message.error("获取失败")
				} else {
					this.cateList = res.data.result
					this.total = res.data.total
				}

			},
			addCate() {
				this.getParentsCateList()
				this.dialogVisible = true
				
			},
			// 监听pagesize 的变化
			handleSizeChange(newSize) {
				this.query.pagesize = newSize
				this.getCateList()
			},
			// 当前页码的变化
			handleCurrentChange(newPage) {
				this.query.pagenum = newPage
				this.getCateList()
			},
			async getParentsCateList() {
				const {
					data: res
				} = await this.$http.get('categories',{
					params:{
						type:2
					}
				})

				// console.log(res)

				if (res.meta.status !== 200) {
					return this.$message.error("获取失败")
				}
				this.parentCatlist =res.data;
				// this.parentCatlist =res.data.slice(0,10);
				// console.log(this.parentCatlist)
				

			},
			parentsChange(){
				
				// console.log(this.selectKeys)
				
				if(this.selectKeys.length>0){
					
					this.addCateForm.cat_pid=this.selectKeys[this.selectKeys.length -1 ]
					// 为当前分类 分配等级
					
					this.addCateForm.cat_level=this.selectKeys.length
					
					return
					
				}else{
					// 父级分类id
					this.addCateForm.cat_pid=0
					// 当前分类的等级
					this.addCateForm.cat_level=0;
					
				}
				
			},
			// 关闭对话框
			dialogClose() {
				this.$refs.addCateFormRef.resetFields()
				this.selectKeys=[]
				this.addCateForm.cat_pid=0
				this.addCateForm.cat_level=0
				this.dialogVisible = false

			},
			// 确认添加分类
			sure_cate(){
				
				console.log(this.addCateForm.cat_name)
				this.$refs.addCateFormRef.validate( async valid=>{
					if(!valid){
						return 
					}
				    const {data:res} = await this.$http.post('categories',this.addCateForm)
					
					if (res.meta.status !== 201) {
						return this.$message.error("添加分类失败！")
					} else {
						this.$message.success("添加分类成功！")
						this.getCateList()
						this.dialogVisible = false
					}
					
				})
				
				
			}




		}

	}
</script>

<style>
	.treetable {
		margin-top: 15px;
	}
	.el-cascader-menu{
		height: 200px;
	}
</style>
