import { useState, useEffect } from 'react';
import { deleteEnvio } from '../api';
import ModalVisorWeb from './ModalVisorWeb';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function HistorialTable({ envios, onRefresh, onToast }) {
  const [envioVisor, setEnvioVisor] = useState(null);
  const [localEnvios, setLocalEnvios] = useState(envios);
  const [mostrarTabla, setMostrarTabla] = useState(true);

  // ─── Tour Guiado con Driver.js ─────────────────────────────
  const handleIniciarGuia = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      nextBtnText: 'Siguiente ➔',
      prevBtnText: '⬅️ Anterior',
      doneBtnText: '✅ Entendido',
      steps: [
        {
          element: '.historial-section',
          popover: {
            title: '1. Módulo de Persistencia BD / ORM',
            description: 'Bloque de historial de envíos. Pospuesto formalmente a las unidades didácticas de Bases de Datos y ORM (UT03/UT04).',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#btn-toggle-tabla',
          popover: {
            title: '2. Desplegar / Ocultar Registros',
            description: 'Permite replegar o mostrar la tabla con los envíos almacenados en la BD H2.',
            side: 'top',
            align: 'end'
          }
        },
        {
          element: '#btn-refresh',
          popover: {
            title: '3. Actualizar Datos de BD',
            description: 'Sincroniza y vuelve a consultar la tabla de envíos desde la API REST.',
            side: 'top',
            align: 'end'
          }
        }
      ]
    });

    driverObj.drive();
  };

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
        {/* Banner de Estado "Pendiente por desarrollar" */}
        <div style={{
          backgroundColor: 'rgba(234, 179, 8, 0.12)',
          border: '1px solid rgba(234, 179, 8, 0.4)',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>🚧</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <strong style={{ color: '#eab308', fontSize: '1.05rem' }}>
                Módulo de Historial y Base de Datos (ORM) — Pendiente por Desarrollar
              </strong>
              <span style={{
                backgroundColor: 'rgba(234, 179, 8, 0.25)',
                color: '#fef08a',
                padding: '0.15rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Asignado a Unidades Futuras (UT03 / UT04 - BD y ORM)
              </span>
            </div>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Este bloque se pospone para cuando abordemos la unidad de Bases de Datos y ORM (Hibernate / JPA).
              El cumplimiento de este proyecto <strong>UT02</strong> se limita al 100% en la gestión y conversión de <strong>Ficheros (.dat, .xml, .csv, .json)</strong>.
              El código y las funciones siguen totalmente operativas a modo de demostración previa.
            </p>
          </div>
        </div>

        <div className="card-title">
          <div className="icon">🗄️</div>
          Historial y Registro en Base de Datos
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {localEnvios.length} registro{localEnvios.length !== 1 ? 's' : ''}
          </span>
          <button
            id="btn-b4-guia"
            className="btn btn-cyan btn-sm"
            onClick={handleIniciarGuia}
            title="Iniciar tour guiado paso a paso para el Bloque 4"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          >
            💡 Guía de uso
          </button>
          <button
            id="btn-toggle-tabla"
            className="btn btn-ghost"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
            onClick={() => setMostrarTabla(prev => !prev)}
          >
            {mostrarTabla ? '🙈 Ocultar tabla' : '👁️ Mostrar tabla'}
          </button>
          <button
            id="btn-refresh"
            className="btn btn-ghost"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
            onClick={onRefresh}
          >
            🔄 Actualizar
          </button>
        </div>

        {mostrarTabla && (
          localEnvios.length === 0 ? (
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
          )
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


