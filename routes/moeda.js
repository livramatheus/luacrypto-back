var express = require('express');
var router = express.Router();
const controllerMoeda = require('../controllers/moeda');
const redisClient = require('../config/redis');

// Gráfico diario
router.get('/moedadiaria/:chave', async (req, res) => {
    let chave = req.params.chave;

    const CACHE_SECONDS = 300; // 5 minutos / 300 segundos
    const CACHE_NAME    = `moeda_diaria_chave_${chave}`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    })

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerMoeda.getCotacaoDiaria(chave).then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            });
        });
    }
});

// Gráfico mensal
router.get('/moedamensal/:chave', async (req, res) => {
    let chave = req.params.chave;

    const CACHE_SECONDS = 300; // 5 minutos / 300 segundos
    const CACHE_NAME    = `moeda_mensal_chave_${chave}`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    })

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerMoeda.getCotacaoMensal(chave).then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            });
        });
    }
});

// Gráfico anual
router.get('/moedaanual/:chave', async (req, res) => {
    let chave = req.params.chave;

    const CACHE_SECONDS = 300; // 5 minutos / 300 segundos
    const CACHE_NAME    = `moeda_anual_chave_${chave}`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    })

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerMoeda.getCotacaoAnual(chave).then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            });
        });
    }
});

// Gráfico semanal
router.get('/moedasemanal/:chave', async (req, res) => {
    let chave = req.params.chave;

    const CACHE_SECONDS = 300; // 5 minutos / 300 segundos
    const CACHE_NAME    = `moeda_semanal_chave_${chave}`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    })

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerMoeda.getCotacaoSemanal(chave).then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            });
        });
    }
});

/**
 * Esta rota é chamada pela página de Moeda/SIMBOLO do front-end para receber
 * todos os dados referentes a uma moeda. 
 * 
 * Devolve: tudo sobre uma moeda, desde seus dados básicos até os números mais 
 * recentes de trading
 */
router.get('/moeda/:chave', async (req, res) => {
    let chave = req.params.chave;

    const CACHE_SECONDS = 300; // 5 minutos / 300 segundos
    const CACHE_NAME    = `moeda_chave_${chave}`;

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    })

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerMoeda.getUltimaCotacaoBanco(chave).then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            })
        });
    }
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
router.get('/todasmoedasreduzidas', async (req, res) => {
    const CACHE_SECONDS = 86400; // 1 dia / 86400 segundos
    const CACHE_NAME    = 'moeda_todas_reduzidas';

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    })

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerMoeda.pesquisarMoeda().then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }

            })
        });
    }

});

// Retorna 5 moedas em destaque que não são fiat
router.get('/moedaemdestaque', async (req, res) => {
    const CACHE_SECONDS = 1800; // 30 minutos / 1800 segundos
    const CACHE_NAME    = 'moeda_destaque';

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((dadosCache) => {
        return dadosCache;
    });

    if (respostaCache) {
        res.send(respostaCache)
    } else {
        controllerMoeda.getMoedasDestaque().then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            })
        });
    }
});

// Retorna dados genéricos e o gráfico das últimas 24 horas para todas as moedas disponíveis
router.get('/dadoslista', async (req, res) => {
    const CACHE_SECONDS = 300; // 5 minutos / 300 segundos
    const CACHE_NAME    = 'dados_lista';

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((resposta) => {
        return JSON.parse(resposta);
    });

    if (respostaCache) {
        res.send(respostaCache)
    } else {
        controllerMoeda.getDadosLista().then((resultadoBanco) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resultadoBanco), CACHE_SECONDS).then((resultadoRedis) => {
                if (resultadoRedis) {
                    res.send(resultadoBanco);
                }
            }).catch((error) => {
                console.log('Error on /dadoslista! ', error);
                res.status(503).send();
            })
        });
    }
});

module.exports = router;