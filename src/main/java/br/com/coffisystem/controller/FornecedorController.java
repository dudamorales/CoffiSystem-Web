package br.com.coffisystem.controller;

import br.com.coffisystem.model.Fornecedor;
import br.com.coffisystem.repository.FornecedorRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fornecedores")
public class FornecedorController {

    private final FornecedorRepository fornecedorRepository;

    public FornecedorController(FornecedorRepository fornecedorRepository) {
        this.fornecedorRepository = fornecedorRepository;
    }

    @GetMapping
    public List<Fornecedor> listarTodos() {
        return fornecedorRepository.findAll();
    }

    @PostMapping
    public Fornecedor cadastrar(@RequestBody Fornecedor fornecedor) {
        fornecedor.setId(null);
        return fornecedorRepository.save(fornecedor);
    }
}
