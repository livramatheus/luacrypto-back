var express = require('express');
var router = express.Router();
var controllerFiat = require('../controllers/fiat');

/**
 * Retorna dados gerais e a última cotação da fiat passada como parâmetro
 */
router.get('/fiat/:chave', (req, res) => {
    let chave = req.params.chave.toUpperCase();

    controllerFiat.getDadosGeraisRecentes(chave).then((resultado) => {
        res.send(resultado);
    });
});

/**
 * Devolve todos os registros completos
 */
router.get('/todasfiatscompletas', (req, res) => {
    controllerFiat.getAllCompletos().then((resultadoPromise) => {
        res.send(resultadoPromise);
    });
});

module.exports = router;