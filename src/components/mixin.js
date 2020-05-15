export const mixin = {
  props: ['index', 'length', 'input_ref', 'input_index', 'title', 'description', 'data'],
  data() {
    return {
      input: null,
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
  },
  beforeDestroy() {
    this.watchers.forEach(unwatch => unwatch())
  },
  beforeMount() {
    this.eraseData(true)
    this.loadData()
    if (this.input_ref && 'output' in this.$store.state[this.input_ref]) {
      this.input = this.$store.state[this.input_ref]
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
  computed: {
    output: {
      get() {
        return this.$store.state[this.index].output
      },
      set(value) {
        this.$store.commit(this.index + '/setOutput', value)
      }
    },
    loading: {
      get() {
        return this.$store.state[this.index].loading
      },
      set(value) {
        this.$store.commit(this.index + '/setLoading', value)
      }
    }
  },
  methods: {
    async eraseData(event) {
    },
    loadData() {
      if (this.data) {
        this.serializable.concat(['output']).forEach(item => {
          if (item in this.data) {
            this[item] = this.data[item]
          }
        })
      }
    },
    importData(data) {
      if (this.data) {
        data.serializable.forEach(item => {
          if (item in this.data) {
            data[item] = this.data[item]
          }
        })
      }
      return data
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
