package br.com.coffisystem.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.coffisystem.model.Usuario;
import br.com.coffisystem.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado."));
    }

    public Usuario buscarPorCpf(String cpf) {
        return usuarioRepository.findByCpf(cpf)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado."));
    }

    public Usuario cadastrar(Usuario usuario) {
        usuario.setId(null);
        return usuarioRepository.save(usuario);
    }
}
