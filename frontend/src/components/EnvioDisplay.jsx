export default function EnvioDisplay({ envio }) {
  if (!envio) {
    return (
      <div className="card" style={{ height: '100%' }}>
        <div className="card-title">
          <div className="icon">👁️</div>
          Vista Previa
          <span className="status-badge empty" style={{ marginLeft: 'auto' }}>
            ● Sin datos
          </span>
        </div>
        <div className="envio-empty">
          <span className="empty-icon">📂</span>
          <span>Rellena el formulario o abre un fichero para ver los datos aquí</span>
        </div>
      </div>
    );
  }

  const campos = [
    { label: 'ID en Base de Datos', value: envio.id ?? '—', highlight: true },
    { label: 'Nº Cliente',          value: envio.numeroCliente },
    { label: 'Nº Seguimiento',      value: envio.numeroSeguimiento },
    { label: 'Destino',             value: envio.destino },
    { label: 'Peso',                value: `${envio.peso} kg` },
    { label: 'Fecha de Envío',      value: envio.fechaEnvio },
    { label: 'Entrega Estimada',    value: envio.fechaEstimadaEntrega },
  ];

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-title">
        <div className="icon">👁️</div>
        Vista Previa
        <span className="status-badge loaded" style={{ marginLeft: 'auto' }}>
          ● Datos cargados
        </span>
      </div>
      <div className="envio-display">
        {campos.map(({ label, value, highlight }) => (
          <div key={label} className="envio-field">
            <span className="field-label">{label}</span>
            <span className={`field-value${highlight ? ' highlight' : ''}`}>
              {value || '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
