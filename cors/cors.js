const cors = require('cors');

var corsOptions = {
    origin: ['https://luacrypto.netlify.app/', 'https://www.luacrypto.com/'],
    optionsSuccessStatus: 200
}

module.exports = cors(corsOptions);