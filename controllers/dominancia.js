const modelDominancia = require('../models/dominancia');

const CoinGecko       = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const dominanciaRecente = () => {
    return new Promise((resolve, reject) => {
        modelDominancia.getDadosDominancia().then((resultado) => {
            resolve(resultado);
        });
    });
}

/**
 * Realiza uma requisição para a API externa do Coingecko para receber
 * dados sobre dominancia atualizados
 */
const atualizarDominancia = async () => {
    let response = await CoinGeckoClient.global();

    if (response.success && response.code === 200) {
        let dadosDominancia = trataRespostaDominancia(response.data.data);
        modelDominancia.insereDominanciaBanco(dadosDominancia);

        console.log('✔ Dominância atualizada com sucesso!', new Date().toLocaleString());
    }
}

/**
 * Trata os dados recebidos para posteriormente inclusão no banco
 */
const trataRespostaDominancia = (resposta) => {
    return [
        new Date().toISOString(),
        resposta['market_cap_percentage'].btc.toFixed(3),
        resposta['market_cap_percentage'].eth.toFixed(3),
        resposta['total_market_cap'].usd.toFixed(2),
        resposta['total_volume'].usd.toFixed(2),
        resposta['market_cap_change_percentage_24h_usd'].toFixed(3)
    ]
}

module.exports = {
    dominanciaRecente,
    atualizarDominancia
}