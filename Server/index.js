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
    console.log(`Entered Password: ${password}\n`);
    var encryptedPassword = encrypt(password);
    console.log(`Encrypted Password: ${encryptedPassword}\n`);
    db.query(
        "SELECT * FROM userData WHERE username = ? AND password = ?",
        [username, encryptedPassword],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }
            if (result.length > 0) {
                console.log("Found a match \n");
                console.log("Query Result: \n")
                console.log(result);
                res.send({ result });
            } else {
                console.log("No match. \n");
                res.send({ message: "Wrong username/password combination" });
            }
        }
    )
})

app.post('/api/verify', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    console.log(`Username: ${username} \n Email: ${email} \n`);
    db.query(
        "SELECT * FROM userData WHERE username = ? AND emailAddress = ?",
        [username, email],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }
            if (result.length > 0) {
                console.log("Found a match \n");
                console.log("Query Result: \n");
                console.log(result);
                res.send({ result });
            } else {
                console.log("No match \n");
                res.send({ message: "No Account with that username and email found." });
            }
        }
    )
})

app.post('/api/forgot', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    var encryptedPassword = encrypt(newPassword);
    console.log(`Username: ${username} \n Email: ${email} \n New Password: ${newPassword}`);
    db.query(
        "UPDATE userData SET password = ? WHERE username = ? AND emailAddress = ?",
        [encryptedPassword, username, email],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }
            res.send({ result });
        }
    )
})

app.listen(3001, () => {
    console.log("Running on Port 3001");
});