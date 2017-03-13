const koa = require('koa');
const app = new koa();
const router = require('koa-router')();
const onerror = require('koa-onerror');
const logger = require('koa-logger');
const views = require('koa-views');
const statics = require('koa-static');
const json = require('koa-json');
const mongoose = require('koa-mongoose');
const hbs = require('koa-hbs');
const index = require('./routes/index');

onerror(app);
app.use(logger());

app.use(hbs.middleware({
    viewPath: __dirname + '/views',
    disableCache:true
}));

app.use(statics(__dirname + '/public'));

app.use(index.routes());
app.use(index.allowedMethods());

module.exports = app;