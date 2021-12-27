let mysql = require('mysql2');

let conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "EcommerceJS"
});

conn.connect(function (err) {
    console.log(process.env.DB_HOST)
    if (err) {
        console.log(err);
        return;
    };
    console.log('Database is connected successfully !');
});

module.exports = conn;