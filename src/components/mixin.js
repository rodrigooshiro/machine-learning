export const mixin = {
  props: ['index', 'length', 'input_ref', 'input_index', 'title', 'description', 'data'],
  data() {
    return {
      watchers: [],
      serializable: []
    }
  },
  created() {
    let store = {
      namespaced: true,
      state: {
        type: this.$options.name,
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
    if (!this.$store.state[this.index]) {
      this.$store.registerModule(this.index, store)
    }
    if (this.input_ref && 'output' in this.$store.state[this.input_ref]) {
      if (this.onInputChanged) {
        this.watchers.push(this.$watch(() => this.$store.state[this.input_ref].output, this.onInputChanged))
      }
    }
    if (this.input_ref && 'loading' in this.$store.state[this.input_ref]) {
      if (this.onLoadingChanged) {
        this.watchers.push(this.$watch(() => this.$store.state[this.input_ref].loading, this.onLoadingChanged))
      }
    }
  },
  beforeDestroy() {
    this.watchers.forEach(unwatch => unwatch())
  },
  mounted() {
    this.eraseData(true)
    this.importData(this.data)
  },
  computed: {
    output: {
      get: function () {
        return this.$store.state[this.index].output
      },
      set: function (value) {
        this.$store.commit(this.index + '/setOutput', value)
      }
    },
    loading: {
      get: function () {
        return this.$store.state[this.index].loading
      },
      set: function (value) {
        this.$store.commit(this.index + '/setLoading', value)
      }
    }
  },
  methods: {
    async eraseData(event) {
    },
    importData(data) {
      if (data) {
        let serializable = null
        serializable = this.serializable.concat(['output'])
        serializable.forEach(item => {
          if (item in data) {
            this[item] = data[item]
          }
        })
      }
    },
    exportData() {
      let serializable = null
      let data = {
        'type': this.$options.name
      }
      serializable = ['index', 'input_ref', 'input_index', 'title', 'description']
      serializable.forEach(item => {
        if (item in this) {
          if ((this[item] !== undefined) && (this[item] !== null)) {
            data[item] = this[item]
          }
        }
      })
      serializable = this.serializable.concat(['output'])
      serializable.forEach(item => {
        if (item in this) {
          if ((this[item] !== undefined) && (this[item] !== null)) {
            if (!('data' in data)) {
              data['data'] = {}
            }
            data['data'][item] = this[item]
          }
        }
      })
      return data
    }
  }
}
