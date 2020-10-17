// 用来配置需要自己设置的地方   webpack打包的时候会读取这个文件，进行相应的设置
// 没有进过bebal转换，不能使用export default，使用module.exports={}

// 用node.js中的路径解析模块
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 对于写死的，不是import进入的一些资源，页面上img的src是引入的死资源，用copy
// 对不需要webpack处理资源的资源进行处理，比如字体文件等，直接copy
const CopyPlugin = require('copy-webpack-plugin'); 

module.exports = {
    mode: 'production',
    // entry 是入口文件 index.js可以改变
    // entry: './src/index.js', 等同于下面的对象
    // 对象则表示可以有多个入口
    entry: {
        main: './src/index.js',
        // about: './src/about.js' // 不设置output中文件名，打包会默认使用entry中key作为文件名
    },
    // output是出口文件，是一个对象
    output: {
        // path: path.resolve(__dirname, "dist"), // __dirname表示当前目录下 名字是dist
        path: path.resolve(process.cwd(), "dist"), // 在scripts下要改成这种函数计算才能在根目录下
        // entry有多个入口就不能使用这种方式了，改成[name].js  
        // 带hash值的[name].[hash:8].js 8表示截断的长度，使用hash的目的是避免线上更新有缓存
        // 使用chunkHash可以根据每个模块不一样生成不一样的hash值
        filename: "js/[name].[chunkHash:8].js", // 打包后生成的js文件名  前面的js为文件名
        // **为什么不在路径处加文件名？ 会导致index.html也在js文件夹下，是不符合的
    },
    module: { // loader相关配置 
        rules: [
          {
            test: /\.css$/i,
            // 后写的先执行
            // style-loader   MiniCssExtractPlugin.loader,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
            ],
          }, 
          {
              test: /\.less$/i,
              use: [
                MiniCssExtractPlugin.loader,
                'css-loader', 
                'postcss-loader',
                // 'less-loader'
                { // loader的第二种写法：可以写成对象，配置相关的参数options，对象的key必须是loader
                    loader: 'less-loader',
                    options: {

                    }
                }
            ]
          }, 
          {
            test: /\.(png|jpe?g|gif)$/i,
            use: [
                // {
                //     loader: 'file-loader',
                //     options: {
                //         name: 'static/images/[name].[ext]',
                //         // outputPath: 'static/images',
                //         // 最好使用这种根的方式 绝对路径，防止在其他形式下找不到资源
                //         publicPath: '/', // 从根目录开始查找访问,最后访问的是publicPath + name
                //     }
                // },
                {
                    loader: 'url-loader', // 将图片转换成base64格式
                    options: { // 可以是file-loader的任何配置
                        limit: 8192, // 超过这个限制的将被转换成base格式
                        name: 'images/[name].[ext]',
                        publicPath: '/'
                    },
                }
            ],
          },
          { // js文件的处理
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/, // 排除node_modules等中的js文件
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
          }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack',
            template: 'public/index.html' // 模板文件
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkHash:8].css',
        }),
        new CopyPlugin([
            { 
                from: path.resolve(process.cwd(), 'src/static/'), // 使用绝对路径
                to: path.resolve(process.cwd(), 'dist/static/') 
            }
        ]),
    ],
    devServer: {
        // webpack-dev-server的配置
        port: 3000, // 端口号
        open: false, // 自动打开
        proxy: {
            // 代理  可以处理跨域问题
        }
    }
}