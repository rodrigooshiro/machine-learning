module.exports = [
  {
    index: 'pipeline_0',
    type: 'DatasetLoader',
    title: 'Load, format and visualize the input data',
    description:
      'This pipeline is based on the tutorial from tensorflow about ' +
      '[linear regression](https://www.tensorflow.org/js/tutorials/training/linear_regression), ' +
      'with an additional hidden layer.',
    data: {
      remoteFile: 'https://storage.googleapis.com/tfjs-tutorials/carsData.json'
    }
  },
  {
    index: 'pipeline_1',
    type: 'DatasetTableViewer',
    input_ref: 'pipeline_0',
    data: {
      xAxis: 1,
      yAxis: 0,
      headers: [
        {
          key: 'Name',
          label: 'Name',
          checked: false,
          state: 0
        },
        {
          key: 'Miles_per_Gallon',
          label: 'Miles per Gallon',
          checked: 'Miles_per_Gallon',
          state: 1
        },
        {
          key: 'Cylinders',
          label: 'Cylinders',
          checked: false,
          state: 0
        },
        {
          key: 'Displacement',
          label: 'Displacement',
          checked: false,
          state: 0
        },
        {
          key: 'Horsepower',
          label: 'Horsepower',
          checked: 'Horsepower',
          state: 1
        },
        {
          key: 'Weight_in_lbs',
          label: 'Weight in lbs',
          checked: false,
          state: 0
        },
        {
          key: 'Acceleration',
          label: 'Acceleration',
          checked: false,
          state: 0
        },
        {
          key: 'Year',
          label: 'Year',
          checked: false,
          state: 0
        },
        {
          key: 'Origin',
          label: 'Origin',
          checked: false,
          state: 0
        }
      ]
    }
  },
  {
    index: 'pipeline_2',
    type: 'TSModel',
    title: 'Define the model architecture',
    input_ref: 'pipeline_1',
    data: {
      indexStart: 0,
      indexEnd: 1,
      indexLabel: -1,
      inputShape: [1],
      layerSize: 3,
      units: [20, 15, 1],
      activation: ['linear', 'linear', 'sigmoid'],
      kernelInitializer: ['--', '--', '--'],
      biasInitializer: ['zeros', 'zeros', 'zeros']
    }
  },
  {
    index: 'pipeline_3',
    type: 'TSModelCompiler',
    title: 'Train the model',
    description:
      'If the loss value is still **too high** you can re-train the model. It will not ' +
      'reset the previous training, but resume it with additional epochs. This helps if ' +
      'the selected training model was good, but the epochs for the training was too low. Just be ' +
      'careful not to overfit.',
    input_ref: 'pipeline_2',
    data: {
      epochSize: 30,
      batchSize: 32,
      validationSplit: 0.1,
      shuffle: true,
      inputUnits: [
        {
          key: 0,
          checked: false,
          label: 'Column 0'
        },
        {
          key: 1,
          checked: true,
          label: 'Column 1'
        }
      ],
      inputUnitsNormalize: true,
      outputUnits: [
        {
          key: 0,
          checked: true,
          label: 'Column 0'
        },
        {
          key: 1,
          checked: false,
          label: 'Column 1'
        }
      ],
      outputUnitsNormalize: true,
      compilerOptimizerSelected: 'adamax',
      compilerLossSelected: 'meanSquaredError'
    }
  },
  {
    index: 'pipeline_4',
    type: 'TSModelPredictor',
    title: 'Make Predictions',
    input_ref: 'pipeline_3',
    data: {
      layerSize: 3
    }
  },
  {
    index: 'pipeline_5',
    type: 'DatasetTableViewer',
    input_ref: 'pipeline_4',
    data: {
      xAxis: 0,
      yAxis: 1
    }
  }
]
