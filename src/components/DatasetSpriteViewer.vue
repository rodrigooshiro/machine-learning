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
      spriteWidth: 1,
      spriteHeight: 1,
      imageWidth: 1,
      imageHeight: 1,
      pageWidth: 1,
      pageHeight: 1
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
      jquery(this.$refs['draw']).empty()
      let pixels = this.pageWidth * this.spriteWidth * this.spriteHeight * this.pageHeight
      let imagePageSize = parseInt(Math.ceil(pixels / this.imageWidth))
      const batchImagesArray = new Float32Array(imagePageSize * this.imageWidth)
      for (let i = 0; i < imagePageSize; i++) {
        const idx = this.imagePage * imagePageSize + i
        if (idx * this.imageWidth < this.datasetImages.length) {
          const image = this.datasetImages.slice(
            idx * this.imageWidth,
            idx * this.imageWidth + this.imageWidth
          )
          batchImagesArray.set(image, i * this.imageWidth)
        }
      }
      let xs = tf.tensor2d(batchImagesArray, [imagePageSize, this.imageWidth])
      let canvas = document.createElement('canvas')
      canvas.width = this.pageWidth * this.spriteWidth
      canvas.height = this.pageHeight * this.spriteHeight
      this.$refs['draw'].appendChild(canvas)
      let numExamples = xs.shape[0]
      let sprite = document.createElement('canvas')
      sprite.width = this.spriteWidth
      sprite.height = this.spriteHeight
      let canvasContext = canvas.getContext('2d')
      let spriteContext = sprite.getContext('2d')
      let maxExample = this.datasetImages.length / this.spriteWidth / this.spriteHeight
      let pageExample = this.imagePage * this.pageWidth * this.pageHeight
      for (let i = 0; i < numExamples && i + pageExample < maxExample; i++) {
        let x = (i * this.spriteWidth) % (this.pageWidth * this.spriteWidth)
        let y =
          this.spriteHeight * parseInt((i * this.spriteWidth) / (this.pageWidth * this.spriteWidth))
        let imageTensor = xs
          .slice([i, 0], [1, xs.shape[1]])
          .reshape([this.spriteWidth, this.spriteHeight, 1])
        await tf.browser.toPixels(imageTensor, sprite)
        const imageData = spriteContext.getImageData(0, 0, sprite.width, sprite.height)
        canvasContext.putImageData(imageData, x, y)
        imageTensor.dispose()
      }
      xs.dispose()
    },
    onShowModal() {
      this.loadPage()
    },
    onPrevPage(event) {
      this.imagePage -= 1
      let pixels = this.pageWidth * this.spriteWidth * this.spriteHeight * this.pageHeight
      if (this.imagePage * pixels < 0) {
        this.imagePage = parseInt(this.datasetImages.length / pixels)
      }
      this.loadPage()
    },
    onNextPage(event) {
      this.imagePage += 1
      let pixels = this.pageWidth * this.spriteWidth * this.spriteHeight * this.pageHeight
      if (this.imagePage * pixels > this.datasetImages.length) {
        this.imagePage = 0
      }
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
        this.pageWidth = parseInt(500 / this.spriteWidth)
        this.pageHeight = parseInt(400 / this.spriteHeight)
        let datasetBytesBuffer = new ArrayBuffer(this.imageWidth * this.imageHeight * 4)

        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let chunkSize = 10 * this.pageHeight * this.spriteHeight
        canvas.width = this.imageWidth
        canvas.height = chunkSize
        for (let i = 0; i < this.imageHeight / chunkSize; i++) {
          let size = this.imageWidth * chunkSize
          if (i * this.imageWidth * chunkSize * 4 + size * 4 > this.imageWidth * this.imageHeight * 4) {
            size = (this.imageWidth * this.imageHeight * 4 - i * this.imageWidth * chunkSize * 4) / 4
          }
          const datasetBytesView = new Float32Array(
            datasetBytesBuffer,
            i * this.imageWidth * chunkSize * 4,
            size
          )

          ctx.drawImage(
            img,
            0,
            i * chunkSize,
            this.imageWidth,
            chunkSize,
            0,
            0,
            this.imageWidth,
            chunkSize
          )

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          for (let j = 0; j < imageData.data.length / 4; j++) {
            datasetBytesView[j] = imageData.data[j * 4] / 255
          }
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
