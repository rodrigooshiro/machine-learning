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

        <div class="indexInput">
          <label>Label Index</label>
          <b-form-spinbutton
            v-model="indexSerie"
            min="-1"
            :max="dataSize-1"
            :formatter-fn="indexFormatter"
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
      @show="onShowModal"
    >
      <b-carousel
        :interval="0"
        :indicators="scatterPlot || perClassAccuracy || confusionMatrix"
        :controls="seriesPlot"
        :class="'carousel-loading-' + loading"
        ref="dataset-view-carousel"
      >
        <b-carousel-slide :img-blank="true" v-if="scatterPlot">
          <template v-slot:img>
            <div ref="scatterPlot"></div>
          </template>
        </b-carousel-slide>
        <b-carousel-slide :img-blank="true" v-if="perClassAccuracy">
          <template v-slot:img>
            <div ref="perClassAccuracy"></div>
          </template>
        </b-carousel-slide>
        <b-carousel-slide :img-blank="true" v-if="confusionMatrix">
          <template v-slot:img>
            <div ref="confusionMatrix"></div>
          </template>
        </b-carousel-slide>
        <b-carousel-slide :img-blank="true" v-if="seriesPlot">
          <template v-slot:img>
            <div class="text-center" ref="draw-loading">
              <div style="width: 500px; height: 400px; margin: auto; margin: 0 auto;">
                <div style="position: relative; top: 50%;">
                  <b-spinner type="grow"></b-spinner>
                </div>
              </div>
            </div>
            <div class="text-center" ref="draw"></div>
          </template>
        </b-carousel-slide>
      </b-carousel>
      <footer class="modal-footer"></footer>
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
import Plotly from 'plotly.js-dist'
import * as utilities from '../config/utilities.js'

