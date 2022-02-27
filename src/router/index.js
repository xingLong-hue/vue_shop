import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import home from '../components/home'
import index from '../components/index'
import users from '../components/users/users.vue'

import powerList from '../components/powers/powerList.vue'
import rolesList from '../components/powers/rolesList.vue'

import categories from '../components/goods/categories.vue'
import goodsList from '../components/goods/goodsList.vue'
import params from '../components/goods/params.vue'

import order from '../components/order/order.vue'
import addGoods from '../components/goods/addGoods.vue'

import reports from '../components/reports/reports.vue'


// 路由懒加载
// const Login = () => import(/* webpackChunkName: "Login_home_index" */ '../components/Login.vue')
// const home = () => import(/* webpackChunkName: "Login_home_index" */ '../components/home.vue')
// const index = () => import(/* webpackChunkName: "Login_home_index" */ '../components/index.vue')

// const users = () => import(/* webpackChunkName: "index" */ '../components/users/users.vue')

// const powerList = () => import(/* webpackChunkName: "index" */ '../components/powers/powerList.vue')
// const rolesList = () => import(/* webpackChunkName: "index" */ '../components/powers/rolesList.vue')

// const categories = () => import(/* webpackChunkName: "index" */ '../components/goods/categories.vue')
// const goodsList = () => import(/* webpackChunkName: "index" */ '../components/goods/goodsList.vue')
// const params = () => import(/* webpackChunkName: "index" */ '../components/goods/params.vue')

// const order = () => import(/* webpackChunkName: "index" */ '../components/order/order.vue')
// const addGoods = () => import(/* webpackChunkName: "index" */ '../components/goods/addGoods.vue')

// const reports = () => import(/* webpackChunkName: "index" */ '../components/reports/reports.vue')

Vue.use(VueRouter)
const routes = [
	{
		path:'/',
		redirect:'/login'
	},
	{
		path: '/login',//指定网址
	    component: Login,//指定文件路径
	},
	{
		path: '/home',//指定网址
	    component: home,//指定文件路径
		//重定向
		redirect:'/index',
		children:[
			{path:'/index',component:index},
			{path:'/users',component:users},
			{path:'/rights',component:powerList},
			{path:'/roles',component:rolesList},
			{path:'/categories',component:categories},
			{path:'/goods',component:goodsList},
			{path:'/params',component:params},
			{path:'/orders',component:order},
			{path:'/reports',component:reports},
			{path:'/goods/addGoods',component:addGoods},
		]
	}
	
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
	// to将要访问的路径
	// from代表从哪个路径跳转而来
	// next是一个函数，表示放行
	//next()直接放行          next( ' /login ')强制跳转
	
	if (to.path === '/login') return next();
	
	//获取token值
	const tokenStr = window.sessionStorage.getItem( 'token');
	if (!tokenStr) return next('/login');    //token为空 直接强制跳转回登录页
	//token值不为空直接放行
	next()
	}
)


export default router
