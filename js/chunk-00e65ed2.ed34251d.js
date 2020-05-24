(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-00e65ed2"],{"3cb2":function(t,i,e){"use strict";e.r(i);var n=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("component-layout",{attrs:{component:t.component,length:t.length,loading:t.loading},on:{"update:component":function(i){t.component=i},"update:length":function(i){t.length=i},"update:loading":function(i){t.loading=i}}},[e("b-form",{staticClass:"form-toolbar-rtl",attrs:{inline:""}},[e("b-button",{attrs:{size:"badge",disabled:t.plugActionDisabled},on:{click:t.plugAction}},[e("b-icon",{staticClass:"btn-icon",attrs:{icon:"plug"}})],1),e("b-button",{attrs:{size:"badge",disabled:t.trashActionDisabled},on:{click:t.trashAction}},[e("b-icon",{staticClass:"btn-icon",attrs:{icon:"trash"}})],1),e("b-button",{attrs:{size:"badge",disabled:t.imageActionDisabled},on:{click:function(i){return t.$bvModal.show("model-view-"+t.component.index)}}},[e("b-icon",{staticClass:"btn-icon",attrs:{icon:"card-image"}})],1),e("b-button",{attrs:{size:"badge"},on:{click:t.onToggleToolbar}},[e("b-icon",{attrs:{icon:t.toggleIcon}})],1)],1),e("b-collapse",{attrs:{visible:"caret-up"===t.toggleIcon}},[e("b-form",{attrs:{inline:""}},[e("div",{staticClass:"indexInput"},[e("label",[t._v("Input Units ("+t._s(t.inputSize)+")")]),e("b-dropdown",{attrs:{text:"Columns","no-flip":"",split:"","split-variant":"outline-secondary",block:"",variant:"secondary",disabled:t.editActionDisabled}},[e("b-dropdown-form",{staticStyle:{"text-align":"left"}},[t._l(t.inputUnits,(function(i){return[e("b-form",{key:i.key,attrs:{inline:""}},[e("b-form-checkbox",{attrs:{options:[!0,!1]},model:{value:i.checked,callback:function(e){t.$set(i,"checked",e)},expression:"item.checked"}}),t._v(" "+t._s(i.label)+" ")],1)]}))],2)],1)],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Input Units Normalize")]),e("b-form-select",{attrs:{options:[!0,!1],disabled:t.editActionDisabled},model:{value:t.inputUnitsNormalize,callback:function(i){t.inputUnitsNormalize=i},expression:"inputUnitsNormalize"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Output Units ("+t._s(t.outputSize)+")")]),e("b-dropdown",{attrs:{text:"Columns","no-flip":"",split:"","split-variant":"outline-secondary",block:"",variant:"secondary",disabled:t.editActionDisabled}},[e("b-dropdown-form",{staticStyle:{"text-align":"left"}},[t._l(t.outputUnits,(function(i){return[e("b-form",{key:i.key,attrs:{inline:""}},[e("b-form-checkbox",{attrs:{options:[!0,!1]},model:{value:i.checked,callback:function(e){t.$set(i,"checked",e)},expression:"item.checked"}}),t._v(" "+t._s(i.label)+" ")],1)]}))],2)],1)],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Output Units Normalize")]),e("b-form-select",{attrs:{options:[!0,!1],disabled:t.editActionDisabled},model:{value:t.outputUnitsNormalize,callback:function(i){t.outputUnitsNormalize=i},expression:"outputUnitsNormalize"}})],1)]),e("b-form",{attrs:{inline:""}},[e("div",{staticClass:"indexInput"},[e("label",[t._v("Epochs")]),e("b-form-spinbutton",{attrs:{min:"1",placeholder:"--",disabled:t.editActionDisabled},model:{value:t.epochSize,callback:function(i){t.epochSize=i},expression:"epochSize"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Batch Size")]),e("b-form-spinbutton",{attrs:{min:"1",placeholder:"--",disabled:t.editActionDisabled},model:{value:t.batchSize,callback:function(i){t.batchSize=i},expression:"batchSize"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Validation Split")]),e("b-form-spinbutton",{attrs:{min:"0.0",max:"1.0",step:"0.01","formatter-fn":t.percentageFormatter,disabled:t.editActionDisabled},model:{value:t.validationSplit,callback:function(i){t.validationSplit=i},expression:"validationSplit"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Shuffle")]),e("b-form-select",{attrs:{options:[!0,!1],disabled:t.editActionDisabled},model:{value:t.shuffle,callback:function(i){t.shuffle=i},expression:"shuffle"}})],1)]),e("b-form",{attrs:{inline:""}},[e("div",{staticClass:"indexInput"},[e("label",[t._v("Compiler Optimizer")]),e("b-form-select",{attrs:{options:t.compilerOptimizerOptions,disabled:t.editActionDisabled},model:{value:t.compilerOptimizerSelected,callback:function(i){t.compilerOptimizerSelected=i},expression:"compilerOptimizerSelected"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Compiler Loss")]),e("b-form-select",{attrs:{options:t.compilerLossOptions,disabled:t.editActionDisabled},model:{value:t.compilerLossSelected,callback:function(i){t.compilerLossSelected=i},expression:"compilerLossSelected"}})],1)])],1),e("div",{staticStyle:{"margin-top":"8px"}}),e("b-modal",{attrs:{id:"model-view-"+t.component.index,title:"TS Model View",static:!0,"hide-footer":!0,size:"lg"}},[e("div",{ref:"draw"})])],1)},o=[],a=e("a8fe"),s=a["a"],l=e("2877"),r=Object(l["a"])(s,n,o,!1,null,"140c90de",null);i["default"]=r.exports},"4c53":function(t,i,e){"use strict";var n=e("23e7"),o=e("857a"),a=e("af03");n({target:"String",proto:!0,forced:a("sub")},{sub:function(){return o(this,"sub","","")}})},"857a":function(t,i,e){var n=e("1d80"),o=/"/g;t.exports=function(t,i,e,a){var s=String(n(t)),l="<"+i;return""!==e&&(l+=" "+e+'="'+String(a).replace(o,"&quot;")+'"'),l+">"+s+"</"+i+">"}},a8fe:function(t,i,e){"use strict";(function(t){e("4de4"),e("4c53");var n=e("5530"),o=e("315f"),a=e("cc8f"),s=e("0b53"),l=e("1157"),r=e.n(l),c=e("c8cf");
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
 */i["a"]={name:"TSModelCompiler",components:{ComponentLayout:o["a"]},mixins:[a["a"]],data:function(){window.tf=s;var t={serializable:["shuffle","epochSize","batchSize","validationSplit","inputUnits","inputUnitsNormalize","outputUnits","outputUnitsNormalize","compilerOptimizerSelected","compilerLossSelected"],toggleIcon:"caret-up",shuffle:!0,epochSize:0,batchSize:0,validationSplit:0,inputUnits:[],inputUnitsNormalize:!1,outputUnits:[],outputUnitsNormalize:!1,compilerOptimizerSelected:null,compilerOptimizerOptions:c["a"].tf.train.options,compilerLossSelected:null,compilerLossOptions:c["a"].tf.losses.options,fileChart:!1};return this.importData(t)},computed:{editActionDisabled:function(){var t=0;return t|=!0===this.loading,t|=0===this.inputSize,t|=0===this.outputSize,1===t},trashActionDisabled:function(){return this.editActionDisabled},plugActionDisabled:function(){var t=0;return t|=!0===this.loading,t|=this.inputUnits.filter((function(t){return!0===t.checked})).length!==this.inputSize,t|=this.outputUnits.filter((function(t){return!0===t.checked})).length!==this.outputSize,1===t},imageActionDisabled:function(){var t=0;return t|=!1===this.fileChart,1===t},inputSize:function(){var t=0;return this.inputData&&this.inputData.model&&this.inputData.model.layers&&this.inputData.model.layers.length>1&&(t=this.inputData.model.layers[0].batchInputShape[1]),t},outputSize:function(){var t=0;return this.inputData&&this.inputData.model&&this.inputData.model.layers&&this.inputData.model.layers.length>1&&(t=this.inputData.model.layers[this.inputData.model.layers.length-1].units),t},dataSize:function(){var t=0;return this.inputData&&this.inputData.data&&this.inputData.data.length&&(t=this.inputData.data[0].length),t}},watch:{inputLoading:function(t,i){!1===t&&this.trashAction()}},methods:{onToggleToolbar:function(){"caret-up"===this.toggleIcon?this.toggleIcon="caret-down":"caret-down"===this.toggleIcon&&(this.toggleIcon="caret-up")},trashAction:function(t){var i=this;if(r()(this.$refs["draw"]).empty(),this.fileChart=!1,this.output=null,this.loadData(this.data),this.loadData(this.component.data),this.inputData&&this.inputData.data&&this.inputData.data.length)for(var e=function(t){0===i.inputUnits.filter((function(i){return i.key===t})).length&&i.inputUnits.push({key:t,checked:!1,label:"Column "+t}),0===i.outputUnits.filter((function(i){return i.key===t})).length&&i.outputUnits.push({key:t,checked:!1,label:"Column "+t})},n=0;n<this.dataSize;n++)e(n)},plugAction:function(i){var e=this;this.loading=!0;for(var o=this.inputData,a=o.model,l=o.data,r=[],c=[],u=0;u<l.length;u++){for(var d=[],p=[],h=function(t){e.inputUnits.filter((function(i){return i.key===t&&!0===i.checked})).length&&d.push(parseFloat(l[u][t])),e.outputUnits.filter((function(i){return i.key===t&&!0===i.checked})).length&&p.push(parseFloat(l[u][t]))},m=0;m<this.dataSize;m++)h(m);r.push(d),c.push(p)}var b={inputUnitsNormalize:this.inputUnitsNormalize,outputUnitsNormalize:this.outputUnitsNormalize},f=s["tensor2d"](r);if(this.inputUnitsNormalize){var g=f.max(),v=f.min(),z=f.sub(v).div(g.sub(v));f=z,b.inputMax=g,b.inputMin=v}var S=s["tensor2d"](c);if(this.outputUnitsNormalize){var x=S.max(),k=S.min(),D=S.sub(k).div(x.sub(k));S=D,b.outputMax=x,b.outputMin=k}var U=this.compilerLossSelected;try{U=s["losses"][U]}catch(C){}a.compile({optimizer:this.compilerOptimizerSelected,loss:U,metrics:["mse"]}),this.fileChart=!0,a.fit(f,S,{batchSize:this.batchSize,epochs:this.epochSize,shuffle:this.shuffle,validationSplit:this.validationSplit,callbacks:t.tfvis.show.fitCallbacks(this.$refs["draw"],["loss","mse"],{width:700,height:200,callbacks:["onEpochEnd"]})}).then(function(t){f.dispose(),S.dispose(),this.output=Object(n["a"])(Object(n["a"])({},this.inputData),{},{train:t,inputMatrix:r,outputMatrix:c,normalizationData:b}),this.loading=!1}.bind(this))}}}}).call(this,e("c8ba"))},af03:function(t,i,e){var n=e("d039");t.exports=function(t){return n((function(){var i=""[t]('"');return i!==i.toLowerCase()||i.split('"').length>3}))}},c8cf:function(t,i,e){"use strict";
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
 * See the License for the specific language governing permissions and* See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================================================================
 */var n={tf:{layer:{options:["activation","dense","dropout","embedding","flatten","permute","repeatVector","reshape","spatialDropout1d","elu","leakyReLU","prelu","reLU","softmax","thresholdedReLU","conv1d","conv2d","conv2dTranspose","conv3d","cropping2D","depthwiseConv2d","separableConv2d","upSampling2d","averagePooling1d","averagePooling2d","averagePooling3d","globalAveragePooling1d","globalAveragePooling2d","globalMaxPooling1d","globalMaxPooling2d","maxPooling1d","maxPooling2d","maxPooling3d","gru","gruCell","lstm","lstmCell","rnn","simpleRNN","simpleRNNCell","stackedRNNCells","bidirectional","timeDistributed"],activation:{options:["--","elu","hardSigmoid","linear","relu","relu6","selu","sigmoid","softmax","softplus","softsign","tanh"]}},initializers:{options:["--","glorotNormal","glorotUniform","heNormal","heUniform","identity","leCunNormal","leCunUniform","orthogonal","randomNormal","randomUniform","truncatedNormal","varianceScaling","ones","zeros"]},train:{options:["sgd","momentum","adagrad","adadelta","adam","adamax","rmsprop"]},losses:{options:["absoluteDifference","categoricalCrossentropy","computeWeightedLoss","cosineDistance","hingeLoss","huberLoss","logLoss","meanSquaredError","sigmoidCrossEntropy","softmaxCrossEntropy"]}}};i["a"]=n}}]);
//# sourceMappingURL=chunk-00e65ed2.ed34251d.js.map