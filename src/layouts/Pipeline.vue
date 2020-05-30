<template>
  <page-layout ref="layout" :name="$options.name">
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
          v-on:onPlugAction="onPlugAction"
        ></component>
      </template>
      <component-footer
        v-if="(loading === false) && (pipeline.length === 0)"
        ref="componentFooter"
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
    <div v-if="pipeline.length" class="playButton">
      <b-button
        @click="onPlayPipeline"
        variant="transparent"
        class="playIcon"
        :disabled="playActionDisabled"
      >
        <b-iconstack style="width: 50px; height: 50px;">
          <b-icon icon="circle-fill" variant="secondary"></b-icon>
          <b-icon icon="circle" style="color: #aaa"></b-icon>
          <b-icon
            icon="play-fill"
            class="rounded-circle bg-danger"
            shift-h="1"
            style="color: white"
          ></b-icon>
        </b-iconstack>
      </b-button>
    </div>
    <b-badge v-if="queue.length > 0" pill class="playBadge">{{ pipeline.length - queue.length }}</b-badge>
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
import ComponentFooter from '../components/ComponentFooter.vue'

export default {
  name: 'Pipeline',
  props: [],
  components: {
    PageLayout,
    ComponentFooter,
    DatasetLabel: () => import('../components/DatasetLabel'),
    DatasetLoader: () => import('../components/DatasetLoader'),
    DatasetSplitter: () => import('../components/DatasetSplitter'),
    DatasetSpriteViewer: () => import('../components/DatasetSpriteViewer'),
    DatasetTableViewer: () => import('../components/DatasetTableViewer'),
    DatasetTextViewer: () => import('../components/DatasetTextViewer'),
    TSModelBuilder: () => import('../components/TSModelBuilder'),
    TSModelCompiler: () => import('../components/TSModelCompiler'),
    TSModelPredictor: () => import('../components/TSModelPredictor')
  },
  created() {
    let action = null
    let template = null
    if (this.$route.query.action !== undefined) {
      let query = Object.assign({}, this.$route.query)
      action = query.action
      delete query.action
      this.$router.replace({ query })
    }
    if (this.$route.query.template !== undefined) {
      let query = Object.assign({}, this.$route.query)
      template = query.template
      delete query.template
      this.$router.replace({ query })
    }
    let promises = this.componentOptions.map(
      function(c) {
        return this.$options.components[c]()
      }.bind(this)
    )
    Promise.all(promises).then(
      function(res) {
        if (action === 'new') {
          this.onNewPipeline()
        } else {
          this.onLoadPipeline(template)
        }
      }.bind(this)
    )
  },
  mounted() {
    let store = {
      namespaced: false,
      state: {
        global: {
          model: null,
          inputShape: null,
          inputMatrix: null,
          outputShape: null,
          outputMatrix: null,
          labels: null,
          training: null,
          evaluation: null
        }
      },
      mutations: {
        setGlobal(state, value) {
          state.global = value
        }
      }
    }
    this.$store.registerModule('pipeline', store)
  },
  data() {
    return {
      template: 'pipeline_0',
      index: null,
      loading: true,
      componentLoading: false,
      componentSelected: 'DatasetLoader',
      componentOptions: [
        'DatasetLabel',
        'DatasetLoader',
        'DatasetSplitter',
        'DatasetSpriteViewer',
        'DatasetTableViewer',
        'DatasetTextViewer',
        'TSModelBuilder',
        'TSModelCompiler',
        'TSModelPredictor'
      ],
      componentTitle: null,
      componentDescription: null,
      componentInputIndex: null,
      componentInputReferenceSelected: null,
      componentInputReferenceOptions: [],
      pipeline: [],
      queue: []
    }
  },
  computed: {
    playActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.componentLoading === true
      disabled |= this.queue.length > 0
      return disabled === 1
    }
  },
  watch: {
    '$route.query.template'(next, prev) {
      if (next !== undefined) {
        let query = Object.assign({}, this.$route.query)
        delete query.template
        this.$router.replace({ query })
        this.onLoadPipeline(next)
      }
    },
    '$route.query.action'(next, prev) {
      if (next !== undefined) {
        let query = Object.assign({}, this.$route.query)
        delete query.action
        this.$router.replace({ query })
        if (next === 'home') {
          this.onLoadPipeline()
        }
        if (next === 'new') {
          this.onNewPipeline()
        }
        if (next === 'import') {
          this.onImportPipeline()
        }
        if (next === 'export') {
          this.onExportPipeline()
        }
      }
    }
  },
  methods: {
    setupComponent() {
      this.pipeline[this.index].key = Math.random()
      this.pipeline[this.index].title = this.componentTitle
      this.pipeline[this.index].description = this.componentDescription
      this.pipeline[this.index].input_ref =
        this.componentInputReferenceSelected !== ''
          ? `pipeline_${this.componentInputReferenceSelected}`
          : undefined
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
      this.componentInputReferenceSelected =
        this.pipeline[this.index].input_ref !== undefined
          ? this.pipeline[this.index].input_ref.replace(/pipeline_/g, '')
          : undefined
      this.componentInputReferenceOptions = this.pipeline
        .filter(x => x.index !== index)
        .map(x => x.index.replace(/pipeline_/g, ''))
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
      if (this.$refs['componentFooter']) {
        this.$refs['componentFooter'].toggleIcon = 'caret-down'
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
    onNewPipeline() {
      this.pipeline = []
      this.loading = false
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
        let templates = this.$refs['layout'].$refs['header'].templates
        if (event.error === null) {
          let value = JSON.parse(event.result)
          let template = {
            name: `${templates.length}: ${this.fileName}`,
            value: event.result,
            key: Math.random()
          }
          value.forEach(p => {
            p.key = Math.random()
          })
          templates.push(template)
          this.pipeline = value
        }
        this.loading = false
      }
    },
    onLoadPipeline(name) {
      if (name === undefined || name === null) {
        name = 'Tensorflow: Making Predictions from 2D'
        // name = 'Tensorflow: Making More Predictions from 2D'
        // name = 'Tensorflow: Autoencoder'
        // name = 'Tensorflow: Handwritten digit recognition with CNNs'
      }
      let templates = this.$refs['layout'].$refs['header'].templates.filter(
        template => template.name === name
      )
      if (templates.length && templates[0].value === null) {
        this.loading = true
        this.pipeline = []
        let module = () => import('../templates/' + templates[0].js)
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
      }
    },
    onPlayPipeline() {
      let stack = 0
      if (this.queue.length === 0) {
        this.pipeline.forEach(item => {
          this.queue.push(item.index)
          item.unwatch = this.$watch(
            function() {
              return this.$refs[item.index][0].loading
            },
            function(next, prev) {
              if (next) {
                stack++
              } else {
                stack--
                let index = this.queue.indexOf(this.item.index)
                this.queue.splice(index, 1)
                this.item.unwatch()
              }
              if (stack === 0) {
                if (this.queue.length) {
                  this.onPlayPipeline()
                }
              }
            }.bind({ ...this, item: item })
          )
        })
      }
      this.$refs[this.queue[0]][0].plugAction()
    },
    onPlugAction(loading) {
      this.componentLoading = loading
    }
  }
}
</script>

<style scoped>
.playButton {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 50px;
  height: 50px;
  z-index: 10;
}
.playBadge {
  position: fixed;
  top: 65px;
  right: 13px;
  border-style: solid;
  border-width: 2px;
  z-index: 10;
  border-color: #aaaaaa;
  opacity: 0.65;
}
.playIcon,
.playIcon:focus,
.playIcon:hover,
.playIcon:active {
  font-size:10px;
  width: 50px;
  height: 50px;
  margin: 0;
  padding: 0;
  border: 0px;
  box-shadow: none;
  outline: 0px;
}
</style>
