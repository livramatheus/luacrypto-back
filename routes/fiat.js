const express = require('express');
const router = express.Router();
const controllerFiat = require('../controllers/fiat');
const redisClient = require('../config/redis');

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
router.get('/todasfiatscompletas', async (req, res) => {
    const CACHE_SECONDS = 3600; // 1 hora minutos / 3600 segundos
    const CACHE_NAME    = `todas_fiats_completas`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    });

    if (respostaCache) {
        res.send(respostaCache);
        console.log('cachea')
    } else {
        controllerFiat.getAllCompletos().then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    console.log('bancob')
                    res.send(resultadoBanco);
                }
            });
        });
    }
});

module.exports = router;