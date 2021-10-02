const modelFiat = require('../models/fiat');
const Axios = require('axios');

const getDadosGeraisRecentes = (chave) => {

    if (chave === 'USD') {
        return new Promise((resolve, reject) => {
            resolve({
                "chave": "USD",
                "nome": "Dólar dos Estados Unidos",
                "data_hora": new Date().toISOString(),
                "valor": 1
            });
        });
    }

    return new Promise((resolve, reject) => {
        modelFiat.getUltimaCotacaoBanco(chave).then((resultado) => {
            resolve(resultado);
        });
    })

}

const getAllCompletos = () => {
    return new Promise((resolve, reject) => {
        modelFiat.getUltimaCotacaoBancoTodas().then((resultado) => {
            resultado.push({
                "chave": "USD",
                "nome": "Dólar (EUA)",
                "data_hora": new Date().toISOString(),
                "valor": 1
            });

            resolve(resultado);
        });
    });
}

const atualizarCotacoesFiat = () => {
    modelFiat.getFiatsAtivas().forEach((simbolo) => {

        if (simbolo !== 'USD') {
            let url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=${simbolo}&apikey=${process.env.API_ALPHA}`;

            Axios.get(url).then((resposta) => {
                let fiatRetorno = resposta.data['Realtime Currency Exchange Rate'];

                modelFiat.insereCotacaoBanco([trataRespostaDadosFiat(fiatRetorno)]);
                console.log('✔ FIAT atualizada com sucesso!', new Date().toLocaleString());
            }).catch((erro) => {
                console.log('❌ Erro ao atualizar FIAT!', new Date().toLocaleString(), erro.message);
            });
        }
    });
}

const trataRespostaDadosFiat = (resposta) => {
    let dataAtual = new Date().toISOString();

    return [
        resposta["3. To_Currency Code"],
        dataAtual,
        resposta["5. Exchange Rate"]
    ];
}

module.exports = {
    getDadosGeraisRecentes,
    getAllCompletos,
    atualizarCotacoesFiat
}