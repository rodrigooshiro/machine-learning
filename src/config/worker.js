/**
 * @license
 * Copyright 2020 Rodrigo Oshiro. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
try {
  global.window = self
} catch (e) {}
self.importScripts('tf.min.js')
self.importScripts('definitions.js')

self.onEpochEnd = async function(epoch, logs) {
  self.postMessage(['onEpochEnd', epoch, logs])
}

self.builder = async function(data) {
  let output = await definitions.tasks.builder(tf, data)
  await output.model.save('indexeddb://model')
  self.postMessage(['onEnd'])
}

self.compiler = async function(data, inputTensorJSON, outputTensorJSON) {
  let model = await tf.loadLayersModel('indexeddb://model')
  let output = await definitions.tasks.compiler(self, tf, model, data, inputTensorJSON, outputTensorJSON, {
    onEpochEnd: self.onEpochEnd
  })
  await output.model.save('indexeddb://model')
  self.postMessage(['onEnd', output.train])
}

self.addEventListener('message', function(event) {
  if (event.data[0] === 'builder') {
    self.builder(event.data[1])
  }
  if (event.data[0] === 'compiler') {
    self.compiler(event.data[1], event.data[2], event.data[3])
  }
})
