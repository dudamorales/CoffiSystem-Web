package br.com.coffisystem.controller;

import br.com.coffisystem.model.Promocao;
import br.com.coffisystem.repository.PromocaoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promocoes")
@CrossOrigin(origins = "*")
public class PromocaoController {

    private final PromocaoRepository promocaoRepository;

    public PromocaoController(PromocaoRepository promocaoRepository) {
        this.promocaoRepository = promocaoRepository;
    }

    @GetMapping
    public List<Promocao> listar() {
        return promocaoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promocao> buscarPorId(@PathVariable Integer id) {
        return promocaoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Promocao cadastrar(@RequestBody Promocao promocao) {
        promocao.setId(null);
        return promocaoRepository.save(promocao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Promocao> atualizar(
            @PathVariable Integer id,
            @RequestBody Promocao promocao) {

        return promocaoRepository.findById(id)
                .map(promocaoExistente -> {
                    promocao.setId(id);
                    return ResponseEntity.ok(
                            promocaoRepository.save(promocao)
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        if (!promocaoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        promocaoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

