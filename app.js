const koa = require('koa');
const app = new koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const onerror = require('koa-onerror');
const logger = require('koa-logger');
const statics = require('koa-static');
const session = require("koa-session2");
const hbs = require('koa-hbs');

const Store = require("./util/store");
const user = require('./routes/user');
const admin = require('./routes/admin');

app.use(session({
    store: new Store()
}));

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
app.use(user.routes());
app.use(user.allowedMethods());
app.use(admin.routes());
app.use(admin.allowedMethods());

module.exports = app;