import { useState } from 'react';
import { guardarFichero, saveEnvioToDB } from '../api';
import ModalConfirmacion from './ModalConfirmacion';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const FORMATOS = [
  { key: 'dat',  label: 'Binario', ext: '.dat',  icon: '📦' },
  { key: 'xml',  label: 'XML',     ext: '.xml',  icon: '📄' },
  { key: 'csv',  label: 'CSV',     ext: '.csv',  icon: '📊' },
  { key: 'json', label: 'JSON',    ext: '.json', icon: '🔧' },
];

const CAMPOS = [
  { key: 'numeroCliente',        label: 'Nº Cliente',          type: 'text',   placeholder: 'CLI-001' },
  { key: 'numeroSeguimiento',    label: 'Nº Seguimiento',      type: 'text',   placeholder: 'SEG-2024-0001' },
  { key: 'destino',              label: 'Destino',             type: 'text',   placeholder: 'Madrid, España', wide: true },
  { key: 'peso',                 label: 'Peso (kg)',           type: 'number', placeholder: '2.5' },
  { key: 'fechaEnvio',           label: 'Fecha de envío',      type: 'date',   placeholder: '' },
  { key: 'fechaEstimadaEntrega', label: 'Entrega estimada',    type: 'date',   placeholder: '' },
];

const getTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const VACIO = {
  numeroCliente: '', numeroSeguimiento: '', destino: '',
  peso: '', fechaEnvio: '', fechaEstimadaEntrega: '',
};

