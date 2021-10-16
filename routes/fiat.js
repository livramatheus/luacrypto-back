const express = require('express');
const router = express.Router();
const controllerFiat = require('../controllers/fiat');
const redisClient = require('../config/redis');

/**
 * Retorna dados gerais e a última cotação da fiat passada como parâmetro
 */
router.get('/fiat/:chave', async (req, res) => {
    let chave = req.params.chave.toUpperCase();

    const CACHE_SECONDS = 1800; // 30 minutos / 1800 segundos
    const CACHE_NAME    = `fiat_chave_${chave}`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    });

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerFiat.getDadosGeraisRecentes(chave).then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            })
        });
    }
});

/**
 * Devolve todos os registros completos
 */
router.get('/todasfiatscompletas', async (req, res) => {
    const CACHE_SECONDS = 3600; // 1 hora / 3600 segundos
    const CACHE_NAME    = `todas_fiats_completas`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    });

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerFiat.getAllCompletos().then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            });
        });
    }
});

module.exports = router;