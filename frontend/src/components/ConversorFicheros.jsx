import { useState, useRef } from 'react';
import { abrirFichero, guardarFichero } from '../api';
import ModalConversion from './ModalConversion';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const FORMATOS = [
  { key: 'dat',  label: 'Binario', ext: '.dat',  icon: '📦', color: '#f59e0b' },
  { key: 'xml',  label: 'XML',     ext: '.xml',  icon: '📄', color: '#34d399' },
  { key: 'csv',  label: 'CSV',     ext: '.csv',  icon: '📊', color: '#60a5fa' },
  { key: 'json', label: 'JSON',    ext: '.json', icon: '🔧', color: '#a78bfa' },
];

export default function ConversorFicheros({ onToast }) {
  const [ficheroOrigenNombre, setFicheroOrigenNombre] = useState(null);
  const [formatoOrigenKey, setFormatoOrigenKey]       = useState(null);
  const [envioDatos, setEnvioDatos]                   = useState(null);

  const [formatoDestinoKey, setFormatoDestinoKey]     = useState('xml');
  const [nombreDestino, setNombreDestino]             = useState('');

  const [loadingAbrir, setLoadingAbrir]               = useState(false);
  const [loadingConvertir, setLoadingConvertir]       = useState(false);
  const [dragging, setDragging]                       = useState(false);
  const [showModal, setShowModal]                     = useState(false);

  const fileRef = useRef(null);

  // ─── Tour Guiado con Driver.js ─────────────────────────────
  const handleIniciarGuia = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      nextBtnText: 'Siguiente ➔',
      prevBtnText: '⬅️ Anterior',
      doneBtnText: '✅ Entendido',
      steps: [
        {
          element: '.conversor-card--origen',
          popover: {
            title: '1. Cargar Fichero Origen',
            description: 'Haz clic o arrastra un fichero existente (.dat, .xml, .csv o .json) para inspeccionar y preparar su conversión.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '.conversor-connector',
          popover: {
            title: '2. Indicador de Transición',
            description: 'Muestra el estado del flujo de transformación bidireccional entre los dos formatos.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '.conversor-card--destino',
          popover: {
            title: '3. Selección de Formato Destino',
            description: 'Elige a qué formato quieres transformar el fichero. Se impedirá la conversión si seleccionas el mismo formato de origen.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#b2-nombre-destino',
          popover: {
            title: '4. Nombre del Fichero Resultante',
            description: 'Define el nombre para el archivo convertido (ej. "datos_envio_convertido").',
            side: 'top',
            align: 'start'
          }
        },
        {
          element: '#btn-b2-convertir',
          popover: {
            title: '5. Ejecutar Conversión y Descarga',
            description: 'Transforma la estructura de los datos en memoria y descarga automáticamente el nuevo archivo.',
            side: 'top',
            align: 'center'
          }
        }
      ]
    });

    driverObj.drive();
  };

  // ─── Procesar fichero cargado ────────────────────────────────
  const procesarFicheroOrigen = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['dat', 'xml', 'csv', 'json'].includes(ext)) {
      onToast('⚠️ Formato no admitido. Selecciona un fichero .dat, .xml, .csv o .json', 'error');
      return;
    }

    setLoadingAbrir(true);
    try {
      const datos = await abrirFichero(file);
      setEnvioDatos(datos);
      setFicheroOrigenNombre(file.name);
      setFormatoOrigenKey(ext);

      // Si el formato destino por defecto es igual al origen, elegimos otro por defecto
      const formatosDisponibles = ['xml', 'json', 'csv', 'dat'].filter(f => f !== ext);
      const siguienteFormato = formatosDisponibles[0] || 'xml';
      setFormatoDestinoKey(siguienteFormato);

      // Nombre destino por defecto
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'envio';
      setNombreDestino(`${baseName}_convertido`);

      onToast(`✅ "${file.name}" cargado. ¡Elige el formato al que deseas convertirlo!`, 'success');
    } catch (err) {
      onToast(`❌ Error al leer el fichero: ${err.message}`, 'error');
    } finally {
      setLoadingAbrir(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleResetOrigen = () => {
    setFicheroOrigenNombre(null);
    setFormatoOrigenKey(null);
    setEnvioDatos(null);
    setNombreDestino('');
  };

  // ─── Abrir Modal de Confirmación ─────────────────────────────
  const handleConvertirClick = () => {
    if (!envioDatos) {
      onToast('⚠️ Carga un fichero de origen primero', 'error');
      return;
    }
    if (formatoOrigenKey === formatoDestinoKey) {
      onToast('⚠️ El formato de destino debe ser diferente al de origen', 'error');
      return;
    }
    if (!nombreDestino.trim()) {
      onToast('⚠️ Escribe el nombre para el fichero de destino', 'error');
      return;
    }
    setShowModal(true);
  };

  // ─── Ejecutar Conversión y Descarga ──────────────────────────
  const handleConfirmarConversion = async () => {
    setShowModal(false);
    setLoadingConvertir(true);
    try {
      const filenameGenerado = await guardarFichero(
        envioDatos,
        formatoDestinoKey,
        nombreDestino.trim()
      );
      onToast(`🎉 ¡Conversión completada! "${filenameGenerado}" descargado correctamente`, 'success');
    } catch (err) {
      onToast(`❌ Error durante la conversión: ${err.message}`, 'error');
    } finally {
      setLoadingConvertir(false);
    }
  };

  const fmtOrigen  = FORMATOS.find(f => f.key === formatoOrigenKey);
  const fmtDestino = FORMATOS.find(f => f.key === formatoDestinoKey);
  const esMismoFormato = formatoOrigenKey && formatoOrigenKey === formatoDestinoKey;

  return (
    <>
      <div className="workspace conversor-workspace">
        {/* Cabecera del Bloque 2 */}
        <div className="workspace-header">
          <div className="workspace-title">
            <span className="workspace-icon" style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(52,211,153,0.15))' }}>
              🔄
            </span>
            <div>
              <h2>Bloque 2 · Conversor Interactivo de Ficheros</h2>
              <p className="workspace-sub">
                Carga un fichero existente, examina su contenido extraído y conviértelo a un formato diferente.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              id="btn-b2-guia"
              className="btn btn-cyan btn-sm"
              onClick={handleIniciarGuia}
              title="Iniciar tour guiado paso a paso para el Bloque 2"
            >
              💡 Guía de uso
            </button>
            {ficheroOrigenNombre && (
              <button className="btn btn-ghost btn-sm" onClick={handleResetOrigen}>
                🔄 Cargar otro fichero
              </button>
            )}
          </div>
        </div>

        <div className="workspace-divider" />

        {/* Panel del Conversor: Origen ➔ Flecha ➔ Destino */}
        <div className="conversor-grid">
          {/* ── Extremo Izquierdo: Fichero Origen ── */}
          <div className="conversor-card conversor-card--origen">
            <div className="conversor-card-header">
              <span className="card-badge card-badge--origen">1. Fichero Origen</span>
              {fmtOrigen && (
                <span className="format-tag" style={{ background: `${fmtOrigen.color}20`, color: fmtOrigen.color, borderColor: `${fmtOrigen.color}40` }}>
                  {fmtOrigen.icon} {fmtOrigen.label}
                </span>
              )}
            </div>

            {!envioDatos ? (
              <div
                className={`drop-zone conversor-drop${dragging ? ' dragging' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragging(false);
                  procesarFicheroOrigen(e.dataTransfer.files?.[0]);
                }}
              >
                {loadingAbrir ? (
                  <>
                    <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
                    <span className="drop-text">Leyendo y analizando fichero…</span>
                  </>
                ) : (
                  <>
                    <span className="drop-icon">📂</span>
                    <span className="drop-text">Cargar fichero origen</span>
                    <span className="drop-hint">Formatos: .csv · .xml · .json · .dat</span>
                  </>
                )}
              </div>
            ) : (
              <div className="parsed-data-card">
                <div className="parsed-file-title">
                  <span>📁</span>
                  <strong>{ficheroOrigenNombre}</strong>
                </div>

                <div className="parsed-data-grid">
                  <div className="parsed-item">
                    <span className="parsed-label">Nº Cliente</span>
                    <span className="parsed-value">{envioDatos.numeroCliente || '—'}</span>
                  </div>
                  <div className="parsed-item">
                    <span className="parsed-label">Seguimiento</span>
                    <span className="parsed-value">{envioDatos.numeroSeguimiento || '—'}</span>
                  </div>
                  <div className="parsed-item parsed-item--wide">
                    <span className="parsed-label">Destino</span>
                    <span className="parsed-value">{envioDatos.destino || '—'}</span>
                  </div>
                  <div className="parsed-item">
                    <span className="parsed-label">Peso</span>
                    <span className="parsed-value">{envioDatos.peso ? `${envioDatos.peso} kg` : '—'}</span>
                  </div>
                  <div className="parsed-item">
                    <span className="parsed-label">F. Envío</span>
                    <span className="parsed-value">{envioDatos.fechaEnvio || '—'}</span>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileRef}
              id="input-conversor-origen"
              type="file"
              accept=".dat,.xml,.csv,.json"
              style={{ display: 'none' }}
              onChange={e => procesarFicheroOrigen(e.target.files?.[0])}
            />
          </div>

          {/* ── Centro: Flecha Indicadora de Conversión ── */}
          <div className="conversor-connector">
            <div className={`connector-arrow${envioDatos ? ' active' : ''}`}>
              <span>➔</span>
            </div>
            <span className="connector-text">
              {envioDatos ? 'Conversión lista' : 'Esperando fichero'}
            </span>
          </div>

          {/* ── Extremo Derecho: Fichero Destino ── */}
          <div className="conversor-card conversor-card--destino">
            <div className="conversor-card-header">
              <span className="card-badge card-badge--destino">2. Formato Destino</span>
              {fmtDestino && (
                <span className="format-tag" style={{ background: `${fmtDestino.color}20`, color: fmtDestino.color, borderColor: `${fmtDestino.color}40` }}>
                  {fmtDestino.icon} {fmtDestino.label}
                </span>
              )}
            </div>

            {/* Selector de formato destino */}
            <div className="ws-control-group">
              <span className="ws-control-label">Elige el formato de salida</span>
              <div className="format-selector ws-format">
                {FORMATOS.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    id={`b2-formato-${key}`}
                    className={`format-btn${formatoDestinoKey === key ? ' active' : ''}${formatoOrigenKey === key ? ' is-source' : ''}`}
                    onClick={() => setFormatoDestinoKey(key)}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advertencia pedagógica si es el mismo formato */}
            {esMismoFormato && (
              <div className="conversion-warning">
                ⚠️ El fichero cargado ya está en formato <strong>{fmtOrigen?.label}</strong>. Selecciona un formato destino diferente para realizar la conversión.
              </div>
            )}

            {/* Nombre del fichero destino */}
            <div className="ws-control-group" style={{ marginTop: '0.8rem' }}>
              <span className="ws-control-label">Nombre del nuevo fichero</span>
              <div className="filename-wrapper">
                <input
                  id="b2-nombre-destino"
                  type="text"
                  value={nombreDestino}
                  placeholder="nombre_salida"
                  onChange={e => setNombreDestino(e.target.value)}
                  disabled={!envioDatos}
                />
                <span className="filename-ext">{fmtDestino?.ext}</span>
              </div>
            </div>

            {/* Botón Convertir y Descargar */}
            <button
              id="btn-b2-convertir"
              className="btn btn-cyan"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={handleConvertirClick}
              disabled={!envioDatos || esMismoFormato || loadingConvertir || !nombreDestino.trim()}
            >
              {loadingConvertir ? (
                <><div className="spinner" /> Convirtiendo y descargando…</>
              ) : (
                '🔄 Convertir y Descargar'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal pedagógico de confirmación de conversión */}
      {showModal && (
        <ModalConversion
          ficheroOrigenNombre={ficheroOrigenNombre}
          formatoOrigenKey={formatoOrigenKey}
          nombreDestino={nombreDestino.trim()}
          formatoDestinoKey={formatoDestinoKey}
          onConfirmar={handleConfirmarConversion}
          onCancelar={() => setShowModal(false)}
        />
      )}
    </>
  );
}
