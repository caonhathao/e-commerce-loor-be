const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const config = require('./config/config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        schema: config.schema,
        logging: false,
    }
);

const umzug = new Umzug({
    migrations: {
        glob: 'migrations/*.js',
        resolve: ({ name, path, context }) => {
            const migration = require(path);
            return {
                name,
                up: async () => migration.up(context.queryInterface, context.Sequelize),
                down: async () => migration.down(context.queryInterface, context.Sequelize),
            };
        },

    },
    context: {
        queryInterface: sequelize.getQueryInterface(),
        Sequelize,
    },
    storage: new SequelizeStorage({ sequelize}),
    logger: console,
});

module.exports = async () => {
    // // XÓA schema trước (xóa toàn bộ bảng trong schema đó)
    // await sequelize.query('DROP SCHEMA IF EXISTS store CASCADE;');
    //
    // // TẠO LẠI schema
    // await sequelize.query('CREATE SCHEMA IF NOT EXISTS store;');

    // CHẠY LẠI migration
    await umzug.up();
};
