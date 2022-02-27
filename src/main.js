import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
//导入全局样式图标
import './assets/fonts/iconfont.css'
// //导入axios
import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑器对应的样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入Nprofress 对应的Js和css  (进度条)
import Nprogress from 'nprogress'
// import 'nprogress/nprogress.css'





//挂载到vue实例对象
Vue.prototype.$http=axios

//通过axios请求拦截器添加token,保证拥有获取数据的权限。// axios请求拦截
// 在请求拦截器中  显示进度条 NProgress.start()
axios.interceptors.request.use (config => {
	Nprogress.start()
	//为请求头对象,添加Token验证的Authorization字段
	// console.log(config)
	config.headers.Authorization = window.sessionStorage.getItem ('token')
	return config
})
// 在响应拦截器中  显示进度条 NProgress.start()
axios.interceptors.response.use (config => {
	Nprogress.done()
	return config
})


//配置请求的根路径
// axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"

axios.defaults.baseURL="http://120.79.138.28:8887/api/private/v1/"

Vue.config.productionTip = false

// 注册为全局可用组件
Vue.component('tree-table',TreeTable)

// 将富文本注册为全局可用的组件
Vue.use(VueQuillEditor)


// 格式化时间

Vue.filter('dateFormat',function(originVal){
	// 时间对象
	const dt = new Date(originVal)
	// 年
	const y = dt.getFullYear()
	// 月
	const m = (dt.getMonth()+1+'').padStart(2,'0')
	// 日
	const d = (dt.getDate()+'').padStart(2,'0')
	
	const hh = (dt.getHours()+'').padStart(2,'0')
	const mm = (dt.getMinutes()+'').padStart(2,'0')
	const ss = (dt.getSeconds()+'').padStart(2,'0')
	
	// 将格式化好的时间拼接
	
	return 	`${y}-${m}-${d}-${hh}:${mm}:${ss}`
	
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
