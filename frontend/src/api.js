const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE)
  ? import.meta.env.VITE_API_BASE
  : 'http://localhost:8080/api';

// ─── Base de Datos Local (Fallback para Vercel / Servidor Apagado) ───
const STORAGE_KEY = 'proyecto_envios_db';

const getLocalDB = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : sampleEnvios;
  } catch {
    return sampleEnvios;
  }
};

const saveLocalDB = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const sampleEnvios = [
  { id: 1, numeroCliente: 'CLI-001', numeroSeguimiento: 'SEG-2024-0001', destino: 'Madrid, España', peso: 2.5, fechaEnvio: '2024-09-30', fechaEstimadaEntrega: '2024-10-05' },
  { id: 2, numeroCliente: 'CLI-002', numeroSeguimiento: 'SEG-2024-0002', destino: 'Barcelona, España', peso: 4.8, fechaEnvio: '2024-10-01', fechaEstimadaEntrega: '2024-10-06' },
];

// ─── Envíos (DB) ──────────────────────────────────────────────

export const getEnvios = async () => {
  try {
    const res = await fetch(`${API_BASE}/envios`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch {}
  return getLocalDB();
};

export const saveEnvioToDB = async (envio) => {
  try {
    const res = await fetch(`${API_BASE}/envios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(envio),
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) return await res.json();
  } catch {}

  // Fallback LocalStorage
  const current = getLocalDB();
  const newEnvio = { ...envio, id: Date.now() };
  const updated = [newEnvio, ...current];
  saveLocalDB(updated);
  return newEnvio;
};

export const deleteEnvio = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/envios/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) return;
  } catch {}

  // Fallback LocalStorage
  const current = getLocalDB();
  const updated = current.filter(item => item.id !== id);
  saveLocalDB(updated);
};

// ─── Ficheros ─────────────────────────────────────────────────

export const guardarFichero = async (envio, formato, nombreFichero) => {
  const extensiones = { dat: '.dat', json: '.json', xml: '.xml', csv: '.csv' };
  const filename = nombreFichero + (extensiones[formato] || '');

  // 1. Intentar Backend Java Spring Boot
  try {
    const res = await fetch(
      `${API_BASE}/files/guardar/${formato}?nombreFichero=${encodeURIComponent(nombreFichero)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envio),
        signal: AbortSignal.timeout(2500),
      }
    );
    if (res.ok) {
      const blob = await res.blob();
      descargarBlob(blob, filename);
      return filename;
    }
  } catch (e) {
    // Si el backend no responde, continuamos con el generador cliente JS
  }

  // 2. Generador Cliente JS (para Vercel o sin Backend)
  const blob = generarBlobCliente(envio, formato);
  descargarBlob(blob, filename);
  return filename;
};

export const abrirFichero = async (file) => {
  // 1. Intentar Backend Java Spring Boot
  try {
    const formData = new FormData();
    formData.append('fichero', file);

    const res = await fetch(`${API_BASE}/files/abrir`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Continuar con parser cliente JS
  }

  // 2. Parser Cliente JS (para Vercel o sin Backend)
  return await parsearFicheroCliente(file);
};

// ─── Helper de Descarga ───────────────────────────────────────
function descargarBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// ─── Generador Cliente JS de Ficheros ─────────────────────────
function generarBlobCliente(envio, formato) {
  switch (formato) {
    case 'json': {
      const jsonStr = JSON.stringify(envio, null, 2);
      return new Blob([jsonStr], { type: 'application/json' });
    }
    case 'xml': {
      const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<envio>
  <numeroCliente>${envio.numeroCliente || ''}</numeroCliente>
  <numeroSeguimiento>${envio.numeroSeguimiento || ''}</numeroSeguimiento>
  <destino>${envio.destino || ''}</destino>
  <peso>${envio.peso || 0}</peso>
  <fechaEnvio>${envio.fechaEnvio || ''}</fechaEnvio>
  <fechaEstimadaEntrega>${envio.fechaEstimadaEntrega || ''}</fechaEstimadaEntrega>
</envio>`;
      return new Blob([xmlStr], { type: 'application/xml' });
    }
    case 'csv': {
      const csvStr = `numeroCliente,numeroSeguimiento,destino,peso,fechaEnvio,fechaEstimadaEntrega
${envio.numeroCliente || ''},${envio.numeroSeguimiento || ''},"${envio.destino || ''}",${envio.peso || 0},${envio.fechaEnvio || ''},${envio.fechaEstimadaEntrega || ''}`;
      return new Blob([csvStr], { type: 'text/csv' });
    }
    case 'dat': {
      const encoder = new TextEncoder();
      const writeUTF = (str) => {
        const bytes = encoder.encode(str || '');
        const buf = new Uint8Array(2 + bytes.length);
        buf[0] = (bytes.length >> 8) & 0xff;
        buf[1] = bytes.length & 0xff;
        buf.set(bytes, 2);
        return buf;
      };
      const writeDouble = (val) => {
        const buf = new ArrayBuffer(8);
        new DataView(buf).setFloat64(0, Number(val) || 0.0, false);
        return new Uint8Array(buf);
      };

      const parts = [
        writeUTF(envio.numeroCliente),
        writeUTF(envio.numeroSeguimiento),
        writeUTF(envio.destino),
        writeDouble(envio.peso),
        writeUTF(envio.fechaEnvio),
        writeUTF(envio.fechaEstimadaEntrega),
      ];

      const totalLen = parts.reduce((acc, p) => acc + p.length, 0);
      const result = new Uint8Array(totalLen);
      let offset = 0;
      for (const p of parts) {
        result.set(p, offset);
        offset += p.length;
      }
      return new Blob([result.buffer], { type: 'application/octet-stream' });
    }
    default:
      throw new Error(`Formato ${formato} no soportado`);
  }
}

// ─── Parser Cliente JS de Ficheros ────────────────────────────
async function parsearFicheroCliente(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'json') {
    const text = await file.text();
    return JSON.parse(text);
  }

  if (ext === 'xml') {
    const text = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const getTag = (tag) => xmlDoc.querySelector(tag)?.textContent || '';
    return {
      numeroCliente: getTag('numeroCliente'),
      numeroSeguimiento: getTag('numeroSeguimiento'),
      destino: getTag('destino'),
      peso: parseFloat(getTag('peso')) || 0,
      fechaEnvio: getTag('fechaEnvio'),
      fechaEstimadaEntrega: getTag('fechaEstimadaEntrega'),
    };
  }

  if (ext === 'csv') {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) throw new Error('El fichero CSV está vacío o sin datos');
    
    // Parsear fila 2
    const dataLine = lines[1];
    // Expresión regular para separar respetando comillas
    const matches = dataLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || dataLine.split(',');
    const clean = (val) => val ? val.replace(/^"|"$/g, '').trim() : '';

    return {
      numeroCliente: clean(matches[0]),
      numeroSeguimiento: clean(matches[1]),
      destino: clean(matches[2]),
      peso: parseFloat(clean(matches[3])) || 0,
      fechaEnvio: clean(matches[4]),
      fechaEstimadaEntrega: clean(matches[5]),
    };
  }

  if (ext === 'dat') {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
    const decoder = new TextDecoder();
    const offset = { value: 0 };

    const readUTF = () => {
      const len = view.getUint16(offset.value, false);
      offset.value += 2;
      const strBytes = new Uint8Array(buffer, offset.value, len);
      offset.value += len;
      return decoder.decode(strBytes);
    };

    const readDouble = () => {
      const val = view.getFloat64(offset.value, false);
      offset.value += 8;
      return val;
    };

    return {
      numeroCliente: readUTF(),
      numeroSeguimiento: readUTF(),
      destino: readUTF(),
      peso: readDouble(),
      fechaEnvio: readUTF(),
      fechaEstimadaEntrega: readUTF(),
    };
  }

  throw new Error(`Formato .${ext} no soportado`);
}
