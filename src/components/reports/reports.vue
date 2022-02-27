<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据统计</el-breadcrumb-item>
			<el-breadcrumb-item>数据列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<!-- 为 ECharts 准备一个定义了宽高的 DOM -->
			<div id="main" style="width: 850px;height:450px;"></div>
		</el-card>
	</div>
</template>

<script>
	// 导入echarts 插件
	import * as echarts from 'echarts';
	import _ from 'lodash'
	export default {
		data() {
			return {

				options: {
					title: {
						text: '用户来源'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#E9EEF3'
							}
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						boundaryGap: false
					}],
					yAxis: [{
						type: 'value'
					}]
				}

			}
		},
		created() {

		},
		// 此时页面的元素已经渲染完毕了
		 async mounted() {
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'))
			// 指定图表的配置项和数据

			const {data:res} = await this.$http.get('reports/type/1')
			if (res.meta.status !== 200) {
				return this.$message.error("获取数据表失败！")
			} 
			
			// const result = res.data
			const result = _.merge(res.data,this.options)
			// console.log(res.data)
			// console.log(result)
			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(result);
		},
		methods: {


		}
	}
</script>

<style>
</style>
