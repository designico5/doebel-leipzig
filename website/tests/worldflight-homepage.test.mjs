import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import test from "node:test";

const index=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const homeCss=readFileSync(new URL("../css/home.css",import.meta.url),"utf8");
const homeJs=readFileSync(new URL("../js/home.js",import.meta.url),"utf8");

function occurrences(source,pattern){
  return [...source.matchAll(pattern)].length;
}

test("homepage has one continuous eight-part worldflight timeline",()=>{
  assert.equal(occurrences(index,/data-sc-mode=["']worldflight["']/g),1);
  assert.equal(occurrences(index,/\bdata-sc-spacer(?:\s|=)/g),1);
  assert.equal(occurrences(index,/\bdata-sc-segment(?:\s|=)/g),8);
  assert.equal(occurrences(index,/\bdata-story-copy(?:\s|=)/g),8);
  assert.equal(occurrences(index,/\bdata-story-range=["'][^"']+["']/g),8);
});

test("no-script fallback keeps services and contact information semantic",()=>{
  const fallback=index.match(/<div\b[^>]*class=["']no-js-fallback["'][^>]*>([\s\S]*?)<\/div>/i)?.[1]??"";
  assert.match(fallback,/<main\b[^>]*id=["']nojs-main["']/i);
  assert.match(fallback,/<h1>[^<]+<\/h1>/i);
  assert.match(fallback,/<nav\b[^>]*aria-label=["']Leistungen["']/i);
  assert.match(fallback,/<address>Alexander Döbel GbR · Kippenbergstraße 10 · 04317 Leipzig<\/address>/i);
  assert.match(fallback,/href=["']tel:\+491728821200["']/i);
  assert.match(fallback,/href=["']mailto:info@doebel-leipzig\.de["']/i);
});

test("motion and high-contrast fallbacks are explicitly provided",()=>{
  assert.match(homeCss,/@media\s*\(prefers-reduced-motion\s*:\s*reduce\)/i);
  assert.match(homeCss,/\.reduced-world\s+\.story-copy/);
  assert.match(homeCss,/\.reduced-world\s+\[data-sc-spacer\]\s*\{[^}]*display\s*:\s*none/i);
  assert.match(homeCss,/@media\s*\(forced-colors\s*:\s*active\)/i);
  assert.match(homeCss,/\.no-js\s+\.no-js-fallback\s*\{[^}]*display\s*:\s*block/i);
});

test("Three.js is served entirely from local vendor modules",()=>{
  const modulePath=new URL("../js/vendor/three.module.min.js",import.meta.url);
  const corePath=new URL("../js/vendor/three.core.min.js",import.meta.url);
  assert.equal(existsSync(modulePath),true);
  assert.equal(existsSync(corePath),true);
  assert.match(homeJs,/import\s+\*\s+as\s+THREE\s+from\s+["']\.\/vendor\/three\.module\.min\.js["']/);
  assert.match(readFileSync(modulePath,"utf8"),/from["']\.\/three\.core\.min\.js["']/);
  assert.doesNotMatch(homeJs,/https?:\/\//);
});

test("published contact and availability values remain exact",()=>{
  assert.match(index,/Kippenbergstraße 10/);
  assert.match(index,/04317 Leipzig/);
  assert.match(index,/tel:\+491728821200/);
  assert.match(index,/\+49 172 8821200/);
  assert.match(index,/info@doebel-leipzig\.de/);
  assert.match(index,/Montag bis Samstag, 07:00(?:–| bis )17:00 Uhr/);
  assert.match(index,/Kühlanlagen-Notdienst (?:ist )?rund um die Uhr/);
});
