'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class users extends Model {
        static associate(models) {
        }
    };
    //add image_file_id
    users.init({
        id: {
            type: DataTypes.INTEGER,
            auto_increment: true,
            uniqueKeys: true
        },
        visible_id:{
            type:DataTypes.VARCHAR(10),
            primaryKey: true
        },
        username: {
            type: DataTypes.VARCHAR(50),
            uniqueKeys: true
        },
        password: {
            type: DataTypes.VARCHAR(100),
            allowNull: false
        },
        email: {
            type: DataTypes.VARCHAR(40),
            allowNull: false
        },
        address:{
            type:DataTypes.VARCHAR(100),
            allowNull: false
        },
        balance:{
            type: DataTypes.INTERGER,
            defaultValue:0
        },
        total_saving:{
            type: DataTypes.INTERGER,
            defaultValue:0
        }
    }, {
        sequelize,
        modelName: 'users',
    });
    return users;
};