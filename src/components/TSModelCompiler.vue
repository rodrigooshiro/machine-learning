<template>
  <component-layout :component.sync="component" :length.sync="length" :loading.sync="loading">
    <b-form class="form-toolbar-rtl" inline>
      <b-button size="badge" @click="plugAction" :disabled="plugActionDisabled">
        <b-icon icon="plug" class="btn-icon"></b-icon>
      </b-button>
      <b-button size="badge" @click="trashAction" :disabled="trashActionDisabled">
        <b-icon icon="trash" class="btn-icon"></b-icon>
      </b-button>
      <b-button
        size="badge"
        @click="$bvModal.show('model-view-' + component.index)"
        :disabled="imageActionDisabled"
      >
        <b-icon icon="card-image" class="btn-icon"></b-icon>
      </b-button>
      <b-button size="badge" @click="onToggleToolbar">
        <b-icon :icon="toggleIcon"></b-icon>
      </b-button>
    </b-form>

    <b-collapse :visible="toggleIcon === 'caret-up'">
      <b-form inline>
        <div class="indexInput">
          <label>Compiler Optimizer</label>
          <b-form-select
            v-model="compilerOptimizerSelected"
            :options="compilerOptimizerOptions"
            :disabled="editActionDisabled"
          ></b-form-select>
        </div>

        <div class="indexInput">
          <label>Compiler Loss</label>
          <b-form-select
            v-model="compilerLossSelected"
            :options="compilerLossOptions"
            :disabled="editActionDisabled"
          ></b-form-select>
        </div>

        <div class="indexInput">
          <label>Input Units Normalize</label>
          <b-form-select
            v-model="inputUnitsNormalize"
            :options="[true, false]"
            :disabled="editActionDisabled"
          ></b-form-select>
        </div>

        <div class="indexInput">
          <label>Output Units Normalize</label>
          <b-form-select
            v-model="outputUnitsNormalize"
            :options="[true, false]"
            :disabled="editActionDisabled"
          ></b-form-select>
        </div>
      </b-form>

      <b-form inline>
        <div class="indexInput">
          <label>Epochs</label>
          <b-form-spinbutton
            v-model="epochSize"
            min="1"
            placeholder="--"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Batch Size</label>
          <b-form-spinbutton
            v-model="batchSize"
            min="1"
            placeholder="--"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Validation Split</label>
          <b-form-spinbutton
            v-model="validationSplit"
            min="0.0"
            max="1.0"
            step="0.01"
            :formatter-fn="percentageFormatter"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Shuffle</label>
          <b-form-select v-model="shuffle" :options="[true, false]" :disabled="editActionDisabled"></b-form-select>
        </div>
      </b-form>
    </b-collapse>
    <div style="margin-top: 8px;"></div>

    <b-modal
      :id="'model-view-' + component.index"
      title="TS Model View"
      :static="true"
      :hide-footer="true"
      size="lg"
      ref="modal"
    >
      <div ref="draw"></div>
    </b-modal>
  </component-layout>
</template>

<script>
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
import ComponentLayout from './ComponentLayout'
import { mixin } from './mixin'
import jquery from 'jquery'
import lodash from 'lodash'
import * as utilities from '../config/utilities.js'

