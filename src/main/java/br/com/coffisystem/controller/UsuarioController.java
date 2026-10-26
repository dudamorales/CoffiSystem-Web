package br.com.coffisystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.coffisystem.model.Usuario;
import br.com.coffisystem.repository.UsuarioRepository;
import br.com.coffisystem.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    public UsuarioController(
            UsuarioService usuarioService,
            UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarPorId(id);
    }

    @GetMapping("/cpf/{cpf}")
    public Usuario buscarPorCpf(@PathVariable String cpf) {
        return usuarioService.buscarPorCpf(cpf);
    }

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(
            @RequestBody Usuario usuario) {
        Usuario salvo = usuarioService.cadastrar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest dados) {

        String cpf = dados.cpf() == null
                ? ""
                : dados.cpf().replaceAll("\\D", "");

        if (cpf.length() != 11 || dados.senha() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("CPF ou senha incorretos.");
        }

        Usuario usuario = usuarioRepository.findAll().stream()
                .filter(u -> u.getCpf() != null
                        && u.getCpf().replaceAll("\\D", "").equals(cpf))
                .findFirst()
                .orElse(null);

        if (usuario == null || !usuario.getSenha().equals(dados.senha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("CPF ou senha incorretos.");
        }

        return ResponseEntity.ok(new LoginResponse(usuario.getTipo()));
    }

    public record LoginRequest(String cpf, String senha) {
    }

    public record LoginResponse(String tipo) {
    }
}


