<template>
  <component-layout :component.sync="component" :length.sync="length" :loading.sync="loading">
    <b-form class="form-toolbar-rtl" inline>
      <b-button size="badge" @click="downloadAction" :disabled="downloadActionDisabled">
        <b-icon icon="download" class="btn-icon"></b-icon>
        <a ref="downloadFileContent" style="display:none" />
      </b-button>
      <b-button size="badge" @click="trashAction" :disabled="trashActionDisabled">
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
  name: 'DatasetTextViewer',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: []
    }
    return this.importData(data)
  },
  computed: {
    downloadActionDisabled() {
      let disabled = 0
      disabled |= this.inputData === null || this.inputData.length === 0
      return disabled === 1
    },
    trashActionDisabled() {
      return this.downloadActionDisabled
    }
  },
  watch: {
    inputLoading(next, prev) {
      this.loading = next
      if (this.loading === false) {
        this.output = this.inputData
      }
    }
  },
  methods: {
    trashAction(event) {
      this.inputData = ''
      this.output = null
      this.loadData(this.data)
      this.loadData(this.component.data)
    },
    downloadAction(event) {
      if (event.isTrusted) {
        let blob = new Blob([this.inputData], { type: 'octet/stream' })
        let url = window.URL.createObjectURL(blob)
        this.$refs['downloadFileContent'].href = url
        this.$refs['downloadFileContent'].download = this.component.index
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
