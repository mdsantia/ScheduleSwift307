const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const crypto = require("crypto");
const algorithm = "des-ede3";
const initVector = crypto.randomBytes(16);
const SecurityKey = "abcdefghijklmnopqrstuvwx";
const mysql = require("mysql");
const { format } = require("path");

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

app.post('/api/eventselect', (req, res) => {
    const confID = req.body.confID;
    console.log(`Searching by ID: ${confID}\n`);
    db.query(
        "SELECT * FROM events WHERE confID = ?",
        [confID],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }
            if (result.length > 0) {
                console.log("Found a match \n");
                console.log("Query Result: \n")
                console.log(result);
                const organizer = `${result[0]["firstName"]} ${result[0]["lastName"]}`;
                res.send( {organizers : organizer, phone : JSON.stringify(result[0]["phoneNumber"]), email : JSON.stringify(result[0]["email"]),
                            date : JSON.stringify(result[0]["date"]), starttime : JSON.stringify(result[0]["startTime"]), endtime: JSON.stringify(result[0]["endTime"])} );
            } else {
                console.log("No match. \n");
                res.send({ message: "Event with that confirmation ID does not exist!" });
            }
        }
    )
})

// TODO JENNY DELETE * WHERE Delete an event from database

app.post('/api/eventInsert', (req, res) => {
    /* TODO Add Username & Host/Facility Once Everything is Connected */
    const confID = req.body.confID;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailAddress = req.body.emailAddress;
    const phoneNumber = req.body.phoneNumber;
    const date = req.body.date;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const numItem1 = req.body.numItem1;
    const numItem2 = req.body.numItem2;
    const additionalInfo = req.body.additionalInfo;
    const communicationMethod = req.body.communicationMethod;
    const sqlInsert = "INSERT INTO events (confID, firstName, lastName, emailAddress, phoneNumber, date, startTime, endTime, numItem1, numItem2, additionalInfo, communicationMethod) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
    db.query(sqlInsert, [confID, firstName, lastName, emailAddress, phoneNumber, date, startTime, endTime, numItem1, numItem2, additionalInfo, communicationMethod], (err) => {
        console.log(err);
    })
})

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
