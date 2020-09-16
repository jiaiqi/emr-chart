module.exports = {
	// publicPath: process.env.NODE_ENV === 'production'
	//   ? '/chart/'
	//   : '/',
	// 基本路径
	// baseUrl: "../../../MS/front",

	// build 输出文件目录
	// outputDir: './dist/',
	outputDir: "../build/chart",

	// 主目录
	publicPath: '/chart/'
	// configureWebpack: (config)=>{
	//   if(process.env.NODE_ENV === 'production'){
	//     // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
	//   }
	// },
}
