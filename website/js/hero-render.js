(function(){
  "use strict";
  var scene=document.querySelector(".hero-scene"), stack=scene&&scene.querySelector(".hero-render-stack"), particlesHost=stack&&stack.querySelector(".hero-render-particles");
  if(!scene||!stack||!particlesHost) return;
  scene.setAttribute("data-motion-variant","flow");
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches, particles=[], count=34, frame=0, progress=0, target=0, px=0, py=0, variant="flow";
  var stages=["cold","cold","cold","floor","floor","warm","warm","building"];
  for(var i=0;i<count;i++){
    var dot=document.createElement("i"); dot.className="hero-particle";
    dot.style.setProperty("--particle-size",(i%5===0?4:2.2)+"px");
    dot.dataset.angle=(i*2.399+0.4).toFixed(3); dot.dataset.radius=(58+(i%7)*18).toFixed(1); dot.dataset.phase=(i/count).toFixed(3);
    particlesHost.appendChild(dot); particles.push(dot);
  }
  function clamp(v){return Math.max(0,Math.min(1,v));}
  function smooth(v){return v*v*(3-2*v);}
  function readTarget(){
    if(reduce){target=.82;return;}
    var r=scene.getBoundingClientRect();
    target=clamp((innerHeight*.88-r.top)/(r.height+innerHeight*.65));
  }
  function paint(){
    frame=0; readTarget(); progress+=(target-progress)*.12; if(Math.abs(target-progress)<.0015) progress=target;
    var p=progress, zoom=1, lensScale=1, lensOpacity=.92;
    if(p<.26){var a=smooth(p/.26);zoom=1+a*.72;lensScale=.72+a*.3;}
    else if(p<.62){var b=smooth((p-.26)/.36);zoom=1.72-b*1.35;lensScale=1.02+b*.24;}
    else {var c=smooth((p-.62)/.38);zoom=.37+c*1.15;lensScale=1.26-c*.34;}
    stack.style.setProperty("--hero-zoom",zoom.toFixed(3)); stack.style.setProperty("--lens-scale",lensScale.toFixed(3)); stack.style.setProperty("--lens-o",lensOpacity.toFixed(2));
    stack.style.setProperty("--lens-x",(px*7).toFixed(1)+"px"); stack.style.setProperty("--lens-y",(py*5).toFixed(1)+"px");
    scene.setAttribute("data-hero-stage",stages[Math.min(stages.length-1,Math.floor(p*stages.length))]);
    scene.style.setProperty("--hero-progress",p.toFixed(3));
    stack.querySelectorAll(".hero-render-tunnel i").forEach(function(ring,index){
      var ringPhase=(p*1.35+index*.16)%1, ringScale=.45+ringPhase*1.12, ringZ=-160+ringPhase*230, ringOpacity=.14+Math.sin(ringPhase*Math.PI)*.48;
      ring.style.setProperty("--tunnel-s",ringScale.toFixed(2)); ring.style.setProperty("--tunnel-z",ringZ.toFixed(1)+"px"); ring.style.setProperty("--tunnel-o",ringOpacity.toFixed(2));
    });
    var cards=stack.querySelectorAll(".hero-render-card");
    cards.forEach(function(card,index){
      var d=parseFloat(card.dataset.depth||0), drift=(p-.5)*d*48, tilt=px*d*2.8;
      card.style.setProperty("--card-x",(px*d*10).toFixed(1)+"px"); card.style.setProperty("--card-y",(py*d*8+drift).toFixed(1)+"px");
      card.style.setProperty("--card-z",(d*42*(.55+p)).toFixed(1)+"px"); card.style.setProperty("--card-rx",(py*d*-1.8).toFixed(2)+"deg"); card.style.setProperty("--card-ry",tilt.toFixed(2)+"deg");
      card.style.setProperty("--card-s",(0.95+zoom*.05+index*.006).toFixed(3));
      var focus=(index===0&&p>.72)||(index===1&&p>.3&&p<.62)||(index===2&&p<.36)||(index===3&&p>.58);
      card.style.setProperty("--card-o",focus?".8":(index===2?.42:index===3?.36:.2));
    });
    particles.forEach(function(dot,n){
      var phase=(p+parseFloat(dot.dataset.phase)*.72)%1, angle=parseFloat(dot.dataset.angle)+p*(variant==="cine"?2.1:1.1), radial=parseFloat(dot.dataset.radius), depth=0, fade=1;
      if(phase<.34){var inT=phase/.34; radial*=1-inT*.84; depth=-80+inT*80;}
      else if(phase<.66){var core=(phase-.34)/.32; radial*=.16+Math.sin(core*Math.PI)*.12; depth=8+core*20;}
      else {var outT=(phase-.66)/.34; radial*=.16+outT*.92; depth=28+outT*110;}
      if(variant==="phase") radial*=1+.32*Math.sin(n*2.7+p*8);
      if(variant==="cine") angle+=Math.sin(n+p*5)*.24;
      var x=Math.cos(angle)*radial+px*12, y=Math.sin(angle)*radial*.62+py*9;
      fade=Math.min(1,Math.sin(phase*Math.PI)*1.35); if(reduce) fade=.62;
      dot.style.setProperty("--particle-x",x.toFixed(1)+"px"); dot.style.setProperty("--particle-y",y.toFixed(1)+"px"); dot.style.setProperty("--particle-z",depth.toFixed(1)+"px"); dot.style.setProperty("--particle-o",Math.max(.08,fade).toFixed(2));
      dot.style.setProperty("--particle-scale",(phase>.34&&phase<.66?1.35:1).toFixed(2)); dot.style.setProperty("--particle-color",phase<.5?"#8FB8FF":"#FF9B62");
    });
    if(progress!==target&&!reduce) frame=requestAnimationFrame(paint);
  }
  function request(){if(!frame) frame=requestAnimationFrame(paint);}
  scene.addEventListener("pointermove",function(e){var r=scene.getBoundingClientRect();px=clamp((e.clientX-r.left)/r.width*2-1);py=clamp((e.clientY-r.top)/r.height*2-1);request();},{passive:true});
  scene.addEventListener("pointerleave",function(){px=0;py=0;request();});
  document.addEventListener("motionvariantchange",function(e){variant=e.detail&&e.detail.variant||"flow";scene.setAttribute("data-motion-variant",variant);request();});
  document.addEventListener("scroll",request,{passive:true}); window.addEventListener("resize",request,{passive:true});
  paint();
})();

