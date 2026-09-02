(function(root,factory){
  "use strict";
  var core=factory();
  if(typeof module==="object"&&module.exports) module.exports=core;
  if(!root||!root.document) return;
  var doc=root.document, html=doc.documentElement, reduce=root.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var chapters=["INTRO","DISCOVERY","APPROACH","TRANSFORM","DEEP","CONTEXT","PROOF","REBUILD","CTA"];
  var state={version:1,sequence:0,progress:0,velocity:0,chapter:"INTRO",variant:"FLOW",deviceClass:"DESKTOP",qualityTier:"HIGH",pointer:{x:.5,y:.5},reducedMotion:reduce,ranges:{hero:0,tour:0}};
  var lastY=root.scrollY,lastTime=performance.now(),velocityTarget=0,frame=0;
  function classify(){
    state.deviceClass=root.innerWidth<700?"MOBILE":root.innerWidth<1100?"TABLET":"DESKTOP";
    state.qualityTier=reduce?"FALLBACK":state.deviceClass==="MOBILE"?"BALANCED":state.deviceClass==="TABLET"?"HIGH":"ULTRA";
  }
  function range(selector,anchor,span){
    var el=doc.querySelector(selector); if(!el) return 0;
    var rect=el.getBoundingClientRect(); return core.clamp((root.innerHeight*anchor-rect.top)/(Math.max(1,rect.height)*span));
  }
  function measure(){
    var now=performance.now(),y=root.scrollY,elapsed=Math.max(16,Math.min(120,now-lastTime));
    velocityTarget=reduce?0:core.clamp(Math.abs(y-lastY)/elapsed/2.2); lastY=y; lastTime=now; request();
  }
  function paint(){
    frame=0; var page=doc.documentElement,den=Math.max(1,page.scrollHeight-page.clientHeight);
    state.progress=core.clamp(page.scrollTop/den); state.velocity+= (velocityTarget-state.velocity)*.18;
    if(performance.now()-lastTime>110) velocityTarget=0;
    if(Math.abs(state.velocity-velocityTarget)<.002) state.velocity=velocityTarget;
    state.chapter=core.chapterAt(state.progress,chapters); state.ranges.hero=reduce ? .82 : range(".hero-scene",.88,1.65); state.ranges.tour=reduce?1:range("#tour",.82,.72);
    state.sequence+=1; classify(); root.DoebelExperienceState=state;
    html.style.setProperty("--experience",state.progress.toFixed(4)); html.style.setProperty("--velocity",state.velocity.toFixed(3)); html.style.setProperty("--flow",(1+state.velocity*1.4).toFixed(2));
    html.dataset.experienceChapter=state.chapter.toLowerCase(); html.dataset.deviceClass=state.deviceClass.toLowerCase(); html.dataset.qualityTier=state.qualityTier.toLowerCase();
    doc.dispatchEvent(new CustomEvent("experiencechange",{detail:core.snapshot(state)}));
    if(state.velocity!==0||velocityTarget!==0) frame=requestAnimationFrame(paint);
  }
  function request(){if(!frame&&!doc.hidden) frame=requestAnimationFrame(paint);}
  doc.addEventListener("scroll",measure,{passive:true});
  root.addEventListener("resize",request,{passive:true});
  root.addEventListener("pointermove",function(event){state.pointer.x=core.clamp(event.clientX/Math.max(1,root.innerWidth));state.pointer.y=core.clamp(event.clientY/Math.max(1,root.innerHeight));request();},{passive:true});
  doc.addEventListener("motionvariantchange",function(event){state.variant=String(event.detail&&event.detail.variant||"flow").toUpperCase();request();});
  doc.addEventListener("visibilitychange",function(){if(!doc.hidden){lastY=root.scrollY;lastTime=performance.now();request();}});
  classify(); paint();
})(typeof window==="object"?window:null,function(){
  "use strict";
  function clamp(value){return Math.max(0,Math.min(1,Number(value)||0));}
  function chapterAt(progress,chapters){var stops=[.08,.18,.30,.45,.60,.72,.84,.94,1],p=clamp(progress);for(var i=0;i<stops.length;i++)if(p<=stops[i])return chapters[i];return chapters[chapters.length-1];}
  function snapshot(state){return JSON.parse(JSON.stringify(state));}
  return {clamp:clamp,chapterAt:chapterAt,snapshot:snapshot};
});
