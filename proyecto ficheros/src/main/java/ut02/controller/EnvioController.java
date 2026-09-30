package ut02.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ut02.model.Envio;
import ut02.service.EnvioService;

import java.util.List;

@RestController
@RequestMapping("/api/envios")
public class EnvioController {

    private final EnvioService envioService;

    public EnvioController(EnvioService envioService) {
        this.envioService = envioService;
    }

    // GET /api/envios — Obtener todos los envíos
    @GetMapping
    public List<Envio> getAll() {
        return envioService.findAll();
    }

    // GET /api/envios/{id} — Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<Envio> getById(@PathVariable Long id) {
        return envioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/envios — Crear/Guardar en DB
    @PostMapping
    public ResponseEntity<Envio> create(@RequestBody Envio envio) {
        Envio saved = envioService.save(envio);
        return ResponseEntity.ok(saved);
    }

    // PUT /api/envios/{id} — Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<Envio> update(@PathVariable Long id, @RequestBody Envio envio) {
        if (!envioService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        envio.setId(id);
        return ResponseEntity.ok(envioService.save(envio));
    }

    // DELETE /api/envios/{id} — Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!envioService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        envioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
