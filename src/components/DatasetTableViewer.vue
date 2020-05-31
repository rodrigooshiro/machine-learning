<template>
  <component-layout :component.sync="component" :length.sync="length" :loading.sync="loading">
    <b-form class="form-toolbar-rtl" inline>
      <b-button size="badge" @click="downloadAction" :disabled="downloadActionDisabled">
        <b-icon icon="download" class="btn-icon"></b-icon>
        <a ref="downloadFileContent" style="display:none" />
      </b-button>
      <b-button size="badge" @click="trashAction" :disabled="trashActionDisabled">
        <b-icon icon="trash" class="btn-icon"></b-icon>
      </b-button>
      <b-button
        size="badge"
        v-b-modal="'dataset-view-' + component.index"
        :disabled="imageActionDisabled"
      >
        <b-icon icon="card-image" class="btn-icon"></b-icon>
      </b-button>
      <b-button size="badge" @click="onToggleToolbar">
        <b-icon :icon="toggleIcon"></b-icon>
      </b-button>
    </b-form>

    <b-collapse :visible="toggleIcon === 'caret-up'">
      <b-form inline>
        <div class="indexInput">
          <label>Header</label>
          <b-form-select v-model="header" :options="[true, false]"></b-form-select>
        </div>

        <div class="indexInput">
          <label>Filters</label>
          <b-dropdown
            :text="header === true ? 'Headers' : 'Columns'"
            no-flip
            split
            split-variant="outline-secondary"
            block
            variant="secondary"
          >
            <b-dropdown-form v-if="header === true" style="text-align: left">
              <template v-for="item in headers">
                <b-form v-bind:key="item.key" inline>
                  <b-form-checkbox
                    v-model="item.checked"
                    :indeterminate="item.state===-1"
                    :checked="item.key"
                    :value="item.key"
                    :unchecked-value="item.key"
                    @change="onHeaderChange"
                  ></b-form-checkbox>
                  {{ item.label }}
                </b-form>
              </template>
            </b-dropdown-form>
            <b-dropdown-form v-if="header === false" style="text-align: left">
              <template v-for="item in columns">
                <b-form v-bind:key="item.key" inline>
                  <b-form-checkbox
                    v-model="item.checked"
                    :indeterminate="item.state===-1"
                    :checked="item.key"
                    :value="item.key"
                    :unchecked-value="item.key"
                    @change="onColumnChange"
                  ></b-form-checkbox>
                  {{ item.label }}
                </b-form>
              </template>
            </b-dropdown-form>
          </b-dropdown>
        </div>

        <div class="indexInput">
          <label>X axis column</label>
          <b-form-spinbutton
            v-model="xAxis"
            min="-1"
            :max="indexMax"
            :disabled="indexMax<0"
            :formatter-fn="indexFormatter"
          ></b-form-spinbutton>
        </div>
        <div class="indexInput">
          <label>Y axis column</label>
          <b-form-spinbutton
            v-model="yAxis"
            min="-1"
            :max="indexMax"
            :disabled="indexMax<1"
            :formatter-fn="indexFormatter"
          ></b-form-spinbutton>
        </div>
        <div class="indexInput">
          <label>Z axis column</label>
          <b-form-spinbutton
            v-model="zAxis"
            min="-1"
            :max="indexMax"
            :disabled="indexMax<2"
            :formatter-fn="indexFormatter"
          ></b-form-spinbutton>
        </div>
        <div class="indexInput">
          <label>Label column</label>
          <b-form-spinbutton
            v-model="lAxis"
            min="-1"
            :max="indexMax"
            :disabled="indexMax<2"
            :formatter-fn="indexFormatter"
          ></b-form-spinbutton>
        </div>
      </b-form>
      <div style="margin-top: 8px;"></div>
    </b-collapse>

    <b-input-group class="mb-2">
      <div class="fileTable" v-infinite-scroll="onLoadMore">
        <b-table striped hover :fields="headersDataTable" :items="inputDataTableList"></b-table>
      </div>
    </b-input-group>

    <b-modal
      :id="'dataset-view-' + component.index"
      title="Dataset View"
      :static="true"
      :hide-footer="true"
      size="lg"
      @show="onShowModal"
    >
      <center>
        <div ref="draw"></div>
      </center>
    </b-modal>
  </component-layout>
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
import ComponentLayout from './ComponentLayout'
import { mixin } from './mixin'
import * as csv from 'csv-string'
import jquery from 'jquery'
import Plotly from 'plotly.js-dist'
import randomcolor from 'randomcolor'

