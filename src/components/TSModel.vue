<template>
  <b-form-group>
    <h4 v-if="component.title" class="card-title" v-html="component.title"></h4>
    <b-card-text v-if="component.description" v-html="component.description"></b-card-text>
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
            min="0"
            :max="indexMax"
            placeholder="--"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Input Index (End)</label>
          <b-form-spinbutton
            v-model="indexEnd"
            min="0"
            :max="indexMax"
            placeholder="--"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Label Index</label>
          <b-form-spinbutton
            v-model="indexLabel"
            min="-1"
            :max="indexMax"
            :formatter-fn="indexFormatter"
            :disabled="editActionDisabled"
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
          <b-form-spinbutton
            v-model="inputShape"
            min="1"
            :max="shapeMax"
            placeholder="--"
            :disabled="editActionDisabled"
          ></b-form-spinbutton>
        </div>
      </b-form>

      <template v-for="i in layerSize">
        <b-form v-bind:key="i" inline>
          <div class="indexInput">
            <label>Layer (units)</label>
            <b-form-spinbutton
              v-model="layerUnits[i-1]"
              min="1"
              placeholder="--"
              :disabled="editActionDisabled"
            ></b-form-spinbutton>
          </div>

          <div class="indexInput">
            <label>
              <span>Layer (activation)</span>
            </label>
            <b-form-select
              v-model="activationSelected[i-1]"
              :options="activationOptions"
              :disabled="editActionDisabled"
            ></b-form-select>
          </div>

          <div class="indexInput">
            <label>Layer (kernel initializer)</label>
            <b-form-select
              v-model="kernelInitializerSelected[i-1]"
              :options="kernelInitializerOptions"
              :disabled="editActionDisabled"
            ></b-form-select>
          </div>

          <div class="indexInput">
            <label>Layer (bias initializer)</label>
            <b-form-select
              v-model="biasInitializerSelected[i-1]"
              :options="biasInitializerOptions"
              :disabled="editActionDisabled"
            ></b-form-select>
          </div>
        </b-form>
      </template>
    </b-collapse>
    <div style="margin-top: 8px;"></div>
    <ToolbarFooter
      :index.sync="component.index"
      :input_ref="component.input_ref"
      :length.sync="length"
      :loading.sync="loading"
    />

    <b-modal
      :id="'model-view-' + component.index"
      title="TS Model View"
      :static="true"
      :hide-footer="true"
      size="lg"
      @show="onShowModal"
    >
      <div ref="draw"></div>
    </b-modal>
  </b-form-group>
</template>

<script>
import ToolbarFooter from './ToolbarFooter.vue'
import { mixin } from './mixin'
import * as tf from '@tensorflow/tfjs'
// import ModelView from 'tfjs-model-view'
import jquery from 'jquery'
import { activationOptions } from '@tensorflow/tfjs-layers/dist/keras_format/activation_config.js'

export default {
  name: 'TSModel',
  components: { ToolbarFooter },
  mixins: [mixin],
  data() {
    let data = {
      serializable: ['indexStart', 'indexEnd', 'indexLabel', 'layerSize', 'inputShape', 'layerUnits', 'activationSelected', 'kernelInitializerSelected', 'biasInitializerSelected'],
      toggleIcon: 'caret-up',
      indexStart: 0,
      indexEnd: 0,
      indexLabel: null,
      layerSize: 0,
      inputShape: 0,
      layerUnits: [],
      activationSelected: [],
      activationOptions: activationOptions.map(x => x.replace(/hard_sigmoid/g, 'hardSigmoid')).sort(),
      kernelInitializerSelected: [],
      kernelInitializerOptions: Object.keys(tf.initializers).sort(),
      biasInitializerSelected: [],
      biasInitializerOptions: Object.keys(tf.initializers).sort(),
      fileChart: false
    }
    return this.importData(data)
  },
  computed: {
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
      disabled |= this.indexEnd <= this.indexStart
      return disabled === 1
    },
    imageActionDisabled() {
      let disabled = 0
      disabled |= this.fileChart === false
      return disabled === 1
    },
    indexMax() {
      let indexMax = 0
      if (this.inputData && this.inputData.length > 0) {
        indexMax = this.inputData[0].length - 1
      }
      return indexMax
    },
    shapeMax() {
      let shapeMax = this.indexEnd - this.indexStart + 1
      return shapeMax
    }
  },
  watch: {
    layerSize(next, prev) {
      while (this.activationSelected.length > next) {
        this.layerUnits.pop()
        this.activationSelected.pop()
        this.activationOptions.pop()
        this.kernelInitializerSelected.pop()
        this.kernelInitializerOptions.pop()
        this.biasInitializerSelected.pop()
        this.biasInitializerOptions.pop()
      }
      while (this.activationSelected.length < next) {
        this.layerUnits.push(3)
        this.activationSelected.push('relu')
        this.activationOptions.push(activationOptions.map(x => x.replace(/hard_sigmoid/g, 'hardSigmoid')).sort())
        this.kernelInitializerSelected.push('randomNormal')
        this.kernelInitializerOptions.push(Object.keys(tf.initializers).sort())
        this.biasInitializerSelected.push('ones')
        this.biasInitializerOptions.push(Object.keys(tf.initializers).sort())
      }
    },
    shapeMax(next, prev) {
      if (this.inputShape > next) {
        this.inputShape = next
      }
    },
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
    onShowModal() {
      global.tfvis.show.modelSummary(this.$refs['draw'], this.output.model)
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
      let model = tf.sequential()
      for (let i = 0; i < this.layerSize; i++) {
        let layer = {
          units: this.layerUnits[i],
          inputShape: this.inputShape,
          activation: this.activationSelected[i],
          kernelInitializer: this.kernelInitializerSelected[i],
          biasInitializer: this.biasInitializerSelected[i]
        }
        if (i !== 0) {
          delete layer.inputShape
        }
        model.add(tf.layers.dense(layer))
      }
      model.inputData = this.inputData
      this.fileChart = true
      this.output = {
        model: model,
        data: this.inputData,
        indexLabel: this.indexLabel
      }

      /*
      let modelView = new ModelView(model, {
        height: 465,
        width: 465,
        appendImmediately: false,
        renderer: 'd3',
        radius: 10,
        layerPadding: 100,
        printStats: false,
        renderLinks: true
      })
      jquery(this.$refs['draw']).empty()
      this.$refs['draw'].appendChild(modelView.getDOMElement())
      */

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
