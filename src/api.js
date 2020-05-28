/**
 * @license
 * Copyright 2020 Rodrigo Oshiro. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const multer = require('multer')
const express = require('express')
const tf = require('@tensorflow/tfjs-node')
const fileUrl = require('file-url')
const WebSocket = require('ws')
const definitions = require('./config/definitions')
const router = express.Router()
const wss = new WebSocket.Server({ maxPayload: -1, port: 8001 })
const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'model')
    },
    filename: function(req, file, cb) {
      // to avoid buffer overflow, data can be exchanged with files
      // let data = [1,2,3,4,5,6,7,8,9,10]
      // let model = tf.sequential()
      // model.add(tf.layers.dense({units: 1, inputShape: data.length}))
      // tensor = f.tensor(data).reshape([data.length, 1])
      // SAVE: model.layers[0].setWeights([tensor, model.layers[0].getWeights()[1]])
      // LOAD: model.layers[0].getWeights()[0].dataSync()
      cb(null, file.fieldname)
    }
  })
})

router.all('/', function(req, res, next) {
  res.send('OK')
})

router.post('/model', upload.any(), async function(req, res) {
  res.send('OK')
})

router.get('/model/:file', function(req, res, next) {
  res.sendFile(req.params.file, { root: './model' })
})

const self = {
  builder: async function(ws, data) {
    let output = await definitions.tasks.builder(tf, data)
    await output.model.save(fileUrl('model'))
    ws.send(JSON.stringify({ data: ['onEnd'] }))
  },
  compiler: async function(ws, data, inputTensorJSON, outputTensorJSON) {
    ws.onEpochEnd = async function(epoch, logs) {
      ws.send(JSON.stringify({ data: ['onEpochEnd', epoch, logs] }))
    }
    let model = await tf.loadLayersModel(fileUrl('model/model.json'))
    let output = await definitions.tasks.compiler(
      global,
      tf,
      model,
      data,
      inputTensorJSON,
      outputTensorJSON,
      {
        onEpochEnd: ws.onEpochEnd
      }
    )
    await output.model.save(fileUrl('model'))
    ws.send(JSON.stringify({ data: ['onEnd', output.train] }))
  },
  predictor: async function(ws, data, inputTensorJSON, normalizationData) {
    let model = await tf.loadLayersModel(fileUrl('model/model.json'))
    let output = await definitions.tasks.predictor(
      global,
      tf,
      model,
      data,
      inputTensorJSON,
      normalizationData
    )
    ws.send(JSON.stringify({ data: ['onEnd', output.predictTensorJSON] }))
  }
}

wss.on('connection', ws => {
  ws.on('message', message => {
    let event = JSON.parse(message)
    if (event.data[0] === 'builder') {
      self.builder(ws, event.data[1])
    }
    if (event.data[0] === 'compiler') {
      self.compiler(ws, event.data[1], event.data[2], event.data[3])
    }
    if (event.data[0] === 'predictor') {
      self.predictor(ws, event.data[1], event.data[2], event.data[3])
    }
  })
  ws.on('error', err => {
    ws.send(JSON.stringify({ data: ['onEnd'], error: err.message }))
    console.error(err.message)
  })
})

module.exports = function(app) {
  if (app) {
    app.use('/machine-learning/api', router)
  } else if (process.env.VUE_APP_BACKEND_DISABLED === undefined) {
    app = express()
    app.use('/machine-learning/api', router)
    app.listen(8000, () =>
      console.log('Express app listening at http://localhost:8080/machine-learning/api/')
    )
  }
}
