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
    console.log('🌎 Server started as production.');
    
    tasks.iniciaAgendamentos();
    app.use(corsConfig.corsProd());
} else {
    console.log('💻 Server started as development.');
    
    app.use(corsConfig.corsDev());
}

app.use(Fiat);
app.use(Etf);
app.use(Moeda);
app.use(Dominancia);
app.use(MedoGanancia);
app.use(Post);

console.log('teste');

app.listen(process.env.PORT, () => {
    console.log("Server started successfully");
})