(function(){
  "use strict";
  var tour=document.getElementById("tour");
  if(!tour) return;
  var scene=tour.querySelector(".tour-scene"), svg=scene&&scene.querySelector("svg"), route=svg&&svg.querySelector("#route");
  if(!scene||!svg||!route) return;
  var root=document.documentElement, reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ns="http://www.w3.org/2000/svg", layer=document.createElementNS(ns,"g"), orb=document.createElementNS(ns,"circle");
  layer.setAttribute("class","variant-layer"); orb.setAttribute("class","variant-orb"); orb.setAttribute("r","22"); layer.appendChild(orb); svg.insertBefore(layer,route);
  var particles=[], count=28, i;
  for(i=0;i<count;i++){
    var particle=document.createElementNS(ns,"circle");
    particle.setAttribute("class","variant-particle"); particle.setAttribute("r",i%3?2.1:3.2); layer.appendChild(particle); particles.push(particle);
  }
  var variant="flow", progress=0, target=0, frame=0, length=route.getTotalLength();
  var descriptions={flow:"Partikel folgen dem Kältekreis rückwärts bis zur warmen Kesselzone.",phase:"Der Strom zerfällt an den Stationen, wirbelt und kondensiert als neuer Wärmekern.",cine:"Ein dunkler Energie-Kern zieht den Blick durch die Anlage und zündet am Heizkessel."};
  function clamp(v){return Math.max(0,Math.min(1,v));}
  function progressTarget(){
    if(reduce){target=1;return;}
    var rect=tour.getBoundingClientRect(); target=clamp((innerHeight*.82-rect.top)/(rect.height*.72));
  }
  function paint(){
    frame=0; progressTarget(); progress+= (target-progress)*.16; if(Math.abs(target-progress)<.002) progress=target;
    root.style.setProperty("--variant-progress",progress.toFixed(3));
    var center=length*(1-progress), spread=length*(variant==="phase"?.16:.1), centerPoint=route.getPointAtLength(Math.max(0,Math.min(length,center)));
    orb.setAttribute("cx",centerPoint.x.toFixed(1)); orb.setAttribute("cy",centerPoint.y.toFixed(1));
    for(var n=0;n<particles.length;n++){
      var ratio=n/(particles.length-1), along=center+(ratio-.5)*spread;
      along=Math.max(0,Math.min(length,along));
      var point=route.getPointAtLength(along), wiggle=0;
      if(variant==="phase") wiggle=(8+18*Math.sin(progress*Math.PI))*Math.sin(n*2.1+progress*10);
      if(variant==="cine") wiggle=(14+10*Math.sin(progress*Math.PI))*Math.cos(n*1.7+progress*7);
      var angle=(n*2.399+progress*4), x=point.x+Math.cos(angle)*wiggle, y=point.y+Math.sin(angle)*wiggle;
      var cold=along/length>.56, color=cold?"#8FB8FF":"#FF9B62";
      particles[n].setAttribute("cx",x.toFixed(1)); particles[n].setAttribute("cy",y.toFixed(1)); particles[n].setAttribute("fill",color);
      particles[n].setAttribute("opacity",(variant==="phase"?(.25+.65*Math.abs(Math.sin(progress*Math.PI+n*.17))):(.3+.58*(1-Math.abs(ratio-.5)*1.4))).toFixed(2));
    }
    if(progress!==target && !reduce) frame=requestAnimationFrame(paint);
  }
  function request(){if(!frame) frame=requestAnimationFrame(paint);}
  function setVariant(next){
    if(!descriptions[next]) return;
    variant=next; scene.setAttribute("data-motion-variant",variant); tour.setAttribute("data-motion-variant",variant);
    tour.querySelectorAll("[data-motion]").forEach(function(button){var active=button.getAttribute("data-motion")===variant;button.classList.toggle("is-active",active);button.setAttribute("aria-pressed",String(active));});
    var copy=tour.querySelector("[data-motion-description]"); if(copy) copy.textContent=descriptions[variant];
    document.dispatchEvent(new CustomEvent("motionvariantchange",{detail:{variant:variant}}));
    paint();
  }
  tour.querySelectorAll("[data-motion]").forEach(function(button){button.addEventListener("click",function(){setVariant(button.getAttribute("data-motion"));});});
  document.addEventListener("scroll",request,{passive:true}); window.addEventListener("resize",function(){length=route.getTotalLength();request();});
  setVariant("flow");
})();

