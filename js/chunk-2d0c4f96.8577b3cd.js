(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c4f96"],{"3cb2":function(t,i,e){"use strict";e.r(i);var o=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("component-layout",{attrs:{component:t.component,length:t.length,loading:t.loading},on:{"update:component":function(i){t.component=i},"update:length":function(i){t.length=i},"update:loading":function(i){t.loading=i}}},[e("b-form",{staticClass:"form-toolbar-rtl",attrs:{inline:""}},[e("b-button",{attrs:{size:"badge",disabled:t.plugActionDisabled},on:{click:t.plugAction}},[e("b-icon",{staticClass:"btn-icon",attrs:{icon:"plug"}})],1),e("b-button",{attrs:{size:"badge",disabled:t.trashActionDisabled},on:{click:t.trashAction}},[e("b-icon",{staticClass:"btn-icon",attrs:{icon:"trash"}})],1),e("b-button",{attrs:{size:"badge",disabled:t.imageActionDisabled},on:{click:function(i){return t.$bvModal.show("model-view-"+t.component.index)}}},[e("b-icon",{staticClass:"btn-icon",attrs:{icon:"card-image"}})],1),e("b-button",{attrs:{size:"badge"},on:{click:t.onToggleToolbar}},[e("b-icon",{attrs:{icon:t.toggleIcon}})],1)],1),e("b-collapse",{attrs:{visible:"caret-up"===t.toggleIcon}},[e("b-form",{attrs:{inline:""}},[e("div",{staticClass:"indexInput"},[e("label",[t._v("Compiler Optimizer")]),e("b-form-select",{attrs:{options:t.compilerOptimizerOptions,disabled:t.editActionDisabled},model:{value:t.compilerOptimizerSelected,callback:function(i){t.compilerOptimizerSelected=i},expression:"compilerOptimizerSelected"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Compiler Loss")]),e("b-form-select",{attrs:{options:t.compilerLossOptions,disabled:t.editActionDisabled},model:{value:t.compilerLossSelected,callback:function(i){t.compilerLossSelected=i},expression:"compilerLossSelected"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Input Units Normalize")]),e("b-form-select",{attrs:{options:[!0,!1],disabled:t.editActionDisabled},model:{value:t.inputUnitsNormalize,callback:function(i){t.inputUnitsNormalize=i},expression:"inputUnitsNormalize"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Output Units Normalize")]),e("b-form-select",{attrs:{options:[!0,!1],disabled:t.editActionDisabled},model:{value:t.outputUnitsNormalize,callback:function(i){t.outputUnitsNormalize=i},expression:"outputUnitsNormalize"}})],1)]),e("b-form",{attrs:{inline:""}},[e("div",{staticClass:"indexInput"},[e("label",[t._v("Epochs")]),e("b-form-spinbutton",{attrs:{min:"1",placeholder:"--",disabled:t.editActionDisabled},model:{value:t.epochSize,callback:function(i){t.epochSize=i},expression:"epochSize"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Batch Size")]),e("b-form-spinbutton",{attrs:{min:"1",placeholder:"--",disabled:t.editActionDisabled},model:{value:t.batchSize,callback:function(i){t.batchSize=i},expression:"batchSize"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Validation Split")]),e("b-form-spinbutton",{attrs:{min:"0.0",max:"1.0",step:"0.01","formatter-fn":t.percentageFormatter,disabled:t.editActionDisabled},model:{value:t.validationSplit,callback:function(i){t.validationSplit=i},expression:"validationSplit"}})],1),e("div",{staticClass:"indexInput"},[e("label",[t._v("Shuffle")]),e("b-form-select",{attrs:{options:[!0,!1],disabled:t.editActionDisabled},model:{value:t.shuffle,callback:function(i){t.shuffle=i},expression:"shuffle"}})],1)])],1),e("div",{staticStyle:{"margin-top":"8px"}}),e("b-modal",{attrs:{id:"model-view-"+t.component.index,title:"TS Model View",static:!0,"hide-footer":!0,size:"lg"}},[e("div",{ref:"draw"})])],1)},n=[],a=(e("d3b7"),e("07ac"),e("ac1f"),e("25f0"),e("5319"),e("5530")),s=e("315f"),l=e("cc8f"),c=e("1157"),r=e.n(c),d=e("2ef0"),p=e.n(d),u=e("9131"),h={name:"TSModelCompiler",components:{ComponentLayout:s["a"]},mixins:[l["a"]],data:function(){var t={serializable:["shuffle","epochSize","batchSize","validationSplit","inputUnitsNormalize","outputUnitsNormalize","compilerOptimizerSelected","compilerLossSelected"],toggleIcon:"caret-up",shuffle:!0,epochSize:0,batchSize:0,validationSplit:0,inputUnitsNormalize:!1,outputUnitsNormalize:!1,compilerOptimizerSelected:null,compilerOptimizerOptions:u["tf"].train.options,compilerLossSelected:null,compilerLossOptions:u["tf"].losses.options,fileChart:!1};return this.importData(t)},computed:{editActionDisabled:function(){var t=0;return t|=!0===this.loading,t|=null===this.global.model,t|=null===this.global.inputShape,1===t},trashActionDisabled:function(){return this.editActionDisabled},plugActionDisabled:function(){return this.editActionDisabled},imageActionDisabled:function(){var t=0;return t|=!1===this.fileChart,1===t}},watch:{inputLoading:function(t,i){!1===t&&this.trashAction()},loading:function(t,i){!1===t&&(delete this.$options.sockets.onerror,delete this.$options.sockets.onopen,delete this.$options.sockets.onmessage)}},methods:{onToggleToolbar:function(){"caret-up"===this.toggleIcon?this.toggleIcon="caret-down":"caret-down"===this.toggleIcon&&(this.toggleIcon="caret-up")},trashAction:function(t){r()(this.$refs["draw"]).empty(),this.fileChart=!1,this.output=null,this.loadData(this.data),this.loadData(this.component.data)},plugActionEvent:function(t){var i=null,e=null,o=this.global.inputMatrix,n=this.global.outputMatrix,s={inputUnitsNormalize:this.inputUnitsNormalize,outputUnitsNormalize:this.outputUnitsNormalize},l=p.a.cloneDeep(this.global.inputShape);null!==this.global.training&&(o=this.global.training.inputMatrix),l.unshift(o.length),i=this.$tf.tensor(o,l);var c=p.a.cloneDeep(this.global.outputShape);if(null!==this.global.training&&(n=this.global.training.outputMatrix),c.unshift(n.length),e=this.$tf.tensor(n,c),this.inputUnitsNormalize){var r=u["tasks"].normalizeTensor(this.$tf,i),d=r.normal,h=r.min,b=r.max;i.dispose(),i=d,s.inputMin=h,s.inputMax=b}if(this.outputUnitsNormalize){var m=u["tasks"].normalizeTensor(this.$tf,e),f=m.normal,g=m.min,v=m.max;e.dispose(),e=f,s.outputMin=g,s.outputMax=v}var z=this.$tfvis.show.fitCallbacks(this.$refs["draw"],["loss","mse"],{width:700,height:200,callbacks:["onEpochEnd"]}),S=i.dataSync(),x={data:{type:S.constructor.toString().replace(/.* (.*)\(\)(.|\n)*/g,"$1"),data:Object.values(S)},shape:i.shape},k=e.dataSync(),D={data:{type:k.constructor.toString().replace(/.* (.*)\(\)(.|\n)*/g,"$1"),data:Object.values(k)},shape:e.shape};this.$options.sockets.onerror=function(){var t=new Worker("worker.js");t.onmessage=function(i){if("onEnd"===i.data[0]&&i.error)t.terminate(),this.plugActionEnd(i);else if("onEnd"===i.data[0]){var e=i.data[1];this.$tf.loadLayersModel("indexeddb://model").then(function(o){this.global.model.dispose(),this.global.model=o,this.output=Object(a["a"])(Object(a["a"])({},this.inputData),{},{train:e,normalizationData:s}),t.terminate(),this.plugActionEnd(i)}.bind(this))}else this.fileChart=!0,z[i.data[0]](i.data[1],i.data[2])}.bind(this),this.global.model.save("indexeddb://model").then(function(){t.postMessage(["compiler",this.$data,x,D]),i.dispose(),e.dispose()}.bind(this))}.bind(this),this.$options.sockets.onopen=function(){this.global.model.save(this.$tf.io.browserHTTPRequest("./api/model")).then(function(){this.$socket.sendObj({data:["compiler",this.$data,x,D]}),i.dispose(),e.dispose()}.bind(this))}.bind(this),this.$options.sockets.onmessage=function(t){var i=JSON.parse(t.data);if("onEnd"===i.data[0]){var e=i.data[1];this.$tf.loadLayersModel("./api/model/model.json").then(function(t){this.global.model.dispose(),this.global.model=t,this.output=Object(a["a"])(Object(a["a"])({},this.inputData),{},{train:e,normalizationData:s}),this.$disconnect(),this.plugActionEnd(i)}.bind(this))}else this.fileChart=!0,z[i.data[0]](i.data[1],i.data[2])}.bind(this),this.$options.sockets.onerror()}}},b=h,m=e("2877"),f=Object(m["a"])(b,o,n,!1,null,"067a428c",null);i["default"]=f.exports}}]);
//# sourceMappingURL=chunk-2d0c4f96.8577b3cd.js.map