const modelMedoGanancia = require('../models/medoganancia');
const Axios = require('axios');

const getDadosGraficoGeral = () => {
    return new Promise((resolve, reject) => {
        modelMedoGanancia.getDadosMedoGanancia().then((resposta) => {
            resolve(resposta);
        });
    });
}

const realizaBuscaMedoGanancia = () => {
    try {
        return Axios.get("https://api.alternative.me/fng/");
    } catch (error) {
        console.log(error.message);
    }
}

const atualizarDadosMedoGanancia = () => {

    realizaBuscaMedoGanancia().then((resposta) => {
        if (resposta.data.data) {
            let dados = trataRespostaDadosMedoGanancia(resposta.data.data[0]);

            if (modelMedoGanancia.insereMedoGananciaBanco([dados])) {
                console.log('✔ Medo e ganância atualizada com sucesso!', new Date().toLocaleString());
            }
        }
    }).catch((erro) => {
        console.log('❌ Erro ao atualizar os dados de medo e ganância!', new Date().toLocaleString(), erro.message);
    });
};

const trataRespostaDadosMedoGanancia = (resposta) => {
    return [
        new Date().toISOString().split('T')[0],
        resposta.value,
        null
    ];
}

module.exports = {
    getDadosGraficoGeral,
    realizaBuscaMedoGanancia,
    atualizarDadosMedoGanancia
}