const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express();

let mysql = require('mysql2');

let conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
});

function initApp() {
  // console.log("huh")
  let sql2 = "create database ecommercejs"
  conn.query(sql2, (err, result) => {
    // console.log("huhh")
    if (err) throw err

    console.log("init database successfully! Press Crtl+C and Y \n use: 'npm run init_table' to create all tables")
  })
}
initApp();

app.listen(3000);