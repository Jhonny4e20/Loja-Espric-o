// Importa o pacote 'mssql', responsável por permitir a conexão com o banco SQL Server
const sql = require("mssql");

// Objeto de configuração da conexão com o banco de dados
const config = {
    user: 'sa',                // Usuário do banco (no caso, o administrador padrão "sa")
    password: '123456789',     // Senha do usuário
    server: 'localhost',       // Endereço do servidor do banco (aqui, local)
    database: 'lojaDB',        // Nome do banco de dados que será utilizado

    // Opções adicionais de segurança e compatibilidade
    options: {
        encrypt: true,               // Habilita criptografia (requerido em conexões seguras)
        trustServerCertificate: true // Permite certificados locais (útil em ambiente de desenvolvimento)
    }
}

// Função assíncrona responsável por criar e retornar uma conexão com o banco de dados
async function getConnection() {
    try {
        // Conecta ao banco de dados utilizando as configurações acima
        const pool = await sql.connect(config);

        // Retorna o objeto de conexão (pool), que será usado para executar queries
        return pool;

    } catch (error) {
        // Caso haja erro na conexão, exibe o erro no console
        console.error('ERRO na conexão do SQL Server:', error);
    }
}

// Exporta o objeto 'sql' (para usar tipos de dados, como sql.VarChar)
// e a função 'getConnection' (para criar conexões com o banco)
module.exports = { sql, getConnection };

