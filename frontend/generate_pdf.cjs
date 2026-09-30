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

  y += 18;
  doc.rect(40, y, 515.28, 95).fillAndStroke('#f0fdf4', '#bbf7d0');

  doc.fillColor('#15803d').fontSize(9).font('Helvetica-Bold');
  doc.text('[FRONTEND] React (Vercel):', 55, y + 10);
  doc.fillColor(DARK).fontSize(8).font('Helvetica').text('React 19, Vite, CSS Vanilla, Glassmorphism, Toasts flotantes reactivos y SPA Routing.', 200, y + 10);

  doc.fillColor('#15803d').fontSize(9).font('Helvetica-Bold').text('[BACKEND] Java (Render):', 55, y + 28);
  doc.fillColor(DARK).fontSize(8).font('Helvetica').text('Java 21, Spring Boot 3, Spring Web, Maven, Docker Multi-Stage (Dockerfile).', 200, y + 28);

  doc.fillColor('#15803d').fontSize(9).font('Helvetica-Bold').text('[DATABASE] Base de Datos:', 55, y + 46);
  doc.fillColor(DARK).fontSize(8).font('Helvetica').text('Spring Data JPA, Hibernate ORM, H2 Database (In-Memory) / Neon PostgreSQL.', 200, y + 46);

  doc.fillColor('#15803d').fontSize(9).font('Helvetica-Bold').text('[RESILIENCE] Resiliencia Hibrida:', 55, y + 64);
  doc.fillColor(DARK).fontSize(8).font('Helvetica').text('Motor cliente JS (DataView, TextDecoder, localStorage) para disponibilidad 100% sin cuelgues.', 200, y + 64);

  // Section 5: Explicación de Paquetes y Librerías Usadas
  y += 115;
  doc.fillColor(PRIMARY).fontSize(12).font('Helvetica-Bold').text('5. INVENTARIO DE PAQUETES Y LIBRERIAS UTILIZADAS', 40, y);

  y += 18;
  const paquetes = [
    { name: 'spring-boot-starter-web', env: 'Backend Java', desc: 'Framework Spring MVC, servidor Tomcat embebido, anotaciones REST (@RestController) y mapeo JSON.' },
    { name: 'spring-boot-starter-data-jpa', env: 'Backend Java', desc: 'Abstraccion ORM con Hibernate. Mapea la entidad Java Envio a SQL y gestiona transacciones con JpaRepository.' },
    { name: 'com.h2database:h2', env: 'Backend Java', desc: 'Motor de Base de Datos relacional en memoria (jdbc:h2:mem:enviosdb) con consola interactiva /h2-console.' },
    { name: 'jackson-dataformat-xml', env: 'Backend Java', desc: 'Extension de Jackson para serializar/deserializar objetos Java directamente a XML (<envio>...</envio>).' },
    { name: 'react & react-dom (v19)', env: 'Frontend Web', desc: 'Biblioteca UI reactiva basada en Hooks (useState, useEffect, useMemo) para renderizado reactivo instantaneo.' },
    { name: 'vite & lucide-react', env: 'Frontend Web', desc: 'Bundler de ultima generacion con Native ES Modules e iconografia vectorial en SVG para la interfaz.' },
    { name: 'pdfkit & canvas-confetti', env: 'Tooling & UI', desc: 'Generacion programatica de esta memoria oficial PDF y animacion visual de celebracion en el cliente.' },
  ];

  paquetes.forEach((pkg) => {
    doc.rect(40, y, 515.28, 28).fillAndStroke('#f8fafc', '#e2e8f0');
    doc.fillColor(PRIMARY).fontSize(8.5).font('Helvetica-Bold').text(`${pkg.name} (${pkg.env})`, 48, y + 4);
    doc.fillColor(DARK).fontSize(7.5).font('Helvetica').text(pkg.desc, 48, y + 15, { width: 498 });
    y += 31;
  });

  // Page Break for Section 6 & Signoff
  doc.addPage();
  addHeader();

  // Section 6: Guía de Uso Paso a Paso para Evaluación
  y = 105;
  doc.fillColor(PRIMARY).fontSize(12).font('Helvetica-Bold').text('6. GUIA DE USO PASO A PASO PARA EVALUACION DEL PROFESOR', 40, y);

  y += 20;
  const pasos = [
    { paso: 'Paso 1: Acceso Web', detail: 'Abrir https://proyecto-ficheros-26-27-moises-de-l.vercel.app/. Si el backend Render esta en reposo, la app conmuta al motor local JS DataView sin cuelgues.' },
    { paso: 'Paso 2: Creacion de Envio (Bloque 1)', detail: 'Rellenar formulario. Pulsar "Guardar en Fichero" para descargar (.dat, .xml, .csv, .json) o "Guardar en BD" para almacenar en H2 via JPA.' },
    { paso: 'Paso 3: Conversor de Formatos (Bloque 2)', detail: 'Pegar un fichero existente, elegir formato origen y formato destino (ej: CSV -> XML) y pulsar "Convertir Fichero".' },
    { paso: 'Paso 4: Inspeccion en Visor Web IDE (Bloque 3)', detail: 'Abrir "Visor Web" para examinar el codigo crudo con numeros de linea y sintaxis resaltada de cualquier archivo.' },
    { paso: 'Paso 5: Consulta e Historial BD (Bloque 4)', detail: 'Revisar la tabla SQL en "Historial en BD" y pulsar "Ver en Visor" en cualquier registro para cargarlo directamente en el visor de codigo.' },
    { paso: 'Paso 6: Defensa en Cubo 3D (/presentacion)', detail: 'Pulsar el boton flotante animado (esquina sup. izquierda) para abrir la defensa en cubo 3D con explicaciones de codigo y justificaciones.' },
    { paso: 'Paso 7: Memoria PDF Oficial', detail: 'Adjuntar esta memoria PDF (Proyecto_UT02_AccesoADatos_MoisesDeLima.pdf) en la entrega del Campus Virtual.' },
  ];

  pasos.forEach((p) => {
    doc.rect(40, y, 515.28, 36).fillAndStroke('#eff6ff', '#bfdbfe');
    doc.fillColor('#1e40af').fontSize(9).font('Helvetica-Bold').text(p.paso, 50, y + 5);
    doc.fillColor(DARK).fontSize(8).font('Helvetica').text(p.detail, 50, y + 18, { width: 495 });
    y += 40;
  });

  // Footer Signoff
  y += 15;
  doc.rect(40, y, 515.28, 50).fillAndStroke('#1e1b4b', '#1e1b4b');
  doc.fillColor('#ffffff').fontSize(10.5).font('Helvetica-Bold').text('Firma y Entrega Oficial del Alumno:', 55, y + 12);
  doc.fillColor('#a78bfa').fontSize(9.5).font('Helvetica').text('Moises De Lima - DAM Noche Grupo A - Proyecto UT02 Acceso a Datos (2026-2027)', 55, y + 29);

  doc.end();

  stream.on('finish', () => {
    console.log('PDF generado exitosamente en:', outputPath);
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


