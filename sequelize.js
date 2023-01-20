const { Sequelize, Datatypes} = require('sequalize');

const sequalize = new Sequelize('sparta_backup', 'sparta', 'tmvkfmxk2022', {
    host: 'caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com',
    dialect: 'mysql'
});

const User = sequalize.define('users', {
    id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncresment: true
    },
    name: Datatypes.STRING,
    email: Datatypes.STRING,
    password: Datatypes.STRING,
    created_at: Datatypes.DATE,
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

const getUser = async () => {
    const user = await User.findBypk(1);
    console,log(user)
}

getUser()