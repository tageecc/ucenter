const koa = require('koa');
const app = new koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const onerror = require('koa-onerror');
const logger = require('koa-logger');
const statics = require('koa-static');
const Redis = require('ioredis');
const hbs = require('koa-hbs');

const route = require('./routes');


onerror(app);
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

module.exports = app;