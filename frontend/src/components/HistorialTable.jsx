import { deleteEnvio } from '../api';

export default function HistorialTable({ envios, onRefresh, onToast }) {
  const handleDelete = async (id) => {
    if (!confirm(`¿Eliminar el envío con ID ${id}?`)) return;
    try {
      await deleteEnvio(id);
      onToast(`🗑️ Envío #${id} eliminado`, 'info');
      onRefresh();
    } catch {
      onToast('❌ Error al eliminar el envío', 'error');
    }
  };

  return (
    <div className="card historial-section">
      <div className="card-title">
        <div className="icon">🗄️</div>
        Historial de Envíos (Base de Datos)
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {envios.map(e => (
                <tr key={e.id}>
                  <td className="td-id">#{e.id}</td>
                  <td>{e.numeroCliente}</td>
                  <td>{e.numeroSeguimiento}</td>
                  <td>{e.destino}</td>
                  <td>{e.peso}</td>
                  <td>{e.fechaEnvio}</td>
                  <td>{e.fechaEstimadaEntrega}</td>
                  <td className="td-action">
                    <button
                      id={`btn-delete-${e.id}`}
                      className="btn btn-danger"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => handleDelete(e.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
