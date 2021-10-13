var express = require('express');
var router = express.Router();
const controllerPost = require('../controllers/post');
const redisClient = require('../config/redis');

router.get('/postsreduzidoslimit', async (req, res) => {
    const CACHE_SECONDS = 1800; // 30 Minutos
    const CACHE_NAME    = 'posts_reduzidos';

    const respostaCache = await redisClient.getCache(CACHE_NAME).then((resposta) => {
        return resposta;
    });

    if (respostaCache) {
        res.send(respostaCache);
    } else {
        controllerPost.getUltimosReduzidos().then((resposta) => {
            redisClient.setCache(CACHE_NAME, JSON.stringify(resposta), CACHE_SECONDS).then((resultado) => {
                res.send(resposta);
            })
        });
    }
});

module.exports = router;