module.exports = [
  {
    index: 'pipeline_0',
    type: 'DatasetLoader',
    title: 'Dataset Loader',
    data: {
      remoteFile: 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png'
    }
  },
  {
    index: 'pipeline_1',
    type: 'DatasetLoader',
    title: 'Dataset Loader',
    data: {
      remoteFile: 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8'
    }
  },
  {
    index: 'pipeline_2',
    input_ref: 'pipeline_0',
    type: 'DatasetSpriteViewer',
    data: {
      spriteWidth: 28,
      spriteHeight: 28
    }
  }
]
