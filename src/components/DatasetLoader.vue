<template>
  <b-form-group>
    <b-input-group class="mb-2">
      <b-form-file
        v-model="localFile"
        ref="select-local-file"
        class="select-button"
        placeholder="Choose a data source or drop it here..."
        drop-placeholder="Drop file here..."
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
  </b-form-group>
</template>

<script>
import * as csv from 'csv-string'
import path from 'path'

const store = {
  namespaced: true,
  state: {
    output: []
  },
  mutations: {
    setOutput(state, value) {
      state.output = value
    }
  }
}

export default {
  name: 'DatasetLoader',
  props: ['id'],
  components: {},
  data() {
    return {
      localFile: null,
      remoteFile:
        'https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data',
      fileName: ''
    }
  },
  created() {
    if (!this.$store.state[this.id]) {
      this.$store.registerModule(this.id, store)
    }
  },
  mounted() {},
  computed: {
    output: {
      get: function() {
        return this.$store.state[this.id].output
      },
      set: function(value) {
        this.$store.commit(this.id + '/setOutput', value)
      }
    }
  },
  methods: {
    selectLocalFile(event) {
      if (event instanceof MouseEvent) {
        this.$refs['select-local-file'].$el.children[0].click()
      } else if (event instanceof Event) {
        let file = event.target.files[0]
        let reader = new FileReader()
        this.fileName = file.name
        reader.onload = e => this.selectLocalFile(e.target)
        reader.readAsText(file)
      } else if (event instanceof FileReader) {
        this.loadFileContent({
          status: event.error === null ? 200 : -1,
          data: event.result
        })
      }
    },
    loadFileContent(content) {
      let fileText = content.data.trim()
      let fileTable = csv.parse(fileText)
      this.output = [content.status === 200, this.fileName, fileText, fileTable]
    },
    selectRemoteFile() {
      let content = null
      this.axios
        .get('https://thingproxy.freeboard.io/fetch/' + this.remoteFile)
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
