import { useState } from 'react';

const LIBRERIAS_BACKEND = [
  {
    name: 'spring-boot-starter-web',
    file: 'pom.xml',
    version: '3.x',
    purpose: 'Framework Web REST API & Servidor Embebido',
    description: 'Proporciona la arquitectura Spring MVC, servidor Apache Tomcat embebido y controladores anotados con @RestController para exponer endpoints REST HTTP.',
    justification: 'Permite crear una API limpia y desacoplada que procesa las peticiones de guardado y conversión de ficheros recibiendo y devolviendo JSON, XML o flujos binarios.'
  },
  {
    name: 'spring-boot-starter-data-jpa',
    file: 'pom.xml',
    version: '3.x',
    purpose: 'Persistencia Objeto-Relacional (ORM Hibernate)',
    description: 'Abstracción JPA sobre Hibernate ORM. Mapea la entidad Envio.java a tablas SQL relacionales y ofrece repositorios sin escribir SQL manual.',
    justification: 'Evita la inyección SQL y el código repetitivo de JDBC tradicional, automatizando las operaciones CRUD mediante EnvioRepository que extiende JpaRepository.'
  },
  {
    name: 'com.h2database:h2',
    file: 'pom.xml',
    version: '2.x',
    purpose: 'Motor de Base de Datos Relacional In-Memory',
    description: 'Base de datos en memoria ultraligera (jdbc:h2:mem:enviosdb) que se inicia automáticamente con la aplicación Spring Boot.',
    justification: 'Permite evaluar el proyecto de inmediato sin requerir la instalación o configuración de servidores de bases de datos externos como MySQL o PostgreSQL en la máquina del profesor.'
  },
  {
    name: 'jackson-dataformat-xml',
    file: 'pom.xml',
    version: '2.x',
    purpose: 'Serialización y Deserialización XML Native',
    description: 'Módulo de Jackson que extiende el XmlMapper/ObjectMapper para serializar objetos Java DTO a XML estructurado (<envio>...</envio>) y viceversa.',
    justification: 'Garantiza la generación y parsing automático de ficheros XML sin necesidad de manipular cadenas de texto manualmente ni depender de transformaciones DOM complejas.'
  },
  {
    name: 'spring-boot-starter-test',
    file: 'pom.xml',
    version: '3.x',
    purpose: 'Suite de Pruebas Unitarias e Integración',
    description: 'Incluye JUnit 5, AssertJ, Mockito y Spring Test para validar los controladores y el servicio de gestión de ficheros.',
    justification: 'Asegura la calidad del código verificando el comportamiento correcto del motor de ficheros ante casos límite.'
  },
  {
    name: 'maven-compiler-plugin (Java 21)',
    file: 'pom.xml',
    version: '3.11+',
    purpose: 'Compilador para sintaxis moderna Java 21 LTS',
    description: 'Plugin de Maven configurado para compilar bajo JDK 21 LTS activando expresiones switch modernas y patrones de concordancia (Pattern Matching).',
    justification: 'Aprovecha las últimas características de Java para un código más legible, seguro y eficiente.'
  }
];

const LIBRERIAS_FRONTEND = [
  {
    name: 'react & react-dom',
    file: 'package.json',
    version: '19.0',
    purpose: 'Biblioteca Reactiva de Interfaz de Usuario',
    description: 'Librería central de la interfaz estructurada en componentes reactivos mediante Hooks (useState, useEffect, useRef, useMemo).',
    justification: 'Renderiza los cambios en el DOM Virtual al instante sin recargar la página web, ofreciendo una experiencia fluida al cambiar de pestaña o convertir ficheros.'
  },
  {
    name: 'vite & @vitejs/plugin-react',
    file: 'package.json',
    version: '6.x',
    purpose: 'Bundler y Servidor Dev de Última Generación',
    description: 'Herramienta de compilación basada en Native ES Modules con reemplazo de módulos en caliente (HMR) ultra-rápido.',
    justification: 'Optimiza el empaquetado para producción y acelera el desarrollo sin la sobrecarga de herramientas tradicionales como Webpack.'
  },
  {
    name: 'canvas-confetti',
    file: 'package.json',
    version: '1.9',
    purpose: 'Efecto Visual de Celebración Interactivo',
    description: 'Disparador de partículas tipo confeti mediante Canvas HTML5 al realizar operaciones exitosas.',
    justification: 'Aporta valor pedagógico y retroalimentación visual satisfactoria cuando se genera o convierte un fichero de forma correcta.'
  }
];

