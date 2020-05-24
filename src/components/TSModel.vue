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
          <label>Input Index (Start)</label>
          <b-form-spinbutton
            v-model="indexStart"
            min="-1"
            :max="indexMax"
            :formatter-fn="indexFormatter"
            :disabled="indexActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Input Index (End)</label>
          <b-form-spinbutton
            v-model="indexEnd"
            min="-1"
            :max="indexMax"
            :formatter-fn="indexFormatter"
            :disabled="indexActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Label Index</label>
          <b-form-spinbutton
            v-model="indexLabel"
            min="-1"
            :max="indexMax"
            :formatter-fn="indexFormatter"
            :disabled="indexActionDisabled"
          ></b-form-spinbutton>
        </div>
      </b-form>

      <b-form inline>
        <div class="indexInput">
          <label>Total Layers</label>
          <b-form-spinbutton
            v-model="layerSize"
            min="2"
            placeholder="--"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Input Shape</label>
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
                    min="1"
                    :formatter-fn="positiveFormatter"
                    :disabled="true"
                  ></b-form-spinbutton>
                </div>
              </b-form>

              <label v-if="inputShape.length > 0">Values</label>
              <template v-for="i in inputShape.length">
                <b-form v-bind:key="i" inline>
                  <div class="indexInput">
                    <b-form-spinbutton
                      v-model="inputShape[i-1]"
                      min="1"
                      :max="shapeMax"
                      :formatter-fn="positiveFormatter"
                      :disabled="!indexActionDisabled && editActionDisabled"
                    ></b-form-spinbutton>
                  </div>
                </b-form>
              </template>
            </b-dropdown-form>
          </b-dropdown>
        </div>
      </b-form>

      <template v-for="i in layerSize">
        <b-form v-bind:key="i" inline>
          <div class="indexInput">
            <label>Layer {{ i }} (class)</label>
            <b-form-select
              v-model="layerName[i-1]"
              :options="layerNameOptions"
              :disabled="editActionDisabled"
            ></b-form-select>
          </div>

          <div class="indexInput">
            <label>Layer {{ i }} (units)</label>
            <b-form-spinbutton
              v-model="units[i-1]"
              min="0"
              :formatter-fn="positiveFormatter"
              :disabled="editActionDisabled"
            ></b-form-spinbutton>
          </div>

          <div class="indexInput">
            <label>Layer {{ i }} (kernelSize)</label>
            <b-form-spinbutton
              v-model="kernelSize[i-1]"
              min="0"
              :formatter-fn="positiveFormatter"
              :disabled="editActionDisabled"
            ></b-form-spinbutton>
          </div>

          <div class="indexInput">
            <label>Layer {{ i }} (filters)</label>
            <b-form-spinbutton
              v-model="filters[i-1]"
              min="-1"
              :formatter-fn="indexFormatter"
              :disabled="editActionDisabled"
            ></b-form-spinbutton>
          </div>

          <div class="indexInput">
            <label>Layer {{ i }} (strides)</label>
            <b-dropdown
              text="strides"
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
                      v-model="stridesLength[i-1]"
                      min="0"
                      :formatter-fn="positiveFormatter"
                      :disabled="editActionDisabled"
                    ></b-form-spinbutton>
                  </div>
                </b-form>

                <label v-if="strides[i-1].length > 0">Values</label>
                <template v-for="j in strides[i-1].length">
                  <b-form v-bind:key="j" inline>
                    <div class="indexInput">
                      <b-form-spinbutton
                        v-model="strides[i-1][j-1]"
                        min="0"
                        :formatter-fn="indexFormatter"
                        :disabled="editActionDisabled"
                      ></b-form-spinbutton>
                    </div>
                  </b-form>
                </template>
              </b-dropdown-form>
            </b-dropdown>
          </div>

          <div class="indexInput">
            <label>Layer {{ i }} (poolSize)</label>
            <b-dropdown
              text="poolSize"
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
                      v-model="poolSizeLength[i-1]"
                      min="0"
                      :formatter-fn="positiveFormatter"
                      :disabled="editActionDisabled"
                    ></b-form-spinbutton>
                  </div>
                </b-form>

                <label v-if="poolSize[i-1].length > 0">Values</label>
                <template v-for="j in poolSize[i-1].length">
                  <b-form v-bind:key="j" inline>
                    <div class="indexInput">
                      <b-form-spinbutton
                        v-model="poolSize[i-1][j-1]"
                        min="0"
                        :formatter-fn="indexFormatter"
                        :disabled="editActionDisabled"
                      ></b-form-spinbutton>
                    </div>
                  </b-form>
                </template>
              </b-dropdown-form>
            </b-dropdown>
          </div>

          <div class="indexInput">
            <label>
              <span>Layer {{ i }} (activation)</span>
            </label>
            <b-form-select
              v-model="activation[i-1]"
              :options="activationOptions"
              :disabled="editActionDisabled"
            ></b-form-select>
          </div>

          <div class="indexInput">
            <label>Layer ({{ i }} kernel initializer)</label>
            <b-form-select
              v-model="kernelInitializer[i-1]"
              :options="kernelInitializerOptions"
              :disabled="editActionDisabled"
            ></b-form-select>
          </div>

          <div class="indexInput">
            <label>Layer {{ i }} (bias initializer)</label>
            <b-form-select
              v-model="biasInitializer[i-1]"
              :options="biasInitializerOptions"
              :disabled="editActionDisabled"
            ></b-form-select>
          </div>
        </b-form>
      </template>
    </b-collapse>
    <div style="margin-top: 8px;"></div>
    <b-modal
      :id="'model-view-' + component.index"
      title="TS Model View"
      :static="true"
      :hide-footer="true"
      size="lg"
      @show="onShowModal"
    >
      <b-carousel :interval="0" :indicators="true">
        <b-carousel-slide :img-blank="true">
          <template v-slot:img>
            <div ref="draw"></div>
          </template>
        </b-carousel-slide>
        <b-carousel-slide :img-blank="true">
          <template v-slot:img>
            <div ref="graph"></div>
          </template>
        </b-carousel-slide>
      </b-carousel>
      <footer class="modal-footer"></footer>
      <footer class="modal-footer"></footer>
      <footer class="modal-footer"></footer>
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
import * as tf from '@tensorflow/tfjs'
import ModelView from 'tfjs-model-view'
import jquery from 'jquery'
import definitions from '../config/definitions.js'

