require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const Fiat = require('./routes/fiat');
const Etf = require('./routes/etf');
const Moeda = require('./routes/moeda');
const Dominancia = require('./routes/dominancia');
const MedoGanancia = require('./routes/medoganancia');
const Post = require('./routes/post');

const controllerFiat         = require('./controllers/fiat');
const controllerEtf          = require('./controllers/etf');
const controllerDominancia   = require('./controllers/dominancia');
const controllerMoeda        = require('./controllers/moeda');
const controllerMedoGanancia = require('./controllers/medoganancia');

const app = express();
app.use(cors());

// Todo dia à 3:10 da manhã são atualizados os dados de dominância
cron.schedule('10 3 * * *', () => {
    controllerDominancia.atualizarDominancia();
});

// Todo dia às 3:11 da manhã são atualizados os dados de mercado das moedas
cron.schedule('11 3 * * *', () => {
    controllerMoeda.atualizarDadosMercadoMoeda();
});

// Todo dia às 3:12 da manhã são atualizados os dados de medo e ganância
cron.schedule('11 3 * * *', () => {
    controllerMedoGanancia.atualizarDadosMedoGanancia();
});

// A cada 5 minutos são atualizadas as cotações das moedas
cron.schedule('*/5 * * * *', () => {
    controllerMoeda.atualizarCotacoesMoeda();
});

// A cada 14 minutos são atualziadas as cotações das etfs
cron.schedule('*/14 * * * *', () => {
    controllerEtf.atualizarCotacoesEtf();
});

// A cada 15 minutos são atualizadas as cotações de FIAT
cron.schedule('*/15 * * * *', () => {
    controllerFiat.atualizarCotacoesFiat();
});

app.use(Fiat);
app.use(Etf);
app.use(Moeda);
app.use(Dominancia);
app.use(MedoGanancia);
app.use(Post);

app.listen(process.env.PORT, () => {
    console.log("Servidor iniciado com sucesso - ", process.env.NODE_ENV);
});