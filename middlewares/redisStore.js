const session = require('koa-session-minimal');
const redisStore = require('koa-redis');
const redis = require('redis');

const redisConfig = require('../config/redisconfig');

let client = redis.createClient(redisConfig.port, redisConfig.host);

exports.redisClient = client;