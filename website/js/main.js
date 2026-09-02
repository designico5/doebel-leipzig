(function(){
  "use strict";
  var root=document.documentElement;
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.remove("no-js");

  var toggle=document.querySelector(".nav-toggle");
  var nav=document.getElementById("hauptnav");
  function closeNav(refocus) {
    if (!nav || !nav.classList.contains("open")) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    if (refocus) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav(true);
    });
  }

  var hero = document.querySelector(".hero");
  if (hero && !reduce) {
    for (var i = 0; i < 10; i++) {
      var particle = document.createElement("span");
      particle.className = "ember " + (i % 2 ? "snow" : "flame");
      particle.style.left = (8 + Math.random() * 70) + "%";
      particle.style.setProperty("--d", (Math.random() * 6).toFixed(2) + "s");
      particle.style.setProperty("--x", (Math.random() * 40 - 10).toFixed(0) + "px");
      hero.appendChild(particle);
    }
  }

  var steps = document.querySelectorAll(".day-step");
  var dayfill = document.getElementById("dayfill");
  function setDay(progress) {
    if (dayfill) dayfill.style.transform = "scaleX(" + progress.toFixed(3) + ")";
  }
  function reveal(element) {
    element.classList.add(element.classList.contains("reveal") ? "is-visible" : "in");
  }
  var revealers = document.querySelectorAll(".reveal,.reveal-cine,.reveal-flange");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealers.forEach(function (element) { io.observe(element); });
    var dayObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        steps.forEach(function (step) { step.classList.remove("is-active"); });
        entry.target.classList.add("is-active");
        setDay((Array.prototype.indexOf.call(steps, entry.target) + 1) / steps.length);
      });
    }, { threshold: 0.6 });
    steps.forEach(function (step) { dayObserver.observe(step); });
  } else {
    revealers.forEach(reveal);
    setDay(1);
  }
  var motionNodes = document.querySelectorAll(".hero,.tour,.statband,.cine,.emergency");
  if ("IntersectionObserver" in window && !reduce) {
    var motionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle("motion-live", entry.isIntersecting); });
    }, { rootMargin: "120px 0px", threshold: 0.01 });
    motionNodes.forEach(function (node) { motionObserver.observe(node); });
  }

  var heat = document.getElementById("heat");
  function pageProgress() {
    var page = document.documentElement;
    return Math.max(0, Math.min(1, page.scrollTop / (page.scrollHeight - page.clientHeight || 1)));
  }
  function updateHeat() {
    if (heat) heat.style.transform = "scaleY(" + (reduce ? 1 : pageProgress().toFixed(3)) + ")";
  }

  var flow = 1;
  var flowTarget = 1;
  var lastY = window.scrollY;
  var lastMove = performance.now();
  var lastFlowTime = lastMove;
  var flowFrame = 0;
  function flowTick(now) {
    if (now - lastMove > 110) flowTarget = 1;
    flow += (flowTarget - flow) * 0.18;
    if (Math.abs(flow - flowTarget) < 0.01) flow = flowTarget;
    root.style.setProperty("--flow", flow.toFixed(2));
    root._thermalFlow = flow;
    if (flow !== 1 || flowTarget !== 1) flowFrame = requestAnimationFrame(flowTick);
    else flowFrame = 0;
  }
  function measureFlow() {
    updateHeat();
    if (reduce) return;
    var nextY = window.scrollY;
    var delta = Math.abs(nextY - lastY);
    var now = performance.now();
    var elapsed = Math.max(16, Math.min(80, now - lastFlowTime));
    lastY = nextY;
    lastMove = lastFlowTime = now;
    flowTarget = Math.max(1, Math.min(2.4, 1 + delta / elapsed * .75));
    if (!flowFrame) flowFrame = requestAnimationFrame(flowTick);
  }
  document.addEventListener("scroll", measureFlow, { passive: true });
  updateHeat();

  var header = document.querySelector(".site-header");
  var zones = document.querySelectorAll(".hero,.trust,.statband,.sub-hero,.cine,.emergency,.site-footer");
  var flipFrame = 0;
  function flipHeader() {
    flipFrame = 0;
    if (!header) return;
    var line = header.getBoundingClientRect().bottom - 6;
    var dark = false;
    zones.forEach(function (zone) {
      var rect = zone.getBoundingClientRect();
      if (rect.top <= line && rect.bottom >= line) dark = true;
    });
    header.classList.toggle("over-dark", dark);
  }
  function queueFlip() {
    if (!flipFrame) flipFrame = requestAnimationFrame(flipHeader);
  }
  document.addEventListener("scroll", queueFlip, { passive: true });
  window.addEventListener("resize", queueFlip, { passive: true });
  flipHeader();

  var tour = document.getElementById("tour");
  if (tour) {
    var scene = tour.querySelector(".tour-scene");
    var route = document.getElementById("route");
    var ant = document.getElementById("ant");
    var sceneArt = scene.querySelector("svg");
    var routeLength = route ? route.getTotalLength() : 0;
    var activeStop = -2;
    var stops = [
      ["st1", 0.02], ["st2", 0.13], ["st3", 0.29], ["st4", 0.47],
      ["st5", 0.67], ["st6", 0.79], ["st7", 0.93]
    ].map(function (item) {
      return { el: document.getElementById(item[0]), li: document.querySelector('[data-st="' + item[0] + '"]'), t: item[1] };
    }).filter(function (item) { return item.el && item.li; });
    function setTour(progress) {
      if (ant && routeLength) {
        var distance = routeLength * progress;
        var point = route.getPointAtLength(distance);
        var before = route.getPointAtLength(Math.max(0, distance - 5));
        var after = route.getPointAtLength(Math.min(routeLength, distance + 5));
        var angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
        ant.setAttribute("transform", "translate(" + point.x.toFixed(1) + " " + point.y.toFixed(1) + ") rotate(" + angle.toFixed(1) + ")");
      }
      if (sceneArt) {
        var amp = innerWidth < 640 ? .5 : 1;
        var scale = 1 + .028 * (1 - Math.abs(2 * progress - 1));
        sceneArt.style.transform = reduce ? "none" : "translate3d(" + ((8 - 16 * progress) * amp).toFixed(1) + "px," + ((-5 + 10 * progress) * amp).toFixed(1) + "px,0) scale(" + scale.toFixed(3) + ")";
      }
      scene.classList.toggle("ant-cool", !reduce && progress >= 0.62 && progress < 0.79);
      var now = -1;
      stops.forEach(function (stop, index) { if (progress >= stop.t) now = index; });
      stops.forEach(function (stop, index) {
        var on = progress >= stop.t;
        stop.el.classList.toggle("on", on);
        stop.li.classList.toggle("lit", on);
        if (now !== activeStop) {
          stop.li.classList.toggle("now", index === now);
          if (index === now) stop.li.firstElementChild.setAttribute("aria-current", "step");
          else stop.li.firstElementChild.removeAttribute("aria-current");
        }
      });
      activeStop = now;
    }
    function tourProgress() {
      if (reduce) return setTour(1);
      var rect = tour.getBoundingClientRect();
      var progress = Math.max(0, Math.min(1, (innerHeight * 0.82 - rect.top) / (rect.height * 0.72)));
      setTour(progress);
    }
    document.addEventListener("scroll", tourProgress, { passive: true });
    tourProgress();
  }
})();
