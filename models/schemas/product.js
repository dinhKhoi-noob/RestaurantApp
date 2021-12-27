'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class products extends Model {
        static associate(models) {
        }
    };
    //add image_file_id
    products.init({
        id: {
            type: DataTypes.INTEGER,
            auto_increment: true,
            uniqueKeys: true
        },
        visible_id:{
            type:DataTypes.VARCHAR(10),
            primaryKey: true
        },
        title: {
            type: DataTypes.VARCHAR(50),
            uniqueKeys: true
        },
        category_id: {
            type: DataTypes.VARCHAR(10),
            allowNull: false
        },
        price:{
            type: DataTypes.INTERGER,
            allowNull: false
        },
        on_sale:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        sale_percent:{
            type: DataTypes.INTERGER,
            defaultValue:0
        }
    }, {
        sequelize,
        modelName: 'products',
    });
    return products;
};