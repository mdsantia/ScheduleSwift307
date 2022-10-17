const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const crypto = require("crypto");
const algorithm = "des-ede3";
const SecurityKey = "abcedfghijklmnopqrstuvwx";
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

function encrypt(text) {
    cipher = crypto.createCipheriv(algorithm, SecurityKey, "");
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final('hex');
    return encrypted;
}

app.post("/api/customerRegister", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const emailAddress = req.body.email;
    const encryptedPassword = encrypt(req.body.password);
    const registerDate = req.body.creationDate;
    const sqlInsert = "INSERT INTO userData (firstName, lastName, username, emailAddress, password, creationDate) VALUES (?,?,?,?,?,?)"
    db.query(sqlInsert, [firstName, lastName, username, emailAddress, encryptedPassword, registerDate], (err, result) => {
        console.log(err);
    })
})

app.post("/api/employeeRegister", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const emailAddress = req.body.email;
    const businessName = req.body.business;
    const encryptedPassword = encrypt(req.body.password);
    const sqlInsert = "INSERT INTO employeeData (firstName, lastName, username, emailAddress, password, businessName) VALUES (?,?,?,?,?,?)"
    db.query(sqlInsert, [firstName, lastName, username, emailAddress, encryptedPassword, businessName], (err, result) => {
        console.log(err);
    })
})

app.post("/api/managerRegister", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const emailAddress = req.body.email;
    const businessName = req.body.business;
    const encryptedPassword = encrypt(req.body.password);
    const sqlInsert = "INSERT INTO managerData (firstName, lastName, username, emailAddress, password, businessName) VALUES (?,?,?,?,?,?)"
    db.query(sqlInsert, [firstName, lastName, username, emailAddress, encryptedPassword, businessName], (err, result) => {
        console.log(err);
    })
})

app.post("/api/customerSignIn", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const encryptedPassword = encrypt(password);
    db.query(
        "SELECT * FROM userData WHERE username = ? AND password = ?",
        [username, encryptedPassword],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result.length > 0) {
                res.send({ result });
            } else {
                res.send({ message: "Wrong username/password combination" });
            }
        }
    )
})
app.post("/api/employeeSignIn", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const encryptedPassword = encrypt(password);
    db.query(
        "SELECT * FROM employeeData WHERE username = ? AND password = ?",
        [username, encryptedPassword],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result.length > 0) {
                res.send({ result });
            } else {
                res.send({ message: "Wrong username/password combination" });
            }
        }
    )
})
app.post("/api/managerSignIn", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const encryptedPassword = encrypt(password);
    db.query(
        "SELECT * FROM managerData WHERE username = ? AND password = ?",
        [username, encryptedPassword],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result.length > 0) {
                res.send({ result });
            } else {
                res.send({ message: "Wrong username/password combination" });
            }
        }
    )
})

app.post('/api/customerVerify', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    db.query(
        "SELECT * FROM userData WHERE username = ? AND emailAddress = ?",
        [username, email],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }
            if (result.length > 0) {
                res.send({ result });
            } else {
                console.log(result);
                res.send({ message: "No account with that username and email found." });
            }
        }
    )
})

app.post('/api/employeeVerify', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    db.query(
        "SELECT * FROM employeeData WHERE username = ? AND emailAddress = ?",
        [username, email],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }
            if (result.length > 0) {
                res.send({ result });
            } else {
                console.log(result);
                res.send({ message: "No account with that username and email found." });
            }
        }
    )
})

app.post('/api/managerVerify', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    db.query(
        "SELECT * FROM managerData WHERE username = ? AND emailAddress = ?",
        [username, email],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }
            if (result.length > 0) {
                res.send({ result });
            } else {
                console.log(result);
                res.send({ message: "No account with that username and email found." });
            }
        }
    )
})

