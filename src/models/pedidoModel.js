const {sql, getConnection} = require("../config/db");

const pedidoModel = {
    /**
     * Busca todos os pedidos em seus respectivos itens no bamco de dados.
     * 
     * @async
     * @function buscarTodos
     * @returns {Promise<Array>} Retorna uma lista com todos os pedidos e seus itens.]
     * @throws Mostra no console o erro e propaga o erro caso a busca a falhe.
     */
    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            const querySQL = `
                SELECT 
	               CL.nomeCliente, PD.dataPedido, 
                   PD.statusPagamento, PR.nomeProduto, IT.qtdItem
                FROM Pedidos PD
	               INNER JOIN Clientes CL
		              ON CL.idCliente = PD.idCliente
	               INNER JOIN ItemPedido IT
		              ON IT.idPedido = PD.idPedido
	               INNER JOIN Produtos PR
		              ON PR.idProduto = IT.idProduto
            `;

            const result = await pool.request()
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("ERRO ao buscar pedidos:", error);
            throw error;
        }
    },

    buscarUm: async (idPedido) => {
        try {

            const pool = await getConnection();

            const querySQL = "SELECT * FROM Pedidos WHERE idPedido = @idPedido";

            const result = await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

                return result.recordset;
            
        } catch (error) {
            console.error("ERRO ao buscar pedidos:", error);
            throw error;
        }
    },

    inserirPedido: async (idCliente, dataPedido, statusPagamento, {itens}) => {
        // {itens} realiza a desestruturação do objeto itens

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); //Inicia a Transação

        try {
            
            let querySQL = `
                INSERT INTO Pedidos (idCliente, dataPedido, statusPagamento)
                OUTPUT INSERTED.idPedido
                VALUES (@idCliente, @dataPedido, @statusPagamento)
            `
            const result = await transaction.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("statusPagamento", sql.Bit, statusPagamento)
                .query(querySQL);

            const idPedido = result.recordset[0].idPedido;

        for (const item of itens) {
            const {idProduto, qtdItem} = item;

            querySQL = `
                INSERT INTO itemPedido (idPedido, idProduto, qtdItem)
                VALUES (@idPedido, @idProduto, @qtdItem)
            `
            await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("idProduto", sql.UniqueIdentifier, idProduto)
                .input("qtdItem",sql.Int, qtdItem)
                .query(querySQL);
            }

            await transaction.commit(); //Confirma a transação (salva tudo no banco)
        } catch (error) {
            await transaction.rollback(); //Defaz tudo quase de erro
            console.error("ERRO ao inserir pedido:", error);
            throw error;
        }
    },

    atualizarPedido: async (idPedido, idCliente, dataPedido, statusPagamento) => {
        try {
            
            const pool = await getConnection();

            const querySQL = `
                UPDATE Pedidos
                SET idCliente = @idCliente,
                    dataPedido = @dataPedido,
                    statusPagamento = @statusPagamento 
                WHERE idPedido = @idPedido           
            `
            await pool.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("statusPagamento", sql.Bit, statusPagamento)
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

        } catch (error) {
            console.error("ERRO ao atualizar pedido:", error);
            throw error;
        }
    },

    deletarPedido: async (idPedido) => {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        
        try {
            
            let querySQL = `
                DELETE FROM ItemPedido
                WHERE idPedido = @idPedido
            `
            await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            querySQL = `
                DELETE FROM Pedidos
                WHERE idPedido = @idPedido    
            `
            await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            console.error("ERRO ao deletar pedido:", error);
            throw error;
        }
    }
};

module.exports = { pedidoModel };