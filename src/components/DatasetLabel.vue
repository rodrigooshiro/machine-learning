<template>
  <component-layout :component.sync="component" :length.sync="length" :loading.sync="loading">
    <b-form class="form-toolbar-rtl" inline>
      <b-button size="badge" @click="plugAction" :disabled="plugActionDisabled">
        <b-icon icon="plug" class="btn-icon"></b-icon>
      </b-button>
      <b-button size="badge" @click="trashAction" :disabled="trashActionDisabled">
        <b-icon icon="trash" class="btn-icon"></b-icon>
      </b-button>
      <b-button size="badge" @click="onToggleToolbar">
        <b-icon :icon="toggleIcon"></b-icon>
      </b-button>
    </b-form>

    <b-collapse :visible="toggleIcon === 'caret-up'">
      <b-form inline>
        <div class="indexInput">
          <label>Label Size</label>
          <b-form-spinbutton v-model="labelSize" min="1" :disabled="editActionDisabled"></b-form-spinbutton>
        </div>

        <div class="indexInput">
          <label>Output Reference</label>
          <b-form-select
            v-model="componentOutputReferenceSelected"
            :options="componentOutputReferenceOptions"
            :disabled="editActionDisabled"
          ></b-form-select>
        </div>
      </b-form>
    </b-collapse>
  </component-layout>
</template>

<script>
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
import ComponentLayout from './ComponentLayout'
import { mixin } from './mixin'

export default {
  name: 'DatasetLabel',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: ['labelSize', 'output_ref'],
      toggleIcon: 'caret-up',
      labelSize: 1,
      output_ref: 'pipeline_0',
      componentOutputReferenceOptions: []
    }
    let index = parseInt(this.component.index.replace(/pipeline_/g, ''))
    data.componentOutputReferenceOptions = Array.from({ length: this.length }, (v, k) => k)
    data.componentOutputReferenceOptions = data.componentOutputReferenceOptions.filter(v => v !== index)
    return this.importData(data)
  },
  computed: {
    editActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.inputData === null
      disabled |= this.$parent.$parent.$refs[this.output_ref][0].output === null
      return disabled === 1
    },
    trashActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.inputData === null
      return disabled === 1
    },
    plugActionDisabled() {
      return this.editActionDisabled
    },
    componentOutputReferenceSelected: {
      get() {
        return parseInt(this.output_ref.replace(/pipeline_/g, ''))
      },
      set(value) {
        this.output_ref = 'pipeline_' + value
      }
    }
  },
  watch: {
    inputLoading(next, prev) {
      this.loading = next
    }
  },
  methods: {
    onToggleToolbar() {
      if (this.toggleIcon === 'caret-up') {
        this.toggleIcon = 'caret-down'
      } else if (this.toggleIcon === 'caret-down') {
        this.toggleIcon = 'caret-up'
      }
    },
    trashAction(event) {
      this.output = null
      this.loadData(this.data)
      this.loadData(this.component.data)
      let output = this.$parent.$parent.$refs[this.output_ref][0].output
      delete output.datasetLabels
      delete output.datasetLabelsSize
    },
    plugAction(event) {
      this.loading = true
      let output = this.$parent.$parent.$refs[this.output_ref][0].output
      output.datasetLabels = new Uint8Array(this.inputData)
      output.datasetLabelsSize = this.labelSize
      setTimeout(
        function() {
          this.loading = false
        }.bind(this),
        1
      )
    }
  }
}
</script>

<style scoped>
</style>
