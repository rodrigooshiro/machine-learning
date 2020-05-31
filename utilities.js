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
  (factory((global.utilities = global.utilities || {})));
}(this, (function (exports) { 'use strict';
  let utilities = {
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
        },
        args: {
          activation: [
            'activation',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          dense: [
            'units',
            'activation',
            'useBias',
            'kernelInitializer',
            'biasInitializer',
            'inputDim',
            'kernelConstraint',
            'biasConstraint',
            'kernelRegularizer',
            'biasRegularizer',
            'activityRegularizer',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          dropout: [
            'rate',
            'noiseShape',
            'seed',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          embedding: [
            'inputDim',
            'outputDim',
            'embeddingsInitializer',
            'embeddingsRegularizer',
            'activityRegularizer',
            'embeddingsConstraint',
            'maskZero',
            'inputLength',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          flatten: [
            'dataFormat',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          permute: [
            'dims',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          repeatVector: [
            'n',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          reshape: [
            'targetShape',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          spatialDropout1d: [
            'rate',
            'seed',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          elu: [
            'alpha',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          leakyReLU: [
            'alpha',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          prelu: [
            'alphaInitializer',
            'alphaRegularizer',
            'alphaConstraint',
            'sharedAxes',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          reLU: [
            'maxValue',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          softmax: [
            'axis',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          thresholdedReLU: [
            'theta',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          conv1d: [
            'filters',
            'kernelSize',
            'strides',
            'padding',
            'dataFormat',
            'dilationRate',
            'activation',
            'useBias',
            'kernelInitializer',
            'biasInitializer',
            'kernelConstraint',
            'biasConstraint',
            'kernelRegularizer',
            'biasRegularizer',
            'activityRegularizer',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          conv2d: [
            'filters',
            'kernelSize',
            'strides',
            'padding',
            'dataFormat',
            'dilationRate',
            'activation',
            'useBias',
            'kernelInitializer',
            'biasInitializer',
            'kernelConstraint',
            'biasConstraint',
            'kernelRegularizer',
            'biasRegularizer',
            'activityRegularizer',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          conv2dTranspose: [
            'filters',
            'kernelSize',
            'strides',
            'padding',
            'dataFormat',
            'dilationRate',
            'activation',
            'useBias',
            'kernelInitializer',
            'biasInitializer',
            'kernelConstraint',
            'biasConstraint',
            'kernelRegularizer',
            'biasRegularizer',
            'activityRegularizer',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          conv3d: [
            'filters',
            'kernelSize',
            'strides',
            'padding',
            'dataFormat',
            'dilationRate',
            'activation',
            'useBias',
            'kernelInitializer',
            'biasInitializer',
            'kernelConstraint',
            'biasConstraint',
            'kernelRegularizer',
            'biasRegularizer',
            'activityRegularizer',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          cropping2D: [
            'cropping',
            'dataFormat',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          depthwiseConv2d: [
            'kernelSize',
            'depthMultiplier',
            'depthwiseInitializer',
            'depthwiseConstraint',
            'depthwiseRegularizer',
            'strides',
            'padding',
            'dataFormat',
            'dilationRate',
            'activation',
            'useBias',
            'kernelInitializer',
            'biasInitializer',
            'kernelConstraint',
            'biasConstraint',
            'kernelRegularizer',
            'biasRegularizer',
            'activityRegularizer',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          separableConv2d: [
            'depthMultiplier',
            'depthwiseInitializer',
            'pointwiseInitializer',
            'depthwiseRegularizer',
            'pointwiseRegularizer',
            'depthwiseConstraint',
            'pointwiseConstraint',
            'filters',
            'kernelSize',
            'strides',
            'padding',
            'dataFormat',
            'dilationRate',
            'activation',
            'useBias',
            'kernelInitializer',
            'biasInitializer',
            'kernelConstraint',
            'biasConstraint',
            'kernelRegularizer',
            'biasRegularizer',
            'activityRegularizer',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          upSampling2d: [
            'size',
            'dataFormat',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          averagePooling1d: [
            'poolSize',
            'strides',
            'padding',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          averagePooling2d: [
            'poolSize',
            'strides',
            'padding',
            'dataFormat',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          averagePooling3d: [
            'poolSize',
            'strides',
            'padding',
            'dataFormat',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          globalAveragePooling1d: [
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          globalAveragePooling2d: [
            'dataFormat',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          globalMaxPooling1d: [
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          globalMaxPooling2d: [
            'dataFormat',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          maxPooling1d: [
            'poolSize',
            'strides',
            'padding',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          maxPooling2d: [
            'poolSize',
            'strides',
            'padding',
            'dataFormat',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          maxPooling3d: [
            'poolSize',
            'strides',
            'padding',
            'dataFormat',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          gru: [
            'recurrentActivation',
            'implementation',
            'units',
            'activation',
            'useBias',
            'kernelInitializer',
            'recurrentInitializer',
            'biasInitializer',
            'kernelRegularizer',
            'recurrentRegularizer',
            'biasRegularizer',
            'kernelConstraint',
            'recurrentConstraint',
            'biasConstraint',
            'dropout',
            'recurrentDropout',
            'cell',
            'returnSequences',
            'returnState',
            'goBackwards',
            'stateful',
            'unroll',
            'inputDim',
            'inputLength',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          gruCell: [
            'recurrentActivation',
            'implementation',
            'units',
            'activation',
            'useBias',
            'kernelInitializer',
            'recurrentInitializer',
            'biasInitializer',
            'kernelRegularizer',
            'recurrentRegularizer',
            'biasRegularizer',
            'kernelConstraint',
            'recurrentConstraint',
            'biasConstraint',
            'dropout',
            'recurrentDropout',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          lstm: [
            'recurrentActivation',
            'unitForgetBias',
            'implementation',
            'units',
            'activation',
            'useBias',
            'kernelInitializer',
            'recurrentInitializer',
            'biasInitializer',
            'kernelRegularizer',
            'recurrentRegularizer',
            'biasRegularizer',
            'kernelConstraint',
            'recurrentConstraint',
            'biasConstraint',
            'dropout',
            'recurrentDropout',
            'cell',
            'returnSequences',
            'returnState',
            'goBackwards',
            'stateful',
            'unroll',
            'inputDim',
            'inputLength',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          lstmCell: [
            'recurrentActivation',
            'unitForgetBias',
            'implementation',
            'units',
            'activation',
            'useBias',
            'kernelInitializer',
            'recurrentInitializer',
            'biasInitializer',
            'kernelRegularizer',
            'recurrentRegularizer',
            'biasRegularizer',
            'kernelConstraint',
            'recurrentConstraint',
            'biasConstraint',
            'dropout',
            'recurrentDropout',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          rnn: [
            'cell',
            'returnSequences',
            'returnState',
            'goBackwards',
            'stateful',
            'unroll',
            'inputDim',
            'inputLength',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          simpleRNN: [
            'units',
            'activation',
            'useBias',
            'kernelInitializer',
            'recurrentInitializer',
            'biasInitializer',
            'kernelRegularizer',
            'recurrentRegularizer',
            'biasRegularizer',
            'kernelConstraint',
            'recurrentConstraint',
            'biasConstraint',
            'dropout',
            'recurrentDropout',
            'cell',
            'returnSequences',
            'returnState',
            'goBackwards',
            'stateful',
            'unroll',
            'inputDim',
            'inputLength',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          simpleRNNCell: [
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          stackedRNNCells: [
            'cells',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          bidirectional: [
            'layer',
            'mergeMode',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
          ],
          timeDistributed: [
            'layer',
            'inputShape',
            'batchInputShape',
            'batchSize',
            'dtype',
            'name',
            'trainable',
            'weights',
            'inputDType'
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
          'computeWeightedLoss',
          'cosineDistance',
          'hingeLoss',
          'huberLoss',
          'logLoss',
          'meanSquaredError',
          'sigmoidCrossEntropy',
          'softmaxCrossEntropy',
          'binaryAccuracy',
          'binaryCrossentropy',
          'categoricalAccuracy',
          'categoricalCrossentropy',
          'cosineProximity',
          'meanAbsoluteError',
          'meanAbsolutePercentageError',
          'meanSquaredError',
          'precision',
          'recall',
          'sparseCategoricalCrossentropy'
        ]
      }
    },
    tasks: {
      normalizeTensor(tf, tensor, minJSON, maxJSON) {
        let scope = typeof window === 'undefined' ? global : window
        let minTensor = null
        let maxTensor = null
        let dataSync = null
        if (minJSON && maxJSON) {
          let minData = scope[minJSON.data['type']].from(minJSON.data['data'])
          let maxData = scope[maxJSON.data['type']].from(maxJSON.data['data'])
          minTensor = tf.tensor(minData, minJSON.shape)
          maxTensor = tf.tensor(maxData, maxJSON.shape)
        } else {
          minTensor = tensor.min(0)
          maxTensor = tensor.max(0)
        }
        let tSub = tensor.sub(minTensor)
        let tDiv = maxTensor.sub(minTensor)
        let normal = tSub.div(tDiv)
        tSub.dispose()
        tDiv.dispose()

        dataSync = minTensor.dataSync()
        let min = {
          data: {
            type: dataSync.constructor.toString().replace(/.* (.*)\(\)(.|\n)*/g, '$1'),
            data: Object.values(dataSync)
          },
          shape: dataSync.shape
        }
        minTensor.dispose()

        dataSync = maxTensor.dataSync()
        let max = {
          data: {
            type: dataSync.constructor.toString().replace(/.* (.*)\(\)(.|\n)*/g, '$1'),
            data: Object.values(dataSync)
          },
          shape: dataSync.shape
        }

        maxTensor.dispose()
        return { normal, min, max }
      },
      unnormalizeTensor(tf, tensor, minJSON, maxJSON) {
        let scope = typeof window === 'undefined' ? global : window
        let minData = scope[minJSON.data['type']].from(minJSON.data['data'])
        let maxData = scope[maxJSON.data['type']].from(maxJSON.data['data'])
        let minTensor = tf.tensor(minData, minJSON.shape)
        let maxTensor = tf.tensor(maxData, maxJSON.shape)
        let tSub = maxTensor.sub(minTensor)
        let tMul = tensor.mul(tSub)
        let unnormal = tMul.add(minTensor)
        tSub.dispose()
        tMul.dispose()

        minTensor.dispose()
        maxTensor.dispose()
        return { unnormal }
      },
      builder: async function(tf, data) {
        try {
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
            if (utilities.tf.layer.args[data.layerName[i]].indexOf('units') !== -1) {
              if (data.units[i] !== 0) {
                layer.units = data.units[i]
              }
            }
            if (utilities.tf.layer.args[data.layerName[i]].indexOf('kernelSize') !== -1) {
              if (data.kernelSize[i] !== 0) {
                layer.kernelSize = data.kernelSize[i]
              }
            }
            if (utilities.tf.layer.args[data.layerName[i]].indexOf('filters') !== -1) {
              if (data.filters[i] !== -1) {
                layer.filters = data.filters[i]
              }
            }
            if (utilities.tf.layer.args[data.layerName[i]].indexOf('strides') !== -1) {
              if (data.strides[i].length === 1) {
                layer.strides = data.strides[i][0]
              }
              if (data.strides[i].length > 1) {
                layer.strides = data.strides[i]
              }
            }
            if (utilities.tf.layer.args[data.layerName[i]].indexOf('poolSize') !== -1) {
              if (data.poolSize[i].length === 1) {
                layer.poolSize = data.poolSize[i][0]
              }
              if (data.poolSize[i].length > 1) {
                layer.poolSize = data.poolSize[i]
              }
            }
            if (utilities.tf.layer.args[data.layerName[i]].indexOf('activation') !== -1) {
              if (data.activation[i] !== '--') {
                layer.activation = data.activation[i]
              }
            }
            if (utilities.tf.layer.args[data.layerName[i]].indexOf('kernelInitializer') !== -1) {
              if (data.kernelInitializer[i] !== '--') {
                layer.kernelInitializer = data.kernelInitializer[i]
              }
            }
            if (utilities.tf.layer.args[data.layerName[i]].indexOf('biasInitializer') !== -1) {
              if (data.biasInitializer[i] !== '--') {
                layer.useBias = true
                layer.biasInitializer = data.biasInitializer[i]
              }
            }
            model.add(tf.layers[data.layerName[i]](layer))
          }
          return { model }
        } catch(error) {
          console.error(error)
          return error
        }
      },
      compiler: async function(tf, model, data, inputTensorJSON, outputTensorJSON, callbacks) {
        try {
          let scope = typeof window === 'undefined' ? global : window
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
          let history = await model.fit(inputTensor, outputTensor, {
            batchSize: data.batchSize,
            epochs: data.epochSize,
            shuffle: data.shuffle,
            validationSplit: data.validationSplit,
            callbacks: callbacks
          })
          return { model, history }
        } catch(error) {
          console.error(error)
          return error
        }
      },
      predictor: async function(tf, model, data, inputTensorJSON) {
        try {
          let scope = typeof window === 'undefined' ? global : window
          let predictor = tf.sequential()
          for (let i = 0; i < data.layerSize; i++) {
            predictor.add(model.layers[i])
          }

          let inputData = scope[inputTensorJSON.data['type']].from(inputTensorJSON.data['data'])
          let inputTensor = tf.tensor(inputData, inputTensorJSON.shape)
          let predictTensor = predictor.predict(inputTensor)
          let predictTensorData = predictTensor.dataSync()
          let predictTensorJSON = {
            data: {
              type: predictTensorData.constructor.toString().replace(/.* (.*)\(\)(.|\n)*/g, '$1'),
              data: Object.values(predictTensorData)
            },
            shape: predictTensor.shape
          }
          return { predictTensorJSON }
        } catch(error) {
          console.error(error)
          return error
        }
      }
    }
  }
  exports.tf = utilities.tf
  exports.tasks = utilities.tasks
  Object.defineProperty(exports, '__esModule', { value: true })
})));
