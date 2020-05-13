<template>
  <div id="app">
    <Header v-on:onLoadPipeline="onLoadPipeline" :loading.sync="loading" />
    <b-card>
      <div v-if="loading" class="text-center">
        <b-spinner type="grow"></b-spinner>
      </div>
      <template v-for="component in pipeline">
        <component
          :ref="component.index"
          v-bind:key="component.key"
          v-bind:is="component.type"
          :length.sync="pipeline.length"
          :index.sync="component.index"
          :input_ref.sync="component.input_ref"
          :input_index.sync="component.input_index"
          :title.sync="component.title"
          :description.sync="component.description"
          v-on:onSetupComponent="onSetupComponent"
          v-on:onRemoveComponent="onRemoveComponent"
          v-on:onAddComponent="onAddComponent"
          v-on:onMoveDownComponent="onMoveDownComponent"
          v-on:onMoveUpComponent="onMoveUpComponent"
        ></component>
      </template>
      <ToolbarFooter
        v-if="(loading === false) && (pipeline.length === 0)"
        ref="toolbarFooter"
        :index.sync="template"
        :length.sync="pipeline.length"
        v-on:onAddComponent="onAddComponent"
      />
    </b-card>
    <b-modal id="add-component" title="Add Component" @ok="addComponent">
      <b-form-select v-model="componentSelected" :options="componentOptions"></b-form-select>
    </b-modal>
    <b-modal id="setup-component" title="Setup Component" @ok="setupComponent">
      <label>Title</label>
      <b-form-input v-model="componentTitle"></b-form-input>
      <label>Description</label>
      <b-form-textarea v-model="componentDescription"></b-form-textarea>
      <label>Input Reference</label>
      <b-form-select
        v-model="componentInputReferenceSelected"
        :options="componentInputReferenceOptions"
      ></b-form-select>
      <label>Input Index</label>
      <b-input-group>
        <b-form-spinbutton
          v-if="(componentInputReferenceSelected === null || componentInputReferenceSelected === '')"
          min="0"
          placeholder="--"
          :disabled="true"
        ></b-form-spinbutton>
        <b-form-spinbutton
          v-if="!(componentInputReferenceSelected === null || componentInputReferenceSelected === '')"
          v-model="componentInputIndex"
          min="0"
          placeholder="--"
        ></b-form-spinbutton>
        <b-button @click="componentInputIndex = null">
          <b-icon icon="trash" class="btn-icon"></b-icon>
        </b-button>
      </b-input-group>
    </b-modal>
  </div>
</template>

<script>
import Header from './components/Header'
import ToolbarFooter from './components/ToolbarFooter.vue'

