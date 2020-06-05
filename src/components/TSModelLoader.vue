<template>
  <component-layout :component.sync="component" :length.sync="length" :loading.sync="loading">
    <b-input-group class="mb-2">
      <b-form-input v-model="remoteFile" placeholder="Choose a remote web address..."></b-form-input>
      <b-input-group-append>
        <b-button class="select-button" @click="selectRemoteFile">Select remote file</b-button>
      </b-input-group-append>
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
import lodash from 'lodash'
import * as utilities from '../config/utilities.js'

export default {
  name: 'TSModelLoader',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: ['remoteFile'],
      remoteFile: null,
      utilities: utilities
    }
    return this.importData(data)
  },
  computed: {
    plugActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      return disabled === 1
    }
  },
  methods: {
    selectRemoteFile() {
      this.loading = true
      this.$emit('onPlugAction', this.loading)

      let inputTensor = null
      let outputTensor = null
      let inputMatrix = this.global.inputMatrix
      let outputMatrix = this.global.outputMatrix
      let normalizationData = {
        inputUnitsNormalize: true,
        outputUnitsNormalize: true
      }

      let inputShape = lodash.cloneDeep(this.global.inputShape)
      if (this.global.training !== null) {
        inputMatrix = this.global.training.inputMatrix
      }
      inputShape.unshift(inputMatrix.length)
      inputTensor = this.$tf.tensor(inputMatrix, inputShape)

      let outputShape = lodash.cloneDeep(this.global.outputShape)
      if (this.global.training !== null) {
        outputMatrix = this.global.training.outputMatrix
      }
      outputShape.unshift(outputMatrix.length)
      outputTensor = this.$tf.tensor(outputMatrix, outputShape)

      if (normalizationData.inputUnitsNormalize) {
        let { normal, min, max } = utilities.tasks.normalizeTensor(this.$tf, inputTensor)
        inputTensor.dispose()
        inputTensor = normal
        normalizationData.inputMin = min
        normalizationData.inputMax = max
      }
      if (normalizationData.outputUnitsNormalize) {
        let { normal, min, max } = utilities.tasks.normalizeTensor(this.$tf, outputTensor)
        outputTensor.dispose()
        outputTensor = normal
        normalizationData.outputMin = min
        normalizationData.outputMax = max
      }
      inputTensor.dispose()
      outputTensor.dispose()

      this.$tf.loadLayersModel(this.remoteFile).then(
        function(model) {
          this.global.model = model
          this.output = {
            ...this.inputData,
            normalizationData: normalizationData
          }
          this.plugActionEnd(event)
        }.bind(this)
      )
    },
    plugActionEvent(event) {
      this.selectRemoteFile(event)
    }
  }
}
</script>

<style scoped>
</style>
