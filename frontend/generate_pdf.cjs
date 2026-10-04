const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function createProjectPDF(outputPath) {
  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    info: {
      Title: 'Manual de Usuario - Proyecto UT02 Acceso a Datos - Moises De Lima',
      Author: 'Moises De Lima',
      Subject: 'Manual de Usuario y Memoria de Evaluación Manejo de Ficheros',
    },
  });

  const stream = fs.createWriteStream(outputPath);
  stream.on('error', (err) => {
    console.warn('⚠️ No se pudo escribir en', outputPath, '(El archivo puede estar abierto en otro programa):', err.message);
  });
  doc.pipe(stream);

  // Palette
  const PRIMARY = '#1e1b4b';   // Dark Deep Blue
  const ACCENT  = '#4f46e5';   // Indigo
  const DARK    = '#0f172a';   // Slate Text

  // Helper Functions
  const addHeader = (subtitle) => {
    doc.rect(0, 0, 595.28, 85).fill(PRIMARY);
    doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('MANUAL DE USUARIO Y EVALUACIÓN', 40, 22);
    doc.fillColor('#a78bfa').fontSize(10).font('Helvetica-Bold').text(subtitle || 'UT02 ACCESO A DATOS · GESTIÓN Y CONVERSIÓN DE FICHEROS', 40, 48);
  };

  // ═════════════════════════════════════════════════════════════
  // PÁGINA 1: PORTADA, DATOS Y PASO 1 (INTRODUCCIÓN DE DATOS)
  // ═════════════════════════════════════════════════════════════
  addHeader('UT02 ACCESO A DATOS · MANEJO DE FICHEROS LOGÍSTICOS');

  // Student Info Box
  let y = 100;
  doc.rect(40, y, 515.28, 65).fillAndStroke('#f8fafc', '#cbd5e1');
  
  doc.fillColor(DARK).fontSize(9.5).font('Helvetica-Bold');
  doc.text('Alumno:', 55, y + 10);
  doc.font('Helvetica').text('Moises De Lima', 115, y + 10);

  doc.font('Helvetica-Bold').text('Curso / Grupo:', 300, y + 10);
  doc.font('Helvetica').text('DAM Noche - Grupo A', 390, y + 10);

  doc.font('Helvetica-Bold').text('Asignatura:', 55, y + 28);
  doc.font('Helvetica').text('Acceso a Datos (UT02)', 115, y + 28);

  doc.font('Helvetica-Bold').text('Año Académico:', 300, y + 28);
  doc.font('Helvetica').text('2026 - 2027', 390, y + 28);

  doc.font('Helvetica-Bold').text('Proyecto:', 55, y + 46);
  doc.font('Helvetica').text('Sistema de Gestión, Conversión e Inspección de Envíos en Ficheros', 115, y + 46);

  // Sección 1: Enlaces de Evaluación
  y += 75;
  doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text('1. ACCESO DIRECTO Y REPOSITORIO DE CÓDIGO FUENTE', 40, y);
  
  y += 16;
  doc.rect(40, y, 515.28, 60).fillAndStroke('#eff6ff', '#bfdbfe');
  doc.fillColor('#1e40af').fontSize(8.5).font('Helvetica-Bold');
  
  doc.text('[WEB] Aplicación Web (Vercel):', 50, y + 10);
  doc.fillColor('#2563eb').font('Helvetica').text('https://proyecto-ficheros-26-27-moises-de-l.vercel.app/', 210, y + 10, { link: 'https://proyecto-ficheros-26-27-moises-de-l.vercel.app/' });

  doc.fillColor('#1e40af').font('Helvetica-Bold').text('[API] Backend REST API (Render):', 50, y + 26);
  doc.fillColor('#2563eb').font('Helvetica').text('https://proyecto-ficheros-backend.onrender.com', 210, y + 26, { link: 'https://proyecto-ficheros-backend.onrender.com' });

  doc.fillColor('#1e40af').font('Helvetica-Bold').text('[GIT] Repositorio GitHub:', 50, y + 42);
  doc.fillColor('#2563eb').font('Helvetica').text('https://github.com/MoiFran/PROYECTO-FICHEROS-26_27-MoisesDeLima', 210, y + 42, { link: 'https://github.com/MoiFran/PROYECTO-FICHEROS-26_27-MoisesDeLima' });

  // Sección 2: Modelo de Datos (Clase Envio)
  y += 72;
  doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text('2. MODELO DE DATOS OBLIGATORIO (CLASE Envio en ut02.model)', 40, y);

  y += 16;
  doc.rect(40, y, 515.28, 65).fillAndStroke('#fcf5ff', '#e9d5ff');
  doc.fillColor('#6b21a8').fontSize(8.5).font('Helvetica-Bold').text('Atributos de la clase Envio:', 50, y + 8);
  doc.fillColor(DARK).fontSize(8).font('Helvetica').text(
    '• numeroCliente (String): Identificador único del cliente (ej. CLI-001)\n' +
    '• numeroSeguimiento (String): Código de rastreo del paquete (ej. SEG-2024-001)\n' +
    '• destino (String): Ciudad y país de destino (ej. Madrid, España)\n' +
    '• peso (Double): Peso del paquete en kilogramos (ej. 2.5 kg)\n' +
    '• fechaEnvio (String/Date): Fecha de salida en formato YYYY-MM-DD\n' +
    '• fechaEstimadaEntrega (String/Date): Fecha programada de recepción en formato YYYY-MM-DD',
    50, y + 20, { width: 495, lineGap: 1.5 }
  );

  // Sección 3: Manual Paso 1 - Introducción de Datos
  y += 77;
  doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text('3. PASO 1 DEL MANUAL: INTRODUCCIÓN DE DATOS Y VALIDACIONES', 40, y);

  y += 16;
  doc.rect(40, y, 515.28, 125).fillAndStroke('#f8fafc', '#cbd5e1');
  doc.fillColor(PRIMARY).fontSize(8.5).font('Helvetica-Bold').text('Procedimiento y Validaciones del Formulario (Bloque 1):', 50, y + 8);
  
  const paso1Steps = [
    '1. Formulario de captura: El usuario introduce los 6 atributos en la interfaz visual interactiva.',
    '2. Validación de campos obligatorios: La aplicación impide el guardado si cualquier campo se deja en blanco.',
    '3. Selector de calendario nativo: Ambos campos de fecha incluyen picker de calendario (<input type="date">).',
    '4. Restricción de Fecha de Envío: No se permite seleccionar fechas anteriores a la fecha actual del sistema.',
    '5. Restricción de Entrega Estimada: La fecha de entrega no puede ser anterior a la fecha de envío.',
    '6. Modo Claro / Oscuro: Interruptor en cabecera para ajustar el contraste de subtítulos en cualquier pantalla.'
  ];

  doc.fillColor(DARK).fontSize(8).font('Helvetica');
  let py = y + 22;
  paso1Steps.forEach(st => {
    doc.text(st, 50, py, { width: 495 });
    py += 16;
  });


  // ═════════════════════════════════════════════════════════════
  // PÁGINA 2: GUARDADO EN 4 FORMATOS Y APERTURA DE FICHEROS
  // ═════════════════════════════════════════════════════════════
  doc.addPage();
  addHeader('PASO 2 Y PASO 3: GUARDADO Y APERTURA EN 4 FORMATOS');

  // Sección 4: Guardado en 4 Formatos (Sin extensión manual)
  y = 100;
  doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text('4. PASO 2 DEL MANUAL: GUARDADO EN LOS 4 FORMATOS (SIN EXTENSIÓN)', 40, y);

  y += 16;
  doc.rect(40, y, 515.28, 45).fillAndStroke('#eff6ff', '#bfdbfe');
  doc.fillColor('#1e40af').fontSize(8.5).font('Helvetica-Bold').text('Regla Exigida de Nombre de Archivo:', 50, y + 8);
  doc.fillColor(DARK).fontSize(8).font('Helvetica').text(
    'El usuario escribe ÚNICAMENTE el nombre base del archivo en el cuadro de texto (ej. "envio_madrid") SIN EXTENSIÓN. ' +
    'Al pulsar el botón del formato deseado, la aplicación añade automáticamente la extensión correspondiente (.dat, .xml, .csv, .json).',
    50, y + 20, { width: 495 }
  );

  y += 55;
  const formatosGuardado = [
    { name: '📦 BINARIO (.dat)', file: 'envio_madrid.dat', code: 'DataOutputStream / writeUTF, writeDouble', desc: 'Guarda los atributos como flujo continuo de bytes primitivos compactos en disco.' },
    { name: '📄 XML (.xml)', file: 'envio_madrid.xml', code: 'Jackson XmlMapper / DOM Struct', desc: 'Estructura jerárquica con etiquetas de apertura y cierre (<envio><destino>...</destino></envio>).' },
    { name: '📊 CSV (.csv)', file: 'envio_madrid.csv', code: 'CSV Builder Tabular', desc: 'Genera filas de texto plano delimitadas por comas compatibles con hojas de cálculo.' },
    { name: '🔧 JSON (.json)', file: 'envio_madrid.json', code: 'Jackson ObjectMapper', desc: 'Serializa la entidad a pares clave-valor estándar para APIs Web modernas.' },
  ];

  formatosGuardado.forEach(fmt => {
    doc.rect(40, y, 515.28, 38).fillAndStroke('#f8fafc', '#e2e8f0');
    doc.fillColor(PRIMARY).fontSize(8.5).font('Helvetica-Bold').text(`${fmt.name} ➔ Archivo Generado: ${fmt.file}`, 48, y + 6);
    doc.fillColor(DARK).fontSize(7.5).font('Helvetica').text(`Mecanismo: ${fmt.code} | ${fmt.desc}`, 48, y + 20, { width: 495 });
    y += 43;
  });

  // Sección 5: Apertura de Ficheros e Inspección
  y += 10;
  doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text('5. PASO 3 DEL MANUAL: APERTURA E INSPECCIÓN DE FICHEROS', 40, y);

  y += 16;
  doc.rect(40, y, 515.28, 115).fillAndStroke('#f0fdf4', '#bbf7d0');
  doc.fillColor('#15803d').fontSize(8.5).font('Helvetica-Bold').text('Carga y Lectura de Archivos en la Interfaz (Bloque 2 y Bloque 3):', 50, y + 8);
  
  const aperturaSteps = [
    '• Carga por arrastrar/soltar: El usuario puede arrastrar cualquier archivo .dat, .xml, .csv o .json al conversor.',
    '• Lectura binaria nativa: DataInputStream de Java (o DataView en JS) decodifica la secuencia exacta de bytes.',
    '• Parsing de XML/JSON/CSV: Extrae los campos y reconstruye en pantalla el objeto Envio original.',
    '• Visor Web IDE: Pestaña dedicada con números de línea y sintaxis resaltada para examinar el código crudo de cada archivo sin programas externos (Bloc de Notas o Excel).',
    '• Modal pedagógico de confirmación: Muestra una vista previa de la conversión antes de descargar el resultado.'
  ];

  doc.fillColor(DARK).fontSize(8).font('Helvetica');
  let ay = y + 22;
  aperturaSteps.forEach(st => {
    doc.text(st, 50, ay, { width: 495 });
    ay += 17;
  });


  // ═════════════════════════════════════════════════════════════
  // PÁGINA 3: EJEMPLO DE CONVERSIÓN Y MÓDULOS OPCIONALES
  // ═════════════════════════════════════════════════════════════
  doc.addPage();
  addHeader('PASO 4: CONVERSIÓN DE FORMATOS Y DEFENSA TÉCNICA');

  // Sección 6: Ejemplo de Conversión (CSV -> XML -> DAT -> JSON)
  y = 100;
  doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text('6. PASO 4 DEL MANUAL: EJEMPLO COMPLETO DE CONVERSIÓN DE FORMATOS', 40, y);

  y += 16;
  doc.rect(40, y, 515.28, 120).fillAndStroke('#faf5ff', '#e9d5ff');
  doc.fillColor('#6b21a8').fontSize(8.5).font('Helvetica-Bold').text('Flujo Demostrativo de Transformación Bidireccional (Bloque 2):', 50, y + 8);

  const conversionSteps = [
    '1. El usuario abre o carga un archivo existente en Formato Origen (ejemplo: "datos_envio.csv").',
    '2. La interfaz analiza el archivo, extrae los datos del envío y los muestra estructurados en la tarjeta de origen.',
    '3. El usuario selecciona el Formato Destino deseado (ejemplo: "XML" o "Binario .dat").',
    '4. Escribe el nombre para el nuevo archivo (ejemplo: "datos_envio_convertido").',
    '5. Pulsa "🔄 Convertir y Descargar": La aplicación transforma la estructura interna de los datos en memoria y genera el nuevo archivo con la extensión asignada automáticamente (datos_envio_convertido.xml).',
    '6. Mismo Formato Alert: El sistema detecta si el usuario selecciona el mismo formato origen y destino, emitiendo una advertencia pedagógica para evitar conversiones redundantes.'
  ];

  doc.fillColor(DARK).fontSize(8).font('Helvetica');
  let cy = y + 22;
  conversionSteps.forEach(st => {
    doc.text(st, 50, cy, { width: 495 });
    cy += 16;
  });

  // Sección 7: Aclaración sobre el Módulo Opcional de Base de Datos H2
  y += 132;
  doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text('7. NOTA TÉCNICA: MÓDULO COMPLEMENTARIO OPCIONAL (PERSISTENCIA H2)', 40, y);

  y += 16;
  doc.rect(40, y, 515.28, 80).fillAndStroke('#fffbe6', '#ffe58f');
  doc.fillColor('#d48806').fontSize(8.5).font('Helvetica-Bold').text('Modulo Complementario de Apoyo (Spring Data JPA + H2 In-Memory):', 50, y + 8);
  doc.fillColor(DARK).fontSize(8).font('Helvetica').text(
    'El núcleo principal de la evaluación UT02 se centra al 100% en la manipulación y conversión de FICHEROS (.dat, .xml, .csv, .json).\n' +
    'Como extra pedagógico adicional, la aplicación incluye un botón para almacenar opcionalmente los envíos en una tabla relacional en Base de Datos H2 (jdbc:h2:mem:enviosdb) mediante Spring Data JPA e Hibernate ORM, ofreciendo acceso directo a la consola /h2-console para auditar la persistencia.',
    50, y + 22, { width: 495, lineGap: 1.5 }
  );

  // Sección 8: Defensa por Cubos 3D
  y += 92;
  doc.fillColor(PRIMARY).fontSize(11).font('Helvetica-Bold').text('8. RUTA INTERACTIVA DE PRESENTACIÓN 3D (/presentacion)', 40, y);

  y += 16;
  doc.rect(40, y, 515.28, 55).fillAndStroke('#eff6ff', '#bfdbfe');
  doc.fillColor('#1e40af').fontSize(8.5).font('Helvetica-Bold').text('Defensa Académica por Cubos 3D:', 50, y + 8);
  doc.fillColor(DARK).fontSize(8).font('Helvetica').text(
    'Al pulsar el botón flotante en la esquina superior izquierda (con animación de vibración de 3s), se accede a la vista de presentación interactiva por cubos 3D donde se exponen los 6 bloques del proyecto con justificaciones técnicas y código de ejemplo.',
    50, y + 20, { width: 495 }
  );

  // Footer Signoff
  y += 68;
  doc.rect(40, y, 515.28, 50).fillAndStroke('#1e1b4b', '#1e1b4b');
  doc.fillColor('#ffffff').fontSize(10.5).font('Helvetica-Bold').text('Firma y Entrega Oficial del Alumno:', 55, y + 12);
  doc.fillColor('#a78bfa').fontSize(9.5).font('Helvetica').text('Moises De Lima - DAM Noche Grupo A - Proyecto UT02 Acceso a Datos (2026-2027)', 55, y + 29);

  doc.end();

  stream.on('finish', () => {
    console.log('PDF Manual de Usuario generado exitosamente en:', outputPath);
  });
}

function generateSafe(outputPath) {
  try {
    createProjectPDF(outputPath);
  } catch (err) {
    console.warn('Advertencia al escribir PDF en:', outputPath, err.message);
  }
}

// Generate in both root and frontend/public
const rootPath = path.join(__dirname, '..', 'Proyecto_UT02_AccesoADatos_MoisesDeLima.pdf');
const publicPath = path.join(__dirname, 'public', 'Proyecto_UT02_AccesoADatos_MoisesDeLima.pdf');

generateSafe(publicPath);
generateSafe(rootPath);



