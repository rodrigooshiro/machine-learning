(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ad31dc74"],{"3cb2":function(t,i,e){"use strict";e.r(i);var n=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("component-layout",{attrs:{component:t.component,length:t.length,loading:t.loading},on:{"update:component":function(i){t.component=i},"update:length":function(i){t.length=i},"update:loading":function(i){t.loading=i}}},[e("b-form",{staticClass:"form-toolbar-rtl",attrs:{inline:""}},[e("b-button",{attrs:{size:"badge",disabled:t.plugActionDisabled},on:{click:t.plugAction}},[e("b-icon",{staticClass:"btn-icon",attrs:{icon:"plug"}})],1),e("b-button",{attrs:{size:"badge",disabled:t.trashActionDisabled},on:{click:t.trashAction}},[e("b-icon",{staticClass:"btn-icon",attrs:{icon:"trash"}})],1),e("b-button",{attrs:{size:"badge",disabled:t.imageActionDisabled},on:{click:function(i){return t.$bvModal.show("model-view-"+t.component.index)}}},[e("b-icon",{staticClass:"btn-icon",attrs:{icon:"card-image"}})],1),e("b-button",{attrs:{size:"badge"},on:{click:t.onToggleToolbar}},[e("b-icon",{attrs:{icon:t.toggleIcon}})],1)],1),e("b-collapse",{attrs:{visible:"caret-up"===t.toggleIcon}},[e("b-form",{attrs:{inline:""}},[e("div",{staticClass:"indexInput"},[e("label",[t._v("Input Units ("+t._s(t.inputSize)+")")]),e("b-dropdown",{attrs:{text:"Columns","no-flip":"",split:"","split-variant":"outline-secondary",block:"",variant:"secondary",disabled:t.editActionDisabled}},[e("b-dropdown-form",{staticStyle:{"text-align":"left"}},[t._l(t.inputUnits,(function(i){return[e("b-form",{key:i.key,attrs:{inline:""}},[e("b-form-checkbox",{attrs:{options:[!0,!1]},model:{value:i.checked,callback:function(e){t.$set(i,"checked",e)},expression:"item.checked"}}),t._v(" "+t._s(i.label)+" ")],1)]}))],2)],1)],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Input Units Normalize")]),e("b-form-select",{attrs:{options:[!0,!1],disabled:t.editActionDisabled},model:{value:t.inputUnitsNormalize,callback:function(i){t.inputUnitsNormalize=i},expression:"inputUnitsNormalize"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Output Units ("+t._s(t.outputSize)+")")]),e("b-dropdown",{attrs:{text:"Columns","no-flip":"",split:"","split-variant":"outline-secondary",block:"",variant:"secondary",disabled:t.editActionDisabled}},[e("b-dropdown-form",{staticStyle:{"text-align":"left"}},[t._l(t.outputUnits,(function(i){return[e("b-form",{key:i.key,attrs:{inline:""}},[e("b-form-checkbox",{attrs:{options:[!0,!1]},model:{value:i.checked,callback:function(e){t.$set(i,"checked",e)},expression:"item.checked"}}),t._v(" "+t._s(i.label)+" ")],1)]}))],2)],1)],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Output Units Normalize")]),e("b-form-select",{attrs:{options:[!0,!1],disabled:t.editActionDisabled},model:{value:t.outputUnitsNormalize,callback:function(i){t.outputUnitsNormalize=i},expression:"outputUnitsNormalize"}})],1)]),e("b-form",{attrs:{inline:""}},[e("div",{staticClass:"indexInput"},[e("label",[t._v("Epochs")]),e("b-form-spinbutton",{attrs:{min:"1",placeholder:"--",disabled:t.editActionDisabled},model:{value:t.epochSize,callback:function(i){t.epochSize=i},expression:"epochSize"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Batch Size")]),e("b-form-spinbutton",{attrs:{min:"1",placeholder:"--",disabled:t.editActionDisabled},model:{value:t.batchSize,callback:function(i){t.batchSize=i},expression:"batchSize"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Validation Spit")]),e("b-form-spinbutton",{attrs:{min:"0.01",max:"1.00",step:"0.01",placeholder:"--",disabled:t.editActionDisabled},model:{value:t.validationSpit,callback:function(i){t.validationSpit=i},expression:"validationSpit"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Shuffle")]),e("b-form-select",{attrs:{options:[!0,!1],disabled:t.editActionDisabled},model:{value:t.shuffle,callback:function(i){t.shuffle=i},expression:"shuffle"}})],1)]),e("b-form",{attrs:{inline:""}},[e("div",{staticClass:"indexInput"},[e("label",[t._v("Compiler Optimizer")]),e("b-form-select",{attrs:{options:t.compilerOptimizerOptions,disabled:t.editActionDisabled},model:{value:t.compilerOptimizerSelected,callback:function(i){t.compilerOptimizerSelected=i},expression:"compilerOptimizerSelected"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Compiler Loss")]),e("b-form-select",{attrs:{options:t.compilerLossOptions,disabled:t.editActionDisabled},model:{value:t.compilerLossSelected,callback:function(i){t.compilerLossSelected=i},expression:"compilerLossSelected"}})],1)])],1),e("div",{staticStyle:{"margin-top":"8px"}}),e("b-modal",{attrs:{id:"model-view-"+t.component.index,title:"TS Model View",static:!0,"hide-footer":!0,size:"lg"}},[e("div",{ref:"draw"})])],1)},a=[],o=e("a8fe"),s=o["a"],l=e("2877"),c=Object(l["a"])(s,n,a,!1,null,"87bc43a2",null);i["default"]=c.exports},"4c53":function(t,i,e){"use strict";var n=e("23e7"),a=e("857a"),o=e("af03");n({target:"String",proto:!0,forced:o("sub")},{sub:function(){return a(this,"sub","","")}})},"857a":function(t,i,e){var n=e("1d80"),a=/"/g;t.exports=function(t,i,e,o){var s=String(n(t)),l="<"+i;return""!==e&&(l+=" "+e+'="'+String(o).replace(a,"&quot;")+'"'),l+">"+s+"</"+i+">"}},a8fe:function(t,i,e){"use strict";(function(t){e("4de4"),e("fb6a"),e("b64b"),e("4c53");var n=e("5530"),a=e("315f"),o=e("cc8f"),s=e("0b53"),l=e("1157"),c=e.n(l);
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
 */i["a"]={name:"TSModelCompiler",components:{ComponentLayout:a["a"]},mixins:[o["a"]],data:function(){var t={serializable:["shuffle","epochSize","batchSize","validationSpit","inputUnits","inputUnitsNormalize","outputUnits","outputUnitsNormalize","compilerOptimizerSelected","compilerLossSelected"],toggleIcon:"caret-up",shuffle:!0,epochSize:0,batchSize:0,validationSpit:0,inputUnits:[],inputUnitsNormalize:!1,outputUnits:[],outputUnitsNormalize:!1,compilerOptimizerSelected:null,compilerOptimizerOptions:Object.keys(s["f"]).sort(),compilerLossSelected:null,compilerLossOptions:Object.keys(s["c"]).slice(1).sort(),fileChart:!1};return this.importData(t)},computed:{editActionDisabled:function(){var t=0;return t|=!0===this.loading,t|=0===this.inputSize,t|=0===this.outputSize,1===t},trashActionDisabled:function(){return this.editActionDisabled},plugActionDisabled:function(){var t=0;return t|=!0===this.loading,t|=this.inputUnits.filter((function(t){return!0===t.checked})).length!==this.inputSize,t|=this.outputUnits.filter((function(t){return!0===t.checked})).length!==this.outputSize,1===t},imageActionDisabled:function(){var t=0;return t|=!1===this.fileChart,1===t},inputSize:function(){var t=0;return this.inputData&&this.inputData.model&&this.inputData.model.layers&&this.inputData.model.layers.length>1&&(t=this.inputData.model.layers[0].batchInputShape[1]),t},outputSize:function(){var t=0;return this.inputData&&this.inputData.model&&this.inputData.model.layers&&this.inputData.model.layers.length>1&&(t=this.inputData.model.layers[this.inputData.model.layers.length-1].units),t},dataSize:function(){var t=0;return this.inputData&&this.inputData.data&&this.inputData.data.length&&(t=this.inputData.data[0].length),t}},watch:{inputLoading:function(t,i){!1===t&&this.trashAction()}},methods:{onToggleToolbar:function(){"caret-up"===this.toggleIcon?this.toggleIcon="caret-down":"caret-down"===this.toggleIcon&&(this.toggleIcon="caret-up")},trashAction:function(t){var i=this;if(c()(this.$refs["draw"]).empty(),this.fileChart=!1,this.output=null,this.loadData(this.data),this.loadData(this.component.data),this.inputData&&this.inputData.data&&this.inputData.data.length)for(var e=function(t){0===i.inputUnits.filter((function(i){return i.key===t})).length&&i.inputUnits.push({key:t,checked:!1,label:"Column "+t}),0===i.outputUnits.filter((function(i){return i.key===t})).length&&i.outputUnits.push({key:t,checked:!1,label:"Column "+t})},n=0;n<this.dataSize;n++)e(n)},plugAction:function(i){var e=this;this.loading=!0;for(var a=this.inputData,o=a.model,l=a.data,c=[],r=[],u=0;u<l.length;u++){for(var p=[],d=[],h=function(t){e.inputUnits.filter((function(i){return i.key===t&&!0===i.checked})).length&&p.push(parseFloat(l[u][t])),e.outputUnits.filter((function(i){return i.key===t&&!0===i.checked})).length&&d.push(parseFloat(l[u][t]))},b=0;b<this.dataSize;b++)h(b);c.push(p),r.push(d)}var f={inputUnitsNormalize:this.inputUnitsNormalize,outputUnitsNormalize:this.outputUnitsNormalize},m=s["e"](c);if(this.inputUnitsNormalize){var v=m.max(),g=m.min(),z=m.sub(g).div(v.sub(g));m=z,f.inputMax=v,f.inputMin=g}var S=s["e"](r);if(this.outputUnitsNormalize){var k=S.max(),D=S.min(),x=S.sub(D).div(k.sub(D));S=x,f.outputMax=k,f.outputMin=D}o.compile({optimizer:this.compilerOptimizerSelected,loss:this.compilerLossSelected,metrics:["mse"]}),this.fileChart=!0,o.fit(m,S,{batchSize:this.batchSize,epochs:this.epochSize,shuffle:this.shuffle,validationSpit:this.validationSpit,callbacks:t.tfvis.show.fitCallbacks(this.$refs["draw"],["loss","mse"],{width:700,height:200,callbacks:["onEpochEnd"]})}).then(function(t){m.dispose(),S.dispose(),this.output=Object(n["a"])(Object(n["a"])({},this.inputData),{},{train:t,inputMatrix:c,outputMatrix:r,normalizationData:f}),this.loading=!1}.bind(this))}}}}).call(this,e("c8ba"))},af03:function(t,i,e){var n=e("d039");t.exports=function(t){return n((function(){var i=""[t]('"');return i!==i.toLowerCase()||i.split('"').length>3}))}},fb6a:function(t,i,e){"use strict";var n=e("23e7"),a=e("861d"),o=e("e8b5"),s=e("23cb"),l=e("50c4"),c=e("fc6a"),r=e("8418"),u=e("b622"),p=e("1dde"),d=e("ae40"),h=p("slice"),b=d("slice",{ACCESSORS:!0,0:0,1:2}),f=u("species"),m=[].slice,v=Math.max;n({target:"Array",proto:!0,forced:!h||!b},{slice:function(t,i){var e,n,u,p=c(this),d=l(p.length),h=s(t,d),b=s(void 0===i?d:i,d);if(o(p)&&(e=p.constructor,"function"!=typeof e||e!==Array&&!o(e.prototype)?a(e)&&(e=e[f],null===e&&(e=void 0)):e=void 0,e===Array||void 0===e))return m.call(p,h,b);for(n=new(void 0===e?Array:e)(v(b-h,0)),u=0;h<b;h++,u++)h in p&&r(n,u,p[h]);return n.length=u,n}})}}]);
//# sourceMappingURL=chunk-ad31dc74.5aff4173.js.map