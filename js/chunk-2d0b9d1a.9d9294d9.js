(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b9d1a"],{3524:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("component-layout",{attrs:{component:t.component,length:t.length,loading:t.loading},on:{"update:component":function(e){t.component=e},"update:length":function(e){t.length=e},"update:loading":function(e){t.loading=e}}},[n("b-input-group",{staticClass:"mb-2"},[n("b-form-input",{attrs:{placeholder:"Choose a remote web address..."},model:{value:t.remoteFile,callback:function(e){t.remoteFile=e},expression:"remoteFile"}}),n("b-input-group-append",[n("b-button",{staticClass:"select-button",on:{click:t.selectRemoteFile}},[t._v("Select remote file")])],1)],1)],1)},o=[],a=n("5530"),l=n("315f"),s=n("cc8f"),u=n("2ef0"),r=n.n(u),p=n("9131"),c={name:"TSModelLoader",components:{ComponentLayout:l["a"]},mixins:[s["a"]],data:function(){var t={serializable:["remoteFile"],remoteFile:null,utilities:p};return this.importData(t)},computed:{plugActionDisabled:function(){var t=0;return t|=!0===this.loading,1===t}},methods:{selectRemoteFile:function(){this.loading=!0,this.$emit("onPlugAction",this.loading);var t=null,e=null,n=this.global.inputMatrix,i=this.global.outputMatrix,o={inputUnitsNormalize:!0,outputUnitsNormalize:!0},l=r.a.cloneDeep(this.global.inputShape);null!==this.global.training&&(n=this.global.training.inputMatrix),l.unshift(n.length),t=this.$tf.tensor(n,l);var s=r.a.cloneDeep(this.global.outputShape);if(null!==this.global.training&&(i=this.global.training.outputMatrix),s.unshift(i.length),e=this.$tf.tensor(i,s),o.inputUnitsNormalize){var u=p["tasks"].normalizeTensor(this.$tf,t),c=u.normal,h=u.min,m=u.max;t.dispose(),t=c,o.inputMin=h,o.inputMax=m}if(o.outputUnitsNormalize){var d=p["tasks"].normalizeTensor(this.$tf,e),g=d.normal,b=d.min,f=d.max;e.dispose(),e=g,o.outputMin=b,o.outputMax=f}t.dispose(),e.dispose(),this.$tf.loadLayersModel(this.remoteFile).then(function(t){this.global.model=t,this.output=Object(a["a"])(Object(a["a"])({},this.inputData),{},{normalizationData:o}),this.plugActionEnd(event)}.bind(this))},plugActionEvent:function(t){this.selectRemoteFile(t)}}},h=c,m=n("2877"),d=Object(m["a"])(h,i,o,!1,null,"da1c79de",null);e["default"]=d.exports}}]);
//# sourceMappingURL=chunk-2d0b9d1a.9d9294d9.js.map