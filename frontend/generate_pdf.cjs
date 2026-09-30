const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function createProjectPDF(outputPath) {
  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    info: {
      Title: 'Memoria Proyecto UT02 Acceso a Datos - Moises De Lima',
      Author: 'Moises De Lima',
      Subject: 'Entrega Proyecto Manejo de Ficheros Full-Stack',
    },
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Palette
  const PRIMARY = '#1e1b4b';   // Dark Deep Blue
  const DARK = '#0f172a';      // Slate Text

  // Helper Functions
  const addHeader = () => {
    doc.rect(0, 0, 595.28, 90).fill(PRIMARY);
    doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text('MEMORIA DE ENTREGA DE PROYECTO', 40, 25);
    doc.fillColor('#a78bfa').fontSize(10.5).font('Helvetica-Bold').text('UT02 - ACCESO A DATOS: MANEJO Y CONVERSION DE FICHEROS', 40, 52);
  };

  addHeader();

  // Student Info Box
  let y = 105;
  doc.rect(40, y, 515.28, 70).fillAndStroke('#f1f5f9', '#94a3b8');
  
  doc.fillColor(DARK).fontSize(10).font('Helvetica-Bold');
  doc.text('Alumno:', 55, y + 12);
  doc.font('Helvetica').text('Moises De Lima', 115, y + 12);

  doc.font('Helvetica-Bold').text('Curso / Grupo:', 300, y + 12);
  doc.font('Helvetica').text('DAM Noche - Grupo A', 390, y + 12);

  doc.font('Helvetica-Bold').text('Asignatura:', 55, y + 32);
  doc.font('Helvetica').text('Acceso a Datos (UT02)', 115, y + 32);

  doc.font('Helvetica-Bold').text('Año Academico:', 300, y + 32);
  doc.font('Helvetica').text('2026 - 2027', 390, y + 32);

  doc.font('Helvetica-Bold').text('Proyecto:', 55, y + 52);
  doc.font('Helvetica').text('Sistema Full-Stack de Gestion, Conversion e Inspeccion de Envios', 115, y + 52);

  // Section 1: Enlaces Públicos para Evaluación
  y += 85;
  doc.fillColor(PRIMARY).fontSize(12).font('Helvetica-Bold').text('1. ENLACES PUBLICOS DE DESPLIEGUE Y CODIGO FUENTE', 40, y);
  
  y += 20;
  doc.rect(40, y, 515.28, 90).fillAndStroke('#eff6ff', '#bfdbfe');

  doc.fillColor('#1e40af').fontSize(9.5).font('Helvetica-Bold');
  
  doc.text('[WEB] Aplicacion Web (Vercel):', 55, y + 12);
  doc.fillColor('#2563eb').font('Helvetica').text('https://proyecto-ficheros-26-27-moises-de-l.vercel.app/', 215, y + 12, { link: 'https://proyecto-ficheros-26-27-moises-de-l.vercel.app/' });

  doc.fillColor('#1e40af').font('Helvetica-Bold').text('[API] Backend REST API (Render):', 55, y + 32);
  doc.fillColor('#2563eb').font('Helvetica').text('https://proyecto-ficheros-backend.onrender.com', 215, y + 32, { link: 'https://proyecto-ficheros-backend.onrender.com' });

  doc.fillColor('#1e40af').font('Helvetica-Bold').text('[GIT] Repositorio GitHub:', 55, y + 52);
  doc.fillColor('#2563eb').font('Helvetica').text('https://github.com/MoiFran/PROYECTO-FICHEROS-26_27-MoisesDeLima', 215, y + 52, { link: 'https://github.com/MoiFran/PROYECTO-FICHEROS-26_27-MoisesDeLima' });

  doc.fillColor('#1e40af').font('Helvetica-Bold').text('[BD] Consola Base de Datos H2:', 55, y + 72);
  doc.fillColor('#2563eb').font('Helvetica').text('https://proyecto-ficheros-backend.onrender.com/h2-console', 215, y + 72, { link: 'https://proyecto-ficheros-backend.onrender.com/h2-console' });

  // Section 2: Cumplimiento de Requisitos UT02
  y += 105;
  doc.fillColor(PRIMARY).fontSize(12).font('Helvetica-Bold').text('2. REQUISITOS EXIGIDOS UT02 Y FORMATOS DE FICHEROS', 40, y);

  y += 20;
  const formats = [
    { title: '[DAT] Binario (.dat)', desc: 'Escritura y lectura secuencial mediante DataOutputStream / DataInputStream (writeUTF, writeDouble). Formato compacto a nivel de bytes.' },
    { title: '[XML] XML (.xml)', desc: 'Estructuracion jerarquica con etiquetas de apertura y cierre (<envio><destino>...</destino></envio>). Estandard enterprise.' },
    { title: '[CSV] CSV (.csv)', desc: 'Registros tabulares delimitados por comas para compatibilidad con software de hojas de calculo y analitica.' },
    { title: '[JSON] JSON (.json)', desc: 'Serializacion y deserializacion de objetos Java mediante la libreria Jackson (ObjectMapper). Estandard Web.' },
  ];

  formats.forEach((fmt) => {
    doc.rect(40, y, 515.28, 36).fillAndStroke('#f8fafc', '#e2e8f0');
    doc.fillColor(PRIMARY).fontSize(9.5).font('Helvetica-Bold').text(fmt.title, 50, y + 6);
    doc.fillColor(DARK).fontSize(8.5).font('Helvetica').text(fmt.desc, 50, y + 19, { width: 495 });
    y += 42;
  });

  // Page Break for Section 3 & 4
  doc.addPage();
  addHeader();

  // Section 3: Estructura de Módulos
  y = 105;
  doc.fillColor(PRIMARY).fontSize(12).font('Helvetica-Bold').text('3. MODULOS Y FUNCIONALIDADES DE LA APLICACION', 40, y);

  y += 20;
  const modulos = [
    { name: 'Bloque 1 - Creacion y Persistencia', detail: 'Formulario para generacion manual de envios con descarga en los 4 formatos y boton de registro en Base de Datos.' },
    { name: 'Bloque 2 - Conversor Interactivo', detail: 'Transformador bidireccional entre cualquier combinacion de formatos (ej: CSV -> XML) con tarjeta de datos parseados.' },
    { name: 'Bloque 3 - Visor Web (Web Viewer)', detail: 'Inspector tipo IDE con numeros de linea y pestañas para inspeccionar codigo crudo en tiempo real sin programas externos.' },
    { name: 'Bloque 4 - Historial en BD Relacional', detail: 'Almacenamiento en Base de Datos H2 In-Memory / PostgreSQL con JPA Hibernate y boton de inspeccion directa.' },
    { name: 'Seccion Especial - Ruta 3D (/presentacion)', detail: 'Pagina de defensa academica por cubos 3D con justificaciones de requisitos, soluciones tecnicas, extras y codigo comentado.' },
  ];

  modulos.forEach((mod) => {
    doc.rect(40, y, 515.28, 38).fillAndStroke('#faf5ff', '#e9d5ff');
    doc.fillColor('#6b21a8').fontSize(9.5).font('Helvetica-Bold').text(mod.name, 50, y + 6);
    doc.fillColor(DARK).fontSize(8.5).font('Helvetica').text(mod.detail, 50, y + 20, { width: 495 });
    y += 44;
  });

  // Section 4: Arquitectura Técnica y DevOps
  y += 10;
  doc.fillColor(PRIMARY).fontSize(12).font('Helvetica-Bold').text('4. ARQUITECTURA TECNICA Y DEVOPS', 40, y);

  y += 20;
  doc.rect(40, y, 515.28, 115).fillAndStroke('#f0fdf4', '#bbf7d0');

  doc.fillColor('#15803d').fontSize(9.5).font('Helvetica-Bold');
  doc.text('[FRONTEND] React (Vercel):', 55, y + 12);
  doc.fillColor(DARK).fontSize(8.5).font('Helvetica').text('React 19, Vite, CSS Vanilla, Glassmorphism, Toasts flotantes reactivos y SPA Routing.', 200, y + 12);

  doc.fillColor('#15803d').fontSize(9.5).font('Helvetica-Bold').text('[BACKEND] Java (Render):', 55, y + 32);
  doc.fillColor(DARK).fontSize(8.5).font('Helvetica').text('Java 21, Spring Boot 3, Spring Web, Maven, Docker Multi-Stage (Dockerfile).', 200, y + 32);

  doc.fillColor('#15803d').fontSize(9.5).font('Helvetica-Bold').text('[DATABASE] Base de Datos:', 55, y + 52);
  doc.fillColor(DARK).fontSize(8.5).font('Helvetica').text('Spring Data JPA, Hibernate ORM, H2 Database (In-Memory) / Neon PostgreSQL.', 200, y + 52);

  doc.fillColor('#15803d').fontSize(9.5).font('Helvetica-Bold').text('[RESILIENCE] Resiliencia Hibrida:', 55, y + 72);
  doc.fillColor(DARK).fontSize(8.5).font('Helvetica').text('Motor cliente JS (DataView, TextDecoder, localStorage) para disponibilidad 100% sin cuelgues.', 200, y + 72);

  doc.fillColor('#15803d').fontSize(9.5).font('Helvetica-Bold').text('[DEVOPS] Integracion CI/CD:', 55, y + 92);
  doc.fillColor(DARK).fontSize(8.5).font('Helvetica').text('Despliegue automatico en la nube en cada commit al repositorio GitHub.', 200, y + 92);

  // Footer Signoff
  y += 135;
  doc.rect(40, y, 515.28, 45).fillAndStroke('#1e1b4b', '#1e1b4b');
  doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text('Firma y Entrega del Alumno:', 55, y + 10);
  doc.fillColor('#a78bfa').fontSize(9).font('Helvetica').text('Moises De Lima - DAM Noche Grupo A - Proyecto UT02 Acceso a Datos', 55, y + 26);

  doc.end();

  stream.on('finish', () => {
    console.log('PDF generado exitosamente en:', outputPath);
  });
}

// Generate in both root and frontend/public
const rootPath = path.join(__dirname, '..', 'Proyecto_UT02_AccesoADatos_MoisesDeLima.pdf');
const publicPath = path.join(__dirname, 'public', 'Proyecto_UT02_AccesoADatos_MoisesDeLima.pdf');

createProjectPDF(rootPath);
createProjectPDF(publicPath);
