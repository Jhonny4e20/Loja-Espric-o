const {pedidoModel} = require("../models/pedidoModel");
const {clienteModel} = require("../models/clienteModel");
const {produtoModel} = require("../models/produtoModel");

const pedidoController = {
    /**
     * Controlador que lista todos os pedidos do banco de dados.
     * 
     * @async
     * @function listarPedidos
     * @param {object} req Objeto da requisição (recebido do cliente HTTP).
     * @param {object} res Objeto da resposta (enviado ao cliente HTTP).
     * @returns {Promise<void>} Retorna uma resposta JSON com a lista de pedidos.
     * @throws Mostra no console e retorna erro 500 se ocorrer falha ao buscar os pedidos.
     */
    listarPedidos: async (req, res) => {
        try {
            
            const pedidos = await pedidoModel.buscarTodos();

            res.status(200).json(pedidos);

        } catch (error) {
            console.error("ERRO ao listar pedidos:", error);
            res.status(500).json({erro:"ERRO interno no servidor ao listar pedidos!"});
        }
    },

    criarPedido: async (req, res) => {
        try {
            
            const {idCliente, dataPedido, statusPagamento, itens} = req.body;

            if (idCliente == undefined || dataPedido == undefined || statusPagamento == undefined || itens.length < 1) {
                return res.status(400).json({erro:"campos obrigatórios não preenchidos!"});
            }

            if (idCliente.length != 36) {
                return res.status(400).json({erro:"Id do Cliente inválido"});
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length != 1) {
                return res.status(400).json({erro:"Cliente não encontrado!"});
            }

            for (const item of itens) {
                const {idProduto, qtdItem} = item;

                if (idProduto == undefined || qtdItem == undefined) {
                    return res.status(400).json({erro:"Campos obrigatórios não preenchidos!"});
                }

                if (idProduto.length != 36) {
                    return res.status(400).json({erro:"Id do produto inválido!"});
                }

                const produto = await produtoModel.buscarUm(idProduto);

                if (!produto || produto.length != 1) {
                    return res.status(404).json({erro:"Produto não encontrado!"});
                }
            }

            await pedidoModel.inserirPedido(idCliente, dataPedido, statusPagamento, {itens});

            res.status(201).json({message:"Pedido cadastrado com sucesso!"});

        } catch (error) {
            console.error("ERRO ao cadastrar pedido:", error);
            res.status(500).json({erro:"ERRO interno no servidor ao cadastrar pedido!"});
        }
    },

    atualizarPedido: async (req, res) => {
        try {
            
            const {idPedido} = req.params;
            const {idCliente, dataPedido, statusPagamento} = req.body;

            if (idPedido.length != 36) {
                return res.status(400).json({ erro: "id do pedido inválido" });
            }

            const pedido = await pedidoModel.buscarUm(idPedido);

            if (!pedido || pedido.length !==1) {
                return res.status(404).json({ erro: "Pedido não encontrado!" });
            }

            if (idCliente) {
                if (idCliente.length != 36) {
                    return res.status(400).json({ erro: "id do cliente inválido" });
                }

                const cliente = await clienteModel.buscarUm(idCliente);

                if (!cliente || cliente.length !== 1) {
                    return res.status(404).json({ erro: "Cliente não encontrado!" });
                }
            }

            const pedidoAtual  = pedido[0];

            const idClienteAtualizado = idCliente ?? pedidoAtual.idCliente;
            const dataPedidoAtualizado = dataPedido ?? pedidoAtual.dataPedido;
            const statusPagamentoAtualizado = statusPagamento ?? pedidoAtual.statusPagamento;

            await pedidoModel.atualizarPedido(idPedido, idClienteAtualizado, dataPedidoAtualizado, statusPagamentoAtualizado);

            res.status(200).json({mensagem: "Pedido atualizado com sucesso!"});

        } catch (error) {
            console.error("ERRO ao atualizar pedido:", error);
            res.status(500).json({ erro: "ERRO interno no servidor ao atualizar pedido!" });
        }
    },

    deletarPedido: async (req, res) => {
        try {

            const {idPedido} = req.params;

            if (idPedido.length != 36) {
                return res.status(400).json({ erro: "id do pedido inválido" });
            }

            const pedido = await pedidoModel.buscarUm(idPedido);

            if (!pedido || pedido.length !==1) {
                return res.status(404).json({ erro: "Pedido não encontrado!" });
            }

            await pedidoModel.deletarPedido(idPedido);
            res.status(200).json({ mensagem: "Pedido deletado com sucesso!" });

        } catch (error) {
            console.error("ERRO ao deletar pedido:", error);
             res.status(500).json({ erro: "ERRO interno no servidor ao deletar pedido!" });
        }
    }
}   

module.exports = { pedidoController };