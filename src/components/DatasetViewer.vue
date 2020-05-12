<template>
  <b-form-group>
    <h4 v-if="title" class="card-title">{{ title }}</h4>
    <b-form class="form-toolbar-rtl" inline>
      <b-badge ref="fileBadge" style="width: 50px;">
        <div
          v-if="loading"
          style="-webkit-animation: spinner-border .75s linear infinite; animation: spinner-border .75s linear infinite;"
        >-</div>
        <div v-if="!loading">{{ fileBadgeText }}</div>
      </b-badge>
      <b-button size="badge" :disabled="fileText===''" @click="downloadFileContent">
        <b-icon icon="download" class="btn-icon"></b-icon>
        <a ref="downloadFileContent" style="display:none" />
      </b-button>
      <b-button size="badge" @click="deleteFileContent" :class="fileName!=='' ? '': 'disabled'">
        <b-icon icon="trash" class="btn-icon"></b-icon>
      </b-button>
      <b-button size="badge" v-b-modal="'dataset-view-' + id" :disabled="showModalDisabled">
        <b-icon icon="card-image" class="btn-icon"></b-icon>
      </b-button>
      <b-button
        size="badge"
        @click="selectFileTable"
        :class="fileMode==='table' ? '': 'disabled'"
        :disabled="fileTable.length===0"
      >
        <b-icon icon="table" class="btn-icon"></b-icon>
      </b-button>
      <b-button
        size="badge"
        @click="selectFileText"
        :class="fileMode==='text' ? '': 'disabled'"
        :disabled="fileText===''"
      >
        <b-icon icon="textarea" class="btn-icon"></b-icon>
      </b-button>
    </b-form>
    <b-input-group class="mb-2">
      <b-form-textarea
        class="fileTextarea"
        v-if="fileMode==='text'"
        v-model="fileText"
        readonly
        spellcheck="false"
        autocomplete="off"
      ></b-form-textarea>
      <div class="fileTable" v-if="fileMode==='table'">
        <b-table striped hover :items="fileTable"></b-table>
      </div>
    </b-input-group>
    <ToolbarFooter :pipeline.sync="id" />

    <b-modal
      :id="'dataset-view-' + id"
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
import jquery from 'jquery'
import Plotly from 'plotly.js-dist'

export default {
  name: 'DatasetViewer',
  props: [
    'id',
    'input_ref',
    'input_index',
    'loading_ref',
    'title',
    'description'
  ],
  components: { ToolbarFooter },
  data() {
    return {
      watchers: [],
      fileBadgeText: '-',
      fileMode: 'text',
      fileText: '',
      fileTable: [],
      fileName: '',
      fileChart: false
    }
  },
  created() {
    let store = {
      namespaced: true,
      state: {
        type: 'DatasetViewer',
        output: [],
        loading: false
      },
      mutations: {
        setOutput(state, value) {
          state.output = value
        },
        setLoading(state, value) {
          state.loading = value
        }
      }
    }
    if (!this.$store.state[this.id]) {
      this.$store.registerModule(this.id, store)
    }
    if (this.input_ref && 'output' in this.$store.state[this.input_ref]) {
      this.watchers.push(
        this.$watch(
          () => this.$store.state[this.input_ref].output,
          this.onInputChanged
        )
      )
    }
    if (this.loading_ref && 'loading' in this.$store.state[this.loading_ref]) {
      this.watchers.push(
        this.$watch(
          () => this.$store.state[this.loading_ref].loading,
          this.onLoadingChanged
        )
      )
    }
  },
  beforeDestroy() {
    this.watchers.forEach(unwatch => unwatch())
  },
  mounted() {
    this.eraseAction(true)
  },
  computed: {
    output: {
      get: function() {
        return this.$store.state[this.id].output
      },
      set: function(value) {
        this.$store.commit(this.id + '/setOutput', value)
      }
    },
    loading: {
      get: function() {
        return this.$store.state[this.id].loading
      },
      set: function(value) {
        this.$store.commit(this.id + '/setLoading', value)
      }
    },
    showModalDisabled: function() {
      if (this.fileTable.length) {
        let dimensionsSize = this.fileTable[0].length
        if (dimensionsSize > 1) {
          return false
        }
      }
      return true
    }
  },
  watch: {
    id: function(value) {},
    input_index: function(value) {},
    input_ref: function(value) {},
    loading_ref: function(value) {}
  },
  methods: {
    onInputChanged(value) {
      this.eraseAction(true)
      this.output = value
      if (value.length === 4) {
        let [code, fileName, fileText, fileTable] = value
        if (code === true) {
          this.fileBadgeText = 'ok'
          this.$refs['fileBadge'].className = 'badge badge-success'
        } else {
          this.fileBadgeText = '-'
          this.$refs['fileBadge'].className = 'badge badge-danger'
        }
        this.fileName = fileName
        this.fileText = fileText
        this.fileTable = fileTable
        this.selectFileText()
      } else {
        if (value.length > 0) {
          this.fileBadgeText = 'ok'
          this.$refs['fileBadge'].className = 'badge badge-success'
        } else {
          this.fileBadgeText = '-'
          this.$refs['fileBadge'].className = 'badge badge-secondary'
        }
        this.fileName = this.id
        this.fileTable = value
        this.selectFileTable()
      }
    },
    onLoadingChanged(value) {
      this.loading = value
    },
    onShowModal() {
      if (this.fileChart === false && !this.showModalDisabled) {
        let dimensionsSize = this.fileTable[0].length
        let dimensions = []
        for (let i = 0; i <= dimensionsSize; i++) {
          dimensions.push(this.fileTable.map(x => x[i]))
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
            colorMap[label] =
              '#' + Math.floor(Math.random() * 16777215).toString(16)
          })
          trace.text = labels
          trace.marker.line.color = labels.map(d => colorMap[d])
        }

        Plotly.newPlot(this.$refs['plot'], [trace], layout)
        this.fileChart = true
      }
    },
    async eraseAction(event) {
      if (event) {
        jquery(this.$refs['plot']).empty()
        this.fileBadgeText = '-'
        this.$refs['fileBadge'].className = 'badge badge-secondary'
        this.fileText = ''
        this.fileTable = []
        this.fileName = ''
        this.fileChart = false
      }
    },
    selectFileText() {
      this.fileMode = 'text'
    },
    selectFileTable() {
      this.fileMode = 'table'
    },
    deleteFileContent() {
      this.eraseAction(true)
      this.$store.state[this.input_ref].output = []
    },
    downloadFileContent(event) {
      if (event.isTrusted) {
        let blob = new Blob([this.fileText], { type: 'octet/stream' })
        let url = window.URL.createObjectURL(blob)
        this.$refs['downloadFileContent'].href = url
        this.$refs['downloadFileContent'].download = this.fileName
        this.$refs['downloadFileContent'].click()
        window.URL.revokeObjectURL(url)
      }
    }
  }
}
</script>

<style scoped>
.fileTextarea,
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
