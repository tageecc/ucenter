const router = require('koa-router')();

const User = require('../models/user');

router.get('/', async (ctx, next) => {
    let redirect_uri = ctx.query.redirect_uri;
    let token = ctx.cookies.get('token');
    //存在token，则在内存中寻找之前与用户的映射关系
    let user = await ctx.redis.get(token);
    if (token && user) {
        if (!redirect_uri) {
            ctx.redirect('/admin');
            return;
        }
        ctx.redirect(redirect_uri + '?token=' + token);
    } else {
        await ctx.render('login', {title: '用户登陆', redirect_uri: redirect_uri, layout: false});
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
        await ctx.redis.set(token, user.get({plain: true}));
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
    let user = await ctx.redis.get(token);
    if (user) {
        ctx.body = {code: 1, data: {user: user}}
    } else {
        ctx.body = {code: -1, message: 'not login!'}
    }
});

/**
 * 退出登陆
 */
router.get('/bye', async (ctx, next) => {
    const token = ctx.cookies.get('token');
    await ctx.redis.set(token, null);
    ctx.redirect('/');
});
module.exports = router;