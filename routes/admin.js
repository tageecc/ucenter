const router = require('koa-router')();

const User = require('../models/user');

router.get('/admin/user', async (ctx, next) => {
    let users = await User.findAll({attributes: {exclude: ['password']}});
    await ctx.render('admin/user', {
        title: '后台管理',
        users: users.map((item) => item.get({plain: true}))
    });
});

/**
 * 添加用户
 */
router.post('/admin/user/add', async (ctx, next) => {
    let user, error;
    try {
        user = await User.create(ctx.request.body);
    } catch (e) {
        error = e;
    }
    ctx.body = user ? {code: 1, message: '添加成功！'} : {code: -1, message: error.message};
});

/**
 * 删除用户
 */
router.post('/admin/user/delete', async (ctx, next) => {
    let user, error;
    try {
        user = await User.destroy({where: {uid: ctx.request.body.uid}});
    } catch (e) {
        error = e;
    }
    console.log(user);
    ctx.body = user ? {code: 1, message: '删除成功！'} : {code: -1, message: error.message};
});
module.exports = router;