const LIBRERIAS_DEVOPS = [
  {
    name: 'pdfkit',
    file: 'generate_pdf.cjs',
    version: '0.16',
    purpose: 'Generación Vectorial de la Memoria Oficial PDF',
    description: 'Librería Node.js para maquetación programática en vector del archivo PDF entregable para el Campus Virtual.',
    justification: 'Permite generar la memoria académica oficial con enlaces hipertexto clicables sin depender de navegadores o herramientas externas.'
  },
  {
    name: 'Docker (Multi-Stage Build)',
    file: 'Dockerfile',
    version: 'OCI Standard',
    purpose: 'Contenerización de la API Backend en Java 21',
    description: 'Estructura en 2 capas: Stage 1 para compilar con Maven + JDK 21 y Stage 2 con JRE 21 minimal para ejecución.',
    justification: 'Garantiza la ejecucionalidad uniforme de la API en la nube (Render.com) aislada de variaciones del sistema operativo anfitrión.'
  },
  {
    name: 'Motor Cliente DataView JS',
    file: 'api.js',
    version: 'ES2024 Native',
    purpose: 'Parser y Codificador Binario en el Cliente',
    description: 'Implementación espejo en JavaScript con DataView, TextDecoder y DOMParser para manipular binarios de Java (.dat) localmente.',
    justification: 'Otorga resiliencia al sistema: Si el servidor gratuito de Render se queda dormido por inactividad, la web funciona al 100% sin cuelgues.'
  }
];

const GUIA_PASOS = [
  {
    step: '01',
    title: 'Acceso a la Aplicación & Tolerancia a Fallos',
    tag: 'Web & Resiliencia',
    color: '#3b82f6',
    desc: 'Navega a la URL desplegada en Vercel. La aplicación verifica en segundo plano la disponibilidad del backend Java en Render. Si el backend gratuito tarda en despertar, el sistema conmuta sin interrupciones al motor local JavaScript con DataView y localStorage.'
  },
  {
    step: '02',
    title: 'Bloque 1: Crear y Persistir Envíos Logísticos',
    tag: 'Formulario & Persistencia',
    color: '#8b5cf6',
    desc: 'Introduce los datos del envío (Código de cliente, seguimiento, destino, peso, fechas). Haz clic en "💾 Guardar en Fichero" para descargar en formato .dat, .xml, .csv o .json, o pulsa "🗄️ Guardar en BD" para registrarlo físicamente mediante Spring Data JPA.'
  },
  {
    step: '03',
    title: 'Bloque 2: Conversor Interactivo Bidireccional',
    tag: 'Conversión de Ficheros',
    color: '#ec4899',
    desc: 'Accede al bloque Conversor de Ficheros. Pega o carga el código de un archivo existente, selecciona el formato de origen y el formato de destino deseado (por ejemplo, XML a Binario .dat o CSV a JSON) y pulsa "⚡ Convertir Fichero". El sistema valida las diferencias y previene conversiones redundantes.'
  },
  {
    step: '04',
    title: 'Bloque 3: Inspección de Código en el Visor IDE',
    tag: 'Visor Web estilo Editor',
    color: '#10b981',
    desc: 'Inspecciona la estructura cruda formateada de cualquier fichero desde las pestañas del Visor Web. Incluye números de línea, resaltado de sintaxis, estado de carga y botón de copia rápida al portapapeles para evitar el uso de editores de texto externos.'
  },
  {
    step: '05',
    title: 'Bloque 4: Historial en Base de Datos Relacional H2',
    tag: 'Base de Datos & JPA',
    color: '#f59e0b',
    desc: 'Consulta todos los envíos registrados en la tabla relacional H2. Puedes pulsar el botón "👁️ Ver en Visor" de cualquier registro para auditar su estructura cruda en JSON o XML directamente en el visor de código.'
  },
  {
    step: '06',
    title: 'Presentación Académica de Defensa en Cubo 3D',
    tag: 'Ruta /presentacion',
    color: '#06b6d4',
    desc: 'Haz clic en el botón flotante ubicado en la esquina superior izquierda (con animación de vibración de 3 segundos al iniciar) para entrar en la ruta de presentación interactiva por cubos 3D donde se defienden los 6 bloques del proyecto con justificaciones y código.'
  },
  {
    step: '07',
    title: 'Memoria Oficial del Proyecto en PDF',
    tag: 'Entrega Campus Virtual',
    color: '#64748b',
    desc: 'Descarga o adjunta el documento Proyecto_UT02_AccesoADatos_MoisesDeLima.pdf que contiene la memoria oficial con los enlaces de la web en Vercel, la API REST en Render y el repositorio completo en GitHub.'
  }
];

