package br.com.coffisystem.controller;

import br.com.coffisystem.model.Cliente;
import br.com.coffisystem.repository.ClienteRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @GetMapping
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    @PostMapping
    public Cliente cadastrar(@RequestBody Cliente cliente) {
        cliente.setId(null);
        return clienteRepository.save(cliente);
    }
}

