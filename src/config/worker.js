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
if (typeof window === 'undefined') {
  window = self
}
self.importScripts('tf.min.js')
self.importScripts('utilities.js')

self.onEpochEnd = async function(epoch, logs) {
  self.postMessage(['onEpochEnd', epoch, logs])
}

self.builder = async function(data) {
  let output = await utilities.tasks.builder(tf, data)
  if (output instanceof Error) {
    self.postMessage(['onError', output.message])
  } else {
    await output.model.save('indexeddb://model')
  }
  self.postMessage(['onEnd'])
  tf.disposeVariables()
}

self.compiler = async function(data, inputTensorJSON, outputTensorJSON) {
  let model = await tf.loadLayersModel('indexeddb://model')
  let output = await utilities.tasks.compiler(tf, model, data, inputTensorJSON, outputTensorJSON, {
    onEpochEnd: self.onEpochEnd
  })
  if (output instanceof Error) {
    self.postMessage(['onError', output.message])
  } else {
    await output.model.save('indexeddb://model')
    self.postMessage(['onEnd', output.history])
  }
  tf.disposeVariables()
}

self.predictor = async function(data, inputTensorJSON) {
  let model = await tf.loadLayersModel('indexeddb://model')
  let output = await utilities.tasks.predictor(tf, model, data, inputTensorJSON)
  if (output instanceof Error) {
    self.postMessage(['onError', output.message])
  } else {
    self.postMessage(['onEnd', output.predictTensorJSON])
  }
  tf.disposeVariables()
}

self.compilerActionEvent = async function(data, inputMatrix, outputMatrix, inputShape, outputShape) {
  let normalizationData = {
    inputUnitsNormalize: data.inputUnitsNormalize,
    outputUnitsNormalize: data.outputUnitsNormalize
  }
  inputShape.unshift(inputMatrix.length)
  outputShape.unshift(outputMatrix.length)

  inputTensor = tf.tensor(inputMatrix, inputShape)
  outputTensor = tf.tensor(outputMatrix, outputShape)

  if (normalizationData.inputUnitsNormalize) {
    let { normal, min, max } = utilities.tasks.normalizeTensor(tf, inputTensor)
    inputTensor.dispose()
    inputTensor = normal
    normalizationData.inputMin = min
    normalizationData.inputMax = max
  }
  if (normalizationData.outputUnitsNormalize) {
    let { normal, min, max } = utilities.tasks.normalizeTensor(tf, outputTensor)
    outputTensor.dispose()
    outputTensor = normal
    normalizationData.outputMin = min
    normalizationData.outputMax = max
  }

  let inputTensorData = await inputTensor.data()
  let inputTensorJSON = {
    data: {
      type: inputTensorData.constructor.toString().replace(/.* (.*)\(\)(.|\n)*/g, '$1'),
      data: Object.values(inputTensorData)
    },
    shape: inputTensor.shape
  }
  let outputTensorData = await outputTensor.data()
  let outputTensorJSON = {
    data: {
      type: outputTensorData.constructor.toString().replace(/.* (.*)\(\)(.|\n)*/g, '$1'),
      data: Object.values(outputTensorData)
    },
    shape: outputTensor.shape
  }
  self.postMessage(['compilerActionEvent', normalizationData, inputTensorJSON, outputTensorJSON])
  inputTensor.dispose()
  outputTensor.dispose()
}

self.predictorActionEvent = async function(data, inputMatrix, inputShape, normalizationData) {
  inputShape.unshift(inputMatrix.length)
  let inputTensor = tf.tensor(inputMatrix, inputShape)
  if (normalizationData.inputMin && normalizationData.inputMax) {
    let { normal } = utilities.tasks.normalizeTensor(
      tf,
      inputTensor,
      normalizationData.inputMin,
      normalizationData.inputMax
    )
    inputTensor.dispose()
    inputTensor = normal
  }

  let inputTensorData = await inputTensor.data()
  let inputTensorJSON = {
    data: {
      type: inputTensorData.constructor.toString().replace(/.* (.*)\(\)(.|\n)*/g, '$1'),
      data: Object.values(inputTensorData)
    },
    shape: inputTensor.shape
  }
  self.postMessage(['predictorActionEvent', inputTensorJSON])
  inputTensor.dispose()
}

self.addEventListener('message', function(event) {
  if (event.data[0] == 'compilerActionEvent') {
    self.compilerActionEvent(event.data[1], event.data[2], event.data[3], event.data[4], event.data[5])
  }
  if (event.data[0] == 'predictorActionEvent') {
    self.predictorActionEvent(event.data[1], event.data[2], event.data[3], event.data[4])
  }
  if (event.data[0] === 'builder') {
    self.builder(event.data[1])
  }
  if (event.data[0] === 'compiler') {
    self.compiler(event.data[1], event.data[2], event.data[3])
  }
  if (event.data[0] === 'predictor') {
    self.predictor(event.data[1], event.data[2], event.data[3])
  }
})
