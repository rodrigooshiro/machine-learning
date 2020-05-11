<template>
  <div id="app">
    <Header />
    <b-card title="Dataset Loader">
      <DatasetLoader id="pipeline_0" />
      <DatasetViewer id="pipeline_1" input_ref="pipeline_0" />
    </b-card>
    <b-card title="Autoencoder Model">
      <AutoencoderModel id="pipeline_2" input_ref="pipeline_0" input_index="3" />
      <DatasetViewer id="pipeline_3" input_ref="pipeline_2" />
    </b-card>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import DatasetLoader from './components/DatasetLoader.vue'
import DatasetViewer from './components/DatasetViewer.vue'
import AutoencoderModel from './components/AutoencoderModel.vue'

export default {
  name: 'App',
  props: [],
  components: {
    Header,
    DatasetLoader,
    DatasetViewer,
    AutoencoderModel
  },
  data() {
    return {}
  },
  created() {},
  mounted: function() {},
  computed: {},
  methods: {}
}
</script>

<style>
.btn-icon {
  width: 16px;
  height: 16px;
}
.btn:disabled {
  cursor: not-allowed;
}
.toolbarButtons {
  direction: rtl;
}
.btn-toolbar {
  padding-left: 5px;
}
.btn-badge,
.btn-group-badge > .btn {
  padding: 4px 4px !important;
  line-height: 0 !important;
  margin-bottom: 0.1rem;
}
</style>
<style scoped>
</style>
