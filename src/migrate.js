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
        glob: 'src/migrations/*.js',
        resolve: ({ name, path, context }) => {
            const migration = require(path);2
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
    storage: new SequelizeStorage({
        sequelize,
        schema: 'store', // 🔥 đảm bảo SequelizeMeta nằm trong schema đúng
    }),
    logger: console,
});

module.exports = async () => {
    // await sequelize.query('DROP SCHEMA IF EXISTS store CASCADE;');
    // console.log('🗑️ Dropped schema "store"');
    //
    // await sequelize.query('CREATE SCHEMA IF NOT EXISTS store;');
    // console.log('📦 Created schema "store"');

    const migrations = await umzug.pending();
    console.log('🔎 Migrations found:', migrations.map(m => m.name));

    // ⚙️ CHẠY migration
    await umzug.up();
    console.log('✅ Migrations executed');
};
