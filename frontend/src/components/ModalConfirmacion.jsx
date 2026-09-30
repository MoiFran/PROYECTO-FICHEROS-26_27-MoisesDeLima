import { useState } from 'react';

const FORMATOS = [
  { key: 'dat',  label: 'Binario', ext: '.dat',  color: '#f59e0b', icon: '📦' },
  { key: 'xml',  label: 'XML',     ext: '.xml',  color: '#34d399', icon: '📄' },
  { key: 'csv',  label: 'CSV',     ext: '.csv',  color: '#60a5fa', icon: '📊' },
  { key: 'json', label: 'JSON',    ext: '.json', color: '#a78bfa', icon: '🔧' },
];

export default function ModalConfirmacion({ formato, nombreFichero, onConfirmar, onCancelar }) {
  const fmt = FORMATOS.find(f => f.key === formato) || FORMATOS[1];
  const filename = nombreFichero + fmt.ext;

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        {/* Icono animado */}
        <div className="modal-icon" style={{ background: `${fmt.color}20`, borderColor: `${fmt.color}40` }}>
          <span style={{ fontSize: '2.2rem' }}>{fmt.icon}</span>
        </div>

        {/* Título */}
        <h2 className="modal-title">Confirmar descarga</h2>

        {/* Descripción */}
        <p className="modal-desc">
          El archivo{' '}
          <span className="modal-filename">"{filename}"</span>{' '}
          está en formato{' '}
          <span className="modal-badge" style={{ background: `${fmt.color}20`, color: fmt.color, borderColor: `${fmt.color}40` }}>
            {fmt.icon} {fmt.label}
          </span>{' '}
          y se descargará directamente en tu ordenador.
        </p>

        {/* Info adicional */}
        <div className="modal-info">
          <span className="modal-info-icon">💡</span>
          <span>Podrás abrirlo más tarde para cargar los datos o guardarlo en otro formato.</span>
        </div>

        {/* Botones */}
        <div className="modal-actions">
          <button
            id="btn-modal-cancelar"
            className="btn btn-ghost"
            onClick={onCancelar}
          >
            ✕ Cancelar
          </button>
          <button
            id="btn-modal-confirmar"
            className="btn btn-primary"
            onClick={onConfirmar}
          >
            ⬇️ Sí, descargar
          </button>
        </div>
      </div>
    </div>
  );
}
