import { useState } from 'react';
import { guardarFichero } from '../api';
import ModalConfirmacion from './ModalConfirmacion';

const FORMATOS = [
  { key: 'dat',  label: 'Binario', ext: '.dat',  icon: '📦' },
  { key: 'xml',  label: 'XML',     ext: '.xml',  icon: '📄' },
  { key: 'csv',  label: 'CSV',     ext: '.csv',  icon: '📊' },
  { key: 'json', label: 'JSON',    ext: '.json', icon: '🔧' },
];

export default function GuardarFichero({ envio, onToast }) {
  const [formato, setFormato]           = useState('json');
  const [nombreFichero, setNombre]      = useState('envio');
  const [showModal, setShowModal]       = useState(false);
  const [loading, setLoading]           = useState(false);

  const extActual = FORMATOS.find(f => f.key === formato)?.ext || '';

  // Clic en Guardar → abrir popup
  const handleGuardarClick = () => {
    if (!envio || !envio.numeroCliente) {
      onToast('⚠️ Rellena los datos del envío primero', 'error');
      return;
    }
    if (!nombreFichero.trim()) {
      onToast('⚠️ Escribe el nombre del fichero', 'error');
      return;
    }
    setShowModal(true);
  };

  // Confirmar en popup → descargar
  const handleConfirmar = async () => {
    setShowModal(false);
    setLoading(true);
    try {
      const filename = await guardarFichero(envio, formato, nombreFichero.trim());
      onToast(`✅ "${filename}" descargado correctamente`, 'success');
    } catch (e) {
      onToast(`❌ Error al guardar: ${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar → cerrar popup, nada cambia
  const handleCancelar = () => setShowModal(false);

  return (
    <>
      <div className="card">
        <div className="card-title">
          <div className="icon">💾</div>
          Guardar fichero
        </div>

        {/* Selector de formato */}
        <p className="section-label">Formato de salida</p>
        <div className="format-selector">
          {FORMATOS.map(({ key, label, icon }) => (
            <button
              key={key}
              id={`formato-${key}`}
              className={`format-btn${formato === key ? ' active' : ''}`}
              onClick={() => setFormato(key)}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Nombre del fichero */}
        <p className="section-label">Nombre del fichero</p>
        <div className="filename-wrapper">
          <input
            id="input-nombre-fichero"
            type="text"
            value={nombreFichero}
            placeholder="nombre_fichero"
            onChange={e => setNombre(e.target.value)}
          />
          <span className="filename-ext">{extActual}</span>
        </div>

        {/* Botón guardar */}
        <button
          id="btn-guardar-fichero"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          onClick={handleGuardarClick}
          disabled={loading}
        >
          {loading
            ? <><div className="spinner" /> Descargando…</>
            : '💾 Guardar fichero'}
        </button>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <ModalConfirmacion
          formato={formato}
          nombreFichero={nombreFichero.trim()}
          onConfirmar={handleConfirmar}
          onCancelar={handleCancelar}
        />
      )}
    </>
  );
}
