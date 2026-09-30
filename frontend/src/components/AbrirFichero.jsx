import { useState, useRef } from 'react';
import { abrirFichero } from '../api';

const EXTENSIONES = ['.dat', '.xml', '.csv', '.json'];

export default function AbrirFichero({ onEnvioAbierto, onToast }) {
  const [loading, setLoading]   = useState(false);
  const [dragging, setDragging] = useState(false);
  const [lastFile, setLastFile] = useState(null);
  const fileRef = useRef(null);

  const procesarFichero = async (file) => {
    if (!file) return;
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!EXTENSIONES.includes(ext)) {
      onToast('⚠️ Formato no admitido. Usa .dat, .xml, .csv o .json', 'error');
      return;
    }
    setLoading(true);
    try {
      const envio = await abrirFichero(file);
      setLastFile(file.name);
      onEnvioAbierto(envio);
      onToast(`✅ "${file.name}" cargado correctamente`, 'success');
    } catch (err) {
      onToast(`❌ Error al abrir: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    procesarFichero(e.target.files?.[0]);
    e.target.value = '';
  };

  // Drag & Drop
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    procesarFichero(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="card">
      <div className="card-title">
        <div className="icon">📂</div>
        Abrir fichero
      </div>

      {/* Zona de drop */}
      <div
        className={`drop-zone${dragging ? ' dragging' : ''}${lastFile ? ' loaded' : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {loading ? (
          <>
            <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
            <span className="drop-text">Leyendo fichero…</span>
          </>
        ) : lastFile ? (
          <>
            <span style={{ fontSize: '2rem' }}>✅</span>
            <span className="drop-text">
              <strong>{lastFile}</strong> cargado
            </span>
            <span className="drop-hint">Haz clic o arrastra otro fichero para reemplazar</span>
          </>
        ) : (
          <>
            <span className="drop-icon">📁</span>
            <span className="drop-text">Haz clic o arrastra un fichero aquí</span>
            <span className="drop-hint">Formatos admitidos: .dat · .xml · .csv · .json</span>
          </>
        )}
      </div>

      <input
        ref={fileRef}
        id="input-abrir-fichero"
        type="file"
        accept=".dat,.xml,.csv,.json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <button
        id="btn-abrir-fichero"
        className="btn btn-cyan"
        style={{ width: '100%', marginTop: '1rem' }}
        onClick={() => fileRef.current?.click()}
        disabled={loading}
      >
        {loading ? <><div className="spinner" /> Cargando…</> : '📂 Seleccionar fichero'}
      </button>
    </div>
  );
}
