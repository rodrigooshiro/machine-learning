<template>
  <b-form-group>
    <h4 v-if="title" class="card-title">{{ title }}</h4>
    <b-card-text v-if="description">{{ description }}</b-card-text>
    <b-form class="form-toolbar-rtl" inline>
      <b-button size="badge" :disabled="inputData.length === 0" @click="downloadFileContent">
        <b-icon icon="download" class="btn-icon"></b-icon>
        <a ref="downloadFileContent" style="display:none" />
      </b-button>
      <b-button
        size="badge"
        @click="deleteFileContent"
        :class="inputData.length === 0 ? 'disabled': ''"
      >
        <b-icon icon="trash" class="btn-icon"></b-icon>
      </b-button>
      <b-button size="badge" v-b-modal="'dataset-view-' + index" :disabled="showModalDisabled">
        <b-icon icon="card-image" class="btn-icon"></b-icon>
      </b-button>
      <b-button size="badge" @click="onToggleToolbar">
        <b-icon :icon="toggleIcon"></b-icon>
      </b-button>
    </b-form>

    <b-collapse :visible="toggleIcon === 'caret-up'">
      <b-form inline>
        <div class="indexInput">
          <label>X axis column</label>
          <b-form-spinbutton
            v-model="xAxis"
            min="0"
            :max="indexMax+1"
            :disabled="indexMax<1"
            :formatter-fn="indexFormatter"
          ></b-form-spinbutton>
        </div>
        <div class="indexInput">
          <label>Y axis column</label>
          <b-form-spinbutton
            v-model="yAxis"
            min="0"
            :max="indexMax+1"
            :disabled="indexMax<2"
            :formatter-fn="indexFormatter"
          ></b-form-spinbutton>
        </div>
        <div class="indexInput">
          <label>Z axis column</label>
          <b-form-spinbutton
            v-model="zAxis"
            min="0"
            :max="indexMax+1"
            :disabled="indexMax<3"
            :formatter-fn="indexFormatter"
          ></b-form-spinbutton>
        </div>
        <div class="indexInput">
          <label>Label column</label>
          <b-form-spinbutton
            v-model="lAxis"
            min="0"
            :max="indexMax+1"
            :disabled="indexMax<3"
            :formatter-fn="indexFormatter"
          ></b-form-spinbutton>
        </div>
      </b-form>
      <div style="margin-top: 8px;"></div>
    </b-collapse>

    <b-input-group class="mb-2">
      <div class="fileTable">
        <b-table striped hover :items="inputData"></b-table>
      </div>
    </b-input-group>
    <ToolbarFooter
      :index.sync="index"
      :input_ref="input_ref"
      :length.sync="length"
      :loading.sync="loading"
    />

    <b-modal
      :id="'dataset-view-' + index"
      title="Dataset View"
      :static="true"
      size="lg"
      @show="onShowModal"
    >
      <center>
        <div ref="plot"></div>
      </center>
    </b-modal>
  </b-form-group>
</template>

<script>
import ToolbarFooter from './ToolbarFooter.vue'
import { mixin } from './mixin'
import * as csv from 'csv-string'
import jquery from 'jquery'
import Plotly from 'plotly.js-dist'

export default {
  name: 'DatasetTableViewer',
  components: { ToolbarFooter },
  mixins: [mixin],
  data() {
    let data = {
      serializable: ['xAxis', 'yAxis', 'zAxis', 'lAxis'],
      xAxis: 0,
      yAxis: 0,
      zAxis: 0,
      lAxis: 0,
      toggleIcon: 'caret-down',
      fileChart: false
    }
    return this.importData(data)
  },
  computed: {
    inputData: {
      get() {
        let data = []
        if (this.input !== null) {
          let value = null
          if (this.input_index !== null && this.input_index !== undefined) {
            value = this.input.output[this.input_index]
          } else {
            value = this.input.output
          }
          if (typeof value === 'string' || value instanceof String) {
            if (value.length > 0) {
              value = csv.parse(value)
            }
          }
          if (Array.isArray(value)) {
            data = value
            this.output = data
          }
        }
        return data
      }
    },
    indexMax: {
      get() {
        let indexMax = 0
        if (this.inputData.length > 0) {
          indexMax = this.inputData[0].length - 1
        }
        return indexMax
      }
    },
    showModalDisabled() {
      let disabled = 0
      disabled |= this.xAxis === 0
      disabled |= this.yAxis === 0
      disabled |= this.xAxis === this.yAxis
      disabled |= this.xAxis === this.zAxis
      disabled |= this.xAxis === this.lAxis
      disabled |= this.yAxis === this.lAxis
      if (this.zAxis !== 0) {
        disabled |= this.yAxis === this.zAxis
        disabled |= this.zAxis === this.lAxis
      }
      return disabled === 1
    }
  },
  methods: {
    indexFormatter(value) {
      this.fileChart = false
      if (value === 0) {
        return '--'
      } else {
        return value - 1
      }
    },
    onToggleToolbar() {
      if (this.toggleIcon === 'caret-up') {
        this.toggleIcon = 'caret-down'
      } else if (this.toggleIcon === 'caret-down') {
        this.toggleIcon = 'caret-up'
      }
    },
    onLoadingChanged(value) {
      this.loading = value
    },
    onShowModal() {
      if (this.fileChart === false && !this.showModalDisabled) {
        let dimensions = []
        for (let i = 0; i <= this.indexMax; i++) {
          dimensions.push(this.inputData.map(x => x[i]))
        }
        let trace = {
          x: dimensions[this.xAxis - 1],
          y: dimensions[this.yAxis - 1],
          mode: 'markers',
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
          margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
          },
          scene: {
            xaxis: { title: 'X axis' },
            yaxis: { title: 'Y axis' }
          }
        }

        if (this.zAxis !== 0) {
          trace.z = dimensions[this.zAxis - 1]
          trace.type = 'scatter3d'
          layout.scene.zaxis = { title: 'Z axis' }
        }

        if (this.lAxis !== 0) {
          let labels = dimensions[this.lAxis - 1]
          let keyLabels = Array.from(new Set(labels))
          let colorMap = {}
          keyLabels.forEach(label => {
            colorMap[label] = '#' + Math.floor(Math.random() * 16777215).toString(16)
          })
          trace.text = labels
          trace.marker.line.color = labels.map(d => colorMap[d])
        }

        Plotly.newPlot(this.$refs['plot'], [trace], layout)
        this.fileChart = true
      }
    },
    async eraseData(event) {
      if (event) {
        jquery(this.$refs['plot']).empty()
        this.fileChart = false
        this.output = []
        if (this.input !== null) {
          this.input.output = ''
        }
        this.xAxis = this.yAxis = this.zAxis = this.lAxis = 0
      }
    },
    deleteFileContent() {
      this.eraseData(true)
    },
    downloadFileContent(event) {
      if (event.isTrusted) {
        let blob = new Blob([this.inputData.join('\n')], { type: 'octet/stream' })
        let url = window.URL.createObjectURL(blob)
        this.$refs['downloadFileContent'].href = url
        this.$refs['downloadFileContent'].download = this.index
        this.$refs['downloadFileContent'].click()
        window.URL.revokeObjectURL(url)
      }
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
  resize: none;
  overflow: auto;
  resize: none;
}
</style>
