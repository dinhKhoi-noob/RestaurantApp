'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class orders extends Model {
        static associate(models) {
        }
    };
    //add image_file_id
    orders.init({
        id: {
            type: DataTypes.INTEGER,
            auto_increment: true,
            uniqueKeys: true
        },
        visible_id:{
            type:DataTypes.VARCHAR(10),
            primaryKey: true
        },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'orders',
    });
    return orders;
};