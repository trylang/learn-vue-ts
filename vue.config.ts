const baseUrl = '/';

module.exports = {
  devServer: {
    publicPath: baseUrl, // 和 baseUrl 保持一致
    proxy: {
      // 在这里配置如下代码
      '/api': {
        // target: 'http://wx-mini.rtmap.com/', // 你请求的第三方接口
        target: 'http://10.10.11.243:8704/wxapp-bill-integral/b/bill/', // 你请求的第三方接口
        // target: 'http://localhost:3000/bi/', // 你请求的第三方接口
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        // ws: true,
        secure: false,
        pathRewrite: {
          // 路径重写，
          '^/api': '/' // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可。
        }
      }
    }
  },
}