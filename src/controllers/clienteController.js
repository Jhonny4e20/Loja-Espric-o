// Importa o modelo de cliente (clienteModel) de dentro da pasta models
const { clienteModel } = require("../models/clienteModel");

// Cria o objeto controller responsável por lidar com as requisições relacionadas a "clientes"
const clienteController = {
    
    // Método assíncrono para listar todos os clientes cadastrados
    listarClientes: async (req, res) => {
        try {
            // Extrai o parâmetro "idCliente" da query string (ex: /clientes?idCliente=123)
            const { idCliente } = req.query;

            // Se o parâmetro "idCliente" for enviado, executa a busca individual
            if (idCliente) {

                // Verifica se o ID informado possui o formato correto (UUID → 36 caracteres)
                if (idCliente.length != 36) {
                    return res.status(400).json({ erro: "id do cliente inválido" });
                }

                // Busca o cliente específico no banco de dados
                const cliente = await clienteModel.buscarUm(idCliente);

                // Retorna o cliente encontrado (ou array vazio se não existir)
                return res.status(200).json(cliente);
            }

            // Caso nenhum ID seja informado, busca todos os clientes
            const clientes = await clienteModel.buscarTodos();

            // Retorna a lista completa de clientes
            res.status(200).json(clientes);
        
        } catch (error) {
            // Caso ocorra algum erro, exibe no console e retorna uma resposta de erro 500 (Interno do Servidor)
            console.error('ERRO ao listar clientes', error);
            res.status(500).json({ message: 'ERRO ao procurar clientes' });
        }
    },


    // Método assíncrono para adicionar um novo cliente
    adicionarCliente: async (req, res) => {
        try {
            // Extrai nomeCliente e cpfCliente do corpo da requisição (req.body)
            const { nomeCliente, cpfCliente } = req.body;

            // Validação: verifica se os campos foram preenchidos e se o CPF é numérico
            if (nomeCliente == undefined || cpfCliente == undefined || isNaN(cpfCliente)) {
                return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos!' });
            }

            const result = await clienteModel.buscarCPF (cpfCliente);
            if (result.length > 0) {
                return res.status(409).json({ message: 'CPF já Cadastrado!'});
            }

            // Chama o método do modelo para inserir o cliente no banco de dados
            await clienteModel.inserirCliente(nomeCliente, cpfCliente);

            // Retorna sucesso com status HTTP 201 (Criado)
            res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });

        } catch (error) {
            // Caso ocorra erro, exibe no console e retorna mensagem de erro 500
            console.error('ERRO ao cadastrar produto:', error);
            res.status(500).json({ erro: 'ERRO no servidor ao cadastrar cliente!' });
        }
    }
}

// Exporta o objeto clienteController para ser usado em outras partes do sistema (ex: rotas)
module.exports = { clienteController };
