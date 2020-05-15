const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(proxy('/api', {
    pathRewrite: {
      '^/api': ''
    },
    target: 'http://api.test.i2mago.com:8097',
    changeOrigin: true,
    onProxyRes: function(proxyRes, req, res) {
      const cookies = proxyRes.headers['set-cookie']
      // 返回的cookie中提取domain
      const cookieRegex = /Domain=\.?i2mago.com/i
      // const cookieRegex = /domain=\localhost/i
      //修改cookie Path
      if (cookies) {
        const newCookie = cookies.map(function(cookie) {
          if (cookieRegex.test(cookie)) {
            // 将domain设置为localhost
            return cookie.replace(cookieRegex, 'Domain=localhost')
          }
          return cookie
        })
        delete proxyRes.headers['set-cookie']
        proxyRes.headers['set-cookie'] = newCookie
      }
    }
  }))
}
