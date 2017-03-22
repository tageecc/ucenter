const router = require('koa-router')();

const User = require('../models/user');

router.get('/', async (ctx, next) => {
    let redirect_uri = ctx.query.redirect_uri;

    if (!redirect_uri) {
        await ctx.render('login', {title: '用户登陆', redirect_uri: redirect_uri, layout: false});
        return;
    }

    let token = ctx.cookies.get('token');
    if (token) {
        //存在token，则在内存中寻找之前与用户的映射关系
        if (ctx.session.userlist && ctx.session.userlist[token]) {
            ctx.redirect('http://' + redirect_uri + '?token=' + token);
            return false;
        } else {
            await ctx.render('login', {title: '用户登陆', redirect_uri: redirect_uri, layout: false});
        }
    }

});


/**
 * 处理用户登陆
 */
router.post('/handle', async (ctx, next) => {

    const redirect_uri = ctx.request.body.redirect_uri;
    const token = Math.random().toString(36).substr(2);

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
        //登陆成功
        ctx.cookies.set('token', token);
        ctx.session.userlist = ctx.session.userlist || {};
        ctx.session.userlist[token] = user;
        if (redirect_uri) {
            ctx.redirect(redirect_uri + '?token=' + token);
        } else {
            ctx.redirect('/admin');
        }
    } else {
        //用户名或密码错误
    }

});

/**
 * 通过token验证用户登录状态
 */
router.post('/validate', async (ctx, next) => {
    const token = ctx.request.body.token;
    let user = ctx.session.userlist ? ctx.session.userlist[token] : null;
    if (user) {
        ctx.body = {code: 1, data: {user: user}}
    } else {
        ctx.body = {code: -1, message: 'not login!'}
    }
});
module.exports = router;