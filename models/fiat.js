const mysql = require('mysql');
const db = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

const getFiatsAtivas = () => {
    return ['BRL', 'USD', 'EUR'];
}

const insereCotacaoBanco = (toInsert) => {
    let insertInto = `INSERT INTO cotacao_fiat(fiat, data_hora, valor)
                                        VALUES ?;`;

    db.query({
        sql: insertInto,
        timeout: 10000,
        values: [toInsert]
    }, function (error, result, fields) {
        if (error) {
            console.log('❌ Erro ao inserir cotação de uma fiat ' + error.message);
        }
    });
}

const getUltimaCotacaoBancoTodas = () => {
    let selectLastCotacao = `SELECT chave,
                                    nome,
                                    data_hora,
                                    valor 
                                FROM fiat
                                JOIN cotacao_fiat ON
                                    fiat.chave = cotacao_fiat.fiat
                                AND cotacao_fiat.data_hora = (SELECT MAX(ss_cotacao_fiat.data_hora)
                                                                FROM cotacao_fiat ss_cotacao_fiat
                                                            WHERE cotacao_fiat.fiat = ss_cotacao_fiat.fiat)
                              ORDER BY chave;`;

    return new Promise((resolve, reject) => {
        db.query({
            sql: selectLastCotacao,
            timeout: 10000,
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar todas últimas cotações de fiats ' + error.message);
            }

            resolve(results);
        })
    })
}

const getUltimaCotacaoBanco = (simbolo) => {
    let selectLastCotacao = `SELECT chave,
                                    nome,
                                    data_hora,
                                    valor 
                               FROM fiat
                               JOIN cotacao_fiat ON
                                    fiat.chave = cotacao_fiat.fiat
                              WHERE fiat.chave = ?
                                AND cotacao_fiat.data_hora = (SELECT MAX(ss_cotacao_fiat.data_hora)
                                                                FROM cotacao_fiat ss_cotacao_fiat
                                                               WHERE cotacao_fiat.fiat = ss_cotacao_fiat.fiat)
                              LIMIT 1;`;

    return new Promise((resolve, reject) => {
        db.query({
            sql: selectLastCotacao,
            timeout: 10000,
            values: simbolo
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao pegar a cotação de uma fiat ' + error.message);
            }

            resolve(results[0]);
        })
    })
}

const pesquisarFiat = () => {

    let select = 'SELECT * FROM fiat;';

    return new Promise((resolve, reject) => {
        db.query({
            sql: select,
            timeout: 10000
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao pesquisar uma fiat ' + error.message);
            }

            resolve(results);
        })
    })

}

module.exports = {
    insereCotacaoBanco,
    getUltimaCotacaoBanco,
    pesquisarFiat,
    getUltimaCotacaoBancoTodas,
    getFiatsAtivas
};