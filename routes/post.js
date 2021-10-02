var express = require('express');
var router = express.Router();
const controllerPost = require('../controllers/post')

router.get('/postsreduzidoslimit', (req, res) => {
    controllerPost.getUltimosReduzidos().then((resposta) => {
        res.send(resposta);
    });
});

module.exports = router;