app.post("/api/customerForgot", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const newPassword = req.body.password;
    const encryptedPassword = encrypt(newPassword);
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
app.post("/api/employeeForgot", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const newPassword = req.body.password;
    const encryptedPassword = encrypt(newPassword);
    db.query(
        "UPDATE employeeData SET password = ? WHERE username = ? AND emailAddress = ?",
        [encryptedPassword, username, email],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }
            res.send({ result });
        }
    )
})
app.post("/api/managerForgot", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const newPassword = req.body.password;
    const encryptedPassword = encrypt(newPassword);
    db.query(
        "UPDATE managerData SET password = ? WHERE username = ? AND emailAddress = ?",
        [encryptedPassword, username, email],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }
            res.send({ result });
        }
    )
})

app.post("/api/customerEdit", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const encryptedPassword = encrypt(password);
    db.query(
        "SELECT * FROM userData WHERE username = ? AND password = ?",
        [username, encryptedPassword],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }
            res.send({ result })
        }
    )
})

app.post("/api/updateCustomerInfo", (req, res) => {
    const oldUsername = req.body.oldUsername;
    console.log(oldUsername);
    const oldPassword = req.body.oldPassword;
    console.log(oldPassword);
    const firstName = req.body.firstName;
    const lastName = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const encryptedPassword = encrypt(password);
    db.query(
        "UPDATE userData SET username = ?, emailAddress = ?, password = ? WHERE username = ? AND password = ?",
        [username, email, encryptedPassword, oldUsername, oldPassword],
        (err, result) => {
            console.log(result);
            if (err) {
                console.log(err);
                res.send({ err: err })
            }
            if (result) {
                res.send({ result })
            }
        }
    )
})

app.post("/api/memberSince", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(password);
    const encrypted = encrypt(password);
    db.query(
        "SELECT creationDate FROM userData WHERE username = ? and password = ?",
        [username, encrypted],
        (err, result) => {
            console.log(result);
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                res.send({ result })
            }
        }
    )
})

app.post("/api/managerCreateReservation", (req, res) => {
    const businessName = req.body.businessName;
    const isReserved = "No";
    let reservationDate = req.body.reservationDate;
    let reservationSubstring = reservationDate.substring(0, 10);
    const reservable = req.body.reservable;
    const price = req.body.price;
    db.query(
        "INSERT INTO reservations (businessName, reservationDate, reservableItem, price, isReserved) VALUES (?,?,?,?,?)",
        [businessName, reservationSubstring, reservable, price, isReserved],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                res.send({ result })
            }
        }
    )
})

app.post("/api/getBusinessReservations", (req, res) => {
    const businessName = req.body.businessName;
    db.query(
        "SELECT * FROM reservations WHERE businessName = ?",
        [businessName],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                console.log({ result })
                res.send({ result })
            }
        }
    )
})

app.post("/api/managerDeleteReservation", (req, res) => {
    const reservationID = req.body.reservationID;
    db.query(
        "DELETE FROM reservations WHERE ID = ?",
        [reservationID],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                console.log({ result })
                res.send({ result })
            }
        }
    )
})

app.post("/api/getAllAvailableReservations", (req, res) => {
    const notReserved = "No";
    query = db.query(
        "SELECT * FROM reservations WHERE isReserved = ?",
        [notReserved],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                console.log({ result })
                res.send({ result })
            }
        }
    )
})

app.post("/api/customerMakeReservation", (req, res) => {
    const reservationID = req.body.reservationID;
    const username = req.body.username;
    db.query(
        "SELECT * FROM reservations WHERE ID = ?",
        [reservationID],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                console.log(result)
                res.send({ result })
            }
        }
    )
})

app.post("/api/customerConfirmReservation", (req, res) => {
    const reservationID = req.body.reservationID;
    const reservedBy = req.body.reservedBy;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const numPeople = req.body.numPeople;
    const numReservable = req.body.numReservable;
    const reserved = "Yes";
    db.query(
        "UPDATE reservations SET startTime = ?, endTime = ?, reservedBy = ?, numPeople = ?, numReservable = ?, isReserved = ? WHERE ID = ?",
        [startTime, endTime, reservedBy, numPeople, numReservable, reserved, reservationID],
        (err, result) => {
            if (err) {
                console.log(err)
            }
            if (result) {
                console.log({ result })
                res.send({ result })
            }
        }
    )
})




app.listen(3001, () => {
    console.log("Running on Port 3001");
})