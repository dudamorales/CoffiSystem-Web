package br.com.coffisystem.repository;

import br.com.coffisystem.model.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FornecedorRepository
        extends JpaRepository<Fornecedor, Integer> {
}

