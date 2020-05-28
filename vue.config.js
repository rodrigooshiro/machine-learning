module.exports = {
  publicPath: '/machine-learning/',
  runtimeCompiler: true
}

if (process.env.NODE_ENV === 'development') {
  module.exports.devServer = {
    before: require('./src/api'),
    port: 8000
  }
}

