<template>
  <component-layout :component.sync="component" :length.sync="length" :loading.sync="loading">
    <b-form class="form-toolbar-rtl" inline>
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
          <label>Label Index</label>
          <b-form-spinbutton
            v-model="indexSerie"
            min="0"
            :max="dataSize-1"
            :formatter-fn="indexFormatter"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>
      </b-form>
    </b-collapse>

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
        :controls="true"
        :class="'carousel-loading-' + loading"
        ref="dataset-view-carousel"
      >
        <b-carousel-slide :img-blank="true">
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
import Plotly from 'plotly.js-dist'

export default {
  name: 'DatasetSeries',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: ['indexSerie'],
      toggleIcon: 'caret-up',
      indexSerie: 0,
      imagePage: 0
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
      disabled |= this.loading === true
      disabled |= this.dataSize === 0
      return disabled === 1
    },
    imageActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.dataSize === 0
      disabled |= this.inputData === null
      return disabled === 1
    },
    dataSize() {
      let dataSize = 0
      if (Array.isArray(this.global.inputShape) && this.global.inputShape.length > 1) {
        dataSize = this.global.inputShape[0]
      }
      return dataSize
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
      this.loading = true
      this.$emit('onPlugAction', this.loading)
      jquery(this.$refs['draw-loading']).show()
      jquery(this.$refs['draw']).hide()
      jquery(this.$refs['draw']).empty()
      let inputIndex = this.indexSerie
      let inputSize = this.global.inputShape[0]
      let outputSize = this.global.outputShape[0]
      let seriesOutputX = this.global.evaluation.timestamps[this.imagePage]
      let seriesOutputY = [
        ...this.inputData[this.imagePage].slice(0, inputSize).map(x => x[inputIndex])
      ].concat(this.inputData[this.imagePage].slice(inputSize, inputSize + outputSize))
      let seriesPredictX = this.global.evaluation.timestamps[this.imagePage].slice(-outputSize)
      let seriesPredictY = [
        ...this.inputData[this.imagePage].slice(
          inputSize + outputSize,
          inputSize + outputSize + outputSize
        )
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
        name: 'Predicted Future',
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
      this.loading = false
      this.$emit('onPlugAction', this.loading)
      Plotly.newPlot(this.$refs['draw'], [traceOutput, tracePredict], layout)
    },
    onShowModal() {
      this.loadPage()
    },
    onPrevPage(event) {
      if (this.loading === false) {
        this.imagePage -= 1
        if (this.imagePage < 0) {
          this.imagePage = this.inputData.length - 1
        }
        this.loadPage()
      }
    },
    onNextPage(event) {
      if (this.loading === false) {
        this.imagePage += 1
        if (this.imagePage > this.inputData.length) {
          this.imagePage = 0
        }
        this.loadPage()
      }
    },
    trashActionEvent(event) {
      jquery(this.$refs['draw']).empty()
    },
    plugActionEvent(event) {
      this.plugActionEnd(event)
    }
  }
}
</script>

<style scoped>
.fileTable {
  width: 100% !important;
  height: 200px !important;
  border: 3px solid #ced4da !important;
  border-radius: 0.25rem !important;
  white-space: nowrap;
  overflow: auto;
  resize: none;
}
</style>
