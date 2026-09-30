import { useState } from 'react';

const FORMATOS = [
  { key: 'json', label: 'JSON',    ext: '.json', icon: '🔧', color: '#a78bfa', lang: 'json' },
  { key: 'xml',  label: 'XML',     ext: '.xml',  icon: '📄', color: '#34d399', lang: 'xml' },
  { key: 'csv',  label: 'CSV',     ext: '.csv',  icon: '📊', color: '#60a5fa', lang: 'csv' },
  { key: 'dat',  label: 'Binario', ext: '.dat',  icon: '📦', color: '#f59e0b', lang: 'binary' },
];

const EXPLICACIONES = {
  json: 'JSON (JavaScript Object Notation) representa los datos como pares clave: valor estructurados en un objeto. Es ligero, legible por humanos y estándar en APIs Web.',
  xml:  'XML (eXtensible Markup Language) utiliza etiquetas de apertura y cierre (<tag>...</tag>) organizadas jerárquicamente. Es muy utilizado en integración de sistemas enterprise.',
  csv:  'CSV (Comma-Separated Values) representa los registros en filas tabulares separadas por comas. Es el estándar para análisis de datos y hojas de cálculo (Excel).',
  dat:  'Binario (.DAT) almacena los datos directamente en bytes según la especificación de Java DataOutputStream (writeUTF, writeDouble). Es ultracompacto pero requiere un programa específico para interpretarlo.',
};

