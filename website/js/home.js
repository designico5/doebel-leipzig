import * as THREE from "./vendor/three.module.min.js";

(function () {
  "use strict";

  const html = document.documentElement;
  const root = document.querySelector("[data-sc-mode='worldflight']");
  const stage = document.querySelector("[data-sc-world]");
  const canvas = document.getElementById("system-canvas");
  const stories = Array.from(document.querySelectorAll("[data-story-copy]"));
  const photoSegments = Array.from(document.querySelectorAll("[data-sc-segment]"));
  const routeLinks = Array.from(document.querySelectorAll(".route-rail [data-jump]"));
  const jumpLinks = Array.from(document.querySelectorAll("[data-jump]"));
  const status = document.querySelector(".chrome-status b");
  const readout = document.querySelector(".timeline-readout span");
  const calloutEls = Object.fromEntries(Array.from(document.querySelectorAll("[data-anchor]")).map((el) => [el.dataset.anchor, el]));
  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const forcedQuery = matchMedia("(forced-colors: active)");
  const coarseQuery = matchMedia("(pointer: coarse)");
  const narrowQuery = matchMedia("(max-width: 700px)");
  const labels = ["System", "Kälte & Luft", "Bestand", "Übergang", "Leistungen", "Meister", "Notdienst", "Kontakt"];

  if (!root || !stage || !canvas || !window.ScrollCraft) return;
  html.classList.remove("no-js");
  html.classList.add("experience-ready");
  let engineMounted = false;
  function mountEngine() {
    if (!engineMounted && window.ScrollCraft) {
      window.ScrollCraft.mount(document);
      engineMounted = true;
    }
  }
  if (!motionQuery.matches && !forcedQuery.matches) mountEngine();

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = (v) => {
    v = clamp(v);
    return v * v * (3 - 2 * v);
  };
  const ramp = (p, a, b) => smooth((p - a) / Math.max(.0001, b - a));
  const band = (p, a, b, feather = .18) => {
    const span = b - a;
    return Math.min(ramp(p, a, a + span * feather), 1 - ramp(p, b - span * feather, b));
  };

  const storyData = stories.map((el, index) => {
    const values = (el.dataset.storyRange || "0 1").split(/\s+/).map(Number);
    const focusables = Array.from(el.querySelectorAll("a[href],button,input,select,textarea,summary,[tabindex]")).map((node) => ({
      node,
      tabindex: node.getAttribute("tabindex")
    }));
    return { el, index, from: values[0] || 0, to: Number.isFinite(values[1]) ? values[1] : 1, inactive: null, focusables };
  });
  const photoStarts = [0, .105, .22, .335, .535, .66, .75, .84];

  let motionReduced = motionQuery.matches;
  let forcedColors = forcedQuery.matches;
  let reduced = motionReduced || forcedColors;
  let coarse = coarseQuery.matches;
  let narrow = narrowQuery.matches;
  let scrollRange = 1;
  let lastY = scrollY;
  let lastMeasure = performance.now();
  let activeIndex = -1;
  let running = !document.hidden;
  let raf = 0;
  let lastFrame = 0;
  const target = { p: 0, velocity: 0, x: .5, y: .5 };
  const state = { p: 0, velocity: 0, x: .5, y: .5 };

  function measure() {
    const now = performance.now();
    const dt = Math.max(16, now - lastMeasure);
    const dy = Math.abs(scrollY - lastY);
    scrollRange = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    target.p = clamp(scrollY / scrollRange);
    target.velocity = reduced ? 0 : clamp(dy / dt / 2.2);
    lastY = scrollY;
    lastMeasure = now;
    requestFrame();
  }

  function storyVisibility(item, p) {
    const span = Math.max(.001, item.to - item.from);
    const local = clamp((p - item.from) / span);
    const fade = .22;
    const enter = item.from === 0 ? 1 : smooth(local / fade);
    const exit = item.to === 1 ? 1 : smooth((1 - local) / fade);
    return { local, enter, vis: p < item.from || p > item.to ? 0 : Math.min(enter, exit) };
  }

  function setStoryAvailability(item, inactive) {
    if (item.inactive === inactive) return;
    item.inactive = inactive;
    item.el.style.pointerEvents = inactive ? "none" : "auto";
    item.el.inert = inactive;
    if (inactive) item.el.setAttribute("aria-hidden", "true");
    else item.el.removeAttribute("aria-hidden");
    item.focusables.forEach(({ node, tabindex }) => {
      if (inactive) node.setAttribute("tabindex", "-1");
      else if (tabindex === null) node.removeAttribute("tabindex");
      else node.setAttribute("tabindex", tabindex);
    });
  }

  function updatePhotoSegments(p, isStatic = false) {
    const seam = .026;
    photoSegments.forEach((segment, index) => {
      let opacity = index === 0 ? 1 : ramp(p, photoStarts[index] - seam, photoStarts[index] + seam);
      if (index < photoSegments.length - 1) opacity *= 1 - ramp(p, photoStarts[index + 1] - seam, photoStarts[index + 1] + seam);
      if (isStatic) opacity = index === 0 ? 1 : 0;
      segment.style.setProperty("--photo-opacity", opacity.toFixed(4));
      segment.style.setProperty("--photo-visibility", opacity > .002 ? "visible" : "hidden");
      segment.style.setProperty("--photo-scale", (1.035 + p * .075 + index * .003).toFixed(4));
      segment.style.setProperty("z-index", String(100 + index), "important");
    });
  }

  function updateDOM(p) {
    if (reduced) {
      storyData.forEach((item) => {
        item.el.style.opacity = "1";
        item.el.style.transform = "none";
        item.el.style.setProperty("--story-in", "1");
        item.el.style.setProperty("--story-x", "0vw");
        item.el.style.setProperty("--story-x-right", "0vw");
        item.el.style.setProperty("--story-y", "0rem");
        item.el.style.setProperty("--story-tilt", "0deg");
        item.el.style.setProperty("--story-blur", "0px");
        setStoryAvailability(item, false);
      });
      updatePhotoSegments(0, true);
      html.style.setProperty("--timeline", "0");
      html.style.setProperty("--timeline-size", "0%");
      html.style.setProperty("--timeline-scale", ".18");
      html.style.setProperty("--velocity", "0");
      html.style.setProperty("--peak", "0");
      html.style.setProperty("--alarm", "0");
      html.style.setProperty("--finale", "1");
      html.style.setProperty("--pointer-x-percent", "50%");
      html.style.setProperty("--pointer-y-percent", "50%");
      html.style.setProperty("--depth-opacity", ".15");
      html.style.setProperty("--thermal-opacity", ".18");
      html.style.setProperty("--cold-x", "0vw");
      html.style.setProperty("--cold-y", "0vh");
      html.style.setProperty("--warm-x", "0vw");
      html.style.setProperty("--warm-y", "0vh");
      html.style.setProperty("--close-y", "0%");
      html.style.setProperty("--close-x", "0%");
      stage.setAttribute("data-sc-verify-state", "reduced-static");
      return;
    }
    let best = 0;
    let bestVis = -1;
    storyData.forEach((item) => {
      const view = storyVisibility(item, p);
      const inverse = 1 - view.enter;
      item.el.style.opacity = view.vis.toFixed(3);
      item.el.style.setProperty("--story-in", view.enter.toFixed(4));
      item.el.style.setProperty("--story-x", (-2.4 * inverse).toFixed(3) + "vw");
      item.el.style.setProperty("--story-x-right", (2.4 * inverse).toFixed(3) + "vw");
      item.el.style.setProperty("--story-y", (1.4 * inverse).toFixed(3) + "rem");
      item.el.style.setProperty("--story-tilt", (8 * inverse).toFixed(2) + "deg");
      item.el.style.setProperty("--story-blur", (7 * inverse).toFixed(2) + "px");
      item.el.style.setProperty("--copy-y", ((.5 - view.local) * 3.5).toFixed(2) + "vh");
      const inactive = view.vis <= .52;
      setStoryAvailability(item, inactive);
      if (view.vis > bestVis) {
        bestVis = view.vis;
        best = item.index;
      }
    });

    if (best !== activeIndex) {
      activeIndex = best;
      routeLinks.forEach((link, index) => {
        if (index === best) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      if (status) status.textContent = labels[best];
      if (readout) readout.textContent = labels[best];
    }

    const peak = band(p, .34, .61, .2);
    const alarm = band(p, .75, .915, .2);
    const finale = ramp(p, .84, .98);
    html.style.setProperty("--timeline", p.toFixed(5));
    html.style.setProperty("--timeline-size", (p * 100).toFixed(3) + "%");
    html.style.setProperty("--timeline-scale", (.18 + p * .82).toFixed(4));
    html.style.setProperty("--velocity", state.velocity.toFixed(4));
    html.style.setProperty("--peak", peak.toFixed(4));
    html.style.setProperty("--alarm", alarm.toFixed(4));
    html.style.setProperty("--finale", finale.toFixed(4));
    html.style.setProperty("--pointer-x", state.x.toFixed(4));
    html.style.setProperty("--pointer-y", state.y.toFixed(4));
    html.style.setProperty("--pointer-x-percent", (state.x * 100).toFixed(2) + "%");
    html.style.setProperty("--pointer-y-percent", (state.y * 100).toFixed(2) + "%");
    html.style.setProperty("--depth-opacity", (.15 + peak * .18).toFixed(4));
    html.style.setProperty("--thermal-opacity", (.18 + peak * .27).toFixed(4));
    html.style.setProperty("--cold-x", (p * 18).toFixed(3) + "vw");
    html.style.setProperty("--cold-y", (p * 8).toFixed(3) + "vh");
    html.style.setProperty("--warm-x", (-p * 18).toFixed(3) + "vw");
    html.style.setProperty("--warm-y", (-p * 10).toFixed(3) + "vh");
    html.style.setProperty("--close-y", (38 * (1 - finale)).toFixed(2) + "%");
    html.style.setProperty("--close-x", (18 * (1 - finale)).toFixed(2) + "%");
    updatePhotoSegments(p);
    stage.setAttribute("data-sc-verify-state", "timeline-" + Math.round(p * 1000));
  }

  jumpLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const p = clamp(Number(link.dataset.jump) || 0);
      scrollTo({ top: p * scrollRange, behavior: reduced ? "auto" : "smooth" });
      const id = link.getAttribute("href");
      if (id && id.startsWith("#")) history.replaceState(null, "", id);
    });
  });

  addEventListener("scroll", measure, { passive: true });
  addEventListener("resize", () => {
    coarse = coarseQuery.matches;
    narrow = narrowQuery.matches;
    resizeWorld();
    measure();
  }, { passive: true });
  addEventListener("pointermove", (event) => {
    if (reduced || coarse) return;
    target.x = event.clientX / Math.max(1, innerWidth);
    target.y = event.clientY / Math.max(1, innerHeight);
    requestFrame();
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) requestFrame();
    else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });

  let world = null;
  const tempPoint = new THREE.Vector3();
  const tempProjected = new THREE.Vector3();
  const tempMatrix = new THREE.Matrix4();
  const tempScale = new THREE.Vector3();
  const tempQuat = new THREE.Quaternion();
  const tempColor = new THREE.Color();

  function material(color, emissive, metalness = .72, roughness = .3) {
    return new THREE.MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity: .38,
      metalness,
      roughness,
      transparent: true,
      opacity: 1
    });
  }

  function pipe(curve, radius, mat, tubularSegments) {
    const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, coarse ? 6 : 9, false);
    return new THREE.Mesh(geometry, mat);
  }

  function makeFlow(curve, count, color, size) {
    const positions = new Float32Array(count * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointsMaterial = new THREE.PointsMaterial({
      color,
      size,
      sizeAttenuation: true,
      transparent: true,
      opacity: .8,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geometry, pointsMaterial);
    points.frustumCulled = false;
    return { points, geometry, positions, material: pointsMaterial, curve, count };
  }

  function createWorld() {
    try {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !coarse,
        depth: true,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      });
      renderer.setClearColor(0x050d16, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.shadowMap.enabled = false;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050d16, .058);
      const camera = new THREE.PerspectiveCamera(42, 1, .1, 80);
      const rig = new THREE.Group();
      scene.add(rig);

      const hemi = new THREE.HemisphereLight(0xbedcff, 0x160b08, .72);
      const coldLight = new THREE.PointLight(0x55aaff, 22, 18, 2);
      const warmLight = new THREE.PointLight(0xff6b3e, 25, 18, 2);
      const whiteLight = new THREE.DirectionalLight(0xf4fbff, 2.2);
      const alarmLight = new THREE.PointLight(0xff2518, 0, 13, 2);
      coldLight.position.set(-4, 2.5, 3);
      warmLight.position.set(4, -1.5, 3);
      whiteLight.position.set(0, 5, 5);
      alarmLight.position.set(-2.7, 1.1, 1.8);
      scene.add(hemi, coldLight, warmLight, whiteLight, alarmLight);

      const coldMat = material(0x7dc8ff, 0x0d61c5, .82, .2);
      const warmMat = material(0xe58a52, 0xa92c16, .78, .24);
      const airMat = material(0xd4e4ea, 0x5f8291, .35, .4);
      airMat.opacity = .66;
      const steelMat = material(0xb9c3c8, 0x202d34, .9, .23);
      const plateMat = material(0xaeb9bd, 0x27333a, .9, .2);
      plateMat.vertexColors = true;
      const darkMat = material(0x202d34, 0x071019, .92, .28);

      const coldCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.7, 1.4, -.8), new THREE.Vector3(-3.7, 1.1, .5),
        new THREE.Vector3(-2.8, 2, .9), new THREE.Vector3(-1.8, 1.15, .25),
        new THREE.Vector3(-1.1, .7, .05), new THREE.Vector3(-.62, .58, 0)
      ]);
      const warmCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(.62, -.58, 0), new THREE.Vector3(1.25, -.82, .15),
        new THREE.Vector3(2.15, -1.65, .78), new THREE.Vector3(3.25, -1.15, .55),
        new THREE.Vector3(4.55, -.75, -.75)
      ]);
      const airCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.5, 2.7, -1.1), new THREE.Vector3(-2.8, 2.25, -.3),
        new THREE.Vector3(-.9, 2.05, .18), new THREE.Vector3(1.3, 1.9, .15),
        new THREE.Vector3(4.4, 2.45, -1)
      ]);

      const coldPipe = pipe(coldCurve, .105, coldMat, coarse ? 52 : 82);
      const warmPipe = pipe(warmCurve, .125, warmMat, coarse ? 52 : 82);
      const airPipe = pipe(airCurve, .035, airMat, coarse ? 45 : 70);
      rig.add(coldPipe, warmPipe, airPipe);

      const floorPoints = [];
      for (let row = 0; row < 7; row++) {
        const z = -2.6 + row * .72;
        if (row % 2 === 0) {
          floorPoints.push(new THREE.Vector3(-3.15, -2.2, z), new THREE.Vector3(3.15, -2.2, z));
        } else {
          floorPoints.push(new THREE.Vector3(3.15, -2.2, z), new THREE.Vector3(-3.15, -2.2, z));
        }
      }
      const floorCurve = new THREE.CatmullRomCurve3(floorPoints, false, "catmullrom", .08);
      const floorPipe = pipe(floorCurve, .045, warmMat.clone(), coarse ? 90 : 145);
      floorPipe.material.opacity = 0;
      rig.add(floorPipe);

      const plateCount = coarse ? 14 : 18;
      const plateGeometry = new THREE.BoxGeometry(.075, 2.65, 1.72);
      const plates = new THREE.InstancedMesh(plateGeometry, plateMat, plateCount);
      plates.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      for (let i = 0; i < plateCount; i++) {
        const tint = i % 2 ? new THREE.Color(0x96a5aa) : new THREE.Color(0xc4cdcf);
        plates.setColorAt(i, tint);
      }
      if (plates.instanceColor) plates.instanceColor.needsUpdate = true;
      rig.add(plates);

      const shellLines = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4, 3.05, 2.05)),
        new THREE.LineBasicMaterial({ color: 0xe8f4f6, transparent: true, opacity: .36 })
      );
      rig.add(shellLines);

      const leftManifold = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, 3.15, coarse ? 10 : 16), steelMat);
      const rightManifold = leftManifold.clone();
      leftManifold.position.x = -1.42;
      rightManifold.position.x = 1.42;
      rig.add(leftManifold, rightManifold);

      const core = new THREE.Mesh(new THREE.CylinderGeometry(.44, .44, 2.35, coarse ? 16 : 24), darkMat);
      core.rotation.z = Math.PI / 2;
      rig.add(core);

      const nodeGeometry = new THREE.IcosahedronGeometry(.22, 1);
      const nodeMaterial = material(0xd9e2e4, 0x263b48, .7, .27);
      const serviceNodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, 6);
      serviceNodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      rig.add(serviceNodes);
      const connectorPositions = new Float32Array(6 * 2 * 3);
      const connectorGeometry = new THREE.BufferGeometry();
      connectorGeometry.setAttribute("position", new THREE.BufferAttribute(connectorPositions, 3));
      const connectors = new THREE.LineSegments(connectorGeometry, new THREE.LineBasicMaterial({ color: 0x9db3bd, transparent: true, opacity: 0 }));
      rig.add(connectors);

      const frameMaterial = new THREE.LineBasicMaterial({ color: 0xadc0ca, transparent: true, opacity: 0 });
      const building = new THREE.Group();
      [
        [7.2, 5.3, 4.4, 0, .1, -1.8],
        [5.2, 3.6, 3.2, -.8, .3, -1.1],
        [3.5, 2.5, 2.2, 1.35, -.35, -.4]
      ].forEach((v) => {
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(v[0], v[1], v[2])), frameMaterial);
        edges.position.set(v[3], v[4], v[5]);
        building.add(edges);
      });
      rig.add(building);

      const haloMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const halo = new THREE.Mesh(new THREE.TorusGeometry(2.15, .018, 8, coarse ? 48 : 84), haloMaterial);
      halo.rotation.x = Math.PI / 2;
      rig.add(halo);

      const sensorMaterial = new THREE.MeshBasicMaterial({ color: 0xff3b26, transparent: true, opacity: 0 });
      const sensor = new THREE.Mesh(new THREE.SphereGeometry(.13, 14, 10), sensorMaterial);
      rig.add(sensor);

      const coldFlow = makeFlow(coldCurve, coarse ? 28 : 64, 0x8bd4ff, coarse ? .09 : .075);
      const warmFlow = makeFlow(warmCurve, coarse ? 28 : 64, 0xff8c5b, coarse ? .095 : .08);
      const airFlow = makeFlow(airCurve, coarse ? 18 : 42, 0xe1f1f7, coarse ? .07 : .055);
      rig.add(coldFlow.points, warmFlow.points, airFlow.points);

      const dustCount = coarse ? 24 : 58;
      const dustPositions = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount; i++) {
        dustPositions[i * 3] = (Math.random() - .5) * 12;
        dustPositions[i * 3 + 1] = (Math.random() - .5) * 7;
        dustPositions[i * 3 + 2] = (Math.random() - .5) * 7;
      }
      const dustGeometry = new THREE.BufferGeometry();
      dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
      const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xc9d7de, size: .025, transparent: true, opacity: .25, depthWrite: false }));
      scene.add(dust);

      const cameraKeys = [
        { t: 0, p: [0, .35, 10.4], l: [0, 0, 0], f: 43 },
        { t: .14, p: [-2.9, 1.15, 7.2], l: [-1.45, .72, 0], f: 35 },
        { t: .285, p: [-.7, 3.25, 6.3], l: [0, -.35, -.5], f: 47 },
        { t: .43, p: [.25, .22, 4.15], l: [0, 0, 0], f: 30 },
        { t: .56, p: [1.65, .5, 4.8], l: [0, 0, 0], f: 34 },
        { t: .68, p: [3.6, 1.6, 7.1], l: [.25, 0, 0], f: 45 },
        { t: .79, p: [-3.4, .7, 6], l: [-1.4, .5, 0], f: 39 },
        { t: .87, p: [-1.9, .35, 4.45], l: [-2.35, .75, .15], f: 35 },
        { t: 1, p: [0, .5, 10.8], l: [0, 0, 0], f: 42 }
      ];

      const anchorData = {
        cold: { point: new THREE.Vector3(-2.35, 1.55, .4), from: .09, to: .31 },
        core: { point: new THREE.Vector3(0, .45, .95), from: .34, to: .63 },
        warm: { point: new THREE.Vector3(2.15, -1.05, .7), from: .39, to: .64 },
        air: { point: new THREE.Vector3(1.3, 2.1, .1), from: .1, to: .3 }
      };

      const result = {
        renderer, scene, camera, rig, hemi, coldLight, warmLight, whiteLight, alarmLight,
        coldMat, warmMat, airMat, steelMat, plateMat, darkMat, coldCurve, warmCurve, airCurve,
        coldPipe, warmPipe, airPipe, floorPipe, plates, plateCount, shellLines, leftManifold,
        rightManifold, core, serviceNodes, nodeMaterial, connectors, connectorPositions,
        connectorGeometry, frameMaterial, building, halo, haloMaterial, sensor, sensorMaterial,
        coldFlow, warmFlow, airFlow, dust, cameraKeys, anchorData, ready: false
      };
      resizeWorld(result);
      return result;
    } catch (error) {
      html.classList.add("no-webgl");
      console.warn("[Döbel] Realtime scene unavailable; photographic fallback active.", error);
      return null;
    }
  }

  function resizeWorld(candidate = world) {
    if (!candidate || !candidate.renderer) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(devicePixelRatio || 1, coarse ? 1.1 : 1.5);
    candidate.renderer.setPixelRatio(dpr);
    candidate.renderer.setSize(width, height, false);
    candidate.camera.aspect = width / height;
    candidate.camera.updateProjectionMatrix();
  }

  function disposeWorld(candidate) {
    if (!candidate) return;
    const geometries = new Set();
    const materials = new Set();
    candidate.scene.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      const source = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
      source.forEach((entry) => materials.add(entry));
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((entry) => entry.dispose());
    candidate.renderer.dispose();
  }

  function sampleCamera(cameraKeys, p, camera) {
    let a = cameraKeys[0];
    let b = cameraKeys[cameraKeys.length - 1];
    for (let i = 0; i < cameraKeys.length - 1; i++) {
      if (p >= cameraKeys[i].t && p <= cameraKeys[i + 1].t) {
        a = cameraKeys[i];
        b = cameraKeys[i + 1];
        break;
      }
    }
    const local = smooth((p - a.t) / Math.max(.0001, b.t - a.t));
    camera.position.set(mix(a.p[0], b.p[0], local), mix(a.p[1], b.p[1], local), mix(a.p[2], b.p[2], local));
    tempPoint.set(mix(a.l[0], b.l[0], local), mix(a.l[1], b.l[1], local), mix(a.l[2], b.l[2], local));
    if (narrow) {
      camera.position.z *= 1.17;
      camera.position.y += .5;
      tempPoint.y += .15;
    }
    if (!reduced && !coarse) {
      camera.position.x += (state.x - .5) * .35;
      camera.position.y -= (state.y - .5) * .2;
    }
    camera.fov = mix(a.f, b.f, local);
    camera.lookAt(tempPoint);
    camera.rotation.z += Math.sin(p * Math.PI * 2) * .012 * (1 - ramp(p, .88, 1));
    camera.updateProjectionMatrix();
  }

  function setFlow(flow, curve, phase, opacity) {
    const position = flow.geometry.attributes.position;
    for (let i = 0; i < flow.count; i++) {
      const u = (phase + i / flow.count) % 1;
      curve.getPointAt(u < 0 ? u + 1 : u, tempPoint);
      position.setXYZ(i, tempPoint.x, tempPoint.y, tempPoint.z);
    }
    position.needsUpdate = true;
    flow.material.opacity = opacity;
  }

  function updateWorld(p, time) {
    if (!world) return;
    const coldFocus = band(p, .07, .33, .18);
    const build = band(p, .21, .47, .2);
    const peak = band(p, .34, .63, .18);
    const explode = ramp(p, .4, .5) * (1 - ramp(p, .565, .655));
    const services = band(p, .54, .81, .2);
    const alarm = band(p, .75, .915, .2);
    const finale = ramp(p, .84, .985);
    const autonomous = reduced ? 0 : time * .000045;

    sampleCamera(world.cameraKeys, p, world.camera);
    world.rig.rotation.y = mix(-.08, .18, coldFocus) + Math.sin(p * Math.PI * 1.7) * .13 - finale * .16;
    world.rig.rotation.x = build * -.08 + peak * .03;
    world.rig.position.y = build * .22 - finale * .08;
    const wholeScale = .9 + peak * .05 - services * .035 + finale * .06;
    world.rig.scale.setScalar(wholeScale);

    world.coldMat.emissiveIntensity = .34 + coldFocus * 1.35 + peak * .65 + alarm * 1.6;
    world.warmMat.emissiveIntensity = .38 + build * .8 + peak * .72 + finale * .28;
    world.airMat.emissiveIntensity = .25 + coldFocus * .55;
    world.coldMat.opacity = .78 + coldFocus * .22;
    world.warmMat.opacity = .72 + build * .28;
    world.airMat.opacity = .26 + coldFocus * .55;
    world.floorPipe.material.opacity = build * .82;
    world.floorPipe.scale.setScalar(.75 + build * .25);
    world.frameMaterial.opacity = build * .46;
    world.building.scale.setScalar(.88 + build * .12);
    world.building.position.y = (1 - build) * -.55;

    for (let i = 0; i < world.plateCount; i++) {
      const center = (world.plateCount - 1) / 2;
      const signed = i - center;
      const spacing = .095 + explode * .2;
      tempPoint.set(signed * spacing, 0, Math.sin(i * 1.7 + p * 4) * explode * .07);
      tempQuat.setFromEuler(new THREE.Euler(0, signed * explode * .014, signed * explode * .006));
      tempScale.set(1, 1, 1);
      tempMatrix.compose(tempPoint, tempQuat, tempScale);
      world.plates.setMatrixAt(i, tempMatrix);
    }
    world.plates.instanceMatrix.needsUpdate = true;
    world.plateMat.emissiveIntensity = .25 + peak * .75;
    world.shellLines.material.opacity = .36 * (1 - explode * .84);
    world.leftManifold.position.x = -1.42 - explode * .45;
    world.rightManifold.position.x = 1.42 + explode * .45;
    world.core.scale.set(1 + explode * .2, 1 - explode * .28, 1 + explode * .2);

    const nodeSpread = services * (1 - finale);
    for (let i = 0; i < 6; i++) {
      const angle = -Math.PI * .72 + i * (Math.PI * 1.44 / 5) + autonomous;
      const radius = .6 + nodeSpread * 3.25;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * .72;
      const z = Math.sin(angle * 1.8) * nodeSpread * .55 + .15;
      tempPoint.set(x, y, z);
      tempQuat.setFromEuler(new THREE.Euler(autonomous * 2 + i, angle, 0));
      tempScale.setScalar(.05 + nodeSpread * .95);
      tempMatrix.compose(tempPoint, tempQuat, tempScale);
      world.serviceNodes.setMatrixAt(i, tempMatrix);
      const offset = i * 6;
      world.connectorPositions[offset] = 0;
      world.connectorPositions[offset + 1] = 0;
      world.connectorPositions[offset + 2] = 0;
      world.connectorPositions[offset + 3] = x;
      world.connectorPositions[offset + 4] = y;
      world.connectorPositions[offset + 5] = z;
    }
    world.serviceNodes.instanceMatrix.needsUpdate = true;
    world.nodeMaterial.opacity = nodeSpread;
    world.connectors.material.opacity = nodeSpread * .45;
    world.connectorGeometry.attributes.position.needsUpdate = true;

    world.haloMaterial.opacity = finale * .72;
    world.halo.scale.setScalar(.75 + finale * .25);
    world.halo.rotation.z = p * Math.PI * .35;
    world.sensorMaterial.opacity = alarm;
    const sensorProgress = (.08 + (p - .75) * 6.2) % 1;
    world.coldCurve.getPointAt(clamp(sensorProgress), world.sensor.position);
    world.sensor.scale.setScalar(.8 + alarm * (1.2 + Math.sin(time * .008) * .22));

    world.coldLight.intensity = 18 + coldFocus * 24 + alarm * 26;
    world.warmLight.intensity = 19 + build * 18 + finale * 10;
    world.whiteLight.intensity = 1.55 + peak * 4.2 + finale * .8;
    world.alarmLight.intensity = alarm * (32 + Math.sin(time * .01) * 7);
    world.hemi.intensity = .62 + finale * .24;
    world.scene.fog.density = .052 + peak * .018 + alarm * .012 - finale * .008;
    world.renderer.toneMappingExposure = 1.02 + peak * .18 + alarm * .08;

    const speed = .035 + state.velocity * .12 + alarm * .09;
    const phase = reduced ? p : (p * 2.7 + time * speed * .001);
    setFlow(world.coldFlow, world.coldCurve, phase, .48 + coldFocus * .46 + alarm * .35);
    setFlow(world.warmFlow, world.warmCurve, 1 - (phase % 1), .42 + build * .48 + peak * .2);
    setFlow(world.airFlow, world.airCurve, phase * .65, .15 + coldFocus * .52);
    world.dust.rotation.y = autonomous * 1.4;
    world.dust.material.opacity = .12 + peak * .16;

    world.camera.updateMatrixWorld(true);
    world.rig.updateMatrixWorld(true);
    Object.entries(world.anchorData).forEach(([key, anchor]) => {
      const el = calloutEls[key];
      if (!el) return;
      const visibility = band(p, anchor.from, anchor.to, .2);
      tempProjected.copy(anchor.point).applyMatrix4(world.rig.matrixWorld).project(world.camera);
      const rect = canvas.getBoundingClientRect();
      const x = (tempProjected.x * .5 + .5) * rect.width;
      const y = (-tempProjected.y * .5 + .5) * rect.height;
      el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) translate(-50%,-50%)";
      el.style.opacity = (visibility * (tempProjected.z < 1 ? 1 : 0)).toFixed(3);
    });
  }

  function renderFrame(time) {
    if (!world) return;
    try {
      updateWorld(state.p, time);
      world.renderer.render(world.scene, world.camera);
      if (!world.ready) {
        world.ready = true;
        html.classList.remove("no-webgl");
        html.classList.add("webgl-ready");
      }
    } catch (error) {
      html.classList.remove("webgl-ready");
      html.classList.add("no-webgl");
      console.warn("[Döbel] Realtime frame failed; photographic fallback active.", error);
      world = null;
    }
  }

  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    html.classList.remove("webgl-ready");
    html.classList.add("no-webgl");
    world = null;
  }, false);

  function frame(time) {
    raf = 0;
    if (!running) return;
    const dt = Math.min(64, Math.max(8, time - (lastFrame || time - 16)));
    if (coarse && world && time - lastFrame < 30) {
      raf = requestAnimationFrame(frame);
      return;
    }
    lastFrame = time;
    const ease = reduced ? 1 : 1 - Math.pow(.002, dt / 1000);
    state.p = mix(state.p, target.p, ease);
    state.velocity = mix(state.velocity, target.velocity, .15);
    state.x = mix(state.x, target.x, .08);
    state.y = mix(state.y, target.y, .08);
    if (performance.now() - lastMeasure > 130) target.velocity = 0;
    updateDOM(state.p);
    renderFrame(time);
    const unsettled = Math.abs(state.p - target.p) > .0001 || state.velocity > .002 || Math.abs(state.x - target.x) > .001 || Math.abs(state.y - target.y) > .001;
    if ((world && !reduced) || unsettled) raf = requestAnimationFrame(frame);
  }

  function requestFrame() {
    if (!raf && running) raf = requestAnimationFrame(frame);
  }

  function relayout() {
    dispatchEvent(new Event("resize"));
    requestAnimationFrame(measure);
  }

  function applyStaticPreference() {
    reduced = motionReduced || forcedColors;
    html.classList.toggle("reduced-world", reduced);
    if (reduced && world) {
      disposeWorld(world);
      world = null;
      html.classList.remove("webgl-ready");
      html.classList.add("no-webgl");
    } else if (!reduced && !world) {
      mountEngine();
      world = createWorld();
    }
    measure();
  }

  motionQuery.addEventListener("change", (event) => {
    motionReduced = event.matches;
    applyStaticPreference();
  });
  forcedQuery.addEventListener("change", (event) => {
    forcedColors = event.matches;
    applyStaticPreference();
  });

  html.classList.toggle("reduced-world", reduced);
  if (!reduced) world = createWorld();
  else html.classList.add("no-webgl");
  measure();
  updateDOM(0);
  requestFrame();
  addEventListener("load", relayout, { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
})();
