<template>
  <b-form-group>
    <h4 v-if="component.title" class="card-title">{{ component.title }}</h4>
    <b-card-text v-if="component.description">{{ component.description }}</b-card-text>
    <b-form class="form-toolbar-rtl" inline>
      <b-button size="badge" @click="plugAction" :disabled="plugActionDisabled">
        <b-icon icon="plug" class="btn-icon"></b-icon>
      </b-button>
      <b-button size="badge" @click="eraseData" :disabled="indexMax===0">
        <b-icon icon="trash" class="btn-icon"></b-icon>
      </b-button>
      <b-button
        size="badge"
        @click="$bvModal.show('model-view-' + component.index)"
        :disabled="showModalDisabled"
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
          <label>Input Index (Timestamp)</label>
          <b-form-spinbutton
            v-model="indexTimestamp"
            min="0"
            :max="indexMax"
            :disabled="indexMax===0"
            placeholder="--"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Input Index (Start)</label>
          <b-form-spinbutton
            v-model="indexStart"
            min="0"
            :max="indexMax"
            :disabled="indexMax===0"
            placeholder="--"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Input Index (End)</label>
          <b-form-spinbutton
            v-model="indexEnd"
            min="0"
            :max="indexMax"
            :disabled="indexMax===0"
            placeholder="--"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Input Index (Label)</label>
          <b-form-spinbutton
            v-model="indexLabel"
            min="0"
            :max="indexMax"
            :disabled="indexMax===0"
            placeholder="--"
          ></b-form-spinbutton>
        </div>
      </b-form>

      <b-form inline>
        <div class="indexInput">
          <label>Total Layers</label>
          <b-form-spinbutton
            v-model="layerSize"
            min="2"
            max="10"
            :disabled="plugActionDisabled"
            placeholder="--"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Compiler Optimizer</label>
          <b-form-select
            v-model="compilerOptimizerSelected"
            :options="compilerOptimizerOptions"
            :disabled="plugActionDisabled"
          ></b-form-select>
        </div>

        <div class="indexInput">
          <label>Compiler Loss</label>
          <b-form-select
            v-model="compilerLossSelected"
            :options="compilerLossOptions"
            :disabled="plugActionDisabled"
          ></b-form-select>
        </div>
      </b-form>

      <b-form inline>
        <div class="indexInput">
          <label>Epochs</label>
          <b-form-spinbutton
            v-model="epochSize"
            min="1"
            max="100"
            :disabled="plugActionDisabled"
            placeholder="--"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Batch Size</label>
          <b-form-spinbutton
            v-model="batchSize"
            min="1"
            max="100"
            :disabled="plugActionDisabled"
            placeholder="--"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Validation Spit</label>
          <b-form-spinbutton
            v-model="validationSpit"
            min="0.01"
            max="1.00"
            step="0.01"
            :disabled="plugActionDisabled"
            placeholder="--"
          ></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Shuffle</label>
          <b-form-select
            v-model="shuffleSelected"
            :options="shuffleOptions"
            :disabled="plugActionDisabled"
          ></b-form-select>
        </div>
      </b-form>

      <template v-for="i in layerSize">
        <b-form v-bind:key="i" inline>
          <div v-if="i<layerSize" class="indexInput">
            <label>Encoder (units)</label>
            <b-form-spinbutton
              v-model="layerUnits[i-1]"
              min="1"
              :max="10"
              :disabled="plugActionDisabled"
              placeholder="--"
            ></b-form-spinbutton>
          </div>

          <div class="indexInput">
            <label>
              <span v-if="i<layerSize">Encoder (activation)</span>
              <span v-if="i==layerSize">Decoder (activation)</span>
            </label>
            <b-form-select
              v-model="activationSelected[i-1]"
              :options="activationOptions[i-1]"
              :disabled="plugActionDisabled"
            ></b-form-select>
          </div>

          <div v-if="i<layerSize" class="indexInput">
            <label>Encoder (kernel initializer)</label>
            <b-form-select
              v-model="kernelInitializerSelected[i-1]"
              :options="kernelInitializerOptions[i-1]"
              :disabled="plugActionDisabled"
            ></b-form-select>
          </div>

          <div v-if="i<layerSize" class="indexInput">
            <label>Encoder (bias initializer)</label>
            <b-form-select
              v-model="biasInitializerSelected[i-1]"
              :options="biasInitializerOptions[i-1]"
              :disabled="plugActionDisabled"
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

    <b-modal :id="'model-view-' + component.index" title="Autoencoder Model View" :static="true">
      <div ref="mv"></div>
    </b-modal>
  </b-form-group>
