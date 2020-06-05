module.exports = [
  {
    index: 'pipeline_0',
    type: 'DatasetLoader',
    title: 'The weather dataset',
    description:
      'This pipeline is based on the tutorial from tensorflow about ' +
      '[series forecasting](https://www.tensorflow.org/tutorials/structured_data/time_series). Still ' +
      'working on this, please come back later...',
    data: {
      remoteFile: 'https://raw.githubusercontent.com/crlsierra/Eclipse2015/master/mpi_roof.csv'
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
