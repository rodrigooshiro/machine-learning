module.exports = {
  publicPath: '/machine-learning/',
  runtimeCompiler: true
}

if (process.env.NODE_ENV === 'development') {
  const api = require('./src/api')
  module.exports.devServer = {
    before: api,
    port: 8000
  }
}

