const api = require('./src/api')

module.exports = {
  devServer: {
    before: api
  },
  runtimeCompiler: true
}
