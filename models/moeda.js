const db = require("../config/db");

const getMoedasAtivas = () => {
    return ["0x", "1inch", "aave", "algorand", "alpha-finance", "amp-token", "ankr", "aragon", "ardor", "arweave", "audius", "augur", "avalanche-2", "axie-infinity", "badger-dao", "bakerytoken", "balancer", "bancor", "band-protocol", "basic-attention-token", "binancecoin", "bitcoin", "bitcoin-bep2", "bitcoin-cash", "bitcoin-cash-sv", "bitcoin-diamond", "bitcoin-gold", "bitshares", "bittorrent-2", "blockstack", "bora", "btc-standard-hashrate-token", "cardano", "cartesi", "celer-network", "celo", "celsius-degree-token", "chainlink", "chiliz", "civic", "compound-governance-token", "conflux-token", "constellation-labs", "cosmos", "coti", "crypto-com-chain", "curve-dao-token", "dash", "decentraland", "decred", "dent", "digibyte", "dodo", "dogecoin", "elrond-erd-2", "energy-web-token", "enjincoin", "eos", "ergo", "ethereum", "ethereum-classic", "ethos", "fantom", "fetch-ai", "filecoin", "flow", "ftx-token", "funfair", "gatechain-token", "gemini-dollar", "gnosis", "golem", "harmony", "havven", "hedera-hashgraph", "helium", "hive", "holotoken", "huobi-token", "husd", "icon", "iexec-rlc", "injective-protocol", "internet-computer", "iostoken", "iota", "iotex", "kava", "kin", "klay-token", "kucoin-shares", "kusama", "leo-token", "lisk", "litecoin", "livepeer", "loopring", "maidsafecoin", "maker", "mass-vehicle-ledger", "matic-network", "mdex", "medibloc", "metal", "mina-protocol", "monero", "my-neighbor-alice", "nano", "near", "nem", "neo", "nervos-network", "nexo", "nkn", "nucypher", "numeraire", "ocean-protocol", "okb", "omisego", "ong", "ontology", "orbs", "orchid-protocol", "origin-protocol", "pancakeswap-token", "pax-gold", "perpetual-protocol", "pha", "polkadot", "polymath", "prometeus", "qtum", "quant-network", "ravencoin", "reef-finance", "renbtc", "republic-protocol", "request-network", "reserve-rights-token", "revain", "rif-token", "ripple", "serum", "shiba-inu", "singularitynet", "skale", "smooth-love-potion", "solana", "status", "steem", "stellar", "storj", "storm", "stratis", "strike", "sushi", "swipe", "swissborg", "telcoin", "terra-luna", "tezos", "the-graph", "the-sandbox", "theta-fuel", "theta-token", "thorchain", "tomochain", "tron", "ultra", "uma", "unibright", "uniswap", "uquid-coin", "utrust", "vechain", "venus", "verge", "vethor-token", "waves", "wax", "wazirx", "wink", "wrapped-bitcoin", "xdce-crowd-sale", "yearn-finance", "zcash", "zencash", "zilliqa", "binance-usd", "dai", "fei-protocol", "neutrino", "paxos-standard", "terrausd", "tether", "true-usd", "usd-coin"];
}

const insereDadosMercadoMoeda = (toInsert) => {
    let insertInto = `INSERT INTO mercado_moeda(moeda, dia, fornecimento_total, fornecimento_maximo, fornecimento_circulante)
                           VALUES ?`;

    db.query({
        sql: insertInto,
        timeout: 10000,
        values: [toInsert]
    }, function (error, result, fields) {
        if (error) {
            console.log('❌ Erro ao cadastrar dados de mercado de uma moeda ' + error.message);
        }
    });

}

/**
 * Cadastra uma nova moeda na base de dados
 * @param {object} moeda 
 */
function cadastrarMoeda(moeda) {
    let insertInto = `INSERT INTO moeda (simbolo, nome, vende_binance, website, subreddit, ativo)
                                 VALUES (?, ?, ?, ?, ?, ?);`;

    let params = [
        moeda.symbol,
        moeda.name,
        1,
        moeda.urls.website[0],
        moeda.subreddit
    ];

    db.query({
        sql: insertInto,
        values: params
    }, function (error, result, fields) {
        if (error) {
            console.log('❌ Erro ao cadastrar uma moeda ' + error.message)
        }

        console.log(`❌ Moeda ${moeda.name} cadastrada com sucesso`)
    });

}

/**
 * Faz uma seleção de todas as moedas no banco, retornando
 * seu símbolo e seu nome. Esta função é utilizada para popular
 * os campos de pesquisa no front-end
 * @returns Promise
 */
function pesquisarMoeda() {
    let select = `SELECT moeda.chave,
                         moeda.simbolo,
                         moeda.nome
                    FROM moeda
                    JOIN cotacao_moeda ON
                         moeda.chave = cotacao_moeda.moeda
                   WHERE moeda.ativo = true
                   GROUP BY moeda.chave 
                   ORDER BY cotacao_moeda.capitalizacao;`;

    return new Promise((resolve, reject) => {
        db.query({
            sql: select
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao buscar dados básicos de todas moedas ' + error.message)
            }

            resolve(results);
        });
    });
}

