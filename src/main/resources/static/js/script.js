const formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", async function(event) {
        event.preventDefault();

        const cpf = document.getElementById("usuario").value
            .replace(/\D/g, "");
        const senha = document.getElementById("senha").value;
        const mensagem = document.getElementById("mensagem");

        if (cpf.length !== 11) {
            mensagem.textContent = "Digite um CPF válido.";
            return;
        }

        const cpfFormatado = cpf.substring(0, 3) + "."
            + cpf.substring(3, 6) + "."
            + cpf.substring(6, 9) + "-"
            + cpf.substring(9, 11);

        try {
            const resposta = await fetch("/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cpf: cpfFormatado,
                    senha: senha
                })
            });

            if (!resposta.ok) {
                mensagem.textContent = "CPF ou senha incorretos.";
                return;
            }

            const usuario = await resposta.json();

            if (usuario.tipo === "contabilidade") {
                window.location.href = "menu-contabilidade.html";
            } else if (usuario.tipo === "gerente") {
                window.location.href = "menu-gerente.html";
            } else if (usuario.tipo === "vendedor") {
                window.location.href = "menu-vendedor.html";
            } else {
                mensagem.textContent = "Tipo de usuário inválido.";
            }

        } catch (erro) {
            console.error("Erro ao realizar login:", erro);
            mensagem.textContent = "Não foi possível conectar ao servidor.";
        }
    });
}


const botaoCadastrar = document.getElementById("cadastrar");

if (botaoCadastrar) {
    botaoCadastrar.addEventListener("click", function() {
        window.location.href = "cadastro-funcionario.html";
    });
}


const busca = document.getElementById("buscarVenda");
const tabela = document.getElementById("listaVendas");

