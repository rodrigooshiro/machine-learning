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
    input_ref: 'pipeline_0',
    type: 'DatasetSpriteViewer',
    data: {
      spriteWidth: 28,
      spriteHeight: 28
    }
  },
  {
    index: 'pipeline_2',
    type: 'DatasetLoader',
    data: {
      remoteFile: 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8'
    }
  },
  {
    index: 'pipeline_3',
    input_ref: 'pipeline_2',
    type: 'DatasetLabel',
    data: {
      labelSize: 10,
      output_ref: 'pipeline_1'
    }
  },
  {
    index: 'pipeline_4',
    type: 'TSModel',
    title: 'Define the model architecture',
    input_ref: 'pipeline_1',
    data: {
      layerSize: 6,
      layerUnits: [1, 1, 1, 1, 1, 10],
      activationSelected: ['relu', '', 'relu', '', '', 'softmax'],
      kernelInitializerSelected: ['varianceScaling', '', 'varianceScaling', '', '', 'varianceScaling'],
      biasInitializerSelected: ['zeros', 'zeros', 'zeros', 'zeros', 'zeros', 'zeros']
    }
  }
]
