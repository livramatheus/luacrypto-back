const express = require('express');
const routes = express.Router();
const controllerMedoGanancia = require('../controllers/medoganancia');

routes.get("/medogananciageral", (req, res) => {
    controllerMedoGanancia.getDadosGraficoGeral().then((resultadoPromise) => {
        resultadoPromise.forEach((element, id) => {
            resultadoPromise[id].data = new Date(element.data);
        });

        res.send(resultadoPromise);
    });
});

module.exports = routes;