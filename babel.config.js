// 这是产品发布阶段的 需要用到的 babel 组件  作用是移走全部的console
const prodPlugins=[]
if(process.env.NODE_ENV === 'production'){
	prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
	// 发布产品用到的插件数组
	...prodPlugins,
	// '@babel/plugin-syntax-dynamic-import'
		
  ]
}
