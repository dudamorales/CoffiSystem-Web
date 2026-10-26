package br.com.coffisystem.repository;

import br.com.coffisystem.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository
        extends JpaRepository<Categoria, Integer> {
}

