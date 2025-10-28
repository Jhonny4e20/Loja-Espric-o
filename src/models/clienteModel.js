// Importa os objetos 'sql' e 'getConnection' do arquivo de configuração do banco de dados
// 'sql' contém os tipos de dados e métodos do driver SQL Server
// 'getConnection' é uma função que cria e retorna uma conexão com o banco de dados
const { sql, getConnection } = require("../config/db");

// Cria o objeto 'clienteModel', responsável por lidar com o acesso ao banco de dados da tabela 'Clientes'
const clienteModel = {

    // Função assíncrona para buscar todos os clientes cadastrados
    buscarTodos: async () => {
        try {
            // Cria ou obtém uma conexão com o banco
            const pool = await getConnection();

            // Define o comando SQL que será executado
            let querySQL = 'SELECT * FROM Clientes';

            // Executa a consulta no banco de dados
            const result = await pool.request().query(querySQL);

            // Retorna o conjunto de registros obtido (array de objetos)
            return result.recordset;

        } catch (error) {
            // Caso ocorra algum erro na consulta, exibe no console e repassa o erro para o CONTROLLER tratar
            console.error('ERRO ao procurar clientes:', error);
            throw error;
        }
    },

    buscarUm: async (idCliente) => {
        try {
            const pool = await getConnection();

            const querySQL = `SELECT * FROM clientes WHERE idCliente = @idCliente`;

            const result = await pool
                .request()
                .input(`idCliente`, sql.UniqueIdentifier, idCliente)
                .query(querySQL);

            return result.recordset

        } catch (error) {
            console.error(`ERRO ao buscar o cliente:`, error);
            throw error;
        }
    },

   // Função assíncrona para buscar um cliente específico pelo CPF
    buscarCPF: async (cpfCliente) => {
        try {
            // Cria (ou obtém) uma conexão ativa com o banco de dados
            const pool = await getConnection();

            // Define a consulta SQL com parâmetro para evitar SQL Injection
            const querySQL = 'SELECT * FROM clientes WHERE cpfCliente = @cpfCliente;';

            // Monta e executa a requisição SQL
            const result = await pool.request()

                // Define o parâmetro @cpfCliente como um CHAR(14)
                // O uso de .input() ajuda a proteger contra injeção de código SQL
                .input('cpfCliente', sql.Char(14), cpfCliente)

                // Executa a consulta no banco
                .query(querySQL);

            // Retorna o resultado da consulta (array com o(s) cliente(s) encontrado(s))
            return result.recordset;

        } catch (error) {
            // Caso ocorra qualquer erro na consulta, exibe no console e repassa o erro
            console.error('ERRO ao buscar clientes:', error);
            throw error; // Passa o erro para o CONTROLLER tratar (quem chamou a função)
        }
    },


    // Função assíncrona para inserir um novo cliente no banco de dados
    inserirCliente: async (nomeCliente, cpfCliente) => {
        try {
            // Cria ou obtém uma conexão com o banco
            const pool = await getConnection();

            // Define o comando SQL com parâmetros (para evitar SQL Injection)
            let querySQL = 'INSERT INTO Clientes(nomeCliente, cpfCliente) VALUES(@nomeCliente, @cpfCliente)';

            // Cria a requisição, insere os parâmetros e executa a query
            await pool.request()
                .input('nomeCliente', sql.VarChar(100), nomeCliente) // Define o parâmetro @nomeCliente
                .input('cpfCliente', sql.VarChar(13), cpfCliente)    // Define o parâmetro @cpfCliente
                .query(querySQL); // Executa a inserção

        } catch (error) {
            // Caso ocorra algum erro ao inserir, exibe no console e repassa o erro
            console.error('ERRO ao inserir cliente:', error);
            throw error;
        }
    }
}

// Exporta o objeto 'clienteModel' para que ele possa ser usado no controller
module.exports = { clienteModel }
