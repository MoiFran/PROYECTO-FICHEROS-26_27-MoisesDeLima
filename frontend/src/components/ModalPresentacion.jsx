import { useState } from 'react';

const BLOQUES = [
  {
    id: 'frontend',
    icon: '🎨',
    color: '#a78bfa',
    title: '1. Frontend (React 19 + Vite)',
    tag: 'Interfaz & Experiencia de Usuario',
    tech: ['React 19', 'Vite', 'Vanilla CSS', 'Glassmorphism'],
    summary: 'La capa cliente interactiva que se ejecuta en el navegador del usuario.',
    description: 'Desarrollada con React y Vite para ofrecer una experiencia fluida y reactiva. Gestiona los formularios de entrada, las vistas previas en tiempo real, el conversor de ficheros y el visor de código tipo IDE sin recargar la página.',
    highlights: [
      'Estados reactivos con useState y hooks personalizados.',
      'Sistema de notificaciones Toasts para feedback en tiempo real.',
      'Renderizado condicional y modales pedagógicos.',
    ],
    code: `// Ejemplo de llamada desde React a la API Spring Boot
export const guardarFichero = async (envio, formato, nombre) => {
  const res = await fetch(\`/api/files/guardar/\${formato}?nombreFichero=\${nombre}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(envio),
  });
  return res.blob();
};`,
  },
  {
    id: 'backend',
    icon: '⚙️',
    color: '#22d3ee',
    title: '2. Backend (Java 21 + Spring Boot 3)',
    tag: 'Lógica de Negocio & Controladores REST',
    tech: ['Java 21', 'Spring Boot 3', 'Spring Web', 'Maven'],
    summary: 'El servidor de aplicaciones que procesa las peticiones y orquesta los ficheros.',
    description: 'Construido sobre Java 21 y Spring Boot. Expone una API REST con endpoints anotados con @RestController (@GetMapping, @PostMapping, @DeleteMapping) para recibir datos, delegar la lógica a los servicios y devolver archivos o JSON.',
    highlights: [
      '@RestController para exponer endpoints REST (/api/envios, /api/files).',
      'Inyección de dependencias para desacoplar controladores y servicios.',
      'Soporte MultipartFile para subida y procesamiento de archivos.',
    ],
    code: `@RestController
@RequestMapping("/api/files")
public class FileController {
    @PostMapping("/guardar/{formato}")
    public ResponseEntity<byte[]> guardar(@PathVariable String formato, @RequestBody Envio envio) {
        byte[] bytes = fileService.guardarSegunFormato(envio, formato);
        return ResponseEntity.ok().body(bytes);
    }
}`,
  },
  {
    id: 'ficheros',
    icon: '📄',
    color: '#34d399',
    title: '3. Manejo de Ficheros (UT02 Acceso a Datos)',
    tag: 'Persistencia & Conversión en 4 Formatos',
    tech: ['DataOutputStream', 'Jackson JSON', 'DOM / XML', 'CSV Builder'],
    summary: 'El núcleo de la asignatura: lectura, escritura y transformación entre 4 formatos.',
    description: 'Implementa los 4 métodos de almacenamiento de información requeridos en la UT02:',
    subItems: [
      { name: '📦 Binario (.dat)', desc: 'Escribe tipos primitivos directamente en secuencias de bytes usando DataOutputStream (writeUTF, writeDouble).' },
      { name: '📄 XML (.xml)', desc: 'Genera estructura jerárquica con etiquetas de apertura/cierre (<envio><destino>...</destino></envio>).' },
      { name: '📊 CSV (.csv)', desc: 'Organiza la información en filas tabulares separadas por comas (formato ideal para Excel/Data Analytics).' },
      { name: '🔧 JSON (.json)', desc: 'Serializa objetos Java a pares clave-valor usando com.fasterxml.jackson.' },
    ],
    code: `// Escritura en Binario nativo Java (DataOutputStream)
public byte[] guardarBinario(Envio e) throws IOException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    DataOutputStream dos = new DataOutputStream(baos);
    dos.writeUTF(e.getNumeroCliente());
    dos.writeDouble(e.getPeso());
    dos.flush();
    return baos.toByteArray();
}`,
  },
  {
    id: 'database',
    icon: '🗄️',
    color: '#fbbf24',
    title: '4. Base de Datos & ORM (H2 / Neon + JPA)',
    tag: 'Persistencia Relacional en BD',
    tech: ['Spring Data JPA', 'Hibernate ORM', 'H2 In-Memory', 'PostgreSQL / Neon'],
    summary: 'Almacenamiento estructurado relacional con Mapeo Objeto-Relacional.',
    description: 'Utiliza JPA y Hibernate para mapear la entidad Envio.java a la tabla ENVIOS en la Base de Datos. En desarrollo local y despliegue usa H2 (en memoria, sin instalación), compatible también con PostgreSQL (Neon).',
    highlights: [
      'Anotaciones JPA: @Entity, @Id, @GeneratedValue, @Column.',
      'EnvioRepository extiende JpaRepository para soporte CRUD automático.',
      'Consola Web de H2 accesible en /h2-console para auditar las tablas.',
    ],
    code: `@Entity
@Table(name = "envios")
public class Envio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numeroCliente;
    private Double peso;
    // Getters y Setters
}`,
  },
  {
    id: 'deploy',
    icon: '☁️',
    color: '#f87171',
    title: '5. Contenerización & Despliegue en la Nube',
    tag: 'DevOps, Docker & Cloud Hosting',
    tech: ['Docker', 'Render.com', 'Vercel', 'CI/CD GitHub'],
    summary: 'Infraestructura distribuida full-stack en servidores de producción.',
    description: 'El proyecto está preparado para ejecutarse tanto en local como en servidores cloud gratuitos:',
    highlights: [
      'Dockerfile Multi-Stage: Compila el .jar con Maven + OpenJDK 21.',
      'Render.com: Servidor web que ejecuta el contenedor Docker de Java 21.',
      'Vercel.com: Hosting del cliente React con ruteo SPA (vercel.json).',
    ],
    code: `# Dockerfile Multi-Stage para Spring Boot
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`,
  },
  {
    id: 'resiliencia',
    icon: '🛡️',
    color: '#60a5fa',
    title: '6. Arquitectura Híbrida & Resiliencia',
    tag: 'Tolerancia a Fallos & Modo Offline',
    tech: ['Client-Side Processing', 'LocalStorage', 'TextEncoder', 'DataView'],
    summary: 'La aplicación nunca falla aunque el servidor backend esté durmiendo.',
    description: 'Para garantizar la mejor experiencia, el frontend incluye un motor cliente en JS que réplica la lógica de Java. Si el backend tarda en despertar en el plan gratis de Render, el navegador procesa los ficheros cliente y usa localStorage.',
    highlights: [
      'Generación y parseo de binario .dat directo en JS con DataView.',
      'Parseo XML con DOMParser del navegador.',
      'Almacenamiento del Historial en localStorage como fallback.',
    ],
    code: `// Decodificador binario en JS (DataView)
const view = new DataView(buffer);
const readUTF = () => {
  const len = view.getUint16(offset, false);
  const bytes = new Uint8Array(buffer, offset + 2, len);
  return new TextDecoder().decode(bytes);
};`,
  },
];

