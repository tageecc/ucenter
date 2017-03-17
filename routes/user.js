const router = require('koa-router')();

const User = require('../models/user');


router.get('/', async (ctx, next) => {
    let redirect_uri = ctx.query.redirect_uri;

    if (!redirect_uri) {
        await ctx.render('login', {title: '用户登陆', redirect_uri: redirect_uri, layout: false});
        return;
    }

    let token = ctx.cookies.get('token');
    console.log(token);
    if (token) {
        //存在token，则在内存中寻找之前与用户的映射关系
        //异步的
        if (ctx.session.userlist && ctx.session.userlist[token]) {
            ctx.redirect('http://' + redirect_uri + '?token=' + token);
            return;
        } else {
            await ctx.render('login', {title: '用户登陆', redirect_uri: redirect_uri, layout: false});
        }
    }

});

/**
 * 处理用户登陆
 */
router.post('/user/login', async (ctx, next) => {

    const redirect_uri = ctx.request.body.redirect_uri;
    console.log('redirect_uri:' + redirect_uri);
    const token = new Date().getTime() + '_';

    let user = await User.findOne({
        attributes: {exclude: ['password']},
        'where': {
            password: ctx.request.body.password,
            '$or': [
                {username: ctx.request.body.username},
                {nick: ctx.request.body.username}
            ]
        }
    });
    if (user) {
        ctx.cookies.set('token', token);
        ctx.session.userlist = ctx.session.userlist || {};
        ctx.session.userlist[token] = user;

        if (redirect_uri) {
            ctx.redirect(redirect_uri + '?token=' + token);
        } else {
            ctx.redirect('/admin/user');
        }
    } else {

    }

});

/**
 * 获取用户头像
 */
router.get('/user/avatar', async (ctx, next) => {
    let avatar = await User.findOne({
        attributes: ['avatar'],
        'where': {
            '$or': [
                {username: ctx.query.user},
                {nick: ctx.query.user}
            ]
        }
    });
    ctx.body = avatar ? {code: 100, data: {avatar: avatar}} : {code: -1};
});

/**
 * 通过token验证用户登录状态
 */
router.post('/user/validate', async (ctx, next) => {

    const token = ctx.request.body.token;
    let user = ctx.session.userlist ? ctx.session.userlist[token] : null;
    if (user) {
        ctx.cookies.set('token', token);
        ctx.session.userlist = ctx.session.userlist || {};
        ctx.session.userlist[token] = user;

        if (redirect_uri) {
            ctx.redirect(redirect_uri + '?token=' + token);
        } else {
            ctx.redirect('/admin/user');
        }
    } else {

    }

});
module.exports = router;