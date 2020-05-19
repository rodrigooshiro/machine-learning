<template>
  <b-form-group>
    <h4 v-if="component.title" class="card-title">
      <vue-markdown :anchorAttributes="anchor" :source="component.title"></vue-markdown>
    </h4>
    <b-card-text v-if="component.description">
      <vue-markdown :anchorAttributes="anchor" :source="component.description"></vue-markdown>
    </b-card-text>
    <slot />
    <component-footer
      :index.sync="component.index"
      :input_ref.sync="component.input_ref"
      :length.sync="length"
      :loading.sync="loading"
    />
  </b-form-group>
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
import VueMarkdown from 'vue-markdown'
import ComponentFooter from './ComponentFooter.vue'

export default {
  name: 'ComponentLayout',
  props: ['component', 'length', 'loading'],
  components: { VueMarkdown, ComponentFooter },
  data() {
    return {
      anchor: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow'
      }
    }
  }
}
</script>

<style scoped>
</style>
