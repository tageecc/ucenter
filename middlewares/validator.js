module.exports = {
    adminRequired: async (ctx, next) => {
        let token = ctx.cookies.get('token');
        if (token && await ctx.redis.get(token)) {
            await next();
        } else {
            ctx.redirect('/login');
        }
    }
};