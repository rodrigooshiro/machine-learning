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
import * as tf from '@tensorflow/tfjs'
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
      let indexMax = 1
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
    plugAction(event) {
      this.loading = true
      let { model, data, inputMatrix, outputMatrix, indexLabel, normalizationData } = this.inputData

      let predictor = tf.sequential()
      for (let i = 0; i < this.layerSize; i++) {
        predictor.add(model.layers[i])
      }

      let inputValues = null
      let inputTensor = tf.tensor2d(inputMatrix)
      if (normalizationData.inputUnitsNormalize) {
        let tensor = inputTensor
          .sub(normalizationData.inputMin)
          .div(normalizationData.inputMax.sub(normalizationData.inputMin))
        inputTensor = tensor
      }
      let outputValues = null
      let outputTensor = predictor.predict(inputTensor)

      if (normalizationData.inputUnitsNormalize) {
        let { inputMax, inputMin } = normalizationData
        let values = inputTensor.mul(inputMax.sub(inputMin)).add(inputMin)
        inputValues = values.dataSync()
      } else {
        let values = inputTensor
        inputValues = values.dataSync()
      }
      inputTensor.dispose()

      if (normalizationData.outputUnitsNormalize) {
        let { outputMax, outputMin } = normalizationData
        let values = outputTensor.mul(outputMax.sub(outputMin)).add(outputMin)
        outputValues = values.dataSync()
      } else {
        let values = outputTensor
        outputValues = values.dataSync()
      }
      outputTensor.dispose()

      let dataLabels = []
      if (indexLabel !== -1) {
        dataLabels = data.map(x => x[indexLabel])
      }
      let inputUnits = model.layers[0].batchInputShape[1]
      let outputUnits = model.layers[this.layerSize - 1].units
      let predictionSize = outputValues.length / outputUnits
      let output = []
      for (let i = 0; i < predictionSize; i++) {
        let row = []
        for (let j = 0; j < inputUnits; j++) {
          row.push(inputMatrix[i][j])
        }
        for (let j = 0; j < outputUnits; j++) {
          row.push(outputValues[i * outputUnits + j])
        }
        if (indexLabel !== -1) {
          row.push(dataLabels[i])
        }
        output.push(row)
      }
      this.output = output

      if (inputUnits === 1 && outputUnits === 1) {
        let originalValues = []
        for (let i = 0; i < inputMatrix.length; i++) {
          originalValues.push({
            x: inputMatrix[i][0],
            y: outputMatrix[i][0]
          })
        }

        let predictedValues = Array.from(inputValues).map((val, i) => {
          return { x: val, y: outputValues[i] }
        })

        global.tfvis.render.scatterplot(
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
      this.loading = false
    }
  }
}
</script>

<style scoped>
</style>
