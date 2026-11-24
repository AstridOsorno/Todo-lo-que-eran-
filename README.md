# Todo lo que eran

Obra interactiva escolar de Astrid Osorno. Una entrada en negro abre un mundo de partículas: cada punto conduce a una constelación de fotografías y recuerdos de una vida. El recorrido no muestra los nombres de las mujeres y niñas; recuerda sus gustos, estudios, vínculos y proyectos.

Sitio público: https://astridosorno.github.io/Todo-lo-que-eran-/

## Recorrer la obra

Pulsa el título para entrar. Arrastra el mundo para girarlo y usa la rueda del mouse o dos dedos para acercarte. Al señalar un punto aparece el lugar. En una pantalla táctil, el primer toque muestra el lugar y el segundo entra en sus recuerdos. En las constelaciones puedes arrastrar, acercarte y seleccionar las fotografías. «Volver al mundo» conserva la orientación anterior.

Tab recorre los puntos y las fotografías. Las flechas permiten girar. Escape cierra la fotografía ampliada; desde una constelación regresa al mundo. También funcionan Atrás y Adelante del navegador. La obra respeta la preferencia de reducir movimiento y ofrece un recorrido alternativo si WebGL no está disponible.

## Desarrollo

Requiere Node.js 22 o posterior.

```sh
npm ci
npm run check
npm test
npm run build
npm run dev
```

La vista local abre en http://127.0.0.1:4173. GitHub Actions compila y publica `dist/` en GitHub Pages al subir cambios a `main`. No requiere base de datos, cuentas de visitantes ni servicios de imágenes externos: los archivos usados por la experiencia se sirven desde el mismo sitio.

## Contenido y archivos

`content.js` contiene las localidades, las tarjetas y sus fuentes documentales. `app.js` contiene el mundo y la navegación. `styles.css` define la presentación. El botón de información dentro de cada constelación muestra las fuentes y los créditos con etiquetas neutras. Las páginas externas conservan los nombres y títulos originales de sus autores.

Las coordenadas representan localidades aproximadas, nunca domicilios particulares. Los tres puntos de Ciudad de México se separan en pantalla con líneas que conservan su anclaje geográfico.

La constelación de Totana tiene documentación biográfica limitada y aún no cuenta con un retrato verificado. Emplea formas simbólicas claramente indicadas en sus fuentes; no se sustituyó su imagen con la de otra persona. Algunas fotos se usan varias veces con encuadres diferentes. No se generaron rostros con inteligencia artificial ni se inventaron sueños, premios o medallas.

Los dos casos inicialmente propuestos de Kenia e India fueron sustituidos, a petición de la autora del proyecto, por casos documentados de Italia y Turquía.

## Créditos

Texto de apertura proporcionado por la autora del proyecto: Cristina Rivera Garza, *El invencible verano de Liliana* (2021). Las fuentes y créditos específicos de recuerdos y fotografías se incluyen en cada constelación. Las fotos pertenecen a sus respectivos autores y familias; su inclusión en esta obra educativa no supone una licencia general de redistribución.

Imagen terrestre de NASA distribuida en los ejemplos de Three.js. Geografía de Natural Earth, distribuida en los ejemplos de globe.gl. Three.js: MIT. Tipografías Cormorant Garamond y DM Sans: SIL Open Font License; licencias incluidas en `assets/fonts/`.
