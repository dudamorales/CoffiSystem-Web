package br.com.coffisystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.coffisystem.model.Funcionario;

@Repository
public interface FuncionarioRepository
        extends JpaRepository<Funcionario, Integer> {
}
