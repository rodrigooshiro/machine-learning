const api = require('./src/api')

module.exports = {
  devServer: {
    before: api
  },
  outputDir: 'build',
  publicPath: '/machine-learning/',
  runtimeCompiler: true
}
