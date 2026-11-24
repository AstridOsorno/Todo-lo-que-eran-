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
let cardObjects = [], markerObjects = [];
const portraitSamples = new Map();
const memoryButtons = new WeakMap();
const activePointers = new Set();
let photoPointer = null;
let cloudRequest = 0;
const v = new THREE.Vector3();
const cameraDirection = new THREE.Vector3();
const radius = 2;
const dialogs = [$('memory-dialog'), $('sources-dialog')];
const deg = Math.PI / 180;

function globePosition(lat, lng, r = radius) {
  return new THREE.Vector3(r * Math.cos(lat * deg) * Math.sin(lng * deg), r * Math.sin(lat * deg), r * Math.cos(lat * deg) * Math.cos(lng * deg));
}
function fitWorldDistance() {
  return Math.max(7.3, 2.36 / (Math.tan(21 * deg) * (innerWidth / innerHeight)));
}
function galaxyDistance() { return innerWidth < 650 ? 7.8 : 9.5; }
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
  photoPointer = null;
  activePointers.clear();
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
    controls.minDistance = view === 'world' ? 2.7 : 3.2;
    controls.maxDistance = view === 'world' ? fitWorldDistance() * 1.5 : 16;
    controls.target.set(0, 0, 0);
    if (view === 'world') {
      if (worldCamera) { camera.position.copy(worldCamera); controls.target.copy(worldTarget); }
      else camera.position.copy(globePosition(19, -68, fitWorldDistance()));
    } else if (view === 'galaxy') {
      camera.position.set(0, 0, galaxyDistance());
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

const desktopCardPositions = [[-2.4,.95,.25],[-.75,1.65,-.8],[.35,.3,1],[2.3,1,-.4],[1.15,-1.6,.1],[-1.6,-1.3,.7]];
const mobileCardPositions = [[-.7,1.65,0],[.7,1.3,-.4],[-.68,.15,.3],[.7,-.2,-.35],[-.68,-1.35,-.1],[.7,-1.7,-.4]];
const fragmentPositions = [[-3.8,1.65,-1.7],[-2.5,2.25,-.8],[-.3,2.4,-1.2],[1.3,2.05,.2],[3.2,1.65,-1.7],[3.6,.15,-.6],[3.1,-1.5,-1.2],[1.8,-2.15,-.8],[.4,-2.35,-1.1],[-1.1,-2,-1.4],[-3.45,-1.45,-.6],[-3.85,-.1,-1.8]];
function layoutCardPositions() {
  const mobile = innerWidth < 650;
  const positions = mobile ? mobileCardPositions : desktopCardPositions;
  const primary = cardObjects.filter(card => !card.secondary);
  primary.forEach((card, i) => card.position.fromArray(positions[i % positions.length]));
  if (primary.length === 3) {
    const positions = innerWidth < 650 ? [[-.6,1.25,0],[.6,0,.2],[-.4,-1.25,-.2]] : [[-2,1,0],[1.7,.6,.2],[-.3,-1.2,.3]];
    primary.forEach((card,i) => card.position.fromArray(positions[i]));
  }
  cardObjects.filter(card => card.secondary).forEach((card, i) => {
    card.position.fromArray(fragmentPositions[i % fragmentPositions.length]);
    if (mobile) card.position.multiply(new THREE.Vector3(.42, .95, 1.2));
  });
}
function createMemoryCards(story) {
  $('memory-cards').replaceChildren();
  const entries = story.memories.map((memory, index) => ({ memory, index, secondary: false }));
  cardObjects = entries.map(({ memory, index, secondary }) => {
    const i = index;
    const button = document.createElement('button');
    button.className = 'memory-card' + (memory.image ? '' : ' text-memory') + (secondary ? ' fragment-card' : ' primary-memory');
    button.dataset.memory = String(i);
    if (memory.image) button.dataset.photo = memory.photoId;
    const photo = document.createElement('span'); photo.className = 'photo';
    if (memory.image && memory.crop) {
      photo.append(croppedPhoto(memory));
    } else if (memory.image) {
      const img = document.createElement('img'); img.src = memory.image; img.alt = ''; img.draggable = false;
      img.style.objectPosition = memory.position; img.decoding = 'async';
      img.addEventListener('error', () => { img.remove(); button.classList.add('text-memory'); photo.innerHTML = '<span class="symbol" aria-hidden="true"></span>'; });
      photo.append(img);
    } else photo.innerHTML = '<span class="symbol" aria-hidden="true"></span>';
    const caption = document.createElement('span'); caption.className = 'card-caption'; caption.textContent = memory.title;
    const kind = document.createElement('span'); kind.className = 'card-kind'; kind.textContent = memory.kind;
    button.append(photo, caption, kind);
    memoryButtons.set(button, memory);
    button.addEventListener('click', event => {
      if (state.fallback || event.detail === 0) openMemory(memory);
    });
    button.addEventListener('focus', () => {
      if (camera && !state.fallback && button.style.visibility === 'hidden') {
        camera.position.set(0, 0, galaxyDistance()); controls.target.set(0, 0, 0); controls.update();
      }
    });
    $('memory-cards').append(button);
    return { button, position: new THREE.Vector3(), secondary };
  });
  layoutCardPositions();
  if (dust && !state.fallback) colorCloud(story);
}
let cropSequence = 0;
function croppedPhoto(memory, enlarged = false) {
  const [x, y, width, height, imageWidth, imageHeight] = !enlarged && memory.cardCrop ? memory.cardCrop : memory.crop;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', enlarged || memory.cardCrop ? 'xMidYMid meet' : 'xMidYMid slice');
  svg.classList.add('archive-crop');
  if (enlarged) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', memory.imageAlt); }
  else svg.setAttribute('aria-hidden', 'true');
  const image = document.createElementNS(ns, 'image');
  image.setAttribute('href', memory.image); image.setAttribute('width', imageWidth); image.setAttribute('height', imageHeight);
  const clip = document.createElementNS(ns, 'clipPath'); clip.id = `archive-crop-${++cropSequence}`;
  const rect = document.createElementNS(ns, 'rect');
  for (const [key, value] of Object.entries({ x, y, width, height })) rect.setAttribute(key, value);
  clip.append(rect);
  image.setAttribute('clip-path', `url(#${clip.id})`);
  const defs = document.createElementNS(ns, 'defs'); defs.append(clip);
  svg.append(defs, image);
  return svg;
}
function updateCards(time) {
  const mobile = innerWidth < 650;
  const baseDistance = galaxyDistance();
  cardObjects.forEach(card => {
    v.copy(card.position);
    const distance = camera.position.distanceTo(v);
    v.project(camera);
    const visible = v.z < 1 && Math.abs(v.x) < 1.35 && Math.abs(v.y) < 1.35;
    const x = (v.x * .5 + .5) * innerWidth;
    const y = (-v.y * .5 + .5) * innerHeight;
    const fit = mobile ? Math.min(innerWidth / 440, innerHeight / 900, .88) : Math.min(innerHeight / 850, 1.04);
    const scale = Math.max(.3, Math.min(2.7, baseDistance / distance)) * fit * (card.secondary ? .7 : 1);
    card.button.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${scale})`;
    card.button.style.visibility = visible ? 'visible' : 'hidden';
    card.button.style.opacity = visible ? (card.secondary ? .65 : 1) : 0;
    card.button.style.zIndex = String(Math.round((card.secondary ? 45 : 100) - distance));
    card.button.querySelector('.card-caption').style.fontSize = `${(card.secondary ? 12 : 14) / scale}px`;
    card.button.querySelector('.card-kind').style.fontSize = `${12 / scale}px`;
  });
}
function openMemory(memory) {
  const img = $('memory-image');
  const wrap = img.parentElement;
  const cropped = Boolean(memory.image && memory.crop);
  wrap.querySelector('.archive-crop')?.remove();
  wrap.classList.toggle('cropped-image', cropped);
  wrap.classList.toggle('without-photo', !memory.image);
  img.hidden = !memory.image || cropped;
  if (memory.image) { img.src = memory.image; img.alt = memory.imageAlt; }
  else { img.removeAttribute('src'); img.alt = ''; }
  if (cropped) wrap.append(croppedPhoto(memory, true));
  $('memory-title').textContent = memory.title;
  $('memory-kind').textContent = memory.kind;
  $('memory-description').textContent = memory.description;
  $('memory-source').href = memory.source;
  $('memory-credit').textContent = memory.image ? (memory.imageCredit || state.story.credit) : '';
  $('photo-source').hidden = !memory.image;
  if (memory.image) $('photo-source').href = memory.imageSource;
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
  const count = innerWidth < 650 ? 38000 : 68000;
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
    if (ocean) colors.set([.018, .03, .045], i * 3);
    else colors.set([.57 + light * .32, .63 + light * .29, .68 + light * .27], i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.ShaderMaterial({
    vertexColors: true, transparent: true, depthWrite: false,
    uniforms: { pixelRatio: { value: Math.min(devicePixelRatio, 1.7) } },
    vertexShader: `varying vec3 vColor;varying float alpha;uniform float pixelRatio;void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.);float facing=dot(normalize(normalMatrix*normalize(position)),normalize(-mv.xyz));alpha=mix(.10,.86,smoothstep(-.15,.55,facing));gl_PointSize=clamp(8.8/-mv.z,.85,2.5)*pixelRatio;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying vec3 vColor;varying float alpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vColor,smoothstep(.5,.22,d)*alpha);}`
  });
  earthPoints = new THREE.Points(geometry, material);
  earth.add(earthPoints);
  const lineMaterial = (color, opacity) => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { tint: { value: new THREE.Color(color) }, opacity: { value: opacity } },
    vertexShader: `varying float alpha;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);float facing=dot(normalize(normalMatrix*normalize(position)),normalize(-mv.xyz));alpha=mix(.11,1.,smoothstep(-.18,.6,facing));gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying float alpha;uniform vec3 tint;uniform float opacity;void main(){gl_FragColor=vec4(tint,alpha*opacity);}`
  });
  const boundaries = [];
  for (const feature of landData.features) {
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    for (const polygon of polygons) for (const ring of polygon) {
      for (let i = 1; i < ring.length; i++) {
        const [lngA, latA] = ring[i - 1], [lngB, latB] = ring[i];
        if (Math.abs(lngB - lngA) > 180) continue;
        const start = globePosition(latA, lngA, 2.007), end = globePosition(latB, lngB, 2.007);
        const steps = Math.max(1, Math.ceil(start.angleTo(end) / .025));
        let last = start;
        for (let step = 1; step <= steps; step++) {
          const next = start.clone().lerp(end, step / steps).normalize().multiplyScalar(2.007);
          boundaries.push(...last.toArray(), ...next.toArray()); last = next;
        }
      }
    }
  }
  const boundaryGeometry = new THREE.BufferGeometry();
  boundaryGeometry.setAttribute('position', new THREE.Float32BufferAttribute(boundaries, 3));
  const countries = new THREE.LineSegments(boundaryGeometry, lineMaterial('#a1c9de', .74));
  countries.name = 'country-outlines'; earth.add(countries);
  const geodesic = new THREE.IcosahedronGeometry(2.022, 3);
  const lattice = new THREE.LineSegments(new THREE.WireframeGeometry(geodesic), lineMaterial('#b8c1c7', .24));
  geodesic.dispose(); lattice.name = 'geodesic-lattice'; earth.add(lattice);
}
function createGalaxy() {
  const count = innerWidth < 650 ? 36000 : 78000;
  const positions = new Float32Array(count * 3); const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  let seed = 1024;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const gaussian = () => (random() + random() + random() + random() - 2) * 1.1;
  const centers = [[-3.4,.25,-.8],[-2,1.25,.4],[-.2,1.1,-.75],[2.25,1,.7],[3,-.9,-.85],[.8,-1.6,.6],[-1.8,-.9,1.15]];
  const palette = [[.88,.88,.84],[.46,.63,.76],[.73,.59,.49],[.61,.65,.43],[.72,.74,.8]];
  for (let i = 0; i < count; i++) {
    const center = centers[i % centers.length];
    const x = center[0] + gaussian() * .95;
    const y = center[1] + gaussian() * .72 + Math.sin(x * 1.7) * .18;
    const z = center[2] + Math.sin(x * .9 + y * 1.8) * .62 + gaussian() * .56;
    positions.set([x, y, z], i * 3);
    const color = palette[Math.floor(random() * palette.length)];
    const brightness = .5 + random() * .5;
    colors.set(color.map(channel => channel * brightness), i * 3);
    sizes[i] = 1.45 + random() * 2.35;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  dust = new THREE.Points(geometry, new THREE.ShaderMaterial({
    vertexColors: true, transparent: true, depthWrite: false,
    uniforms: { pixelRatio: { value: Math.min(devicePixelRatio, 1.7) } },
    vertexShader: `attribute float size;varying vec3 vColor;varying float alpha;uniform float pixelRatio;void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.);alpha=clamp(1.2+mv.z*.045,.25,.9);gl_PointSize=clamp(size*8.8/-mv.z,.65,9.)*pixelRatio;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying vec3 vColor;varying float alpha;void main(){vec2 p=abs(gl_PointCoord-.5);float edge=1.-smoothstep(.36,.5,max(p.x,p.y));float cross=1.-smoothstep(.12,.26,min(p.x,p.y));gl_FragColor=vec4(vColor,edge*mix(.55,1.,cross)*alpha);}`
  }));
  dust.name = 'memory-point-cloud';
  galaxy.add(dust);
  const fieldPositions = new Float32Array(2200 * 3);
  for (let i = 0; i < 2200; i++) fieldPositions.set([(random() - .5) * 55, (random() - .5) * 40, (random() - .5) * 40], i * 3);
  const fieldGeometry = new THREE.BufferGeometry(); fieldGeometry.setAttribute('position', new THREE.BufferAttribute(fieldPositions, 3));
  stars = new THREE.Points(fieldGeometry, new THREE.PointsMaterial({ color: 0x9b90ad, size: .012, transparent: true, opacity: .5, depthWrite: false }));
  scene.add(stars);
}
async function samplePortrait(memory) {
  const key = memory.photoId;
  if (!portraitSamples.has(key)) portraitSamples.set(key, new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (memory.crop) context.drawImage(image, ...memory.crop.slice(0, 4), 0, 0, 128, 128);
      else context.drawImage(image, 0, 0, 128, 128);
      resolve(context.getImageData(0, 0, 128, 128).data);
    };
    image.onerror = reject; image.src = memory.image;
  }));
  return portraitSamples.get(key);
}
async function colorCloud(story) {
  const request = ++cloudRequest;
  const photos = story.memories.filter(memory => memory.image);
  const samples = await Promise.allSettled(photos.map(memory => samplePortrait(memory)));
  if (request !== cloudRequest || state.story?.id !== story.id) return;
  const images = samples.filter(result => result.status === 'fulfilled').map(result => result.value);
  const color = dust.geometry.getAttribute('color');
  let seed = story.id.split('').reduce((sum, letter) => sum + letter.charCodeAt(0), 15);
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < color.count; i++) {
    if (!images.length || random() < .25) {
      const light = .48 + random() * .5;
      color.setXYZ(i, light * .94, light * .97, light);
      continue;
    }
    const image = images[i % images.length];
    const pixel = Math.floor(random() * image.length / 4) * 4;
    const channels = [image[pixel], image[pixel + 1], image[pixel + 2]].map(channel => channel / 255);
    const max = Math.max(...channels, .1);
    const brightness = .45 + random() * .45;
    color.setXYZ(i, channels[0] / max * brightness, channels[1] / max * brightness, channels[2] / max * brightness);
  }
  color.needsUpdate = true;
  dust.rotation.set(0, (seed % 13 - 6) * .012, .025);
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
    controls = new OrbitControls(camera, $('experience'));
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
    if (!reducedMotion.matches && !modalOpen) dust.rotation.y += delta * .012;
    updateCards(time);
  }
  renderer.render(scene, camera);
}

const ready = initialize();
$('experience').addEventListener('pointerdown', event => {
  if (state.view !== 'galaxy' || state.fallback) return;
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  activePointers.add(event.pointerId);
  if (activePointers.size > 1 && photoPointer) photoPointer.multitouch = true;
  const button = event.target.closest('.memory-card');
  if (button && activePointers.size === 1) {
    photoPointer = { id: event.pointerId, x: event.clientX, y: event.clientY, button, multitouch: false };
    button.focus({ preventScroll: true });
  }
}, true);
$('experience').addEventListener('pointerup', event => {
  activePointers.delete(event.pointerId);
  if (!photoPointer || photoPointer.id !== event.pointerId) return;
  const pointer = photoPointer; photoPointer = null;
  const memory = memoryButtons.get(pointer.button);
  if (state.view === 'galaxy' && !pointer.multitouch && memory && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) < 8) {
    queueMicrotask(() => openMemory(memory));
  }
}, true);
$('experience').addEventListener('pointercancel', event => {
  activePointers.delete(event.pointerId);
  if (photoPointer?.id === event.pointerId) photoPointer = null;
}, true);
document.querySelectorAll('.galaxy-nav button').forEach(button => {
  button.addEventListener('pointerdown', event => event.stopPropagation());
});
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
  const oldFit = Math.max(7.3, 2.36 / (Math.tan(21 * deg) * oldAspect));
  if (worldCamera) worldCamera.multiplyScalar(fitWorldDistance() / oldFit);
  if (state.view === 'world' || state.view === 'intro') {
    camera.position.multiplyScalar(fitWorldDistance() / oldFit);
    controls.maxDistance = fitWorldDistance() * 1.5;
  }
  layoutCardPositions();
});
reducedMotion.addEventListener('change', () => {
  if (controls) { controls.autoRotate = state.view === 'world' && !reducedMotion.matches; controls.enableDamping = !reducedMotion.matches; }
});
