package br.com.coffisystem.controller;

import br.com.coffisystem.model.Venda;
import br.com.coffisystem.repository.VendaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {

    private final VendaRepository vendaRepository;

    public VendaController(VendaRepository vendaRepository) {
        this.vendaRepository = vendaRepository;
    }

    @GetMapping
    public List<Venda> listarTodas() {
        return vendaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Venda> buscarPorId(@PathVariable Integer id) {
        return vendaRepository.findById(id);
    }

    @PostMapping
    public Venda cadastrar(@RequestBody Venda venda) {
        venda.setId(null);
        return vendaRepository.save(venda);
    }

    @PutMapping("/{id}")
    public Venda atualizar(@PathVariable Integer id,
                           @RequestBody Venda venda) {
        venda.setId(id);
        return vendaRepository.save(venda);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {
        vendaRepository.deleteById(id);
    }
}

