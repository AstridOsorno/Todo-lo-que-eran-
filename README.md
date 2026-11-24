# Todo lo que eran

Obra interactiva escolar de Astrid Osorno. Una entrada en negro abre un mundo de partículas: cada punto conduce a una constelación de fotografías y recuerdos de una vida. El recorrido no muestra los nombres de las mujeres y niñas; recuerda sus gustos, estudios, vínculos y proyectos.

El mundo combina contornos de países, una malla geodésica y partículas translúcidas. Las diez constelaciones son nubes irregulares con profundidad; sus colores se toman de los retratos documentados de cada historia. Las fotografías se distribuyen en distintos planos y crecen al acercarse. La rueda y el arrastre funcionan también cuando el cursor está encima de una fotografía.

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

La historia de España se sitúa en El Campillo y reúne la trayectoria de una profesora y artista, documentada en su archivo oficial. Se incorporaron tres historias: una estudiante de cine y música en Ciudad del Cabo, una artista en Islamabad y una corredora con medallas mundiales en Iten. Los resultados deportivos se presentan con sus fechas históricas.

Cada toma aparece una sola vez en su constelación. El archivo incluye retratos diferentes, fotografías familiares y una caligrafía de la artista de Islamabad, identificada como obra suya. Un collage de Bogotá contiene dos fotografías distintas, mostradas por separado. Los recuerdos que no tienen otra fotografía verificada se presentan como textos. No se generaron rostros con inteligencia artificial ni se inventaron sueños, premios o medallas.

Cada imagen tiene un identificador de toma, una procedencia enlazada y un crédito. Los encuadres de algunos archivos se definen mediante SVG en la interfaz, conservando el archivo original: permiten separar las fotografías de un collage o mostrar un retrato sin textos identificativos. Las comprobaciones de contenido detectan identificadores repetidos y etiquetas con nombres; la revisión visual comprueba las personas, las tomas y los textos dentro de las imágenes.

Los dos casos inicialmente propuestos de Kenia e India fueron sustituidos, a petición de la autora del proyecto, por casos documentados de Italia y Turquía.

## Créditos

Texto de apertura proporcionado por la autora del proyecto: Cristina Rivera Garza, *El invencible verano de Liliana* (2021). Las fuentes y créditos específicos de recuerdos y fotografías se incluyen en cada constelación. Las fotos pertenecen a sus respectivos autores y familias; su inclusión en esta obra educativa no supone una licencia general de redistribución.

Imagen terrestre de NASA distribuida en los ejemplos de Three.js. Geografía de Natural Earth, distribuida en los ejemplos de globe.gl. Three.js: MIT. Tipografías Cormorant Garamond y DM Sans: SIL Open Font License; licencias incluidas en `assets/fonts/`.
