<template>
  <b-form class="form-toolbar-ltr" inline>
    <div class="b-icon-sup">
      <b-icon :icon="toggleIcon" @click="onToggleToolbar"></b-icon>
    </div>
    <b-collapse :visible="toggleIcon === 'caret-up'">
      <b-button size="badge" @click="onSetupComponent">
        <b-icon icon="gear"></b-icon>
      </b-button>
      <b-button size="badge" @click="onRemoveComponent">
        <b-icon icon="dash-circle"></b-icon>
      </b-button>
      <b-button size="badge" @click="onAddComponent">
        <b-icon icon="plus-circle"></b-icon>
      </b-button>
      <b-button size="badge" @click="onMoveDownComponent" :disabled="true">
        <b-icon icon="file-arrow-down"></b-icon>
      </b-button>
      <b-button size="badge" @click="onMoveUpComponent" :disabled="true">
        <b-icon icon="file-arrow-up"></b-icon>
      </b-button>
    </b-collapse>
  </b-form>
</template>

<script>
export default {
  name: 'ToolbarFooter',
  props: ['pipeline'],
  data() {
    return {
      toggleIcon: 'caret-down'
    }
  },
  created() {},
  mounted() {},
  computed: {},
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
      let vm = this.$parent
      while (vm) {
        vm.$emit(emit, this.pipeline)
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
