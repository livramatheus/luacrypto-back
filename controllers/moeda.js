const modelMoeda = require('../models/moeda');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

/**
 * Realiza uma requisição para a API externa do Coingecko para receber
 * a cotação atualizada de todas as moedas disponíveis.
 * Esse método é chamado pelo agendamento
 */
const atualizarCotacoesMoeda = async () => {
    let response = await CoinGeckoClient.simple.price({
        ids: modelMoeda.getMoedasAtivas(),
        vs_currencies: ['usd'],
        include_24hr_vol: true,
        include_market_cap: true
    });

    let cotacoes = trataRespostaParaAtualizacao(response.data);

    modelMoeda.insereCotacaoBanco(cotacoes)
    console.log('✔ Cotação das moedas atualizada com sucesso!', new Date().toLocaleString());
}

/**
 * Realiza uma requisição para a API externa do Coingecko para receber
 * os dados atualizados de mercado das criptomoedas
 * Esse método é chamado pelo agendamento
 */
const atualizarDadosMercadoMoeda = async () => {
    let response = await CoinGeckoClient.coins.markets({
        ids: modelMoeda.getMoedasAtivas(),
        vs_currencies: ['usd'],
        per_page: 250,
        sparkline: false
    });

    modelMoeda.insereDadosMercadoMoeda(trataRespostaDadosMercadoMoeda(response.data));
    console.log('✔ Dados de mercado da moeda atualizados com sucesso!', new Date().toLocaleString());
}

const trataRespostaParaAtualizacao = (resposta) => {
    let dados = [];
    let dataAtual = new Date().toISOString();

    for (moeda in resposta) {
        dados.push(
                [
                    moeda,
                    dataAtual,
                    resposta[moeda].usd,
                    resposta[moeda].usd_market_cap,
                    resposta[moeda].usd_24h_vol
                ]
                );
    }

    return dados;
}

const trataRespostaDadosMercadoMoeda = (resposta) => {
    let dados = [];
    let dataAtual = new Date().toISOString();

    for (moeda in resposta) {
        dados.push(
                [
                    resposta[moeda].id,
                    dataAtual,
                    resposta[moeda].total_supply,
                    resposta[moeda].max_supply,
                    resposta[moeda].circulating_supply
                ]
                );
    }

    return dados;
}

const getCotacaoDiaria = (chave) => {
    return new Promise((resolve, reject) => {
        modelMoeda.getCotacaoDiaria(chave).then((resultado) => {
            resolve(resultado);
        });
    })
}

const getCotacaoSemanal = (chave) => {
    return new Promise((resolve, reject) => {
        modelMoeda.getCotacaoSemanal(chave).then((resultado) => {
            resolve(resultado);
        });
    })
}

const getCotacaoMensal = (chave) => {
    return new Promise((resolve, reject) => {
        modelMoeda.getCotacaoMensal(chave).then((resultado) => {
            resolve(resultado);
        });
    })
}

const getCotacaoAnual = (chave) => {
    return new Promise((resolve, reject) => {
        modelMoeda.getCotacaoAnual(chave).then((resultado) => {
            resolve(resultado);
        });
    })
}

const getUltimaCotacaoBanco = (chave) => {
    return new Promise((resolve, reject) => {
        modelMoeda.getUltimaCotacaoBanco(chave).then((resultado) => {
            resolve(resultado);
        });
    })
}

const getUltimaCotacaoBancoReduzida = (simbolos) => {
    return new Promise((resolve, reject) => {
        modelMoeda.getUltimaCotacaoBancoReduzida(simbolos).then((resultado) => {
            resolve(resultado);
        });
    })
}

const pesquisarMoeda = (simbolos) => {
    return new Promise((resolve, reject) => {
        modelMoeda.pesquisarMoeda(simbolos).then((resultado) => {
            resolve(resultado);
        });
    })
}

module.exports = {
    atualizarCotacoesMoeda,
    atualizarDadosMercadoMoeda,
    getCotacaoDiaria,
    getCotacaoSemanal,
    getCotacaoMensal,
    getCotacaoAnual,
    getUltimaCotacaoBanco,
    getUltimaCotacaoBancoReduzida,
    pesquisarMoeda
}