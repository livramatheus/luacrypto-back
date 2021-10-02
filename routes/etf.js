var express = require('express');
var router = express.Router();
const controllerEtf = require('../controllers/etf');

/**
 * Retorna dados gerais e a última cotação da ETF passada como parâmetro na URL
 * 
 * Devolve: tudo sobre uma ETF, desde seus dados básicos até os números mais 
 * recentes de trading
 */
router.get('/etf/:simbolo', (req, res) => {
    let simbolo = req.params.simbolo;

    controllerEtf.getDadosGeraisRecentes(simbolo).then((resultadoPromise) => {
        res.send(resultadoPromise);
    });
});

/**
 * Esta rota é chamada pela página que mostra as Bubbles de ETF do front-end
 * de modo que a mesma receba os dados genéricos das ETFs.
 * Como temos apenas duas ETFs disponíveis, sempre serão retornadas todas ETFs
 * 
 * Devolve: simbolo, nome, baixa, alta, abertura, volume e cotação atual
 */
router.get('/todasetfsreduzidas', (req, res) => {
    controllerEtf.getTodasReduzidas().then((resultadoPromise) => {
        res.send(resultadoPromise);
    });
});

// Cotação Diária
router.get('/etfdiaria/:simbolo', (req, res) => {
    let simbolo = req.params.simbolo;

    controllerEtf.getDadosDiario(simbolo).then((resultado) => {
        res.send(resultado);
    });
});

// Cotação Semanal
router.get('/etfsemanal/:simbolo', (req, res) => {
    let simbolo = req.params.simbolo;

    controllerEtf.getDadosSemanal(simbolo).then((resultado) => {
        res.send(resultado);
    });
});

// Cotação Mensal
router.get('/etfmensal/:simbolo', (req, res) => {
    let simbolo = req.params.simbolo;

    controllerEtf.getDadosMensal(simbolo).then((resultado) => {
        res.send(resultado);
    });
});

// Cotação Anual
router.get('/etfanual/:simbolo', (req, res) => {
    let simbolo = req.params.simbolo;

    controllerEtf.getDadosAnual(simbolo).then((resultado) => {
        res.send(resultado);
    });
});

module.exports = router;