package ut02.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ut02.model.Envio;
import ut02.service.FileService;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;
    private final ObjectMapper objectMapper;

    public FileController(FileService fileService) {
        this.fileService = fileService;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * POST /api/files/guardar/{formato}
     * Recibe el Envio en JSON, genera el fichero y lo devuelve para descarga.
     * formato: "dat", "json", "xml", "csv"
     */
    @PostMapping("/guardar/{formato}")
    public ResponseEntity<byte[]> guardar(
            @PathVariable String formato,
            @RequestParam String nombreFichero,
            @RequestBody Envio envio) {

        try {
            byte[] contenido;
            String extension;
            String contentType;

            switch (formato.toLowerCase()) {
                case "dat" -> {
                    contenido = fileService.guardarBinario(envio);
                    extension = ".dat";
                    contentType = "application/octet-stream";
                }
                case "xml" -> {
                    contenido = fileService.guardarXML(envio);
                    extension = ".xml";
                    contentType = "application/xml";
                }
                case "csv" -> {
                    contenido = fileService.guardarCSV(envio);
                    extension = ".csv";
                    contentType = "text/csv";
                }
                case "json" -> {
                    contenido = fileService.guardarJSON(envio);
                    extension = ".json";
                    contentType = "application/json";
                }
                default -> {
                    return ResponseEntity.badRequest().build();
                }
            }

            String filename = nombreFichero + extension;

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(contenido);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * POST /api/files/abrir
     * Recibe un fichero subido (multipart), lo parsea y devuelve el Envio como JSON.
     */
    @PostMapping("/abrir")
    public ResponseEntity<Envio> abrir(@RequestParam("fichero") MultipartFile fichero) {
        try {
            byte[] bytes = fichero.getBytes();
            String originalFilename = fichero.getOriginalFilename();

            if (originalFilename == null) {
                return ResponseEntity.badRequest().build();
            }

            String extension = originalFilename.substring(
                    originalFilename.lastIndexOf('.') + 1).toLowerCase();

            Envio envio = switch (extension) {
                case "dat" -> fileService.abrirBinario(bytes);
                case "xml" -> fileService.abrirXML(bytes);
                case "csv" -> fileService.abrirCSV(bytes);
                case "json" -> fileService.abrirJSON(bytes);
                default -> null;
            };

            if (envio == null) {
                return ResponseEntity.badRequest().build();
            }

            return ResponseEntity.ok(envio);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
