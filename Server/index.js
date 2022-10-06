const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const crypto = require("crypto");
const algorithm = "des-ede3";
const initVector = crypto.randomBytes(16);
const SecurityKey = "abcdefghijklmnopqrstuvwx";
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

async function hashPassword(password) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

app.post('/api/insert', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const emailAddress = req.body.emailAddress;
    var encryptedPassword = encrypt(req.body.password);
    const sqlInsert = "INSERT INTO userData (firstName, lastName, username, emailAddress, password) VALUES (?,?,?,?,?)"
    db.query(sqlInsert, [firstName, lastName, username, emailAddress, encryptedPassword], (err, result) => {
        console.log(err);
    })

})
function encrypt(text) {
    cipher = crypto.createCipheriv(algorithm, SecurityKey, "");
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final('hex');
    return encrypted;
}
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(password);
    var encryptedPassword = encrypt(password);
    console.log(encryptedPassword);
    db.query(
        "SELECT * FROM userData WHERE username = ? AND password = ?",
        [username, encryptedPassword],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }
            if (result.length > 0) {
                console.log(result);
                console.log("Found a match");
                res.send({ result });
            } else {
                res.send({ message: "Wrong username/password combination" });
            }
        }
    )
})

app.listen(3001, () => {
    console.log("Running on Port 3001");
});