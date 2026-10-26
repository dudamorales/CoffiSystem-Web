package br.com.coffisystem.repository;

import br.com.coffisystem.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

}

