import { useState, useRef } from 'react';
import { guardarFichero, abrirFichero, saveEnvioToDB } from '../api';

const FORMATOS = [
  { key: 'dat',  label: '📦 Binario', ext: '.dat' },
  { key: 'xml',  label: '📄 XML',     ext: '.xml' },
  { key: 'csv',  label: '📊 CSV',     ext: '.csv' },
  { key: 'json', label: '🔧 JSON',    ext: '.json' },
];

export default function FileControls({ envio, onEnvioAbierto, onGuardadoDB, onToast }) {
  const [formato, setFormato] = useState('json');
  const [nombreFichero, setNombreFichero] = useState('envio');
  const [loadingGuardar, setLoadingGuardar]   = useState(false);
  const [loadingAbrir, setLoadingAbrir]       = useState(false);
  const [loadingDB, setLoadingDB]             = useState(false);
  const fileRef = useRef(null);

  const extActual = FORMATOS.find(f => f.key === formato)?.ext || '';

  // ─── Guardar fichero ──────────────────────────────────────────
  const handleGuardar = async () => {
    if (!envio || !envio.numeroCliente) {
      onToast('⚠️ Rellena los datos del envío primero', 'error');
      return;
    }
    if (!nombreFichero.trim()) {
      onToast('⚠️ Escribe el nombre del fichero', 'error');
      return;
    }
    setLoadingGuardar(true);
    try {
      const filename = await guardarFichero(envio, formato, nombreFichero.trim());
      onToast(`✅ Fichero "${filename}" descargado correctamente`, 'success');
    } catch (e) {
      onToast(`❌ Error al guardar: ${e.message}`, 'error');
    } finally {
      setLoadingGuardar(false);
    }
  };

  // ─── Abrir fichero ────────────────────────────────────────────
  const handleAbrirClick = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingAbrir(true);
    try {
      const envioLeido = await abrirFichero(file);
      onEnvioAbierto(envioLeido);
      onToast(`✅ Fichero "${file.name}" cargado correctamente`, 'success');
    } catch (err) {
      onToast(`❌ Error al abrir: ${err.message}`, 'error');
    } finally {
      setLoadingAbrir(false);
      e.target.value = '';
    }
  };

  // ─── Guardar en DB ────────────────────────────────────────────
  const handleGuardarDB = async () => {
    if (!envio || !envio.numeroCliente) {
      onToast('⚠️ Rellena los datos del envío primero', 'error');
      return;
    }
    setLoadingDB(true);
    try {
      const saved = await saveEnvioToDB(envio);
      onGuardadoDB(saved);
      onToast(`✅ Envío guardado en base de datos (ID: ${saved.id})`, 'success');
    } catch (e) {
      onToast(`❌ Error al guardar en DB: ${e.message}`, 'error');
    } finally {
      setLoadingDB(false);
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <div className="icon">💾</div>
        Control de Ficheros
      </div>

      {/* Selector de formato */}
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Formato
      </p>
      <div className="format-selector">
        {FORMATOS.map(({ key, label }) => (
          <button
            key={key}
            id={`formato-${key}`}
            className={`format-btn${formato === key ? ' active' : ''}`}
            onClick={() => setFormato(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Nombre del fichero */}
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Nombre del fichero (sin extensión)
      </p>
      <div className="filename-wrapper">
        <input
          id="input-nombre-fichero"
          type="text"
          value={nombreFichero}
          placeholder="nombre_fichero"
          onChange={e => setNombreFichero(e.target.value)}
        />
        <span className="filename-ext">{extActual}</span>
      </div>

      <div className="divider" />

      {/* Botones de acción */}
      <div className="action-row">
        <button
          id="btn-guardar-fichero"
          className="btn btn-primary"
          onClick={handleGuardar}
          disabled={loadingGuardar}
        >
          {loadingGuardar ? <><div className="spinner" /> Guardando…</> : '💾 Guardar fichero'}
        </button>

        <button
          id="btn-abrir-fichero"
          className="btn btn-cyan"
          onClick={handleAbrirClick}
          disabled={loadingAbrir}
        >
          {loadingAbrir ? <><div className="spinner" /> Abriendo…</> : '📂 Abrir fichero'}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".dat,.xml,.csv,.json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      <div className="divider" />

      <button
        id="btn-guardar-db"
        className="btn btn-success"
        style={{ width: '100%' }}
        onClick={handleGuardarDB}
        disabled={loadingDB}
      >
        {loadingDB ? <><div className="spinner" /> Guardando en DB…</> : '🗄️ Guardar en base de datos'}
      </button>
    </div>
  );
}
