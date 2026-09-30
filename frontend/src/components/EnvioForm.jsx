import { useState, useEffect } from 'react';

const CAMPOS = [
  { key: 'numeroCliente',        label: 'Nº Cliente',            type: 'text',   placeholder: 'CLI-001' },
  { key: 'numeroSeguimiento',    label: 'Nº Seguimiento',        type: 'text',   placeholder: 'SEG-2024-0001' },
  { key: 'destino',              label: 'Destino',               type: 'text',   placeholder: 'Madrid, España', full: true },
  { key: 'peso',                 label: 'Peso (kg)',             type: 'number', placeholder: '2.5' },
  { key: 'fechaEnvio',           label: 'Fecha de Envío',        type: 'date',   placeholder: '' },
  { key: 'fechaEstimadaEntrega', label: 'Fecha Est. Entrega',    type: 'date',   placeholder: '' },
];

const EMPTY = {
  numeroCliente: '', numeroSeguimiento: '', destino: '',
  peso: '', fechaEnvio: '', fechaEstimadaEntrega: '',
};

export default function EnvioForm({ envioActivo, onChange, onClear }) {
  const [form, setForm] = useState(EMPTY);

  // Cuando llega un envío desde un fichero abierto, rellenar el form
  useEffect(() => {
    if (envioActivo) {
      setForm({
        numeroCliente:        envioActivo.numeroCliente        || '',
        numeroSeguimiento:    envioActivo.numeroSeguimiento    || '',
        destino:              envioActivo.destino              || '',
        peso:                 envioActivo.peso                 || '',
        fechaEnvio:           envioActivo.fechaEnvio           || '',
        fechaEstimadaEntrega: envioActivo.fechaEstimadaEntrega || '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [envioActivo]);

  const handleChange = (key, value) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange(updated);
  };

  const handleClear = () => {
    setForm(EMPTY);
    onClear();
  };

  return (
    <div className="card">
      <div className="card-title">
        <div className="icon">📦</div>
        Datos del Envío
      </div>

      <div className="form-grid">
        {CAMPOS.map(({ key, label, type, placeholder, full }) => (
          <div key={key} className={`form-group${full ? ' full-width' : ''}`}>
            <label htmlFor={`input-${key}`}>{label}</label>
            <input
              id={`input-${key}`}
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

      <div className="divider" />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          id="btn-limpiar"
          className="btn btn-ghost"
          onClick={handleClear}
        >
          🗑️ Limpiar
        </button>
      </div>
    </div>
  );
}
