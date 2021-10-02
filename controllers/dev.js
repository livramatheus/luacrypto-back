const axios = require('axios');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const modelEtf          = require('../models/etf');
const modelMedoGanancia = require('../models/medoganancia');
const modelMoeda        = require('../models/moeda');

/////////////////////// ETF

/**
 * Trata os dados antes de inserí-los no banco
 */
const trataDadosAnterioresEtf = (resposta, simbolo) => {
    let dados = [];

    for (dia in resposta) {
        dados.push(
            [
                simbolo,
                new Date(dia + 'T17:00:00').toISOString(),
                resposta[dia]['1. open'],
                resposta[dia]['2. high'],
                resposta[dia]['3. low'],
                resposta[dia]['4. close'],
                resposta[dia]['5. volume']
            ]
        );
    }

    return dados;
}

/**
 * Busca cotações anteriores de uma etf para cadastrá-las na base
 */
const buscaDadosAnterioresEtf = (etf) => {
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${etf}.SA&interval=5min&apikey=${process.env.API_ALPHA}`;

    rp(url).then(response => {
        let cotacoes = JSON.parse(response)['Time Series (Daily)'];
        modelEtf.insereCotacaoBancoEtf(trataDadosAnterioresEtf(cotacoes, etf));
    })
}

/////////////////////// MEDO E GANÂNCIA

/**
 * Busca dados na API externa
 */
 const buscaDadosAnterioresMedoGanancia = () => {
    try {
        return axios.get("https://api.alternative.me/fng/?limit=600");
    } catch (error) {
        console.log(error.message);
    }
};

/**
 * Busca cotações anteriores de medo e ganância para cadastrá-las na base
 */
const cadastraDadosAnterioresMedoGanancia = () => {
    buscaDadosAnterioresMedoGanancia().then((resposta) => {
        if (resposta.data.data) {
            modelMedoGanancia.insereMedoGananciaBanco(trataDadosAnterioresMedoGanancia(resposta.data.data));
        }
    }).catch((erro) => {
        console.log(erro.message);
    });
}

/**
 * Trata os dados antes de inserí-los no banco
 */
const trataDadosAnterioresMedoGanancia = (dados) => {
    let tratados = dados.map((elemento) => {
        return [new Date(elemento.timestamp * 1000).toISOString(), elemento.value, null];
    });

    return tratados;
};

/////////////////////// MOEDA
/**
 * Esta função irá cadastrar os dados do último ano de uma moeda a cada dois segundos
 * para não estourar as requisições da API
 */
const inicializaAtualizacaoUltimoAnoMoeda = () => {
    var delayInMilliseconds = 2000;

    modelMoeda.getMoedasAtivas().forEach((chave, index) => {
        setTimeout(function () {
            atualizaUltimoAnoMoeda(chave);
        }, delayInMilliseconds * (index + 1));
    });

    console.log('✔ TAREFA CONCLUÍDA COM SUCESSO!')
}

/**
 * Trata e insere as cotações do último ano de uma moeda
 */
 const atualizaUltimoAnoMoeda = async (moeda) => {
    let ontem = new Date();
    let anoPassado = new Date();

    anoPassado.setDate(anoPassado.getDate() - 365);
    ontem.setDate(ontem.getDate() - 1);

    let timeAtual      = ontem.getTime() / 1000;
    let timeAnoPassado = anoPassado.getTime() / 1000;

    let response = await CoinGeckoClient.coins.fetchMarketChartRange(moeda, {
        from: timeAnoPassado,
        to: timeAtual
    });

    let dadosTratados = trataRespostaUltimoAnoMoeda(response.data, moeda);
    
    modelMoeda.insereCotacaoBanco(dadosTratados)
    console.log(`✔ Dados anuais de ${moeda} atualizados com sucesso!`);
}

/**
 * Este método é chamado para tratar a resposta dos dados do último
 * ano antes de enviar para o banco
 */
const trataRespostaUltimoAnoMoeda = (resposta, moeda) => {
    let dados = [];

    for (indice in resposta.prices) {
        dados.push(
            [
                moeda,
                new Date(resposta.prices[indice][0]).toISOString(),
                resposta.prices[indice][1],
                resposta['market_caps'][indice][1],
                resposta['total_volumes'][indice][1]
            ]
        )
    }

    return dados;
}

module.exports = {
    // cadastraDadosAnterioresMedoGanancia,
    // inicializaAtualizacaoUltimoAnoMoeda
}