export default function Workspace({ onToast, onGuardadoDB }) {
  const [form, setForm]           = useState(VACIO);
  const [formato, setFormato]     = useState('json');
  const [nombre, setNombre]       = useState('envio');
  const [showModal, setShowModal] = useState(false);
  const [loadingFile, setLF]      = useState(false);
  const [loadingDB, setLDB]       = useState(false);

  const todayStr = getTodayStr();
  const ext = FORMATOS.find(f => f.key === formato)?.ext || '';

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const handleLimpiar = () => setForm(VACIO);

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
          element: '#ws-numeroCliente',
          popover: {
            title: '1. Número de Cliente',
            description: 'Introduce el código único del cliente (ejemplo: CLI-001).',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#ws-numeroSeguimiento',
          popover: {
            title: '2. Número de Seguimiento',
            description: 'Código de rastreo único asignado al paquete (ejemplo: SEG-2026-0001).',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#ws-destino',
          popover: {
            title: '3. Destino',
            description: 'Ciudad y país de entrega del envío (ejemplo: Madrid, España).',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#ws-peso',
          popover: {
            title: '4. Peso en Kilogramos',
            description: 'Peso del envío (ej. 2.5 kg). Debe ser un valor numérico mayor que 0.',
            side: 'top',
            align: 'start'
          }
        },
        {
          element: '#ws-fechaEnvio',
          popover: {
            title: '5. Fecha de Envío',
            description: 'Fecha de salida. No se permiten fechas anteriores al día de hoy.',
            side: 'top',
            align: 'start'
          }
        },
        {
          element: '#ws-fechaEstimadaEntrega',
          popover: {
            title: '6. Fecha Estimada de Entrega',
            description: 'Fecha prevista de recepción. No puede ser anterior a la fecha de envío.',
            side: 'top',
            align: 'start'
          }
        },
        {
          element: '#b1-formato-json',
          popover: {
            title: '7. Formato de Salida',
            description: 'Elige cómo estructurar los datos del fichero: Binario (.dat), XML (.xml), CSV (.csv) o JSON (.json).',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#b1-nombre-fichero',
          popover: {
            title: '8. Nombre del Fichero',
            description: 'Escribe ÚNICAMENTE el nombre base sin extensión (ej. "envio_madrid"). La app añadirá la extensión automáticamente.',
            side: 'top',
            align: 'start'
          }
        },
        {
          element: '#btn-b1-guardar-fichero',
          popover: {
            title: '9. Guardar en Fichero',
            description: 'Valida los datos e inicie la descarga del fichero en tu ordenador.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#btn-b1-guardar-db',
          popover: {
            title: '10. Guardado en Base de Datos',
            description: 'Actualmente deshabilitado. Se desarrollará en las unidades de Bases de Datos y ORM (UT03/UT04).',
            side: 'top',
            align: 'center'
          }
        }
      ]
    });

    driverObj.drive();
  };

  // ─── Función de Validación del Formulario ───────────────────
  const validar = (esParaFichero = false) => {
    if (!form.numeroCliente?.trim()) {
      onToast('⚠️ El campo "Nº Cliente" no puede estar vacío.', 'error');
      return false;
    }
    if (!form.numeroSeguimiento?.trim()) {
      onToast('⚠️ El campo "Nº Seguimiento" no puede estar vacío.', 'error');
      return false;
    }
    if (!form.destino?.trim()) {
      onToast('⚠️ El campo "Destino" no puede estar vacío.', 'error');
      return false;
    }
    if (form.peso === '' || form.peso === null || form.peso === undefined || Number(form.peso) <= 0) {
      onToast('⚠️ El campo "Peso" debe ser un número mayor que 0.', 'error');
      return false;
    }
    if (!form.fechaEnvio?.trim()) {
      onToast('⚠️ Debes seleccionar una "Fecha de envío".', 'error');
      return false;
    }
    if (form.fechaEnvio < todayStr) {
      onToast(`⚠️ La Fecha de Envío (${form.fechaEnvio}) no puede ser anterior a la fecha actual (${todayStr}).`, 'error');
      return false;
    }
    if (!form.fechaEstimadaEntrega?.trim()) {
      onToast('⚠️ Debes seleccionar una "Fecha de Entrega Estimada".', 'error');
      return false;
    }
    if (form.fechaEstimadaEntrega < form.fechaEnvio) {
      onToast(`⚠️ La Fecha de Entrega Estimada (${form.fechaEstimadaEntrega}) no puede ser anterior a la Fecha de Envío (${form.fechaEnvio}).`, 'error');
      return false;
    }
    if (esParaFichero && !nombre.trim()) {
      onToast('⚠️ Escribe el nombre del fichero a guardar.', 'error');
      return false;
    }
    return true;
  };

  // ─── Abrir Modal de Confirmación Fichero ─────────────────────
  const handleGuardarFileClick = () => {
    if (!validar(true)) return;
    setShowModal(true);
  };

  // ─── Confirmar descarga de Fichero ───────────────────────────
  const handleConfirmarFile = async () => {
    setShowModal(false);
    setLF(true);
    try {
      const filename = await guardarFichero(form, formato, nombre.trim());
      onToast(`✅ "${filename}" guardado y descargado en tu ordenador`, 'success');
    } catch (e) {
      onToast(`❌ Error al guardar fichero: ${e.message}`, 'error');
    } finally {
      setLF(false);
    }
  };

  // ─── Guardar en Base de Datos ────────────────────────────────
  const handleGuardarDBClick = async () => {
    if (!validar(false)) return;
    setLDB(true);
    try {
      const saved = await saveEnvioToDB(form);
      onToast(`🎉 Envío registrado en la Base de Datos con ID #${saved.id}`, 'success');
      if (onGuardadoDB) onGuardadoDB();
    } catch (e) {
      onToast(`❌ Error al guardar en Base de Datos: ${e.message}`, 'error');
    } finally {
      setLDB(false);
    }
  };

  return (
    <>
      <div className="workspace">
        {/* Cabecera del Bloque 1 */}
        <div className="workspace-header">
          <div className="workspace-title">
            <span className="workspace-icon">✍️</span>
            <div>
              <h2>Bloque 1 · Creación y Persistencia de Envíos</h2>
              <p className="workspace-sub">
                Introduce los datos del envío y elige si deseas guardarlo en un fichero físico o en la Base de Datos.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              id="btn-b1-guia"
              className="btn btn-cyan btn-sm"
              onClick={handleIniciarGuia}
              title="Iniciar tour guiado paso a paso para el Bloque 1"
            >
              💡 Guía de uso
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleLimpiar}>🗑️ Limpiar formulario</button>
          </div>
        </div>

        <div className="workspace-divider" />

        {/* Campos del formulario */}
        <div className="ws-form-grid">
          {CAMPOS.map(({ key, label, type, placeholder, wide }) => {
            let minAttr = undefined;
            if (type === 'number') minAttr = 0;
            if (key === 'fechaEnvio') minAttr = todayStr;
            if (key === 'fechaEstimadaEntrega') minAttr = form.fechaEnvio || todayStr;

            return (
              <div key={key} className={`ws-field${wide ? ' ws-field--wide' : ''}`}>
                <label htmlFor={`ws-${key}`}>{label}</label>
                <input
                  id={`ws-${key}`}
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  min={minAttr}
                  step={type === 'number' ? 0.01 : undefined}
                  onChange={e => handleChange(key, e.target.value)}
                  onClick={type === 'date' ? (e => { try { if (e.target.showPicker) e.target.showPicker(); } catch {} }) : undefined}
                />
              </div>
            );
          })}
        </div>

        <div className="workspace-divider" />

        {/* Controles: Formato + Nombre */}
        <div className="ws-controls">
          {/* Formato */}
          <div className="ws-control-group">
            <span className="ws-control-label">Formato de Fichero</span>
            <div className="format-selector ws-format">
              {FORMATOS.map(({ key, label, icon }) => (
                <button
                  key={key}
                  id={`b1-formato-${key}`}
                  className={`format-btn${formato === key ? ' active' : ''}`}
                  onClick={() => setFormato(key)}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre del archivo */}
          <div className="ws-control-group ws-control-group--name">
            <span className="ws-control-label">Nombre del fichero</span>
            <div className="filename-wrapper">
              <input
                id="b1-nombre-fichero"
                type="text"
                value={nombre}
                placeholder="nombre_fichero"
                onChange={e => setNombre(e.target.value)}
              />
              <span className="filename-ext">{ext}</span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="ws-actions">
          <button
            id="btn-b1-guardar-fichero"
            className="btn btn-primary ws-btn"
            onClick={handleGuardarFileClick}
            disabled={loadingFile}
          >
            {loadingFile ? <><div className="spinner" /> Guardando fichero…</> : '💾 Guardar en Fichero'}
          </button>

          <button
            id="btn-b1-guardar-db"
            className="btn btn-secondary ws-btn"
            disabled={true}
            style={{ cursor: 'not-allowed', opacity: 0.75 }}
            title="Módulo de almacenamiento en Base de Datos pospuesto para próximas unidades (UT03/UT04)"
          >
            🚧 Pendiente por desarrollar almacenamiento en base de datos
          </button>
        </div>
      </div>

      {/* Pop-up modal de confirmación de fichero */}
      {showModal && (
        <ModalConfirmacion
          formato={formato}
          nombreFichero={nombre.trim()}
          onConfirmar={handleConfirmarFile}
          onCancelar={() => setShowModal(false)}
        />
      )}
    </>
  );
}
