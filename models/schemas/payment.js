'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class payments extends Model {
        static associate(models) {
        }
    };
    //add image_file_id
    payments.init({
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
        total_payments:{
            type:DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'payments',
    });
    return payments;
};