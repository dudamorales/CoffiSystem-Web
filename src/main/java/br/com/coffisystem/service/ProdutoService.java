package br.com.coffisystem.service;

import br.com.coffisystem.model.Produto;
import br.com.coffisystem.repository.ProdutoRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Integer id) {
        return produtoRepository.findById(id).orElse(null);
    }

    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    public void excluir(Integer id) {
        produtoRepository.deleteById(id);
    }
}

