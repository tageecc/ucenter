const router = require('koa-router')();

const Validate = require('../middlewares/validator');
const User = require('../models/user');

router.get('/', Validate.adminRequired, async (ctx, next) => {
    let users = await User.findAll({attributes: {exclude: ['password']}});
    await ctx.render('admin/user', {
        title: '后台管理',
        users: users.map((item) => item.get({plain: true}))
    });
});

module.exports = router;