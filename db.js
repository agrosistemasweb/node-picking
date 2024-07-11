const mssql = require('mssql');

const dbConfig = {
    server: process.env.DB_PUESTOLOB_SERVER,
    database: process.env.DB_PUESTOLOB_DATABASE,
    user: process.env.DB_PUESTOLOB_USER,
    password: process.env.DB_PUESTOLOB_PASSWORD,
    port: Number(process.env.DB_PUESTOLOB_PORT),
    options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
    },
};

const getConnection = async () => {
    try {
        const pool = await mssql.connect(dbConfig);
        return pool;
    } catch (error) {
        console.error('Database Connection Failed', error);
        throw error;
    }
};

module.exports = { getConnection };