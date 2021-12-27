'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class order_items extends Model {
        static associate(models) {
        }
    };
    //add image_file_id
    order_items.init({
        id: {
            type: DataTypes.INTEGER,
            auto_increment: true,
            uniqueKeys: true
        },
        visible_id:{
            type:DataTypes.VARCHAR(10),
            primaryKey: true
        },
        order_id:{
            type:DataTypes.VARCHAR(10),
            allowNull: false
        },
        product_id:{
            type:DataTypes.VARCHAR(10),
            allowNull: false
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'order_items',
    });
    return order_items;
};