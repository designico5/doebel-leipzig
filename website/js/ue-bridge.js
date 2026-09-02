(function(root,factory){
  "use strict";
  var core=factory();
  if(typeof module==="object"&&module.exports) module.exports=core;
  if(!root||!root.document) return;
  var sender=null,status="fallback",lastSent=0,lastSequence=0,allowedOrigin=root.location.origin;
  function runtimeFrame(){return document.querySelector("[data-ue-runtime]");}
  function runtimeOrigin(frame){return frame&&frame.getAttribute("data-ue-origin")||root.location.origin;}
  function announce(next,detail){status=next;document.dispatchEvent(new CustomEvent("uebridgechange",{detail:{status:status,data:detail||null}}));}
  function transmit(state){
    var now=performance.now(); if(now-lastSent<32||!state||state.sequence===lastSequence) return;
    var payload=core.payload(state); lastSent=now; lastSequence=state.sequence;
    if(sender){try{sender(JSON.stringify(payload));announce("connected");}catch(error){announce("error",String(error&&error.message||error));}return;}
    var frame=runtimeFrame();
    if(frame&&frame.contentWindow){allowedOrigin=runtimeOrigin(frame);frame.contentWindow.postMessage(payload,allowedOrigin);announce("connected");}
  }
  function receive(event){
    var frame=runtimeFrame();
    if(event.origin!==allowedOrigin||frame&&event.source!==frame.contentWindow||!core.validInbound(event.data)) return;
    if(event.data.type==="experience.ready") announce("ready",event.data);
    else if(event.data.type==="experience.error") announce("error",event.data);
    else announce("connected",event.data);
  }
  root.DoebelUEBridge={
    version:1,
    connect:function(sendFunction){if(typeof sendFunction!=="function")throw new TypeError("sendFunction required");sender=sendFunction;announce("connected");},
    disconnect:function(){sender=null;announce("fallback");},
    getStatus:function(){return status;},
    receive:function(message){if(core.validInbound(message))announce(message.type==="experience.error"?"error":"ready",message);}
  };
  document.addEventListener("experiencechange",function(event){transmit(event.detail);});
  root.addEventListener("message",receive);
})(typeof window==="object"?window:null,function(){
  "use strict";
  var inbound=["experience.ready","experience.ack","experience.quality","experience.error"];
  function finite(value){var number=Number(value);return Number.isFinite(number)?number:0;}
  function payload(state){return {type:"experience.state",version:1,sequence:Math.max(0,Math.floor(finite(state.sequence))),progress:Math.max(0,Math.min(1,finite(state.progress))),velocity:Math.max(0,Math.min(1,finite(state.velocity))),chapter:String(state.chapter||"INTRO"),variant:String(state.variant||"FLOW"),deviceClass:String(state.deviceClass||"DESKTOP"),qualityTier:String(state.qualityTier||"FALLBACK"),pointer:{x:Math.max(0,Math.min(1,finite(state.pointer&&state.pointer.x))),y:Math.max(0,Math.min(1,finite(state.pointer&&state.pointer.y)))},reducedMotion:Boolean(state.reducedMotion)};}
  function validInbound(message){return Boolean(message&&message.version===1&&inbound.indexOf(message.type)!==-1);}
  return {payload:payload,validInbound:validInbound};
});
