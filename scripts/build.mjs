import { mkdir, cp, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';
const destination = new URL('../dist/', import.meta.url);
const target = fileURLToPath(destination).replace(/[\\/]$/, '');
const projectRoot = fileURLToPath(new URL('../', import.meta.url)).replace(/[\\/]$/, '');
if (dirname(target) !== projectRoot || basename(target) !== 'dist') throw new Error('Directorio de salida fuera del proyecto');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'content.js', '.nojekyll']) {
  await copyFile(new URL(`../${file}`, import.meta.url), new URL(file, destination));
}
await cp(new URL('../assets/', import.meta.url), new URL('assets/', destination), { recursive: true });
await mkdir(new URL('vendor/', destination), { recursive: true });
await copyFile(new URL('../node_modules/three/build/three.module.js', import.meta.url), new URL('vendor/three.module.js', destination));
await copyFile(new URL('../node_modules/three/examples/jsm/controls/OrbitControls.js', import.meta.url), new URL('vendor/OrbitControls.js', destination));
await copyFile(new URL('../node_modules/three/LICENSE', import.meta.url), new URL('vendor/THREE-LICENSE.txt', destination));
console.log('Sitio estático preparado en dist/');
