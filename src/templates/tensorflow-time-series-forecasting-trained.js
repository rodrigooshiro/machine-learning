module.exports = [
  {
    index: 'pipeline_0',
    type: 'DatasetLoader',
    title: 'The weather dataset',
    description:
      'This pipeline is based on the tutorial from tensorflow about ' +
      '[series forecasting](https://www.tensorflow.org/tutorials/structured_data/time_series). The ' +
      'sample set was reduced to a year to avoid memory limitations when dealing with large datasets ' +
      'on javascript.',
    data: {
      remoteFile: '/machine-learning/jena_climate_2009.csv'
    }
  },
  {
    index: 'pipeline_1',
    input_ref: 'pipeline_0',
    type: 'DatasetTableViewer',
    data: {
      header: true,
      xAxis: 0,
      yAxis: 2
    }
  },
  {
    index: 'pipeline_2',
    input_ref: 'pipeline_1',
    type: 'DatasetSplitter',
    title: 'Dataset Splitter',
    description:
      'The dataset used for a series prediction needs to be created accordingly. There is a window of ' +
      '720 samples with a step of 6, so the input will be created every 6 samples and then an output ' +
      'of 72 samples will be created to forecast these inputs.',
    data: {
      sampleSplit: 1,
      shuffle: true,
      indexTimestamp: 0,
      trainingRatio: 0.99,
      evaluationRatio: 0.01,
      historySize: 720,
      stepSize: 6,
      targetSize: 72,
      inputShapeLength: 2,
      inputShape: [120, 3],
      outputShapeLength: 1,
      outputShape: [72],
      inputUnits: [
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
          key: 11,
          checked: true,
          label: 'Column 11'
        }
      ],
      outputUnits: [
        {
          key: 2,
          checked: true,
          label: 'Column 2'
        }
      ]
    }
  },
  {
    index: 'pipeline_3',
    input_ref: 'pipeline_2',
    type: 'TSModelLoader',
    title: 'Load pre trained the model architecture',
    description: 'This is a pre-trained model using 120000 samples from the 2009-2016 dataset.',
    data: {
      remoteFile: 'tensorflow-time-series-forecasting/model.json'
    }
  },
  {
    index: 'pipeline_4',
    input_ref: 'pipeline_3',
    type: 'TSModelPredictor',
    title: 'Make Predictions',
    data: {
      layerSize: 3,
      indexSerie: 1
    }
  }
]
