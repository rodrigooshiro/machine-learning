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
