const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require("mysql");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "scheduleSwift",
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/api/insert', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const emailAddress = req.body.emailAddress;
    const password = req.body.password;
    const sqlInsert = "INSERT INTO userData (firstName, lastName, username, emailAddress, password) VALUES (?,?,?,?,?)"
    db.query(sqlInsert, [firstName, lastName, username, emailAddress, password], (err, result) => {
        console.log(err);
    })
})

app.listen(3001, () => {
    console.log("Running on Port 3001");
});