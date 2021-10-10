const cors = require('cors');

const corsOptions = {
    origin: ['https://luacrypto.netlify.app', 'https://www.luacrypto.com']
}

const corsProd = () => {
    return cors(corsOptions)
}

const corsDev = () => {
    return cors();
}

module.exports = {
    corsProd,
    corsDev
};