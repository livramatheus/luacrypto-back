var express = require('express');
var router = express.Router();
const redisClient = require('../config/redis');

const controllerDominancia = require('../controllers/dominancia');

router.get('/dominanciarecente', async (req, res) => {
    const CACHE_SECONDS = 3600; // 1 hora | 3600 segundos
    const CACHE_NAME    = 'dominancia_recente';

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((resultado) => {
        return resultado;
    });

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerDominancia.dominanciaRecente().then((resultadoPromise) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoPromise), CACHE_SECONDS).then((resultado) => {
                res.send(resultadoPromise);
            })
        });
    }
});

module.exports = router;