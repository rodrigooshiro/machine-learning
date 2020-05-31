module.exports = [
  {
    index: 'pipeline_0',
    type: 'DatasetLoader',
    title: 'Dataset Loader',
    description:
      'This pipeline uses the iris dataset from UCI Machile Learning ' +
      '[repository](https://archive.ics.uci.edu/ml/datasets/iris). It ' +
      'uses **tensorflow** to create a model to classify flowers.',
    data: {
      remoteFile: 'https://raw.githubusercontent.com/pandas-dev/pandas/master/pandas/tests/data/iris.csv'
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
      lAxis: 4
    }
  },
  {
    index: 'pipeline_2',
    input_ref: 'pipeline_1',
    type: 'DatasetSplitter',
    title: 'Dataset Splitter',
    data: {
      sampleSplit: 1,
      shuffle: true,
      trainingRatio: 0.7,
      evaluationRatio: 0.3,
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
          checked: false,
          label: 'Column 4'
        }
      ],
      outputUnits: [
        {
          key: 0,
          checked: false,
          label: 'Column 0'
        },
        {
          key: 1,
          checked: false,
          label: 'Column 1'
        },
        {
          key: 2,
          checked: false,
          label: 'Column 2'
        },
        {
          key: 3,
          checked: false,
          label: 'Column 3'
        },
        {
          key: 4,
          checked: true,
          label: 'Column 4'
        }
      ],
      indexLabel: 4
    }
  },
  {
    index: 'pipeline_3',
    input_ref: 'pipeline_2',
    type: 'TSModelBuilder',
    title: 'Create model to classify the flower',
    description: '',
    data: {
      layerSize: 3,
      units: [10, 10, 3],
      activation: ['relu', 'relu', 'softmax']
    }
  },
  {
    index: 'pipeline_4',
    input_ref: 'pipeline_3',
    type: 'TSModelCompiler',
    title: 'Train model',
    description:
      '',
    data: {
      epochSize: 200,
      batchSize: 32,
      validationSplit: 0.1,
      shuffle: true,
      inputUnitsNormalize: false,
      outputUnitsNormalize: false,
      compilerOptimizerSelected: 'adamax',
      compilerLossSelected: 'sparseCategoricalCrossentropy'
    }
  },
  {
    index: 'pipeline_5',
    input_ref: 'pipeline_4',
    type: 'TSModelPredictor',
    title: 'Make Predictions',
    description:
      'The predictions are run over the evaluation dataset, the class accuracy and confusion matrix ' +
      'can be viewed to evaluate if the training model is preducting the categories as desired.',
    data: {
      layerSize: 3
    }
  },
  {
    index: 'pipeline_6',
    input_ref: 'pipeline_5',
    type: 'DatasetTableViewer',
    data: {
      xAxis: 7,
      yAxis: 8,
      zAxis: 9,
      lAxis: 10
    }
  }
]
