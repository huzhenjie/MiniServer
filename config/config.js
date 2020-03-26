module.exports = {
    host: 'localhost',
    port: 8181,
    jwtSecret: '',

    datasource: {
        mysql: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '',
            database: 'test'
        }
    },

    wx: {
        cal: {
            appId: '',
            appSecret: ''
        },

        zu: {
            appId: '',
            appSecret: ''
        }
    },

    pwd: {
        sign_key: ''
    }
};