export default {
  name: 'DatasetTableViewer',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: ['xAxis', 'yAxis', 'zAxis', 'lAxis', 'header', 'headers', 'columns'],
      xAxis: -1,
      yAxis: -1,
      zAxis: -1,
      lAxis: -1,
      header: false,
      headers: [],
      columns: [],
      filterSelected: null,
      filterOptions: [],
      toggleIcon: 'caret-down',
      fileChart: false,
      inputDataTableList: []
    }
    return this.importData(data)
  },
  computed: {
    downloadActionDisabled() {
      let disabled = 0
      disabled |= this.indexMax === 0
      disabled |= this.inputDataTable.length === 0
      return disabled === 1
    },
    trashActionDisabled() {
      return this.downloadActionDisabled
    },
    imageActionDisabled() {
      let disabled = 0
      disabled |= this.indexMax === 0
      disabled |= this.xAxis === -1
      disabled |= this.yAxis === -1
      disabled |= this.xAxis === this.yAxis
      disabled |= this.xAxis === this.zAxis
      disabled |= this.xAxis === this.lAxis
      disabled |= this.yAxis === this.lAxis
      if (this.zAxis !== -1) {
        disabled |= this.yAxis === this.zAxis
        disabled |= this.zAxis === this.lAxis
      }
      return disabled === 1
    },
    dataSize() {
      let dataSize = 0
      if (Array.isArray(this.inputDataTable) && this.inputDataTable.length > 1) {
        if (Array.isArray(this.inputDataTable[0])) {
          dataSize = this.inputDataTable[0].length
        }
      }
      return dataSize
    },
    headersDataTable: {
      get() {
        let headers = null
        if (this.header) {
          headers = this.headers.filter(header => header.state !== 0)
        } else {
          headers = this.columns.filter(column => column.state !== 0)
        }
        return headers
      }
    },
    inputDataTable: {
      get() {
        let data = null
        if (this.inputData !== null) {
          data = []
          let value = ''
          if (Array.isArray(this.inputData)) {
            value = this.inputData
          } else if (Object.isExtensible(this.inputData)) {
            let decoder = new TextDecoder()
            value = decoder.decode(this.inputData).trim()
          }
          if (value.length > 0) {
            try {
              value = JSON.parse(value)
            } catch (e) {}
            if (typeof value === 'string' || value instanceof String) {
              if (value.length > 0) {
                value = csv.parse(value)
              }
            }
            if (Array.isArray(value) && value.length > 0) {
              if (Array.isArray(value[0])) {
                if (this.header) {
                  if (this.headers.length === 0) {
                    this.headers = value[0].map(function(h) {
                      return { key: h, label: h, state: -1, checked: h }
                    })
                  }
                  data = value.slice(1)
                } else {
                  if (this.columns.length === 0) {
                    let dataSize = value[0].length
                    for (let i = 0; i < dataSize; i++) {
                      this.columns.push({
                        key: 'Column ' + i,
                        state: -1,
                        checked: 'Column ' + i,
                        label: 'Column ' + i
                      })
                    }
                  }
                  data = value
                }
              } else if (Object.isExtensible(value[0])) {
                this.header = true
                if (this.headers.length === 0) {
                  this.headers = Object.keys(value[0]).map(function(h) {
                    return { key: h, label: h, state: -1, checked: h }
                  })
                }
                let values = []
                for (let i = 0; i < value.length; i++) {
                  values.push(Object.values(value[i]))
                }
                data = values
              }
            }
          }
        }
        if (this.header === true && data !== null) {
          let items = []
          for (let i = 0; i < data.length; i++) {
            let row = {}
            let skip = false
            for (let j = 0; j < this.headers.length; j++) {
              if (this.headers[j].state !== 0) {
                row[this.headers[j].key] = data[i][j]
              }
              if (this.headers[j].state === 1 && (data[i][j] === undefined || data[i][j] === null)) {
                skip = true
              }
            }
            if (skip === false) {
              items.push(row)
            }
          }
          data = items
        }
        if (this.header === false && data !== null) {
          let items = []
          for (let i = 0; i < data.length; i++) {
            let row = {}
            let skip = false
            for (let j = 0; j < this.columns.length; j++) {
              if (this.columns[j].state !== 0) {
                row[this.columns[j].key] = data[i][j]
              }
              if (this.columns[j].state === 1 && (data[i][j] === undefined || data[i][j] === null)) {
                skip = true
              }
            }
            if (skip === false) {
              items.push(row)
            }
          }
          data = items
        }
        if (data !== null) {
          this.output = data.map(x => Object.values(x))
        } else {
          data = []
          this.inputDataTableList = []
        }
        this.inputDataTableList.push(...data.slice(0, 10))
        return data
      }
    },
    indexMax: {
      get() {
        let indexMax = 0
        if (this.inputDataTable.length > 0) {
          indexMax = this.headersDataTable.length - 1
        }
        return indexMax
      }
    }
  },
  watch: {
    xAxis(next, prev) {
      this.fileChart = false
    },
    yAxis(next, prev) {
      this.fileChart = false
    },
    zAxis(next, prev) {
      this.fileChart = false
    },
    lAxis(next, prev) {
      this.fileChart = false
    },
    inputLoading(next, prev) {
      this.loading = next
    }
  },
  methods: {
    onLoadMore() {
      if (this.inputDataTableList.length < this.inputDataTable.length) {
        this.inputDataTableList.push(
          ...this.inputDataTable.slice(
            this.inputDataTableList.length,
            this.inputDataTableList.length + 10
          )
        )
      }
    },
    onHeaderChange(key) {
      let header = this.headers.filter(h => h.key === key)[0]
      if (header.state === 1) {
        header.state = -1
      } else if (header.state === -1) {
        header.state = 0
        header.checked = false
      } else {
        header.state = 1
      }
    },
    onColumnChange(key) {
      let column = this.columns.filter(h => h.key === key)[0]
      if (column.state === 1) {
        column.state = -1
      } else if (column.state === -1) {
        column.state = 0
        column.checked = false
      } else {
        column.state = 1
      }
    },
    onToggleToolbar() {
      if (this.toggleIcon === 'caret-up') {
        this.toggleIcon = 'caret-down'
      } else if (this.toggleIcon === 'caret-down') {
        this.toggleIcon = 'caret-up'
      }
    },
    onShowModal() {
      if (this.fileChart === false) {
        let dimensions = []
        for (let i = 0; i <= this.indexMax; i++) {
          dimensions.push(this.inputDataTable.map(x => Object.values(x)[i]))
        }
        let trace = {
          x: dimensions[this.xAxis],
          y: dimensions[this.yAxis],
          mode: 'markers',
          marker: {
            size: 12,
            line: {
              width: 0.5
            },
            opacity: 1.0
          },
          type: 'scatter2d'
        }

        let layout = {
          margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
          },
          scene: {
            xaxis: { title: 'X axis' },
            yaxis: { title: 'Y axis' }
          }
        }
        if (this.header) {
          layout.scene.xaxis.title = this.headersDataTable[this.xAxis].label
          layout.scene.yaxis.title = this.headersDataTable[this.yAxis].label
        }

        if (this.zAxis !== -1) {
          trace.z = dimensions[this.zAxis]
          trace.type = 'scatter3d'
          layout.scene.zaxis = { title: 'Z axis' }
          if (this.header) {
            layout.scene.zaxis.title = this.headersDataTable[this.zAxis].label
          }
        }

        if (this.lAxis !== -1) {
          let labels = dimensions[this.lAxis]
          let keyLabels = Array.from(new Set(labels))
          let colorMap = {}
          keyLabels.forEach(label => {
            colorMap[label] = randomcolor()
          })
          trace.text = labels
          trace.marker.color = labels.map(d => colorMap[d])
          trace.marker.line.color = '#000000'
        }

        if (this.zAxis !== -1) {
          Plotly.newPlot(this.$refs['draw'], [trace], layout)
        } else {
          let values = []
          for (let i = 0; i < this.inputDataTable.length; i++) {
            values.push({
              x: trace.x[i],
              y: trace.y[i]
            })
          }
          this.$tfvis.render.scatterplot(
            this.$refs['draw'],
            { values },
            {
              xLabel: layout.scene.xaxis.title,
              yLabel: layout.scene.yaxis.title,
              width: 700,
              height: 450
            }
          )
        }
        this.fileChart = true
      }
    },
    trashAction(event) {
      jquery(this.$refs['draw']).empty()
      this.inputData = null
      this.output = null
      this.loadData(this.data)
      this.loadData(this.component.data)
    },
    downloadAction(event) {
      if (event.isTrusted) {
        let blob = new Blob([this.inputDataTable.join('\n')], { type: 'octet/stream' })
        let url = window.URL.createObjectURL(blob)
        this.$refs['downloadFileContent'].href = url
        this.$refs['downloadFileContent'].download = this.component.index
        this.$refs['downloadFileContent'].click()
        window.URL.revokeObjectURL(url)
      }
    }
  }
}
</script>

<style scoped>
.fileTable {
  width: 100% !important;
  height: 200px !important;
  border: 3px solid #ced4da !important;
  border-radius: 0.25rem !important;
  resize: none;
  overflow: auto;
  resize: none;
}
</style>
