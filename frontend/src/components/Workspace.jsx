import { useState } from 'react';
import { guardarFichero, saveEnvioToDB } from '../api';
import ModalConfirmacion from './ModalConfirmacion';

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
          <button className="btn btn-ghost btn-sm" onClick={handleLimpiar}>🗑️ Limpiar formulario</button>
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
            className="btn btn-success ws-btn"
            onClick={handleGuardarDBClick}
            disabled={loadingDB}
          >
            {loadingDB ? <><div className="spinner" /> Guardando en BD…</> : '🗄️ Guardar en Base de Datos'}
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
