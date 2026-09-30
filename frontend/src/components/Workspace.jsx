import { useState } from 'react';
import { guardarFichero } from '../api';
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

const VACIO = {
  numeroCliente: '', numeroSeguimiento: '', destino: '',
  peso: '', fechaEnvio: '', fechaEstimadaEntrega: '',
};

export default function Workspace({ onToast }) {
  const [form, setForm]           = useState(VACIO);
  const [formato, setFormato]     = useState('json');
  const [nombre, setNombre]       = useState('envio');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(false);

  const ext = FORMATOS.find(f => f.key === formato)?.ext || '';

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const handleLimpiar = () => setForm(VACIO);

  // ─── Abrir Modal de Confirmación ─────────────────────────────
  const handleGuardarClick = () => {
    if (!form.numeroCliente?.trim()) {
      onToast('⚠️ Rellena al menos el Nº de cliente para crear el envío', 'error');
      return;
    }
    if (!nombre.trim()) {
      onToast('⚠️ Escribe el nombre del fichero', 'error');
      return;
    }
    setShowModal(true);
  };

  // ─── Confirmar descarga ──────────────────────────────────────
  const handleConfirmar = async () => {
    setShowModal(false);
    setLoading(true);
    try {
      const filename = await guardarFichero(form, formato, nombre.trim());
      onToast(`✅ "${filename}" descargado correctamente en tu ordenador`, 'success');
    } catch (e) {
      onToast(`❌ Error al guardar: ${e.message}`, 'error');
    } finally {
      setLoading(false);
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
              <h2>Bloque 1 · Creación y Guardado de Envíos</h2>
              <p className="workspace-sub">
                Introduce los datos del envío, elige el formato de salida y descárgalo directamente en tu equipo.
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLimpiar}>🗑️ Limpiar formulario</button>
        </div>

        <div className="workspace-divider" />

        {/* Campos del formulario */}
        <div className="ws-form-grid">
          {CAMPOS.map(({ key, label, type, placeholder, wide }) => (
            <div key={key} className={`ws-field${wide ? ' ws-field--wide' : ''}`}>
              <label htmlFor={`ws-${key}`}>{label}</label>
              <input
                id={`ws-${key}`}
                type={type}
                placeholder={placeholder}
                value={form[key]}
                min={type === 'number' ? 0 : undefined}
                step={type === 'number' ? 0.01 : undefined}
                onChange={e => handleChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="workspace-divider" />

        {/* Controles: Formato + Nombre */}
        <div className="ws-controls">
          {/* Formato */}
          <div className="ws-control-group">
            <span className="ws-control-label">Formato de salida</span>
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

        {/* Botón de acción */}
        <div className="ws-actions">
          <button
            id="btn-b1-guardar"
            className="btn btn-primary ws-btn"
            onClick={handleGuardarClick}
            disabled={loading}
          >
            {loading ? <><div className="spinner" /> Guardando y descargando…</> : '💾 Guardar fichero'}
          </button>
        </div>
      </div>

      {/* Pop-up modal de confirmación */}
      {showModal && (
        <ModalConfirmacion
          formato={formato}
          nombreFichero={nombre.trim()}
          onConfirmar={handleConfirmar}
          onCancelar={() => setShowModal(false)}
        />
      )}
    </>
  );
}
