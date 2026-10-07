import { useState, useRef } from 'react';
import { abrirFichero } from '../api';
import ModalVisorWeb from './ModalVisorWeb';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const FORMATOS = [
  { key: 'dat',  label: 'Binario', ext: '.dat',  icon: '📦', color: '#f59e0b' },
  { key: 'xml',  label: 'XML',     ext: '.xml',  icon: '📄', color: '#34d399' },
  { key: 'csv',  label: 'CSV',     ext: '.csv',  icon: '📊', color: '#60a5fa' },
  { key: 'json', label: 'JSON',    ext: '.json', icon: '🔧', color: '#a78bfa' },
];

export default function VisorWebFicheros({ onToast }) {
  const [ficheroNombre, setFicheroNombre]       = useState(null);
  const [formatoDetectado, setFormatoDetectado] = useState(null);
  const [rawTextInicial, setRawTextInicial]     = useState(null);
  const [envioDatos, setEnvioDatos]             = useState(null);

  const [formatoElegido, setFormatoElegido]     = useState('json');
  const [loading, setLoading]                   = useState(false);
  const [dragging, setDragging]                 = useState(false);
  const [showVisor, setShowVisor]               = useState(false);

  const fileRef = useRef(null);

  // ─── Tour Guiado con Driver.js (Abre Modal Automáticamente) ─
  const handleIniciarGuia = () => {
    // Si no hay datos cargados, preparamos datos de ejemplo pedagógicos para la demostración
    if (!envioDatos) {
      setEnvioDatos({
        numeroCliente: 'CLI-001',
        numeroSeguimiento: 'SEG-2026-DEMO',
        destino: 'Madrid, España',
        peso: 2.5,
        fechaEnvio: '2026-10-07',
        fechaEstimadaEntrega: '2026-10-10'
      });
      setFicheroNombre('envio_demo_ejemplo.json');
      setFormatoDetectado('json');
      setFormatoElegido('json');
    }

    // Abrimos el modal de inspección
    setShowVisor(true);

    // Damos un breve margen (150ms) para que el modal renderice en el DOM
    setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        nextBtnText: 'Siguiente ➔',
        prevBtnText: '⬅️ Anterior',
        doneBtnText: '✅ Entendido',
        steps: [
          {
            element: '#visor-modal-box',
            popover: {
              title: '1. Visor Web IDE Integrado',
              description: 'Al cargar cualquier archivo, se abre esta ventana que permite leer e inspeccionar el código interno sin aplicaciones externas.',
              side: 'bottom',
              align: 'center'
            }
          },
          {
            element: '#visor-tabs-bar',
            popover: {
              title: '2. Pestañas de Formato Dinámico',
              description: 'Puedes hacer clic en JSON, XML, CSV o Binario (.dat) para ver en tiempo real cómo se estructuran los mismos datos en los 4 formatos.',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#visor-explanation',
            popover: {
              title: '3. Explicación Técnica y Pedagógica',
              description: 'Muestra una definición clara del formato seleccionado (por ejemplo, qué es JSON, etiquetas XML, filas CSV o el HexDump en Binario).',
              side: 'bottom',
              align: 'start'
            }
          },
          {
            element: '#visor-code-container',
            popover: {
              title: '4. Editor de Código con Números de Línea',
              description: 'Muestra el contenido crudo decodificado con resaltado y numeración de líneas idéntica a un entorno IDE profesional.',
              side: 'top',
              align: 'center'
            }
          },
          {
            element: '#visor-header-actions',
            popover: {
              title: '5. Copiar al Portapapeles y Cerrar',
              description: 'Permite copiar el contenido del archivo con un solo clic o cerrar la ventana de inspección.',
              side: 'left',
              align: 'start'
            }
          }
        ]
      });

      driverObj.drive();
    }, 150);
  };

  // ─── Leer fichero ────────────────────────────────────────────
  const procesarFichero = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['dat', 'xml', 'csv', 'json'].includes(ext)) {
      onToast('⚠️ Formato no admitido. Usa .dat, .xml, .csv o .json', 'error');
      return;
    }

    setLoading(true);
    try {
      // 1. Leer contenido en texto crudo (si no es binario) para el visor
      if (ext !== 'dat') {
        const text = await file.text();
        setRawTextInicial(text);
      } else {
        setRawTextInicial(null);
      }

      // 2. Parsear objeto envio desde backend API
      const datos = await abrirFichero(file);
      setEnvioDatos(datos);
      setFicheroNombre(file.name);
      setFormatoDetectado(ext);
      setFormatoElegido(ext); // Por defecto se elige el formato original del fichero

      onToast(`✅ "${file.name}" analizado. Selecciona un formato y abre el Visor Web.`, 'success');
    } catch (err) {
      onToast(`❌ Error al leer fichero: ${err.message}`, 'error');
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleReset = () => {
    setFicheroNombre(null);
    setFormatoDetectado(null);
    setRawTextInicial(null);
    setEnvioDatos(null);
  };

  const handleAbrirVisor = () => {
    if (!envioDatos) {
      onToast('⚠️ Carga un fichero primero para abrir el Visor Web', 'error');
      return;
    }
    setShowVisor(true);
  };

  const fmtOriginal = FORMATOS.find(f => f.key === formatoDetectado);

  return (
    <>
      <div className="workspace visor-workspace">
        {/* Cabecera del Bloque 3 */}
        <div className="workspace-header">
          <div className="workspace-title">
            <span className="workspace-icon" style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(108,99,255,0.15))' }}>
              👁️
            </span>
            <div>
              <h2>Bloque 3 · Visor Web de Archivos</h2>
              <p className="workspace-sub">
                Inspecciona cualquier fichero directamente en el navegador sin abrir programas externos (Notepad, Excel o IDEs).
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              id="btn-b3-guia"
              className="btn btn-cyan btn-sm"
              onClick={handleIniciarGuia}
              title="Iniciar tour guiado paso a paso para el Bloque 3"
            >
              💡 Guía de uso
            </button>
            {ficheroNombre && (
              <button className="btn btn-ghost btn-sm" onClick={handleReset}>
                🔄 Cargar otro archivo
              </button>
            )}
          </div>
        </div>

        <div className="workspace-divider" />

        {/* Zona de Carga / Configuración del Visor */}
        {!envioDatos ? (
          <div
            className={`drop-zone visor-dropzone${dragging ? ' dragging' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setDragging(false);
              procesarFichero(e.dataTransfer.files?.[0]);
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
                <span className="drop-text">Cargando y analizando estructura del fichero…</span>
              </>
            ) : (
              <>
                <span className="drop-icon">📂</span>
                <span className="drop-text">Cargar archivo para inspeccionar</span>
                <span className="drop-hint">Soporta: .dat · .xml · .csv · .json</span>
              </>
            )}
          </div>
        ) : (
          <div className="visor-panel-loaded">
            {/* Cabecera del archivo cargado */}
            <div className="loaded-file-bar">
              <div className="loaded-file-info">
                <span className="file-icon">📄</span>
                <strong>{ficheroNombre}</strong>
                {fmtOriginal && (
                  <span className="format-tag" style={{ background: `${fmtOriginal.color}20`, color: fmtOriginal.color, borderColor: `${fmtOriginal.color}40` }}>
                    {fmtOriginal.icon} Formato original: {fmtOriginal.label}
                  </span>
                )}
              </div>
            </div>

            {/* Pregunta interactiva de selección de vista */}
            <div className="visor-selector-box">
              <p className="visor-question">
                ❓ ¿Deseas visualizar este archivo en su <strong>formato original ({fmtOriginal?.label})</strong> o explorar cómo se estructuraría en los otros formatos?
              </p>

              <div className="visor-format-options">
                {FORMATOS.map(({ key, label, icon, color }) => {
                  const esOriginal = key === formatoDetectado;
                  const esSeleccionado = key === formatoElegido;
                  return (
                    <button
                      key={key}
                      className={`visor-option-btn${esSeleccionado ? ' selected' : ''}${esOriginal ? ' is-original' : ''}`}
                      style={esSeleccionado ? { borderColor: color, background: `${color}15`, color: color } : {}}
                      onClick={() => setFormatoElegido(key)}
                    >
                      <span className="option-icon">{icon}</span>
                      <span className="option-label">{label}</span>
                      {esOriginal && <span className="option-badge">Original</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón de apertura del Visor Web */}
            <button
              id="btn-abrir-visor-web"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              onClick={handleAbrirVisor}
            >
              👁️ Abrir Visor Web ({FORMATOS.find(f => f.key === formatoElegido)?.label})
            </button>
          </div>
        )}

        <input
          ref={fileRef}
          id="input-visor-fichero"
          type="file"
          accept=".dat,.xml,.csv,.json"
          style={{ display: 'none' }}
          onChange={e => procesarFichero(e.target.files?.[0])}
        />
      </div>

      {/* Modal / Ventana del Visor Web */}
      {showVisor && (
        <ModalVisorWeb
          nombreFichero={ficheroNombre}
          formatoInicial={formatoElegido}
          rawContentInicial={formatoElegido === formatoDetectado ? rawTextInicial : null}
          envioDatos={envioDatos}
          onCerrar={() => setShowVisor(false)}
          onToast={onToast}
        />
      )}
    </>
  );
}
