const router = require('koa-router')();

const User = require('../models/user');


router.get('/', async (ctx, next) => {
    await ctx.render('index', {title: '用户登陆',layout: false});
});

/**
 * 处理用户登陆
 */
router.post('/login', async (ctx, next) => {
    console.log(ctx.body);
    let user = await User.findOne({
        attributes: {exclude: ['password']},
        'where': {
            password: ctx.body.password,
            '$or': [
                {username: ctx.body.username},
                {nick: ctx.body.nick}
            ]
        }
    });
    ctx.session.user = user;
    ctx.body = user ? {code: 100} : {code: -1, message: '用户名或密码错误!'};

});

/**
 * 获取用户头像
 */
router.get('/user/avator', async (ctx, next) => {
    let avatar = await User.findOne({
        attributes: ['avatar'],
        'where': {
            '$or': [
                {username: ctx.query.user},
                {nick: ctx.query.user}
            ]
        }
    });
    ctx.boxy = avatar ? {code: 100, data: {avatar: avatar}} : {code: -1};
});

module.exports = router;