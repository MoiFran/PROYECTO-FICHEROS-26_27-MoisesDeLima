import { useState } from 'react';
import DocumentacionGuia from './DocumentacionGuia';

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
    title: 'Base de Datos & ORM (Pospuesto)',
    sub: 'Persistencia Relacional en BD (UT03/UT04)',
    tech: ['Spring Data JPA', 'Hibernate ORM', 'H2 Database'],
    
    requisito: 'Módulo de almacenamiento en Base de Datos Relacional.',
    justificacion: 'Este módulo se pospone formalmente para las unidades temáticas de Bases de Datos y ORM (UT03 / UT04). El cumplimiento de la presente UT02 se limita al 100% en la manipulación y conversión de Ficheros.',
    extras: 'El código backend y la entidad JPA se mantienen preservados.',
    justificacionExtras: 'Demuestra previsión de arquitectura para futuras entregas manteniendo el foco de la UT02.',
    
    fileName: 'Envio.java (Entidad Mapeada con JPA / Hibernate)',
    code: `package ut02.model;

import jakarta.persistence.*;

// Mapeo JPA preservado para las unidades de BD y ORM (UT03 / UT04)
@Entity
@Table(name = "envios")
public class Envio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroCliente;
    private String numeroSeguimiento;
    private String destino;
    private Double peso;
    private String fechaEnvio;
    private String fechaEstimadaEntrega;
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
    numero: '05',
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

      {/* Sección 2: Explicación de Paquetes, Librerías & Guía de Uso del Sistema */}
      <DocumentacionGuia />

    </div>
  );
}


