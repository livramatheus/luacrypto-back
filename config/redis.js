const redis       = require('redis');
var redisClient;

if (process.env.REDIS_TLS_URL) {
    redisClient = redis.createClient(process.env.REDIS_TLS_URL, {
        tls: {
            rejectUnauthorized: false
        }
    });
} else {
    redisClient = redis.createClient();   
}

const getCache = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err) {
                reject(err);
            } else {
                resolve(value);
            }
        })
    })
}

const setCache = (key, value, time) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, 'EX', time, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        })
    })
}

module.exports = {
    getCache,
    setCache
}