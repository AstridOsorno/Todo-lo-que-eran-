import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { stories } from '../content.js';
assert.equal(stories.length, 7, 'Deben existir siete constelaciones');
assert.equal(new Set(stories.map(s => s.id)).size, stories.length, 'Identificadores únicos');
const names = /Fátima|Cecilia|Liliana|Lesvy|Yuliana|Judith|Chesang|Neha|Chaudury|Claudia|Abigail|Giulia|Cecchettin|Özgecan|Aslan/i;
let memories = 0;
for (const story of stories) {
  assert(story.lat >= -90 && story.lat <= 90 && story.lng >= -180 && story.lng <= 180, story.id + ': coordenadas válidas');
  assert(story.memories.length >= 3 && story.sources.length > 0 && story.note, story.id + ': documentación suficiente');
  for (const memory of story.memories) {
    assert(!names.test(memory.title + ' ' + memory.description + ' ' + memory.kind), story.id + ': sin nombres en los recuerdos');
    assert(memory.source.startsWith('https://'), story.id + ': fuente de cada recuerdo');
    if (memory.image) await access(new URL('../' + memory.image, import.meta.url));
    memories++;
  }
}
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
assert(html.includes('lang="es"') && html.includes('viewport'), 'Idioma y pantalla móvil');
assert(html.includes('Somos ellas en el pasado') && html.includes('Cristina Rivera Garza'), 'Fragmento y atribución');
for (const file of ['earth.jpg','land.geojson','fonts/font-0.ttf','fonts/font-1.ttf','fonts/font-3.ttf']) await access(new URL('../assets/' + file, import.meta.url));
console.log(`Contenido verificado: ${stories.length} lugares, ${memories} recuerdos, archivos y fuentes presentes, sin nombres en las tarjetas.`);
