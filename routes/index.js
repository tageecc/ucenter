const router = require('koa-router')();

router.get('/', async(ctx, next) => {
    console.log(1);
    await ctx.render('index', {
        title: '用户登陆'
    });
});

router.get('/login', async(ctx, next) => {
    await ctx.render('user/login', {
        title: '用户登陆'
    });
});

router.post('/login', async(ctx, next) => {
    let User = ctx.model('user');
    let user = await User.findUser(ctx.request.body.username, ctx.request.body.password);

    if (!user) {
        return ctx.error('用户名或密码错误！');
    }
    // 用户名密码正确
    ctx.session.user = user.toObject();

    return ctx.success();
});

module.exports = router;