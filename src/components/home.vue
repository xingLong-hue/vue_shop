<template>
	<!-- <div>
		<h1>首页</h1>
		 <el-button type="primary" @click="logout">退出</el-button>
	</div> -->
	
	<el-container class="container_box">
	  <el-header class="container_header">
		  <div class="container_header_left">
			  <img src="../assets/3.jpg" class="logo" alt="logo">
			  <span >电商后台管理系统</span>
		  </div>

		<el-button type="init" @click="logout">退出</el-button>

	  </el-header>
	  <el-container class="container_body">
	    <el-aside :width="isCollaspe ? '64px':'200px'" class="body_aside">
			
			<div class="togglebtn" @click="toggle_collspe">|||</div>
			
			<!-- 菜单局域 -->
			<el-menu :default-active="activePath" background-color="#282C35" text-color="#fff" :collapse="isCollaspe" :collapse-transition="false" router>
				<!-- 一级菜单 -->
			      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
			        <template slot="title">
			          <i :class="iconobj[item.id]"></i>
			          <span>{{item.authName}}</span>
			        </template>
					<!-- 二级菜单 -->
					<el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavstatus('/'+subitem.path)">	
						  <template slot="title">
						    <i class="el-icon-menu"></i>
						    <span>{{subitem.authName}}</span>
						  </template>
					</el-menu-item>
			      
				  </el-submenu>
			     
			    </el-menu>
		</el-aside>
	    <el-main class="body_main">
			<!-- 路由占位符 -->
			<router-view></router-view>
		
		</el-main>
	  </el-container>
	</el-container>
	
</template>

<script>
	export default{
		data(){
			return{
				menuList:[],
				iconobj:{
					'125':'iconfont icon-user',
					'103':'iconfont icon-tijikongjian',
					'101':'iconfont icon-shangpin',
					'102':'iconfont icon-danju',
					'145':'iconfont icon-baobiao'
				},
				isCollaspe:false,
				activePath:''
			}
		},
		created(){
			this.getMenuList()
			this.activePath=window.sessionStorage.getItem("activePath")
		},
		methods:{
			logout(){
				// console.log("退出");
				// alert("退出")
				window.sessionStorage.clear();
				this.$router.push("/login");	
			},
			async getMenuList(){
			const {data:res} = await this.$http('menus')
			
				// console.log(res)
				
				if(res.meta.status!==200) {
					return this.$message.error(res.meta.msg)
				}else{
					this.menuList=res.data
				}	
			},
			toggle_collspe(){
				this.isCollaspe=!this.isCollaspe
			},
			// 保存激活的连接
			saveNavstatus(activePath){
				window.sessionStorage.setItem("activePath",activePath)
				this.activePath=activePath
			}
				
		}
	}
	
</script>

<style>
	.container_box{
		/* background-color: #0086B3; */
		height: 100%;
	}
	.container_header{
		background-color: #282C35;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 25px;
		color: #fff;
	}
	.body_aside{
		background-color: #282C35;
	}
	.body_main{
		/* background-color: #795DA3; */
	}
	.logo{
		width: 100px;
		height: 40px;
		/* margin-top: 8px; */
	}
	.container_header_left {
		display: flex;
		align-items: center;
	}
	.container_header_left span{
		margin-left: 15px;
	}
	.el-menu,.el-menu--collapse{
		border-right: none;
	}
	.iconfont{
		margin-right: 10px;
	}
	.togglebtn{
		background-color: #666666;
		height: 30px;
		line-height: 30px;
		text-align: center;
		font-size: 10px;
		color: #fff;
		letter-spacing: 0.3em;
		cursor: pointer;
	}
	
</style>
