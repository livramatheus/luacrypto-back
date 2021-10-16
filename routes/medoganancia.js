const express = require('express');
const routes  = express.Router();

const controllerMedoGanancia = require('../controllers/medoganancia');
const redisClient = require('../config/redis');

routes.get("/medogananciageral", async (req, res) => {
    const CACHE_SECONDS = 3600; // 1 Hora
    const CACHE_NAME    = 'medo_e_ganancia_geral';

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((resultado) => {
        return resultado;
    });

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerMedoGanancia.getDadosGraficoGeral().then((resultadoPromise) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoPromise), CACHE_SECONDS).then((resultado) => {
                if (resultado) {
                    resultadoPromise.forEach((element, id) => {
                        resultadoPromise[id].data = new Date(element.data);
                    });
                    
                    res.send(resultadoPromise);
                }
            });
        });
    }
});

module.exports = routes;