if (busca && tabela) {
    let vendas = [];

    async function carregarVendas() {
        try {
            const [
                respostaVendas,
                respostaProdutos,
                respostaCategorias,
                respostaClientes
            ] = await Promise.all([
                fetch("/api/vendas"),
                fetch("/api/produtos"),
                fetch("/api/categorias"),
                fetch("/api/clientes")
            ]);

            if (
                !respostaVendas.ok ||
                !respostaProdutos.ok ||
                !respostaCategorias.ok ||
                !respostaClientes.ok
            ) {
                throw new Error("Erro ao carregar os dados.");
            }

            const dadosVendas = await respostaVendas.json();
            const produtos = await respostaProdutos.json();
            const categorias = await respostaCategorias.json();
            const clientes = await respostaClientes.json();

            vendas = dadosVendas.map(function(venda) {
                const produto = produtos.find(function(item) {
                    return Number(item.id) === Number(venda.idProduto);
                });

                const categoria = produto
                    ? categorias.find(function(item) {
                        return Number(item.id) === Number(
                            produto.idcategoria ?? produto.idCategoria
                        );
                    })
                    : null;

                const cliente = clientes.find(function(item) {
                    return Number(item.id) === Number(venda.idCliente);
                });

                return {
                    id: venda.id,
                    produto: produto ? produto.nome : "Produto não encontrado",
                    categoria: categoria ? categoria.nome : "—",
                    valor: venda.valorTotal,
                    quantidade: venda.quantidade,
                    cliente: cliente ? cliente.nome : "—"
                };
            });

            mostrarVendas();
        } catch (erro) {
            console.error("Erro ao carregar histórico de vendas:", erro);

            tabela.innerHTML = `
                <tr>
                    <td colspan="6">Não foi possível carregar o histórico.</td>
                </tr>
            `;
        }
    }

    function mostrarVendas() {
        const texto = busca.value.toLowerCase().trim();

        const vendasFiltradas = vendas.filter(function(venda) {
            return Object.values(venda).some(function(valor) {
                return String(valor ?? "").toLowerCase().includes(texto);
            });
        });

        tabela.innerHTML = "";

        if (vendasFiltradas.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6">Nenhuma venda encontrada.</td>
                </tr>
            `;
            return;
        }

        vendasFiltradas.forEach(function(venda) {
            const linha = document.createElement("tr");

            const valorFormatado = Number(venda.valor).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

            [
                venda.id,
                venda.produto,
                venda.categoria,
                valorFormatado,
                venda.quantidade,
                venda.cliente
            ].forEach(function(valor) {
                const celula = document.createElement("td");
                celula.textContent = valor ?? "—";
                linha.appendChild(celula);
            });

            tabela.appendChild(linha);
        });
    }

    busca.addEventListener("input", mostrarVendas);

    carregarVendas();
}

const formPromocao = document.getElementById("formPromocao");

if (formPromocao) {
    const produtoPromocao = document.getElementById("produtoPromocao");
    const desconto = document.getElementById("desconto");
    const validadePromocao = document.getElementById("validadePromocao");

    async function carregarProdutosPromocao() {
        try {
            const resposta = await fetch("/api/produtos");

            if (!resposta.ok) {
                throw new Error("Erro ao carregar produtos.");
            }

            const produtos = await resposta.json();

            produtoPromocao.innerHTML =
                '<option value="">Selecione um produto</option>';

            produtos.forEach(function(produto) {
                const opcao = document.createElement("option");
                opcao.value = produto.id;
                opcao.textContent = produto.nome;
                produtoPromocao.appendChild(opcao);
            });
        } catch (erro) {
            console.error(erro);
            alert("Não foi possível carregar os produtos.");
        }
    }

    carregarProdutosPromocao();

    formPromocao.addEventListener("submit", async function(event) {
        event.preventDefault();

        const promocao = {
            idProduto: Number(produtoPromocao.value),
            porcentagem: Number(desconto.value),
            validade: validadePromocao.value
        };

        if (!promocao.idProduto) {
            alert("Selecione um produto.");
            return;
        }

        if (
            !Number.isFinite(promocao.porcentagem) ||
            promocao.porcentagem <= 0 ||
            promocao.porcentagem > 100
        ) {
            alert("Informe um desconto entre 1% e 100%.");
            return;
        }

        if (!promocao.validade) {
            alert("Informe a validade da promoção.");
            return;
        }

        try {
            const resposta = await fetch("/api/promocoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(promocao)
            });

            if (!resposta.ok) {
                const erro = await resposta.text();
                console.error(erro);
                throw new Error("Erro ao cadastrar promoção.");
            }

            alert("Promoção cadastrada com sucesso!");
            formPromocao.reset();
        } catch (erro) {
            console.error(erro);
            alert("Não foi possível cadastrar a promoção.");
        }
    });
}


const listaPromocoes = document.getElementById("listaPromocoes");
const botaoEditar = document.getElementById("editarPromocoes");
const botaoSalvar = document.getElementById("salvarPromocoes");

if (listaPromocoes) {
    let promocoes = [];
    let produtos = [];

    async function carregarPromocoes() {
        try {
            const [respostaPromocoes, respostaProdutos] = await Promise.all([
                fetch("/api/promocoes"),
                fetch("/api/produtos")
            ]);

            if (!respostaPromocoes.ok || !respostaProdutos.ok) {
                throw new Error("Erro ao carregar os dados.");
            }

            promocoes = await respostaPromocoes.json();
            produtos = await respostaProdutos.json();

            mostrarPromocoes();
        } catch (erro) {
            console.error("Erro ao carregar promoções:", erro);
            alert("Não foi possível carregar as promoções.");
        }
    }

    function mostrarPromocoes() {
        listaPromocoes.innerHTML = "";

        promocoes.forEach(function(promocao) {
            const linha = document.createElement("tr");
            linha.dataset.id = promocao.id;

            const produto = produtos.find(function(item) {
                return Number(item.id) === Number(promocao.idProduto);
            });

            const nomeProduto = produto
                ? produto.nome
                : "Produto não encontrado";

            const celulaId = document.createElement("td");
            celulaId.textContent = promocao.id;

            const celulaProduto = document.createElement("td");
            celulaProduto.textContent = nomeProduto;

            const celulaDesconto = document.createElement("td");
            celulaDesconto.textContent = promocao.porcentagem + "%";

            const celulaValidade = document.createElement("td");
            celulaValidade.textContent = promocao.validade || "";

            linha.append(
                celulaId,
                celulaProduto,
                celulaDesconto,
                celulaValidade
            );

            listaPromocoes.appendChild(linha);
        });
    }

    if (botaoEditar) {
        botaoEditar.addEventListener("click", function() {
            const linhas = listaPromocoes.querySelectorAll("tr");

            linhas.forEach(function(linha) {
                const campos = linha.querySelectorAll("td");

                if (campos.length < 4 || campos[1].querySelector("select")) {
                    return;
                }

                const promocao = promocoes.find(function(item) {
                    return Number(item.id) === Number(linha.dataset.id);
                });

                if (!promocao) return;

                const seletorProduto = document.createElement("select");

                produtos.forEach(function(produto) {
                    const opcao = document.createElement("option");
                    opcao.value = produto.id;
                    opcao.textContent = produto.nome;
                    opcao.selected =
                        Number(produto.id) === Number(promocao.idProduto);

                    seletorProduto.appendChild(opcao);
                });

                campos[1].replaceChildren(seletorProduto);

                const campoDesconto = document.createElement("input");
                campoDesconto.type = "number";
                campoDesconto.min = "1";
                campoDesconto.max = "100";
                campoDesconto.step = "0.01";
                campoDesconto.value = promocao.porcentagem;

                campos[2].replaceChildren(campoDesconto);

                const campoValidade = document.createElement("input");
                campoValidade.type = "date";
                campoValidade.value = promocao.validade || "";

                campos[3].replaceChildren(campoValidade);
            });
        });
    }

    if (botaoSalvar) {
        botaoSalvar.addEventListener("click", async function() {
            const linhas = listaPromocoes.querySelectorAll("tr");

            try {
                for (const linha of linhas) {
                    const campos = linha.querySelectorAll("td");

                    if (
                        campos.length < 4 ||
                        !campos[1].querySelector("select")
                    ) {
                        continue;
                    }

                    const id = Number(linha.dataset.id);
                    const idProduto = Number(
                        campos[1].querySelector("select").value
                    );
                    const porcentagem = Number(
                        campos[2].querySelector("input").value
                    );
                    const validade =
                        campos[3].querySelector("input").value;

                    if (
                        !idProduto ||
                        !Number.isFinite(porcentagem) ||
                        porcentagem <= 0 ||
                        porcentagem > 100 ||
                        !validade
                    ) {
                        alert(
                            "Confira o produto, o desconto e a validade."
                        );
                        return;
                    }

                    const resposta = await fetch("/api/promocoes/" + id, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            idProduto: idProduto,
                            porcentagem: porcentagem,
                            validade: validade
                        })
                    });

                    if (!resposta.ok) {
                        throw new Error(
                            "Erro ao atualizar a promoção " + id
                        );
                    }
                }

                await carregarPromocoes();
                alert("Promoções salvas com sucesso!");
            } catch (erro) {
                console.error("Erro ao salvar promoções:", erro);
                alert("Não foi possível salvar as alterações.");
                await carregarPromocoes();
            }
        });
    }

    carregarPromocoes();
}

const formCliente = document.getElementById("formCliente");

if (formCliente) {
    formCliente.addEventListener("submit", async function(event) {
        event.preventDefault();

        const cliente = {
            nome: document.getElementById("nomeCliente").value.trim(),
            email: document.getElementById("emailCliente").value.trim(),
            telefone: document.getElementById("telefoneCliente").value.trim()
        };

        try {
            const resposta = await fetch("/api/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cliente)
            });

            if (!resposta.ok) {
                const erro = await resposta.text();
                console.error("Erro da API:", erro);
                throw new Error("Falha ao cadastrar cliente.");
            }

            alert("Cliente cadastrado com sucesso!");

            formCliente.reset();

        } catch (erro) {
            console.error("Erro ao cadastrar cliente:", erro);
            alert("Não foi possível cadastrar o cliente. Confira o Console.");
        }
    });
}

 
const formVenda = document.getElementById("formVenda");

if (formVenda) {
    const produtoVenda = document.getElementById("produtoVenda");
    const codigoVenda = document.getElementById("codigoVenda");
    const valorVenda = document.getElementById("valorVenda");
    const quantidadeVenda = document.getElementById("quantidadeVenda");
    const promocaoVenda = document.getElementById("promocaoVenda");
    const clienteVenda = document.getElementById("clienteVenda");

    console.log("Formulário:", formVenda);
    console.log("Produto:", produtoVenda);
    console.log("Cliente:", clienteVenda);
    console.log("Código:", codigoVenda);
    console.log("Valor:", valorVenda);
    console.log("Quantidade:", quantidadeVenda);
    console.log("Promoção:", promocaoVenda);

    let produtos = [];
    let clientes = [];
    let promocoes = [];

    async function gerarCodigoVenda() {
    try {
        const resposta = await fetch("/api/vendas");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar vendas.");
        }

        const vendas = await resposta.json();

        const proximoId = vendas.reduce(function(maior, venda) {
            return Math.max(maior, Number(venda.id) || 0);
        }, 0) + 1;

        codigoVenda.value = "VEN-" + String(proximoId).padStart(4, "0");

    } catch (erro) {
        console.error("Erro ao gerar código da venda:", erro);
        codigoVenda.value = "";
        alert("Não foi possível gerar o código da venda.");
    }
}

async function carregarDadosVenda() {
    try {
        const [respostaProdutos, respostaClientes, respostaPromocoes] =
            await Promise.all([
                fetch("/api/produtos"),
                fetch("/api/clientes"),
                fetch("/api/promocoes")
            ]);

        if (
            !respostaProdutos.ok ||
            !respostaClientes.ok ||
            !respostaPromocoes.ok
        ) {
            throw new Error("Erro ao carregar produtos, clientes ou promoções.");
        }

        produtos = await respostaProdutos.json();
        clientes = await respostaClientes.json();
        promocoes = await respostaPromocoes.json();

        produtoVenda.innerHTML =
            '<option value="">Selecione um produto</option>';

        produtos.forEach(function(produto) {
            const opcao = document.createElement("option");
            opcao.value = produto.id;
            opcao.textContent = produto.nome;
            produtoVenda.appendChild(opcao);
        });

        clienteVenda.innerHTML =
            '<option value="">Selecione um cliente</option>';

        clientes.forEach(function(cliente) {
            const opcao = document.createElement("option");
            opcao.value = cliente.id;
            opcao.textContent = cliente.nome;
            clienteVenda.appendChild(opcao);
        });

        carregarPromocoes();
        await gerarCodigoVenda();

    } catch (erro) {
        console.error("Erro ao carregar dados da venda:", erro);
        alert("Não foi possível carregar os produtos, clientes e promoções.");
    }
}

    function carregarPromocoes() {
        promocaoVenda.innerHTML =
            '<option value="">Sem promoção</option>';

        const produtoSelecionado = produtos.find(function(produto) {
            return Number(produto.id) === Number(produtoVenda.value);
        });

        if (!produtoSelecionado) return;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        promocoes.forEach(function(promocao) {
            const validade = new Date(promocao.validade + "T00:00:00");

            if (
                Number(promocao.idProduto) === Number(produtoSelecionado.id) &&
                validade >= hoje
            ) {
                const opcao = document.createElement("option");
                opcao.value = promocao.id;
                opcao.textContent = promocao.porcentagem + "% de desconto";
                promocaoVenda.appendChild(opcao);
            }
        });
    }

    function atualizarValor() {
        const produto = produtos.find(function(item) {
            return Number(item.id) === Number(produtoVenda.value);
        });

        valorVenda.value = produto
            ? Number(produto.valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })
            : "";
    }

    produtoVenda.addEventListener("change", function() {
        atualizarValor();
        carregarPromocoes();
    });

    formVenda.addEventListener("submit", async function(event) {
        event.preventDefault();

        const produto = produtos.find(function(item) {
            return Number(item.id) === Number(produtoVenda.value);
        });

        const quantidade = Number(quantidadeVenda.value);

        if (!produto) {
            alert("Selecione um produto.");
            return;
        }

        if (!Number.isInteger(quantidade) || quantidade < 1) {
            alert("Informe uma quantidade válida.");
            return;
        }

        if (quantidade > Number(produto.quantidade)) {
            alert("Quantidade indisponível no estoque.");
            return;
        }

        let desconto = 0;

        if (promocaoVenda.value) {
            const promocao = promocoes.find(function(item) {
                return Number(item.id) === Number(promocaoVenda.value);
            });

            if (promocao) {
                desconto = Number(promocao.porcentagem) || 0;
            }
        }

        const valorUnitario = Number(produto.valor);
        const total = Number(
            (valorUnitario * quantidade * (1 - desconto / 100)).toFixed(2)
        );

       if (!clienteVenda.value) {
            alert("Selecione um cliente.");
            return;
        }

        const venda = {
            idProduto: Number(produto.id),
            idCliente: Number(clienteVenda.value),
            quantidade: quantidade,
            valorTotal: total
        };

        try {
            const resposta = await fetch("/api/vendas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(venda)
            });

            if (!resposta.ok) {
                const erro = await resposta.text();
                console.error("Erro da API:", erro);
                throw new Error("Não foi possível cadastrar a venda.");
            }

            alert("Venda cadastrada com sucesso!");

            formVenda.reset();
            valorVenda.value = "";

            await carregarDadosVenda();
        } catch (erro) {
            console.error("Erro ao cadastrar venda:", erro);
            alert("Não foi possível cadastrar a venda. Confira o Console.");
        }
    });

    carregarDadosVenda();
}


const formFornecedor = document.getElementById("formFornecedor");

if (formFornecedor) {
    formFornecedor.addEventListener("submit", async function(event) {
        event.preventDefault();

        const fornecedor = {
            nome: document.getElementById("nome").value.trim(),
            empresa: document.getElementById("empresa").value.trim(),
            email: document.getElementById("email").value.trim(),
            telefone1: document.getElementById("telefone1").value.trim(),
            telefone2: document.getElementById("telefone2").value.trim()
        };

        if (
            !fornecedor.nome ||
            !fornecedor.empresa ||
            !fornecedor.email ||
            !fornecedor.telefone1
        ) {
            alert("Preencha os campos obrigatórios.");
            return;
        }

        try {
            const resposta = await fetch("/api/fornecedores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fornecedor)
            });

            if (!resposta.ok) {
                const erro = await resposta.text();
                console.error("Erro da API:", erro);
                throw new Error("Falha ao cadastrar fornecedor.");
            }

            alert("Fornecedor cadastrado com sucesso!");
            formFornecedor.reset();

        } catch (erro) {
            console.error("Erro ao cadastrar fornecedor:", erro);
            alert("Não foi possível cadastrar o fornecedor. Confira o Console.");
        }
    });
}

const formProduto = document.getElementById("formProduto");

if (formProduto) {
    formProduto.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        const produto = {
            nome: document.getElementById("nomeProduto").value.trim(),
            valor: Number(document.getElementById("valor").value),
            quantidade: Number(document.getElementById("quantidade").value),
            validade: document.getElementById("validade").value,
            idcategoria: Number(document.getElementById("categoria").value),
            idfornecedor: Number(document.getElementById("fornecedor").value)
        };

        if (
            !produto.nome ||
            produto.valor < 0 ||
            produto.quantidade < 0 ||
            !produto.validade ||
            !produto.idcategoria ||
            !produto.idfornecedor
        ) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        try {
            const resposta = await fetch("/api/produtos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produto)
            });

            if (!resposta.ok) {
                const mensagemErro = await resposta.text();
                console.error("Erro da API:", mensagemErro);
                throw new Error("Não foi possível cadastrar o produto.");
            }

            alert("Produto cadastrado com sucesso!");
            formProduto.reset();

        } catch (erro) {
            console.error("Erro ao cadastrar produto:", erro);
            alert("Erro ao cadastrar o produto. Confira o Console e o servidor.");
        }
    });
}

async function carregarCategorias() {
    const campoCategoria = document.getElementById("categoria");

    if (!campoCategoria) return;

    try {
        const resposta = await fetch("/api/categorias");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar categorias.");
        }

        const categorias = await resposta.json();

        campoCategoria.innerHTML = '<option value="">Selecione</option>';

        categorias.forEach(function(categoria) {
            const opcao = document.createElement("option");
            opcao.value = categoria.id;
            opcao.textContent = categoria.nome;
            campoCategoria.appendChild(opcao);
        });

    } catch (erro) {
        console.error("Erro ao carregar categorias:", erro);
        alert("Não foi possível carregar as categorias.");
    }
}

async function carregarFornecedores() {
    const campoFornecedor = document.getElementById("fornecedor");

    if (!campoFornecedor) return;

    try {
        const resposta = await fetch("/api/fornecedores");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar fornecedores.");
        }

        const fornecedores = await resposta.json();

        campoFornecedor.innerHTML =
            '<option value="">Selecione um fornecedor</option>';

        fornecedores.forEach(function(fornecedor) {
            const opcao = document.createElement("option");
            opcao.value = fornecedor.id;
            opcao.textContent = fornecedor.nome;
            campoFornecedor.appendChild(opcao);
        });

    } catch (erro) {
        console.error("Erro ao carregar fornecedores:", erro);
        alert("Não foi possível carregar os fornecedores.");
    }
}

carregarCategorias();
carregarFornecedores();