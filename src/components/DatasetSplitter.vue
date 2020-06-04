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
          <label>Input (shape)</label>
          <b-dropdown
            text="shape"
            no-flip
            split
            split-variant="outline-secondary"
            block
            variant="secondary"
            :disabled="editActionDisabled"
          >
            <b-dropdown-form style="text-align: left">
              <b-form inline>
                <div class="indexInput">
                  <label>Dimensions</label>
                  <b-form-spinbutton
                    v-model="inputShapeLength"
                    min="0"
                    :formatter-fn="positiveFormatter"
                    :disabled="editActionDisabled || unitsActionDisabled"
                  ></b-form-spinbutton>
                </div>
              </b-form>

              <label v-if="inputShape.length > 0">Values</label>
              <template v-for="i in inputShape.length">
                <b-form v-bind:key="i" inline>
                  <div class="indexInput">
                    <b-form-spinbutton
                      v-model="inputShape[i-1]"
                      min="0"
                      :formatter-fn="indexFormatter"
                      :disabled="editActionDisabled || unitsActionDisabled"
                    ></b-form-spinbutton>
                  </div>
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
          <label>Output (shape)</label>
          <b-dropdown
            text="shape"
            no-flip
            split
            split-variant="outline-secondary"
            block
            variant="secondary"
            :disabled="editActionDisabled"
          >
            <b-dropdown-form style="text-align: left">
              <b-form inline>
                <div class="indexInput">
                  <label>Dimensions</label>
                  <b-form-spinbutton
                    v-model="outputShapeLength"
                    min="0"
                    :formatter-fn="positiveFormatter"
                    :disabled="editActionDisabled || unitsActionDisabled"
                  ></b-form-spinbutton>
                </div>
              </b-form>

              <label v-if="outputShape.length > 0">Values</label>
              <template v-for="i in outputShape.length">
                <b-form v-bind:key="i" inline>
                  <div class="indexInput">
                    <b-form-spinbutton
                      v-model="outputShape[i-1]"
                      min="0"
                      :formatter-fn="indexFormatter"
                      :disabled="editActionDisabled || unitsActionDisabled"
                    ></b-form-spinbutton>
                  </div>
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
          <label>History Size</label>
          <b-form-spinbutton
            v-model="historySize"
            min="0"
            max="9999"
            :formatter-fn="positiveFormatter"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Target Size</label>
          <b-form-spinbutton
            v-model="targetSize"
            min="0"
            max="9999"
            :formatter-fn="positiveFormatter"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Step Size</label>
          <b-form-spinbutton
            v-model="stepSize"
            min="0"
            max="9999"
            :formatter-fn="positiveFormatter"
            :disabled="editActionDisabled"
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
        'inputShape',
        'inputShapeLength',
        'outputShape',
        'outputShapeLength',
        'historySize',
        'targetSize',
        'stepSize',
        'indexLabel'
      ],
      toggleIcon: 'caret-up',
      shuffle: true,
      sampleSplit: 1,
      trainingRatio: 1,
      inputUnits: [],
      outputUnits: [],
      inputShape: [],
      inputShapeLength: 0,
      outputShape: [],
      outputShapeLength: 0,
      indexLabel: -1,
      historySize: 0,
      targetSize: 0,
      stepSize: 0,
      types: {},
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
      disabled |= this.indexMax === Infinity
      if (Array.isArray(this.inputData) && this.inputData.length > 0) {
        let inputSize = this.inputUnits.filter(unit => unit.checked === true).length
        let outputSize = this.outputUnits.filter(unit => unit.checked === true).length
        disabled |= inputSize + outputSize === 0
        if (this.historySize > 0) {
          disabled |= this.historySize % this.stepSize !== 0
        } else {
          if (this.inputShapeLength > 0) {
            let inputProduct = this.inputShape.reduce((a, b) => a * b, 1)
            disabled |= inputProduct !== inputSize
          }
          if (this.outputShapeLength > 0) {
            let outputProduct = this.outpuptShape.reduce((a, b) => a * b, 1)
            disabled |= outputProduct !== outputSize
          }
        }
      }
      disabled |= this.loading === true
      return disabled === 1
    },
    indexMax() {
      let indexMax = Infinity
      if (Array.isArray(this.inputData) && this.inputData.length > 0) {
        indexMax = this.inputData.length
      }
      if (ArrayBuffer.isView(this.global.inputMatrix)) {
        let product = this.inputShape.reduce((a, b) => a * b, 1)
        let length = this.global.inputMatrix.length / product
        indexMax = Math.min(indexMax, length)
      }
      if (ArrayBuffer.isView(this.global.outputMatrix)) {
        let product = this.outputShape.reduce((a, b) => a * b, 1)
        let length = this.global.outputMatrix.length / product
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
    trainingRatio(next, prev) {
      this.evaluationRatio = 1 - next
    },
    evaluationRatio(next, prev) {
      this.trainingRatio = 1 - next
    },
    inputShape: {
      handler(next, prev) {
        this.inputShapeLength = this.inputShape.length
      }
    },
    inputShapeLength: {
      handler(next, prev) {
        while (this.inputShape.length > this.inputShapeLength) {
          this.inputShape.pop()
        }
        while (this.inputShape.length < this.inputShapeLength) {
          this.inputShape.push(0)
        }
      }
    },
    outputShape: {
      handler(next, prev) {
        this.outputShapeLength = this.outputShape.length
      }
    },
    outputShapeLength: {
      handler(next, prev) {
        while (this.outputShape.length > this.outputShapeLength) {
          this.outputShape.pop()
        }
        while (this.outputShape.length < this.outputShapeLength) {
          this.outputShape.push(0)
        }
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
    validateActionEvent(event) {
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
      this.inputUnits.sort(function(a, b) {
        return a.key === b.key ? 0 : a.key < b.key ? -1 : 1
      })
      this.outputUnits.sort(function(a, b) {
        return a.key === b.key ? 0 : a.key < b.key ? -1 : 1
      })
    },
    trashActionEvent(event) {
      this.global.inputShape = null
      this.global.outputShape = null
      if (this.trainingRatio > 0) {
        this.global.training = null
      }
      if (this.evaluationRatio > 0) {
        this.global.evaluation = null
      }
    },
    parseColumn(column, value) {
      let number = parseFloat(value)
      if (isNaN(number)) {
        if (!(column in this.types)) {
          this.types[column] = new Map()
        }
        if (!this.types[column].has(value)) {
          this.types[column].set(value, this.types[column].size)
        }
        number = Object.fromEntries(this.types[column])[value]
      }
      return number
    },
    plugActionEvent(event) {
      let indexSize = parseInt(this.sampleSplit * this.indexMax)
      let inputMatrix = []
      let outputMatrix = []
      let inputShape = []
      let outputShape = []
      let labels = []

      if (this.inputShapeLength > 0) {
        inputShape = this.inputShape
      } else {
        inputShape = [this.inputUnits.filter(unit => unit.checked === true).length]
      }
      if (this.outputShapeLength > 0) {
        outputShape = this.outputShape
      } else {
        outputShape = [this.outputUnits.filter(unit => unit.checked === true).length]
      }

      if (Array.isArray(this.inputData)) {
        for (let i = 0; i < indexSize; i++) {
          let inputRow = []
          for (let j = 0; j < this.dataSize; j++) {
            if (this.inputUnits.filter(unit => unit.key === j && unit.checked === true).length) {
              inputRow.push(this.parseColumn(j, this.inputData[i][j]))
            }
          }
          inputMatrix.push(inputRow)
          let outputRow = []
          for (let j = 0; j < this.dataSize; j++) {
            if (this.outputUnits.filter(unit => unit.key === j && unit.checked === true).length) {
              outputRow.push(this.parseColumn(j, this.inputData[i][j]))
            }
          }
          outputMatrix.push(outputRow)
        }
        if (this.indexLabel !== -1) {
          labels = this.inputData.map(x => this.parseColumn(this.indexLabel, x[this.indexLabel]))
        }
      } else {
        let inputProduct = inputShape.reduce((a, b) => a * b, 1)
        let outputProduct = outputShape.reduce((a, b) => a * b, 1)
        for (let i = 0; i < indexSize; i++) {
          inputMatrix.push(
            this.global.inputMatrix.subarray(i * inputProduct, i * inputProduct + inputProduct)
          )
          outputMatrix.push(
            this.global.outputMatrix.subarray(i * outputProduct, i * outputProduct + outputProduct)
          )
        }
      }

      if (this.historySize > 0) {
        indexSize -= this.historySize + this.targetSize
        let inputMatrixTemp = []
        let outputMatrixTemp = []
        if (this.outputUnits.filter(unit => unit.checked === true).length === 1) {
          outputMatrix = outputMatrix.map(x => x[0])
        }
        for (let i = 0; i < indexSize; i++) {
          let matrix = []
          for (let j = 0; j < this.historySize / this.stepSize; j++) {
            matrix.push(...inputMatrix.slice(i + j * this.stepSize, i + j * this.stepSize + 1))
          }
          inputMatrixTemp.push(matrix)
          matrix = [...outputMatrix.slice(i + this.historySize, i + this.historySize + this.targetSize)]
          outputMatrixTemp.push(matrix)
        }
        inputMatrix = inputMatrixTemp
        outputMatrix = outputMatrixTemp
      }

      let indexes = this.$tf.util.createShuffledIndices(indexSize)
      if (this.shuffle === false) {
        indexes.sort()
      }

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
          output[property].labels.push(labels[indexes[i]])
        }
        if (Array.isArray(inputMatrix)) {
          output[property].inputMatrix.push(inputMatrix[indexes[i]])
        }
        if (Array.isArray(outputMatrix)) {
          output[property].outputMatrix.push(outputMatrix[indexes[i]])
        }
      }
      this.global.inputShape = inputShape
      this.global.outputShape = outputShape
      if (this.trainingRatio > 0) {
        this.global.training = output.training
      }
      if (this.evaluationRatio > 0) {
        this.global.evaluation = output.evaluation
      }
      this.plugActionEnd(event)
    }
  }
}
</script>

<style scoped>
</style>
