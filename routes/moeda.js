var express = require('express');
var router = express.Router();
const controllerMoeda = require('../controllers/moeda');

// Gráfico diário
router.get('/moedadiaria/:chave', (req, res) => {
    let chave = req.params.chave;
    
    controllerMoeda.getCotacaoDiaria(chave).then((resultadoPromise) => {
        res.send(resultadoPromise);
    });
});

// Gráfico mensal
router.get('/moedamensal/:chave', (req, res) => {
    let chave = req.params.chave;

    controllerMoeda.getCotacaoMensal(chave).then((resultadoPromise) => {
        res.send(resultadoPromise);
    });
});

// Gráfico anual
router.get('/moedaanual/:chave', (req, res) => {
    let chave = req.params.chave;

    controllerMoeda.getCotacaoAnual(chave).then((resultadoPromise) => {
        res.send(resultadoPromise);
    });
});

// Gráfico semanal
router.get('/moedasemanal/:chave', (req, res) => {
    let chave = req.params.chave;

    controllerMoeda.getCotacaoSemanal(chave).then((resultadoPromise) => {
        res.send(resultadoPromise);
    });
});

/**
 * Esta rota é chamada pela página de Moeda/SIMBOLO do front-end para receber
 * todos os dados referentes a uma moeda. 
 * 
 * Devolve: tudo sobre uma moeda, desde seus dados básicos até os números mais 
 * recentes de trading
 */
router.get('/moeda/:chave', (req, res) => {
    let chave = req.params.chave;

    controllerMoeda.getUltimaCotacaoBanco(chave).then((resultadoPromise) => {
        res.send(resultadoPromise);
    });
});

/**
 * Esta rota é chamada pelo cardgroup do front-end para receber
 * dados das moedas watchlisted. São retornados os dados para preencher
 * os cartões.
 * O front-end manda uma QueryString com todas as moedas watchlisted
 * separadas por vírgula
 * 
 * Devolve: simbolo, cotação atual e a variação em 24h das moedas watchlisted
 */
router.get('/moedareduzida/:simbolos', (req, res) => {
    let simbolos = req.params.simbolos.split(',');

    controllerMoeda.getUltimaCotacaoBancoReduzida(simbolos).then((resultadoPromise) => {
        res.send(resultadoPromise);
    });
});

/**
 * Esta rota é chamada pela página inicial do front-end para receber
 * a lista de todas as moedas cadastradas de modo que sejam preenchidos
 * os campos de busca.
 * 
 * Devolve: simbolo e nome de todas as moedas
 */
router.get('/todasmoedasreduzidas', (req, res) => {
    controllerMoeda.pesquisarMoeda().then((resultadoPromise) => {
        res.send(resultadoPromise);
    });
});

// Retorna 5 moedas em destaque que não são fiat
router.get('/moedaemdestaque', (req, res) => {
    controllerMoeda.getMoedasDestaque().then((resultadoPromise) => {
        res.send(resultadoPromise);
    });
});

module.exports = router;