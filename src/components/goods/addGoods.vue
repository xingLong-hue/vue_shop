<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
			<el-breadcrumb-item>商品添加</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-alert title="添加商品信息" type="info" center show-icon :closable="false">
			</el-alert>
			<!-- 步骤进度条 -->
			<el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>

			<!-- tab栏 -->
			<el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" label-position="top">
				<el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeLeave" @tab-click="tabclicked">
					<el-tab-pane label="基本信息" name='0'>
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
							<el-input v-model="addForm.goods_price" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="addForm.goods_weight" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
							<el-input v-model="addForm.goods_number" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
							<el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateprops" clearable @change="handleChange"></el-cascader>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name='1'>
						<el-form-item :label="item.attr_name" prop="" v-for="(item ,index) in manyTablebarData" :key="item.attr_id">
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox :label="cb" border v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name='2'>
						<el-form-item :label="item.attr_name" prop="" v-for="item  in onlyTablebarData" :key="item.attr_id">
							<el-input v-model="item.attr_vals"></el-input>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name='3'>
						<!-- action 表示图片上传的地址 -->
						<el-upload :action="UploadUrl" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess"
						 list-type="picture" :headers="headerObj">
							<el-button size="small" type="primary">点击上传</el-button>
							<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
						</el-upload>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name='4'>
						<quill-editor v-model="addForm.goods_introduce"></quill-editor>
						
						<el-button type="primary" class="btn" @click="add"> 添加商品</el-button>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>
		<el-dialog title="图片预览" :visible.sync="previewDialog" width="50%">
			<img :src="previewPath" alt="图片加载显示失败" />
		</el-dialog>





	</div>
</template>

<script>
import _ from 'lodash'
	export default {
		data() {
			return {
				activeIndex: '0',
				addForm: {
					goods_name: '',
					goods_price: 0,
					goods_weight: 0,
					goods_number: 0,
					// 商品所属分类的数组
					goods_cat: [],
					// 图片路径数组
					pics: [],
					goods_introduce:'',
					attrs:[]
				},
				// 校验规则
				addRules: {
					goods_name: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'blur'
					}, ],
					goods_price: [{
						required: true,
						message: '请输入商品价格',
						trigger: 'blur'
					}, ],
					goods_weight: [{
						required: true,
						message: '请输入商品重量',
						trigger: 'blur'
					}, ],
					goods_number: [{
						required: true,
						message: '请输入商品数量',
						trigger: 'blur'
					}, ],
					goods_cat: [{
						required: true,
						message: '请选择商品分类',
						trigger: 'blur'
					}, ]
				},
				// 商品数据列表
				cateList: [],
				// 级联选择器的相关设置
				cateprops: {
					expandTrigger: 'hover',
					value: 'cat_id',
					label: 'cat_name',
					children: 'children',

				},
				// 动态参数 数据列表
				manyTablebarData: [],
				// 静态参数 数据列表
				onlyTablebarData: [],
				// 图片上传的地址
				UploadUrl: 'http://120.79.138.28:8887/api/private/v1/upload',
				// 图片请求头
				headerObj: {
					Authorization: window.sessionStorage.getItem('token')
				},
				previewPath: '',
				previewDialog: false

			}
		},
		created() {
			this.getCateList()
		},
		computed: {
			cateId() {
				if (this.addForm.goods_cat.length === 3) {
					return this.addForm.goods_cat[2]
				} else {
					return null
				}

			}
		},
		methods: {
			// 请求获取商品分类数据列表
			async getCateList() {

				const {
					data: res
				} = await this.$http.get('categories')

				// console.log(res)

				if (res.meta.status !== 200) {
					return this.$message.error("获取商品分类数据列表失败")
				} else {
					// console.log(res.data)
					this.cateList = res.data
				}
			},
			handleChange() {
				if (this.addForm.goods_cat.length !== 3) {
					this.addForm.goods_cat = []
				}
			},
			beforeLeave() {
				if (this.addForm.goods_cat.length !== 3) {
					this.$message.error("请选择分类！")
					return false
				}
			},
			async tabclicked() {
				// 请求动态参数
				// console.log('请求动态参数')
				if (this.activeIndex === '1') {
					const {
						data: res
					} = await this.$http.get(`categories/${this.cateId}/attributes`, {
						params: {
							sel: 'many'
						},
					})

					if (res.meta.status !== 200) {
						return this.$message.error("获取动态数据失败了！！！！")
					}
					// console.log(res.data)

					res.data.forEach(item => {
						// item.attr_vals =item.attr_vals.split(' ')
						item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')

					})
					this.manyTablebarData = res.data

				} else if (this.activeIndex === '2') {
					// 请求静态参数
					const {
						data: res
					} = await this.$http.get(`categories/${this.cateId}/attributes`, {
						params: {
							sel: 'only'
						},
					})

					if (res.meta.status !== 200) {
						return this.$message.error("获取静态数据失败了！！！！")
					}
					// console.log(res.data)
					this.onlyTablebarData = res.data
				}


			},
			// 图片移除处理事件
			handleRemove(file) {
				// 获取要删除的图片临时路径
				const filePath = file.response.data.tem_path
				// 从pics数组中找到这个路径的索引值
				const i = this.addForm.pics.findIndex(x => x.pics === filePath)

				// 调用splice移除
				this.addForm.pics.splice(i, 1)

			},
			// 图片预览
			handlePreview(file) {

				console.log(file);

				this.previewPath = file.response.data.url
				this.previewDialog = true
				console.log(this.previewPath );



			},
			// 图片上传成功后的处理
			handleSuccess(response) {
				console.log(response);

				const picfo = {
					pic: response.data.tmp_path
				}

				this.addForm.pics.push(picfo)
				console.log(this.addForm);
			},
			add(){
				// console.log(this.addForm)
				this.$refs.addFormRef.validate(async vaild=>{
					if(!vaild){
						return this.$message.error("请填写必要表单项")
					}
				// 执行添加业务逻辑
					
				// 对表单进行 深拷贝	
				const form = _.cloneDeep(this.addForm)
				form.goods_cat=form.goods_cat.join(',')
				
				
				// 处理动态参数
				
				this.manyTablebarData.forEach(item=>{
					const newInfo={
						attr_id:item.attr_id,
						attr_values:item.attr_vals.join(' ')
					}
					this.addForm.attrs.push(newInfo)
				})
				
				
				// 处理静态属性
				this.onlyTablebarData.forEach(item=>{
					const newInfo={
						attr_id:item.attr_id,
						attr_values:item.attr_vals
					}
					this.addForm.attrs.push(newInfo)
				})
				
				form.attrs=this.addForm.attrs
				
				console.log(form)
				
				// 发起请求添加商品
				
				const {data:res} = await this.$http.post('goods',form)
				if (res.meta.status !== 201) {
					return this.$message.error(res.meta.msg)
				} else {
					this.$message.success("添加商品成功！")
					
					this.$router.push('/goods')
				}
					
				})	
			},
			
			
			


		}


	}
</script>

<style>
	.el-steps {
		margin: 15px 0px;
	}

	.el-checkbox {
		margin: 0 10px 0px 0px !important;
	}

	img {
		width: 100%;
	}
	.btn{
		margin-top: 15px !important;
	}
</style>
