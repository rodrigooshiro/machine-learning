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
          <label>
            Input Units
            <span v-if="!unitsActionDisabled">({{ inputSize }})</span>
          </label>
          <b-dropdown
            :text="unitsActionDisabled ? 'datasetImages' : 'Columns'"
            no-flip
            split
            split-variant="outline-secondary"
            block
            variant="secondary"
            :disabled="editActionDisabled || unitsActionDisabled"
          >
            <b-dropdown-form style="text-align: left">
              <template v-for="item in inputUnits">
                <b-form v-bind:key="item.key" inline>
                  <b-form-checkbox v-model="item.checked" :options="[true, false]"></b-form-checkbox>
                  {{ item.label }}
                </b-form>
              </template>
            </b-dropdown-form>
          </b-dropdown>
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
          <label>
            Output Units
            <span v-if="!unitsActionDisabled">({{ outputSize }})</span>
          </label>
          <b-dropdown
            :text="unitsActionDisabled ? 'datasetLabels' : 'Columns'"
            no-flip
            split
            split-variant="outline-secondary"
            block
            variant="secondary"
            :disabled="editActionDisabled || unitsActionDisabled"
          >
            <b-dropdown-form style="text-align: left">
              <template v-for="item in outputUnits">
                <b-form v-bind:key="item.key" inline>
                  <b-form-checkbox v-model="item.checked" :options="[true, false]"></b-form-checkbox>
                  {{ item.label }}
                </b-form>
              </template>
            </b-dropdown-form>
          </b-dropdown>
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
      </b-form>
    </b-collapse>
    <div style="margin-top: 8px;"></div>

    <b-modal
      :id="'model-view-' + component.index"
      title="TS Model View"
      :static="true"
      :hide-footer="true"
      size="lg"
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
import * as tf from '@tensorflow/tfjs'
import jquery from 'jquery'
import definitions from '../config/definitions.js'

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
        'inputUnits',
        'inputUnitsNormalize',
        'outputUnits',
        'outputUnitsNormalize',
        'compilerOptimizerSelected',
        'compilerLossSelected'
      ],
      toggleIcon: 'caret-up',
      shuffle: true,
      epochSize: 0,
      batchSize: 0,
      validationSplit: 0,
      inputUnits: [],
      inputUnitsNormalize: false,
      outputUnits: [],
      outputUnitsNormalize: false,
      compilerOptimizerSelected: null,
      compilerOptimizerOptions: definitions.tf.train.options,
      compilerLossSelected: null,
      compilerLossOptions: definitions.tf.losses.options,
      fileChart: false
    }
    return this.importData(data)
  },
  computed: {
    unitsActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      if (this.inputData !== null && 'data' in this.inputData) {
        let { data } = this.inputData
        disabled |= 'datasetImages' in data && 'datasetLabels' in data
      }
      return disabled === 1
    },
    editActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.inputSize === 0
      disabled |= this.outputSize === 0
      return disabled === 1
    },
    trashActionDisabled() {
      return this.editActionDisabled
    },
    plugActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      if (!this.unitsActionDisabled && this.inputData !== null) {
        disabled |= this.inputUnits.filter(unit => unit.checked === true).length !== this.inputSize
        disabled |= this.outputUnits.filter(unit => unit.checked === true).length !== this.outputSize
      }
      return disabled === 1
    },
    imageActionDisabled() {
      let disabled = 0
      disabled |= this.fileChart === false
      return disabled === 1
    },
    inputSize() {
      let inputSize = 0
      if (
        this.inputData &&
        this.inputData.model &&
        this.inputData.model.layers &&
        this.inputData.model.layers.length > 1
      ) {
        inputSize = this.inputData.model.layers[0].batchInputShape[1]
      }
      return inputSize
    },
    outputSize() {
      let outputSize = 0
      if (
        this.inputData &&
        this.inputData.model &&
        this.inputData.model.layers &&
        this.inputData.model.layers.length > 1
      ) {
        outputSize = this.inputData.model.layers[this.inputData.model.layers.length - 1].units
      }
      return outputSize
    },
    dataSize() {
      let dataSize = 0
      if (this.inputData && this.inputData.data && this.inputData.data.length) {
        dataSize = this.inputData.data[0].length
      }
      return dataSize
    }
  },
  watch: {
    inputLoading(next, prev) {
      if (next === false) {
        this.trashAction()
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
      if (this.inputData && this.inputData.data && this.inputData.data.length) {
        for (let i = 0; i < this.dataSize; i++) {
          if (this.inputUnits.filter(unit => unit.key === i).length === 0) {
            this.inputUnits.push({
              key: i,
              checked: false,
              label: 'Column ' + i
            })
          }
          if (this.outputUnits.filter(unit => unit.key === i).length === 0) {
            this.outputUnits.push({
              key: i,
              checked: false,
              label: 'Column ' + i
            })
          }
        }
      }
    },
    plugAction(event) {
      this.loading = true
      let { model, data } = this.inputData
      let inputTensor = null
      let outputTensor = null
      let inputMatrix = null
      let outputMatrix = null
      let normalizationData = {
        inputUnitsNormalize: this.inputUnitsNormalize,
        outputUnitsNormalize: this.outputUnitsNormalize
      }
      if ('datasetImages' in data) {
        inputMatrix = data['datasetImages']
        // inputMatrix = inputMatrix.slice(0, inputMatrix.length / 10)
        let size = data.spriteWidth * data.spriteHeight * data.spriteChannels
        let length = parseInt(inputMatrix.length / size)
        let tensor = tf.tensor2d(inputMatrix, [length, size])
        inputTensor = tensor.reshape([length, data.spriteWidth, data.spriteHeight, data.spriteChannels])
      } else {
        inputMatrix = []
        for (let i = 0; i < data.length; i++) {
          let inputRow = []
          for (let j = 0; j < this.dataSize; j++) {
            if (this.inputUnits.filter(unit => unit.key === j && unit.checked === true).length) {
              inputRow.push(parseFloat(data[i][j]))
            }
          }
          inputMatrix.push(inputRow)
        }
        inputTensor = tf.tensor2d(inputMatrix)
      }
      if ('datasetLabels' in data) {
        outputMatrix = data['datasetLabels']
        // outputMatrix = outputMatrix.slice(0, outputMatrix.length / 10)
        let size = data['datasetLabelsSize']
        let length = parseInt(outputMatrix.length / size)
        outputTensor = tf.tensor2d(outputMatrix, [length, size])
      } else {
        outputMatrix = []
        for (let i = 0; i < data.length; i++) {
          let outputRow = []
          for (let j = 0; j < this.dataSize; j++) {
            if (this.outputUnits.filter(unit => unit.key === j && unit.checked === true).length) {
              outputRow.push(parseFloat(data[i][j]))
            }
          }
          outputMatrix.push(outputRow)
        }
        outputTensor = tf.tensor2d(outputMatrix)
      }
      if (this.inputUnitsNormalize) {
        let max = inputTensor.max()
        let min = inputTensor.min()
        let tensor = inputTensor.sub(min).div(max.sub(min))
        inputTensor = tensor
        normalizationData.inputMax = max
        normalizationData.inputMin = min
      }
      if (this.outputUnitsNormalize) {
        let max = outputTensor.max()
        let min = outputTensor.min()
        let tensor = outputTensor.sub(min).div(max.sub(min))
        outputTensor = tensor
        normalizationData.outputMax = max
        normalizationData.outputMin = min
      }
      let loss = this.compilerLossSelected
      if (loss in tf.losses) {
        loss = tf.losses[loss]
      }
      model.compile({
        optimizer: this.compilerOptimizerSelected,
        loss: loss,
        metrics: ['mse']
      })
      this.fileChart = true
      model
        .fit(inputTensor, outputTensor, {
          batchSize: this.batchSize,
          epochs: this.epochSize,
          shuffle: this.shuffle,
          validationSplit: this.validationSplit,
          callbacks: global.tfvis.show.fitCallbacks(this.$refs['draw'], ['loss', 'mse'], {
            width: 700,
            height: 200,
            callbacks: ['onEpochEnd']
          })
        })
        .then(
          function(train) {
            inputTensor.dispose()
            outputTensor.dispose()
            this.output = {
              ...this.inputData,
              train: train,
              inputMatrix: inputMatrix,
              outputMatrix: outputMatrix,
              normalizationData: normalizationData
            }
            this.loading = false
          }.bind(this)
        )
    }
  }
}
</script>

<style scoped>
</style>
