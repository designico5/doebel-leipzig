import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";

function loadCore(relativePath){
  const module={exports:{}};
  vm.runInNewContext(readFileSync(new URL(relativePath,import.meta.url),"utf8"),{module,exports:module.exports,window:undefined,Number,JSON,Math,Boolean,String,TypeError});
  return module.exports;
}

const stateCore=loadCore("../js/experience-state.js");
const bridgeCore=loadCore("../js/ue-bridge.js");
const chapters=["INTRO","DISCOVERY","APPROACH","TRANSFORM","DEEP","CONTEXT","PROOF","REBUILD","CTA"];

test("progress is clamped deterministically",()=>{
  assert.equal(stateCore.clamp(-4),0);
  assert.equal(stateCore.clamp(.42),.42);
  assert.equal(stateCore.clamp(7),1);
});

test("all scroll boundaries resolve to the intended chapter",()=>{
  const samples=[[0,"INTRO"],[.081,"DISCOVERY"],[.181,"APPROACH"],[.301,"TRANSFORM"],[.451,"DEEP"],[.601,"CONTEXT"],[.721,"PROOF"],[.841,"REBUILD"],[.941,"CTA"],[1,"CTA"]];
  samples.forEach(([progress,chapter])=>assert.equal(stateCore.chapterAt(progress,chapters),chapter));
});

test("snapshots do not expose mutable runtime state",()=>{
  const source={progress:.5,pointer:{x:.2,y:.8}};
  const copy=stateCore.snapshot(source); copy.pointer.x=1;
  assert.equal(source.pointer.x,.2);
});

test("bridge payload is versioned, bounded and explicit",()=>{
  const payload=bridgeCore.payload({sequence:4.8,progress:9,velocity:-2,chapter:"DEEP",variant:"CINE",deviceClass:"MOBILE",qualityTier:"BALANCED",pointer:{x:-1,y:3},reducedMotion:true});
  assert.deepEqual(JSON.parse(JSON.stringify(payload)),{type:"experience.state",version:1,sequence:4,progress:1,velocity:0,chapter:"DEEP",variant:"CINE",deviceClass:"MOBILE",qualityTier:"BALANCED",pointer:{x:0,y:1},reducedMotion:true});
});

test("bridge accepts only known versioned inbound messages",()=>{
  assert.equal(bridgeCore.validInbound({type:"experience.ready",version:1}),true);
  assert.equal(bridgeCore.validInbound({type:"experience.ready",version:2}),false);
  assert.equal(bridgeCore.validInbound({type:"unknown",version:1}),false);
});
