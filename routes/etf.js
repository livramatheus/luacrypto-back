var express = require('express');
var router = express.Router();
const controllerEtf = require('../controllers/etf');
const redisClient = require('../config/redis');

/**
 * Retorna dados gerais e a última cotação da ETF passada como parâmetro na URL
 * 
 * Devolve: tudo sobre uma ETF, desde seus dados básicos até os números mais 
 * recentes de trading
 */
router.get('/etf/:simbolo', async (req, res) => {
    let simbolo = req.params.simbolo;

    const CACHE_SECONDS = 300; // 5 minutos / 300 segundos
    const CACHE_NAME    = `etf_simbolo_${simbolo}`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    });

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerEtf.getDadosGeraisRecentes(simbolo).then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            })
        });
    }
});

/**
 * Esta rota é chamada pela página que mostra as Bubbles de ETF do front-end
 * de modo que a mesma receba os dados genéricos das ETFs.
 * Como temos apenas duas ETFs disponíveis, sempre serão retornadas todas ETFs
 * 
 * Devolve: simbolo, nome, baixa, alta, abertura, volume e cotação atual
 */
router.get('/todasetfsreduzidas', async (req, res) => {
    const CACHE_SECONDS = 3600; // 1 hora / 3600 segundos
    const CACHE_NAME    = `etf_reduzida`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    });

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerEtf.getTodasReduzidas().then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            })
        });
    }
});

// Cotação Diaria
router.get('/etfdiaria/:simbolo', async (req, res) => {
    let simbolo = req.params.simbolo;

    const CACHE_SECONDS = 3600; // 1 hora / 3600 segundos
    const CACHE_NAME    = `etf_diaria_chave_${simbolo}`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    })

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerEtf.getDadosDiario(simbolo).then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            })
        });   
    }
});

// Cotação Semanal
router.get('/etfsemanal/:simbolo', async (req, res) => {
    let simbolo = req.params.simbolo;

    const CACHE_SECONDS = 3600; // 1 hora / 3600 segundos
    const CACHE_NAME    = `etf_semanal_chave_${simbolo}`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    })

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerEtf.getDadosSemanal(simbolo).then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            })
        });   
    }
});

// Cotação Mensal
router.get('/etfmensal/:simbolo', async (req, res) => {
    let simbolo = req.params.simbolo;

    const CACHE_SECONDS = 3600; // 1 hora / 3600 segundos
    const CACHE_NAME    = `etf_mensal_chave_${simbolo}`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    })

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerEtf.getDadosMensal(simbolo).then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            })
        });   
    }
});

// Cotação Anual
router.get('/etfanual/:simbolo', async (req, res) => {
    let simbolo = req.params.simbolo;

    const CACHE_SECONDS = 3600; // 1 hora / 3600 segundos
    const CACHE_NAME    = `etf_anual_chave_${simbolo}`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    })

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerEtf.getDadosAnual(simbolo).then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            })
        });   
    }
});

module.exports = router;