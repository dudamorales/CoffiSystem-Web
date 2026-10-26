package br.com.coffisystem.controller;

import br.com.coffisystem.model.Produto;
import br.com.coffisystem.service.ProdutoService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Produto buscarPorId(@PathVariable Integer id) {
        return produtoService.buscarPorId(id);
    }

    @PostMapping
    public Produto cadastrar(@RequestBody Produto produto) {
        return produtoService.salvar(produto);
    }

    @PutMapping("/{id}")
    public Produto atualizar(
            @PathVariable Integer id,
            @RequestBody Produto produto) {
        produto.setId(id);
        return produtoService.salvar(produto);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {
        produtoService.excluir(id);
    }
}
