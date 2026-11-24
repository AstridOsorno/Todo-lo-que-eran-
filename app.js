import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { stories } from './content.js';

const $ = (id) => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = matchMedia('(pointer: coarse)');
const visited = new Set();
const state = { view: 'intro', story: null, ready: false, fallback: false, focusedMarker: null, touchMarker: null, dragging: false };
let renderer, scene, camera, controls, earth, galaxy, stars, earthPoints, dust;
let worldCamera, worldTarget, lastTime = 0, lastInteraction = 0, pointerStart;
let cardObjects = [], markerObjects = [], ghostObjects = [];
const v = new THREE.Vector3();
const cameraDirection = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);
const radius = 2;
const dialogs = [$('memory-dialog'), $('sources-dialog')];
const deg = Math.PI / 180;

function globePosition(lat, lng, r = radius) {
  return new THREE.Vector3(r * Math.cos(lat * deg) * Math.sin(lng * deg), r * Math.sin(lat * deg), r * Math.cos(lat * deg) * Math.cos(lng * deg));
}
function fitWorldDistance() {
  return Math.max(6.5, 2.36 / (Math.tan(21 * deg) * (innerWidth / innerHeight)));
}
function announce(text) { $('announcement').textContent = text; }
function setHistory(view, id = null) {
  const hash = view === 'intro' ? '' : view === 'world' ? '#mundo' : `#recuerdo-${id}`;
  if (location.hash !== hash) history.pushState({ view, id }, '', location.pathname + location.search + hash);
}
function setView(view, storyId = null, push = true) {
  if (view === 'galaxy' && !stories.some(s => s.id === storyId)) view = 'world';
  dialogs.forEach(dialog => dialog.open && dialog.close());
  if (state.view === 'world' && view === 'galaxy' && camera) {
    worldCamera = camera.position.clone();
    worldTarget = controls.target.clone();
  }
  const previous = state.view;
  state.view = view;
  document.body.dataset.view = view;
  $('intro').classList.toggle('leaving', view !== 'intro');
  $('intro').inert = view !== 'intro';
  $('world').hidden = view !== 'world' || state.fallback;
  $('galaxy').hidden = view !== 'galaxy';
  $('fallback').hidden = view !== 'world' || !state.fallback;
  hideTooltip();
  state.focusedMarker = null;
  state.touchMarker = null;
  if (earth) {
    earth.visible = view === 'world';
    galaxy.visible = view === 'galaxy';
    stars.visible = view === 'galaxy';
    controls.enabled = view !== 'intro';
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = view === 'world' && !reducedMotion.matches;
    controls.enableDamping = !reducedMotion.matches;
    controls.minDistance = view === 'world' ? 2.7 : 4.5;
    controls.maxDistance = view === 'world' ? fitWorldDistance() * 1.5 : 12;
    controls.target.set(0, 0, 0);
    if (view === 'world') {
      if (worldCamera) { camera.position.copy(worldCamera); controls.target.copy(worldTarget); }
      else camera.position.copy(globePosition(19, -68, fitWorldDistance()));
    } else if (view === 'galaxy') {
      camera.position.set(0, 0, 7.8);
    }
    camera.lookAt(controls.target);
    controls.update();
  }
  if (view === 'galaxy') {
    const story = stories.find(s => s.id === storyId);
    state.story = story;
    visited.add(story.id);
    markerObjects.forEach(m => m.button.classList.toggle('visited', visited.has(m.story.id)));
    createMemoryCards(story);
    $('galaxy-place').textContent = story.place;
    announce(`Recuerdos de ${story.place}. Selecciona una imagen para conocer un recuerdo.`);
    if (push) requestAnimationFrame(() => $('back-world').focus({ preventScroll: true }));
  } else if (view === 'world') {
    announce('Mundo de memorias. Arrastra para girarlo. Selecciona los puntos para explorar.');
    if (previous === 'galaxy' && state.story) {
      const selected = markerObjects.find(m => m.story.id === state.story.id);
      if (selected) requestAnimationFrame(() => selected.button.focus({ preventScroll: true }));
    } else if (previous === 'intro') document.activeElement?.blur();
  } else if (previous !== 'intro') $('enter').focus({ preventScroll: true });
  if (push) setHistory(view, storyId);
}

