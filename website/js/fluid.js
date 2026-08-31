/* Fluid-Leben: 2 WebGL-Canvas (Hero + Zahlenband) mit fbm-Metaball-Shader,
   pointer-haptisch, reduced-motion = statischer Einzelbild-Frame, Fallback: CSS-Mesh. */
(function () {
  "use strict";
  var canvases = Array.prototype.slice.call(document.querySelectorAll("canvas.fluid"));
  if (!canvases.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Farbpaletten je Element (data-k1/2/3 als rgb 0..1Triple: r,g,b)
  function colors(c) {
    function get(k, def) {
      var v = c.getAttribute(k);
      return v ? v.split(",").map(parseFloat) : def;
    }
    return [get("data-k1", [0.84, 0.16, 0.16]), get("data-k2", [0.13, 0.36, 0.95]), get("data-k3", [0.02, 0.08, 0.16])];
  }

  var TINT = null;
  var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FS = [
    "precision mediump float;uniform vec2 R;uniform float T;uniform vec2 P;uniform vec3 K1,K2,K3;",
    "float h(vec2 x){return fract(sin(dot(x,vec2(127.1,311.7)))*43758.5453);}",
    "float n(vec2 x){vec2 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);",
    "return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
    "float fbm(vec2 x){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(x);x=x*2.4+vec2(9.2,3.7);a*=.5;}return v;}",
    "void main(){vec2 uv=gl_FragCoord.xy/R.xy;vec2 q=uv*vec2(R.x/R.y,1.);float t=T*.06;",
    "vec2 w=P*.18;",
    "float a1=fbm(q*1.6+vec2(t,-t*.7)+w);",
    "float a2=fbm(q*2.1-vec2(t*.8,t*.6)+w*1.4);",
    "float d1=length(q-vec2(1.9+.7*a1*sin(t),1.05+.8*a1*cos(t*.8)));",
    "float d2=length(q-vec2(.45+.8*a2*cos(t*.6),2.9-.9*a2*sin(t*.7)));",
    "float b1=smoothstep(1.15,.15,d1)*(.45+.75*a1);",
    "float b2=smoothstep(1.25,.1,d2)*(.45+.75*a2);",
    "vec3 c=K3;",
    "c=mix(c,K1,min(b1*.85,1.));",
    "c=mix(c,K2,min(b2*.8,1.));",
    "c+=(fbm(q*4.5+vec2(-t*.4,t*.3))-.5)*.06;",
    "gl_FragColor=vec4(c,1.);}"
  ].join("\n");

  var gls = [];
  canvases.forEach(function (cv) {
    var gl = cv.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) { cv.style.display = "none"; return; }
    function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
    var pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.style.display = "none"; return; }
    gl.useProgram(pr); var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var pl = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(pl); gl.vertexAttribPointer(pl, 2, gl.FLOAT, false, 0, 0);
    var u = { R: gl.getUniformLocation(pr, "R"), T: gl.getUniformLocation(pr, "T"), P: gl.getUniformLocation(pr, "P"),
      K1: gl.getUniformLocation(pr, "K1"), K2: gl.getUniformLocation(pr, "K2"), K3: gl.getUniformLocation(pr, "K3") };
    var k = colors(cv);
    var boost=parseInt(cv.getAttribute("data-heat")||"0",10)*0.012;
    k[0]=[k[0][0]+boost,k[0][1],k[0][2]];k[1]=[k[1][0],k[1][1],k[1][2]+boost];
    gl.uniform3fv(u.K1, k[0]); gl.uniform3fv(u.K2, k[1]); gl.uniform3fv(u.K3, k[2]);
    gl.uniform2f(u.R, 1, 1);
    gls.push({ cv: cv, gl: gl, u: u, px: 0, py: 0, tx: 0, ty: 0 });
    if (reduce) draw(gls[gls.length - 1], 0);
  });

  function draw(g, t) {
    var cv = g.cv, r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.max(64, Math.round(r.width * dpr / 2)), h = Math.max(64, Math.round(r.height * dpr / 2));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; g.gl.viewport(0, 0, w, h); }
    g.px += (g.tx - g.px) * 0.05; g.py += (g.ty - g.py) * 0.05;
    g.gl.uniform2f(g.u.R, w, h); g.gl.uniform1f(g.u.T, t); g.gl.uniform2f(g.u.P, g.px, g.py);
    g.gl.drawArrays(g.gl.TRIANGLES, 0, 3);
  }
  function loop(now) {
    var t = now / 1000;
    gls.forEach(function (g) { if (!g.cv._off) draw(g, t); });
    requestAnimationFrame(loop);
  }
  if (!reduce && gls.length) requestAnimationFrame(loop);

  var hero = gls[0];
  window.addEventListener("pointermove", function (e) {
    if (!hero) return;
    hero.tx = (e.clientX / innerWidth - 0.5) * 2; hero.ty = (0.5 - e.clientY / innerHeight) * 2;
  }, { passive: true });
  document.addEventListener("visibilitychange", function () {
    gls.forEach(function (g) { g.cv._off = document.hidden; });
  });
})();
