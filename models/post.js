const mysql = require('mysql');
const db = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

const getTickers = () => {
    
    let select = `SELECT chave,
                         titulo
                    FROM post
                   ORDER BY chave DESC
                   LIMIT 5;`;

    return new Promise((resolve, reject) => {
        db.query({
            sql: select,
            timeout: 10000,
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar os últimos tickers ' + error.message);
            }

            resolve(results);
        })
    })
}

module.exports = {
    getTickers
};