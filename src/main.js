import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'
import Pipeline from './layouts/Pipeline.vue'
import About from './layouts/About.vue'
import Blank from './layouts/Blank.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false

export const store = new Vuex.Store({})

const router = new VueRouter({
  hash: true,
  routes: [
    { path: '/', component: Pipeline },
    { path: '/about', component: About },
    { path: '/blank', component: Blank }
  ]
})

global.vue = new Vue({
  el: '#app',
  router,
  store,
  template: '<router-view/>',
  components: { Pipeline, About, Blank }
})
