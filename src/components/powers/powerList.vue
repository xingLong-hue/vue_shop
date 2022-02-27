<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-table :data="powerlist" border>
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="authName" label="权限名称"></el-table-column>
				<el-table-column prop="path" label="路径"></el-table-column>
				<el-table-column prop="level" label="权限等级">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.level==='0'">一级</el-tag>
						<el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
						<el-tag type="warning" v-else>三级</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>

</template>

<script>
	export default{
		data(){
			return {
				// 权限列表
				powerlist:[]
			}
		},
		created(){
			this.getPowerlist()
		},
		methods:{
			async getPowerlist(){
				// 获取权限列表
				const {data:res}=await this.$http.get('rights/list')
				this.powerlist=res.data
				console.log(this.powerlist)
			}
		}
	}
</script>

<style>
</style>
