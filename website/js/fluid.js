(function () {
  "use strict";
  var canvases = Array.prototype.slice.call(document.querySelectorAll("canvas.fluid"));
  if (!canvases.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function clamp(value) { return Math.max(0, Math.min(1, value)); }
  function colors(canvas) {
    function get(name, fallback) {
      var value = canvas.getAttribute(name);
      return value ? value.split(",").map(parseFloat) : fallback;
    }
    return [get("data-k1", [.84, .16, .16]), get("data-k2", [.13, .36, .95]), get("data-k3", [.02, .08, .16])];
  }

  var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FS = [
    "precision mediump float;uniform vec2 R;uniform float T;uniform float H;uniform vec2 P;uniform vec3 K1,K2,K3;",
    "float h(vec2 x){return fract(sin(dot(x,vec2(127.1,311.7)))*43758.5453);}",
    "float n(vec2 x){vec2 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
    "float fbm(vec2 x){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(x);x=x*2.4+vec2(9.2,3.7);a*=.5;}return v;}",
    "void main(){vec2 uv=gl_FragCoord.xy/R.xy;vec2 q=uv*vec2(R.x/R.y,1.);float t=T*.06;vec2 w=P*.18;",
    "float a1=fbm(q*1.6+vec2(t,-t*.7)+w);float a2=fbm(q*2.1-vec2(t*.8,t*.6)+w*1.4);",
    "float d1=length(q-vec2(1.9+.7*a1*sin(t),1.05+.8*a1*cos(t*.8)));float d2=length(q-vec2(.45+.8*a2*cos(t*.6),2.9-.9*a2*sin(t*.7)));",
    "float b1=smoothstep(1.15,.15,d1)*(.45+.75*a1)*(.25+.75*H);float b2=smoothstep(1.25,.1,d2)*(.45+.75*a2)*(.25+.75*(1.-H));",
    "vec3 c=mix(K3,K1,min(b1*.85,1.));c=mix(c,K2,min(b2*.8,1.));c+=(fbm(q*4.5+vec2(-t*.4,t*.3))-.5)*.06;gl_FragColor=vec4(c,1.);}"
  ].join("\n");

  var gls = [];
  function compile(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }
  canvases.forEach(function (canvas) {
    var gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) { canvas.style.display = "none"; return; }
    var program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { canvas.style.display = "none"; return; }
    gl.useProgram(program);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    var uniform = {
      R: gl.getUniformLocation(program, "R"), T: gl.getUniformLocation(program, "T"),
      H: gl.getUniformLocation(program, "H"), P: gl.getUniformLocation(program, "P"),
      K1: gl.getUniformLocation(program, "K1"), K2: gl.getUniformLocation(program, "K2"), K3: gl.getUniformLocation(program, "K3")
    };
    var palette = colors(canvas);
    var heat = parseInt(canvas.getAttribute("data-heat") || "0", 10);
    palette[0][0] = clamp(palette[0][0] + heat * .012);
    palette[1][2] = clamp(palette[1][2] - heat * .006);
    gl.uniform3fv(uniform.K1, palette[0]);
    gl.uniform3fv(uniform.K2, palette[1]);
    gl.uniform3fv(uniform.K3, palette[2]);
    gls.push({ cv: canvas, gl: gl, u: uniform, px: 0, py: 0, tx: 0, ty: 0, vx: 0, vy: 0, h: .5, th: .5, visible: false });
  });

  function draw(state, time) {
    var canvas = state.cv;
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var width = Math.max(64, Math.round(rect.width * dpr / 2));
    var height = Math.max(64, Math.round(rect.height * dpr / 2));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width; canvas.height = height;
      state.gl.viewport(0, 0, width, height);
    }
    state.vx = (state.vx + (state.tx - state.px) * .018) * .86;
    state.vy = (state.vy + (state.ty - state.py) * .018) * .86;
    state.px += state.vx;
    state.py += state.vy;
    state.h += (state.th - state.h) * .05;
    state.gl.uniform2f(state.u.R, width, height);
    state.gl.uniform1f(state.u.T, time);
    state.gl.uniform1f(state.u.H, clamp(state.h));
    state.gl.uniform2f(state.u.P, state.px, state.py);
    state.gl.drawArrays(state.gl.TRIANGLES, 0, 3);
  }

  if (reduce) {
    gls.forEach(function (state) { draw(state, 0); });
    return;
  }

  var frame = 0;
  var last = 0;
  var phase = 0;
  var kick = 0;
  var activeUntil = performance.now() + 2800;
  function loop(now) {
    var visible = gls.filter(function (state) { return state.visible; });
    if (!visible.length) { stop(); return; }
    var delta = last ? Math.min((now - last) / 1000, .05) : 0;
    last = now;
    var root = document.documentElement;
    var velocity = root._thermalFlow || parseFloat(getComputedStyle(root).getPropertyValue("--flow")) || 1;
    phase += delta * (.5 + .5 * velocity + kick * 4);
    kick = Math.max(0, kick - delta * 1.8);
    visible.forEach(function (state) { draw(state, phase); });
    if (now < activeUntil || velocity > 1.01 || kick > .001) frame = requestAnimationFrame(loop);
    else { frame = 0; last = 0; }
  }
  function start() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(loop);
  }
  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0;
  }
  function wake(duration) {
    activeUntil = Math.max(activeUntil, performance.now() + duration);
    start();
  }
  window.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch") return;
    var heatBalance = clamp(1 - event.clientX / innerWidth);
    gls.forEach(function (state) {
      state.th = heatBalance;
      state.tx = (event.clientX / innerWidth - .5) * 2;
      state.ty = (.5 - event.clientY / innerHeight) * 2;
    });
    wake(1200);
  }, { passive: true });
  window.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "touch") return;
    kick = .28;
    gls.forEach(function (state) {
      state.vx += (state.tx - state.px) * .055;
      state.vy += (state.ty - state.py) * .055;
    });
    wake(1400);
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", function () {
    gls.forEach(function (state) { state.tx = 0; state.ty = 0; state.th = .5; });
    wake(1200);
  }, { passive: true });
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var state = gls.find(function (item) { return item.cv === entry.target; });
        if (state) state.visible = entry.isIntersecting;
      });
      if (gls.some(function (state) { return state.visible; })) wake(1800); else stop();
    }, { rootMargin: "160px 0px", threshold: 0 });
    gls.forEach(function (state) { observer.observe(state.cv); });
  } else {
    gls.forEach(function (state) { state.visible = true; });
  }
  document.addEventListener("scroll", function () { wake(900); }, { passive: true });
  window.addEventListener("resize", function () { wake(900); }, { passive: true });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else wake(1200);
  });
  wake(2800);
})();
