package ut02.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import com.opencsv.exceptions.CsvException;
import org.springframework.stereotype.Service;
import ut02.model.Envio;

import java.io.*;
import java.time.LocalDate;
import java.util.List;

@Service
public class FileService {

    // ─── GUARDAR ─────────────────────────────────────────────────────────────

    public byte[] guardarBinario(Envio envio) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ObjectOutputStream oos = new ObjectOutputStream(baos)) {
            oos.writeObject(envio);
            return baos.toByteArray();
        }
    }

    public byte[] guardarJSON(Envio envio) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        return mapper.writeValueAsBytes(envio);
    }

    public byte[] guardarXML(Envio envio) throws IOException {
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.registerModule(new JavaTimeModule());
        xmlMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        xmlMapper.enable(SerializationFeature.INDENT_OUTPUT);
        return xmlMapper.writeValueAsBytes(envio);
    }

    public byte[] guardarCSV(Envio envio) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             OutputStreamWriter osw = new OutputStreamWriter(baos);
             CSVWriter writer = new CSVWriter(osw)) {

            // Cabecera
            String[] header = {
                "id", "numeroCliente", "numeroSeguimiento", "destino",
                "peso", "fechaEnvio", "fechaEstimadaEntrega"
            };
            writer.writeNext(header);

            // Datos
            String[] datos = {
                envio.getId() != null ? envio.getId().toString() : "",
                envio.getNumeroCliente(),
                envio.getNumeroSeguimiento(),
                envio.getDestino(),
                envio.getPeso() != null ? envio.getPeso().toString() : "",
                envio.getFechaEnvio() != null ? envio.getFechaEnvio().toString() : "",
                envio.getFechaEstimadaEntrega() != null ? envio.getFechaEstimadaEntrega().toString() : ""
            };
            writer.writeNext(datos);
            writer.flush();
            return baos.toByteArray();
        }
    }

    // ─── ABRIR ────────────────────────────────────────────────────────────────

    public Envio abrirBinario(byte[] datos) throws IOException, ClassNotFoundException {
        try (ByteArrayInputStream bais = new ByteArrayInputStream(datos);
             ObjectInputStream ois = new ObjectInputStream(bais)) {
            return (Envio) ois.readObject();
        }
    }

    public Envio abrirJSON(byte[] datos) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper.readValue(datos, Envio.class);
    }

    public Envio abrirXML(byte[] datos) throws IOException {
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.registerModule(new JavaTimeModule());
        xmlMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return xmlMapper.readValue(datos, Envio.class);
    }

    public Envio abrirCSV(byte[] datos) throws IOException, CsvException {
        try (ByteArrayInputStream bais = new ByteArrayInputStream(datos);
             InputStreamReader isr = new InputStreamReader(bais);
             CSVReader reader = new CSVReader(isr)) {

            List<String[]> rows = reader.readAll();
            if (rows.size() < 2) {
                throw new IOException("El fichero CSV no contiene datos");
            }

            // La fila 0 es la cabecera, la fila 1 son los datos
            String[] datos2 = rows.get(1);

            Envio envio = new Envio();
            envio.setId(datos2[0] != null && !datos2[0].isBlank() ? Long.parseLong(datos2[0]) : null);
            envio.setNumeroCliente(datos2[1]);
            envio.setNumeroSeguimiento(datos2[2]);
            envio.setDestino(datos2[3]);
            envio.setPeso(Double.parseDouble(datos2[4]));
            envio.setFechaEnvio(LocalDate.parse(datos2[5]));
            envio.setFechaEstimadaEntrega(LocalDate.parse(datos2[6]));

            return envio;
        }
    }
}