function createMarkers() {
  markerObjects = stories.map(story => {
    const button = document.createElement('button');
    button.className = 'marker';
    button.dataset.story = story.id;
    button.setAttribute('aria-label', `${story.place}. Abrir recuerdos`);
    button.style.animationDelay = `${Math.random() * -4}s`;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', '#d5abc355');
    line.setAttribute('stroke-width', '.7');
    $('marker-lines').append(line);
    const marker = { story, button, line, position: globePosition(story.lat, story.lng, 2.035), x: 0, y: 0, showing: false };
    button.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') { state.focusedMarker = marker; showTooltip(marker); }
      if (controls) controls.autoRotate = false;
    });
    button.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'touch' && document.activeElement !== button) { state.focusedMarker = null; hideTooltip(); }
    });
    button.addEventListener('focus', () => {
      if (!marker.showing && camera) {
        camera.position.copy(marker.position.clone().normalize().multiplyScalar(camera.position.length()));
        controls.update();
      }
      state.focusedMarker = marker;
      if (controls) controls.autoRotate = false;
      showTooltip(marker);
    });
    button.addEventListener('blur', () => { state.focusedMarker = null; hideTooltip(); });
    button.addEventListener('pointerdown', event => {
      event.stopPropagation();
      pointerStart = { x: event.clientX, y: event.clientY };
    });
    button.addEventListener('click', event => {
      if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 9 && event.detail) return;
      if (coarsePointer.matches && event.detail && state.touchMarker !== marker) {
        state.touchMarker = marker;
        markerObjects.forEach(m => m.button.classList.toggle('selected', m === marker));
        showTooltip(marker);
        return;
      }
      setView('galaxy', story.id);
    });
    $('markers').append(button);
    const fallbackButton = document.createElement('button');
    fallbackButton.textContent = story.place;
    fallbackButton.addEventListener('click', () => setView('galaxy', story.id));
    $('fallback-places').append(fallbackButton);
    return marker;
  });
}
function showTooltip(marker) {
  const tooltip = $('place-tooltip');
  tooltip.textContent = marker.story.place;
  tooltip.hidden = false;
  positionTooltip(marker);
}
function positionTooltip(marker) {
  const tooltip = $('place-tooltip');
  const x = Math.max(12, Math.min(innerWidth - tooltip.offsetWidth - 12, marker.x + 18));
  const y = Math.max(12, Math.min(innerHeight - 50, marker.y - 40));
  tooltip.style.transform = `translate(${x}px,${y}px)`;
}
function hideTooltip() { $('place-tooltip').hidden = true; }
function updateMarkers() {
  cameraDirection.copy(camera.position).normalize();
  markerObjects.forEach(marker => {
    v.copy(marker.position);
    const visible = v.clone().normalize().dot(cameraDirection) > .19;
    v.project(camera);
    const x = (v.x * .5 + .5) * innerWidth;
    const y = (-v.y * .5 + .5) * innerHeight;
    // Los tres lugares de la misma ciudad se separan en pantalla, con líneas a su ubicación.
    const offset = marker.story.offset || [0, 0];
    const spread = 1;
    marker.x = x + offset[0] * spread;
    marker.y = y + offset[1] * spread;
    marker.anchorX = x; marker.anchorY = y;
    marker.showing = visible && Math.abs(v.x) < 1.12 && Math.abs(v.y) < 1.12;
  });
  // Mantener blancos táctiles separados cuando varias localidades quedan próximas.
  for (let pass = 0; pass < 8; pass++) {
    for (let i = 0; i < markerObjects.length; i++) {
      for (let j = i + 1; j < markerObjects.length; j++) {
        const a = markerObjects[i], b = markerObjects[j];
        if (!a.showing || !b.showing) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= 49) continue;
        const push = (49 - distance) / 2;
        const nx = distance > .01 ? dx / distance : 1;
        const ny = distance > .01 ? dy / distance : 0;
        a.x -= nx * push; a.y -= ny * push;
        b.x += nx * push; b.y += ny * push;
      }
    }
  }
  markerObjects.forEach(marker => {
    marker.x = Math.max(23, Math.min(innerWidth - 23, marker.x));
    marker.y = Math.max(23, Math.min(innerHeight - 23, marker.y));
    marker.button.style.opacity = marker.showing ? 1 : 0;
    marker.button.style.pointerEvents = marker.showing ? 'auto' : 'none';
    // Permanecen en el orden de Tab: enfocar un punto oculto gira el mundo hacia él.
    marker.button.style.transform = `translate(${marker.x - 22}px,${marker.y - 22}px)`;
    const displaced = Math.hypot(marker.x - marker.anchorX, marker.y - marker.anchorY) > 3;
    marker.line.style.display = marker.showing && displaced ? '' : 'none';
    marker.line.setAttribute('x1', marker.anchorX); marker.line.setAttribute('y1', marker.anchorY);
    marker.line.setAttribute('x2', marker.x); marker.line.setAttribute('y2', marker.y);
  });
  const active = state.touchMarker || state.focusedMarker;
  if (active?.showing) positionTooltip(active);
  else hideTooltip();
}

