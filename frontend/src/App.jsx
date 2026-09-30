import { useState, useEffect, useCallback } from 'react';
import Workspace from './components/Workspace';
import ConversorFicheros from './components/ConversorFicheros';
import VisorWebFicheros from './components/VisorWebFicheros';
import HistorialTable from './components/HistorialTable';
import { getEnvios } from './api';

export default function App() {
  const [historial, setHistorial] = useState([]);
  const [toasts, setToasts]       = useState([]);

  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  const fetchHistorial = useCallback(async () => {
    try { setHistorial(await getEnvios()); } catch {}
  }, []);

  useEffect(() => { fetchHistorial(); }, [fetchHistorial]);

  return (
    <>
      <div className="app-wrapper">
        <header className="app-header">
          <div className="badge">UT02 · Acceso a Datos</div>
          <h1>Sistema de Gestión y Inspección de Envíos</h1>
          <p>Manejo de Ficheros en Formatos: Binario (.dat) · XML (.xml) · CSV (.csv) · JSON (.json)</p>
        </header>

        {/* Bloque 1: Creación y Persistencia de Envíos */}
        <Workspace onToast={addToast} onGuardadoDB={fetchHistorial} />

        {/* Bloque 2: Conversor Interactivo de Ficheros */}
        <ConversorFicheros onToast={addToast} />

        {/* Bloque 3: Visor Web de Archivos (Web Viewer) */}
        <VisorWebFicheros onToast={addToast} />

        {/* Bloque 4: Historial y Persistencia en Base de Datos */}
        <HistorialTable envios={historial} onRefresh={fetchHistorial} onToast={addToast} />
      </div>

      {/* Notificaciones flotantes (Toasts) */}
      <div className="toast-container">
        {toasts.map(({ id, msg, type }) => (
          <div key={id} className={`toast ${type}`}><span>{msg}</span></div>
        ))}
      </div>
    </>
  );
}
