module.exports = [
  {
    index: 'pipeline_0',
    type: 'DatasetLoader',
    title: 'Dataset Loader',
    data: {
      remoteFile: 'https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data'
    }
  },
  {
    index: 'pipeline_1',
    type: 'DatasetTableViewer',
    input_ref: 'pipeline_0',
    data: {
      xAxis: 0,
      yAxis: 1,
      zAxis: 2,
      lAxis: 4
    }
  },
  {
    index: 'pipeline_2',
    type: 'TSAutoencoder',
    input_ref: 'pipeline_1',
    title: 'Tensorflow: Autoencoder'
  },
  {
    index: 'pipeline_3',
    type: 'DatasetTableViewer',
    input_ref: 'pipeline_2',
    data: {
      xAxis: 0,
      yAxis: 1,
      zAxis: 2,
      lAxis: 3
    }
  }
]