export default {
  name: 'TSModelCompiler',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: [
        'shuffle',
        'epochSize',
        'batchSize',
        'validationSplit',
        'inputUnitsNormalize',
        'outputUnitsNormalize',
        'compilerOptimizerSelected',
        'compilerLossSelected'
      ],
      toggleIcon: 'caret-up',
      shuffle: true,
      epochSize: 0,
      batchSize: 0,
      validationSplit: 0,
      inputUnitsNormalize: false,
      outputUnitsNormalize: false,
      compilerOptimizerSelected: null,
      compilerOptimizerOptions: utilities.tf.train.options,
      compilerLossSelected: null,
      compilerLossOptions: utilities.tf.losses.options,
      fileChart: false
    }
    return this.importData(data)
  },
  computed: {
    editActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.global.model === null
      disabled |= this.global.inputShape === null
      return disabled === 1
    },
    trashActionDisabled() {
      return this.editActionDisabled
    },
    plugActionDisabled() {
      return this.editActionDisabled
    },
    imageActionDisabled() {
      let disabled = 0
      disabled |= this.fileChart === false
      return disabled === 1
    }
  },
  watch: {
    inputLoading(next, prev) {
      if (next === false) {
        this.trashAction()
      }
    },
    loading(next, prev) {
      if (next === false) {
        delete this.$options.sockets.onerror
        delete this.$options.sockets.onopen
        delete this.$options.sockets.onmessage
      }
    }
  },
  methods: {
    onToggleToolbar() {
      if (this.toggleIcon === 'caret-up') {
        this.toggleIcon = 'caret-down'
      } else if (this.toggleIcon === 'caret-down') {
        this.toggleIcon = 'caret-up'
      }
    },
    trashAction(event) {
      jquery(this.$refs['draw']).empty()
      this.fileChart = false
      this.output = null
      this.loadData(this.data)
      this.loadData(this.component.data)
    },
    plugActionEvent(event) {
      let inputTensor = null
      let outputTensor = null
      let inputMatrix = this.global.inputMatrix
      let outputMatrix = this.global.outputMatrix
      let normalizationData = {
        inputUnitsNormalize: this.inputUnitsNormalize,
        outputUnitsNormalize: this.outputUnitsNormalize
      }

      let inputShape = lodash.cloneDeep(this.global.inputShape)
      if (this.global.training !== null) {
        inputMatrix = this.global.training.inputMatrix
      }
      inputShape.unshift(inputMatrix.length)
      inputTensor = this.$tf.tensor(inputMatrix, inputShape)

      let outputShape = lodash.cloneDeep(this.global.outputShape)
      if (this.global.training !== null) {
        outputMatrix = this.global.training.outputMatrix
      }
      outputShape.unshift(outputMatrix.length)
      outputTensor = this.$tf.tensor(outputMatrix, outputShape)
      this.global.loss = this.compilerLossSelected

      if (this.inputUnitsNormalize) {
        let { normal, min, max } = utilities.tasks.normalizeTensor(this.$tf, inputTensor)
        inputTensor.dispose()
        inputTensor = normal
        normalizationData.inputMin = min
        normalizationData.inputMax = max
      }
      if (this.outputUnitsNormalize) {
        let { normal, min, max } = utilities.tasks.normalizeTensor(this.$tf, outputTensor)
        outputTensor.dispose()
        outputTensor = normal
        normalizationData.outputMin = min
        normalizationData.outputMax = max
      }

      let callbacks = this.$tfvis.show.fitCallbacks(this.$refs['draw'], ['loss', 'mse'], {
        width: 700,
        height: 200,
        callbacks: ['onEpochEnd']
      })

      let inputTensorData = inputTensor.dataSync()
      let inputTensorJSON = {
        data: {
          type: inputTensorData.constructor.toString().replace(/.* (.*)\(\)(.|\n)*/g, '$1'),
          data: Object.values(inputTensorData)
        },
        shape: inputTensor.shape
      }
      let outputTensorData = outputTensor.dataSync()
      let outputTensorJSON = {
        data: {
          type: outputTensorData.constructor.toString().replace(/.* (.*)\(\)(.|\n)*/g, '$1'),
          data: Object.values(outputTensorData)
        },
        shape: outputTensor.shape
      }

      this.$options.sockets.onerror = function() {
        let worker = new Worker('worker.js')
        worker.onmessage = function(event) {
          if (event.data[0] === 'onEnd' && event.error) {
            worker.terminate()
            this.plugActionEnd(event)
          } else if (event.data[0] === 'onEnd') {
            this.$tfvis.show.history(this.$refs['draw'], event.data[1], ['loss', 'mse'], {
              width: 700,
              height: 200
            })
            this.$tf.loadLayersModel('indexeddb://model').then(
              function(model) {
                this.global.model.dispose()
                this.global.model = model
                this.output = {
                  ...this.inputData,
                  history: event.data[1],
                  normalizationData: normalizationData
                }
                worker.terminate()
                this.plugActionEnd(event)
              }.bind(this)
            )
          } else {
            this.fileChart = true
            if (this.$refs['modal'].isShow) {
              callbacks[event.data[0]](event.data[1], event.data[2])
            }
          }
        }.bind(this)
        this.global.model.save('indexeddb://model').then(
          function() {
            worker.postMessage(['compiler', this.$data, inputTensorJSON, outputTensorJSON])
            inputTensor.dispose()
            outputTensor.dispose()
          }.bind(this)
        )
      }.bind(this)

      this.$options.sockets.onopen = function() {
        this.global.model.save(this.$tf.io.browserHTTPRequest('./api/model')).then(
          function() {
            this.$socket.sendObj({ data: ['compiler', this.$data, inputTensorJSON, outputTensorJSON] })
            inputTensor.dispose()
            outputTensor.dispose()
          }.bind(this)
        )
      }.bind(this)

      this.$options.sockets.onmessage = function(message) {
        let event = JSON.parse(message.data)
        if (event.data[0] === 'onEnd') {
          this.$tfvis.show.history(this.$refs['draw'], event.data[1], ['loss', 'mse'], {
            width: 700,
            height: 200
          })
          this.$tf.loadLayersModel('./api/model/model.json').then(
            function(model) {
              this.global.model.dispose()
              this.global.model = model
              this.output = {
                ...this.inputData,
                history: event.data[1],
                normalizationData: normalizationData
              }
              this.$disconnect()
              this.plugActionEnd(event)
            }.bind(this)
          )
        } else {
          this.fileChart = true
          if (this.$refs['modal'].isShow) {
            callbacks[event.data[0]](event.data[1], event.data[2])
          }
        }
      }.bind(this)

      if (process.env.VUE_APP_WEBSOCKET_API === 'true') {
        this.$connect()
      } else {
        this.$options.sockets.onerror()
      }
    }
  }
}
</script>

<style scoped>
</style>
