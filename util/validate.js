module.exports = {
    isLogin: async (ctx, next) => {

        let token = ctx.cookies.get('token');
        console.log('validate_token:' + token);
        if (token && ctx.session.userlist && ctx.session.userlist[token]) {
            console.log('validate_ctx.session.userlist[token]:');
            console.log(ctx.session.userlist[token]);
            next();
        } else {
            ctx.redirect('/login');
        }
    }
};