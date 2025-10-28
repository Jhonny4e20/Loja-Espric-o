// Importa as dependências para conexão com o banco de dados
// 'sql' contém os tipos de dados e métodos da biblioteca mssql
// 'getConnection' é uma função que cria ou obtém uma conexão ativa com o banco
const { sql, getConnection } = require("../config/db");

// Cria o objeto 'produtoModel', responsável por todas as operações no banco
// referentes à tabela 'Produtos'
const produtoModel = {

    // ==============================
    // BUSCAR TODOS OS PRODUTOS
    // ==============================
    buscarTodos: async () => {
        try {
            // Cria conexão com o banco de dados
            const pool = await getConnection();

            // Define a consulta SQL
            let querySQL = 'SELECT * FROM Produtos';

            // Executa a consulta e guarda o resultado
            const result = await pool.request().query(querySQL);

            // Retorna todos os registros encontrados (array de produtos)
            return result.recordset;

        } catch (error) {
            // Caso ocorra erro, exibe no console e repassa o erro ao controller
            console.error('ERRO ao buscar produtos:', error);
            throw error;
        }
    },

    // ==============================
    // BUSCAR UM PRODUTO PELO ID
    // ==============================
    buscarUm: async (idProduto) => {
        try {
            const pool = await getConnection();

            // Consulta SQL com parâmetro para buscar um produto específico
            const querySQL = 'SELECT * FROM Produtos WHERE idProduto = @idProduto';

            // Executa a consulta, informando o ID como parâmetro
            const result = await pool.request()
                .input('idProduto', sql.UniqueIdentifier, idProduto)
                .query(querySQL);

            // Retorna o produto encontrado (ou array vazio se não existir)
            return result.recordset;

        } catch (error) {
            console.error('ERRO ao buscar o produto:', error);
            throw error;
        }
    },

    // ==============================
    // INSERIR NOVO PRODUTO
    // ==============================
    inserirProduto: async (nomeProduto, precoProduto) => {
        try {
            const pool = await getConnection();

            // Comando SQL com parâmetros para inserir novo produto
            let querySQL = 'INSERT INTO Produtos(nomeProduto, precoProduto) VALUES(@nomeProduto, @precoProduto)';

            // Executa a inserção, protegendo contra SQL Injection com .input()
            await pool.request()
                .input('nomeProduto', sql.VarChar(100), nomeProduto)
                .input('precoProduto', sql.Decimal(10, 2), precoProduto)
                .query(querySQL);

        } catch (error) {
            console.error('ERRO ao inserir produto:', error);
            throw error;
        }
    },

    // ==============================
    // ATUALIZAR PRODUTO EXISTENTE
    // ==============================
    atualizarProduto: async (idProduto, nomeProduto, precoProduto) => {
        try {
            const pool = await getConnection();

            // Atualiza os dados do produto pelo ID
            const querySQL = `
                UPDATE Produtos
                SET nomeProduto = @nomeProduto,
                    precoProduto = @precoProduto
                WHERE idProduto = @idProduto
            `;

            await pool.request()
                .input('idProduto', sql.UniqueIdentifier, idProduto)
                .input('nomeProduto', sql.VarChar(100), nomeProduto)
                .input('precoProduto', sql.Decimal(10, 2), precoProduto)
                .query(querySQL);

        } catch (error) {
            console.error('ERRO ao atualizar produto:', error);
            throw error;
        }
    },

    // ==============================
    // DELETAR PRODUTO PELO ID
    // ==============================
    deletarProduto: async (idProduto) => {
        try {
            const pool = await getConnection();

            // Comando SQL para deletar produto específico
            const querySQL = 'DELETE FROM Produtos WHERE idProduto = @idProduto';

            // Executa a exclusão
            await pool.request()
                .input('idProduto', sql.UniqueIdentifier, idProduto)
                .query(querySQL);

        } catch (error) {
            console.error('ERRO ao deletar produto:', error);
            throw error;
        }
    }
}

// Exporta o model para ser utilizado pelo controller
module.exports = { produtoModel }
