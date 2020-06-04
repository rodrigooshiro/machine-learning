module.exports = [
  {
    index: 'pipeline_0',
    type: 'DatasetLoader',
    title: 'Dataset Loader',
    description:
      'This pipeline is based on the tutorial from tensorflow about [convolutional neural network]' +
      '(https://www.tensorflow.org/js/tutorials/training/handwritten_digit_cnn). The datas source' +
      'below is a **PNG** image of **1** channel (greyscale) with the size of **784** x **65000**.',
    data: {
      remoteFile: 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png'
    }
  },
  {
    index: 'pipeline_1',
    input_ref: 'pipeline_0',
    description: 'The image contains **65000** digits, each with the size of **28** x **28**.',
    type: 'DatasetSpriteViewer',
    data: {
      spriteWidth: 28,
      spriteHeight: 28
    }
  },
  {
    index: 'pipeline_2',
    type: 'DatasetLoader',
    description:
      'The next datasource is the **labels** and they are represented as an array of **10** zeroes or ' +
      'ones. In the array, if the digit is a zero, then the first number in the array will be one, if ' +
      "its a one, then the second number will be a one and so on... It's like turning on and off the " +
      'numbers of the array, so the **neural network** should be able to turn one of its **10** ' +
      'outputs (as its a classifier) to represent a digit. There are 65000 **groups** of 10 numbers ' +
      'describing the digits in the image from above.',
    data: {
      remoteFile: 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8'
    }
  },
  {
    index: 'pipeline_3',
    input_ref: 'pipeline_2',
    description:
      'We define **10** numbers to represent a **label** (as there are 10 possible digits), and then ' +
      'we **reference** the output of pipeline 1, so it will have this information added to it.',
    type: 'DatasetLabel',
    data: {
      labelSize: 10
    }
  },
  {
    index: 'pipeline_4',
    type: 'DatasetSplitter',
    title: 'Dataset Splitter',
    description:
      'Because javascript has limitations regarding the total memory it may use, the complete ' +
      'datasource will not be loaded in the pipeline. To run this CNN only **10%** of the total ' +
      'dataset will be selected and ' +
      'shuffled. With **65000** digits in the example, only **6500** will be used and split between ' +
      'training (**70%**) and evaluation (**30%**) sets.',
    data: {
      sampleSplit: 0.1,
      shuffle: true,
      trainingRatio: 0.7,
      evaluationRatio: 0.3,
      inputShapeLength: 3,
      inputShape: [28, 28, 1],
      outputShapeLength: 1,
      outputShape: [10]
    }
  },
  {
    index: 'pipeline_5',
    input_ref: 'pipeline_4',
    type: 'TSModelBuilder',
    title: 'Define the model architecture',
    description:
      "This is how the neural network is defined, it's important to have the last layer with **10**, " +
      'units as each unit will categorize the digits.',
    data: {
      layerSize: 6,
      layerName: ['conv2d', 'maxPooling2d', 'conv2d', 'maxPooling2d', 'flatten', 'dense'],
      units: [0, 0, 0, 0, 0, 10],
      kernelSize: [5, 0, 5, 0, 0, 0],
      filters: [8, -1, 16, -1, -1, 10],
      strides: [[1], [2, 2], [1], [2, 2], [], []],
      poolSize: [[], [2, 2], [], [2, 2], [], []],
      activation: ['relu', '--', 'relu', '--', '--', 'softmax'],
      kernelInitializer: ['varianceScaling', '--', 'varianceScaling', '--', '--', 'varianceScaling'],
      biasInitializer: ['zeros', 'zeros', 'zeros', 'zeros', 'zeros', 'zeros']
    }
  },
  {
    index: 'pipeline_6',
    input_ref: 'pipeline_5',
    type: 'TSModelCompiler',
    title: 'Train the Model',
    description:
      'The training uses 4550 digits, having 15% of those digits as ' +
      '**validation** to prevent overfitting. So the training size will be 3868 and the validation ' +
      'size will be 682. **Shuffling** is turned on, as most of the digits are ordered in ' +
      'sequence and have the same handwriting. It takes a **long** time to train in the broser, this ' +
      'example should have tensorflow running in a backend because running entirely in the browser is ' +
      'quite **slow**.\n\nThe backend runs with the package **@tensorflow/tfjs-node**, you can ' +
      'set it up in your own machine and use the **GPU** if you have **Linux**. My machine cannot not ' +
      'run this example in javascript in the browser, but with **C++** bindings it completes ' +
      'the training and evaluation.',
    data: {
      epochSize: 10,
      batchSize: 512,
      shuffle: true,
      validationSplit: 0.15,
      compilerOptimizerSelected: 'adamax',
      compilerLossSelected: 'categoricalCrossentropy'
    }
  },
  {
    index: 'pipeline_7',
    input_ref: 'pipeline_6',
    type: 'TSModelPredictor',
    title: 'Evaluate our model',
    description:
      'The remaining 1950 digits from the sample are used to evaluate the model. ' +
      'All six layers will be used to validate the CNN, the last layer (output) should classify the ' +
      'digit if the training was successful.',
    data: {
      layerSize: 6
    }
  }
]
