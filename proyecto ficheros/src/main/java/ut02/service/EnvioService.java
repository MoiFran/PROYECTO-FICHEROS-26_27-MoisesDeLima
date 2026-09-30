package ut02.service;

import org.springframework.stereotype.Service;
import ut02.model.Envio;
import ut02.repository.EnvioRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EnvioService {

    private final EnvioRepository envioRepository;

    public EnvioService(EnvioRepository envioRepository) {
        this.envioRepository = envioRepository;
    }

    public List<Envio> findAll() {
        return envioRepository.findAll();
    }

    public Optional<Envio> findById(Long id) {
        return envioRepository.findById(id);
    }

    public Envio save(Envio envio) {
        return envioRepository.save(envio);
    }

    public void deleteById(Long id) {
        envioRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return envioRepository.existsById(id);
    }
}
