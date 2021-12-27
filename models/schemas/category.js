'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class categories extends Model {
        static associate(models) {
        }
    };
    //add image_file_id
    categories.init({
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
        }
    }, {
        sequelize,
        modelName: 'categories',
    });
    return categories;
};