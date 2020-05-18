<template>
  <b-navbar toggleable="lg" type="dark" variant="secondary">
    <b-navbar-brand href="/" style="padding: 0px !important;">
      <b-icon icon="eye-fill" style="width: 32px; height: 32px;"></b-icon>
    </b-navbar-brand>
    <b-navbar-brand href="/">Home</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right :disabled="templates === undefined">
          <template v-slot:button-content>Pipelines</template>
          <b-dropdown-item @click="onImportPipeline" :disabled="loading">
            <b-icon icon="upload"></b-icon>&ensp;Import
          </b-dropdown-item>
          <b-dropdown-item @click="onExportPipeline" :disabled="loading">
            <b-icon icon="download"></b-icon>&ensp;Export
          </b-dropdown-item>
          <b-dropdown-item @click="onLoadPipeline" :disabled="loading">
            <b-icon icon="file"></b-icon>&ensp;New Blank
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <template v-for="template in templates">
            <b-dropdown-item
              v-bind:key="template.key"
              @click="onLoadPipeline"
              :disabled="loading"
            >{{template.name}}</b-dropdown-item>
          </template>
        </b-nav-item-dropdown>
        <b-nav-item href="/about">About</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  props: ['loading', 'templates'],
  methods: {
    onExportPipeline(event) {
      this.$emit('onExportPipeline')
    },
    onImportPipeline(event) {
      this.$emit('onImportPipeline')
    },
    onLoadPipeline(event) {
      this.$emit('onLoadPipeline', event.target.text.trim())
    }
  }
}
</script>

<style scoped>
</style>