function insereCotacaoBanco(toInsert) {
    let insertInto = `INSERT INTO cotacao_moeda(moeda, data_hora, preco_atual, capitalizacao, volume_24h)
                                   VALUES ?;`;

    db.query({
        sql: insertInto,
        timeout: 10000,
        values: [toInsert]
    }, function (error, result, fields) {
        if (error) {
            console.log('❌ Erro ao inserir uma nova cotação de moeda no banco ' + error.message);
        }
    });
}

function getUltimaCotacaoBanco(simbolo) {
    let selectLastCotacao = `SELECT
                                moeda.chave,
                                moeda.simbolo,
                                moeda.nome,
                                moeda.categoria,
                                moeda.vende_binance,
                                moeda.info,
                                moeda.website,
                                moeda.subreddit,
                                cotacao_moeda.data_hora,
                                cotacao_moeda.preco_atual,
                                cotacao_moeda.capitalizacao,
                                cotacao_moeda.volume_24h,
                                mercado_moeda.fornecimento_total,
                                mercado_moeda.fornecimento_maximo,
                                mercado_moeda.fornecimento_circulante,
                                (
                                (
                                    (
                                    cotacao_moeda.preco_atual - (
                                        SELECT
                                        x.preco_atual
                                        FROM
                                        cotacao_moeda x
                                        WHERE
                                        cotacao_moeda.moeda = x.moeda
                                        AND x.data_hora = (
                                            SELECT
                                            MAX(y.data_hora)
                                            FROM
                                            cotacao_moeda y
                                            WHERE
                                            y.data_hora <= (
                                                SELECT
                                                DATE_SUB(NOW(), INTERVAL 24 HOUR)
                                            )
                                            AND y.moeda = x.moeda
                                        )
                                    )
                                    ) / cotacao_moeda.preco_atual
                                ) * 100
                                ) as variacao_24h,
                                (
                                (
                                    (
                                    cotacao_moeda.preco_atual - (
                                        SELECT
                                        x.preco_atual
                                        FROM
                                        cotacao_moeda x
                                        WHERE
                                        cotacao_moeda.moeda = x.moeda
                                        AND x.data_hora = (
                                            SELECT
                                            MAX(y.data_hora)
                                            FROM
                                            cotacao_moeda y
                                            WHERE
                                            DATE(y.data_hora) = (
                                                SELECT
                                                CURRENT_DATE - INTERVAL 7 DAY
                                            )
                                            AND y.moeda = x.moeda
                                        )
                                    )
                                    ) / cotacao_moeda.preco_atual
                                ) * 100
                                ) as variacao_7d,
                                (
                                (
                                    (
                                    cotacao_moeda.preco_atual - (
                                        SELECT
                                        x.preco_atual
                                        FROM
                                        cotacao_moeda x
                                        WHERE
                                        cotacao_moeda.moeda = x.moeda
                                        AND x.data_hora = (
                                            SELECT
                                            MAX(y.data_hora)
                                            FROM
                                            cotacao_moeda y
                                            WHERE
                                            DATE(y.data_hora) = (
                                                SELECT
                                                CURRENT_DATE - INTERVAL 30 DAY
                                            )
                                                AND y.moeda = x.moeda
                                        )
                                    )
                                    ) / cotacao_moeda.preco_atual
                                ) * 100
                                ) as variacao_30d
                            FROM
                                moeda
                                JOIN cotacao_moeda ON moeda.chave = cotacao_moeda.moeda
                                JOIN mercado_moeda ON moeda.chave = mercado_moeda.moeda
                            WHERE
                                cotacao_moeda.data_hora = (
                                SELECT
                                    MAX(data_hora)
                                FROM
                                    cotacao_moeda cotacao_moeda_ss
                                WHERE
                                    cotacao_moeda.moeda = cotacao_moeda_ss.moeda
                                )
                                AND moeda.ativo = true
                                AND moeda.chave = ?
                                AND mercado_moeda.dia = (
                                SELECT
                                    MAX(dia)
                                FROM
                                    mercado_moeda mercado_moeda_ss
                                WHERE
                                    mercado_moeda_ss.moeda = moeda.chave
                                );`;

    let params = simbolo.toUpperCase();

    return new Promise((resolve, reject) => {
        db.query({
            sql: selectLastCotacao,
            timeout: 10000,
            values: params
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar todos os dados de uma moeda ' + error.message);
            }

            resolve(results[0]);
        })
    })
}

