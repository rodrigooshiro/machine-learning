export const mixin = {
  props: ['component', 'length'],
  data() {
    return {
      input: null,
      serializable: []
    }
  },
  beforeMount() {
    this.registerStore()
    this.loadData()
  },
  computed: {
    output: {
      get() {
        if (this.component.index in this.$store.state) {
          if ('output' in this.$store.state[this.component.index]) {
            return this.$store.state[this.component.index].output
          }
        }
        return []
      },
      set(value) {
        if (this.component.index in this.$store.state) {
          if ('output' in this.$store.state[this.component.index]) {
            this.$store.commit(this.component.index + '/setOutput', value)
          }
        }
      }
    },
    loading: {
      get() {
        if (this.component.index in this.$store.state) {
          if ('loading' in this.$store.state[this.component.index]) {
            return this.$store.state[this.component.index].loading
          }
        }
        return false
      },
      set(value) {
        if (this.component.index in this.$store.state) {
          if ('loading' in this.$store.state[this.component.index]) {
            this.$store.commit(this.component.index + '/setLoading', value)
          }
        }
      }
    },
    inputData: {
      get() {
        let data = null
        if (this.component.index in this.$store.state) {
          if (this.component.input_ref && 'output' in this.$store.state[this.component.input_ref]) {
            if (this.component.input_index !== null && this.component.input_index !== undefined) {
              data = this.$store.state[this.component.input_ref].output[this.component.input_index]
            } else {
              data = this.$store.state[this.component.input_ref].output
            }
          }
        }
        return data
      },
      set(value) {
        if (this.component.index in this.$store.state) {
          if (this.component.input_ref && 'output' in this.$store.state[this.component.input_ref]) {
            if (this.component.input_index !== null && this.component.input_index !== undefined) {
              this.$store.state[this.component.input_ref].output[this.component.input_index] = value
            } else {
              this.$store.state[this.component.input_ref].output = value
            }
          }
        }
      }
    },
    inputLoading: {
      get() {
        if (this.component.index in this.$store.state) {
          if (this.component.input_ref && 'loading' in this.$store.state[this.component.input_ref]) {
            return this.$store.state[this.component.input_ref].loading
          }
        }
        return false
      }
    }
  },
  methods: {
    registerStore() {
      if (!('store' in this.component)) {
        this.component.store = {
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
        if (this.$store.state[this.component.index]) {
          this.unregisterStore()
        }
        this.$store.registerModule(this.component.index, this.component.store)
      }
    },
    unregisterStore() {
      if (this.$store.state[this.component.index]) {
        this.$store.unregisterModule(this.component.index)
      }
    },
    loadData() {
      if (this.component.data) {
        this.serializable.concat(['output']).forEach(item => {
          if (item in this.component.data) {
            this[item] = this.component.data[item]
          }
        })
      }
    },
    importData(data) {
      if (this.component.data) {
        data.serializable.forEach(item => {
          if (item in this.component.data) {
            data[item] = this.component.data[item]
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
        if (item in this.component) {
          if ((this.component[item] !== undefined) && (this.component[item] !== null)) {
            data[item] = this.component[item]
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
