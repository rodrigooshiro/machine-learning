/**
 * @license
 * Copyright 2020 Rodrigo Oshiro. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const lodash = require('lodash')

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
    this.loadData(this.component.data)
  },
  computed: {
    editActionDisabled() {
      return true
    },
    downloadActionDisabled() {
      return true
    },
    trashActionDisabled() {
      return true
    },
    plugActionDisabled() {
      return true
    },
    imageActionDisabled() {
      return true
    },
    global: {
      get() {
        return this.$store.state['pipeline'].global
      },
      set(value) {
        this.$store.commit('pipeline/setGlobal', value)
      }
    },
    output: {
      get() {
        if (this.component.index in this.$store.state) {
          if ('output' in this.$store.state[this.component.index]) {
            return this.$store.state[this.component.index].output
          }
        }
        return null
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
          if (this.$store.state[this.component.input_ref]) {
            if (this.component.input_ref && 'output' in this.$store.state[this.component.input_ref]) {
              if (this.component.input_index !== null && this.component.input_index !== undefined) {
                data = this.$store.state[this.component.input_ref].output[this.component.input_index]
              } else {
                data = this.$store.state[this.component.input_ref].output
              }
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
          if (this.$store.state[this.component.input_ref]) {
            if (this.component.input_ref && 'loading' in this.$store.state[this.component.input_ref]) {
              return this.$store.state[this.component.input_ref].loading
            }
          }
        }
        return false
      }
    }
  },
  methods: {
    indexFormatter(value) {
      if (value === -1) {
        return '--'
      } else {
        return value
      }
    },
    positiveFormatter(value) {
      if (value <= 0) {
        return '--'
      } else {
        return value
      }
    },
    percentageFormatter(value) {
      return parseFloat(100 * value).toFixed(0) + '%'
    },
    registerStore() {
      if (!('store' in this.component)) {
        this.component.store = {
          namespaced: true,
          state: {
            type: this.$options.name,
            output: null,
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
    validateData() {},
    loadData(data) {
      if (data) {
        this.serializable.concat(['output']).forEach(item => {
          if (item in data) {
            this[item] = lodash.cloneDeep(data[item])
          }
        })
        this.validateData()
      }
    },
    importData(data) {
      this.data = lodash.cloneDeep(data)
      if (this.component.data) {
        data.serializable.forEach(item => {
          if (item in this.component.data) {
            data[item] = lodash.cloneDeep(this.component.data[item])
          }
        })
      }
      return data
    },
    exportData() {
      let serializable = null
      let data = {
        type: this.$options.name
      }
      serializable = ['index', 'input_ref', 'input_index', 'title', 'description']
      serializable.forEach(item => {
        if (item in this.component) {
          if (this.component[item] !== undefined && this.component[item] !== null) {
            data[item] = this.component[item]
          }
        }
      })
      serializable = this.serializable.concat(['output'])
      serializable.forEach(item => {
        if (item in this) {
          if (this[item] !== undefined && this[item] !== null) {
            if (!('data' in data)) {
              data['data'] = {}
            }
            data['data'][item] = this[item]
          }
        }
      })
      return data
    },
    plugActionEnd(event) {
      this.loading = false
      this.$emit('onPlugAction', this.loading)
    },
    plugActionEvent(event) {
      this.loading = false
      this.$emit('onPlugAction', this.loading)
    },
    plugAction(event) {
      this.loading = true
      this.$emit('onPlugAction', this.loading)
      setTimeout(
        function() {
          this.plugActionEvent(event)
        }.bind(this),
        100
      )
    }
  }
}
