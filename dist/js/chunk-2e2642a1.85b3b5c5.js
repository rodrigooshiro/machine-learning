(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2e2642a1"],{"4c53":function(t,a,i){"use strict";var n=i("23e7"),e=i("857a"),o=i("af03");n({target:"String",proto:!0,forced:o("sub")},{sub:function(){return e(this,"sub","","")}})},"857a":function(t,a,i){var n=i("1d80"),e=/"/g;t.exports=function(t,a,i,o){var r=String(n(t)),s="<"+a;return""!==i&&(s+=" "+i+'="'+String(o).replace(e,"&quot;")+'"'),s+">"+r+"</"+a+">"}},a630:function(t,a,i){var n=i("23e7"),e=i("4df4"),o=i("1c7e"),r=!o((function(t){Array.from(t)}));n({target:"Array",stat:!0,forced:r},{from:e})},af03:function(t,a,i){var n=i("d039");t.exports=function(t){return n((function(){var a=""[t]('"');return a!==a.toLowerCase()||a.split('"').length>3}))}},dd11:function(t,a,i){"use strict";i.r(a);var n=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("component-layout",{attrs:{component:t.component,length:t.length,loading:t.loading},on:{"update:component":function(a){t.component=a},"update:length":function(a){t.length=a},"update:loading":function(a){t.loading=a}}},[i("b-form",{staticClass:"form-toolbar-rtl",attrs:{inline:""}},[i("b-button",{attrs:{size:"badge",disabled:t.plugActionDisabled},on:{click:t.plugAction}},[i("b-icon",{staticClass:"btn-icon",attrs:{icon:"plug"}})],1),i("b-button",{attrs:{size:"badge",disabled:t.trashActionDisabled},on:{click:t.trashAction}},[i("b-icon",{staticClass:"btn-icon",attrs:{icon:"trash"}})],1),i("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal",value:"dataset-view-"+t.component.index,expression:"'dataset-view-' + component.index"}],attrs:{size:"badge",disabled:t.imageActionDisabled}},[i("b-icon",{staticClass:"btn-icon",attrs:{icon:"card-image"}})],1),i("b-button",{attrs:{size:"badge"},on:{click:t.onToggleToolbar}},[i("b-icon",{attrs:{icon:t.toggleIcon}})],1)],1),i("b-collapse",{attrs:{visible:"caret-up"===t.toggleIcon}},[i("b-form",{attrs:{inline:""}},[i("div",{staticClass:"indexInput"},[i("label",[t._v("Total Layers")]),i("b-form-spinbutton",{attrs:{min:"1",max:t.indexMax,placeholder:"--",disabled:t.editActionDisabled},model:{value:t.layerSize,callback:function(a){t.layerSize=a},expression:"layerSize"}})],1)])],1),i("div",{staticStyle:{"margin-top":"8px"}}),i("b-modal",{attrs:{id:"dataset-view-"+t.component.index,title:"Dataset View",static:!0,"hide-footer":!0,size:"lg"}},[i("center",[i("div",{ref:"draw"})])],1)],1)},e=[],o=i("e04e"),r=o["a"],s=i("2877"),l=Object(s["a"])(r,n,e,!1,null,"166ea54c",null);a["default"]=l.exports},e04e:function(t,a,i){"use strict";(function(t){i("a630"),i("d81d"),i("3ca3"),i("4c53");var n=i("315f"),e=i("cc8f"),o=i("0b53"),r=i("1157"),s=i.n(r);
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
 */a["a"]={name:"TSModelPredictor",components:{ComponentLayout:n["a"]},mixins:[e["a"]],data:function(){var t={serializable:["layerSize"],layerSize:0,fileChart:!1,toggleIcon:"caret-up"};return this.importData(t)},computed:{editActionDisabled:function(){var t=0;return t|=0===this.indexMax,1===t},trashActionDisabled:function(){return this.editActionDisabled},plugActionDisabled:function(){var t=0;return t|=!0===this.loading,t|=null===this.inputData||null===this.inputData.model||!(this.inputData.model instanceof Object),t|=this.layerSize>this.indexMax,1===t},imageActionDisabled:function(){var t=0;return t|=!1===this.fileChart,1===t},indexMax:function(){var t=1;return this.inputData&&this.inputData.model&&this.inputData.model.layers&&(t=this.inputData.model.layers.length),t}},watch:{inputLoading:function(t,a){!1===t&&this.trashAction()},indexMax:function(t,a){this.layerSize>t&&(this.layerSize=t)}},methods:{onToggleToolbar:function(){"caret-up"===this.toggleIcon?this.toggleIcon="caret-down":"caret-down"===this.toggleIcon&&(this.toggleIcon="caret-up")},trashAction:function(t){s()(this.$refs["draw"]).empty(),this.fileChart=!1,this.output=null,this.loadData(this.data),this.loadData(this.component.data)},plugAction:function(a){this.loading=!0;for(var i=this.inputData,n=i.model,e=i.data,r=i.inputMatrix,s=i.outputMatrix,l=i.indexLabel,c=i.normalizationData,u=o["d"](),d=0;d<this.layerSize;d++)u.add(n.layers[d]);var p=null,h=o["e"](r);if(c.inputUnitsNormalize){var f=h.sub(c.inputMin).div(c.inputMax.sub(c.inputMin));h=f}var b=null,g=u.predict(h);if(c.inputUnitsNormalize){var m=c.inputMax,v=c.inputMin,x=h.mul(m.sub(v)).add(v);p=x.dataSync()}else{var y=h;p=y.dataSync()}if(h.dispose(),c.outputUnitsNormalize){var D=c.outputMax,z=c.outputMin,S=g.mul(D.sub(z)).add(z);b=S.dataSync()}else{var w=g;b=w.dataSync()}g.dispose();var A=[];-1!==l&&(A=e.map((function(t){return t[l]})));for(var M=n.layers[0].batchInputShape[1],C=n.layers[this.layerSize-1].units,I=b.length/C,k=[],T=0;T<I;T++){for(var L=[],N=0;N<M;N++)L.push(r[T][N]);for(var U=0;U<C;U++)L.push(b[T*C+U]);-1!==l&&L.push(A[T]),k.push(L)}if(this.output=k,1===M&&1===C){for(var $=[],_=0;_<r.length;_++)$.push({x:r[_][0],y:s[_][0]});var j=Array.from(p).map((function(t,a){return{x:t,y:b[a]}}));t.tfvis.render.scatterplot(this.$refs["draw"],{values:[$,j],series:["original","predicted"]},{width:700,height:450}),this.fileChart=!0}else this.fileChart=!1;this.loading=!1}}}}).call(this,i("c8ba"))}}]);
//# sourceMappingURL=chunk-2e2642a1.85b3b5c5.js.map