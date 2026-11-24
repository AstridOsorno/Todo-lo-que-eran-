// El recorrido usa identificadores neutros. Las fuentes conservan su atribución original.
const source = (title, url) => ({ title, url });
const F = 'https://animalpolitico.com/2020/02/fatima-semblanza-perfil-doctora-ayuda-otros';
const L = 'https://magis.iteso.mx/nota/cristina-rivera-garza-y-el-lenguaje-de-la-justicia/';
const LP = 'https://www.penguinlibros.com/us/revista-lengua/entrevistas/Cristina-Rivera-Garza-Selva-Almada-Liliana-Rivera-Garza';
const LV = 'https://www.flad-la.org/biblioteca/1NkYHluERyE4DPpuK9gveYC0oHM0WfBfcnlzOORj.pdf';
const C = 'https://www.agenciapi.co/investigacion/regiones/la-vida-tras-el-asesinato-de-la-nina-yuliana-samboni';
const E = 'https://lauraluelmo.com/en/about_lauraluelmo/';
const ES = 'https://www.lavanguardia.com/sucesos/20181219/453641919319/laura-luelmo-profesora-huelva-redes.html';
const I = 'https://parma.bologna.repubblica.it/cronaca/2024/04/18/news/cecchettin_a_parma_presenta_cara_giulia_ho_provato_odio_e_desiderio_di_vendetta_poi_ho_scelto_il_bene_lei_esempio_che_ha-422563900/';
const IF = 'https://www.vanityfair.it/article/per-tutte-le-giulia-da-salvare-podcast-giulia-cecchettin';
const T = 'https://www.ahaber.com.tr/yasam/2015/02/22/ilahi-adaletin-tecellisini-bekliyoruz';
const TP = 'https://www.ahaber.com.tr/galeri/yasam/ozgecan-aslan-fotograflari-ozgecan-aslan-icin-yazilan-sozler-ve-mesajlar';
const U = 'https://kingswoodcollege.com/2020/04/20/in-celebration-of-uyinene-mrwetyana-born-20-april-2000/';
const UC = 'https://www.news.uct.ac.za/article/-2021-03-29-annual-lecture-launched-in-honour-of-uyinene-mrwetyana';
const N = 'https://images.dawn.com/news/1188995';
const NA = 'https://english.aaj.tv/news/amp/30273331';
const A = 'https://worldathletics.org/news/news/agnes-tirop-obituary';
const AR = 'https://worldathletics.org/news/report/agnes-tirop-world-10km-record-herzogenaurach';
function memory(title, description, kind, sourceUrl, image = null, position = '50% 40%', photo = {}) {
  return {
    title, description, kind, source: sourceUrl,
    image: image ? `assets/portraits/${image}` : null, position,
    photoId: image ? image : null,
    imageAlt: 'Fotografía del archivo de esta vida', imageSource: sourceUrl,
    ...photo
  };
}
export const stories = [
  {
    id: 'm1', place: 'Xochimilco, Ciudad de México', lat: 19.26, lng: -99.02, offset: [-40, 28],
    credit: 'Fotografía difundida por Reuters / BBC News Mundo.',
    note: 'Recuerdos de su hermana y de sus vecinos, recogidos por Animal Político. El retrato procede de una fotografía publicada por BBC News Mundo. Se presenta una sola vez; los demás recuerdos se conservan como textos.',
    sources: [source('Testimonios de su familia y su comunidad · Animal Político', F), source('Procedencia de la fotografía · BBC News Mundo', 'https://www.bbc.com/mundo/noticias-america-latina-51540101')],
    memories: [
      memory('Quería ser doctora.', 'Su hermana recordó que soñaba con curar y ayudar a niñas y niños que vivían en la calle.', 'Un sueño', F, 'm1.webp', '50% 40%', { crop: [260, 65, 260, 300, 800, 450], imageSource: 'https://www.bbc.com/mundo/noticias-america-latina-51540101' }),
      memory('Ayudar a los demás.', 'Imaginaba tener dinero para que otros niños pudieran comer y vestirse. El cuidado de los demás formaba parte de sus sueños.', 'Lo que deseaba', F),
      memory('Preguntar por todo.', 'Sus vecinos la recordaban curiosa: una respuesta despertaba en ella otra pregunta.', 'Su curiosidad', F),
      memory('Los dulces de la papelería.', 'Entre sus dulces favoritos estaban los borrachitos, que compraba en el negocio de su barrio.', 'Un gusto', F),
      memory('Reír frente a la pantalla.', 'Le gustaba ver Peppa Pig y El Chavo del Ocho con otra niña del vecindario.', 'Una alegría', F),
      memory('Comenzaba la primaria.', 'Había empezado su primer año de escuela primaria. Su comunidad la recuerda risueña.', 'Su vida cotidiana', F)
    ]
  },
  {
    id: 'm2', place: 'Azcapotzalco, Ciudad de México', lat: 19.5, lng: -99.18, offset: [-5, -36],
    credit: 'Archivo personal de Cristina Rivera Garza, publicado en Campus Cultural, Tec de Monterrey, número 149, página 27.',
    note: 'Los recuerdos se apoyan en el archivo familiar y en entrevistas de su hermana. La fotografía pertenece al archivo personal de la autora. No se atribuyen premios deportivos que no hayan sido documentados.',
    sources: [source('El archivo familiar y la memoria · Magis, ITESO', L), source('Conversación con la autora · Penguin Libros', LP), source('Lectura de su vida universitaria · Universidad Autónoma Metropolitana', 'https://www.uam.mx/difusion/casadeltiempo/06-dic-ene-2023/casa_del_tiempo_eVI_num_06_54_57.pdf'), source('Natación, música y proyectos · Campus Cultural, Tec de Monterrey', 'https://revistacampuscultural.tec.mx/sites/g/files/vgjovo1461/files/revista-campus-cultural-149_2.pdf')],
    memories: [
      memory('Estudiaba arquitectura.', 'Era estudiante de Arquitectura en la Universidad Autónoma Metropolitana, unidad Azcapotzalco.', 'Un proyecto', L, 'm2-1.jpg', '65% 40%', { imageSource: 'https://revistacampuscultural.tec.mx/sites/g/files/vgjovo1461/files/revista-campus-cultural-149_2.pdf', imageAlt: 'Archivo familiar: dos hermanas en el jardín' }),
      memory('Nadar, una y otra vez.', 'La natación acompañó su infancia y su adolescencia. Participó en competencias locales y nacionales.', 'Una pasión', 'https://revistacampuscultural.tec.mx/sites/g/files/vgjovo1461/files/revista-campus-cultural-149_2.pdf'),
      memory('Cartas para sus amistades.', 'Escribía cartas y conservaba copias. Sus cuadernos guardaron notas fechadas, pensamientos y momentos de su vida.', 'Su voz', LP),
      memory('Una cámara a todas partes.', 'Llevaba consigo una pequeña cámara de fotos. También guardaba postales y tarjetas.', 'Lo que atesoraba', LP, 'm2-2.jpg', '45% 40%', { imageSource: 'https://revistacampuscultural.tec.mx/sites/g/files/vgjovo1461/files/revista-campus-cultural-149_2.pdf', imageAlt: 'Otra fotografía del mismo encuentro familiar en el jardín' }),
      memory('Soñaba con estudiar en Londres.', 'Entre sus proyectos estaba continuar sus estudios con un posgrado en Londres.', 'Un horizonte', 'https://revistacampuscultural.tec.mx/sites/g/files/vgjovo1461/files/revista-campus-cultural-149_2.pdf'),
      memory('Casetes llenos de música.', 'Escuchaba a U2, Serrat y Nacha Pop. Grababa casetes, dibujaba y escribía.', 'Un gusto', 'https://revistacampuscultural.tec.mx/sites/g/files/vgjovo1461/files/revista-campus-cultural-149_2.pdf')
    ]
  },
  {
    id: 'm3', place: 'Coyoacán, Ciudad de México', lat: 19.33, lng: -99.18, offset: [39, 11],
    credit: 'Archivo del Centro de Derechos Humanos Fray Francisco de Vitoria; retrato incluido en su dossier de prensa, página 7.',
    note: 'Recuerdos documentados por el Centro de Derechos Humanos Fray Francisco de Vitoria y por su familia. Las imágenes acompañan diferentes facetas de la misma vida.',
    sources: [source('Semblanza y proyecto de vida · Centro de Derechos Humanos Fray Francisco de Vitoria', LV), source('Recuerdos de sus compañeras de música · El Siglo de Durango', 'https://www.elsiglodedurango.com.mx/noticia/2017/la-vida-de-lesvy-berlin.html')],
    memories: [
      memory('Soñaba con recorrer el mundo.', 'Viajar alrededor del mundo formaba parte de su proyecto de vida.', 'Un sueño', LV, 'm3.jpg'),
      memory('La música y sus amigas.', 'Formaba parte de la Estudiantina Femenil de la UNAM, donde compartía ensayos, conciertos y viajes.', 'Una pasión', 'https://www.elsiglodedurango.com.mx/noticia/2017/la-vida-de-lesvy-berlin.html'),
      memory('Aprender otras lenguas.', 'Hablaba inglés, francés, italiano y catalán. Quería estudiar la licenciatura en Lengua Inglesa.', 'Un logro y una meta', LV),
      memory('Volver a El Principito.', 'Le encantaban los cuentos. El Principito era uno de sus favoritos.', 'Un libro querido', LV),
      memory('Cocinar, pintar, crear.', 'Disfrutaba la cocina y las artes plásticas. Encontraba distintas formas de expresarse.', 'Sus intereses', LV),
      memory('Helados y platos de pasta.', 'Los helados, las pastas y las ensaladas estaban entre sus gustos cotidianos.', 'Pequeñas alegrías', LV)
    ]
  },
  {
    id: 'c1', place: 'Bogotá, Colombia', lat: 4.65, lng: -74.06,
    credit: 'Fotografías familiares difundidas en medios y reproducidas por Infobae. Crédito de la publicación: redes sociales / X.',
    note: 'Los recuerdos provienen de una entrevista con su padre. Las fotografías la muestran jugando con una corona y un vestido. Sus sueños se presentan como los deseos cambiantes de una niña, sin convertirlos en una profesión ya elegida.',
    sources: [source('Los recuerdos de su padre · Agencia de Periodismo Investigativo', C), source('Fotografías familiares · Archivo fotográfico de Infobae', 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/SW4QMTINZ5AN3LDO5QBYLFWX24.jpg')],
    memories: [
      memory('A veces, ser enfermera.', 'Su padre recordaba que uno de sus sueños era ser enfermera. Tenía muchas ideas sobre lo que quería llegar a ser.', 'Un sueño', C, 'c1.jpg', '50% 40%', { photoId: 'c1-vestido', crop: [0, 0, 960, 1080, 1920, 1080], imageSource: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/SW4QMTINZ5AN3LDO5QBYLFWX24.jpg' }),
      memory('A veces, ser reina.', 'Jugaba a desfilar con una corona plateada de plástico que su papá le había comprado.', 'Un juego', C, 'c1.jpg', '50% 40%', { photoId: 'c1-camiseta', crop: [970, 0, 950, 1080, 1920, 1080], imageSource: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/SW4QMTINZ5AN3LDO5QBYLFWX24.jpg' }),
      memory('Le gustaba estudiar.', 'Su padre la recuerda como una niña a la que le gustaba mucho estudiar.', 'Su curiosidad', C),
      memory('Jugar con su hermana.', 'Las dos jugaban a modelar. La imaginación y los juegos compartidos eran parte de su infancia.', 'Un vínculo', C),
      memory('Una niña alegre.', 'Su familia la recuerda carismática y alegre. Esa vida cotidiana también merece permanecer en la memoria.', 'Cómo la recuerdan', C)
    ]
  },
  {
    id: 'e1', place: 'El Campillo, España', lat: 37.69, lng: -6.63,
    credit: 'Archivo personal y profesional difundido en su página oficial y en prensa.',
    note: 'Su página oficial conserva su biografía, sus estudios y su obra. Los recuerdos distinguen sus logros de los proyectos que seguía desarrollando. La localidad del punto corresponde a El Campillo, Huelva. Cada fotografía aparece una sola vez.',
    sources: [source('Biografía y trayectoria artística · Archivo oficial', E), source('Caricaturas y talleres · Archivo oficial', 'https://lauraluelmo.com/obra-artistica_lauraluelmo/obra-en-papel/caricaturas/'), source('Vocación docente y viajes · La Vanguardia', ES), source('Retrato difundido en prensa · El Español', 'https://www.elespanol.com/castilla-y-leon/region/zamora/20211114/laura-luelmo-crimen-joven-profesora-conmociono-espana/626187706_0.html')],
    memories: [
      memory('Quería enseñar arte.', 'Dejó su trabajo como fotógrafa para preparar las oposiciones de profesora de secundaria. Enseñar dibujo era su vocación.', 'Una vocación', E, 'e1-1.jpg', '50% 40%', { imageSource: 'https://www.elespanol.com/castilla-y-leon/region/zamora/20211114/laura-luelmo-crimen-joven-profesora-conmociono-espana/626187706_0.html', imageCredit: 'Retrato personal difundido por El Español.' }),
      memory('Aprender en México.', 'Durante su intercambio en Puebla, en 2013 y 2014, expuso pintura y fotografía. El arte también la llevó a conocer otros lugares.', 'Una experiencia', E, 'e1-3.jpg', '50% 35%', { imageSource: 'https://www.elespanol.com/reportajes/20181216/senal-movil-ultimo-rastro-laura-profesora-desaparecida/360964432_0.html', imageCredit: 'Fotografía personal difundida por El Español.' }),
      memory('Mirar a través de una cámara.', 'Trabajó como fotógrafa en Lanzarote y en Cádiz. Le interesaban la luz, las perspectivas y los paisajes urbanos.', 'Una profesión', E, 'e1-4.png', '50% 40%', { crop: [0, 0, 640, 360, 640, 422], imageAlt: 'Fotografía de su archivo profesional con una cámara', imageCredit: 'Archivo profesional de la artista, página oficial.' }),
      memory('Caricaturas para compartir.', 'En 2016 impartió un taller de caricaturas cervantinas en el Museo de la Biblioteca Nacional de España. También creó talleres para niñas y niños.', 'Un logro', 'https://lauraluelmo.com/obra-artistica_lauraluelmo/obra-en-papel/caricaturas/'),
      memory('Pintura, dibujo y diseño.', 'Se graduó en Bellas Artes y cursó estudios de diseño y formación docente. Experimentaba con el grabado, el collage y las texturas.', 'Su formación', E, 'e1-5.png', '50% 50%', { imageCredit: 'Retrato del currículum de la artista, página oficial.' }),
      memory('Musgos y líquenes del Duero.', 'En 2018 comenzó un proyecto sobre los musgos y líquenes de los Arribes del Duero. Reunía imágenes de paisajes entre España y Portugal.', 'Un proyecto en marcha', E)
    ]
  },
  {
    id: 'e2', place: 'Fossò, Italia', lat: 45.39, lng: 12.05,
    credit: 'Fotografías personales difundidas por Rai News, NewsMondo y Fanpage.',
    note: 'Los recuerdos se basan en los testimonios de su padre. El retrato fue publicado por Rai News. La localidad se documenta en la cobertura de Associated Press.',
    sources: [source('Su proyecto de ilustrar libros · Testimonio de su padre, la Repubblica', I), source('Sus libros y su cumpleaños · Vanity Fair Italia', IF), source('Procedencia del retrato · Rai News', 'https://www.rainews.it/tgr/lazio/articoli/2023/11/donne-vittime-di-violenza-a-grottaferrata-una-nuova-struttura-pronta-ad-accoglierle-giulia-cecchettin-gualtieri-7e597fcc-e3df-4668-a86f-52e307a0ae88.html'), source('Localidad documentada · Associated Press', 'https://apnews.com/article/868aea144441ca5eadc127b74faaa4c5')],
    memories: [
      memory('Ilustrar libros para la infancia.', 'Soñaba con convertirse en ilustradora de libros infantiles. Su padre recuerda la alegría con la que compartió ese deseo.', 'Un sueño', I, 'e2.jpg', '50% 40%', { imageSource: 'https://www.rainews.it/dl/img/2023/11/20/1700504486146_giulia.jpg', imageCredit: 'Fotografía personal difundida por Rai News.' }),
      memory('La ingeniería y el dibujo.', 'Estudiaba Ingeniería Biomédica y quería seguir aprendiendo ilustración. Ambos intereses formaban parte de su futuro.', 'Sus proyectos', IF, 'e2-2.jpg', '50% 40%', { imageSource: 'https://newsmondo.it/wp-content/uploads/2023/11/DP_Giulia_Cecchettin-768x512.jpg', imageCredit: 'Fotografía personal difundida por NewsMondo.' }),
      memory('Había conseguido un lugar.', 'Fue admitida en la escuela de cómic de Reggio Emilia, según el testimonio de su padre.', 'Un logro', I, 'e2-3.jpg', '50% 40%', { imageSource: 'https://www.fanpage.it/attualita/cosa-e-cambiato-a-un-anno-dal-femminicidio-di-giulia-cecchettin/', imageCredit: 'Fotografía personal difundida por Fanpage.' }),
      memory('Libros para su cumpleaños.', 'Para celebrar sus veintidós años eligió comprar libros y pasar tiempo con su familia.', 'Una alegría', IF, 'e2-4.jpg', '50% 40%', { imageSource: 'https://www.fanpage.it/live/processo-filippo-turetta-giulia-cecchettin-diretta-venerdi-25-ottobre/', imageCredit: 'Fotografía personal difundida por Fanpage.' }),
      memory('Tiempo con su familia.', 'En su casa decidieron regalarse tiempo juntos en los cumpleaños. Su padre conserva el recuerdo de esos momentos.', 'Lo que compartía', IF)
    ]
  },
  {
    id: 'a1', place: 'Tarsus, Turquía', lat: 36.92, lng: 34.9,
    credit: 'Fotografías personales difundidas por Habertürk TV y la galería de A Haber.',
    note: 'Los recuerdos son síntesis en español de una entrevista en turco con su madre y su padre. Se conservaron solamente intereses y proyectos expresados por ellos.',
    sources: [source('Recuerdos y sueños contados por sus padres · A Haber / Pazar Sabah', T), source('Archivo de fotografías personales · A Haber', TP), source('Procedencia del retrato · Habertürk TV', 'https://tv.haberturk.com/gundem/video/ozgecan-aslan-davasinda-son-durum/149006')],
    memories: [
      memory('Quería ser psicóloga.', 'Su madre contó que soñaba con ejercer la psicología y ayudar a otras personas.', 'Un sueño', T, 'a1.jpg', '50% 40%', { imageSource: 'https://tv.haberturk.com/gundem/video/ozgecan-aslan-davasinda-son-durum/149006' }),
      memory('Ahorraba para comprar libros.', 'Destinaba parte de sus ahorros a comprar libros. Leer ocupaba un lugar importante en sus días.', 'Una pasión', T, 'a1-10.jpg', '55% 40%', { imageSource: TP }),
      memory('Siempre una pregunta más.', 'Su padre la recuerda muy curiosa. Compartía con él las preguntas que le dejaban sus lecturas.', 'Su curiosidad', T, 'a1-11.jpg', '65% 40%', { imageSource: TP }),
      memory('Contagiar el amor por leer.', 'Su madre contó que animaba a sus hermanos a leer y que también le recomendaba libros a ella.', 'Lo que compartía', T, 'a1-13.jpg', '50% 40%', { imageSource: TP }),
      memory('Terminar sus estudios.', 'Quería completar la universidad y ejercer su profesión. Su familia recuerda la dedicación que ponía en estudiar.', 'Una meta', T, 'a1-12.jpg', '35% 40%', { imageSource: TP })
    ]
  },
  {
    id: 'f1', place: 'Ciudad del Cabo, Sudáfrica', lat: -33.99, lng: 18.47,
    credit: 'Fotografías personales difundidas por P.M. News, Sowetan y Kingswood College.',
    note: 'Su madre escribió una semblanza publicada por su colegio. La Universidad de Ciudad del Cabo documenta sus estudios de cine y medios. Las fotografías son tres tomas distintas de su archivo público; la imagen de cumpleaños se encuadra sobre el retrato.',
    sources: [source('Una vida recordada por su madre · Kingswood College', U), source('Sus estudios y su compromiso · Universidad de Ciudad del Cabo', UC), source('Retrato de su archivo público · P.M. News', 'https://pmnewsnigeria.com/2019/08/28/south-africa-where-is-uyinene-mrwetyana-missing-since-saturday/'), source('Otro retrato personal · Sowetan', 'https://www.sowetan.co.za/news/south-africa/2019-09-17-post-office-fires-employee-suspected-of-killing-uyinene-mrwetyana/')],
    memories: [
      memory('Estudiaba cine y medios.', 'Cursaba su primer año en el Centro de Estudios de Cine y Medios de la Universidad de Ciudad del Cabo.', 'Un camino', UC, 'f1-1.jpg', '50% 35%', { imageSource: 'https://pmnewsnigeria.com/2019/08/28/south-africa-where-is-uyinene-mrwetyana-missing-since-saturday/', imageCredit: 'Retrato personal difundido por P.M. News.' }),
      memory('El saxofón y la música.', 'Tocaba el saxofón. Su madre recuerda las prácticas y los juegos musicales que compartía con una amiga.', 'Una pasión', U, 'f1-2.jpg', '50% 35%', { imageSource: 'https://www.sowetan.co.za/news/south-africa/2019-09-17-post-office-fires-employee-suspected-of-killing-uyinene-mrwetyana/', imageCredit: 'Fotografía personal difundida por Sowetan.' }),
      memory('Bailar para volver a reír.', 'En época de exámenes organizaba bailes entre sus amistades para aliviar la tensión. Su madre recordaba su risa contagiosa.', 'Una alegría', U, 'f1-3.jpg', '50% 40%', { crop: [620, 0, 379, 870, 999, 902], cardCrop: [630, 120, 369, 500, 999, 902], imageCredit: 'Retrato incluido en el homenaje de cumpleaños de Kingswood College.' }),
      memory('Hacer sitio a quien llegaba.', 'Su familia contaba que se sentaba junto a las personas nuevas en clase y les ofrecía su amistad.', 'Su forma de cuidar', U),
      memory('Alzar la voz por la igualdad.', 'Cuestionaba el racismo, el sexismo y la discriminación. La justicia y la igualdad formaban parte de sus conversaciones cotidianas.', 'Sus convicciones', U),
      memory('Ayudar en el camino.', 'Su madre relató cómo dejó a sus amigas para ayudar a un hombre a subir una cuesta en su silla de ruedas, conversando con él durante el trayecto.', 'Un recuerdo', U)
    ]
  },
  {
    id: 'a2', place: 'Islamabad, Pakistán', lat: 33.72, lng: 73.06,
    credit: 'Retratos personales difundidos por The News, Geo News y Dawn. Fotografía de su caligrafía: exposición documentada por Dawn Images.',
    note: 'Los recuerdos se apoyan en testimonios de su madre y su padre durante una exposición de su obra. Se incluyen tres retratos diferentes y una fotografía de una caligrafía creada por ella; no se atribuyen como suyas las obras de otras artistas que participaron en el homenaje.',
    sources: [source('Su pintura y caligrafía, recordadas por su familia · Dawn Images', N), source('El testimonio de su padre · Aaj English', NA), source('Procedencia de un retrato · The News', 'https://www.thenews.com.pk/print/932329-noor-mukadam-was-killed-by-someone-else-zahir'), source('Procedencia de otro retrato · Geo News', 'https://www.geo.tv/latest/361510-noor-mukadam-murder-parents-of-zahir-jaffer-arrested-say-police'), source('Retrato en blanco y negro · Dawn Images', 'https://images.dawn.com/news/1189582')],
    memories: [
      memory('Crear desde pequeña.', 'Su padre recordaba que comenzó a hacer arte desde muy joven. En los últimos años había profundizado su interés por pintar.', 'Una pasión', N, 'a2-1.jpg', '70% 35%', { imageSource: 'https://www.thenews.com.pk/print/932329-noor-mukadam-was-killed-by-someone-else-zahir', imageCredit: 'Fotografía personal difundida por The News.' }),
      memory('Colores que sorprendían.', 'Su familia admiraba la manera en que elegía y combinaba los colores. La pintura era una forma de expresar su sensibilidad.', 'Su mirada', N, 'a2-2.jpg', '50% 40%', { imageSource: 'https://www.geo.tv/assets/uploads/updates/2021-07-25/361510_9435360_updates.jpg', imageCredit: 'Fotografía personal difundida por Geo News.' }),
      memory('Un diario lleno de caligrafía.', 'Caligrafió los 99 nombres de Alá en las páginas de su diario. Esas hojas se enmarcaron para una exposición de su obra.', 'Su creación', N, 'a2-art-1.jpg', '50% 50%', { imageAlt: 'Fotografía de una caligrafía creada por ella, expuesta en una galería', imageCredit: 'Obra de la artista fotografiada en la exposición del PNCA; publicada por Dawn Images.' }),
      memory('Un regalo para su hermana.', 'Pintó un Dumbo de gran tamaño para el baby shower de su hermana. Para enviarlo, lo dividió en piezas que podían volver a unirse.', 'Un gesto de cariño', N, 'a2-3.png', '50% 40%', { imageSource: 'https://images.dawn.com/news/1189582', imageCredit: 'Retrato personal difundido por Dawn Images.' }),
      memory('Cuidar a los animales.', 'Su padre describió su amor por las personas y los animales. Recordaba una personalidad llena de afecto.', 'Lo que amaba', NA),
      memory('Su obra llegó a una galería.', 'En diciembre de 2021 se reunieron sus pinturas y caligrafías en el Consejo Nacional de las Artes de Pakistán, para celebrar su vida y su trabajo.', 'Su legado artístico', N)
    ]
  },
  {
    id: 'f2', place: 'Iten, Kenia', lat: .67, lng: 35.51,
    credit: 'Fotografías de competiciones publicadas por World Athletics. Retrato con bandera: Getty Images, según crédito de la publicación.',
    note: 'Resultados y trayectoria documentados por World Athletics. El récord se presenta como un logro de 2021, sin afirmar que siga vigente. Las fotografías proceden de tres competiciones distintas y se encuadran sin los nombres impresos en los dorsales.',
    sources: [source('Trayectoria y medallas · World Athletics', A), source('La carrera del récord · World Athletics', AR), source('Ratificación del récord de 2021 · World Athletics', 'https://worldathletics.org/news/press-releases/ratified-world-record-10km-5km-tirop-teferi')],
    memories: [
      memory('Dos bronces mundiales.', 'Fue medallista de bronce de los 10.000 metros en los Campeonatos Mundiales de 2017 y 2019.', 'Sus medallas', A, 'f2-1.jpg', '50% 40%', { crop: [0, 0, 600, 220, 600, 400], imageAlt: 'Celebración con la bandera de Kenia en un campeonato mundial', imageCredit: 'Getty Images, publicada por World Athletics.' }),
      memory('Campeona a los diecinueve.', 'Ganó el Campeonato Mundial de campo a través de 2015, en Guiyang. Fue una de las campeonas más jóvenes de esa prueba.', 'Un campeonato', A, 'f2-3.png', '50% 40%', { crop: [0, 0, 750, 290, 750, 500], imageAlt: 'Fotografía de competición en el Mundial de campo a través de 2015', imageCredit: 'Fotografía de la competición publicada por World Athletics.' }),
      memory('Diez kilómetros en 30:01.', 'El 12 de septiembre de 2021 estableció un récord mundial de 10 km en una carrera exclusivamente femenina, en Herzogenaurach.', 'Un logro de 2021', AR, 'f2-2.jpg', '50% 40%', { crop: [1180, 440, 700, 400, 2990, 1825], imageAlt: 'Celebración en la llegada de la carrera de Herzogenaurach de 2021', imageCredit: 'Fotografía de la llegada publicada por World Athletics.' }),
      memory('Una final olímpica.', 'Representó a Kenia en los Juegos Olímpicos de Tokio y terminó cuarta en los 5.000 metros.', 'Juegos Olímpicos', A),
      memory('Podios desde adolescente.', 'Ganó el bronce de los 5.000 metros en los Mundiales Sub-20 de 2012 y 2014.', 'Su trayectoria', A),
      memory('Correr en distintos terrenos.', 'Compitió en campo a través, pista y carretera. Su trayectoria reunió pruebas de diferentes distancias y superficies.', 'Su deporte', A)
    ]
  }
];
