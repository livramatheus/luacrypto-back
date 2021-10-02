const mysql = require('mysql');
const db = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

const getEtfsAtivas = () => {
    return ['HASH11', 'QBTC11'];
}

function getUltimaCotacaoBancoReduzidaEtf() {
    let selectLastCotacao = `SELECT etf.simbolo,
                                    etf.nome,
                                    cotacao_etf.abertura,
                                    cotacao_etf.alta,
                                    cotacao_etf.baixa,
                                    cotacao_etf.preco_atual,
                                    cotacao_etf.volume_24h
                               FROM etf
                               JOIN cotacao_etf ON
                                    etf.simbolo = cotacao_etf.simbolo
                              WHERE cotacao_etf.data_hora = (SELECT MAX(cotacao_etf_subselect.data_hora)
                                                               FROM cotacao_etf cotacao_etf_subselect
                                                              WHERE etf.simbolo = cotacao_etf_subselect.simbolo)
                              LIMIT 2;`;

    return new Promise((resolve, reject) => {
        db.query({
            sql: selectLastCotacao,
            timeout: 10000
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao pegar a cotação reduzida do etf ' + error.message);
            }

            resolve(results);
        })
    })
}

function getCotacaoDiaria(chave) {
    let select = `SELECT data_hora,
                         preco_atual
                    FROM cotacao_etf
                   WHERE simbolo = ?
                     AND data_hora > (NOW() - INTERVAL 1 DAY)
                   GROUP BY sec_to_time(time_to_sec(data_hora) - time_to_sec(data_hora) %(5 * 60))
                   ORDER BY data_hora ASC;`;

    let params = chave.toUpperCase();

    return new Promise((resolve, reject) => {
        db.query({
            sql: select,
            timeout: 10000,
            values: params
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar a cotação diária de uma etf ' + error.message);
            }

            resolve(results);
        })
    })
}

function getCotacaoSemanal(simbolo) {
    let select = getCotacaoIntervalo(7);

    let params = simbolo.toUpperCase();

    return new Promise((resolve, reject) => {
        db.query({
            sql: select,
            timeout: 10000,
            values: [params, params]
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar a cotação semanal do ETF ' + error.message);
            }

            resolve(results);
        })
    })
}

function getCotacaoMensal(simbolo) {
    let select = getCotacaoIntervalo(30);

    let params = simbolo.toUpperCase();

    return new Promise((resolve, reject) => {
        db.query({
            sql: select,
            timeout: 10000,
            values: [params, params]
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar a cotação mensal do ETF ' + error.message);
            }

            resolve(results);
        })
    })
}

function getCotacaoAnual(simbolo) {
    let select = getCotacaoIntervalo(365);

    let params = simbolo.toUpperCase();

    return new Promise((resolve, reject) => {
        db.query({
            sql: select,
            timeout: 10000,
            values: [params, params]
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar a cotação anual do ETF ' + error.message);
            }

            resolve(results);
        })
    })
}

function getUltimaCotacaoBancoEtf(simbolo) {
    let selectLastCotacao = `SELECT
    *,
    (
        (
            (
                cotacao_etf.preco_atual - (
                    SELECT
                        x.preco_atual
                    FROM
                        cotacao_etf x
                    WHERE
                        cotacao_etf.simbolo = x.simbolo
                        AND x.data_hora = (
                            SELECT
                                MAX(cotacao_etf.data_hora)
                            FROM
                                cotacao_etf
                            WHERE
                                DATE(cotacao_etf.data_hora) = (
                                    SELECT
                                        CURRENT_DATE - INTERVAL 1 DAY
                                )
                        )
                )
            ) / cotacao_etf.preco_atual
        ) * 100
    ) as variacao_24h,
    (
        (
            (
                cotacao_etf.preco_atual - (
                    SELECT
                        x.preco_atual
                    FROM
                        cotacao_etf x
                    WHERE
                        cotacao_etf.simbolo = x.simbolo
                        AND x.data_hora = (
                            SELECT
                                MAX(cotacao_etf.data_hora)
                            FROM
                                cotacao_etf
                            WHERE
                                DATE(cotacao_etf.data_hora) = (
                                    SELECT
                                        CURRENT_DATE - INTERVAL 7 DAY
                                )
                        )
                )
            ) / cotacao_etf.preco_atual
        ) * 100
    ) as variacao_7d,
    (
        (
            (
                cotacao_etf.preco_atual - (
                    SELECT
                        x.preco_atual
                    FROM
                        cotacao_etf x
                    WHERE
                        cotacao_etf.simbolo = x.simbolo
                        AND x.data_hora = (
                            SELECT
                                MAX(cotacao_etf.data_hora)
                            FROM
                                cotacao_etf
                            WHERE
                                DATE(cotacao_etf.data_hora) = (
                                    SELECT
                                        CURRENT_DATE - INTERVAL 30 DAY
                                )
                        )
                )
            ) / cotacao_etf.preco_atual
        ) * 100
    ) as variacao_30d
FROM
    etf
    JOIN cotacao_etf ON etf.simbolo = cotacao_etf.simbolo
WHERE
    cotacao_etf.data_hora = (
        SELECT
            MAX(data_hora)
        FROM
            cotacao_etf cotacao_etf_subselect
        WHERE
            cotacao_etf.simbolo = cotacao_etf_subselect.simbolo
    )
    AND etf.simbolo = ?;`;

    let params = simbolo.toUpperCase();

    return new Promise((resolve, reject) => {
        db.query({
            sql: selectLastCotacao,
            timeout: 10000,
            values: params
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar dados do ETF ' + error.message);
            }

            resolve(results[0]);
        })
    })
}

function insereCotacaoBancoEtf(toInsert) {
    let insertInto = `INSERT INTO cotacao_etf (simbolo, data_hora, abertura, alta, baixa, preco_atual, volume_24h)
                           VALUES ?;`;

    db.query({
        sql: insertInto,
        timeout: 10000,
        values: [toInsert]
    }, function (error, result, fields) {
        if (error) {
            console.log('❌ Erro ao inserir nova cotação de ETF ' + error.message);
        }

        return true;
    });
}

const getCotacaoIntervalo = (dias) => {
    return `SELECT cotacao_etf.data_hora,
                   cotacao_etf.preco_atual,
                   cotacao_etf.simbolo
              FROM cotacao_etf
             WHERE cotacao_etf.data_hora IN (SELECT *
                                               FROM (SELECT MAX(cotacao_etf.data_hora)
                                                       FROM cotacao_etf
                                                      WHERE cotacao_etf.simbolo = ?
                                                      GROUP BY DATE(cotacao_etf.data_hora)              
                                                      ORDER BY cotacao_etf.data_hora DESC
                                                      LIMIT ${dias}) TEMP_TAB)
                AND cotacao_etf.simbolo = ?
              ORDER BY data_hora ASC;`;
                
}

module.exports = {
    getEtfsAtivas,
    getUltimaCotacaoBancoReduzidaEtf,
    insereCotacaoBancoEtf,
    getUltimaCotacaoBancoEtf,
    getCotacaoDiaria,
    getCotacaoSemanal,
    getCotacaoMensal,
    getCotacaoAnual
};