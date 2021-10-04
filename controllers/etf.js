const modelEtf = require('../models/etf');
const Axios = require('axios');
const AuxiliarDias = require('../helpers/AuxiliarDias');

const getDadosDiario = (simbolo) => {
    return new Promise((resolve, reject) => {
        modelEtf.getCotacaoDiaria(simbolo).then((resposta) => {
            resolve(resposta);
        })
    });
}

const getDadosSemanal = (simbolo) => {
    return new Promise((resolve, reject) => {
        modelEtf.getCotacaoSemanal(simbolo).then((resposta) => {
            resolve(resposta);
        })
    });
}

const getDadosMensal = (simbolo) => {
    return new Promise((resolve, reject) => {
        modelEtf.getCotacaoMensal(simbolo).then((resposta) => {
            resolve(resposta);
        })
    });
}

const getDadosAnual = (simbolo) => {
    return new Promise((resolve, reject) => {
        modelEtf.getCotacaoAnual(simbolo).then((resposta) => {
            resolve(resposta);
        })
    });
}

const getTodasReduzidas = () => {
    return new Promise((resolve, reject) => {
        modelEtf.getUltimaCotacaoBancoReduzidaEtf().then((resposta) => {
            resolve(resposta);
        })
    });
}

const getDadosGeraisRecentes = (simbolo) => {
    return new Promise((resolve, reject) => {
        modelEtf.getUltimaCotacaoBancoEtf(simbolo).then((resposta) => {
            resolve(resposta);
        })
    });
}

/**
 * Realiza uma requisição para a API externa do ALPHAVANTAGE para
 * receber a cotação atualizada de todas as ETFs disponíveis.
 * Esse método é chamado pelo agendamento
 */
const atualizarCotacoesEtf = () => {
    if (AuxiliarDias.isMercadoAberto()) {
        var delayInMilliseconds = 5000;

        modelEtf.getEtfsAtivas().forEach((simbolo, index) => {
            
            
            setTimeout(function () {
                let url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=${process.env.API_ALPHA}&symbol=${simbolo}.SA`;
                
                Axios.get(url).then((resposta) => {
                    let etfRetorno = resposta.data['Global Quote'];
                    modelEtf.insereCotacaoBancoEtf([getRegistroTratadoEtf(etfRetorno)]);
                    console.log('✔ ETF atualizada com sucesso!', new Date().toLocaleString());
                }).catch((erro) => {
                    console.log('❌ Erro ao atualizar ETF', new Date().toLocaleString(), erro.message);
                });
            }, delayInMilliseconds * (index + 1));
        });
    } else {
        console.log('🔒 Mercado fechado! ETFs não foram atualizadas!', new Date().toLocaleString());
    }
}

const getRegistroTratadoEtf = (objEtf) => {
    return [
        objEtf['01. symbol'].split('.')[0],
        new Date().toISOString(),
        objEtf['02. open'],
        objEtf['03. high'],
        objEtf['04. low'],
        objEtf['05. price'],
        objEtf['06. volume'],
    ];
}

module.exports = {
    getDadosDiario,
    getDadosSemanal,
    getDadosMensal,
    getDadosAnual,
    getTodasReduzidas,
    getDadosGeraisRecentes,
    atualizarCotacoesEtf
}