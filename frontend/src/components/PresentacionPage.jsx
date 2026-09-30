import { useState } from 'react';

const BLOQUES_ARQUITECTURA = [
  {
    id: 'frontend',
    numero: '01',
    icon: '🎨',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(108,99,255,0.05))',
    title: 'Frontend React 19',
    sub: 'Capa Cliente & Experiencia de Usuario',
    tech: ['React 19', 'Vite', 'Vanilla CSS', 'Glassmorphism'],
    summary: 'Interfaz de usuario reactiva, fluida y con estados en tiempo real.',
    description: 'Gestiona la entrada de datos mediante componentes desacoplados. Incluye modales interactivos pedagógicos, notificaciones toast flotantes y actualización del DOM sin recargar la página.',
    codeTitle: 'React API Fetch Component',
    code: `// Comunicación cliente -> servidor API REST
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
    numero: '02',
    icon: '⚙️',
    color: '#22d3ee',
    gradient: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(8,145,178,0.05))',
    title: 'Backend Java 21',
    sub: 'Servidor Spring Boot 3 API REST',
    tech: ['Java 21', 'Spring Boot 3', 'Spring Web', 'Maven'],
    summary: 'Servidor de aplicaciones REST de alto rendimiento.',
    description: 'Expone endpoints RESTful con anotaciones @RestController para orquestar la lógica de negocio, procesar cargas multipart y generar archivos binarios, XML, CSV y JSON.',
    codeTitle: 'Spring Boot REST Controller',
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
    numero: '03',
    icon: '📄',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(5,150,105,0.05))',
    title: 'Motor de Ficheros',
    sub: 'UT02 · Persistencia en 4 Formatos',
    tech: ['DataOutputStream', 'Jackson JSON', 'DOM XML', 'CSV Builder'],
    summary: 'El núcleo de la asignatura: lectura y escritura en 4 estructuras.',
    description: 'Implementa los 4 formatos requeridos en la UT02:',
    formats: [
      { name: '📦 Binario (.dat)', desc: 'Bytes continuos mediante DataOutputStream (writeUTF, writeDouble).' },
      { name: '📄 XML (.xml)', desc: 'Etiquetas jerárquicas encadenadas (<envio><destino>...</destino></envio>).' },
      { name: '📊 CSV (.csv)', desc: 'Registros tabulares separados por comas para hojas de cálculo.' },
      { name: '🔧 JSON (.json)', desc: 'Pares clave-valor estructurados en objetos JSON.' },
    ],
    codeTitle: 'Escritura Binaria en Java',
    code: `public byte[] guardarBinario(Envio e) throws IOException {
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
    numero: '04',
    icon: '🗄️',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.05))',
    title: 'Base de Datos & ORM',
    sub: 'Persistencia Relacional (H2 / JPA)',
    tech: ['Spring Data JPA', 'Hibernate ORM', 'H2 Database', 'PostgreSQL'],
    summary: 'Mapeo Objeto-Relacional para almacenamiento en BD.',
    description: 'Mapea la entidad Java Envio.java directamente a la tabla ENVIOS de la Base de Datos H2. Permite persistir envíos con ID autonumérico e inspeccionar la BD desde /h2-console.',
    codeTitle: 'Entidad JPA con Hibernate',
    code: `@Entity
@Table(name = "envios")
public class Envio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numeroCliente;
    private Double peso;
}`,
  },
  {
    id: 'deploy',
    numero: '05',
    icon: '☁️',
    color: '#f87171',
    gradient: 'linear-gradient(135deg, rgba(248,113,113,0.2), rgba(220,38,38,0.05))',
    title: 'DevOps & Cloud',
    sub: 'Contenerización Docker + Render + Vercel',
    tech: ['Docker Multi-Stage', 'Render.com', 'Vercel.com', 'Git / GitHub'],
    summary: 'Infraestructura full-stack desplegada en producción.',
    description: 'El backend Java corre empaquetado en un contenedor Docker en Render.com, mientras que el frontend React se despliega en Vercel con integración continua.',
    codeTitle: 'Dockerfile Multi-Stage (Java 21)',
    code: `FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]`,
  },
  {
    id: 'resilient',
    numero: '06',
    icon: '🛡️',
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(37,99,235,0.05))',
    title: 'Arquitectura Híbrida',
    sub: 'Tolerancia a Fallos & Motor Cliente JS',
    tech: ['DataView JS', 'TextDecoder', 'DOMParser', 'LocalStorage'],
    summary: 'Garantiza disponibilidad 100% incluso en servidores suspendidos.',
    description: 'Si el servidor Java de Render tarda en despertar, el navegador conmuta automáticamente al motor cliente JS que decodifica binarios con DataView y guarda en localStorage.',
    codeTitle: 'Decodificador Binario en Cliente JS',
    code: `const view = new DataView(buffer);
const readUTF = () => {
  const len = view.getUint16(offset, false);
  const bytes = new Uint8Array(buffer, offset + 2, len);
  return new TextDecoder().decode(bytes);
};`,
  },
];

export default function PresentacionPage({ onVolver }) {
  const [selectedBlock, setSelectedBlock] = useState(BLOQUES_ARQUITECTURA[0]);

  return (
    <div className="pres-page-wrapper">

      {/* Cabecera Superior con Botón de Volver */}
      <header className="pres-page-header">
        <button className="btn btn-ghost pres-back-btn" onClick={onVolver}>
          ⬅️ Volver a la Aplicación
        </button>
        <div className="pres-page-title">
          <span className="badge">UT02 · Acceso a Datos</span>
          <h1>Arquitectura del Sistema Full-Stack</h1>
          <p>Explora cada uno de los 6 bloques tecnológicos que forman el todo de esta aplicación</p>
        </div>
      </header>

      {/* Grid de Tarjetas 3D por Bloques */}
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

              <p className="cube-summary">{bloque.summary}</p>

              <div className="cube-tech-tags">
                {bloque.tech.slice(0, 3).map((t, i) => (
                  <span key={i} className="cube-tag">⚡ {t}</span>
                ))}
              </div>

              <div className="cube-card-footer">
                <span>{isSelected ? '✓ Seleccionado' : '👆 Clic para inspeccionar'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Panel Detallado del Bloque Seleccionado */}
      <div className="pres-detail-panel" style={{ borderColor: `${selectedBlock.color}60` }}>
        <div className="detail-panel-header">
          <div className="detail-icon-box" style={{ background: `${selectedBlock.color}20`, borderColor: `${selectedBlock.color}50` }}>
            <span>{selectedBlock.icon}</span>
          </div>
          <div>
            <span className="detail-number-badge" style={{ color: selectedBlock.color, borderColor: `${selectedBlock.color}40`, background: `${selectedBlock.color}15` }}>
              Bloque {selectedBlock.numero}
            </span>
            <h2 className="detail-title">{selectedBlock.title}</h2>
            <p className="detail-sub">{selectedBlock.sub}</p>
          </div>
        </div>

        <p className="detail-description">{selectedBlock.description}</p>

        {/* Si tiene formatos desglosados (Bloque 3) */}
        {selectedBlock.formats && (
          <div className="detail-formats-grid">
            {selectedBlock.formats.map((fmt, idx) => (
              <div key={idx} className="detail-format-item">
                <strong>{fmt.name}</strong>
                <p>{fmt.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Visor de Código del Bloque */}
        <div className="detail-code-container">
          <div className="detail-code-bar">
            <span>💻 {selectedBlock.codeTitle}</span>
          </div>
          <pre><code>{selectedBlock.code}</code></pre>
        </div>
      </div>

    </div>
  );
}
