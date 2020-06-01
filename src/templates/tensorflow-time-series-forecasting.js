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
      remoteFile:
        'https://raw.githubusercontent.com/nknewlands/DeepLearningShortCourse/master/Day1/rnn/jena_climate_2009_2016.csv.zip'
    }
  },
  {
    index: 'pipeline_1',
    input_ref: 'pipeline_0',
    type: 'DatasetZipViewer'
  },
  {
    index: 'pipeline_2',
    input_ref: 'pipeline_1',
    type: 'DatasetTableViewer',
    data: {
      header: true
    }
  }
]
