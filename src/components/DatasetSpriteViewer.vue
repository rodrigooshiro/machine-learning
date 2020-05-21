<template>
  <component-layout :component.sync="component" :length.sync="length" :loading.sync="loading">
    <b-form class="form-toolbar-rtl" inline>
      <b-button size="badge" @click="plugAction" :disabled="plugActionDisabled">
        <b-icon icon="plug" class="btn-icon"></b-icon>
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
          <label>Sprite Width</label>
          <b-form-spinbutton v-model="spriteWidth" min="1" :disabled="editActionDisabled"></b-form-spinbutton>
        </div>
        <div class="indexInput">
          <label>Sprite Height</label>
          <b-form-spinbutton v-model="spriteHeight" min="1" :disabled="editActionDisabled"></b-form-spinbutton>
        </div>
      </b-form>
    </b-collapse>

    <b-modal
      :id="'dataset-view-' + component.index"
      title="Dataset View"
      :static="true"
      :hide-footer="true"
      size="lg"
      @show="onShowModal"
    >
      <b-carousel :interval="0" :controls="true" ref="dataset-view-carousel">
        <b-carousel-slide :img-blank="true">
          <template v-slot:img>
            <div class="text-center" ref="draw"></div>
          </template>
        </b-carousel-slide>
      </b-carousel>
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
import * as tf from '@tensorflow/tfjs'
import jquery from 'jquery'

export default {
  name: 'DatasetSpriteViewer',
  components: { ComponentLayout },
  mixins: [mixin],
  data() {
    let data = {
      serializable: ['spriteWidth', 'spriteHeight'],
      toggleIcon: 'caret-up',
      fileChart: false,
      imagePage: 0,
      imagePageSize: 140,
      spriteWidth: 1,
      spriteHeight: 1,
      imageWidth: 1,
      imageHeight: 1
    }
    return this.importData(data)
  },
  mounted() {
    jquery(this.$refs['dataset-view-carousel'].$el)
      .find('.carousel-control-prev')
      .on('click', this.onPrevPage)
    jquery(this.$refs['dataset-view-carousel'].$el)
      .find('.carousel-control-next')
      .on('click', this.onNextPage)
  },
  computed: {
    editActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.inputData === null
      return disabled === 1
    },
    trashActionDisabled() {
      let disabled = 0
      disabled |= this.loading === true
      disabled |= this.inputData === null
      disabled |= this.fileChart === false
      return disabled === 1
    },
    plugActionDisabled() {
      return this.editActionDisabled
    },
    imageActionDisabled() {
      let disabled = 0
      disabled |= this.fileChart === false
      return disabled === 1
    }
  },
  watch: {
    inputLoading(next, prev) {
      this.loading = next
    }
  },
  methods: {
    onToggleToolbar() {
      if (this.toggleIcon === 'caret-up') {
        this.toggleIcon = 'caret-down'
      } else if (this.toggleIcon === 'caret-down') {
        this.toggleIcon = 'caret-up'
      }
    },
    async loadPage() {
      // let batchSize = (this.imageWidth * this.imageHeight) / (this.spriteWidth * this.spriteHeight)
      // batchSize = 140
      jquery(this.$refs['draw']).empty()
      const batchImagesArray = new Float32Array(this.imagePageSize * this.imageWidth)
      for (let i = 0; i < this.imagePageSize; i++) {
        const idx = this.imagePage * this.imagePageSize + i
        const image = this.datasetImages.slice(
          idx * this.imageWidth,
          idx * this.imageWidth + this.imageWidth
        )
        batchImagesArray.set(image, i * this.imageWidth)
      }
      let xs = tf.tensor2d(batchImagesArray, [this.imagePageSize, this.imageWidth])
      let numExamples = xs.shape[0]
      for (let i = 0; i < numExamples; i++) {
        const imageTensor = tf.tidy(() => {
          return xs.slice([i, 0], [1, xs.shape[1]]).reshape([this.spriteWidth, this.spriteHeight, 1])
        })
        let sprite = document.createElement('canvas')
        sprite.width = this.spriteWidth
        sprite.height = this.spriteHeight
        await tf.browser.toPixels(imageTensor, sprite)
        if (i % (sprite.width / 2) === 0 && i > 0) {
          this.$refs['draw'].appendChild(document.createElement('br'))
        }
        this.$refs['draw'].appendChild(sprite)
        imageTensor.dispose()
      }
      xs.dispose()
    },
    onShowModal() {
      this.loadPage()
    },
    onPrevPage(event) {
      this.imagePage -= 1
      this.loadPage()
    },
    onNextPage(event) {
      this.imagePage += 1
      this.loadPage()
    },
    trashAction(event) {
      jquery(this.$refs['draw']).empty()
      this.imagePage = 0
      this.fileChart = false
      this.output = null
      this.loadData(this.data)
      this.loadData(this.component.data)
    },
    plugAction(event) {
      this.loading = true
      let blob = new Blob([this.inputData])
      let img = new Image()
      let urlCreator = window.URL || window.webkitURL
      img.onload = async function() {
        this.imageWidth = img.naturalWidth
        this.imageHeight = img.naturalHeight
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight

        const datasetBytesBuffer = new ArrayBuffer(img.naturalWidth * img.naturalHeight * 4)
        const datasetBytesView = new Float32Array(
          datasetBytesBuffer,
          0,
          img.naturalWidth * img.naturalHeight
        )
        ctx.drawImage(
          img,
          0,
          0,
          img.naturalWidth,
          img.naturalHeight,
          0,
          0,
          img.naturalWidth,
          img.naturalHeight
        )

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        for (let j = 0; j < imageData.data.length / 4; j++) {
          datasetBytesView[j] = imageData.data[j * 4] / 255
        }
        this.datasetImages = new Float32Array(datasetBytesBuffer)
        this.imagePage = 0
        this.fileChart = true
        this.loading = false
      }.bind(this)
      img.src = urlCreator.createObjectURL(blob)
    }
  }
}
</script>

<style scoped>
</style>