export default {
  name: 'TSModelPredictor',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: ['layerSize', 'indexSerie'],
      layerSize: 0,
      indexSerie: -1,
      imagePage: 0,
      fileChart: false,
      scatterPlot: true,
      perClassAccuracy: true,
      confusionMatrix: true,
      seriesPlot: true,
      toggleIcon: 'caret-up'
    }
    return this.importData(data)
  },
  mounted() {
    jquery(this.$refs['dataset-view-carousel'].$el)
      .find('.carousel-control-prev')
      .on('click', this.onPrevPage)
    jquery(this.$refs['dataset-view-carousel'].$el)
      .find('.carousel-control-next')
      .on('click', this.onNextPage)
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
      disabled |= this.global.model === null
      disabled |= this.inputData === null || this.inputData.normalizationData === undefined
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
      if (this.global.model && this.global.model.layers) {
        indexMax = this.global.model.layers.length
      }
      return indexMax
    },
    dataSize() {
      let dataSize = 0
      if (Array.isArray(this.global.inputShape) && this.global.inputShape.length > 1) {
        dataSize = this.global.inputShape[0]
      }
      return dataSize
    }
  },
  watch: {
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
    loadPage() {
      jquery(this.$refs['draw-loading']).show()
      jquery(this.$refs['draw']).hide()
      jquery(this.$refs['draw']).empty()
      let inputIndex = this.indexSerie
      let inputSize = this.global.inputShape[0]
      let outputSize = this.global.outputShape[0]
      let seriesOutputX = this.global.evaluation.timestamps[this.imagePage]
      let seriesOutputY = [
        ...this.output[this.imagePage].slice(0, inputSize).map(x => x[inputIndex])
      ].concat(this.output[this.imagePage].slice(inputSize, inputSize + outputSize))
      let seriesPredictX = this.global.evaluation.timestamps[this.imagePage].slice(-outputSize)
      let seriesPredictY = [
        ...this.output[this.imagePage].slice(inputSize + outputSize, inputSize + outputSize + outputSize)
      ]

      let traceOutput = {
        name: 'True Future',
        x: seriesOutputX,
        y: seriesOutputY,
        mode: 'lines',
        marker: {
          size: 12,
          line: {
            width: 0.5
          },
          opacity: 1.0
        },
        type: 'scatter2d'
      }

      let tracePredict = {
        name: 'Model Prediction',
        x: seriesPredictX,
        y: seriesPredictY,
        mode: 'lines',
        marker: {
          size: 12,
          line: {
            width: 0.5
          },
          opacity: 1.0
        },
        type: 'scatter2d'
      }

      let layout = {
        scene: {
          xaxis: { title: 'X axis' },
          yaxis: { title: 'Y axis' }
        }
      }

      jquery(this.$refs['draw-loading']).hide()
      jquery(this.$refs['draw']).show()
      Plotly.newPlot(this.$refs['draw'], [traceOutput, tracePredict], layout)
    },
    onShowModal() {
      if (this.seriesPlot) {
        this.loadPage()
      }
    },
    onPrevPage(event) {
      if (this.loading === false) {
        this.imagePage -= 1
        if (this.imagePage < 0) {
          this.imagePage = this.output.length - 1
        }
        this.loadPage()
      }
    },
    onNextPage(event) {
      if (this.loading === false) {
        this.imagePage += 1
        if (this.imagePage > this.output.length) {
          this.imagePage = 0
        }
        this.loadPage()
      }
    },
    trashActionEvent(event) {
      jquery(this.$refs['draw']).empty()
      this.fileChart = false
      this.scatterPlot = true
      this.perClassAccuracy = true
      this.confusionMatrix = true
      this.seriesPlot = true
      if (this.inputTensor !== undefined) {
        this.inputTensor.dispose()
        delete this.inputTensor
      }
      if (this.outputTensor !== undefined) {
        this.outputTensor.dispose()
        delete this.outputTensor
      }
      this.output = null
    },
    plugActionPost(predictTensorJSON) {
      let { normalizationData } = this.inputData
      let predictData = global[predictTensorJSON.data['type']].from(predictTensorJSON.data['data'])
      if (this.predictTensor !== undefined) {
        this.predictTensor.dispose()
      }
      this.predictTensor = this.$tf.tensor(predictData, predictTensorJSON.shape)

      if (normalizationData.outputUnitsNormalize) {
        let { outputMin, outputMax } = normalizationData
        let { unnormal } = utilities.tasks.unnormalizeTensor(
          this.$tf,
          this.predictTensor,
          outputMin,
          outputMax
        )
        this.predictTensor.dispose()
        this.predictTensor = unnormal
      }
      let predictMatrix = this.predictTensor.arraySync()

      let inputMatrix = this.global.inputMatrix
      let inputShape = lodash.cloneDeep(this.global.inputShape)
      if (this.global.evaluation !== null) {
        inputMatrix = this.global.evaluation.inputMatrix
      } else if (this.global.evaluation === null && this.global.training !== null) {
        inputMatrix = this.global.training.inputMatrix
      }
      inputShape.unshift(inputMatrix.length)
      if (this.inputTensor !== undefined) {
        this.inputTensor.dispose()
      }
      this.inputTensor = this.$tf.tensor(inputMatrix, inputShape)

      let outputMatrix = this.global.outputMatrix
      let outputShape = lodash.cloneDeep(this.global.outputShape)
      if (this.global.evaluation !== null) {
        outputMatrix = this.global.evaluation.outputMatrix
      } else if (this.global.evaluation === null && this.global.training !== null) {
        outputMatrix = this.global.training.outputMatrix
      }
      outputShape.unshift(outputMatrix.length)
      if (this.global.loss === 'sparseCategoricalCrossentropy') {
        let outputMatrixSparse = []
        for (let i = 0; i < outputMatrix.length; i++) {
          let value = parseInt(outputMatrix[i][0])
          let outputRow = []
          for (let j = 0; j < this.predictTensor.shape[1]; j++) {
            outputRow.push(value === j ? 1 : 0)
          }
          outputMatrixSparse.push(outputRow)
        }
        outputShape = [outputMatrixSparse.length, this.predictTensor.shape[1]]
        outputMatrix = outputMatrixSparse
      }
      if (this.outputTensor !== undefined) {
        this.outputTensor.dispose()
      }
      this.outputTensor = this.$tf.tensor(outputMatrix, outputShape)

      let classNames = []
      let classNamesMap = []

      if (this.global.evaluation !== null && this.global.evaluation.labels.length) {
        classNamesMap = this.global.evaluation.labels
        classNames = Array.from(new Set(classNamesMap))
      } else if (
        this.global.evaluation === null &&
        this.global.training !== null &&
        this.global.training.labels.length
      ) {
        classNamesMap = this.global.training.labels
        classNames = Array.from(new Set(classNamesMap))
      } else {
        for (let i = 0; i < this.global.outputShape[0]; i++) {
          classNames.push(String(i))
        }
      }

      this.scatterPlot = false
      this.perClassAccuracy = false
      this.confusionMatrix = false
      this.seriesPlot = false

      let mul = this.inputTensor.shape[1] * this.outputTensor.shape[1] * this.predictTensor.shape[1]
      if (mul === 1) {
        this.scatterPlot = true
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
          this.$refs['scatterPlot'],
          { values: [originalValues, predictedValues], series: ['original', 'predicted'] },
          {
            width: 700,
            height: 450
          }
        )
        this.fileChart = true
      }

      this.classNames = classNames
      if (this.indexSerie > -1) {
        this.fileChart = true
        this.seriesPlot = true
        this.outputTensor.dispose()
        this.predictTensor.dispose()
      } else if (classNames.length !== 0 && this.outputTensor.shape[1] === this.predictTensor.shape[1]) {
        this.$tf.tidy(
          function() {
            let tensorUse = ['perClassAccuracy', 'confusionMatrix']
            this.perClassAccuracy = true
            this.$tfvis.metrics
              .perClassAccuracy(this.outputTensor.argMax(-1), this.predictTensor.argMax(-1))
              .then(
                function(classAccuracy) {
                  this.$tfvis.show.perClassAccuracy(
                    this.$refs['perClassAccuracy'],
                    classAccuracy,
                    classNames
                  )
                  this.fileChart = true
                  tensorUse.pop()
                  if (tensorUse.length === 0) {
                    this.outputTensor.dispose()
                    this.predictTensor.dispose()
                  }
                }.bind(this)
              )

            this.confusionMatrix = true
            this.$tfvis.metrics
              .confusionMatrix(this.outputTensor.argMax(-1), this.predictTensor.argMax(-1))
              .then(
                function(confusionMatrix) {
                  this.$tfvis.render.confusionMatrix(
                    this.$refs['confusionMatrix'],
                    { values: confusionMatrix, tickLabels: classNames },
                    {
                      width: 700,
                      height: 450
                    }
                  )
                  this.fileChart = true
                  tensorUse.pop()
                  if (tensorUse.length === 0) {
                    this.outputTensor.dispose()
                    this.predictTensor.dispose()
                  }
                }.bind(this)
              )
          }.bind(this)
        )
      } else {
        this.outputTensor.dispose()
        this.predictTensor.dispose()
      }

      let output = []
      for (let i = 0; i < inputMatrix.length; i++) {
        let row = []
        for (let j = 0; j < this.inputTensor.shape[1]; j++) {
          row.push(inputMatrix[i][j])
        }
        for (let j = 0; j < this.outputTensor.shape[1]; j++) {
          row.push(outputMatrix[i][j])
        }
        for (let j = 0; j < this.predictTensor.shape[1]; j++) {
          row.push(predictMatrix[i][j])
        }
        if (classNamesMap.length !== 0) {
          row.push(classNamesMap[i])
        }
        output.push(row)
      }
      this.inputTensor.dispose()
      this.output = output
    },
    plugActionNext(inputTensorJSON) {
      this.$options.sockets.onerror = function() {
        let worker = new Worker('worker.js')
        worker.onmessage = function(event) {
          if (event.data[0] === 'onEnd' && event.error) {
            worker.terminate()
            this.plugActionEnd(event)
          } else if (event.data[0] === 'onEnd') {
            this.plugActionPost(event.data[1])
            worker.terminate()
            this.plugActionEnd(event)
          } else if (event.data[0] === 'onError') {
            console.error(event.data[1])
            worker.terminate()
            this.plugActionEnd(event)
          }
        }.bind(this)
        this.global.model.save('indexeddb://model').then(
          function() {
            worker.postMessage(['predictor', this.getData(), inputTensorJSON])
          }.bind(this)
        )
      }.bind(this)

      this.$options.sockets.onopen = function() {
        this.global.model.save(this.$tf.io.browserHTTPRequest('./api/model')).then(
          function() {
            this.$socket.sendObj({ data: ['predictor', this.getData(), inputTensorJSON] })
          }.bind(this)
        )
      }.bind(this)

      this.$options.sockets.onmessage = function(message) {
        let event = JSON.parse(message.data)
        if (event.data[0] === 'onEnd') {
          this.plugActionPost(event.data[1])
          this.$disconnect()
          this.plugActionEnd(event)
        } else if (event.data[0] === 'onError') {
          console.error(event.data[1])
          this.$disconnect()
          this.plugActionEnd(event)
        }
      }.bind(this)

      if (process.env.VUE_APP_WEBSOCKET_API === 'true') {
        this.$connect()
      } else {
        this.$options.sockets.onerror()
      }
    },
    plugActionEvent(event) {
      this.fileChart = false
      this.scatterPlot = true
      this.perClassAccuracy = true
      this.confusionMatrix = true
      this.seriesPlot = true

      let { normalizationData } = this.inputData
      let inputMatrix = this.global.inputMatrix
      if (this.global.evaluation !== null) {
        inputMatrix = this.global.evaluation.inputMatrix
      } else if (this.global.evaluation === null && this.global.training !== null) {
        inputMatrix = this.global.training.inputMatrix
      }

      let worker = new Worker('worker.js')
      worker.onmessage = function(event) {
        if (event.data[0] === 'predictorActionEvent') {
          let inputTensorJSON = event.data[1]
          this.plugActionNext(inputTensorJSON)
          worker.terminate()
        }
      }.bind(this)
      worker.postMessage([
        'predictorActionEvent',
        this.getData(),
        inputMatrix,
        this.global.inputShape,
        normalizationData
      ])
    }
  }
}
</script>

<style scoped>
</style>
