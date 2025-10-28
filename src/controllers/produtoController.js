// Importa o model de produtos, que contém as funções de acesso ao banco de dados
const { produtoModel } = require("../models/produtoModel");

// Cria o objeto controller, que define as rotas e lógicas de resposta para a API
const produtoController = {

    //--------------------------//
    // LISTAR TODOS OS PRODUTOS //
    // ROTA: GET /produtos      //
    //--------------------------//
    listarProdutos: async (req, res) => {
        try {
            // Extrai o parâmetro opcional 'idProduto' da query string
            const { idProduto } = req.query;

            // Se for passado um ID, busca apenas o produto correspondente
            if (idProduto) {
                const produto = await produtoModel.buscarUm(idProduto);
                return res.status(200).json(produto); // Retorna o produto encontrado
            }

            // Caso contrário, busca todos os produtos
            const produtos = await produtoModel.buscarTodos();

            // Retorna a lista completa
            res.status(200).json(produtos);

        } catch (error) {
            // Tratamento de erro: mostra no console e envia resposta 500
            console.error('ERRO ao listar produtos:', error);
            res.status(500).json({ message: 'ERRO ao buscar produtos.' });
        }
    },

    //--------------------------//
    //   CRIAR UM NOVO PRODUTO  //
    //   ROTA: POST /produtos   //
    //--------------------------//
    /*
        Exemplo de corpo da requisição (JSON):
        {
            "nomeProduto": "valor",
            "precoProduto": 0.00
        }
    */
    criarProduto: async (req, res) => {
        try {
            // Extrai dados do corpo da requisição
            const { nomeProduto, precoProduto } = req.body;

            // Validação: campos obrigatórios e tipo numérico
            if (nomeProduto == undefined || precoProduto == undefined || isNaN(precoProduto)) {
                return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos!' });
            }

            // Chama o model para inserir o produto no banco
            await produtoModel.inserirProduto(nomeProduto, precoProduto);

            // Retorna sucesso (status 201 - Created)
            res.status(201).json({ message: 'Produto cadastrado com sucesso!' });

        } catch (error) {
            console.error('ERRO ao cadastrar produto:', error);
            res.status(500).json({ erro: 'ERRO no servidor ao cadastrar produto!' });
        }
    },

    //-------------------------------------------//
    //      ATUALIZAR UM PRODUTO EXISTENTE       //
    //          ROTA: PUT /produtos/:idProduto   //
    //-------------------------------------------//
    /*
        Exemplo de corpo da requisição (JSON):
        {
            "nomeProduto": "valor",
            "precoProduto": 0.00
        }
    */
    atualizarProduto: async (req, res) => {
        try {
            // Pega o ID do produto da URL
            const { idProduto } = req.params;

            // Pega os novos dados do corpo da requisição
            const { nomeProduto, precoProduto } = req.body;

            // Verifica se o ID tem o formato correto (UUID = 36 caracteres)
            if (idProduto.length != 36) {
                return res.status(400).json({ erro: 'id do produto inválido!' });
            }

            // Busca o produto no banco para verificar se existe
            const produto = await produtoModel.buscarUm(idProduto);

            // Caso não exista, retorna erro 404
            if (!produto || produto.length !== 1) {
                return res.status(404).json({ erro: 'Produto não encontrado' });
            }

            // Obtém o produto atual
            const produtoAtual = produto[0];

            // Atualiza somente os campos enviados (mantém os antigos se não vierem)
            const nomeAtualizado = nomeProduto ?? produtoAtual.nomeProduto;
            const precoAtualizado = precoProduto ?? produtoAtual.precoProduto;

            // Chama o model para atualizar os dados
            await produtoModel.atualizarProduto(idProduto, nomeAtualizado, precoAtualizado);

            // Retorna mensagem de sucesso
            res.status(200).json({ message: 'Produto atualizado com sucesso!' });

        } catch (error) {
            console.error('ERRO ao atualizar produto:', error);
            res.status(500).json({ erro: "ERRO no servidor ao atualizar produto." });
        }
    },

    //-------------------------------------------//
    //           DELETAR UM PRODUTO              //
    //           ROTA: DELETE /produtos/:idProduto
    //-------------------------------------------//
    deletarProduto: async (req, res) => {
        try {
            // Obtém o ID do produto da URL
            const { idProduto } = req.params;

            // Valida o formato do ID
            if (idProduto.length != 36) {
                return res.status(400).json({ erro: 'id do produto inválido!' });
            }

            // Verifica se o produto existe
            const produto = await produtoModel.buscarUm(idProduto);

            if (!produto || produto.length !== 1) {
                return res.status(404).json({ erro: 'Produto não encontrado!' });
            }

            // Chama o model para deletar o produto
            await produtoModel.deletarProduto(idProduto);

            // Retorna mensagem de sucesso
            res.status(200).json({ message: "Produto deletado com sucesso!" });

        } catch (error) {
            console.error('ERRO ao deletar produto:', error);
            res.status(500).json({ erro: "ERRO no servidor ao deletar o produto." });
        }
    }
}

// Exporta o controller para ser usado nas rotas
module.exports = { produtoController };
