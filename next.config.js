// next.config.js

const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
// module.exports = withSass({
//   cssModules: true
// })
module.exports = {
  distDir: '../dist'
}

// next.config.js
module.exports = withCSS(withSass({
  webpack (config, options) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    })
    config['node'] = {
      fs: "empty"
   }
    return config
  }
}))
