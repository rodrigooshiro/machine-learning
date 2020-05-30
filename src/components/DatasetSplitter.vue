<template>
  <component-layout :component.sync="component" :length.sync="length" :loading.sync="loading">
    <b-form class="form-toolbar-rtl" inline>
      <b-button size="badge" @click="plugAction" :disabled="plugActionDisabled">
        <b-icon icon="plug" class="btn-icon"></b-icon>
      </b-button>
      <b-button size="badge" @click="trashAction" :disabled="trashActionDisabled">
        <b-icon icon="trash" class="btn-icon"></b-icon>
      </b-button>
      <b-button size="badge" @click="onToggleToolbar">
        <b-icon :icon="toggleIcon"></b-icon>
      </b-button>
    </b-form>

    <b-collapse :visible="toggleIcon === 'caret-up'">
      <b-form inline>
        <div class="indexInput">
          <label>Input Units</label>
          <b-dropdown
            :text="unitsActionDisabled ? 'inputMatrix' : 'Columns'"
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
          <label>Output Units</label>
          <b-dropdown
            :text="unitsActionDisabled ? 'outputMatrix' : 'Columns'"
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
          <label>Label Index</label>
          <b-form-spinbutton
            v-model="indexLabel"
            min="-1"
            :max="dataSize-1"
            :formatter-fn="indexFormatter"
            :disabled="editActionDisabled || unitsActionDisabled"
          ></b-form-spinbutton>
        </div>
      </b-form>

      <b-form inline>
        <div class="indexInput">
          <label>Shuffle</label>
          <b-form-select v-model="shuffle" :options="[true, false]" :disabled="editActionDisabled"></b-form-select>
        </div>

        <div class="indexInput">
          <label>Sample Split</label>
          <b-form-spinbutton
            v-model="sampleSplit"
            min="0.0"
            max="1.0"
            step="0.01"
            :formatter-fn="percentageFormatter"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Training Ratio</label>
          <b-form-spinbutton
            v-model="trainingRatio"
            min="0.0"
            max="1.0"
            step="0.01"
            :formatter-fn="percentageFormatter"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Evaluation Ratio</label>
          <b-form-spinbutton
            v-model="evaluationRatio"
            min="0.0"
            max="1.0"
            step="0.01"
            :formatter-fn="percentageFormatter"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>
      </b-form>
    </b-collapse>
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

