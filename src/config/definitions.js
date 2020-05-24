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
    }
  }
}

export default definitions
