const modelPost = require('../models/post');

const getUltimosReduzidos = () => {
    return new Promise((resolve, reject) => {
        modelPost.getTickers().then((resposta) => {
            resolve(resposta);
        });
    });
}

module.exports = {
    getUltimosReduzidos
}