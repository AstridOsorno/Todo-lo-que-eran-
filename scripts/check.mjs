import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { stories } from '../content.js';
assert.equal(stories.length, 10, 'Deben existir diez constelaciones');
assert.equal(new Set(stories.map(s => s.id)).size, stories.length, 'Identificadores únicos');
const names = /Fátima|Cecilia|Liliana|Lesvy|Yuliana|Judith|Chesang|Neha|Chaudury|Claudia|Abigail|Giulia|Cecchettin|Özgecan|Aslan|Laura|Luelmo|Uyinene|Mrwetyana|Noor|Mukadam|Agnes|Tirop/i;
let memories = 0;
let photos = 0;
for (const story of stories) {
  assert(story.lat >= -90 && story.lat <= 90 && story.lng >= -180 && story.lng <= 180, story.id + ': coordenadas válidas');
  assert(story.memories.length >= 3 && story.sources.length > 0 && story.note, story.id + ': documentación suficiente');
  const photoIds = new Set();
  assert(!names.test(story.place + story.credit + story.note + story.sources.map(s => s.title).join(' ')), story.id + ': etiquetas neutras');
  for (const memory of story.memories) {
    assert(!names.test(memory.title + ' ' + memory.description + ' ' + memory.kind), story.id + ': sin nombres en los recuerdos');
    assert(memory.source.startsWith('https://'), story.id + ': fuente de cada recuerdo');
    if (memory.image) {
      await access(new URL('../' + memory.image, import.meta.url));
      assert(memory.photoId && !photoIds.has(memory.photoId), story.id + ': sin fotografías repetidas');
      photoIds.add(memory.photoId);
      assert(memory.imageSource.startsWith('https://'), story.id + ': procedencia de la imagen');
      assert(!names.test(memory.imageAlt + ' ' + (memory.imageCredit || '')), story.id + ': imágenes sin nombres en sus etiquetas');
      for (const crop of [memory.crop, memory.cardCrop].filter(Boolean)) {
        const [x,y,w,h,iw,ih] = crop;
        assert(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= iw && y + h <= ih, story.id + ': encuadre dentro del archivo');
      }
      photos++;
    }
    memories++;
  }
}
assert(stories.filter(s => ['f1','a2','f2','e1'].includes(s.id)).every(s => s.memories.filter(m => m.image).length >= 3), 'Nuevas historias con varias fotografías');
assert(!stories.some(s => /Totana/.test(s.place)), 'Sustitución del caso de España');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
assert(html.includes('lang="es"') && html.includes('viewport'), 'Idioma y pantalla móvil');
assert(html.includes('Somos ellas en el pasado') && html.includes('Cristina Rivera Garza'), 'Fragmento y atribución');
for (const file of ['earth.jpg','land.geojson','fonts/font-0.ttf','fonts/font-1.ttf','fonts/font-3.ttf']) await access(new URL('../assets/' + file, import.meta.url));
console.log(`Contenido verificado: ${stories.length} lugares, ${memories} recuerdos y ${photos} fotografías distintas; archivos, fuentes y etiquetas neutras comprobados.`);
