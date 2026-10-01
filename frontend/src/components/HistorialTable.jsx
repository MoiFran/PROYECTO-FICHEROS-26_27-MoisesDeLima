import { useState, useEffect } from 'react';
import { deleteEnvio } from '../api';
import ModalVisorWeb from './ModalVisorWeb';

export default function HistorialTable({ envios, onRefresh, onToast }) {
  const [envioVisor, setEnvioVisor] = useState(null);
  const [localEnvios, setLocalEnvios] = useState(envios);

  // Sincronizamos envios cuando cambie la prop
  useEffect(() => {
    setLocalEnvios(envios);
  }, [envios]);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();

    // 1. Actualización Optimista Instantánea (0ms de latencia)
    setLocalEnvios(prev => prev.filter(item => item.id !== id));
    onToast(`🗑️ Eliminando envío #${id} de la BD…`, 'info');

    // 2. Operación de eliminación asíncrona en segundo plano
    try {
      await deleteEnvio(id);
      onToast(`✅ Envío #${id} eliminado con éxito`, 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      // Revertimos en caso de error
      setLocalEnvios(envios);
      onToast(`❌ No se pudo eliminar el envío #${id}: ${err.message}`, 'error');
    }
  };

  const handleVerVisor = (envio, e) => {
    if (e) e.stopPropagation();
    setEnvioVisor(envio);
  };

  return (
    <>
      <div className="card historial-section">
        <div className="card-title">
          <div className="icon">🗄️</div>
          Historial y Registro en Base de Datos
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {localEnvios.length} registro{localEnvios.length !== 1 ? 's' : ''}
          </span>
          <button
            id="btn-refresh"
            className="btn btn-ghost"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
            onClick={onRefresh}
          >
            🔄 Actualizar
          </button>
        </div>

        {localEnvios.length === 0 ? (
          <div className="table-empty">
            No hay envíos guardados en la base de datos todavía.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nº Cliente</th>
                  <th>Nº Seguimiento</th>
                  <th>Destino</th>
                  <th>Peso (kg)</th>
                  <th>F. Envío</th>
                  <th>F. Entrega</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {localEnvios.map(e => (
                  <tr
                    key={e.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleVerVisor(e)}
                    title="Haz clic para inspeccionar en el Visor Web"
                  >
                    <td className="td-id">#{e.id}</td>
                    <td>{e.numeroCliente}</td>
                    <td>{e.numeroSeguimiento}</td>
                    <td>{e.destino}</td>
                    <td>{e.peso} kg</td>
                    <td>{e.fechaEnvio || '—'}</td>
                    <td>{e.fechaEstimadaEntrega || '—'}</td>
                    <td className="td-action" onClick={evt => evt.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          id={`btn-ver-${e.id}`}
                          className="btn btn-cyan"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          onClick={(evt) => handleVerVisor(e, evt)}
                          title="Abrir en Visor Web"
                        >
                          👁️ Ver en Visor
                        </button>
                        <button
                          id={`btn-delete-${e.id}`}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          onClick={(evt) => handleDelete(e.id, evt)}
                          title="Eliminar de la BD"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Ventana del Visor Web para el registro seleccionado */}
      {envioVisor && (
        <ModalVisorWeb
          nombreFichero={`envio_db_#${envioVisor.id}`}
          formatoInicial="json"
          rawContentInicial={null}
          envioDatos={envioVisor}
          onCerrar={() => setEnvioVisor(null)}
          onToast={onToast}
        />
      )}
    </>
  );
}