export default function DocumentacionGuia() {
  const [activeTab, setActiveTab] = useState('librerias'); // 'librerias' | 'guia'

  return (
    <div id="seccion-documentacion-guia" className="card glass-card" style={{ marginTop: '2.5rem' }}>
      
      {/* Cabecera del Componente */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: 'rgba(167, 139, 250, 0.15)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(167, 139, 250, 0.3)', color: '#a78bfa', fontSize: '1.5rem' }}>
            📚
          </div>
          <div>
            <span className="badge" style={{ background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.4)' }}>
              Documentación Académica & Justificación
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.2rem 0 0 0', color: 'var(--text-heading)' }}>
              Explicación de Paquetes, Librerías & Guía de Uso
            </h2>
          </div>
        </div>

        {/* Interruptor de Pestañas */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', padding: '0.25rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <button
            className={`btn btn-sm ${activeTab === 'librerias' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('librerias')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}
          >
            <span>📦 Inventario de Paquetes</span>
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'guia' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('guia')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}
          >
            <span>🗺️ Guía de Uso Paso a Paso</span>
          </button>
        </div>
      </div>

      {/* CONTENIDO 1: EXPLICACIÓN DE LIBRERÍAS Y PAQUETES */}
      {activeTab === 'librerias' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Categoría A: Backend Java */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.2rem' }}>☕</span>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#22d3ee' }}>1. Backend Java & Spring Boot (pom.xml)</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {LIBRERIAS_BACKEND.map((lib, idx) => (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.1rem', borderRadius: '10px', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ color: '#60a5fa', fontSize: '0.95rem' }}>{lib.name}</strong>
                    <span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', border: '1px solid rgba(96, 165, 250, 0.3)' }}>{lib.file}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, margin: '0.2rem 0 0.5rem 0' }}>📌 {lib.purpose}</p>
                  <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>{lib.description}</p>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '6px', borderLeft: '3px solid #22d3ee' }}>
                    <strong>Justificación:</strong> {lib.justification}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Categoría B: Frontend React */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚛️</span>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#a78bfa' }}>2. Frontend React 19 & Vite (package.json)</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {LIBRERIAS_FRONTEND.map((lib, idx) => (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.1rem', borderRadius: '10px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ color: '#c084fc', fontSize: '0.95rem' }}>{lib.name}</strong>
                    <span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)' }}>{lib.file}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#e879f9', fontWeight: 600, margin: '0.2rem 0 0.5rem 0' }}>📌 {lib.purpose}</p>
                  <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>{lib.description}</p>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '6px', borderLeft: '3px solid #a78bfa' }}>
                    <strong>Justificación:</strong> {lib.justification}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Categoría C: Tooling & DevOps */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🛠️</span>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#34d399' }}>3. Generación de Informes, Resiliencia & DevOps</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {LIBRERIAS_DEVOPS.map((lib, idx) => (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.1rem', borderRadius: '10px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>{lib.name}</strong>
                    <span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>{lib.file}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 600, margin: '0.2rem 0 0.5rem 0' }}>📌 {lib.purpose}</p>
                  <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>{lib.description}</p>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '6px', borderLeft: '3px solid #34d399' }}>
                    <strong>Justificación:</strong> {lib.justification}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* CONTENIDO 2: GUÍA DE USO PASO A PASO */}
      {activeTab === 'guia' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {GUIA_PASOS.map((paso, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    background: paso.color,
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    letterSpacing: '0.5px'
                  }}
                >
                  Paso {paso.step}
                </span>
                <span className="badge" style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>
                  {paso.tag}
                </span>
              </div>

              <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>{paso.title}</span>
              </h4>

              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                {paso.desc}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
