const redis = require('promise-redis')();
const redisConfig = require('../config/redisconfig');

class RedisStore {
    constructor() {
        this.redis = redis.createClient(redisConfig.port, redisConfig.host/*, {auth_pass: redisConfig.password}*/);
    }

    async set(key, value) {
        await this.redis.set(key, JSON.stringify(value));
    }

    async get(key) {
        let data = await this.redis.get(key);
        return JSON.parse(data);
    }
}

module.exports = async (ctx, next) => {
    ctx.redis = new RedisStore();
    await next();
};