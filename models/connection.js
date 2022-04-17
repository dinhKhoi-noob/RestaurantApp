let mysql = require("mysql2");
require("dotenv").config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;
let conn = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME,
});

conn.connect(function (err) {
    console.log(process.env.DB_HOST);
    if (err) {
        console.log(err);
        return;
    }
    console.log("Database is connected successfully !");
});

module.exports = conn;
