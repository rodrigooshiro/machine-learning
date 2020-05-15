<template>
  <div>
    <b-form class="form-toolbar-ltr" inline>
      <b-badge pill variant="light">
        {{ slot }}
        <b-icon v-if="reference !== null" icon="link"></b-icon>
        {{ reference }}
      </b-badge>
      <div class="b-icon-sup">
        <b-icon :icon="toggleIcon" @click="onToggleToolbar"></b-icon>
      </div>
      <b-collapse :visible="toggleIcon === 'caret-up'">
        <b-button v-if="length > 0" size="badge" @click="onSetupComponent">
          <b-icon icon="gear"></b-icon>
        </b-button>
        <b-button v-if="length > 0" size="badge" @click="onRemoveComponent">
          <b-icon icon="dash-circle"></b-icon>
        </b-button>
        <b-button size="badge" @click="onAddComponent">
          <b-icon icon="plus-circle"></b-icon>
        </b-button>
        <b-button
          v-if="length > 0"
          size="badge"
          @click="onMoveDownComponent"
          :disabled="slot === (length-1)"
        >
          <b-icon icon="file-arrow-down"></b-icon>
        </b-button>
        <b-button v-if="length > 0" size="badge" @click="onMoveUpComponent" :disabled="slot === 0">
          <b-icon icon="file-arrow-up"></b-icon>
        </b-button>
      </b-collapse>
    </b-form>
    <b-form class="form-toolbar-rtl" inline>
      <div v-if="loading">
        <b-spinner small type="grow"></b-spinner>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  props: ['index', 'length', 'input_ref', 'loading'],
  data() {
    return {
      toggleIcon: 'caret-down'
    }
  },
  created() {},
  mounted() {},
  computed: {
    slot: {
      get: function() {
        return parseInt(this.index.split('_')[1])
      }
    },
    reference: {
      get: function() {
        if (this.input_ref) {
          return parseInt(this.input_ref.split('_')[1])
        }
        return null
      }
    }
  },
  watch: {},
  methods: {
    onToggleToolbar() {
      if (this.toggleIcon === 'caret-up') {
        this.toggleIcon = 'caret-down'
      } else if (this.toggleIcon === 'caret-down') {
        this.toggleIcon = 'caret-up'
      }
    },
    onTriggerComponent(emit) {
      let vm = this
      while (vm) {
        vm.$emit(emit, this.index)
        vm = vm.$parent
      }
    },
    onSetupComponent(event) {
      this.onTriggerComponent('onSetupComponent')
    },
    onRemoveComponent(event) {
      this.onTriggerComponent('onRemoveComponent')
    },
    onAddComponent(event) {
      this.onTriggerComponent('onAddComponent')
    },
    onMoveDownComponent(event) {
      this.onTriggerComponent('onMoveDownComponent')
    },
    onMoveUpComponent(event) {
      this.onTriggerComponent('onMoveUpComponent')
    }
  }
}
</script>

<style scoped>
</style>