function getMoedasDestaque() {
    let selectDestaque = `SELECT
                                moeda.chave,
                                moeda.simbolo,
                                moeda.nome,
                                cotacao_moeda.preco_atual,
                                (
                                (
                                    (
                                    cotacao_moeda.preco_atual - (
                                        SELECT
                                        x.preco_atual
                                        FROM
                                        cotacao_moeda x
                                        WHERE
                                        cotacao_moeda.moeda = x.moeda
                                        AND x.data_hora = (
                                            SELECT
                                            MAX(y.data_hora)
                                            FROM
                                            cotacao_moeda y
                                            WHERE
                                            DATE(y.data_hora) = (
                                                SELECT
                                                CURRENT_DATE - INTERVAL 1 DAY
                                            )
                                            AND x.moeda = y.moeda
                                        )
                                    )
                                    ) / cotacao_moeda.preco_atual
                                ) * 100
                                ) as variacao_24h
                            FROM
                                moeda
                                JOIN cotacao_moeda ON moeda.chave = cotacao_moeda.moeda
                            WHERE
                                cotacao_moeda.data_hora = (
                                SELECT
                                    MAX(ss_cotacao_moeda.data_hora)
                                FROM
                                    cotacao_moeda ss_cotacao_moeda
                                )
                                AND moeda.ativo = true
                                ORDER BY variacao_24h DESC
                            LIMIT
                                5;`;

    return new Promise((resolve, reject) => {
        db.query({
            sql: selectDestaque,
            timeout: 10000
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar as moedas em destaque ' + error.message);
            }

            resolve(results);
        })
    })
}

function getUltimaCotacaoBancoReduzida(simbolos) {
    let selectLastCotacao = `SELECT
                                    moeda.chave,
                                    moeda.simbolo,
                                    moeda.nome,
                                    cotacao_moeda.preco_atual,
                                    (
                                    (
                                        (
                                        cotacao_moeda.preco_atual - (
                                            SELECT
                                            x.preco_atual
                                            FROM
                                            cotacao_moeda x
                                            WHERE
                                            cotacao_moeda.moeda = x.moeda
                                            AND x.data_hora = (
                                                SELECT
                                                MAX(y.data_hora)
                                                FROM
                                                cotacao_moeda y
                                                WHERE
                                                DATE(y.data_hora) = (
                                                    SELECT
                                                    CURRENT_DATE - INTERVAL 1 DAY
                                                )
                                                AND x.moeda = y.moeda
                                            )
                                        )
                                        ) / cotacao_moeda.preco_atual
                                    ) * 100
                                    ) as variacao_24h
                                FROM
                                    moeda
                                    JOIN cotacao_moeda ON moeda.chave = cotacao_moeda.moeda
                                WHERE
                                    moeda.chave IN (?)
                                    AND cotacao_moeda.data_hora = (
                                    SELECT
                                        MAX(ss_cotacao_moeda.data_hora)
                                    FROM
                                        cotacao_moeda ss_cotacao_moeda
                                    )
                                    AND moeda.ativo = true
                                LIMIT
                                    9;`;

    let params = simbolos;

    return new Promise((resolve, reject) => {
        db.query({
            sql: selectLastCotacao,
            timeout: 10000,
            values: [params]
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar a cotação reduzida de uma moeda ' + error.message);
            }

            resolve(results);
        })
    })
}

function getCotacaoIntervalo(dias) {
    return `SELECT
                cotacao_moeda.data_hora,
                cotacao_moeda.preco_atual
            FROM
                cotacao_moeda
            WHERE
                cotacao_moeda.data_hora IN (
                SELECT
                    *
                FROM
                    (
                    SELECT
                        MAX(cotacao_moeda_ss.data_hora)
                    FROM
                        cotacao_moeda cotacao_moeda_ss
                    WHERE
                        cotacao_moeda_ss.moeda = ?
                    GROUP BY
                        DATE(cotacao_moeda_ss.data_hora)
                    ORDER BY
                        1 DESC
                    LIMIT
                        ${dias}
                    ) TEMP_TABLE
                )
                AND cotacao_moeda.moeda = ?
                ORDER BY
                    1 ASC;`;
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
                console.log('❌ Erro ao resgatar a cotação semanal de uma moeda ' + error.message);
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
                console.log('❌ Erro ao resgatar a cotação mensal de uma moeda ' + error.message);
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
                console.log('❌ Erro ao resgatar a cotação anual de uma moeda ' + error.message);
            }

            resolve(results);
        })
    })
}

function getCotacaoDiaria(chave) {
    let select = `SELECT data_hora,
                         preco_atual
                    FROM cotacao_moeda
                   WHERE moeda = ?
                     AND data_hora > (NOW() - INTERVAL 1 DAY)
                GROUP BY sec_to_time(time_to_sec(data_hora) - time_to_sec(data_hora) %(5 * 60))
                ORDER BY data_hora ASC;`;

    let params = chave.toLowerCase();

    return new Promise((resolve, reject) => {
        db.query({
            sql: select,
            timeout: 10000,
            values: params
        }, function (error, results, fields) {
            if (error) {
                console.log('❌ Erro ao resgatar a cotação diária de uma moeda ' + error.message);
            }

            resolve(results);
        })
    })

}

module.exports = {
    insereCotacaoBanco,
    getUltimaCotacaoBanco,
    getCotacaoAnual,
    getCotacaoMensal,
    getCotacaoSemanal,
    getCotacaoDiaria,
    getUltimaCotacaoBancoReduzida,
    cadastrarMoeda,
    pesquisarMoeda,
    insereDadosMercadoMoeda,
    getMoedasAtivas,
    getMoedasDestaque
};