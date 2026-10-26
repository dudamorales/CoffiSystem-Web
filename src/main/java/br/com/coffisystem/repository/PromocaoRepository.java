package br.com.coffisystem.repository;

import br.com.coffisystem.model.Promocao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromocaoRepository extends JpaRepository<Promocao, Integer> {
}

