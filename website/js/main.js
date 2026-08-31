(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile-Navigation: Toggle, Escape, Fokus-Rückgabe */
  var toggle = document.querySelector(".nav-toggle"), nav = document.getElementById("hauptnav");
  function closeNav(focusBack) {
    if (!nav || !nav.classList.contains("open")) return;
    nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
    if (focusBack) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(true); });
  }

  /* Glut- und Schnee-Partikel im Hero */
  var hero = document.querySelector(".hero");
  if (hero && !reduce) {
    for (var i = 0; i < 10; i++) {
      var s = document.createElement("span");
      s.className = "ember " + (i % 2 ? "snow" : "flame");
      s.style.left = (8 + Math.random() * 70) + "%";
      s.style.setProperty("--d", (Math.random() * 6).toFixed(2) + "s");
      s.style.setProperty("--x", (Math.random() * 40 - 10).toFixed(0) + "px");
      hero.appendChild(s);
    }
  }

  /* Reveal + aktive Tagesetappe + Fortschrittsbalken */
  var steps = document.querySelectorAll(".day-step"), dayfill = document.getElementById("dayfill");
  function setDay(p) { if (dayfill) dayfill.style.width = Math.round(p * 100) + "%"; }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("is-visible"); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    var io2 = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting) {
          steps.forEach(function (s) { s.classList.remove("is-active"); });
          x.target.classList.add("is-active");
          var idx = Array.prototype.indexOf.call(steps, x.target);
          setDay((idx + 1) / steps.length);
        }
      });
    }, { threshold: 0.6 });
    steps.forEach(function (el) { io2.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    setDay(0);
  }

  /* Wärmestrom-Faden (Fallback für Scroll-Timeline) */
  var heat = document.getElementById("heat");
  if (heat && !CSS.supports("animation-timeline", "scroll()")) {
    var upd = function () {
      var h = document.documentElement, p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      heat.style.setProperty("--fill-num", p.toFixed(3));
      heat.style.setProperty("--fill", (p * 100).toFixed(1) + "%");
    };
    document.addEventListener("scroll", upd, { passive: true }); upd();
  }

  /* Kennzahlen-Tick */
  if (!reduce && "IntersectionObserver" in window) {
    var fmt = function (el, v) {
      el.textContent = v.toLocaleString("de-DE") + (el.getAttribute("data-suffix") || "");
    };
    var cio = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return; cio.unobserve(x.target);
        var el = x.target.querySelector("b[data-count]"); if (!el) return;
        var target = +el.getAttribute("data-count"), t0 = performance.now(), dur = 1300;
        var step = function (now) {
          var p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
          fmt(el, Math.round(target * e)); if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".stat").forEach(function (el) { cio.observe(el); });
  }

  /* Scroll-Tiefen-Hilferuf: 1× pro Sitzung ab 65 % */
  var banner = document.querySelector(".sbanner");
  if (banner && !sessionStorage.getItem("sb_seen")) {
    var fired = false;
    var onScroll = function () {
      if (fired) return;
      var h = document.documentElement;
      if (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) > 0.65) {
        fired = true; banner.hidden = false; requestAnimationFrame(function () { banner.classList.add("show"); banner.focus(); });
        sessionStorage.setItem("sb_seen", "1"); document.removeEventListener("scroll", onScroll);
      }
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    banner.querySelector("[data-close]").addEventListener("click", function () {
      banner.classList.remove("show"); setTimeout(function () { banner.hidden = true; }, 350);
    });
  }

  /* Header-Inversion über dunklen Zonen */
  var header = document.querySelector(".site-header");
  var zones = document.querySelectorAll(".hero,.trust,.statband,.sub-hero");
  if (header && zones.length) {
    var flip = function () {
      var line = header.getBoundingClientRect().bottom - 6, dark = false;
      zones.forEach(function (z) { var r = z.getBoundingClientRect(); if (r.top <= line && r.bottom >= line) dark = true; });
      header.classList.toggle("over-dark", dark);
    };
    document.addEventListener("scroll", flip, { passive: true });
    flip();
  }

  var y = document.getElementById("year"); if (y) y.textContent = String(new Date().getFullYear());

  /* Ant-Man-Tour: Mini-Monteur wandert mit Scroll-Tiefe, Stationen zünden */
  var tour = document.getElementById("tour");
  if (tour) {
    var scene = tour.querySelector(".tour-scene svg");
    var stops = [
      { el: document.getElementById("st1"), li: document.querySelector('[data-st="st1"]'), t: 0.02 },
      { el: document.getElementById("st2"), li: document.querySelector('[data-st="st2"]'), t: 0.13 },
      { el: document.getElementById("st3"), li: document.querySelector('[data-st="st3"]'), t: 0.29 },
      { el: document.getElementById("st4"), li: document.querySelector('[data-st="st4"]'), t: 0.47 },
      { el: document.getElementById("st5"), li: document.querySelector('[data-st="st5"]'), t: 0.67 },
      { el: document.getElementById("st6"), li: document.querySelector('[data-st="st6"]'), t: 0.93 },
      { el: document.getElementById("st7"), li: document.querySelector('[data-st="st7"]'), t: 0.79 }
    ].filter(function (s) { return s.el && s.li; });
    var lightAll = function () { stops.forEach(function (s) { s.el.classList.add("on"); s.li.classList.add("lit"); }); };
    if (reduce) { scene.style.setProperty("--t", "0.99"); lightAll(); }
    else {
      var lastY = window.scrollY, vel = 1;
      var tourP = function () {
        var dy = Math.abs(window.scrollY - lastY); lastY = window.scrollY;
        vel = vel * 0.82 + Math.min(2.6, 1 + dy / 28) * 0.18;
        scene.style.setProperty("--ign", vel.toFixed(2));
        var r = tour.getBoundingClientRect(), vh = window.innerHeight;
        var p = Math.max(0, Math.min(1, (vh * 0.82 - r.top) / (r.height * 0.72)));
        scene.style.setProperty("--t", p.toFixed(3));
        stops.forEach(function (s) { var on = p >= s.t; s.el.classList.toggle("on", on); s.li.classList.toggle("lit", on); });
      };
      document.addEventListener("scroll", tourP, { passive: true });
      tourP();
    }
  }
})();
