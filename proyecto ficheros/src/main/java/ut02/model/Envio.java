package ut02.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "envios")
@JacksonXmlRootElement(localName = "envio")
public class Envio implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String numeroCliente;

    @Column(unique = true)
    private String numeroSeguimiento;

    @Column(nullable = false)
    private String destino;

    @Column(nullable = false)
    private Double peso;

    @Column(nullable = false)
    private LocalDate fechaEnvio;

    @Column(nullable = false)
    private LocalDate fechaEstimadaEntrega;

    // ─── Constructores ───────────────────────────────────────────────────────

    public Envio() {}

    public Envio(String numeroCliente, String numeroSeguimiento, String destino,
                 Double peso, LocalDate fechaEnvio, LocalDate fechaEstimadaEntrega) {
        this.numeroCliente = numeroCliente;
        this.numeroSeguimiento = numeroSeguimiento;
        this.destino = destino;
        this.peso = peso;
        this.fechaEnvio = fechaEnvio;
        this.fechaEstimadaEntrega = fechaEstimadaEntrega;
    }

    // ─── Getters y Setters ───────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroCliente() { return numeroCliente; }
    public void setNumeroCliente(String numeroCliente) { this.numeroCliente = numeroCliente; }

    public String getNumeroSeguimiento() { return numeroSeguimiento; }
    public void setNumeroSeguimiento(String numeroSeguimiento) { this.numeroSeguimiento = numeroSeguimiento; }

    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }

    public Double getPeso() { return peso; }
    public void setPeso(Double peso) { this.peso = peso; }

    public LocalDate getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDate fechaEnvio) { this.fechaEnvio = fechaEnvio; }

    public LocalDate getFechaEstimadaEntrega() { return fechaEstimadaEntrega; }
    public void setFechaEstimadaEntrega(LocalDate fechaEstimadaEntrega) {
        this.fechaEstimadaEntrega = fechaEstimadaEntrega;
    }

    @Override
    public String toString() {
        return "Envio{" +
                "id=" + id +
                ", numeroCliente='" + numeroCliente + '\'' +
                ", numeroSeguimiento='" + numeroSeguimiento + '\'' +
                ", destino='" + destino + '\'' +
                ", peso=" + peso +
                ", fechaEnvio=" + fechaEnvio +
                ", fechaEstimadaEntrega=" + fechaEstimadaEntrega +
                '}';
    }
}
