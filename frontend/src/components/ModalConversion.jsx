const FORMATOS = [
  { key: 'dat',  label: 'Binario', ext: '.dat',  color: '#f59e0b', icon: '📦' },
  { key: 'xml',  label: 'XML',     ext: '.xml',  color: '#34d399', icon: '📄' },
  { key: 'csv',  label: 'CSV',     ext: '.csv',  color: '#60a5fa', icon: '📊' },
  { key: 'json', label: 'JSON',    ext: '.json', color: '#a78bfa', icon: '🔧' },
];

export default function ModalConversion({
  ficheroOrigenNombre,
  formatoOrigenKey,
  nombreDestino,
  formatoDestinoKey,
  onConfirmar,
  onCancelar,
}) {
  const fmtOrigen  = FORMATOS.find(f => f.key === formatoOrigenKey)  || FORMATOS[2];
  const fmtDestino = FORMATOS.find(f => f.key === formatoDestinoKey) || FORMATOS[1];
  const filenameSalida = nombreDestino + fmtDestino.ext;

  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-box modal-box--wide" onClick={e => e.stopPropagation()}>
        {/* Icono de conversión */}
        <div className="modal-icon" style={{ background: `${fmtDestino.color}20`, borderColor: `${fmtDestino.color}50` }}>
          <span style={{ fontSize: '2.2rem' }}>🔄</span>
        </div>

        {/* Título */}
        <h2 className="modal-title">Confirmar Conversión de Formato</h2>

        {/* Flujo de conversión visual */}
        <div className="conversion-flow-preview">
          <div className="conversion-node" style={{ borderColor: `${fmtOrigen.color}40`, background: `${fmtOrigen.color}10` }}>
            <span className="node-icon">{fmtOrigen.icon}</span>
            <span className="node-filename">{ficheroOrigenNombre}</span>
            <span className="node-badge" style={{ color: fmtOrigen.color, background: `${fmtOrigen.color}20` }}>
              {fmtOrigen.label}
            </span>
          </div>

          <div className="conversion-arrow">➔</div>

          <div className="conversion-node" style={{ borderColor: `${fmtDestino.color}40`, background: `${fmtDestino.color}10` }}>
            <span className="node-icon">{fmtDestino.icon}</span>
            <span className="node-filename">{filenameSalida}</span>
            <span className="node-badge" style={{ color: fmtDestino.color, background: `${fmtDestino.color}20` }}>
              {fmtDestino.label}
            </span>
          </div>
        </div>

        {/* Explicación pedagógica */}
        <div className="modal-info" style={{ marginTop: '0.5rem' }}>
          <span className="modal-info-icon">💡</span>
          <span>
            El sistema extraerá los datos estructurados del archivo <strong>{fmtOrigen.label}</strong> y los transformará al estándar <strong>{fmtDestino.label}</strong>. El nuevo fichero se descargará automáticamente.
          </span>
        </div>

        {/* Acciones */}
        <div className="modal-actions">
          <button
            id="btn-conversion-cancelar"
            className="btn btn-ghost"
            onClick={onCancelar}
          >
            ✕ Cancelar
          </button>
          <button
            id="btn-conversion-confirmar"
            className="btn btn-primary"
            onClick={onConfirmar}
          >
            🔄 Confirmar y Descargar
          </button>
        </div>
      </div>
    </div>
  );
}
