const express = require('express')
const router = express.Router()

router.all('/', function (req, res, next) {
  res.send('OK')
})

module.exports = function (app) {
  if (app) {
    app.use('/api', router)
  } else if (process.env.VUE_APP_BACKEND_DISABLED === undefined) {
    app = express()
    app.use('/api', router)
    app.listen(8080, () => console.log('Express app listening at http://localhost:8080/api/'))
  }
}
