<template>
  <div id="app">
    <Header />
    <b-card>
      <template v-for="(component, index) in pipeline">
        <component
          :ref="component.index"
          v-bind:key="Math.random(index)"
          v-bind:is="component.type"
          :id.sync="component.index"
          :input_ref.sync="component.input_ref"
          :loading_ref.sync="component.loading_ref"
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
    </b-card>
    <b-modal id="addComponentModal" title="Add Component" @ok="addComponent">
      <b-form-select v-model="componentSelected" :options="componentOptions"></b-form-select>
    </b-modal>
    <b-modal id="setupComponentModal" title="Setup Component" @ok="setupComponent">
      <label>Title</label>
      <b-form-input v-model="componentTitle"></b-form-input>
      <label>Description</label>
      <b-form-input v-model="componentDescription"></b-form-input>
      <label>Input Reference</label>
      <b-form-select
        v-model="componentInputReferenceSelected"
        :options="componentInputReferenceOptions"
      ></b-form-select>
      <label>Input Index</label>
      <b-input-group>
        <b-form-spinbutton v-model="componentInputIndex" min="0" placeholder="--"></b-form-spinbutton>
        <b-button @click="componentInputIndex = null">
          <b-icon icon="trash" class="btn-icon"></b-icon>
        </b-button>
      </b-input-group>
      <label>Loading Reference</label>
      <b-form-select
        v-model="componentLoadingReferenceSelected"
        :options="componentLoadingReferenceOptions"
      ></b-form-select>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: [],
  components: {
    Header: () => import('./components/Header.vue'),
    DatasetLoader: () => import('./components/DatasetLoader'),
    DatasetViewer: () => import('./components/DatasetViewer'),
    AutoencoderModel: () => import('./components/AutoencoderModel')
  },
  created() {},
  data() {
    return {
      index: null,
      componentSelected: 'DatasetViewer',
      componentOptions: ['DatasetLoader', 'DatasetViewer', 'AutoencoderModel'],
      componentTitle: null,
      componentDescription: null,
      componentInputIndex: null,
      componentInputReferenceSelected: null,
      componentInputReferenceOptions: [],
      componentLoadingReferenceSelected: null,
      componentLoadingReferenceOptions: [],
      pipeline: [
        {
          index: 'pipeline_0',
          type: 'DatasetLoader',
          title: 'Dataset Loader'
        },
        {
          index: 'pipeline_1',
          type: 'DatasetViewer',
          input_ref: 'pipeline_0',
          loading_ref: 'pipeline_0'
        },
        {
          index: 'pipeline_2',
          type: 'AutoencoderModel',
          input_ref: 'pipeline_0',
          input_index: 3,
          title: 'Autoencoder Model'
        },
        {
          index: 'pipeline_3',
          type: 'DatasetViewer',
          input_ref: 'pipeline_2',
          loading_ref: 'pipeline_2'
        }
      ]
    }
  },
  methods: {
    setupComponent() {
      this.pipeline[this.index].title = this.componentTitle
      this.pipeline[this.index].description = this.componentDescription
      this.pipeline[this.index].input_index = this.componentInputIndex
      this.pipeline[this.index].input_ref = this.componentInputReferenceSelected
      this.pipeline[this.index].loading_ref = this.componentLoadingReferenceSelected
      this.pipeline[this.index] = this.pipeline[this.index]
      this.inputReferenceOptions = []
    },
    onSetupComponent(pipeline) {
      this.index = this.pipeline.map(x => x.index).indexOf(pipeline)
      this.componentTitle = this.pipeline[this.index].title
      this.componentDescription = this.pipeline[this.index].description
      this.componentInputIndex = this.pipeline[this.index].input_index
      this.componentInputReferenceSelected = this.pipeline[this.index].input_ref
      this.componentInputReferenceOptions = this.pipeline.map(x => x.index)
      this.componentInputReferenceOptions.splice(0, 0, '')
      this.componentLoadingReferenceSelected = this.pipeline[this.index].loading_ref
      this.componentLoadingReferenceOptions = this.pipeline.map(x => x.index)
      this.componentLoadingReferenceOptions.splice(0, 0, '')
      this.$bvModal.show('setupComponentModal')
    },
    removeComponent() {
      this.pipeline.splice(this.index, 1)
    },
    onRemoveComponent(pipeline) {
      this.index = this.pipeline.map(x => x.index).indexOf(pipeline)
      this.removeComponent()
    },
    addComponent() {
      let index = this.index
      for (let i = index; i < this.pipeline.length; i++) {
        this.$store.unregisterModule('pipeline_' + i)
      }
      this.pipeline.splice(index, 0, {
        index: 'pipeline_' + index,
        type: this.componentSelected
      })
      for (let i = index + 1; i < this.pipeline.length; i++) {
        let pipeline = this.pipeline[i]
        if ('input_ref' in pipeline) {
          this.pipeline[i].input_ref =
            'pipeline_' + (parseInt(pipeline.input_ref.split('_')[1]) + 1)
        }
        if ('loading_ref' in pipeline) {
          this.pipeline[i].loading_ref =
            'pipeline_' + (parseInt(pipeline.loading_ref.split('_')[1]) + 1)
        }
        this.pipeline[i].index =
          'pipeline_' + (parseInt(pipeline.index.split('_')[1]) + 1)
      }
    },
    onAddComponent(pipeline) {
      this.$bvModal.show('addComponentModal')
      this.index = this.pipeline.map(x => x.index).indexOf(pipeline) + 1
    },
    onMoveDownComponent(pipeline) {
      console.log('move down', pipeline)
      this.index = this.pipeline.map(x => x.index).indexOf(pipeline) + 1
    },
    onMoveUpComponent(pipeline) {
      console.log('move up', pipeline)
      this.index = this.pipeline.map(x => x.index).indexOf(pipeline) + 1
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
  margin-bottom: 20px;
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
