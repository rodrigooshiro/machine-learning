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
    </b-form>
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
      serializable: [],
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
    showModalDisabled() {
      if (this.inputData.length) {
        let dimensionsSize = this.inputData[0].length
        if (dimensionsSize > 1) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    onLoadingChanged(value) {
      this.loading = value
    },
    onShowModal() {
      if (this.fileChart === false && !this.showModalDisabled) {
        let dimensionsSize = this.inputData[0].length
        let dimensions = []
        for (let i = 0; i <= dimensionsSize; i++) {
          dimensions.push(this.inputData.map(x => x[i]))
        }
        let hasLabels = typeof dimensions[dimensionsSize - 1][0] === 'string'
        let zAxis = hasLabels ? dimensionsSize - 2 : dimensionsSize - 1

        let trace = {
          x: dimensions[0],
          y: dimensions[1],
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

        if (zAxis > 1) {
          trace.z = dimensions[2]
          trace.type = 'scatter3d'
          layout.scene.zaxis = { title: 'Z axis' }
        }

        if (hasLabels) {
          let labels = dimensions[dimensionsSize - 1]
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
