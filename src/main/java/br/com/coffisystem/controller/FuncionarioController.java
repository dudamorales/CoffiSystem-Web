package br.com.coffisystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import br.com.coffisystem.model.Funcionario;
import br.com.coffisystem.model.Usuario;
import br.com.coffisystem.repository.FuncionarioRepository;
import br.com.coffisystem.repository.UsuarioRepository;
import br.com.coffisystem.service.FuncionarioService;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;
    private final FuncionarioRepository funcionarioRepository;
    private final UsuarioRepository usuarioRepository;

    public FuncionarioController(
            FuncionarioService funcionarioService,
            FuncionarioRepository funcionarioRepository,
            UsuarioRepository usuarioRepository) {

        this.funcionarioService = funcionarioService;
        this.funcionarioRepository = funcionarioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<Funcionario> listarTodos() {
        return funcionarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public Funcionario buscarPorId(@PathVariable Integer id) {
        return funcionarioService.buscarPorId(id);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(
            @RequestBody CadastroFuncionario dados) {

                
        System.out.println("1. Iniciando cadastro de funcionário");
        System.out.println("CPF recebido: " + dados.cpf());
        System.out.println("Função recebida: " + dados.funcao());
        System.out.println("Senha recebida: " +
                (dados.senha() == null ? "NULL" : "RECEBIDA"));


       String cpfSemFormatacao = dados.cpf() == null
        ? ""
        : dados.cpf().replaceAll("\\D", "");

        if (cpfSemFormatacao.length() != 11) {
            return ResponseEntity.badRequest()
                    .body("O CPF deve conter 11 números.");
        }

        if (usuarioRepository.findAll().stream()
                .anyMatch(u -> u.getCpf().replaceAll("\\D", "")
                        .equals(cpfSemFormatacao))) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Já existe um usuário cadastrado com esse CPF.");
        }
        
        String cpfFormatado = cpfSemFormatacao.substring(0, 3) + "."
        + cpfSemFormatacao.substring(3, 6) + "."
        + cpfSemFormatacao.substring(6, 9) + "-"
        + cpfSemFormatacao.substring(9, 11);

        Funcionario funcionario = new Funcionario();
        funcionario.setNome(dados.nome());
        funcionario.setDataNascimento(dados.dataNascimento());
        funcionario.setCpf(cpfFormatado);
        funcionario.setEmail(dados.email());
        funcionario.setEndereco(dados.endereco());

        
        Funcionario salvo = funcionarioRepository.save(funcionario);

        System.out.println("2. Funcionário salvo com ID: " + salvo.getId());

        Usuario usuario = new Usuario();
        usuario.setCpf(cpfFormatado);
        usuario.setSenha(dados.senha());
        usuario.setTipo(dados.funcao());

        System.out.println("3. Tentando salvar usuário");
        Usuario usuarioSalvo = usuarioRepository.saveAndFlush(usuario);
        System.out.println("4. Usuário salvo com ID: " + usuarioSalvo.getId());


        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public Funcionario atualizar(
            @PathVariable Integer id,
            @RequestBody Funcionario funcionario) {

        return funcionarioService.atualizar(id, funcionario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        funcionarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    public record CadastroFuncionario(
            String nome,
            String dataNascimento,
            String cpf,
            String email,
            String endereco,
            String funcao,
            String senha) {
    }
}
