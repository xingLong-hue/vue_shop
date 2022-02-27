<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
	
		<el-card>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear="getGoodsList" >
						<el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addGoods">添加商品</el-button>
				</el-col>
			</el-row>
			<!-- 列表内容区 -->
			<el-table :data="goodsList" border>
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="goods_name" label="商品名称"></el-table-column>
				<el-table-column prop="goods_price" label="商品价格(元)" width="110px"></el-table-column>
				<el-table-column prop="goods_weight" label="商品重量(kg)" width="110px"></el-table-column>
				<el-table-column prop="add_time" label="创建时间" width="170px">
					<template slot-scope="scope">
						{{ scope.row.add_time | dateFormat }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini"  @click="remove(scope.row.goods_id)"></el-button>
						<!-- <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
							<el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
						</el-tooltip> -->
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
			 :page-sizes="[5, 15, 20, 25]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total">
			
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				// 商品列表
				goodsList:[],
				// 查询的请求参数
				queryInfo: {
					query: '',
					pagenum: 1, //当前的页码
					pagesize: 8 //每页显示的条数
				},
				// 数据总条数
				total:0,
				
			}
		},
		created(){
			this.getGoodsList()
		},
		methods:{
			// 获取数据
			async getGoodsList(){
				const {
					data: res
				} = await this.$http.get('goods', {
					params: this.queryInfo
				})
				
				// console.log(res)
				
				if (res.meta.status !== 200) {
					return this.$message.error(res.meta.msg)
				} else {
					// this.$message.success("获取成功")
					this.goodsList = res.data.goods
					this.total = res.data.total
					console.log(this.goodsList )
				}
			},
			// 监听pagesize  每页显示的条数的改变
			handleSizeChange(newSizes) {
			
				//给原来变量重新赋值
				this.queryInfo.pagesize = newSizes
				//每改变一次重新请求获取新的数据渲染
				this.getGoodsList()
			},
			// 监听当前页码值的改变  
			handleCurrentChange(newPages) {
				this.queryInfo.pagenum = newPages
				this.getGoodsList()
			},
			// 根据id删除商品数据
			async remove(id){
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
				
				const {data:res} = await this.$http.delete('goods/'+id)
				
				if (res.meta.status !== 200) {
					return this.$message.error("删除失败")
				}
				
				this.$message.success('删除成功！')
				
				// 重新渲染显示界面列表
				this.getGoodsList()
			},
			addGoods(){
				this.$router.push('/goods/addGoods')
			}
			
		}
	}
</script>

<style>
</style>
