const koa = require('koa');
const app = new koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const onerror = require('koa-onerror');
const logger = require('koa-logger');
const statics = require('koa-static');
const session = require('koa-session-minimal');
const redisStore = require('koa-redis');
const redis = require('redis');
const hbs = require('koa-hbs');

const route = require('./routes');
const redisConfig = require('./config/redisconfig');

//session
let client = redis.createClient(redisConfig.port, redisConfig.host);
app.keys = ['keys', redisConfig.key];
app.use(session({
    store: redisStore({
        // db:config.redis_db,
        client: client
    })
}));

// 中间件
app.use(logger());
app.use(bodyParser());

// 渲染引擎
app.use(hbs.middleware({
    viewPath: __dirname + '/views',
    defaultLayout: 'admin/layout',
    disableCache: true
}));

// 静态资源路径
app.use(statics(__dirname + '/public'));

// 路由配置
app.use(route.routes());
app.use(route.allowedMethods());

// 错误信息
onerror(app);


module.exports = app;