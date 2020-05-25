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
global.window = self
self.importScripts('tf.min.js')

self.onEpochEnd = async function(epoch, logs) {
  self.postMessage(['onEpochEnd', epoch, logs])
}

self.builder = async function(data) {
  let model = tf.sequential()
  for (let i = 0; i < data.layerSize; i++) {
    let layer = {}
    if (i === 0) {
      if (data.inputShape.length === 1) {
        layer.inputShape = data.inputShape[0]
      } else {
        layer.inputShape = data.inputShape
      }
    }
    if (data.units[i] !== 0) {
      layer.units = data.units[i]
    }
    if (data.kernelSize[i] !== 0) {
      layer.kernelSize = data.kernelSize[i]
    }
    if (data.filters[i] !== -1) {
      layer.filters = data.filters[i]
    }
    if (data.strides[i].length === 1) {
      layer.strides = data.strides[i][0]
    }
    if (data.strides[i].length > 1) {
      layer.strides = data.strides[i]
    }
    if (data.poolSize[i].length === 1) {
      layer.poolSize = data.poolSize[i][0]
    }
    if (data.poolSize[i].length > 1) {
      layer.poolSize = data.poolSize[i]
    }
    if (data.activation[i] !== '--') {
      layer.activation = data.activation[i]
    }
    if (data.kernelInitializer[i] !== '--') {
      layer.kernelInitializer = data.kernelInitializer[i]
    }
    if (data.biasInitializer[i] !== '--') {
      layer.useBias = true
      layer.biasInitializer = data.biasInitializer[i]
    }
    model.add(tf.layers[data.layerName[i]](layer))
  }

  await model.save('indexeddb://model')
  self.postMessage(['onEnd'])
}

self.compiler = async function(data, inputTensorJSON, outputTensorJSON) {
  let model = await self.tf.loadLayersModel('indexeddb://model')
  let inputTensor = self.tf.tensor(inputTensorJSON.data, inputTensorJSON.shape)
  let outputTensor = self.tf.tensor(outputTensorJSON.data, outputTensorJSON.shape)

  let loss = data.compilerLossSelected
  if (loss in self.tf.losses) {
    loss = self.tf.losses[loss]
  }

  model.compile({
    optimizer: data.compilerOptimizerSelected,
    loss: loss,
    metrics: ['mse']
  })

  let train = await model.fit(inputTensor, outputTensor, {
    batchSize: data.batchSize,
    epochs: data.epochSize,
    shuffle: data.shuffle,
    validationSplit: data.validationSplit,
    callbacks: {
      onEpochEnd: self.onEpochEnd
    }
  })

  await model.save('indexeddb://model')
  self.postMessage(['onEnd', train])
}

self.addEventListener('message', function(event) {
  if (event.data[0] === 'builder') {
    self.builder(event.data[1])
  }
  if (event.data[0] === 'compiler') {
    self.compiler(event.data[1], event.data[2], event.data[3])
  }
})
