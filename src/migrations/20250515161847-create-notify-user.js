/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable({schema: 'store', tableName: 'notify_user'}, {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            title:{
                type:Sequelize.STRING,
                allowNull:false,
            },
            content: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            redirect_url: {
                type: Sequelize.STRING
            },
            type: {
                type: Sequelize.ENUM('SUCCESS', 'WARNING', 'ERROR', 'BAN', 'ADS', 'NOTICE'),
                defaultValue: 'NOTICE',
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM("READ", "IDLE"),
                defaultValue: "IDLE",
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({schema: 'store', tableName: 'notify_user'});
    }
};
