module.exports = {
    adminRequired: async (ctx, next) => {

        let token = ctx.cookies.get('token');
        if (token && ctx.session.userlist && ctx.session.userlist[token]) {
            await next();
        } else {
            ctx.redirect('/login');
        }
    }
};