'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('order_items', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                unique: true
            },
            visible_id:{
                type:Sequelize.STRING(10),
                primaryKey: true
            },
            order_id:{
                type:Sequelize.STRING(10),
                allowNull: false,
                references: { model: 'orders', key: 'visible_id' }
            },
            product_id:{
                type:Sequelize.STRING(10),
                allowNull: false,
                references: { model: 'products', key: 'visible_id' }
            },
            quantity:{
                type:Sequelize.INTEGER,
                allowNull: false
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('order_items');
    }
};