</template>

<script>
import ToolbarFooter from './ToolbarFooter.vue'
import { mixin } from './mixin'
import * as tf from '@tensorflow/tfjs'
import ModelView from 'tfjs-model-view'
import jquery from 'jquery'
import { activationOptions } from '@tensorflow/tfjs-layers/dist/keras_format/activation_config.js'

export default {
  name: 'TSAutoencoder',
  components: { ToolbarFooter },
  mixins: [mixin],
  data() {
    let data = {
      serializable: ['indexTimestamp', 'indexStart', 'indexEnd', 'indexLabel', 'layerSize', 'epochSize', 'batchSize', 'validationSpit', 'shuffleSelected', 'compilerOptimizerSelected', 'compilerLossSelected', 'layerUnits', 'activationSelected', 'activationOptions', 'kernelInitializerSelected', 'kernelInitializerOptions', 'biasInitializerSelected', 'biasInitializerOptions'],
      toggleIcon: 'caret-down',
      indexTimestamp: null,
      indexStart: null,
      indexEnd: null,
      indexLabel: null,
      layerSize: 0,
      epochSize: 0,
      batchSize: 0,
      validationSpit: 0,
      shuffleSelected: true,
      shuffleOptions: [true, false],
      compilerOptimizerSelected: null,
      compilerOptimizerOptions: Object.keys(tf.train).sort(),
      compilerLossSelected: null,
      compilerLossOptions: Object.keys(tf.losses)
        .slice(1)
        .sort(),
      layerUnits: [],
      activationSelected: [],
      activationOptions: [],
      kernelInitializerSelected: [],
      kernelInitializerOptions: [],
      biasInitializerSelected: [],
      biasInitializerOptions: [],
      autoencoder: null
    }
    return this.importData(data)
  },
  computed: {
    indexMax: {
      get() {
        let indexMax = 0
        if (this.inputData && this.inputData.length > 0) {
          indexMax = this.inputData[0].length - 1
        }
        return indexMax
      }
    },
    showModalDisabled() {
      if (this.autoencoder !== null) {
        return false
      }
      return true
    },
    plugActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.indexStart === null
      disabled |= this.indexEnd === null
      disabled |= this.indexLabel === null
      disabled |= this.indexEnd <= this.indexStart
      disabled |= this.indexLabel >= this.indexStart && this.indexLabel <= this.indexEnd
      return disabled === 1
    }
  },
  watch: {
    layerSize(next, prev) {
      this.eraseData()
    },
    inputLoading(next, prev) {
      if (next === false) {
        this.eraseData(true)
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
    async eraseData(event) {
      if (event) {
        this.output = []
        this.layerSize = 2
        this.epochSize = 5
        this.batchSize = 20
        this.validationSpit = 0.1
        this.shuffleSelected = true
        this.compilerOptimizerSelected = 'sgd'
        this.compilerLossSelected = 'meanSquaredError'
        this.layerUnits = []
        this.activationSelected = []
        this.activationOptions = []
        this.kernelInitializerSelected = []
        this.kernelInitializerOptions = []
        this.biasInitializerSelected = []
        this.biasInitializerOptions = []
        this.autoencoder = null
      }
      if (this.inputData.length === 0) {
        this.indexTimestamp = this.indexStart = this.indexEnd = this.indexLabel = null
      } else {
        this.indexTimestamp = null
        this.indexStart = 0
        this.indexEnd = this.indexMax - 1
        this.indexLabel = this.indexMax
      }
      while (this.activationSelected.length > this.layerSize) {
        this.layerUnits.pop()
        this.activationSelected.pop()
        this.activationOptions.pop()
        this.kernelInitializerSelected.pop()
        this.kernelInitializerOptions.pop()
        this.biasInitializerSelected.pop()
        this.biasInitializerOptions.pop()
      }
      while (this.activationSelected.length < this.layerSize) {
        this.layerUnits.push(3)
        this.activationSelected.push('relu')
        this.activationOptions.push(activationOptions.map(x => x.replace(/hard_sigmoid/g, 'hardSigmoid')).sort())
        this.kernelInitializerSelected.push('randomNormal')
        this.kernelInitializerOptions.push(Object.keys(tf.initializers).sort())
        this.biasInitializerSelected.push('ones')
        this.biasInitializerOptions.push(Object.keys(tf.initializers).sort())
      }
    },
    async setupAutoencoder(dataLength) {
      const model = tf.sequential()
      const encoders = []
      let inputShape = dataLength
      for (var i = 0; i < this.layerSize - 1; i++) {
        const encoder = tf.layers.dense({
          units: this.layerUnits[i],
          batchInputShape: [null, inputShape],
          activation: this.activationSelected[i],
          kernelInitializer: this.kernelInitializerSelected[i],
          biasInitializer: this.biasInitializerSelected[i]
        })
        encoders.push(encoder)
        model.add(encoder)
        inputShape = this.layerUnits[i]
      }
      let activation = this.activationSelected[this.layerSize - 1]
      const decoder = tf.layers.dense({
        units: dataLength,
        activation: activation
      })
      model.add(decoder)
      await model.compile({
        optimizer: this.compilerOptimizerSelected,
        loss: this.compilerLossSelected
      })
      this.autoencoder = {
        model: model,
        encoder: encoders,
        decoder: decoder
      }
    },
    async plugAction(event) {
      this.loading = true
      let dataLength = this.indexEnd - this.indexStart + 1
      let dataSliced = this.inputData.map(x => x.slice(this.indexStart, this.indexEnd + 1).map(y => parseFloat(y)))
      let dataLabels = this.inputData.map(x => x[this.indexLabel])
      await this.setupAutoencoder(dataLength)

      let modelView = new ModelView(this.autoencoder.model, {
        height: 465,
        width: 465,
        appendImmediately: false,
        renderer: 'd3',
        radius: 10,
        layerPadding: 100,
        printStats: false,
        renderLinks: true
      })
      jquery(this.$refs['mv']).empty()
      this.$refs['mv'].appendChild(modelView.getDOMElement())

      const xs = tf.tensor2d(dataSliced)
      this.autoencoder.train = await this.autoencoder.model.fit(xs, xs, {
        epochs: this.epochSize,
        batchSize: this.batchSize,
        shuffle: this.shuffleSelected,
        validationSpit: this.validationSpit
      })
      xs.dispose()
      const tidyWrapper = tf.tidy(() => {
        const predictor = tf.sequential()
        this.autoencoder.encoder.forEach(encoder => predictor.add(encoder))
        let xs = tf.tensor2d(dataSliced)
        let ret = predictor.predict(xs)
        xs.dispose()
        return ret
      })
      let predictions = await tidyWrapper.data()
      let dimensionSize = this.layerUnits[this.layerSize - 2]
      let output = []
      for (let i = 0; i < predictions.length; i += dimensionSize) {
        let row = []
        for (let j = 0; j < dimensionSize; j++) {
          row.push(predictions[i + j])
        }
        row.push(dataLabels[i / dimensionSize])
        output.push(row)
      }
      this.output = output
      this.loading = false
    }
  }
}
</script>

<style scoped>
</style>
