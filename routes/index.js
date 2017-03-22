const router = require('koa-router')();

const login = require('./login');
const user = require('./user');
const admin = require('./admin');


// 首页拦截
router.redirect('/', '/login');


// 路由分发
router.use('/login', login.routes(), login.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());
router.use('/admin', admin.routes(), admin.allowedMethods());

module.exports = router;