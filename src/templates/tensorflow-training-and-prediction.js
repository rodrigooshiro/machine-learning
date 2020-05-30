module.exports = [
  {
    index: 'pipeline_0',
    type: 'DatasetLoader',
    title: 'Dataset Loader',
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
      header: true
    }
  },
  {
    index: 'pipeline_2',
    type: 'DatasetLoader',
    data: {
      remoteFile:
        'https://raw.githubusercontent.com/Stocastico/learn-tensorflow-js/master/pitch_classifier_nodejs/pitch_type_test_data.csv'
    }
  },
  {
    index: 'pipeline_3',
    input_ref: 'pipeline_2',
    type: 'DatasetTableViewer',
    data: {
      header: true
    }
  }
]
