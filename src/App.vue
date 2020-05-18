<template>
  <div id="app">
    <Header
      v-on:onExportPipeline="onExportPipeline"
      v-on:onImportPipeline="onImportPipeline"
      v-on:onLoadPipeline="onLoadPipeline"
      :loading.sync="loading"
      :templates.sync="templates"
    />
    <a ref="export-pipeline" style="display:none" />
    <b-form-file ref="import-pipeline" @change="onImportPipeline" style="display:none"></b-form-file>
    <b-card>
      <div v-if="loading" class="text-center">
        <b-spinner type="grow"></b-spinner>
      </div>
      <template v-for="component in pipeline">
        <component
          :ref="component.index"
          v-bind:key="component.key"
          v-bind:is="component.type"
          :component.sync="component"
          :length.sync="pipeline.length"
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
import templates from './templates/index.js'

export default {
  name: 'App',
  props: [],
  components: {
    Header,
    ToolbarFooter,
    DatasetLoader: () => import('./components/DatasetLoader'),
    DatasetTextViewer: () => import('./components/DatasetTextViewer'),
    DatasetTableViewer: () => import('./components/DatasetTableViewer'),
    TSModel: () => import('./components/TSModel'),
    TSModelCompiler: () => import('./components/TSModelCompiler'),
    TSModelPredictor: () => import('./components/TSModelPredictor')
  },
  created() {
    let promises = this.componentOptions.map(
      function(c) {
        return this.$options.components[c]()
      }.bind(this)
    )
    Promise.all(promises).then(
      function(res) {
        this.onLoadPipeline('Tensorflow: Making Predictions from 2D')
      }.bind(this)
    )
  },
  data() {
    let data = {
      template: 'pipeline_0',
      index: null,
      loading: true,
      componentSelected: 'DatasetLoader',
      componentOptions: ['DatasetLoader', 'DatasetTextViewer', 'DatasetTableViewer', 'TSModel', 'TSModelCompiler', 'TSModelPredictor'],
      componentTitle: null,
      componentDescription: null,
      componentInputIndex: null,
      componentInputReferenceSelected: null,
      componentInputReferenceOptions: [],
      templates: [],
      pipeline: []
    }
    templates.forEach(item => {
      let template = { ...item, value: null }
      data.templates.push(template)
    })
    return data
  },
  methods: {
    setupComponent() {
      this.pipeline[this.index].key = Math.random()
      this.pipeline[this.index].title = this.componentTitle
      this.pipeline[this.index].description = this.componentDescription
      this.pipeline[this.index].input_ref = this.componentInputReferenceSelected !== '' ? `pipeline_${this.componentInputReferenceSelected}` : undefined
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
      this.componentInputReferenceSelected = this.pipeline[this.index].input_ref !== undefined ? this.pipeline[this.index].input_ref.replace(/pipeline_/g, '') : undefined
      this.componentInputReferenceOptions = this.pipeline.filter(x => x.index !== index).map(x => x.index.replace(/pipeline_/g, ''))
      this.componentInputReferenceOptions.splice(0, 0, '')
      this.componentInputIndex = this.pipeline[this.index].input_index
      this.$bvModal.show('setup-component')
    },
    removeComponent() {
      let index = this.index
      this.pipeline.splice(index, 1)
      for (let i = 0; i < this.pipeline.length; i++) {
        let pipeline = this.pipeline[i]
        let invalidate = false
        if ('input_ref' in pipeline) {
          let ref = parseInt(pipeline.input_ref.split('_')[1])
          if (ref === index) {
            invalidate = true
            delete this.pipeline[i].input_ref
          } else if (ref > index) {
            invalidate = true
            if (ref - 1 === -1) {
              delete this.pipeline[i].input_ref
            } else {
              this.pipeline[i].input_ref = 'pipeline_' + (ref - 1)
            }
          }
        }
        if (i >= index) {
          invalidate = true
          this.pipeline[i].index = 'pipeline_' + (parseInt(pipeline.index.split('_')[1]) - 1)
        }
        if (invalidate) {
          pipeline.key = Math.random()
        }
      }
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
      for (let i = 0; i < this.pipeline.length; i++) {
        let pipeline = this.pipeline[i]
        let invalidate = false
        if ('input_ref' in pipeline) {
          let ref = parseInt(pipeline.input_ref.split('_')[1])
          if (ref === index) {
            invalidate = true
            delete this.pipeline[i].input_ref
          } else if (ref > index) {
            invalidate = true
            this.pipeline[i].input_ref = 'pipeline_' + (ref + 1)
          }
        }
        if (i > index) {
          invalidate = true
          this.pipeline[i].index = 'pipeline_' + (parseInt(pipeline.index.split('_')[1]) + 1)
        }
        if (invalidate) {
          pipeline.key = Math.random()
        }
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
      this.pipeline[this.index] = this.pipeline.splice(this.index + 1, 1, this.pipeline[this.index])[0]
      for (let i = this.index; i < this.pipeline.length; i++) {
        let pipeline = this.pipeline[i]
        pipeline.index = 'pipeline_' + i
        pipeline.key = Math.random()
      }
      delete this.pipeline[this.index].input_ref
      delete this.pipeline[this.index].input_index
      delete this.pipeline[this.index + 1].input_ref
      delete this.pipeline[this.index + 1].input_index
    },
    onMoveUpComponent(index) {
      this.index = this.pipeline.map(x => x.index).indexOf(index)
      this.pipeline[this.index] = this.pipeline.splice(this.index - 1, 1, this.pipeline[this.index])[0]
      for (let i = this.index - 1; i < this.pipeline.length; i++) {
        let pipeline = this.pipeline[i]
        pipeline.index = 'pipeline_' + i
        pipeline.key = Math.random()
      }
      delete this.pipeline[this.index].input_ref
      delete this.pipeline[this.index].input_index
      delete this.pipeline[this.index - 1].input_ref
      delete this.pipeline[this.index - 1].input_index
    },
    onExportPipeline() {
      let pipeline = []
      this.pipeline.forEach(p => {
        pipeline.push(this.$refs[p.index][0].exportData())
      })
      let blob = new Blob([JSON.stringify(pipeline, null, 2)], { type: 'application/json' })
      let url = window.URL.createObjectURL(blob)
      this.$refs['export-pipeline'].href = url
      this.$refs['export-pipeline'].download = 'pipeline.json'
      this.$refs['export-pipeline'].click()
      window.URL.revokeObjectURL(url)
    },
    onImportPipeline(event) {
      if (event === undefined) {
        this.$refs['import-pipeline'].$el.children[0].click()
      } else if (event instanceof Event) {
        if (event.target.files.length) {
          this.loading = true
          this.pipeline = []
          let file = event.target.files[0]
          let reader = new FileReader()
          this.fileName = file.name
          reader.onload = e => this.onImportPipeline(e.target)
          reader.readAsText(file)
        }
      } else if (event instanceof FileReader) {
        if (event.error === null) {
          let value = JSON.parse(event.result)
          let template = {
            name: `${this.templates.length}: ${this.fileName}`,
            value: event.result,
            key: Math.random()
          }
          value.forEach(p => {
            p.key = Math.random()
          })
          this.templates.push(template)
          this.pipeline = value
        }
        this.loading = false
      }
    },
    onLoadPipeline(event) {
      let templates = this.templates.filter(template => template.name === event)
      if (templates.length && templates[0].value === null) {
        this.loading = true
        this.pipeline = []
        let module = () => import('./templates/' + templates[0].js)
        module().then(data => {
          let value = data.default
          value.forEach(p => {
            p.key = Math.random()
          })
          templates[0].key = Math.random()
          templates[0].value = JSON.stringify(value)
          this.pipeline = value
          this.loading = false
        })
      } else if (templates.length && templates[0].value !== null) {
        let value = JSON.parse(templates[0].value)
        value.forEach(p => {
          p.key = Math.random()
        })
        templates[0].key = Math.random()
        this.pipeline = value
      } else {
        this.pipeline = []
      }
    }
  }
}
</script>

<style>
.nav-link:focus {
  outline: none !important;
}
.form-toolbar-rtl {
  direction: rtl;
  float: right;
}
.form-float-right {
  float: right;
}
.form-toolbar-rtl .btn,
.form-toolbar-rtl .badge {
  margin-left: 4px;
}
.form-toolbar-ltr {
  direction: ltr;
  float: left;
}
.form-float-left {
  float: left;
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
.indexInput {
  padding-right: 10px;
  width: 220px;
}
.indexInput select {
  width: 210px !important;
}
.indexInput label {
  justify-content: flex-start;
  padding-left: 10px;
}
</style>
<style scoped>
</style>
