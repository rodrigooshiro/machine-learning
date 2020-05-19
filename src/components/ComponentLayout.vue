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
