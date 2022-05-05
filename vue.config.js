const path = require('path')
const { name } = require('./package.json')

const isProd = process.env.NODE_ENV === 'production'
const isAnalyze = process.env.ANALYZE

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 基本路径
  publicPath: `/${name}/`,
  // 输出文件目录
  outputDir: name,
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // webpack配置
  chainWebpack: (config) => {
    if (isProd) {
      config.optimization
        .minimize(true) // js文件最小化处理
        .splitChunks({ chunks: 'all' }) // 分割代码
    }

    if (isAnalyze) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }

    // 移除 prefetch 插件
    config.plugins.delete('prefetch')

    config.resolve.alias.set('@', resolve('src'))

    config.devtool('source-map')
  },
  configureWebpack: (config) => {
    // 正式生产环境去掉 console，测试生产环境保留 console
    if (isProd && process.env.VUE_APP_ENV_TYPE === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
    }
  },
  // vue-loader 配置项
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: isProd,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        /**
         * 注意：在 sass-loader v8 中，这个选项名是 "prependData"
         */
        prependData: `
          @import "~@/styles/mixin.scss";
         `,
      },
    },
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true,
  },
  parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8900,
    https: false,
    hotOnly: false,
    disableHostCheck: true, // 关闭host check  方便ngrok等内网穿透工具
    proxy: {
      '/web-infra-marketing': {
        // 根所实际接口环境进行配置
        target: 'http://10.210.10.55:25018/',
        // target: 'http://10.210.12.171:25018/',
        // target: 'http://test-invite.kfang.com',
        changeOrigin: true,
      },
    },
  },
}
