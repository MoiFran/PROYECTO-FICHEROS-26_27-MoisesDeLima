import { useState } from 'react';
import { deleteEnvio } from '../api';
import ModalVisorWeb from './ModalVisorWeb';

export default function HistorialTable({ envios, onRefresh, onToast }) {
  const [envioVisor, setEnvioVisor] = useState(null);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm(`¿Eliminar el envío con ID #${id} de la Base de Datos?`)) return;
    try {
      await deleteEnvio(id);
      onToast(`🗑️ Envío #${id} eliminado de la BD`, 'info');
      onRefresh();
    } catch {
      onToast('❌ Error al eliminar el envío', 'error');
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
            {envios.length} registro{envios.length !== 1 ? 's' : ''}
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

        {envios.length === 0 ? (
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
                {envios.map(e => (
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