export default function ModalVisorWeb({
  nombreFichero,
  formatoInicial,
  rawContentInicial,
  envioDatos,
  onCerrar,
  onToast,
}) {
  const [formatoActivo, setFormatoActivo] = useState(formatoInicial || 'json');
  const [copiado, setCopiado]             = useState(false);

  // Genera el código representado para cada formato
  const getContenidoFormato = (fmtKey) => {
    if (fmtKey === formatoInicial && rawContentInicial) {
      return rawContentInicial;
    }
    if (!envioDatos) return 'Sin datos para mostrar';

    switch (fmtKey) {
      case 'json':
        return JSON.stringify({
          numeroCliente: envioDatos.numeroCliente || '',
          numeroSeguimiento: envioDatos.numeroSeguimiento || '',
          destino: envioDatos.destino || '',
          peso: Number(envioDatos.peso) || 0.0,
          fechaEnvio: envioDatos.fechaEnvio || '',
          fechaEstimadaEntrega: envioDatos.fechaEstimadaEntrega || '',
        }, null, 2);

      case 'xml':
        return `<?xml version="1.0" encoding="UTF-8"?>
<envio>
  <numeroCliente>${envioDatos.numeroCliente || ''}</numeroCliente>
  <numeroSeguimiento>${envioDatos.numeroSeguimiento || ''}</numeroSeguimiento>
  <destino>${envioDatos.destino || ''}</destino>
  <peso>${envioDatos.peso || 0}</peso>
  <fechaEnvio>${envioDatos.fechaEnvio || ''}</fechaEnvio>
  <fechaEstimadaEntrega>${envioDatos.fechaEstimadaEntrega || ''}</fechaEstimadaEntrega>
</envio>`;

      case 'csv':
        return `numeroCliente,numeroSeguimiento,destino,peso,fechaEnvio,fechaEstimadaEntrega
${envioDatos.numeroCliente || ''},${envioDatos.numeroSeguimiento || ''},"${envioDatos.destino || ''}",${envioDatos.peso || 0},${envioDatos.fechaEnvio || ''},${envioDatos.fechaEstimadaEntrega || ''}`;

      case 'dat':
        return generarHexDumpSimulado(envioDatos);

      default:
        return '';
    }
  };

  const contenido = getContenidoFormato(formatoActivo);
  const lineas = contenido.split('\n');
  const fmtActual = FORMATOS.find(f => f.key === formatoActivo) || FORMATOS[0];

  const handleCopiar = () => {
    navigator.clipboard.writeText(contenido);
    setCopiado(true);
    if (onToast) onToast('📋 Contenido copiado al portapapeles', 'info');
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box modal-visor-box" onClick={e => e.stopPropagation()}>
        {/* Cabecera de la ventana Visor Web */}
        <div className="visor-header">
          <div className="visor-title-group">
            <span className="visor-icon">👁️</span>
            <div>
              <h2 className="visor-title">Visor Web de Ficheros</h2>
              <span className="visor-filename">
                📄 {nombreFichero || 'fichero_inspeccionado'}
              </span>
            </div>
          </div>

          <div className="visor-header-actions">
            <button className="btn btn-ghost btn-sm" onClick={handleCopiar}>
              {copiado ? '✅ ¡Copiado!' : '📋 Copiar contenido'}
            </button>
            <button className="btn btn-ghost btn-sm visor-close-btn" onClick={onCerrar}>
              ✕ Cerrar
            </button>
          </div>
        </div>

        {/* Pestañas de cambio de formato dinámico */}
        <div className="visor-tabs-bar">
          <span className="visor-tabs-label">Vista de formato:</span>
          <div className="visor-tabs">
            {FORMATOS.map(({ key, label, icon, color }) => {
              const esOriginal = key === formatoInicial;
              const esActivo   = key === formatoActivo;
              return (
                <button
                  key={key}
                  className={`visor-tab-btn${esActivo ? ' active' : ''}`}
                  style={esActivo ? { borderColor: color, color: color, background: `${color}15` } : {}}
                  onClick={() => setFormatoActivo(key)}
                >
                  <span>{icon} {label}</span>
                  {esOriginal && <span className="tab-original-badge">Original</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Banner Explicativo Pedagógico */}
        <div className="visor-explanation" style={{ borderColor: `${fmtActual.color}40`, background: `${fmtActual.color}08` }}>
          <span className="exp-icon">💡</span>
          <p>{EXPLICACIONES[formatoActivo]}</p>
        </div>

        {/* Ventana de Código IDE con números de línea */}
        <div className="visor-code-container">
          <div className="visor-code-bar">
            <span className="code-bar-dot red" />
            <span className="code-bar-dot yellow" />
            <span className="code-bar-dot green" />
            <span className="code-bar-title">{nombreFichero ? `${nombreFichero}.${fmtActual.ext.replace('.','')}` : `archivo.${fmtActual.key}`} — {fmtActual.label}</span>
            <span className="code-bar-lines">{lineas.length} líneas</span>
          </div>

          <div className="visor-code-body">
            <div className="code-line-numbers">
              {lineas.map((_, idx) => (
                <span key={idx}>{idx + 1}</span>
              ))}
            </div>
            <pre className="code-content">
              <code>{contenido}</code>
            </pre>
          </div>
        </div>

        {/* Pie de la ventana */}
        <div className="visor-footer">
          <span className="visor-footer-hint">
            🔍 Puedes alternar entre las pestañas superiores para ver exactamente cómo se estructuran los mismos datos en los 4 formatos.
          </span>
          <button className="btn btn-primary btn-sm" onClick={onCerrar}>
            Entendido, cerrar visor
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Generador de Hex Dump Simulado para Binario (.DAT) ────────
function generarHexDumpSimulado(envio) {
  const encodeUTF = (str) => {
    const bytes = [];
    const utf8 = unescape(encodeURIComponent(str || ''));
    bytes.push((utf8.length >> 8) & 0xFF, utf8.length & 0xFF); // length (2 bytes)
    for (let i = 0; i < utf8.length; i++) {
      bytes.push(utf8.charCodeAt(i));
    }
    return bytes;
  };

  const encodeDouble = (num) => {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setFloat64(0, Number(num) || 0.0, false); // Big endian
    return Array.from(new Uint8Array(buffer));
  };

  const allBytes = [
    ...encodeUTF(envio.numeroCliente),
    ...encodeUTF(envio.numeroSeguimiento),
    ...encodeUTF(envio.destino),
    ...encodeDouble(envio.peso),
    ...encodeUTF(envio.fechaEnvio),
    ...encodeUTF(envio.fechaEstimadaEntrega),
  ];

  let output = 'OFFSET     00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F   ASCII REPRESENTATION\n';
  output += '--------------------------------------------------------------------------------\n';

  for (let offset = 0; offset < allBytes.length; offset += 16) {
    const chunk = allBytes.slice(offset, offset + 16);
    const hexOffset = offset.toString(16).padStart(8, '0').toUpperCase();

    let hexPart1 = '';
    let hexPart2 = '';
    let asciiPart = '';

    for (let i = 0; i < 16; i++) {
      if (i < chunk.length) {
        const b = chunk[i];
        const hexStr = b.toString(16).padStart(2, '0').toUpperCase();
        if (i < 8) hexPart1 += hexStr + ' ';
        else hexPart2 += hexStr + ' ';

        // ASCII printable check
        asciiPart += (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.';
      } else {
        if (i < 8) hexPart1 += '   ';
        else hexPart2 += '   ';
      }
    }

    output += `${hexOffset}   ${hexPart1} ${hexPart2}  |${asciiPart}|\n`;
  }

  output += '--------------------------------------------------------------------------------\n';
  output += `TOTAL: ${allBytes.length} bytes escritas mediante DataOutputStream en formato Java Binario (.dat)`;

  return output;
}
