(function(e){function t(t){for(var o,s,i=t[0],c=t[1],u=t[2],d=0,p=[];d<i.length;d++)s=i[d],Object.prototype.hasOwnProperty.call(n,s)&&n[s]&&p.push(n[s][0]),n[s]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(e[o]=c[o]);l&&l(t);while(p.length)p.shift()();return a.push.apply(a,u||[]),r()}function r(){for(var e,t=0;t<a.length;t++){for(var r=a[t],o=!0,i=1;i<r.length;i++){var c=r[i];0!==n[c]&&(o=!1)}o&&(a.splice(t--,1),e=s(s.s=r[0]))}return e}var o={},n={app:0},a=[];function s(t){if(o[t])return o[t].exports;var r=o[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=e,s.c=o,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)s.d(r,o,function(t){return e[t]}.bind(null,o));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/hoTich/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var u=0;u<i.length;u++)t(i[u]);var l=c;a.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"56d7":function(e,t,r){"use strict";r.r(t);var o=r("2b0e"),n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"VueXlsx"},[r("v-card",{staticClass:"big-card",attrs:{height:"100%"}},[r("v-tabs",{attrs:{"background-color":"primary",dark:""},model:{value:e.tab,callback:function(t){e.tab=t},expression:"tab"}},e._l(e.items,(function(t){return r("v-tab",{key:t.tab},[e._v("\n        "+e._s(t.tab)+"\n      ")])})),1),r("v-tabs-items",{model:{value:e.tab,callback:function(t){e.tab=t},expression:"tab"}},e._l(e.items,(function(e){return r("v-tab-item",{key:e.tab},[r("v-card",{staticClass:"big-card",attrs:{height:"100%"}},[r("v-card-text",[r(e.content,{tag:"component"})],1)],1)],1)})),1)],1)],1)},a=[],s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("section",[e._m(0),r("hr",{staticClass:"mb-5"}),r("div",[r("label",{attrs:{for:"username"}},[e._v("Username:")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.username,expression:"username"}],staticStyle:{width:"100%",padding:"10px",margin:"10px 0",border:"1px solid #bbbbbb !important","border-radius":"4px","box-sizing":"border-box","font-size":"16px"},attrs:{type:"text",id:"username",required:""},domProps:{value:e.username},on:{input:function(t){t.target.composing||(e.username=t.target.value)}}})]),r("div",[r("label",{attrs:{for:"password"}},[e._v("Password:")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.password,expression:"password"}],staticStyle:{width:"100%",padding:"10px",margin:"10px 0",border:"1px solid #bbbbbb !important","border-radius":"4px","box-sizing":"border-box","font-size":"16px"},attrs:{type:"password",id:"password",required:""},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value)}}})]),r("button",{staticStyle:{color:"white","font-weight":"bold",width:"150px",padding:"10px",margin:"10px 0",border:"1px solid #bbbbbb !important","border-radius":"4px","box-sizing":"border-box","font-size":"16px","background-color":"rgb(38, 113, 184) !important"},on:{click:e.getToken}},[e._v("Get Token")]),e.token?r("p",[e._v("Token: "+e._s(e.token))]):e._e()]),r("section",[r("section",{staticClass:"mb-5"},[r("h2",{staticClass:"mb-5"},[e._v("Get TT Hồ sơ")]),r("div",[r("label",{staticStyle:{"font-size":"large","font-weight":"bold"},attrs:{for:"igateToken"}},[e._v("gliToken:")]),r("textarea",{directives:[{name:"model",rawName:"v-model",value:e.token,expression:"token"}],staticClass:"textarea",staticStyle:{width:"100%",height:"100px","box-sizing":"border-box",border:"1px solid #bbbbbb !important"},attrs:{type:"text",id:"igateToken",required:""},domProps:{value:e.token},on:{input:function(t){t.target.composing||(e.token=t.target.value)}}})]),r("div",[r("label",{staticStyle:{"font-size":"large","font-weight":"bold"},attrs:{for:"igateToken"}},[e._v("igateToken:")]),r("textarea",{directives:[{name:"model",rawName:"v-model",value:e.igateToken,expression:"igateToken"}],staticClass:"textarea",staticStyle:{width:"100%",height:"100px","box-sizing":"border-box",border:"1px solid #bbbbbb !important"},attrs:{type:"text",id:"igateToken",required:""},domProps:{value:e.igateToken},on:{input:function(t){t.target.composing||(e.igateToken=t.target.value)}}})]),r("div",[r("label",{staticStyle:{"font-size":"large","font-weight":"bold"},attrs:{for:"maHso"}},[e._v("Mã hồ sơ:")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.maHso,expression:"maHso"}],staticStyle:{width:"100%",padding:"10px",margin:"10px 0",border:"1px solid #bbbbbb !important","border-radius":"4px","box-sizing":"border-box","font-size":"16px"},attrs:{type:"text",id:"maHso",required:""},domProps:{value:e.maHso},on:{input:function(t){t.target.composing||(e.maHso=t.target.value)}}})]),e.eformData?r("p",{staticStyle:{color:"red",display:"none"}},[e._v("eformData: "+e._s(e.eformData))]):e._e(),r("button",{staticStyle:{color:"white","font-weight":"bold",width:"150px",padding:"10px",margin:"10px 0",border:"1px solid #bbbbbb !important","border-radius":"4px","box-sizing":"border-box","font-size":"16px","background-color":"rgb(38, 113, 184) !important"},on:{click:e.fetchData}},[e._v("Get TT Hồ sơ")])]),r("section",{staticClass:"mt-5"},[r("h2",{staticClass:"mb-5"},[e._v("Đẩy qua hộ tịch")]),r("button",{staticStyle:{color:"white","font-weight":"bold",width:"150px",padding:"10px",margin:"10px 0",border:"1px solid #bbbbbb !important","border-radius":"4px","box-sizing":"border-box","font-size":"16px","background-color":"rgb(38, 113, 184) !important"},on:{click:e.pushHoTich}},[e._v("Đẩy qua hộ tịch")]),e.requestBody?r("p",{staticStyle:{color:"red",display:"none"}},[e._v("Body gửi đi: "+e._s(e.requestBody))]):e._e(),r("textarea",{directives:[{name:"model",rawName:"v-model",value:e.requestBodyString,expression:"requestBodyString"}],staticStyle:{width:"100%",height:"200px"},domProps:{value:e.requestBodyString},on:{input:function(t){t.target.composing||(e.requestBodyString=t.target.value)}}}),e.responseHT?r("p",{staticStyle:{color:"purple"}},[e._v("Kết quả trả về từ hộ tịch: "+e._s(e.responseHT))]):e._e()])])])},i=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("section",{staticClass:"mb-5"},[r("h2",{staticClass:"mb-5"},[e._v("Get Token(Dùng ở local)")])])}],c=(r("f576"),r("06db"),r("551c"),r("96cf"),r("cee4"));r("8a81"),r("5df3"),r("cadf"),r("ac6a");function u(e){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u(e)}function l(e){var t="";function r(e){var o=function(o){e.hasOwnProperty(o)&&("object"!==u(e[o])||Array.isArray(e[o])?Array.isArray(e[o])?e[o].forEach((function(e){t+="<".concat(o,">"),r(e),t+="</".concat(o,">")})):t+="<".concat(o,">").concat(e[o],"</").concat(o,">"):(t+="<".concat(o,">"),r(e[o]),t+="</".concat(o,">")))};for(var n in e)o(n)}return r(e),t}function d(e,t,r,o,n,a,s){try{var i=e[a](s),c=i.value}catch(u){return void r(u)}i.done?t(c):Promise.resolve(c).then(o,n)}function p(e){return function(){var t=this,r=arguments;return new Promise((function(o,n){var a=e.apply(t,r);function s(e){d(a,o,n,s,i,"next",e)}function i(e){d(a,o,n,s,i,"throw",e)}s(void 0)}))}}var b={components:{},watch:{},data:function(){return{username:"imsqeSUzd7YRbvAoAoZvKkOPx0Ia",password:"YcJE_MIA9Wo9Vijr8lz8vUQJde8a",token:"",maHso:"",hsoId:"",igateToken:"",eformData:"",requestBody:{maDonVi:"",module:"",maHoSo:"",ngayTiepNhan:"",data:""},responseHT:"",requestBodyString:""}},methods:{getToken:function(){var e=this;return p(regeneratorRuntime.mark((function t(){var r,o,n,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r="/api/token",o="Basic ".concat(btoa("".concat(e.username,":").concat(e.password))),n=new URLSearchParams,n.append("grant_type","client_credentials"),t.prev=4,t.next=7,c["a"].post(r,n,{headers:{Authorization:o,"Access-Control-Allow-Origin ":"*","Content-Type":"application/x-www-form-urlencoded"}});case 7:a=t.sent,console.log("Token:",a.data),e.token=a.data.access_token,t.next=16;break;case 12:t.prev=12,t.t0=t["catch"](4),t.t0.response?(console.error("Dữ liệu phản hồi lỗi:",t.t0.response.data),console.error("Trạng thái phản hồi lỗi:",t.t0.response.status),console.error("Header phản hồi lỗi:",t.t0.response.headers)):t.t0.request?console.error("Yêu cầu lỗi:",t.t0.request):console.error("Thông báo lỗi:",t.t0.message),console.error("Cấu hình lỗi:",t.t0.config);case 16:case"end":return t.stop()}}),t,null,[[4,12]])})))()},getHsoId:function(){var e=this;return p(regeneratorRuntime.mark((function t(){var r,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r="https://apiigate.gialai.gov.vn/pa/dossier/search?page=0&size=20&applicant-organization=&spec=slice&code=".concat(e.maHso),t.prev=1,t.next=4,c["a"].get(r,{headers:{Authorization:"Bearer ".concat(e.igateToken)}});case 4:o=t.sent,console.log("content:",o),e.hsoId=o.data.content[0].id,t.next=12;break;case 9:t.prev=9,t.t0=t["catch"](1),t.t0.response?(console.error("Dữ liệu phản hồi lỗi:",t.t0.response.data),console.error("Trạng thái phản hồi lỗi:",t.t0.response.status)):t.t0.request?console.error("Yêu cầu lỗi:",t.t0.request):console.error("Thông báo lỗi:",t.t0.message);case 12:case"end":return t.stop()}}),t,null,[[1,9]])})))()},getData:function(){var e=this;return p(regeneratorRuntime.mark((function t(){var r,o,n,a,s,i,u;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r="https://apiigate.gialai.gov.vn/pa/dossier/".concat(e.hsoId,"/--online"),t.prev=1,t.next=4,c["a"].get(r,{headers:{Authorization:"Bearer ".concat(e.igateToken)}});case 4:o=t.sent,console.log("Data:",o.data),e.requestBody.maDonVi=o.data.eForm.data.noiDangKy,n=new Date(o.data.acceptedDate),a=n.getFullYear(),s=String(n.getMonth()+1).padStart(2,"0"),i=String(n.getDate()).padStart(2,"0"),e.requestBody.ngayTiepNhan="".concat(a,"-").concat(s,"-").concat(i),e.requestBody.module=o.data.eForm.data.loaiHTTP,e.requestBody.maHoSo=o.data.code,e.eformData=o.data.eForm.data,u=l(e.eformData),e.requestBody.data="<hotich><hoso>".concat(u,"</hoso></hotich>"),e.responseHT="",e.requestBodyString=JSON.stringify(e.requestBody,null,2),t.next=24;break;case 21:t.prev=21,t.t0=t["catch"](1),t.t0.response?(console.error("Dữ liệu phản hồi lỗi:",t.t0.response.data),console.error("Trạng thái phản hồi lỗi:",t.t0.response.status)):t.t0.request?console.error("Yêu cầu lỗi:",t.t0.request):console.error("Thông báo lỗi:",t.t0.message);case 24:case"end":return t.stop()}}),t,null,[[1,21]])})))()},fetchData:function(){var e=this;return p(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.getHsoId();case 2:if(!e.hsoId){t.next=5;break}return t.next=5,e.getData();case 5:case"end":return t.stop()}}),t)})))()},pushHoTich:function(){var e=this;return p(regeneratorRuntime.mark((function t(){var r,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r="https://congdichvu.gialai.gov.vn:443/hotich/1.0/dangKyHoTich",e.requestBody=JSON.parse(e.requestBodyString),console.log(e.requestBody),console.log(e.requestBody),t.prev=4,t.next=7,c["a"].post(r,e.requestBody,{headers:{Authorization:"Bearer ".concat(e.token),"Content-Type":"application/json"}});case 7:o=t.sent,console.log("Response:",o.data),e.responseHT=o.data,t.next=15;break;case 12:t.prev=12,t.t0=t["catch"](4),console.error("Error:",t.t0.response?t.t0.response.data:t.t0.message);case 15:case"end":return t.stop()}}),t,null,[[4,12]])})))()}}},g=b,h=r("2877"),m=Object(h["a"])(g,s,i,!1,null,"6b7be7ff",null),f=m.exports,v=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},x=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("section",[r("section",{staticClass:"mb-5"})])])}],y={components:{},data:function(){return{hsoId:"",igateToken:"",eformData:""}},watch:{},methods:{}},w=y,k=Object(h["a"])(w,v,x,!1,null,null,null),T=k.exports,_={components:{BAOCAO1:f,BAOCAO2:T},data:function(){return{tableTitle:"Cuộc thi",tab:null,items:[{tab:"Get Token",content:"BAOCAO1"},{tab:"Đăng ký hộ tịch",content:"BAOCAO2"}]}},methods:{}},S=_,q=Object(h["a"])(S,n,a,!1,null,null,null),B=q.exports,O=r("ce5b"),z=r.n(O);r("bf40");o["default"].use(z.a);var H={},C=new z.a(H);o["default"].config.productionTip=!1,new o["default"]({vuetify:C,render:function(e){return e(B)}}).$mount("#app")}});
//# sourceMappingURL=app.adad9d6f.js.map