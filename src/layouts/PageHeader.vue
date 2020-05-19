<template>
  <b-navbar toggleable="lg" type="dark" variant="secondary">
    <router-link to="/" v-slot="{ href }">
      <b-navbar-brand :href="href + '?action=home'" style="padding: 0px !important;">
        <b-icon icon="eye-fill" style="width: 32px; height: 32px;"></b-icon>
      </b-navbar-brand>
    </router-link>
    <router-link to="/" v-slot="{ href }">
      <b-navbar-brand :href="href + '?action=home'">Home</b-navbar-brand>
    </router-link>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right :disabled="templates === undefined">
          <template v-slot:button-content>Pipelines</template>
          <router-link to="/" v-slot="{ href }">
            <b-dropdown-item :href="href + '?action=import'" :disabled="name !== 'Pipeline'">
              <b-icon icon="upload"></b-icon>&ensp;Import
            </b-dropdown-item>
          </router-link>
          <router-link to="/" v-slot="{ href }">
            <b-dropdown-item :href="href + '?action=export'" :disabled="name !== 'Pipeline'">
              <b-icon icon="download"></b-icon>&ensp;Export
            </b-dropdown-item>
          </router-link>
          <router-link to="/" v-slot="{ href }">
            <b-dropdown-item :href="href + '?action=new'">
              <b-icon icon="file"></b-icon>&ensp;New Blank
            </b-dropdown-item>
          </router-link>
          <b-dropdown-divider></b-dropdown-divider>
          <template v-for="template in templates">
            <router-link v-bind:key="template.js" to="/" v-slot="{ href }">
              <b-dropdown-item :href="href + '?template=' + template.name">{{template.name}}</b-dropdown-item>
            </router-link>
          </template>
        </b-nav-item-dropdown>
        <router-link to="/about" v-slot="{ href }">
          <b-nav-item :href="href">About</b-nav-item>
        </router-link>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import templates from '../templates/index.js'

export default {
  name: 'PageHeader',
  props: ['name'],
  data() {
    let values = []
    templates.forEach(item => {
      let template = { ...item, value: null }
      values.push(template)
    })
    return {
      templates: values
    }
  }
}
</script>

<style scoped>
</style>