export default {
  name: 'App',
  props: [],
  components: {
    Header,
    ToolbarFooter,
    DatasetLoader: () => import('./components/DatasetLoader'),
    DatasetViewer: () => import('./components/DatasetViewer'),
    TSAutoencoder: () => import('./components/TSAutoencoder')
  },
  created() {
    let promises = this.componentOptions.map(
      function(c) {
        return this.$options.components[c]()
      }.bind(this)
    )
    Promise.all(promises).then(
      function(res) {
        this.onLoadPipeline('Autoencoder Tensorflow')
        this.loading = false
      }.bind(this)
    )
  },
  mounted() {},
  data() {
    return {
      template: 'pipeline_0',
      index: null,
      loading: true,
      componentSelected: 'DatasetLoader',
      componentOptions: ['DatasetLoader', 'DatasetViewer', 'TSAutoencoder'],
      componentTitle: null,
      componentDescription: null,
      componentInputIndex: null,
      componentInputReferenceSelected: null,
      componentInputReferenceOptions: [],
      pipeline: []
    }
  },
  methods: {
    setupComponent() {
      this.pipeline[this.index].key = Math.random()
      this.pipeline[this.index].title = this.componentTitle
      this.pipeline[this.index].description = this.componentDescription
      this.pipeline[this.index].input_ref = this.componentInputReferenceSelected
      this.pipeline[this.index].input_index = this.componentInputIndex
      this.pipeline[this.index] = this.pipeline[this.index]
      if (!this.pipeline[this.index].input_ref) {
        delete this.pipeline[this.index].input_index
      }
      this.componentInputReferenceOptions = []
    },
    onSetupComponent(index) {
      this.index = this.pipeline.map(x => x.index).indexOf(index)
      this.componentTitle = this.pipeline[this.index].title
      this.componentDescription = this.pipeline[this.index].description
      this.componentInputReferenceSelected = this.pipeline[this.index].input_ref
      this.componentInputReferenceOptions = this.pipeline
        .filter(x => x.index !== index)
        .map(x => x.index)
      this.componentInputReferenceOptions.splice(0, 0, '')
      this.componentInputIndex = this.pipeline[this.index].input_index
      this.$bvModal.show('setup-component')
    },
    removeComponent() {
      this.pipeline.splice(this.index, 1)
    },
    onRemoveComponent(index) {
      this.index = this.pipeline.map(x => x.index).indexOf(index)
      this.removeComponent()
    },
    addComponent() {
      let index = this.index
      for (let i = index; i < this.pipeline.length; i++) {
        this.$store.unregisterModule('pipeline_' + i)
      }
      this.pipeline.splice(index, 0, {
        key: Math.random(),
        index: 'pipeline_' + index,
        type: this.componentSelected
      })
      if (index > 0) {
        this.pipeline[index].input_ref = 'pipeline_' + (index - 1)
      }
      for (let i = index + 1; i < this.pipeline.length; i++) {
        let pipeline = this.pipeline[i]
        pipeline.key = Math.random()
        if ('input_ref' in pipeline) {
          this.pipeline[i].input_ref =
            'pipeline_' + (parseInt(pipeline.input_ref.split('_')[1]) + 1)
        }
        this.pipeline[i].index =
          'pipeline_' + (parseInt(pipeline.index.split('_')[1]) + 1)
      }
      if (this.$refs['toolbarFooter']) {
        this.$refs['toolbarFooter'].toggleIcon = 'caret-down'
      }
    },
    onAddComponent(index) {
      this.$bvModal.show('add-component')
      this.index = this.pipeline.map(x => x.index).indexOf(index) + 1
    },
    onMoveDownComponent(index) {
      this.index = this.pipeline.map(x => x.index).indexOf(index)
      this.pipeline[this.index] = this.pipeline.splice(
        this.index + 1,
        1,
        this.pipeline[this.index]
      )[0]
      for (let i = this.index; i < this.pipeline.length; i++) {
        let pipeline = this.pipeline[i]
        pipeline.index = 'pipeline_' + i
        pipeline.key = Math.random()
      }
    },
    onMoveUpComponent(index) {
      this.index = this.pipeline.map(x => x.index).indexOf(index)
      this.pipeline[this.index] = this.pipeline.splice(
        this.index - 1,
        1,
        this.pipeline[this.index]
      )[0]
      for (let i = this.index - 1; i < this.pipeline.length; i++) {
        let pipeline = this.pipeline[i]
        pipeline.index = 'pipeline_' + i
        pipeline.key = Math.random()
      }
    },
    onLoadPipeline(template) {
      if (template === 'Blank') {
        this.pipeline = []
      }
      if (template === 'Autoencoder Tensorflow') {
        this.pipeline = [
          {
            key: Math.random(),
            index: 'pipeline_0',
            type: 'DatasetLoader',
            title: 'Dataset Loader'
          },
          {
            key: Math.random(),
            index: 'pipeline_1',
            type: 'DatasetViewer',
            input_ref: 'pipeline_0'
          },
          {
            key: Math.random(),
            index: 'pipeline_2',
            type: 'TSAutoencoder',
            input_ref: 'pipeline_0',
            input_index: 3,
            title: 'Tensorflow Autoencoder'
          },
          {
            key: Math.random(),
            index: 'pipeline_3',
            type: 'DatasetViewer',
            input_ref: 'pipeline_2'
          }
        ]
      }
    }
  }
}
</script>

<style>
.form-toolbar-rtl {
  direction: rtl;
}
.form-toolbar-rtl .btn,
.form-toolbar-rtl .badge {
  margin-left: 4px;
}
.form-toolbar-ltr {
  direction: ltr;
}
.form-toolbar-ltr .btn,
.form-toolbar-ltr .badge {
  margin-right: 4px;
}
.form-toolbar-rtl .b-icon,
.form-toolbar-ltr .b-icon {
  width: 16px;
  height: 16px;
}
.b-icon-sup {
  height: 28px;
  margin-right: 4px;
}
.b-icon-sup svg {
  cursor: pointer;
}
.btn:disabled {
  cursor: not-allowed;
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
