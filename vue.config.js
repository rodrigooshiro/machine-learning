const api = require('./src/api')

module.exports = {
  devServer: {
    before: api
  },
  outputDir: 'docs',
  publicPath: '/machine-learning/',
  runtimeCompiler: true
}