export default {
  name: 'TSModel',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: [
        'indexStart',
        'indexEnd',
        'indexLabel',
        'layerSize',
        'inputShape',
        'layerName',
        'units',
        'kernelSize',
        'filters',
        'strides',
        'poolSize',
        'activation',
        'kernelInitializer',
        'biasInitializer'
      ],
      toggleIcon: 'caret-up',
      indexStart: -1,
      indexEnd: -1,
      indexLabel: -1,
      layerSize: 0,
      inputShape: [],
      layerName: [],
      units: [],
      kernelSize: [],
      filters: [],
      strides: [],
      poolSize: [],
      activation: [],
      kernelInitializer: [],
      biasInitializer: [],
      layerNameOptions: definitions.tf.layer.options,
      activationOptions: definitions.tf.layer.activation.options,
      kernelInitializerOptions: definitions.tf.initializers.options,
      biasInitializerOptions: definitions.tf.initializers.options,
      inputShapeLength: 0,
      stridesLength: [],
      poolSizeLength: [],
      fileChart: false
    }
    return this.importData(data)
  },
  computed: {
    indexActionDisabled() {
      let disabled = 0
      disabled |= this.editActionDisabled === true
      disabled |= !Array.isArray(this.inputData) && Object.isExtensible(this.inputData)
      return disabled === 1
    },
    editActionDisabled() {
      let disabled = 0
      disabled |= this.indexMax === 0
      return disabled === 1
    },
    downloadActionDisabled() {
      return true
    },
    trashActionDisabled() {
      let disabled = 0
      disabled |= this.indexMax === 0
      return disabled === 1
    },
    plugActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.indexMax === 0
      disabled |= this.shapeMax === 0
      disabled |= !this.indexActionDisabled && this.indexEnd <= this.indexStart
      return disabled === 1
    },
    imageActionDisabled() {
      let disabled = 0
      disabled |= this.fileChart === false
      return disabled === 1
    },
    indexMax() {
      let indexMax = 0
      if (this.inputData && Array.isArray(this.inputData) && this.inputData.length > 0) {
        indexMax = this.inputData[0].length - 1
      } else if (this.inputData && Object.isExtensible(this.inputData)) {
        if ('datasetImages' in this.inputData) {
          indexMax = this.inputData['datasetImages'].length - 1
        }
      }
      return indexMax
    },
    shapeMax() {
      let shapeMax = this.indexEnd - this.indexStart + 1
      return shapeMax
    }
  },
  watch: {
    inputShape: {
      deep: true,
      handler(next, prev) {
        this.inputShapeLength = this.inputShape.length
      }
    },
    inputShapeLength: {
      deep: true,
      handler(value, prev) {
        while (this.inputShape.length > value) {
          this.inputShape.pop()
        }
        while (this.inputShape.length < value) {
          this.inputShape.push(1)
        }
      }
    },
    strides: {
      deep: true,
      handler(next, prev) {
        this.stridesLength = []
        for (let i = 0; i < this.strides.length; i++) {
          this.stridesLength.push(this.strides[i].length)
        }
      }
    },
    stridesLength: {
      deep: true,
      handler(next, prev) {
        for (let i = 0; i < this.stridesLength.length; i++) {
          let value = this.stridesLength[i]
          while (this.strides[i].length > value) {
            this.strides[i].pop()
          }
          while (this.strides[i].length < value) {
            this.strides[i].push(0)
          }
        }
      }
    },
    poolSize: {
      deep: true,
      handler(next, prev) {
        this.poolSizeLength = []
        for (let i = 0; i < this.poolSize.length; i++) {
          this.poolSizeLength.push(this.poolSize[i].length)
        }
      }
    },
    poolSizeLength: {
      deep: true,
      handler(next, prev) {
        for (let i = 0; i < this.poolSizeLength.length; i++) {
          let value = this.poolSizeLength[i]
          while (this.poolSize[i].length > value) {
            this.poolSize[i].pop()
          }
          while (this.poolSize[i].length < value) {
            this.poolSize[i].push(0)
          }
        }
      }
    },
    layerSize(next, prev) {
      this.validateData()
    },
    shapeMax(next, prev) {
      if (this.inputShape > next) {
        if (this.indexActionDisabled === false) {
          this.inputShape[0] = next
        }
      }
    },
    inputLoading(next, prev) {
      if (next === false) {
        this.trashAction()
        if (this.inputData !== null) {
          if (
            'spriteWidth' in this.inputData &&
            'spriteHeight' in this.inputData &&
            'spriteChannels' in this.inputData
          ) {
            this.inputShape = [
              this.inputData['spriteWidth'],
              this.inputData['spriteHeight'],
              this.inputData['spriteChannels']
            ]
          }
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
    onShowModal() {
      global.tfvis.show.modelSummary(this.$refs['draw'], this.output.model)
    },
    validateData() {
      let keys = [
        'layerName',
        'units',
        'kernelSize',
        'filters',
        'strides',
        'poolSize',
        'activation',
        'kernelInitializer',
        'biasInitializer'
      ]
      keys.forEach(value => {
        while (this[value].length > this.layerSize) {
          this[value].pop()
        }
      })
      while (this.layerName.length < this.layerSize) {
        this.layerName.push('dense')
      }
      keys = ['units', 'kernelSize']
      keys.forEach(value => {
        while (this[value].length < this.layerSize) {
          this[value].push(0)
        }
      })
      while (this.filters.length < this.layerSize) {
        this.filters.push(-1)
      }
      keys = ['strides', 'poolSize']
      keys.forEach(value => {
        while (this[value].length < this.layerSize) {
          this[value].push([])
        }
      })
      keys = ['activation', 'kernelInitializer', 'biasInitializer']
      keys.forEach(value => {
        while (this[value].length < this.layerSize) {
          this[value].push('--')
        }
      })
    },
    trashAction(event) {
      jquery(this.$refs['draw']).empty()
      jquery(this.$refs['graph']).empty()
      this.fileChart = false
      this.output = null
      this.loadData(this.data)
      this.loadData(this.component.data)
    },
    plugAction(event) {
      this.loading = true
      let model = tf.sequential()
      for (let i = 0; i < this.layerSize; i++) {
        let layer = {}
        if (i === 0) {
          if (this.inputShape.length === 1) {
            layer.inputShape = this.inputShape[0]
          } else {
            layer.inputShape = this.inputShape
          }
        }
        if (this.units[i] !== 0) {
          layer.units = this.units[i]
        }
        if (this.kernelSize[i] !== 0) {
          layer.kernelSize = this.kernelSize[i]
        }
        if (this.filters[i] !== -1) {
          layer.filters = this.filters[i]
        }
        if (this.strides[i].length === 1) {
          layer.strides = this.strides[i][0]
        }
        if (this.strides[i].length > 1) {
          layer.strides = this.strides[i]
        }
        if (this.poolSize[i].length === 1) {
          layer.poolSize = this.poolSize[i][0]
        }
        if (this.poolSize[i].length > 1) {
          layer.poolSize = this.poolSize[i]
        }
        if (this.activation[i] !== '--') {
          layer.activation = this.activation[i]
        }
        if (this.kernelInitializer[i] !== '--') {
          layer.kernelInitializer = this.kernelInitializer[i]
        }
        if (this.biasInitializer[i] !== '--') {
          layer.useBias = true
          layer.biasInitializer = this.biasInitializer[i]
        }
        model.add(tf.layers[this.layerName[i]](layer))
      }
      model.inputData = this.inputData
      this.fileChart = true
      this.output = {
        model: model,
        data: this.inputData,
        indexLabel: this.indexLabel
      }

      let modelView = new ModelView(model, {
        width: 765,
        height: 465,
        appendImmediately: false,
        renderer: 'd3',
        radius: 10,
        layerPadding: 100,
        printStats: false,
        renderLinks: true
      })
      jquery(this.$refs['graph']).empty()
      this.$refs['graph'].appendChild(modelView.getDOMElement())

      setTimeout(
        function() {
          this.loading = false
        }.bind(this),
        1
      )
    }
  }
}
</script>

<style scoped>
</style>
