module.exports = [
  {
    index: 'pipeline_0',
    type: 'DatasetLoader',
    title: 'Setup the training data',
    description:
      'This pipeline is based on the tutorial from tensorflow about ' +
      '[training and prediction](https://www.tensorflow.org/js/tutorials/training/nodejs_training) ' +
      'of baseball pitch types from pitch sensor data from MLBAM.',
    data: {
      remoteFile:
        'https://raw.githubusercontent.com/Stocastico/learn-tensorflow-js/master/pitch_classifier_nodejs/pitch_type_training_data.csv'
    }
  },
  {
    index: 'pipeline_1',
    input_ref: 'pipeline_0',
    type: 'DatasetTableViewer',
    data: {
      header: true,
      xAxis: 0,
      yAxis: 1,
      zAxis: 2,
      lAxis: 8
    }
  },
  {
    index: 'pipeline_2',
    input_ref: 'pipeline_1',
    type: 'DatasetSplitter',
    title: 'Dataset Splitter',
    description: 'The first dataset is 100% used for training.',
    data: {
      sampleSplit: 1,
      shuffle: true,
      trainingRatio: 1,
      evaluationRatio: 0,
      inputUnits: [
        {
          key: 0,
          checked: true,
          label: 'Column 0'
        },
        {
          key: 1,
          checked: true,
          label: 'Column 1'
        },
        {
          key: 2,
          checked: true,
          label: 'Column 2'
        },
        {
          key: 3,
          checked: true,
          label: 'Column 3'
        },
        {
          key: 4,
          checked: true,
          label: 'Column 4'
        },
        {
          key: 5,
          checked: true,
          label: 'Column 5'
        },
        {
          key: 6,
          checked: true,
          label: 'Column 6'
        },
        {
          key: 7,
          checked: true,
          label: 'Column 7'
        }
      ],
      outputUnits: [
        {
          key: 8,
          checked: true,
          label: 'Column 8'
        }
      ],
      indexLabel: 8
    }
  },
  {
    index: 'pipeline_3',
    type: 'DatasetLoader',
    title: 'Setup the test data',
    data: {
      remoteFile:
        'https://raw.githubusercontent.com/Stocastico/learn-tensorflow-js/master/pitch_classifier_nodejs/pitch_type_test_data.csv'
    }
  },
  {
    index: 'pipeline_4',
    input_ref: 'pipeline_3',
    type: 'DatasetTableViewer',
    data: {
      header: true,
      xAxis: 0,
      yAxis: 1,
      zAxis: 2,
      lAxis: 8
    }
  },
  {
    index: 'pipeline_5',
    input_ref: 'pipeline_4',
    type: 'DatasetSplitter',
    title: 'Dataset Splitter',
    description: 'The second dataset is 100% used for testing evaluation.',
    data: {
      sampleSplit: 1,
      shuffle: false,
      trainingRatio: 0,
      evaluationRatio: 1,
      inputUnits: [
        {
          key: 0,
          checked: true,
          label: 'Column 0'
        },
        {
          key: 1,
          checked: true,
          label: 'Column 1'
        },
        {
          key: 2,
          checked: true,
          label: 'Column 2'
        },
        {
          key: 3,
          checked: true,
          label: 'Column 3'
        },
        {
          key: 4,
          checked: true,
          label: 'Column 4'
        },
        {
          key: 5,
          checked: true,
          label: 'Column 5'
        },
        {
          key: 6,
          checked: true,
          label: 'Column 6'
        },
        {
          key: 7,
          checked: true,
          label: 'Column 7'
        }
      ],
      outputUnits: [
        {
          key: 8,
          checked: true,
          label: 'Column 8'
        }
      ],
      indexLabel: 8
    }
  },
  {
    index: 'pipeline_6',
    input_ref: 'pipeline_5',
    type: 'TSModelBuilder',
    title: 'Create model to classify pitch types',
    description: '',
    data: {
      layerSize: 4,
      units: [250, 175, 150, 7],
      activation: ['relu', 'relu', 'relu', 'softmax']
    }
  },
  {
    index: 'pipeline_7',
    input_ref: 'pipeline_6',
    type: 'TSModelCompiler',
    title: 'Train model',
    description:
      'The training loss is a sparse categorical cross entropy, so there is no need to split ' +
      "the categories of the output into an array of 0's and 1's. Inputs are normalized and the " +
      'output is the category itself, so it is not normalized.',
    data: {
      epochs: 50,
      batchSize: 700,
      shuffle: true,
      inputUnitsNormalize: true,
      outputUnitsNormalize: false,
      validationSplit: 0.15,
      compilerOptimizerSelected: 'adamax',
      compilerLossSelected: 'sparseCategoricalCrossentropy'
    }
  },
  {
    index: 'pipeline_8',
    input_ref: 'pipeline_7',
    type: 'TSModelPredictor',
    title: 'Make Predictions',
    description:
      'The predictions are run over the evaluation dataset, the class accuracy and confusion matrix ' +
      'can be viewed to evaluate if the training model is preducting the categories as desired.',
    data: {
      layerSize: 4
    }
  },
  {
    index: 'pipeline_9',
    input_ref: 'pipeline_8',
    type: 'DatasetTableViewer',
    data: {}
  }
]
