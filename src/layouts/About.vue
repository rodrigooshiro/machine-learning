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