export default {
  name: 'DatasetSplitter',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: [
        'shuffle',
        'sampleSplit',
        'trainingRatio',
        'evaluationRatio',
        'inputUnits',
        'outputUnits',
        'indexLabel'
      ],
      toggleIcon: 'caret-up',
      shuffle: true,
      sampleSplit: 1,
      trainingRatio: 1,
      inputUnits: [],
      outputUnits: [],
      indexLabel: -1,
      evaluationRatio: 0
    }
    return this.importData(data)
  },
  computed: {
    unitsActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.inputData === null
      disabled |= this.inputData !== null && !Array.isArray(this.inputData)
      return disabled === 1
    },
    editActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      return disabled === 1
    },
    trashActionDisabled() {
      return this.editActionDisabled
    },
    plugActionDisabled() {
      let disabled = 0
      disabled |= this.sampleSplit === 0
      disabled |= this.trainingRatio === 0
      disabled |= this.indexMax === Infinity
      disabled |= this.loading === true
      return disabled === 1
    },
    indexMax() {
      let indexMax = Infinity
      if (Array.isArray(this.inputData) && this.inputData.length > 0) {
        indexMax = this.inputData.length
      }
      if (ArrayBuffer.isView(this.global.inputMatrix)) {
        let product = this.global.inputShape.reduce((a, b) => a * b, 1)
        let length = this.global.inputMatrix.length / product
        indexMax = Math.min(indexMax, length)
      }
      if (ArrayBuffer.isView(this.global.outputMatrix)) {
        let product = this.global.inputShape.reduce((a, b) => a * b, 1)
        let length = this.global.inputMatrix.length / product
        indexMax = Math.min(indexMax, length)
      }
      return indexMax
    },
    dataSize() {
      let dataSize = 0
      if (Array.isArray(this.inputData) && this.inputData.length > 1) {
        if (Array.isArray(this.inputData[0])) {
          dataSize = this.inputData[0].length
        }
      }
      return dataSize
    },
    componentTrainingReferenceSelected: {
      get() {
        return parseInt(this.training_ref.replace(/pipeline_/g, ''))
      },
      set(value) {
        this.training_ref = 'pipeline_' + value
      }
    },
    componentEvaluationReferenceSelected: {
      get() {
        return parseInt(this.evaluation_ref.replace(/pipeline_/g, ''))
      },
      set(value) {
        this.evaluation_ref = 'pipeline_' + value
      }
    }
  },
  watch: {
    inputLoading(next, prev) {
      if (next === false) {
        this.trashAction()
      }
    },
    trainingRatio(next, prev) {
      this.evaluationRatio = 1 - next
    },
    evaluationRatio(next, prev) {
      this.trainingRatio = 1 - next
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
      this.loadData(this.data)
      this.loadData(this.component.data)
      this.global.inputShape = null
      this.global.inputMatrix = null
      this.global.outputShape = null
      this.global.outputMatrix = null
      this.global.labels = null
      this.global.training = null
      this.global.evaluation = null
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
    },
    plugActionEvent(event) {
      let indexSize = this.indexMax
      let indexes = this.$tf.util.createShuffledIndices(indexSize)
      if (this.shuffle === false) {
        indexes.sort()
      }

      if (Array.isArray(this.inputData)) {
        let inputMatrix = []
        let outputMatrix = []

        for (let i = 0; i < indexSize; i++) {
          let inputRow = []
          for (let j = 0; j < this.dataSize; j++) {
            if (this.inputUnits.filter(unit => unit.key === j && unit.checked === true).length) {
              inputRow.push(parseFloat(this.inputData[i][j]))
            }
          }
          inputMatrix.push(inputRow)
          let outputRow = []
          for (let j = 0; j < this.dataSize; j++) {
            if (this.outputUnits.filter(unit => unit.key === j && unit.checked === true).length) {
              outputRow.push(parseFloat(this.inputData[i][j]))
            }
          }
          outputMatrix.push(outputRow)
        }
        if (this.indexLabel !== -1) {
          this.global.labels = this.inputData.map(x => x[this.indexLabel])
        }
        this.global.inputMatrix = inputMatrix
        this.global.inputShape = [this.inputUnits.filter(unit => unit.checked === true).length]
        this.global.outputMatrix = outputMatrix
        this.global.outputShape = [this.outputUnits.filter(unit => unit.checked === true).length]
      } else {
        let inputMatrix = []
        let outputMatrix = []
        let inputProduct = this.global.inputShape.reduce((a, b) => a * b, 1)
        let outputProduct = this.global.outputShape.reduce((a, b) => a * b, 1)
        for (let i = 0; i < indexSize; i++) {
          inputMatrix.push(
            this.global.inputMatrix.subarray(i * inputProduct, i * inputProduct + inputProduct)
          )
          outputMatrix.push(
            this.global.outputMatrix.subarray(i * outputProduct, i * outputProduct + outputProduct)
          )
        }
        this.global.inputMatrix = inputMatrix
        this.global.outputMatrix = outputMatrix
      }

      indexSize = parseInt(this.sampleSplit * indexSize)
      let trainingSize = parseInt(indexSize * this.trainingRatio)
      let output = {
        training: {
          inputMatrix: [],
          outputMatrix: [],
          labels: []
        },
        evaluation: {
          inputMatrix: [],
          outputMatrix: [],
          labels: []
        }
      }
      for (let i = 0; i < indexSize; i++) {
        let property = i < trainingSize ? 'training' : 'evaluation'

        if (this.indexLabel !== -1) {
          output[property].labels.push(this.global.labels[indexes[i]])
        }
        if (Array.isArray(this.global.inputMatrix)) {
          output[property].inputMatrix.push(this.global.inputMatrix[indexes[i]])
        }
        if (Array.isArray(this.global.outputMatrix)) {
          output[property].outputMatrix.push(this.global.outputMatrix[indexes[i]])
        }
      }
      if (this.evaluationRatio === 0) {
        output.evaluation = output.training
      }
      this.global.inputMatrix = null
      this.global.outputMatrix = null
      this.global.training = output.training
      this.global.evaluation = output.evaluation
      this.plugActionEnd(event)
    }
  }
}
</script>

<style scoped>
</style>
