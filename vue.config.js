const api = require('./src/api')

module.exports = {
  devServer: {
    before: api,
    port: 8000
  },
  outputDir: 'build',
  publicPath: '/machine-learning/',
  runtimeCompiler: true
}