export default function ModalPresentacion({ onCerrar }) {
  const [bloqueActivo, setBloqueActivo] = useState('frontend');

  const bloque = BLOQUES.find(b => b.id === bloqueActivo) || BLOQUES[0];

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box modal-presentacion-box" onClick={e => e.stopPropagation()}>
        
        {/* Cabecera de la Presentación */}
        <div className="pres-header">
          <div className="pres-title-group">
            <span className="pres-badge">UT02 · Acceso a Datos</span>
            <h2>🎓 Presentación de Arquitectura Full-Stack</h2>
            <p>Mapa de componentes, tecnologías y arquitectura interna de la aplicación</p>
          </div>
          <button className="btn btn-ghost btn-sm visor-close-btn" onClick={onCerrar}>
            ✕ Cerrar presentación
          </button>
        </div>

        {/* Diagrama de Flujo Visual */}
        <div className="pres-diagram">
          <div className="diagram-node" onClick={() => setBloqueActivo('frontend')} style={bloqueActivo === 'frontend' ? { borderColor: '#a78bfa', background: '#a78bfa20' } : {}}>
            <span>🎨 Frontend React</span>
          </div>
          <div className="diagram-arrow">➔</div>
          <div className="diagram-node" onClick={() => setBloqueActivo('backend')} style={bloqueActivo === 'backend' ? { borderColor: '#22d3ee', background: '#22d3ee20' } : {}}>
            <span>⚙️ Spring Boot API</span>
          </div>
          <div className="diagram-arrow">➔</div>
          <div className="diagram-node" onClick={() => setBloqueActivo('ficheros')} style={bloqueActivo === 'ficheros' ? { borderColor: '#34d399', background: '#34d39920' } : {}}>
            <span>📄 Ficheros (.DAT/.XML...)</span>
          </div>
          <div className="diagram-arrow">➔</div>
          <div className="diagram-node" onClick={() => setBloqueActivo('database')} style={bloqueActivo === 'database' ? { borderColor: '#fbbf24', background: '#fbbf2420' } : {}}>
            <span>🗄️ H2 / JPA Database</span>
          </div>
        </div>

        {/* Selector de Bloques (Tabs) */}
        <div className="pres-tabs">
          {BLOQUES.map(b => {
            const esActivo = b.id === bloqueActivo;
            return (
              <button
                key={b.id}
                className={`pres-tab-btn${esActivo ? ' active' : ''}`}
                style={esActivo ? { borderColor: b.color, color: b.color, background: `${b.color}15` } : {}}
                onClick={() => setBloqueActivo(b.id)}
              >
                <span>{b.icon} {b.title.split('.')[1].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido del Bloque Seleccionado */}
        <div className="pres-content-body">
          <div className="pres-block-header">
            <div className="pres-block-icon" style={{ background: `${bloque.color}20`, borderColor: `${bloque.color}50` }}>
              <span>{bloque.icon}</span>
            </div>
            <div>
              <span className="pres-block-tag" style={{ color: bloque.color, borderColor: `${bloque.color}40`, background: `${bloque.color}15` }}>
                {bloque.tag}
              </span>
              <h3>{bloque.title}</h3>
              <p className="pres-block-summary">{bloque.summary}</p>
            </div>
          </div>

          {/* Badges de tecnologías */}
          <div className="tech-badges-row">
            {bloque.tech.map((t, idx) => (
              <span key={idx} className="tech-badge">⚡ {t}</span>
            ))}
          </div>

          <p className="pres-description">{bloque.description}</p>

          {/* Sub-items si existen (ej. Ficheros) */}
          {bloque.subItems && (
            <div className="pres-subitems-grid">
              {bloque.subItems.map((sub, idx) => (
                <div key={idx} className="pres-subitem-card">
                  <strong>{sub.name}</strong>
                  <p>{sub.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Highlights */}
          {bloque.highlights && (
            <ul className="pres-highlights-list">
              {bloque.highlights.map((h, idx) => (
                <li key={idx}>✅ {h}</li>
              ))}
            </ul>
          )}

          {/* Snippet de Código */}
          <div className="pres-code-box">
            <div className="pres-code-header">
              <span>💻 Código / Arquitectura representativa</span>
            </div>
            <pre><code>{bloque.code}</code></pre>
          </div>
        </div>

        {/* Pie de la presentación */}
        <div className="pres-footer">
          <span className="pres-footer-note">
            💡 Consejo para la defensa: Puedes ir haciendo clic en los bloques superiores durante tu explicación.
          </span>
          <button className="btn btn-primary btn-sm" onClick={onCerrar}>
            Cerrar presentación
          </button>
        </div>

      </div>
    </div>
  );
}
