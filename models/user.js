const sequelize = require('../util/db');

let User = sequelize.define('user', {
    uid: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: "uid, 主键, 自增"
    },
    username: {
        type: sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: "用户名"
    },
    password: {
        type: sequelize.STRING(100),
        allowNull: false,
        validate: {
            length: function (val) {
                if (val.length < 7) {
                    throw new Error("Please choose a longer password");
                }
            }
        },
        comment: "密码, MD5加密"
    },
    nick: {
        type: sequelize.STRING(100),
        allowNull: false,
        comment: "昵称"
    },
    avatar: {
        type: sequelize.STRING(100),
        comment: "头像"
    },
    address: {
        type: sequelize.STRING(200),
        comment: "住址"
    },
    phone: {
        type: sequelize.BIGINT(11),
        comment: "电话"
    },
    last_login: {
        type: sequelize.BIGINT,
        comment: "上次登陆时间"
    }
});

// 强制同步table和models
// User.sync({force: true});

module.exports = User;