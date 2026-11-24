// El recorrido usa identificadores neutros. Las fuentes conservan su atribución original.
const source = (title, url) => ({ title, url });
const F = 'https://animalpolitico.com/2020/02/fatima-semblanza-perfil-doctora-ayuda-otros';
const L = 'https://magis.iteso.mx/nota/cristina-rivera-garza-y-el-lenguaje-de-la-justicia/';
const LP = 'https://www.penguinlibros.com/us/revista-lengua/entrevistas/Cristina-Rivera-Garza-Selva-Almada-Liliana-Rivera-Garza';
const LV = 'https://www.flad-la.org/biblioteca/1NkYHluERyE4DPpuK9gveYC0oHM0WfBfcnlzOORj.pdf';
const C = 'https://www.agenciapi.co/investigacion/regiones/la-vida-tras-el-asesinato-de-la-nina-yuliana-samboni';
const E = 'https://totananoticias.com/comunicado-familia-y-amistades-proximas-familia-claudia-abigail';
const ES = 'https://mujeresdelsur.es/el-novio-de-claudia-abigail-confiesa-su-crimen-machista/';
const I = 'https://parma.bologna.repubblica.it/cronaca/2024/04/18/news/cecchettin_a_parma_presenta_cara_giulia_ho_provato_odio_e_desiderio_di_vendetta_poi_ho_scelto_il_bene_lei_esempio_che_ha-422563900/';
const IF = 'https://www.vanityfair.it/article/per-tutte-le-giulia-da-salvare-podcast-giulia-cecchettin';
const T = 'https://www.ahaber.com.tr/yasam/2015/02/22/ilahi-adaletin-tecellisini-bekliyoruz';
function memory(title, description, kind, sourceUrl, image = null, position = '50% 40%') {
  return { title, description, kind, source: sourceUrl, image: image ? `assets/portraits/${image}` : null, position };
}
export const stories = [
  {
    id: 'm1', place: 'Xochimilco, Ciudad de México', lat: 19.26, lng: -99.02, offset: [-40, 28],
    credit: 'Fotografía difundida por Reuters / BBC News Mundo.',
    note: 'Recuerdos de su hermana y de sus vecinos, recogidos por Animal Político. El retrato procede de una fotografía publicada por BBC News Mundo. Se conserva la misma imagen en varios encuadres.',
    sources: [source('Testimonios de su familia y su comunidad · Animal Político', F), source('Procedencia de la fotografía · BBC News Mundo', 'https://www.bbc.com/mundo/noticias-america-latina-51540101')],
    memories: [
      memory('Quería ser doctora.', 'Su hermana recordó que soñaba con curar y ayudar a niñas y niños que vivían en la calle.', 'Un sueño', F, 'm1.webp'),
      memory('Ayudar a los demás.', 'Imaginaba tener dinero para que otros niños pudieran comer y vestirse. El cuidado de los demás formaba parte de sus sueños.', 'Lo que deseaba', F, 'm1.webp', '35% 40%'),
      memory('Preguntar por todo.', 'Sus vecinos la recordaban curiosa: una respuesta despertaba en ella otra pregunta.', 'Su curiosidad', F, 'm1.webp', '55% 30%'),
      memory('Los dulces de la papelería.', 'Entre sus dulces favoritos estaban los borrachitos, que compraba en el negocio de su barrio.', 'Un gusto', F, 'm1.webp'),
      memory('Reír frente a la pantalla.', 'Le gustaba ver Peppa Pig y El Chavo del Ocho con otra niña del vecindario.', 'Una alegría', F, 'm1.webp', '45% 50%'),
      memory('Comenzaba la primaria.', 'Había empezado su primer año de escuela primaria. Su comunidad la recuerda risueña.', 'Su vida cotidiana', F, 'm1.webp')
    ]
  },
  {
    id: 'm2', place: 'Azcapotzalco, Ciudad de México', lat: 19.5, lng: -99.18, offset: [-5, -36],
    credit: 'Archivo personal de Cristina Rivera Garza, publicado en Magis, ITESO.',
    note: 'Los recuerdos se apoyan en el archivo familiar y en entrevistas de su hermana. La fotografía pertenece al archivo personal de la autora. No se atribuyen premios deportivos que no hayan sido documentados.',
    sources: [source('El archivo familiar y la memoria · Magis, ITESO', L), source('Conversación con la autora · Penguin Libros', LP), source('Lectura de su vida universitaria · Universidad Autónoma Metropolitana', 'https://www.uam.mx/difusion/casadeltiempo/06-dic-ene-2023/casa_del_tiempo_eVI_num_06_54_57.pdf'), source('Natación, música y proyectos · Campus Cultural, Tec de Monterrey', 'https://revistacampuscultural.tec.mx/sites/g/files/vgjovo1461/files/revista-campus-cultural-149_2.pdf')],
    memories: [
      memory('Estudiaba arquitectura.', 'Era estudiante de Arquitectura en la Universidad Autónoma Metropolitana, unidad Azcapotzalco.', 'Un proyecto', L, 'm2.jpg'),
      memory('Nadar, una y otra vez.', 'La natación acompañó su infancia y su adolescencia. Participó en competencias locales y nacionales.', 'Una pasión', 'https://revistacampuscultural.tec.mx/sites/g/files/vgjovo1461/files/revista-campus-cultural-149_2.pdf', 'm2.jpg', '65% 30%'),
      memory('Cartas para sus amistades.', 'Escribía cartas y conservaba copias. Sus cuadernos guardaron notas fechadas, pensamientos y momentos de su vida.', 'Su voz', LP, 'm2.jpg', '65% 45%'),
      memory('Una cámara a todas partes.', 'Llevaba consigo una pequeña cámara de fotos. También guardaba postales y tarjetas.', 'Lo que atesoraba', LP, 'm2.jpg'),
      memory('Soñaba con estudiar en Londres.', 'Entre sus proyectos estaba continuar sus estudios con un posgrado en Londres.', 'Un horizonte', 'https://revistacampuscultural.tec.mx/sites/g/files/vgjovo1461/files/revista-campus-cultural-149_2.pdf', 'm2.jpg', '55% 50%'),
      memory('Casetes llenos de música.', 'Escuchaba a U2, Serrat y Nacha Pop. Grababa casetes, dibujaba y escribía.', 'Un gusto', 'https://revistacampuscultural.tec.mx/sites/g/files/vgjovo1461/files/revista-campus-cultural-149_2.pdf', 'm2.jpg')
    ]
  },
  {
    id: 'm3', place: 'Coyoacán, Ciudad de México', lat: 19.33, lng: -99.18, offset: [39, 11],
    credit: 'Archivo del Centro de Derechos Humanos Fray Francisco de Vitoria; retrato incluido en su dossier de prensa, página 7.',
    note: 'Recuerdos documentados por el Centro de Derechos Humanos Fray Francisco de Vitoria y por su familia. Las imágenes acompañan diferentes facetas de la misma vida.',
    sources: [source('Semblanza y proyecto de vida · Centro de Derechos Humanos Fray Francisco de Vitoria', LV), source('Recuerdos de sus compañeras de música · El Siglo de Durango', 'https://www.elsiglodedurango.com.mx/noticia/2017/la-vida-de-lesvy-berlin.html')],
    memories: [
      memory('Soñaba con recorrer el mundo.', 'Viajar alrededor del mundo formaba parte de su proyecto de vida.', 'Un sueño', LV, 'm3.jpg'),
      memory('La música y sus amigas.', 'Formaba parte de la Estudiantina Femenil de la UNAM, donde compartía ensayos, conciertos y viajes.', 'Una pasión', 'https://www.elsiglodedurango.com.mx/noticia/2017/la-vida-de-lesvy-berlin.html', 'm3.jpg', '45% 35%'),
      memory('Aprender otras lenguas.', 'Hablaba inglés, francés, italiano y catalán. Quería estudiar la licenciatura en Lengua Inglesa.', 'Un logro y una meta', LV, 'm3.jpg'),
      memory('Volver a El Principito.', 'Le encantaban los cuentos. El Principito era uno de sus favoritos.', 'Un libro querido', LV, 'm3.jpg', '55% 35%'),
      memory('Cocinar, pintar, crear.', 'Disfrutaba la cocina y las artes plásticas. Encontraba distintas formas de expresarse.', 'Sus intereses', LV, 'm3.jpg'),
      memory('Helados y platos de pasta.', 'Los helados, las pastas y las ensaladas estaban entre sus gustos cotidianos.', 'Pequeñas alegrías', LV, 'm3.jpg', '50% 45%')
    ]
  },
  {
    id: 'c1', place: 'Bogotá, Colombia', lat: 4.65, lng: -74.06,
    credit: 'Fotografías familiares difundidas en medios y reproducidas por Infobae. Crédito de la publicación: redes sociales / X.',
    note: 'Los recuerdos provienen de una entrevista con su padre. Las fotografías la muestran jugando con una corona y un vestido. Sus sueños se presentan como los deseos cambiantes de una niña, sin convertirlos en una profesión ya elegida.',
    sources: [source('Los recuerdos de su padre · Agencia de Periodismo Investigativo', C), source('Fotografías familiares · Archivo fotográfico de Infobae', 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/SW4QMTINZ5AN3LDO5QBYLFWX24.jpg')],
    memories: [
      memory('A veces, ser enfermera.', 'Su padre recordaba que uno de sus sueños era ser enfermera. Tenía muchas ideas sobre lo que quería llegar a ser.', 'Un sueño', C, 'c1.jpg', '75% 35%'),
      memory('A veces, ser reina.', 'Jugaba a desfilar con una corona plateada de plástico que su papá le había comprado.', 'Un juego', C, 'c1.jpg', '70% 40%'),
      memory('Le gustaba estudiar.', 'Su padre la recuerda como una niña a la que le gustaba mucho estudiar.', 'Su curiosidad', C, 'c1.jpg'),
      memory('Jugar con su hermana.', 'Las dos jugaban a modelar. La imaginación y los juegos compartidos eran parte de su infancia.', 'Un vínculo', C, 'c1.jpg', '65% 45%'),
      memory('Una niña alegre.', 'Su familia la recuerda carismática y alegre. Esa vida cotidiana también merece permanecer en la memoria.', 'Cómo la recuerdan', C, 'c1.jpg')
    ]
  },
  {
    id: 'e1', place: 'Totana, España', lat: 37.77, lng: -1.5,
    credit: '',
    note: 'Por ahora no contamos con un retrato verificado ni con testimonios públicos suficientes sobre sus gustos y sueños. Esta constelación usa formas simbólicas, no fotografías de otra persona. La información disponible permite recordar su etapa de estudiante y su vínculo con Totana. Su familia pidió intimidad en su comunicado.',
    sources: [source('Comunicado de su familia y amistades · Totana Noticias', E), source('Su etapa de estudiante · Mujeres del Sur', ES)],
    memories: [
      memory('Una vida en Totana.', 'Su familia cuenta que sus hijos nacieron en Totana y que se sienten parte de su comunidad.', 'Un lugar propio', E),
      memory('Su etapa de estudiante.', 'Había estudiado en el instituto Juan de la Cierva de Totana.', 'Parte de su historia', ES),
      memory('Más de lo que un registro cuenta.', 'Faltan testimonios verificados sobre sus sueños y sus gustos. Dejamos este espacio abierto para sus recuerdos, sin inventarlos.', 'Un archivo por completar', E)
    ]
  },
  {
    id: 'e2', place: 'Fossò, Italia', lat: 45.39, lng: 12.05,
    credit: 'Retrato familiar difundido por Rai News, noviembre de 2023.',
    note: 'Los recuerdos se basan en los testimonios de su padre. El retrato fue publicado por Rai News. La localidad se documenta en la cobertura de Associated Press.',
    sources: [source('Su proyecto de ilustrar libros · Testimonio de su padre, la Repubblica', I), source('Sus libros y su cumpleaños · Vanity Fair Italia', IF), source('Procedencia del retrato · Rai News', 'https://www.rainews.it/tgr/lazio/articoli/2023/11/donne-vittime-di-violenza-a-grottaferrata-una-nuova-struttura-pronta-ad-accoglierle-giulia-cecchettin-gualtieri-7e597fcc-e3df-4668-a86f-52e307a0ae88.html'), source('Localidad documentada · Associated Press', 'https://apnews.com/article/868aea144441ca5eadc127b74faaa4c5')],
    memories: [
      memory('Ilustrar libros para la infancia.', 'Soñaba con convertirse en ilustradora de libros infantiles. Su padre recuerda la alegría con la que compartió ese deseo.', 'Un sueño', I, 'e2.jpg'),
      memory('La ingeniería y el dibujo.', 'Estudiaba Ingeniería Biomédica y quería seguir aprendiendo ilustración. Ambos intereses formaban parte de su futuro.', 'Sus proyectos', IF, 'e2.jpg'),
      memory('Había conseguido un lugar.', 'Fue admitida en la escuela de cómic de Reggio Emilia, según el testimonio de su padre.', 'Un logro', I, 'e2.jpg', '50% 30%'),
      memory('Libros para su cumpleaños.', 'Para celebrar sus veintidós años eligió comprar libros y pasar tiempo con su familia.', 'Una alegría', IF, 'e2.jpg'),
      memory('Tiempo con su familia.', 'En su casa decidieron regalarse tiempo juntos en los cumpleaños. Su padre conserva el recuerdo de esos momentos.', 'Lo que compartía', IF, 'e2.jpg')
    ]
  },
  {
    id: 'a1', place: 'Tarsus, Turquía', lat: 36.92, lng: 34.9,
    credit: 'Retrato publicado por Habertürk TV, septiembre de 2015.',
    note: 'Los recuerdos son síntesis en español de una entrevista en turco con su madre y su padre. Se conservaron solamente intereses y proyectos expresados por ellos.',
    sources: [source('Recuerdos y sueños contados por sus padres · A Haber / Pazar Sabah', T), source('Procedencia del retrato · Habertürk TV', 'https://tv.haberturk.com/gundem/video/ozgecan-aslan-davasinda-son-durum/149006')],
    memories: [
      memory('Quería ser psicóloga.', 'Su madre contó que soñaba con ejercer la psicología y ayudar a otras personas.', 'Un sueño', T, 'a1.jpg'),
      memory('Ahorraba para comprar libros.', 'Destinaba parte de sus ahorros a comprar libros. Leer ocupaba un lugar importante en sus días.', 'Una pasión', T, 'a1.jpg', '55% 40%'),
      memory('Siempre una pregunta más.', 'Su padre la recuerda muy curiosa. Compartía con él las preguntas que le dejaban sus lecturas.', 'Su curiosidad', T, 'a1.jpg'),
      memory('Contagiar el amor por leer.', 'Su madre contó que animaba a sus hermanos a leer y que también le recomendaba libros a ella.', 'Lo que compartía', T, 'a1.jpg', '50% 30%'),
      memory('Terminar sus estudios.', 'Quería completar la universidad y ejercer su profesión. Su familia recuerda la dedicación que ponía en estudiar.', 'Una meta', T, 'a1.jpg')
    ]
  }
];
