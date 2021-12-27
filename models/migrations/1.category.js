'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('categories', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                unique: true
            },
            visible_id:{
                type:Sequelize.STRING(10),
                primaryKey: true
            },
            title: {
                type: Sequelize.STRING(50),
                unique: true
            },
            category_id: {
                type: Sequelize.STRING(10),
                allowNull: false,
                references:{model:"categories",key:"visible_id"}
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('categories');
    }
};