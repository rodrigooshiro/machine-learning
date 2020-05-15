<template>
  <b-form-group>
    <h4 v-if="title" class="card-title">{{ title }}</h4>
    <b-card-text v-if="description">{{ description }}</b-card-text>
    <b-form class="form-toolbar-rtl" inline>
      <b-button size="badge" :disabled="inputData===''" @click="downloadFileContent">
        <b-icon icon="download" class="btn-icon"></b-icon>
        <a ref="downloadFileContent" style="display:none" />
      </b-button>
      <b-button size="badge" @click="deleteFileContent" :class="inputData==='disabled' ? '': ''">
        <b-icon icon="trash" class="btn-icon"></b-icon>
      </b-button>
    </b-form>
    <b-input-group class="mb-2">
      <b-form-textarea
        class="fileTextarea"
        v-model="inputData"
        readonly
        spellcheck="false"
        autocomplete="off"
      ></b-form-textarea>
    </b-input-group>
    <ToolbarFooter
      :index.sync="index"
      :input_ref="input_ref"
      :length.sync="length"
      :loading.sync="loading"
    />
  </b-form-group>
</template>

<script>
import ToolbarFooter from './ToolbarFooter.vue'
import { mixin } from './mixin'

export default {
  name: 'DatasetTextViewer',
  components: { ToolbarFooter },
  mixins: [mixin],
  data() {
    let data = {
      serializable: []
    }
    return this.importData(data)
  },
  computed: {
    inputData: {
      get() {
        let data = ''
        if (this.input !== null) {
          let value = null
          if (this.input_index !== null && this.input_index !== undefined) {
            value = this.input.output[this.input_index]
          } else {
            value = this.input.output
          }
          if (typeof value === 'string' || value instanceof String) {
            data = value
            this.output = data
          }
        }
        return data
      }
    }
  },
  methods: {
    onLoadingChanged(value) {
      this.loading = value
    },
    async eraseData(event) {
      if (event) {
        this.inputText = ''
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
        let blob = new Blob([this.inputText], { type: 'octet/stream' })
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
.fileTextarea {
  width: 100% !important;
  height: 200px !important;
  border: 3px solid #ced4da !important;
  border-radius: 0.25rem !important;
  resize: none;
  overflow: auto;
  resize: none;
}
</style>
