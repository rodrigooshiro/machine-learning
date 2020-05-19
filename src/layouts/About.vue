<template>
  <page-layout :name="$options.name">
    <b-card>
      Welcome, my name is Rodrigo Oshiro.
      <br />
      <br />This page is made with
      <a target="_blank" href="https://nodejs.org/">Node.js</a> /
      <a target="_blank" href="https://vuejs.org/">Vue.js</a>, hosted in
      <a target="_blank" href="http://github.io/">GitHub Pages</a> and
      the source code of this project is in my
      <a
        target="_blank"
        href="https://github.com/rodrigooshiro/machine-learning"
      >machine-learning</a> repository.
      <br />I am putting together some use case scenarios using
      <a
        target="_blank"
        href="https://www.tensorflow.org/js"
      >TensorFlow.js</a> as of now. It's possible to install TensorFlow.js with
      <u>native C++ bindings</u> or
      <u>CUDA support</u>, but for educational purposes, all code hosted here runs entirely on javascript.
      <br />
      <br />You can create your own pipelines using components I have already created, or simply load a template
      and customize it with different datasets or parameters used by the libraries. Each component has its own
      behaviour, accepts different inputs and generates outputs that can be linked by other components.
      The combinations are endless and there many possibilities that I will share as I learn about them.
    </b-card>
  </page-layout>
</template>

<script>
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
import PageLayout from './PageLayout'

export default {
  name: 'About',
  props: [],
  components: {
    PageLayout
  }
}
</script>

<style scoped>
</style>
