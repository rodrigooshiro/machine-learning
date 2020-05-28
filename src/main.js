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
import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueNativeSock from 'vue-native-websocket'
import Pipeline from './layouts/Pipeline.vue'
import About from './layouts/About.vue'
import Blank from './layouts/Blank.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '!!file-loader?name=tf.min.js.map!@tensorflow/tfjs/dist/tf.min.js.map'
import '!!file-loader?name=tf.min.js!@tensorflow/tfjs/dist/tf.min.js'
import '!!file-loader?name=tfjs-vis.umd.min.js.map!@tensorflow/tfjs-vis/dist/tfjs-vis.umd.min.js.map'
import '!!file-loader?name=tfjs-vis.umd.min.js!@tensorflow/tfjs-vis/dist/tfjs-vis.umd.min.js'
import '!!file-loader?name=utilities.js!./config/utilities.js'
import '!!file-loader?name=worker.js!./config/worker.js'
import 'script-loader!@tensorflow/tfjs/dist/tf.min.js'
import 'script-loader!@tensorflow/tfjs-vis/dist/tfjs-vis.umd.min.js'

let hostname = new URL(window.location.href).hostname
let protocol = new URL(window.location.href).protocol
if (protocol === 'http:') {
  protocol = 'ws:'
}
if (protocol === 'https:') {
  protocol = 'wss:'
}
global.tf.enableProdMode()

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueNativeSock, `${protocol}//${hostname}:8001`, {
  connectManually: true,
  format: 'json'
})
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use({
  install(Vue) {
    Vue.prototype.$axios = axios
    Vue.prototype.$tf = global.tf
    Vue.prototype.$tfvis = global.tfvis
  }
})
Vue.config.productionTip = false

export const store = new Vuex.Store({})

const router = new VueRouter({
  hash: true,
  base: '/machine-learning',
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
