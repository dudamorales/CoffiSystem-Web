package br.com.coffisystem.repository;

import br.com.coffisystem.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendaRepository extends JpaRepository<Venda, Integer> {
}

