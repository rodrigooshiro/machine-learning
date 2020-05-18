import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import VueAxios from 'vue-axios'
import VueMeta from 'vue-meta'
import VueRouter from 'vue-router'
import App from './App.vue'
import About from './About.vue'
import Blank from './Blank.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(VueMeta)
Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false

export const store = new Vuex.Store({})

const router = new VueRouter({
  mode: 'history',
  hash: false,
  routes: [
    { path: '/', component: App },
    { path: '/about', component: About },
    { path: '/blank', component: Blank }
  ]
})

global.vue = new Vue({
  el: '#app',
  router,
  store,
  template: '<router-view/>',
  components: { App, About, Blank }
})
