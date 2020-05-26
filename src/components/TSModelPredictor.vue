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
        v-b-modal="'dataset-view-' + component.index"
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
          <label>Total Layers</label>
          <b-form-spinbutton
            v-model="layerSize"
            min="1"
            :max="indexMax"
            placeholder="--"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>
      </b-form>
    </b-collapse>
    <div style="margin-top: 8px;"></div>

    <b-modal
      :id="'dataset-view-' + component.index"
      title="Dataset View"
      :static="true"
      :hide-footer="true"
      size="lg"
    >
      <center>
        <div ref="draw"></div>
      </center>
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

export default {
  name: 'TSModelPredictor',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: ['layerSize'],
      layerSize: 0,
      fileChart: false,
      toggleIcon: 'caret-up'
    }
    return this.importData(data)
  },
  computed: {
    editActionDisabled() {
      let disabled = 0
      disabled |= this.indexMax === 0
      return disabled === 1
    },
    trashActionDisabled() {
      return this.editActionDisabled
    },
    plugActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |=
        this.inputData === null ||
        this.inputData.model === null ||
        !(this.inputData.model instanceof Object)
      disabled |= this.layerSize > this.indexMax
      return disabled === 1
    },
    imageActionDisabled() {
      let disabled = 0
      disabled |= this.fileChart === false
      return disabled === 1
    },
    indexMax() {
      let indexMax = 0
      if (this.inputData && this.inputData.model && this.inputData.model.layers) {
        indexMax = this.inputData.model.layers.length
      }
      return indexMax
    }
  },
  watch: {
    inputLoading(next, prev) {
      if (next === false) {
        this.trashAction()
      }
    },
    indexMax(next, prev) {
      if (this.layerSize > next) {
        this.layerSize = next
      }
    },
    loading(next, prev) {
      if (next === false) {
        delete this.$options.sockets.onerror
        delete this.$options.sockets.onopen
        delete this.$options.sockets.onmessage
        delete this.$options.sockets.onclose
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
    plugActionPost(predictTensorJSON) {
      let { data, inputTensorJSON, outputTensorJSON, indexLabel, normalizationData } = this.inputData

      let values = null
      let inputMatrix = null
      let inputData = global[inputTensorJSON.data['type']].from(inputTensorJSON.data['data'])
      let inputTensor = this.$tf.tensor(inputData, inputTensorJSON.shape)

      if (normalizationData.inputUnitsNormalize) {
        let { inputMax, inputMin } = normalizationData
        let maxData = global[inputMax.data['type']].from(inputMax.data['data'])
        let maxTensor = this.$tf.tensor(maxData, inputMax.shape)
        let minData = global[inputMin.data['type']].from(inputMin.data['data'])
        let minTensor = this.$tf.tensor(minData, inputMin.shape)
        values = inputTensor.mul(maxTensor.sub(minTensor)).add(minTensor)
        inputMatrix = values.arraySync()
        maxTensor.dispose()
        minTensor.dispose()
      } else {
        values = inputTensor
        inputMatrix = values.arraySync()
      }

      let outputMatrix = null
      let outputData = global[outputTensorJSON.data['type']].from(outputTensorJSON.data['data'])
      let outputTensor = this.$tf.tensor(outputData, outputTensorJSON.shape)

      let predictMatrix = null
      let predictData = global[predictTensorJSON.data['type']].from(predictTensorJSON.data['data'])
      let predictTensor = this.$tf.tensor(predictData, predictTensorJSON.shape)

      if (normalizationData.outputUnitsNormalize) {
        let { outputMax, outputMin } = normalizationData
        let maxData = global[outputMax.data['type']].from(outputMax.data['data'])
        let maxTensor = this.$tf.tensor(maxData, outputMax.shape)
        let minData = global[outputMin.data['type']].from(outputMin.data['data'])
        let minTensor = this.$tf.tensor(minData, outputMin.shape)
        values = outputTensor.mul(maxTensor.sub(minTensor)).add(minTensor)
        outputMatrix = values.arraySync()
        values = predictTensor.mul(maxTensor.sub(minTensor)).add(minTensor)
        predictMatrix = values.arraySync()
        maxTensor.dispose()
        minTensor.dispose()
      } else {
        values = outputTensor
        outputMatrix = values.arraySync()

        values = predictTensor
        predictMatrix = values.arraySync()
      }
      inputTensor.dispose()
      outputTensor.dispose()
      predictTensor.dispose()

      let dataLabels = []
      if (indexLabel !== -1) {
        dataLabels = data.map(x => x[indexLabel])
      }
      let output = []
      for (let i = 0; i < inputMatrix.length; i++) {
        let row = []
        for (let j = 0; j < inputTensor.shape[1]; j++) {
          row.push(inputMatrix[i][j])
        }
        for (let j = 0; j < predictTensor.shape[1]; j++) {
          row.push(predictMatrix[i][j])
        }
        if (indexLabel !== -1) {
          row.push(dataLabels[i])
        }
        output.push(row)
      }
      this.output = output

      if (inputTensor.shape[1] === 1 && outputTensor.shape[1] === 1 && predictTensor.shape[1] === 1) {
        let originalValues = []
        let predictedValues = []
        for (let i = 0; i < inputMatrix.length; i++) {
          originalValues.push({
            x: inputMatrix[i][0],
            y: outputMatrix[i][0]
          })
          predictedValues.push({
            x: inputMatrix[i][0],
            y: predictMatrix[i][0]
          })
        }
        this.$tfvis.render.scatterplot(
          this.$refs['draw'],
          { values: [originalValues, predictedValues], series: ['original', 'predicted'] },
          {
            width: 700,
            height: 450
          }
        )
        this.fileChart = true
      } else {
        this.fileChart = false
      }
    },
    plugAction(event) {
      this.loading = true
      let { model, inputTensorJSON, normalizationData } = this.inputData

      this.$options.sockets.onerror = function() {
        let worker = new Worker('worker.js')
        worker.onmessage = function(event) {
          if (event.data[0] === 'onEnd' && event.error) {
            worker.terminate()
            this.loading = false
          } else if (event.data[0] === 'onEnd') {
            this.plugActionPost(event.data[1])
            worker.terminate()
            this.loading = false
          }
        }.bind(this)
        model.save('indexeddb://model').then(
          function() {
            worker.postMessage(['predictor', this.$data, inputTensorJSON, normalizationData])
          }.bind(this)
        )
      }.bind(this)

      this.$options.sockets.onopen = function() {
        model.save(this.$tf.io.browserHTTPRequest('./api/model')).then(
          function() {
            this.$socket.sendObj({ data: ['predictor', this.$data, inputTensorJSON, normalizationData] })
          }.bind(this)
        )
      }.bind(this)

      this.$options.sockets.onmessage = function(message) {
        let event = JSON.parse(message.data)
        if (event.data[0] === 'onEnd') {
          this.plugActionPost(event.data[1])
          this.$disconnect()
        }
      }.bind(this)

      this.$options.sockets.onclose = function() {
        this.loading = false
      }.bind(this)

      let websocket = new URL(process.env.VUE_APP_WEBSOCKET_API).hostname
      let hostname = new URL(window.location.href).hostname
      if (websocket === hostname) {
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
