const mysql = require('mysql');
const db = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

const insereDominanciaBanco = (toInsert) => {

    let insertInto = `INSERT INTO dominancia(data, domin_percent_bitcoin, domin_percent_ethereum, cap_total_crypto, volume_negociado_24h, variacao_cap_percent_24h)
                                     VALUES ?;`;

    db.query({
        sql: insertInto,
        timeout: 10000,
        values: [[toInsert]]
    }, function (error, result, fields) {
        if (error) {
            console.log('❌ Erro ao atualizar dados de dominância: ' + error.message);
        }

        return true;
    });
}

const getDadosDominancia = () => {
    let selectLastDominancia = `SELECT *
                                  FROM dominancia
                                 WHERE data = (SELECT MAX(data)
                                                 FROM dominancia dominancia_ss)`;

    return new Promise((resolve, reject) => {
        db.query({
            sql: selectLastDominancia,
            timeout: 10000
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar os dados de dominância ' + error.message);
            }

            resolve(results[0]);
        })
    })
}

module.exports = {
    insereDominanciaBanco,
    getDadosDominancia
}