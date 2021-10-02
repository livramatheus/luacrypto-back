var express = require('express');
var router = express.Router();

const controllerDominancia = require('../controllers/dominancia');

router.get('/dominanciarecente', (req, res) => {
    controllerDominancia.dominanciaRecente().then((resultado) => {
        res.send(resultado);
    });
});

module.exports = router;