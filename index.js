require('dotenv').config();
const express    = require('express');

const Fiat         = require('./routes/fiat');
const Etf          = require('./routes/etf');
const Moeda        = require('./routes/moeda');
const Dominancia   = require('./routes/dominancia');
const MedoGanancia = require('./routes/medoganancia');
const Post         = require('./routes/post');

const corsConfig = require('./config/cors');
const tasks      = require('./tasks/tasks');

const app = express();

if (process.env.ENV_TYPE == 2) {
    console.log('🌎 Inicou como produção.');
    
    tasks.iniciaAgendamentos();
    app.use(corsConfig.corsProd());
} else {
    console.log('💻 Inicou como desenvolvimento.');

    app.use(corsConfig.corsDev());
}

app.use(Fiat);
app.use(Etf);
app.use(Moeda);
app.use(Dominancia);
app.use(MedoGanancia);
app.use(Post);

app.listen(process.env.PORT, () => {
    console.log("Servidor iniciado com sucesso");
})