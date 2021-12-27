'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                unique: true
            },
            visible_id:{
                type: Sequelize.STRING(10),
                primaryKey: true
            },
            username: {
                type: Sequelize.STRING(50),
                unique: true
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(40),
                allowNull: false
            },
            address:{
                type: Sequelize.STRING(100),
                allowNull: false
            },
            balance:{
                type: Sequelize.INTERGER,
                defaultValue:0
            },
            total_saving:{
                type: Sequelize.INTERGER,
                defaultValue:0
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');
    }
};