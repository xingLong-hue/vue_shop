<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
		<el-row>
			<el-col :span="9">
				<el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear="getOrderList">
					<el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
				</el-input>
			</el-col>
		</el-row>

		<el-table :data="orderList" border>
			<el-table-column type="index" label="#"></el-table-column>
			<el-table-column prop="order_number" label="订单编号"></el-table-column>
			<el-table-column prop="order_price" label="订单价格 "></el-table-column>
			<el-table-column prop="pay_status" label="是否付款">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
					<el-tag type="danger" v-else>未付款</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="is_send" label="是否发货"></el-table-column>
			<el-table-column prop="create_time" label="下单时间" width="180">
				<template slot-scope="scope">
					{{scope.row.create_time | dateFormat}}
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="address"></el-button>
					<el-button type="success" icon="el-icon-location" size="mini" @click="showProgress"></el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页区域 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
		 :page-sizes="[2, 6, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">

		</el-pagination>
		</el-card>

		<!-- 修改地址对话框 -->
		<el-dialog title="修改地址" :visible.sync="DialogVisible" width="30%" @close="Dilogclose">
			<!-- 表单主体内容 -->
			<el-form :model="addressForm" ref="addressFormRef" :rules="addressFormRules" label-width="100px">
				<el-form-item label="省市区/县" prop="address1">
					<el-cascader v-model="addressForm.address1" :options="cityDate" expandTrigger='hover'></el-cascader>
				</el-form-item>
				<el-form-item label="详细地址" prop="address2">
					<el-input v-model="addressForm.address2"></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="DialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="DialogVisible = false" >确 定</el-button>
			</span>

		</el-dialog>

		<!-- 物流进度对话框 -->
		<el-dialog title="物流进度" :visible.sync="ProgressDialogVisible" width="30%" @close="Dilogclose">
			<el-timeline>
				<el-timeline-item v-for="(activity, index) in ProgressData" :key="index" :timestamp="activity.time">
					{{activity.context}}
				</el-timeline-item>
			</el-timeline>
			<span slot="footer" class="dialog-footer">
				<el-button @click="ProgressDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="ProgressDialogVisible = false">确 定</el-button>
			</span>

		</el-dialog>

	</div>
</template>

<script>
	import cityDate from './citydata.js'
	export default {
		data() {
			return {
				orderList: [],
				// 请求参数
				queryInfo: {
					query: '',
					pagenum: 1, //当前的页码
					pagesize: 6 //每页显示的条数
				},
				total: 0,
				DialogVisible: false,
				addressForm: {
					address1: '',
					address2:''
				},
				addressFormRules: {
					address1: [{
						required: true,
						message: '请选择省市区/县',
						trigger: 'blur'
					}],
					address2: [{
						required: true,
						message: '请输入详细地址',
						trigger: 'blur'
					}]
				},
				cityDate: cityDate,
				ProgressDialogVisible: false,
				ProgressData: []

			}
		},
		created() {
			this.getOrderList()
		},
		methods: {
			async getOrderList() {
				const {
					data: res
				} = await this.$http.get('orders', {
					params: this.queryInfo
				})

				// console.log(res)

				if (res.meta.status !== 200) {
					return this.$message.error("获取订单列表失败！")
				} else {
					this.orderList = res.data.goods
					this.total = res.data.total
				}
			},
			// 监听pagesize  每页显示的条数的改变
			handleSizeChange(newSizes) {

				//给原来变量重新赋值
				this.queryInfo.pagesize = newSizes
				//每改变一次重新请求获取新的数据渲染
				this.getOrderList()
			},
			// 监听当前页码值的改变  
			handleCurrentChange(newPages) {
				this.queryInfo.pagenum = newPages
				this.getOrderList()
			},
			address() {
				this.DialogVisible = true
			},
			Dilogclose() {
				this.$refs.addressFormRef.resetFields()
			},
			async showProgress() {
				const {
					data: res
				} = await this.$http.get('kuaidi/1106975712662')
				if (res.meta.status !== 200) {
					return this.$message.error("获取物流信息失败！")
				}
				this.ProgressData = res.data
				console.log(this.ProgressData)
				this.ProgressDialogVisible = true
			}
		}
	}
</script>

<style>
</style>
