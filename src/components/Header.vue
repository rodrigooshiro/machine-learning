<template>
  <b-navbar toggleable="lg" type="dark" variant="secondary">
    <b-navbar-brand href="/" style="padding: 0px !important;">
      <b-icon icon="eye-fill" style="width: 32px; height: 32px;"></b-icon>
    </b-navbar-brand>
    <b-navbar-brand href="/">Home</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template v-slot:button-content>Pipelines</template>
          <b-dropdown-item @click="onLoadPipeline" :disabled="loading">Blank</b-dropdown-item>
          <b-dropdown-item @click="onLoadPipeline" :disabled="loading">Autoencoder Tensorflow</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  props: ['loading'],
  methods: {
    onLoadPipeline(event) {
      this.$emit('onLoadPipeline', event.target.text.trim())
    }
  }
}
</script>

<style scoped>
</style>
