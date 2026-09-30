import { useState } from 'react';

const BLOQUES_ARQUITECTURA = [
  {
    id: 'frontend',
    numero: '01',
    icon: '🎨',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(108,99,255,0.05))',
    title: 'Frontend (React 19 + Vite)',
    sub: 'Capa Cliente & Interfaz de Usuario',
    tech: ['React 19', 'Vite', 'Vanilla CSS', 'Glassmorphism'],
    
    requisito: 'Crear una interfaz interactiva y fácil de usar para gestionar la entrada de datos, conversión y previsualización de envíos.',
    justificacion: 'Se utilizó React 19 con Vite para lograr un renderizado reactivo instantáneo en el cliente (DOM virtual). Evita recargas completas de la página (location.reload), lo que permite manipular ficheros y convertir formatos de forma ininterrumpida con excelente rendimiento.',
    extras: 'Visor Web de archivos estilo editor IDE con números de línea y resaltado, modales interactivos de confirmación previa a la descarga, y sistema flotante de avisos Toasts.',
    justificacionExtras: 'Permite al estudiante/profesor examinar físicamente la estructura cruda del código de cada archivo (JSON, XML, CSV, Binario) desde la propia web sin necesidad de instalar o abrir programas externos como Bloc de Notas o Excel.',
    
    fileName: 'api.js (Comunicación Cliente -> Backend)',
    code: `// ── Capa API del Frontend en React ──────────────────────────────
// 1. Petición POST asíncrona para guardar y descargar ficheros
export const guardarFichero = async (envio, formato, nombreFichero) => {
  // 2. Conecta con el endpoint del Backend Java Spring Boot
  const res = await fetch(
    \`\${API_BASE}/files/guardar/\${formato}?nombreFichero=\${encodeURIComponent(nombreFichero)}\`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(envio), // Enviamos el objeto Envio formateado como JSON
    }
  );

  // 3. Convertimos la respuesta binaria devuelta por Java en un Blob de navegador
  const blob = await res.blob();
  const filename = nombreFichero + '.' + formato;

  // 4. Creamos un enlace HTML5 dinámico en memoria para forzar la descarga en el equipo
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click(); // Dispara la descarga automática en el navegador
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url); // Liberamos la memoria del Blob
  return filename;
};`,
  },
  {
    id: 'backend',
    numero: '02',
    icon: '⚙️',
    color: '#22d3ee',
    gradient: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(8,145,178,0.05))',
    title: 'Backend (Java 21 + Spring Boot 3)',
    sub: 'Servidor API REST & Inyección de Dependencias',
    tech: ['Java 21', 'Spring Boot 3', 'Spring Web', 'Maven'],
    
    requisito: 'Desarrollar la lógica de servidor en Java para procesar peticiones, parsear archivos y gestionar las operaciones del sistema.',
    justificacion: 'Spring Boot simplifica la creación de APIs REST profesionales mediante Inversión de Control (IoC) e Inyección de Dependencias (@Autowired / constructor). Separa limpiamente la capa de controladores (@RestController) de la capa de servicio (@Service), facilitando el mantenimiento y escalabilidad del código.',
    extras: 'Endpoints Multipart (/api/files/abrir) para recibir archivos físicos subidos por el usuario, parsearlos dinámicamente y devolver el modelo JSON; y respuestas ResponseEntity<byte[]> con cabeceras de descarga directa.',
    justificacionExtras: 'Transforma el backend en una API verdaderamente reusable y decoupled que puede ser consumida por cualquier cliente (Web, Móvil, Postman o comandos cURL).',
    
    fileName: 'FileController.java (Controlador REST de Ficheros)',
    code: `package ut02.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ut02.model.Envio;
import ut02.service.FileService;

// 1. @RestController expone esta clase como controlador de peticiones HTTP API REST
@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    // 2. Inyección de dependencias por constructor del servicio FileService
    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    // 3. Endpoint POST para generar y descargar ficheros (.dat, .xml, .csv, .json)
    @PostMapping("/guardar/{formato}")
    public ResponseEntity<byte[]> guardar(
            @PathVariable String formato,         // Formato recibido en la URL (ej: "xml")
            @RequestParam String nombreFichero,   // Nombre deseado para el archivo
            @RequestBody Envio envio) {            // Objeto JSON mapeado a Java Envio

        try {
            // 4. Delegamos en el servicio la generación de bytes según el formato
            byte[] contenido = switch (formato.toLowerCase()) {
                case "dat"  -> fileService.guardarBinario(envio); // Genera bytes binarios Java
                case "xml"  -> fileService.guardarXML(envio);     // Genera estructura XML
                case "csv"  -> fileService.guardarCSV(envio);     // Genera líneas CSV
                case "json" -> fileService.guardarJSON(envio);    // Genera JSON con Jackson
                default     -> null;
            };

            if (contenido == null) return ResponseEntity.badRequest().build();

            // 5. Devolvemos la respuesta HTTP 200 OK con los bytes y la cabecera de descarga
            String filename = nombreFichero + "." + formato;
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\\"" + filename + "\\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(contenido);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}`,
  },
  {
    id: 'ficheros',
    numero: '03',
    icon: '📄',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(5,150,105,0.05))',
    title: 'Motor de Ficheros (UT02 Acceso a Datos)',
    sub: 'Persistencia & Conversión en 4 Formatos',
    tech: ['DataOutputStream', 'Jackson JSON', 'DOM / XML', 'CSV Builder'],
    
    requisito: 'El núcleo obligatorio de la UT02: Implementar la lectura, escritura y manipulación de archivos en 4 formatos: Binario (.dat), XML (.xml), CSV (.csv) y JSON (.json).',
    justificacion: 'Se desarrollaron 4 parsers/generadores específicos en Java dentro del servicio FileService:',
    subItems: [
      { name: '📦 Binario (.dat)', desc: 'Utiliza DataOutputStream y DataInputStream para escribir/leer tipos de datos primitivos en secuencias de bytes continuas. Es el formato de menor espacio en disco pero requiere un programa específico.' },
      { name: '📄 XML (.xml)', desc: 'Utiliza estructuras de etiquetas jerárquicas con apertura y cierre (<envio><destino>...</destino></envio>). Estándar de interoperabilidad enterprise.' },
      { name: '📊 CSV (.csv)', desc: 'Organiza la información en filas tabulares delimitadas por comas. Es el formato universal para analítica de datos y software como Excel.' },
      { name: '🔧 JSON (.json)', desc: 'Serializa objetos Java a pares clave-valor usando la librería Jackson (ObjectMapper). Estándar moderno de intercambio en APIs Web.' },
    ],
    extras: 'Conversor Interactivo Bidireccional capaz de transformar cualquier fichero existente de un formato X a un formato Y sin pérdida de datos.',
    justificacionExtras: 'Demuestra el dominio completo de la teoría de ficheros: extraer los datos estructurados en memoria de un formato y reescribirlos bajo las especificaciones de otro formato totalmente distinto.',
    
    fileName: 'FileService.java (Lectura y Escritura de Binario Java)',
    code: `package ut02.service;

import org.springframework.stereotype.Service;
import ut02.model.Envio;
import java.io.*;

@Service
public class FileService {

    // ── 1. ESCRITURA EN BINARIO (.DAT) ─────────────────────────────────
    // Escribe los atributos del objeto Envio como flujo de bytes primitivos
    public byte[] guardarBinario(Envio envio) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        DataOutputStream dos = new DataOutputStream(baos);

        // writeUTF escribe cadenas de texto con longitud previa de 2 bytes
        dos.writeUTF(envio.getNumeroCliente() != null ? envio.getNumeroCliente() : "");
        dos.writeUTF(envio.getNumeroSeguimiento() != null ? envio.getNumeroSeguimiento() : "");
        dos.writeUTF(envio.getDestino() != null ? envio.getDestino() : "");
        
        // writeDouble escribe números flotantes de 64 bits (8 bytes IEEE 754)
        dos.writeDouble(envio.getPeso() != null ? envio.getPeso() : 0.0);
        
        dos.writeUTF(envio.getFechaEnvio() != null ? envio.getFechaEnvio() : "");
        dos.writeUTF(envio.getFechaEstimadaEntrega() != null ? envio.getFechaEstimadaEntrega() : "");

        dos.flush();
        return baos.toByteArray(); // Retorna los bytes binarios generados
    }

    // ── 2. LECTURA Y RECONSTRUCCIÓN DESDE BINARIO (.DAT) ───────────────
    public Envio abrirBinario(byte[] bytes) throws IOException {
        ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
        DataInputStream dis = new DataInputStream(bais);

        Envio envio = new Envio();
        // Leemos en el MISMO orden exacto en el que escribimos los bytes
        envio.setNumeroCliente(dis.readUTF());
        envio.setNumeroSeguimiento(dis.readUTF());
        envio.setDestino(dis.readUTF());
        envio.setPeso(dis.readDouble());
        envio.setFechaEnvio(dis.readUTF());
        envio.setFechaEstimadaEntrega(dis.readUTF());

        return envio; // Objeto Java Envio 100% reconstruido
    }
}`,
  },
  {
    id: 'database',
    numero: '04',
    icon: '🗄️',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.05))',
    title: 'Base de Datos & ORM (H2 / JPA)',
    sub: 'Persistencia Relacional en BD',
    tech: ['Spring Data JPA', 'Hibernate ORM', 'H2 Database', 'PostgreSQL'],
    
    requisito: 'Implementar almacenamiento persistente en Base de Datos Relacional para mantener un historial de envíos registrados.',
    justificacion: 'Se utilizó Spring Data JPA con Hibernate ORM. Evita escribir SQL manual propenso a errores (SQL Injection) al mapear la clase Java @Entity Envio a la tabla relacional ENVIOS. Se configuró H2 en memoria (jdbc:h2:mem:enviosdb) para permitir ejecución 100% libre de instalaciones.',
    extras: 'Acceso directo a la Consola Web de H2 en /h2-console para auditar físicamente la tabla SQL, e integración directa para inspeccionar registros de la BD en el Visor Web.',
    justificacionExtras: 'Permite al docente/evaluador comprobar físicamente que las filas SQL existen en la tabla relacional durante la defensa del proyecto.',
    
    fileName: 'Envio.java (Entidad Mapeada con JPA / Hibernate)',
    code: `package ut02.model;

import jakarta.persistence.*;

// 1. @Entity le indica a Hibernate que esta clase se mapea a una tabla SQL
@Entity
@Table(name = "envios")
public class Envio {

    // 2. @Id y @GeneratedValue definen la Clave Primaria Autonumérica de la tabla
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 3. Atributos del envío mapeados a columnas SQL de la tabla
    @Column(name = "numero_cliente", nullable = false)
    private String numeroCliente;

    private String numeroSeguimiento;
    private String destino;
    private Double peso;
    private String fechaEnvio;
    private String fechaEstimadaEntrega;

    // Constructor vacío exigido por la especificación de JPA
    public Envio() {}

    // Getters y Setters...
}`,
  },
  {
    id: 'deploy',
    numero: '05',
    icon: '☁️',
    color: '#f87171',
    gradient: 'linear-gradient(135deg, rgba(248,113,113,0.2), rgba(220,38,38,0.05))',
    title: 'DevOps & Contenerización Cloud',
    sub: 'Docker + Render.com + Vercel.com',
    tech: ['Docker Multi-Stage', 'Render.com', 'Vercel.com', 'Git / GitHub'],
    
    requisito: 'Desplegar la solución Full-Stack de forma pública y accesible en la nube.',
    justificacion: 'Se implementó un Dockerfile Multi-Stage (Stage 1: Maven + JDK 21 para compilar / Stage 2: JRE 21 para ejecutar). Esto garantiza que el servidor Java corra en un contenedor aislado idéntico en cualquier plataforma. Se alojó el backend en Render.com y el frontend en Vercel.com.',
    extras: 'Integración CI/CD conectada a GitHub: cualquier cambio en el repositorio se recompila y despliega automáticamente en producción en menos de 60 segundos.',
    justificacionExtras: 'Aporta nivel profesional al proyecto, eliminando el problema de "en mi ordenador sí funciona" y permitiendo presentar una URL pública en vivo.',
    
    fileName: 'Dockerfile (Construcción Multi-Stage de Producción)',
    code: `# ── STAGE 1: Compilación del proyecto Java con Maven y OpenJDK 21 ──────
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copiamos el archivo pom.xml y el código fuente src
COPY pom.xml .
COPY src ./src

# 2. Compilamos y empaquetamos el proyecto en un archivo ejecutable .jar
RUN mvn clean package -DskipTests

# ── STAGE 2: Imagen ligera de ejecución de producción (JRE 21) ──────────
FROM eclipse-temurin:21-jre
WORKDIR /app

# 3. Copiamos únicamente el archivo .jar generado en el Stage 1
COPY --from=build /app/target/*.jar app.jar

# 4. Exponemos el puerto del servidor (Render asigna $PORT automáticamente)
EXPOSE 8080

# 5. Comando de arranque de la aplicación Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]`,
  },
  {
    id: 'resilient',
    numero: '06',
    icon: '🛡️',
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(37,99,235,0.05))',
    title: 'Arquitectura Híbrida & Resiliencia',
    sub: 'Tolerancia a Fallos & Motor Cliente JS',
    tech: ['DataView JS', 'TextDecoder', 'DOMParser', 'LocalStorage'],
    
    requisito: 'Garantizar que la aplicación no sufra cuelgues ni errores de disponibilidad durante su uso.',
    justificacion: 'Los servidores gratuitos en la nube (como Render) entran en modo de reposo (sleep) tras minutos de inactividad. Para evitar que el usuario perciba lentitud o errores de conexión, el frontend incluye un motor espejo en JavaScript.',
    extras: 'Decodificador/Codificador binario DataView en JS compatible con la especificación de bytes de Java DataOutputStream, parser XML cliente con DOMParser y base de datos local en localStorage.',
    justificacionExtras: 'Demuestra una arquitectura de grado de producción con tolerancia total a fallos: La web es 100% funcional incluso sin conexión a internet o con el servidor en reposo.',
    
    fileName: 'api.js (Decodificador Binario DataView en JS)',
    code: `// ── DECODIFICADOR BINARIO CLIENTE EN JAVASCRIPT (DataView) ───────────
// Replica de forma exacta el comportamiento de DataInputStream de Java en el navegador
async function parsearBinarioCliente(file) {
  const buffer = await file.arrayBuffer(); // Leemos los bytes del archivo en memoria
  const view = new DataView(buffer);     // Creamos una vista DataView de 8-bit
  const decoder = new TextDecoder();     // Decodificador de caracteres UTF-8
  const offset = { value: 0 };

  // 1. Helper para leer cadenas UTF-8 precedidas por su longitud de 2 bytes
  const readUTF = () => {
    const len = view.getUint16(offset.value, false); // Big endian (estándar Java)
    offset.value += 2;
    const bytes = new Uint8Array(buffer, offset.value, len);
    offset.value += len;
    return decoder.decode(bytes);
  };

  // 2. Helper para leer números flotantes de 64 bits (double de Java)
  const readDouble = () => {
    const val = view.getFloat64(offset.value, false);
    offset.value += 8;
    return val;
  };

  // 3. Reconstruimos el objeto JavaScript con los datos binarios extraídos
  return {
    numeroCliente: readUTF(),
    numeroSeguimiento: readUTF(),
    destino: readUTF(),
    peso: readDouble(),
    fechaEnvio: readUTF(),
    fechaEstimadaEntrega: readUTF(),
  };
}`,
  },
];

