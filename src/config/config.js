require('dotenv').config(); // load biến môi trường từ .env

module.exports = {
    development: {
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '123456',
        database: process.env.DB_BASENAME || 'e_commerce_floor',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        schema: process.env.DB_SCHEMA || 'store',
        dialectOptions: {
                searchPath: "store"
        },
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
    }
};