const desktopCardPositions = [[-2.45,1.25,-.3],[-.25,1.45,-.75],[2.05,1.1,-.35],[-1.95,-1,.6],[.3,-1.25,.3],[2.35,-1,-.65]];
const mobileCardPositions = [[-.7,1.65,0],[.7,1.3,-.4],[-.68,.15,.3],[.7,-.2,-.35],[-.68,-1.35,-.1],[.7,-1.7,-.4]];
function layoutCardPositions() {
  const positions = innerWidth < 650 ? mobileCardPositions : desktopCardPositions;
  cardObjects.forEach((card, i) => card.position.fromArray(positions[i % positions.length]));
  if (cardObjects.length === 3) {
    const positions = innerWidth < 650 ? [[-.6,1.5,0],[.6,0,.2],[-.4,-1.5,-.2]] : [[-2,1,0],[1.7,.6,.2],[-.3,-1.2,.3]];
    cardObjects.forEach((card,i) => card.position.fromArray(positions[i]));
  }
}
function createMemoryCards(story) {
  $('memory-cards').replaceChildren();
  cardObjects = story.memories.map((memory, i) => {
    const button = document.createElement('button');
    button.className = 'memory-card' + (memory.image ? '' : ' text-memory');
    button.dataset.memory = String(i);
    const photo = document.createElement('span'); photo.className = 'photo';
    if (memory.image && story.id === 'm1') {
      photo.classList.add('portrait-detail');
      photo.style.backgroundImage = `url('${memory.image}')`;
      photo.setAttribute('role', 'img'); photo.setAttribute('aria-label', 'Retrato del archivo familiar');
    } else if (memory.image) {
      const img = document.createElement('img'); img.src = memory.image; img.alt = ''; img.draggable = false;
      img.style.objectPosition = story.id === 'm2' ? (i % 2 ? '50% 100%' : '50% 0%') : memory.position; img.decoding = 'async';
      img.addEventListener('error', () => { img.remove(); button.classList.add('text-memory'); photo.innerHTML = '<span class="symbol" aria-hidden="true"></span>'; });
      photo.append(img);
    } else photo.innerHTML = '<span class="symbol" aria-hidden="true"></span>';
    const caption = document.createElement('span'); caption.className = 'card-caption'; caption.textContent = memory.title;
    const kind = document.createElement('span'); kind.className = 'card-kind'; kind.textContent = memory.kind;
    button.append(photo, caption, kind);
    button.addEventListener('click', () => openMemory(memory));
    button.addEventListener('focus', () => {
      if (camera && !state.fallback && button.style.visibility === 'hidden') {
        camera.position.set(0, 0, 7.8); controls.target.set(0, 0, 0); controls.update();
      }
    });
    $('memory-cards').append(button);
    return { button, position: new THREE.Vector3(), phase: i * 1.7 };
  });
  layoutCardPositions();
  ghostObjects.forEach(object => { galaxy.remove(object); object.material.map?.dispose(); object.material.dispose(); });
  ghostObjects = [];
  if (galaxy && !state.fallback) {
    const photos = story.id === 'm1' ? [] : [...new Set(story.memories.map(m => m.image).filter(Boolean))];
    for (let i = 0; i < (photos.length ? 14 : 0); i++) {
      const texture = new THREE.TextureLoader().load(photos[i % photos.length]);
      texture.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: .24, depthWrite: false, color: 0xc2a5be }));
      const angle = i * 2.4;
      const distance = 2.2 + (i % 5) * .52;
      sprite.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance * .65, -2 - i % 4);
      sprite.scale.set(.32 + (i % 3) * .1, .4 + (i % 3) * .1, 1);
      galaxy.add(sprite); ghostObjects.push(sprite);
    }
  }
}
function updateCards(time) {
  const mobile = innerWidth < 650;
  const baseDistance = 7.8;
  cardObjects.forEach(card => {
    v.copy(card.position);
    if (!reducedMotion.matches) {
      v.y += Math.sin(time * .00016 + card.phase) * .065;
      v.x += Math.cos(time * .00012 + card.phase) * .04;
    }
    const distance = camera.position.distanceTo(v);
    v.project(camera);
    const visible = v.z < 1 && Math.abs(v.x) < 1.35 && Math.abs(v.y) < 1.35;
    const x = (v.x * .5 + .5) * innerWidth;
    const y = (-v.y * .5 + .5) * innerHeight;
    const fit = mobile ? Math.min(innerWidth / 440, innerHeight / 900, .88) : Math.min(innerHeight / 850, 1.04);
    const scale = Math.max(.48, Math.min(1.4, baseDistance / distance)) * fit;
    card.button.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${scale})`;
    card.button.style.visibility = visible ? 'visible' : 'hidden';
    card.button.style.opacity = visible ? Math.min(1, Math.max(.35, 1.3 - distance * .045)) : 0;
    card.button.style.zIndex = String(Math.round(100 - distance));
    card.button.querySelector('.card-caption').style.fontSize = `${14 / scale}px`;
    card.button.querySelector('.card-kind').style.fontSize = `${12 / scale}px`;
  });
}
function openMemory(memory) {
  const img = $('memory-image');
  const wrap = img.parentElement;
  const cropped = state.story.id === 'm1';
  wrap.classList.toggle('portrait-detail', cropped);
  wrap.style.backgroundImage = cropped ? `url('${memory.image}')` : '';
  img.hidden = !memory.image || cropped;
  if (memory.image) { img.src = memory.image; img.alt = 'Fotografía del archivo de esta vida'; }
  else { img.removeAttribute('src'); img.alt = ''; }
  $('memory-title').textContent = memory.title;
  $('memory-kind').textContent = memory.kind;
  $('memory-description').textContent = memory.description;
  $('memory-source').href = memory.source;
  $('memory-credit').textContent = memory.image ? state.story.credit : 'Forma simbólica. No representa un retrato.';
  $('memory-dialog').showModal();
}
function openSources() {
  if (!state.story) return;
  $('source-note').textContent = state.story.note;
  $('source-list').replaceChildren(...state.story.sources.map(source => {
    const link = document.createElement('a');
    link.textContent = source.title; link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    return link;
  }));
  $('sources-dialog').showModal();
}

async function createEarth() {
  const texture = await new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = 'assets/earth.jpg';
  });
  const canvas = document.createElement('canvas'); canvas.width = texture.width; canvas.height = texture.height;
  const context = canvas.getContext('2d', { willReadFrequently: true }); context.drawImage(texture, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const landCanvas = document.createElement('canvas');
  landCanvas.width = canvas.width; landCanvas.height = canvas.height;
  const landContext = landCanvas.getContext('2d', { willReadFrequently: true });
  const landData = await fetch('assets/land.geojson').then(response => {
    if (!response.ok) throw new Error('No se pudo cargar la geografía');
    return response.json();
  });
  landContext.fillStyle = '#fff';
  for (const feature of landData.features) {
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    for (const polygon of polygons) {
      landContext.beginPath();
      for (const ring of polygon) ring.forEach(([lng, lat], index) => {
        const x = (lng + 180) / 360 * landCanvas.width;
        const y = (90 - lat) / 180 * landCanvas.height;
        index ? landContext.lineTo(x, y) : landContext.moveTo(x, y);
      });
      landContext.fill('evenodd');
    }
  }
  const landPixels = landContext.getImageData(0, 0, canvas.width, canvas.height).data;
  const count = innerWidth < 650 ? 70000 : 125000;
  const positions = new Float32Array(count * 3); const colors = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y); const angle = goldenAngle * i;
    const x = Math.cos(angle) * ring; const z = Math.sin(angle) * ring;
    positions.set([x * radius, y * radius, z * radius], i * 3);
    const longitude = Math.atan2(x, z);
    const u = ((longitude / (2 * Math.PI) + .5) % 1 + 1) % 1;
    const w = Math.acos(y) / Math.PI;
    const index = (Math.min(canvas.height - 1, Math.floor(w * canvas.height)) * canvas.width + Math.min(canvas.width - 1, Math.floor(u * canvas.width))) * 4;
    const red = pixels[index] / 255, green = pixels[index + 1] / 255, blue = pixels[index + 2] / 255;
    const ocean = landPixels[index + 3] < 128;
    const light = (red + green + blue) / 3;
    if (ocean) colors.set([.09 + light * .08, .15 + light * .1, .26 + light * .17], i * 3);
    else colors.set([.66 + light * .3, .61 + light * .34, .73 + light * .25], i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.ShaderMaterial({
    vertexColors: true, transparent: true, depthWrite: false,
    uniforms: { pixelRatio: { value: Math.min(devicePixelRatio, 1.7) } },
    vertexShader: `varying vec3 vColor; uniform float pixelRatio; void main(){vColor=color; vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(12.0/-mv.z,1.2,3.0)*pixelRatio;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying vec3 vColor;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vColor,smoothstep(.5,.22,d)*.95);}`
  });
  earthPoints = new THREE.Points(geometry, material);
  earth.add(earthPoints);
  earth.add(new THREE.Mesh(new THREE.SphereGeometry(1.994, 64, 48), new THREE.MeshBasicMaterial({ color: 0x020205 })));
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(2.035, 64, 48), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
    vertexShader: `varying vec3 n;varying vec3 p;void main(){n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);p=-mv.xyz;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying vec3 n;varying vec3 p;void main(){float f=pow(1.-abs(dot(normalize(n),normalize(p))),4.);gl_FragColor=vec4(.24,.20,.40,f*.25);}`
  }));
  earth.add(atmosphere);
}
function createGalaxy() {
  const count = innerWidth < 650 ? 18000 : 38000;
  const positions = new Float32Array(count * 3); const colors = new Float32Array(count * 3);
  let seed = 1024;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const palette = [new THREE.Color('#e1bacf'), new THREE.Color('#b3b9db'), new THREE.Color('#a8bfc0'), new THREE.Color('#d9caab'), new THREE.Color('#6e6c9e')];
  for (let i = 0; i < count; i++) {
    const r = Math.pow(random(), .65) * 5;
    const angle = r * 1.65 + Math.floor(random() * 3) * Math.PI * 2 / 3 + (random() - .5) * .7;
    const spread = .16 + r * .035;
    const x = Math.cos(angle) * r + (random() - .5) * spread;
    const z = Math.sin(angle) * r * .45 + (random() - .5) * spread;
    const y = Math.sin(angle * 1.7) * .4 + (random() - .5) * (1 + r * .12);
    positions.set([x, y, z], i * 3);
    const color = palette[Math.floor(random() * palette.length)].clone().multiplyScalar(.35 + random() * .6);
    colors.set([color.r, color.g, color.b], i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  dust = new THREE.Points(geometry, new THREE.PointsMaterial({ size: .012, vertexColors: true, transparent: true, opacity: .7, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
  dust.rotation.x = .65;
  galaxy.add(dust);
  const fieldPositions = new Float32Array(2200 * 3);
  for (let i = 0; i < 2200; i++) fieldPositions.set([(random() - .5) * 55, (random() - .5) * 40, (random() - .5) * 40], i * 3);
  const fieldGeometry = new THREE.BufferGeometry(); fieldGeometry.setAttribute('position', new THREE.BufferAttribute(fieldPositions, 3));
  stars = new THREE.Points(fieldGeometry, new THREE.PointsMaterial({ color: 0x9b90ad, size: .012, transparent: true, opacity: .5, depthWrite: false }));
  scene.add(stars);
}
function activateFallback(error) {
  state.fallback = true;
  state.ready = true;
  document.body.classList.add('fallback-mode');
  if (renderer) renderer.setAnimationLoop(null);
  if (state.view !== 'intro') setView(state.view, state.story?.id, false);
  console.warn('Vista alternativa disponible:', error?.message || 'WebGL no disponible');
}
async function initialize() {
  createMarkers();
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 650 ? 1.5 : 1.8));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    $('universe').append(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); activateFallback(new Error('Se perdió el contexto gráfico')); });
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 100);
    camera.position.copy(globePosition(19, -68, fitWorldDistance()));
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !reducedMotion.matches;
    controls.dampingFactor = .06;
    controls.rotateSpeed = .5;
    controls.zoomSpeed = .6;
    controls.autoRotateSpeed = .22;
    controls.enablePan = false;
    controls.enabled = false;
    controls.addEventListener('start', () => {
      state.dragging = true;
      lastInteraction = performance.now();
      controls.autoRotate = false;
      state.touchMarker = null;
      markerObjects.forEach(m => m.button.classList.remove('selected'));
      hideTooltip();
    });
    controls.addEventListener('end', () => { state.dragging = false; lastInteraction = performance.now(); });
    earth = new THREE.Group(); galaxy = new THREE.Group();
    scene.add(earth, galaxy);
    await createEarth();
    createGalaxy();
    earth.visible = false; galaxy.visible = false; stars.visible = false;
    state.ready = true;
    renderer.setAnimationLoop(render);
  } catch (error) { activateFallback(error); }
  const hash = location.hash;
  if (hash === '#mundo') setView('world', null, false);
  else if (hash.startsWith('#recuerdo-')) setView('galaxy', hash.slice(10), false);
}
function render(time) {
  if (document.hidden || state.view === 'intro' || state.fallback) { lastTime = time; return; }
  const delta = Math.min((time - lastTime) / 1000, .05); lastTime = time;
  const modalOpen = dialogs.some(dialog => dialog.open);
  controls.enabled = !modalOpen;
  if (state.view === 'world') {
    controls.autoRotate = !reducedMotion.matches && !state.dragging && !state.focusedMarker && !state.touchMarker && time - lastInteraction > 6000;
  }
  if (!modalOpen) controls.update(delta);
  if (state.view === 'world') updateMarkers();
  if (state.view === 'galaxy') {
    if (!reducedMotion.matches && !modalOpen) dust.rotation.z = time * .000012;
    updateCards(time);
  }
  renderer.render(scene, camera);
}

const ready = initialize();
$('enter').addEventListener('click', async () => {
  $('enter').disabled = true;
  $('enter').setAttribute('aria-busy', 'true');
  await ready;
  $('enter').disabled = false;
  $('enter').removeAttribute('aria-busy');
  setView('world');
});
$('back-world').addEventListener('click', () => {
  if (location.hash.startsWith('#recuerdo-') && history.state?.view === 'galaxy') history.back();
  else setView('world');
});
$('open-sources').addEventListener('click', openSources);
dialogs.forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left || event.clientX > dialog.getBoundingClientRect().right || event.clientY < dialog.getBoundingClientRect().top || event.clientY > dialog.getBoundingClientRect().bottom)) dialog.close(); });
});
addEventListener('popstate', async () => {
  await ready;
  if (location.hash.startsWith('#recuerdo-')) setView('galaxy', location.hash.slice(10), false);
  else setView(location.hash === '#mundo' ? 'world' : 'intro', null, false);
});
addEventListener('keydown', event => {
  if (dialogs.some(dialog => dialog.open)) return;
  if (event.key === 'Escape') {
    if (state.view === 'galaxy') $('back-world').click();
    else if (state.view === 'world') { hideTooltip(); state.touchMarker = null; }
  }
  if (state.view === 'intro' || !camera || state.fallback) return;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    lastInteraction = performance.now(); controls.autoRotate = false;
    const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    if (event.key === 'ArrowLeft') spherical.theta -= .1;
    if (event.key === 'ArrowRight') spherical.theta += .1;
    if (event.key === 'ArrowUp') spherical.phi -= .08;
    if (event.key === 'ArrowDown') spherical.phi += .08;
    spherical.makeSafe();
    camera.position.setFromSpherical(spherical).add(controls.target); controls.update();
  }
});
addEventListener('resize', () => {
  if (!camera || state.fallback) return;
  const oldAspect = camera.aspect;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 650 ? 1.5 : 1.8));
  if (state.view === 'world' || state.view === 'intro') {
    const oldFit = Math.max(6.5, 2.36 / (Math.tan(21 * deg) * oldAspect));
    camera.position.multiplyScalar(fitWorldDistance() / oldFit);
    controls.maxDistance = fitWorldDistance() * 1.5;
  }
  layoutCardPositions();
});
reducedMotion.addEventListener('change', () => {
  if (controls) { controls.autoRotate = state.view === 'world' && !reducedMotion.matches; controls.enableDamping = !reducedMotion.matches; }
});