export default function PresentacionPage({ onVolver }) {
  const [selectedBlock, setSelectedBlock] = useState(BLOQUES_ARQUITECTURA[0]);
  const [copiado, setCopiado]             = useState(false);

  const handleCopiarCodigo = () => {
    navigator.clipboard.writeText(selectedBlock.code);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const lineasCodigo = selectedBlock.code.split('\n');

  return (
    <div className="pres-page-wrapper">

      {/* Cabecera Superior con Botón de Volver */}
      <header className="pres-page-header">
        <button className="btn btn-ghost pres-back-btn" onClick={onVolver}>
          ⬅️ Volver al Sistema de Envíos
        </button>
        <div className="pres-page-title">
          <span className="badge">UT02 · Acceso a Datos</span>
          <h1>Justificación Académica & Arquitectura</h1>
          <p>Defensa detallada del proyecto: Requisitos exigidos, justificaciones técnicas y extras de valor pedagógico</p>
        </div>
      </header>

      {/* Grid de Tarjetas Cubo 3D */}
      <div className="cube-cards-grid">
        {BLOQUES_ARQUITECTURA.map((bloque) => {
          const isSelected = selectedBlock.id === bloque.id;
          return (
            <div
              key={bloque.id}
              className={`cube-card${isSelected ? ' is-selected' : ''}`}
              style={{
                '--card-color': bloque.color,
                background: bloque.gradient,
              }}
              onClick={() => setSelectedBlock(bloque)}
            >
              <div className="cube-card-header">
                <span className="cube-number">{bloque.numero}</span>
                <span className="cube-icon">{bloque.icon}</span>
              </div>

              <h3 className="cube-title">{bloque.title}</h3>
              <p className="cube-sub">{bloque.sub}</p>

              <div className="cube-tech-tags">
                {bloque.tech.slice(0, 3).map((t, i) => (
                  <span key={i} className="cube-tag">⚡ {t}</span>
                ))}
              </div>

              <div className="cube-card-footer">
                <span>{isSelected ? '✓ Seleccionado para defensa' : '👆 Clic para justificar'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Panel de Justificación Detallada del Bloque Seleccionado */}
      <div className="pres-detail-panel" style={{ borderColor: `${selectedBlock.color}60` }}>
        
        {/* Cabecera del Bloque */}
        <div className="detail-panel-header">
          <div className="detail-icon-box" style={{ background: `${selectedBlock.color}20`, borderColor: `${selectedBlock.color}50` }}>
            <span>{selectedBlock.icon}</span>
          </div>
          <div>
            <span className="detail-number-badge" style={{ color: selectedBlock.color, borderColor: `${selectedBlock.color}40`, background: `${selectedBlock.color}15` }}>
              Bloque {selectedBlock.numero} · Defensa Técnica
            </span>
            <h2 className="detail-title">{selectedBlock.title}</h2>
            <p className="detail-sub">{selectedBlock.sub}</p>
          </div>
        </div>

        {/* 1. Requisito Exigido del Proyecto */}
        <div className="justification-box requirement-box">
          <div className="box-tag">🎯 Requisito Exigido del Proyecto</div>
          <p>{selectedBlock.requisito}</p>
        </div>

        {/* 2. Justificación Técnica de la Solución */}
        <div className="justification-box tech-box">
          <div className="box-tag">🔬 Justificación Técnica de la Solución</div>
          <p>{selectedBlock.justificacion}</p>
          
          {/* Sub-items en caso de Ficheros (Bloque 3) */}
          {selectedBlock.subItems && (
            <div className="detail-formats-grid" style={{ marginTop: '0.8rem' }}>
              {selectedBlock.subItems.map((fmt, idx) => (
                <div key={idx} className="detail-format-item">
                  <strong>{fmt.name}</strong>
                  <p>{fmt.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Extras y Mejoras Añadidas + 4. Justificación del Valor Pedagógico */}
        <div className="justification-box extras-box">
          <div className="box-tag">🚀 Extras Añadidos & Justificación de Valor</div>
          <p><strong>Mejoras implementadas:</strong> {selectedBlock.extras}</p>
          <p style={{ marginTop: '0.5rem' }}><strong>Justificación pedagógica:</strong> {selectedBlock.justificacionExtras}</p>
        </div>

        {/* Visor IDE de Código Representativo Amplio y Claramente Legible */}
        <div className="full-code-display-box">
          <div className="code-display-header">
            <div className="code-display-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="file-name">📄 {selectedBlock.fileName}</span>
            </div>
            <button className="btn btn-ghost btn-sm copy-code-btn" onClick={handleCopiarCodigo}>
              {copiado ? '✅ ¡Copiado!' : '📋 Copiar código'}
            </button>
          </div>

          <div className="code-display-body">
            <div className="code-display-lines">
              {lineasCodigo.map((_, idx) => (
                <span key={idx}>{idx + 1}</span>
              ))}
            </div>
            <pre className="code-display-content">
              <code>{selectedBlock.code}</code>
            </pre>
          </div>
        </div>

      </div>

      {/* Sección 2: Inventario Completo de Paquetes y Librerías */}
      <div className="pres-detail-panel" style={{ borderColor: 'rgba(167, 139, 250, 0.4)', marginTop: '2rem' }}>
        <div className="detail-panel-header">
          <div className="detail-icon-box" style={{ background: 'rgba(167, 139, 250, 0.2)', borderColor: 'rgba(167, 139, 250, 0.5)' }}>
            <span>📦</span>
          </div>
          <div>
            <span className="detail-number-badge" style={{ color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.4)', background: 'rgba(167, 139, 250, 0.15)' }}>
              Documentación Técnica · Dependencias
            </span>
            <h2 className="detail-title">Explicación de Paquetes y Librerías Usadas</h2>
            <p className="detail-sub">Justificación punto por punto de los módulos del Backend Java, Frontend React y Herramientas DevOps</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
          
          {/* Backend Java / Spring Boot */}
          <div className="justification-box tech-box" style={{ margin: 0 }}>
            <div className="box-tag" style={{ background: 'rgba(34, 211, 238, 0.2)', color: '#22d3ee' }}>☕ Backend Java & Spring Boot (pom.xml)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <strong style={{ color: '#60a5fa' }}>spring-boot-starter-web:</strong> Provee el framework Spring MVC, contenedores Tomcat embebidos, anotaciones REST (@RestController, @PostMapping) y serialización JSON.
              </li>
              <li>
                <strong style={{ color: '#60a5fa' }}>spring-boot-starter-data-jpa:</strong> Capa de abstracción ORM basada en Hibernate. Mapea la entidad Java Envio a SQL y gestiona transacciones mediante JpaRepository sin SQL manual.
              </li>
              <li>
                <strong style={{ color: '#60a5fa' }}>com.h2database:h2:</strong> Motor de Base de Datos relacional en memoria (jdbc:h2:mem:enviosdb). Permite ejecución inmediata sin instalar servidores BD locales y expone la consola /h2-console.
              </li>
              <li>
                <strong style={{ color: '#60a5fa' }}>jackson-dataformat-xml:</strong> Extensión para el ObjectMapper de Jackson que permite transformar objetos DTO Java directamente a XML y viceversa.
              </li>
              <li>
                <strong style={{ color: '#60a5fa' }}>spring-boot-starter-test:</strong> Suite de pruebas automatizadas (JUnit 5, Mockito y Spring Test).
              </li>
            </ul>
          </div>

          {/* Frontend React / Vite */}
          <div className="justification-box requirement-box" style={{ margin: 0 }}>
            <div className="box-tag" style={{ background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa' }}>⚛️ Frontend React & Vite (package.json)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <strong style={{ color: '#a78bfa' }}>react & react-dom (v19):</strong> Framework de interfaz basado en componentes funcionales y Hooks (useState, useEffect, useRef, useMemo) para reactividad instantánea en el DOM virtual.
              </li>
              <li>
                <strong style={{ color: '#a78bfa' }}>vite & @vitejs/plugin-react:</strong> Herramienta de compilación y servidor de desarrollo ultra-rápido basado en Native ES Modules.
              </li>
              <li>
                <strong style={{ color: '#a78bfa' }}>lucide-react:</strong> Librería de iconos SVG ligeros (Package, RefreshCw, Database, Eye, Download) que proporcionan claridad visual a cada acción del usuario.
              </li>
              <li>
                <strong style={{ color: '#a78bfa' }}>canvas-confetti:</strong> Efecto visual interactivo que dispara confeti al generar o convertir un fichero con éxito para mejorar la experiencia pedagógica.
              </li>
            </ul>
          </div>

          {/* DevOps & Tooling */}
          <div className="justification-box extras-box" style={{ margin: 0 }}>
            <div className="box-tag" style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399' }}>🛠️ Generación de Documentos & Cloud DevOps</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <strong style={{ color: '#34d399' }}>pdfkit (Node.js):</strong> Librería de maquetación vectorial para construir programáticamente la Memoria Oficial PDF (Proyecto_UT02_AccesoADatos_MoisesDeLima.pdf) con hipervínculos navegables.
              </li>
              <li>
                <strong style={{ color: '#34d399' }}>Docker (Multi-Stage Build):</strong> Imagen contenedora dividida en Stage 1 (Maven + OpenJDK 21) para compilación y Stage 2 (Eclipse Temurin JRE 21 minimal) para ejecución eficiente en Render.com.
              </li>
              <li>
                <strong style={{ color: '#34d399' }}>Vercel + Render CI/CD:</strong> Despliegue automatizado en la nube conectado al repositorio GitHub que compila el frontend y backend en cada commit.
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Sección 3: Guía de Uso Paso a Paso */}
      <div className="pres-detail-panel" style={{ borderColor: 'rgba(52, 211, 153, 0.4)', marginTop: '2rem' }}>
        <div className="detail-panel-header">
          <div className="detail-icon-box" style={{ background: 'rgba(52, 211, 153, 0.2)', borderColor: 'rgba(52, 211, 153, 0.5)' }}>
            <span>🗺️</span>
          </div>
          <div>
            <span className="detail-number-badge" style={{ color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.4)', background: 'rgba(52, 211, 153, 0.15)' }}>
              Manual de Evaluación · Paso a Paso
            </span>
            <h2 className="detail-title">Guía de Uso Integrada del Sistema</h2>
            <p className="detail-sub">Paso a paso para probar todas las funciones desarrolladas en el proyecto</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          
          <div className="detail-format-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="badge" style={{ background: '#3b82f6', color: '#fff', fontSize: '0.75rem', marginBottom: '0.4rem', display: 'inline-block' }}>Paso 1</span>
            <h4 style={{ color: '#f8fafc', margin: '0.2rem 0' }}>🌐 Acceso Web & Tolerancia a Fallos</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Accede a la URL de Vercel. Si el backend en Render se encuentra en reposo por inactividad, la app activa automáticamente su motor local JavaScript (DataView) sin bloquear la interfaz.
            </p>
          </div>

          <div className="detail-format-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="badge" style={{ background: '#8b5cf6', color: '#fff', fontSize: '0.75rem', marginBottom: '0.4rem', display: 'inline-block' }}>Paso 2</span>
            <h4 style={{ color: '#f8fafc', margin: '0.2rem 0' }}>📝 Bloque 1: Crear y Guardar Envíos</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Rellena el formulario. Pulsa <strong>💾 Guardar en Fichero</strong> para descargar en .dat, .xml, .csv o .json, o pulsa <strong>🗄️ Guardar en BD</strong> para registrarlo mediante Spring Data JPA.
            </p>
          </div>

          <div className="detail-format-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="badge" style={{ background: '#ec4899', color: '#fff', fontSize: '0.75rem', marginBottom: '0.4rem', display: 'inline-block' }}>Paso 3</span>
            <h4 style={{ color: '#f8fafc', margin: '0.2rem 0' }}>⚡ Bloque 2: Conversión entre Formatos</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              En la pestaña Conversor, pega cualquier fichero de origen, selecciona el formato de destino (ej: CSV -&gt; XML) y pulsa <strong>⚡ Convertir Fichero</strong>.
            </p>
          </div>

          <div className="detail-format-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="badge" style={{ background: '#10b981', color: '#fff', fontSize: '0.75rem', marginBottom: '0.4rem', display: 'inline-block' }}>Paso 4</span>
            <h4 style={{ color: '#f8fafc', margin: '0.2rem 0' }}>👁️ Bloque 3: Inspección en Visor Web IDE</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Cambia a "Visor Web" para inspeccionar el contenido de cualquier archivo con números de línea y formato resaltado sin necesidad de software externo.
            </p>
          </div>

          <div className="detail-format-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="badge" style={{ background: '#f59e0b', color: '#fff', fontSize: '0.75rem', marginBottom: '0.4rem', display: 'inline-block' }}>Paso 5</span>
            <h4 style={{ color: '#f8fafc', margin: '0.2rem 0' }}>🗄️ Bloque 4: Consulta de BD H2</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Revisa los registros guardados en la tabla H2 en "Historial en BD" y pulsa el botón <strong>👁️ Ver en Visor</strong> para abrirlos directamente en el visor de código.
            </p>
          </div>

          <div className="detail-format-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="badge" style={{ background: '#06b6d4', color: '#fff', fontSize: '0.75rem', marginBottom: '0.4rem', display: 'inline-block' }}>Paso 6</span>
            <h4 style={{ color: '#f8fafc', margin: '0.2rem 0' }}>🧊 Presentación 3D Académica</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Pulsa el botón flotante en la esquina superior izquierda (con animación de vibración de 3s) para abrir la defensa en cubo 3D con explicaciones de código y justificaciones.
            </p>
          </div>

          <div className="detail-format-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="badge" style={{ background: '#64748b', color: '#fff', fontSize: '0.75rem', marginBottom: '0.4rem', display: 'inline-block' }}>Paso 7</span>
            <h4 style={{ color: '#f8fafc', margin: '0.2rem 0' }}>📄 Descargar Informe PDF</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Descarga o adjunta en la plataforma Campus Virtual el documento <code>Proyecto_UT02_AccesoADatos_MoisesDeLima.pdf</code> que incluye los enlaces oficiales de entrega.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

