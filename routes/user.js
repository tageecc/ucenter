const router = require('koa-router')();

const User = require('../models/user');

/**
 * 获取用户头像
 */
router.get('/avatar', async (ctx, next) => {
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
 * 添加用户
 */
router.post('/add', async (ctx, next) => {
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
router.post('/delete', async (ctx, next) => {
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