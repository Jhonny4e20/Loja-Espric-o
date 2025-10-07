const {produtoModel} = require("../models/produtoModel");

const produtoController = {
    //--------------------------//
    //LISTAR TODOS OS PRODUTOS  //
    //GET /produtos             //
    //--------------------------//

    listarProdutos: async (req, res)=>{
        try {
            const produtos = await produtoModel.buscarTodos();

            res.status(200).json(produtos);
        } catch (error) {
            console.error('ERRO ao listar produtos:', error);
                res.status(500).json({message: 'ERRO ao buscar produtos.'});
        }
    },

    //--------------------------//
    //   CRIAR UM NOVO PRODUTO  //
    //       GET /produtos      //
    /*
        {
            "nomeProduto": "valor",
            "precoProduto": 0.00
        }
    */
    //--------------------------//

    criarProduto: async (req, res)=>{
        try {
            
            const {nomeProduto, precoProduto} = req.body;

            if(nomeProduto == undefined || precoProduto == undefined || isNaN(precoProduto)){
                return res.status(400).json({erro:'Campos obrigatórios não preenchidos!'});
            }

            await produtoModel.inserirProduto(nomeProduto, precoProduto);

            res.status(201).json({message:'Produto cadastrado com sucesso!'});

        } catch (error) {
            console.error('ERRO ao cadastrar produto:', error);
            res.status(500).json({erro:'ERRO no servidor ao cadastrar produto!'});
        }
    }
}

module.exports = {produtoController};