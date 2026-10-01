import { useState, useEffect, useCallback } from 'react';
import Workspace from './components/Workspace';
import ConversorFicheros from './components/ConversorFicheros';
import VisorWebFicheros from './components/VisorWebFicheros';
import HistorialTable from './components/HistorialTable';
import PresentacionPage from './components/PresentacionPage';
import { getEnvios } from './api';

export default function App() {
  const [vista, setVista]         = useState('app'); // 'app' | 'presentacion'
  const [historial, setHistorial] = useState([]);
  const [toasts, setToasts]       = useState([]);

  // Estado del Tema (Modo Claro vs Modo Oscuro)
  const [theme, setTheme]         = useState(() => localStorage.getItem('app-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  const fetchHistorial = useCallback(async () => {
    try { setHistorial(await getEnvios()); } catch {}
  }, []);

  useEffect(() => { fetchHistorial(); }, [fetchHistorial]);

  // Componente del Botón Flotante para cambiar de tema
  const renderThemeToggle = () => (
    <button
      id="btn-toggle-theme"
      className="btn-theme-toggle"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
    >
      <span>{theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}</span>
    </button>
  );

  // Si estamos en la ruta de presentación
  if (vista === 'presentacion') {
    return (
      <>
        {renderThemeToggle()}
        <PresentacionPage onVolver={() => setVista('app')} />
      </>
    );
  }

  return (
    <>
      {/* Botón flotante superior izquierdo para ir a la Ruta de Presentación */}
      <button
        id="btn-floating-presentacion"
        className="btn-floating-pres"
        onClick={() => setVista('presentacion')}
        title="Ir a la ruta de presentación del proyecto por cubos"
      >
        <span className="pres-btn-icon">🎓</span>
        <span className="pres-btn-text">Acceso a la Presentación</span>
      </button>

      {/* Botón flotante superior derecho para alternar Modo Claro / Modo Oscuro */}
      {renderThemeToggle()}

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



