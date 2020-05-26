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
 * See the License for the specific language governing permissions and* See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================================================================
 */
/* eslint-disable */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.definitions = global.definitions || {})));
}(this, (function (exports) { 'use strict';
  let definitions = {
    tf: {
      layer: {
        options: [
          'activation',
          'dense',
          'dropout',
          'embedding',
          'flatten',
          'permute',
          'repeatVector',
          'reshape',
          'spatialDropout1d',
          'elu',
          'leakyReLU',
          'prelu',
          'reLU',
          'softmax',
          'thresholdedReLU',
          'conv1d',
          'conv2d',
          'conv2dTranspose',
          'conv3d',
          'cropping2D',
          'depthwiseConv2d',
          'separableConv2d',
          'upSampling2d',
          'averagePooling1d',
          'averagePooling2d',
          'averagePooling3d',
          'globalAveragePooling1d',
          'globalAveragePooling2d',
          'globalMaxPooling1d',
          'globalMaxPooling2d',
          'maxPooling1d',
          'maxPooling2d',
          'maxPooling3d',
          'gru',
          'gruCell',
          'lstm',
          'lstmCell',
          'rnn',
          'simpleRNN',
          'simpleRNNCell',
          'stackedRNNCells',
          'bidirectional',
          'timeDistributed'
        ],
        activation: {
          options: [
            '--',
            'elu',
            'hardSigmoid',
            'linear',
            'relu',
            'relu6',
            'selu',
            'sigmoid',
            'softmax',
            'softplus',
            'softsign',
            'tanh'
          ]
        }
      },
      initializers: {
        options: [
          '--',
          'glorotNormal',
          'glorotUniform',
          'heNormal',
          'heUniform',
          'identity',
          'leCunNormal',
          'leCunUniform',
          'orthogonal',
          'randomNormal',
          'randomUniform',
          'truncatedNormal',
          'varianceScaling',
          'ones',
          'zeros'
        ]
      },
      train: {
        options: ['sgd', 'momentum', 'adagrad', 'adadelta', 'adam', 'adamax', 'rmsprop']
      },
      losses: {
        options: [
          'absoluteDifference',
          'categoricalCrossentropy',
          'computeWeightedLoss',
          'cosineDistance',
          'hingeLoss',
          'huberLoss',
          'logLoss',
          'meanSquaredError',
          'sigmoidCrossEntropy',
          'softmaxCrossEntropy'
        ]
      }
    },
    tasks: {
      builder: async function(tf, data) {
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
        return { model }
      },
      compiler: async function(scope, tf, model, data, inputTensorJSON, outputTensorJSON, callbacks) {
        let inputData = scope[inputTensorJSON.data['type']].from(inputTensorJSON.data['data'])
        let outputData = scope[outputTensorJSON.data['type']].from(outputTensorJSON.data['data'])
        let inputTensor = tf.tensor(inputData, inputTensorJSON.shape)
        let outputTensor = tf.tensor(outputData, outputTensorJSON.shape)

        let loss = data.compilerLossSelected
        if (loss in tf.losses) {
          loss = tf.losses[loss]
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
          callbacks: callbacks
        })

        return { model, train }
      }
    }
  }
  exports.tf = definitions.tf
  exports.tasks = definitions.tasks
  Object.defineProperty(exports, '__esModule', { value: true })
})));
