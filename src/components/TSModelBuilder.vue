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
          <label>Total Layers</label>
          <b-form-spinbutton
            v-model="layerSize"
            min="2"
            placeholder="--"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>
      </b-form>

      <template v-for="i in layerSize">
        <b-form v-bind:key="i" inline>
          <div class="indexInput">
            <label>Layer {{ i }} (class)</label>
            <b-form-select
              v-model="layerName[i-1]"
              :options="utilities.tf.layer.options"
              :disabled="editActionDisabled"
            ></b-form-select>
          </div>

          <div
            class="indexInput"
            v-if="utilities.tf.layer.args[layerName[i-1]].indexOf('units') !== -1"
          >
            <label>Layer {{ i }} (units)</label>
            <b-form-spinbutton
              v-model="units[i-1]"
              min="0"
              :formatter-fn="positiveFormatter"
              :disabled="editActionDisabled"
            ></b-form-spinbutton>
          </div>

          <div
            class="indexInput"
            v-if="utilities.tf.layer.args[layerName[i-1]].indexOf('kernelSize') !== -1"
          >
            <label>Layer {{ i }} (kernelSize)</label>
            <b-form-spinbutton
              v-model="kernelSize[i-1]"
              min="0"
              :formatter-fn="positiveFormatter"
              :disabled="editActionDisabled"
            ></b-form-spinbutton>
          </div>

          <div
            class="indexInput"
            v-if="utilities.tf.layer.args[layerName[i-1]].indexOf('filters') !== -1"
          >
            <label>Layer {{ i }} (filters)</label>
            <b-form-spinbutton
              v-model="filters[i-1]"
              min="-1"
              :formatter-fn="indexFormatter"
              :disabled="editActionDisabled"
            ></b-form-spinbutton>
          </div>

          <div
            class="indexInput"
            v-if="utilities.tf.layer.args[layerName[i-1]].indexOf('strides') !== -1"
          >
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

          <div
            class="indexInput"
            v-if="utilities.tf.layer.args[layerName[i-1]].indexOf('poolSize') !== -1"
          >
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

          <div
            class="indexInput"
            v-if="utilities.tf.layer.args[layerName[i-1]].indexOf('activation') !== -1"
          >
            <label>
              <span>Layer {{ i }} (activation)</span>
            </label>
            <b-form-select
              v-model="activation[i-1]"
              :options="utilities.tf.layer.activation.options"
              :disabled="editActionDisabled"
            ></b-form-select>
          </div>

          <div
            class="indexInput"
            v-if="utilities.tf.layer.args[layerName[i-1]].indexOf('kernelInitializer') !== -1"
          >
            <label>Layer ({{ i }} kernel initializer)</label>
            <b-form-select
              v-model="kernelInitializer[i-1]"
              :options="utilities.tf.initializers.options"
              :disabled="editActionDisabled"
            ></b-form-select>
          </div>

          <div
            class="indexInput"
            v-if="utilities.tf.layer.args[layerName[i-1]].indexOf('biasInitializer') !== -1"
          >
            <label>Layer {{ i }} (bias initializer)</label>
            <b-form-select
              v-model="biasInitializer[i-1]"
              :options="utilities.tf.initializers.options"
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
import ModelView from 'tfjs-model-view'
import jquery from 'jquery'
import * as utilities from '../config/utilities.js'

export default {
  name: 'TSModelBuilder',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: [
        'layerSize',
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
      utilities: utilities,
      layerSize: 0,
      layerName: [],
      units: [],
      kernelSize: [],
      filters: [],
      strides: [],
      poolSize: [],
      activation: [],
      kernelInitializer: [],
      biasInitializer: [],
      stridesLength: [],
      poolSizeLength: [],
      inputShape: null,
      fileChart: false
    }
    return this.importData(data)
  },
  computed: {
    editActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.global.inputShape === null
      return disabled === 1
    },
    trashActionDisabled() {
      return this.editActionDisabled
    },
    plugActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.global.inputShape === null
      for (let i = 0; i < this.layerSize; i++) {
        if (this.layerName[i] === 'dense') {
          disabled |= this.units[i] === 0
          disabled |= this.activation[i] === '--'
        }
      }
      return disabled === 1
    },
    imageActionDisabled() {
      let disabled = 0
      disabled |= this.fileChart === false
      return disabled === 1
    }
  },
  watch: {
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
      this.validateAction()
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
    onShowModal() {
      this.$tfvis.show.modelSummary(this.$refs['draw'], this.global.model)
      let modelView = new ModelView(this.global.model, {
        width: 765,
        height: 465,
        appendImmediately: true,
        renderer: 'd3',
        radius: 15,
        layerPadding: 100,
        printStats: false,
        renderLinks: true
      })
      jquery(this.$refs['graph']).empty()
      this.$refs['graph'].appendChild(modelView.getDOMElement())
    },
    validateActionEvent(event) {
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
      this.inputShape = this.global.inputShape
    },
    trashActionEvent(event) {
      jquery(this.$refs['draw']).empty()
      jquery(this.$refs['graph']).empty()
      this.fileChart = false
      if (this.global.model !== null) {
        this.global.model.dispose()
        this.global.model = null
      }
    },
    plugActionEvent(event) {
      this.$options.sockets.onerror = function() {
        let worker = new Worker('worker.js')
        worker.onmessage = function(event) {
          if (event.data[0] === 'onEnd' && event.error) {
            worker.terminate()
            this.plugActionEnd(event)
          } else if (event.data[0] === 'onEnd') {
            this.$tf.loadLayersModel('indexeddb://model').then(
              function(model) {
                this.global.model = model
                this.fileChart = true
                worker.terminate()
                this.plugActionEnd(event)
              }.bind(this)
            )
          }
        }.bind(this)
        worker.postMessage(['builder', this.$data])
      }.bind(this)

      this.$options.sockets.onopen = function() {
        this.$socket.sendObj({ data: ['builder', this.$data] })
      }.bind(this)

      this.$options.sockets.onmessage = function(message) {
        let event = JSON.parse(message.data)
        if (event.data[0] === 'onEnd') {
          this.$tf.loadLayersModel('./api/model/model.json').then(
            function(model) {
              this.global.model = model
              this.fileChart = true
              this.$disconnect()
              this.plugActionEnd(event)
            }.bind(this)
          )
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
