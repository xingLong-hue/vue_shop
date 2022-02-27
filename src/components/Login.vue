<template>
	<div class="login_container"> 
	
	   <div class="login_box">
		   <div class="head_photo">
			   <img class="head_photo_img"   src="../assets/1.jpeg" alt="">
		   </div>
		   <!-- 表单 -->
		   <el-form class="loginform" ref="loginform_ref" :model="login_form" :rules="loginform_rules">
			 <el-form-item prop="username">
			   <el-input placeholder="请输入登录账号" prefix-icon="iconfont icon-user" v-model="login_form.username" ></el-input>
			 </el-form-item>
			 <el-form-item prop="password">
			   <el-input type="password" placeholder="请输入密码" prefix-icon="iconfont icon-3702mima" v-model="login_form.password"></el-input>
			 </el-form-item>
			 <el-form-item class="btns" >
			   <el-button type="primary" @click="login_btn">登录</el-button>
			   <el-button type="info" @click="reset_btn" >重置</el-button>
			 </el-form-item>
			 
			 
			</el-form>
	   </div>
	
	</div>
</template>

<script>
	export default{
		data(){
			return{
				//表单对象
				login_form:{
					username:'admin',
					password:'123456'
				},
				//表单验证对象
				loginform_rules:{
					username:[
						{ required: true, message: '请输入登录账号', trigger: 'blur' },
					    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
					],
					password:[
						 { required: true, message: '请输入密码', trigger: 'blur' },
						 { min: 3, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
					]
				}
			}
		},
		methods:{
			reset_btn(){
				// console.log(this)
				//resetFields()是表单的重置方法
				this.$refs.loginform_ref.resetFields();
			},
			login_btn(){
				
				//	validate()是对整个表单进行校验的方法，参数为一个回调函数
				this.$refs.loginform_ref.validate(async(valid)=>{
					//
					//检验是否通过验证，通过则跳转到index首页   结果会返回一个boolz值
					//true表示验证通过
					// console.log(valid)
					
					if(!valid) {
						return;
					}else{
						  //返回对象是promise   用await async 处理 直接得到服务器返回的数据
						// const result= $http.post("login",this.login_form);
						 // console.log(this)
						 
						// const {data:result} = await this.$http.post("http://127.0.0.1:8888/api/private/v1/login",this.login_form);
						const {data:result} = await this.$http.post("login",this.login_form);
					    // console.log(result)
						if(result.meta.status==200){
							// console.log("登录成功！！！！！！！！")
							this.$message.success('登录成功！');
							
							// 1．将登录成功之后的 token，保存到客户端的sessionstorage中
							// 1.1项目中出了登录之外的其他API接口，必须在登录之后才能访问
							
							//1.2 token 只应在当前网站打开期间生效，所以将 token保存在sessionStorage
							
							window.sessionStorage.setItem("token", result.data.token);
							//编程时导航 跳转到/home
							this.$router.push( "/home");
							
						}else{
							// console.log("登录失败！！！！！！！！")
							this.$message.error('账号或密码错误，请重新输入登录！');
						}
					
					}
	
				})
				
			}
		}
	}
	
</script>

<style>
	.login_container{
		height: 100%;
		/* background-color: lightseagreen; */
		background: url(../assets/1.jpg) no-repeat;
		background-size: 100% 99%;
	}
	.login_box{
		background-color: white;
		width: 450px;
		height: 300px;
		position: absolute;
		border-radius: 25px;
		left: 65%;
		top: 45%;
		transform: translate(-50%,-50%);	
	}
	.head_photo{
		width: 130px;
		height: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		padding: 10px;
		box-shadow: 0 0 10px #ddd;
		background-color: #FFFFFF;
		margin: auto;
		margin-top: -80px;
	}
	.head_photo_img{
		width: 100%;
		height: 100%;
		border: 1px solid #eee;
		border-radius: 50%;
		background-color: lightgrey;
	}
	.loginform{
		padding: 30px;
	}
	.btns{
		display: flex;
		justify-content: flex-end;
	}
</style>
