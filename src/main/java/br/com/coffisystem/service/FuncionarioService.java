package br.com.coffisystem.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.coffisystem.model.Funcionario;
import br.com.coffisystem.repository.FuncionarioRepository;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioService(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public Funcionario buscarPorId(Integer id) {
        return funcionarioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Funcionário não encontrado."));
    }

    public Funcionario cadastrar(Funcionario funcionario) {
        funcionario.setId(null);
        return funcionarioRepository.save(funcionario);
    }

    public Funcionario atualizar(Integer id, Funcionario funcionario) {
        Funcionario existente = buscarPorId(id);

        existente.setNome(funcionario.getNome());
        existente.setDataNascimento(funcionario.getDataNascimento());
        existente.setCpf(funcionario.getCpf());
        existente.setEmail(funcionario.getEmail());
        existente.setEndereco(funcionario.getEndereco());

        return funcionarioRepository.save(existente);
    }

    public void excluir(Integer id) {
        Funcionario existente = buscarPorId(id);
        funcionarioRepository.delete(existente);
    }
}

