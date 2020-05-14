<template>
  <b-form-group>
    <h4 v-if="title" class="card-title">{{ title }}</h4>
    <b-card-text v-if="description">{{ description }}</b-card-text>
    <b-input-group class="mb-2">
      <b-form-file
        v-model="localFile"
        ref="select-local-file"
        class="select-button"
        placeholder="Choose a data source..."
        :no-drop="true"
        @change="selectLocalFile"
      ></b-form-file>
      <b-input-group-append>
        <b-button class="select-button" @click="selectLocalFile">Select local file</b-button>
      </b-input-group-append>
    </b-input-group>

    <b-input-group class="mb-2">
      <b-form-input v-model="remoteFile" placeholder="Choose a remote web address..."></b-form-input>
      <b-input-group-append>
        <b-button class="select-button" @click="selectRemoteFile">Select remote file</b-button>
      </b-input-group-append>
    </b-input-group>
    <ToolbarFooter :index.sync="index" :input_ref="input_ref" :length.sync="length" />
  </b-form-group>
</template>

<script>
import ToolbarFooter from './ToolbarFooter.vue'
import { mixin } from './mixin'
import * as csv from 'csv-string'
import path from 'path'
const cors = process.env.VUE_APP_CORS_API

export default {
  name: 'DatasetLoader',
  components: { ToolbarFooter },
  mixins: [mixin],
  data() {
    return {
      serializable: ['localFile', 'remoteFile', 'filename'],
      localFile: null,
      remoteFile: null,
      fileName: ''
    }
  },
  methods: {
    loadFileContent(content) {
      let fileText = content.data.trim()
      let fileTable = csv.parse(fileText)
      this.output = [content.status === 200, this.fileName, fileText, fileTable]
      this.loading = false
    },
    selectLocalFile(event) {
      if (event instanceof MouseEvent) {
        this.$refs['select-local-file'].$el.children[0].click()
      } else if (event instanceof Event) {
        if (event.target.files.length) {
          this.loading = true
          let file = event.target.files[0]
          let reader = new FileReader()
          this.fileName = file.name
          reader.onload = e => this.selectLocalFile(e.target)
          reader.readAsText(file)
        }
      } else if (event instanceof FileReader) {
        this.loadFileContent({
          status: event.error === null ? 200 : -1,
          data: event.result
        })
      }
    },
    selectRemoteFile() {
      let content = null
      this.loading = true
      this.axios
        .get(cors + this.remoteFile)
        .then(response => {
          content = response
        })
        .catch(response => {
          content = response.response
        })
        .finally(() => {
          this.fileName = path.basename(content.config.url)
          this.loadFileContent(content)
        })
    }
  }
}
</script>

<style>
label.custom-file-label::after {
  display: none;
}
</style>
<style scoped>
.select-button {
  width: 200px;
}
</style>
