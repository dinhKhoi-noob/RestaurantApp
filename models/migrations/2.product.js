'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('products', {
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
                references:{ model: 'categories', key:'visible_id' }
            },
            price:{
                type: Sequelize.INTERGER,
                allowNull: false
            },
            on_sale:{
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            sale_percent:{
                type: Sequelize.INTERGER,
                defaultValue:0
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('products');
    }
};