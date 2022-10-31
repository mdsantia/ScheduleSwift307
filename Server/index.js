const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const crypto = require("crypto");
const algorithm = "des-ede3";
const SecurityKey = "abcedfghijklmnopqrstuvwx";
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const { send } = require("process");

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

// var transport = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "91818b64366958",
//       pass: "e7214f0a8b0461"
//     }
// });

var transport = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "scheduleswift@gmail.com",
        pass: "txwgbslbjbxxojvb",
    },
});

app.post('/api/allFacilityData', (req, res) => {
    console.log(`Searching by all the facilities\n`);
    db.query(
        "SELECT * FROM facilityData",
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                console.log("Found a match \n");
                console.log("Query Result: \n")
                console.log(result);
                res.send({ result: result });
            } else {
                console.log("No match. \n");
                res.send({ message: "No facility has been created!" });
            }
        }
    )
})

app.post("/api/updateTimes", (req, res) => {
    const businessName = req.body.businessName;
    const open = req.body.open;
    const close = req.body.close;
    let hours = [];
    for (let i = 0; i < 7; i++) {
        if (open[i]) {
            hours.push(`${open[i]};${close[i]}`);
        } else {
            hours.push('null;null');
        }
    }
    db.query(
        "UPDATE facilityData SET `Sun` = ?, `Mon` = ?, `Tues` = ?, `Wed` = ?, `Thurs` = ?, `Fri` = ?, `Sat` = ? WHERE businessName = ?",
        [hours[0], hours[1], hours[2], hours[3], hours[4], hours[5], hours[6], businessName],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                console.log(hours)
                res.send({ result })
            }
        }
    )
})

app.post("/api/updateMinMax", (req, res) => {
    const businessName = req.body.businessName;
    const reservableItems = req.body.reservableItems;
    const prices = req.body.prices;
    const maxs = req.body.maxs;
    const mins = req.body.mins;
    const numPeople = req.body.numPeople;
    const numReservable = req.body.numReservable;
    db.query(
        "UPDATE facilityData SET `reservableItem` = ?, `prices` = ?, `maxs` = ?, `mins` = ?, `numPeople` = ?, `numReservable` = ? WHERE businessName = ?",
        [reservableItems, prices, maxs, mins, numPeople, numReservable, businessName],
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

app.post('/api/getFacilitysData', (req, res) => {
    const businessName = req.body.businessName;
    console.log(`Searching by facility data: ${businessName}\n`);
    db.query(
        "SELECT * FROM facilityData WHERE businessName = ?",
        [businessName],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                console.log("Found a match \n");
                console.log("Query Result: \n")
                console.log(result);
                res.send({ result: result });
            } else {
                console.log("No match. \n");
                res.send({ message: "The facility does not exist!" });
            }
        }
    )
})

app.post('/api/activeEvents', (req, res) => {
    const username = req.body.username;
    console.log(`Searching by username: ${username}\n`);
    db.query(
        // TODO get facility too by checking all facility databases
        // TODO get start and end time as well
        // TODO Read multiple entries at once
        // "SELECT confID, date FROM events WHERE username = ?",
        // "SELECT confID, date, startTime, endTime FROM events WHERE username = ?",
        "SELECT * FROM reservations WHERE reservedBy = ?",
        [username],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                console.log("Found a match \n");
                console.log("Query Result: \n")
                console.log(result);
                res.send(result);
            } else {
                console.log("No match. \n");
                res.send({ message: "Events made by that user does not exist!" });
            }
        }
    )
})

app.post("/api/sendConfirmEmail", (req, res) => {
    const username = req.body.username;
    const firstName = req.body.firstName;
    const emailAddress = req.body.email;
    const confirmCode = req.body.confirmCode;
    var sqlInsert;
    console.log(req.body.businessName);
    if (req.body.businessName === undefined) {
        sqlInsert = "UPDATE userData SET confirmCode = ? WHERE username = ?";
    } else {
        sqlInsert = "UPDATE managerData SET confirmCode = ? WHERE username = ?";
    }
    console.log(sqlInsert);
    db.query(
        sqlInsert,
        [confirmCode, username],
        (err, result) => {
            if (err) {
                console.log("Unable to change confirmation code.");
                console.log(err);
            } else {
                console.log("Successfully changed confirmation code to " + confirmCode);
            }
        }
    )
    const mailOptions = {
        from:
        {
            name: 'no-reply@scheduleswift.com',
            address: 'scheduleswift@gmail.com'
        },
        to: emailAddress,
        subject: "Confirm Your Account",
        html: "<html><h1>Welcome to Schedule Swift!</h1><body><h4>" + firstName + ",</h4>"
            + "<p>Here is the confirmation code to confirm your account. This code will expire in 10 minutes. Once you enter the confirmation code, your account will be activated and you will be automatically redirected to the main page.</p>"
            + "<h4>Confirmation Code:</h4>"
            + "<p><center><font size=" + "+3" + "><b>" + confirmCode + "</b></font></center></p></body></html>"
    };
    transport.sendMail(mailOptions, (err, res) => {
        if (err) {
            console.log("Unable to resend email.");
            console.log(err);
        }
        else {
            console.log("The email was successfully resent.");
        }
    });
})

app.post("/api/customerConfirmAccount", (req, res) => {
    const confirmCode = req.body.confirmCode;
    const username = req.body.username;
    const endTime = req.body.endTime;
    const currentTime = new Date();
    if ((new Date(currentTime).getTime()) > (new Date(endTime).getTime())) {
        res.send({ message: "Confirmation code has expired"});
    } else {
        db.query(
            "UPDATE userData SET active = 1 WHERE confirmCode = ? AND username = ?",
            [confirmCode, username],
            (err, result) => {
                if (err) {
                    console.log("Unable to activate account.");
                    console.log(err);
                } else {
                    res.send({result});
                    console.log("Successfully Activated Account.");
                }
            }
        )
    }
})

app.post("/api/customerRegister", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const emailAddress = req.body.email;
    const encryptedPassword = encrypt(req.body.password);
    const registerDate = req.body.creationDate;
    const confirmCode = req.body.confirmCode;
    const sqlInsert = "INSERT INTO userData (firstName, lastName, username, emailAddress, password, creationDate, confirmCode) VALUES (?,?,?,?,?,?,?)"
    db.query(sqlInsert, [firstName, lastName, username, emailAddress, encryptedPassword, registerDate, confirmCode], (err, result) => {
        if (err) {
            console.log(err.message);
            res.send({ err: err });
        } else {
            res.send({result});
            const mailOptions = {
                from:
                {
                    name: 'no-reply@scheduleswift.com',
                    address: 'scheduleswift@gmail.com'
                },
                to: emailAddress,
                subject: "Confirm Your Account",
                html: "<html><h1>Welcome to Schedule Swift!</h1><body><h4>" + firstName + ",</h4>"
                    + "<p>Here is the confirmation code to confirm your account. This code will expire in 10 minutes. Once you enter the confirmation code, your account will be activated and you will be automatically redirected to the main page.</p>"
                    + "<h4>Confirmation Code:</h4>"
                    + "<p><center><font size=" + "+3" + "><b>" + confirmCode + "</b></font></center></p></body></html>"
            };
            transport.sendMail(mailOptions, (err, res) => {
                if (err) {
                    console.log("Unable to send email.");
                    console.log(err);
                }
                else {
                    console.log("The email was successfully sent.");
                }
            });
        }
    });
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
        res.send({ err: err });
    })
})

app.post("/api/managerConfirmAccount", (req, res) => {
    const confirmCode = req.body.confirmCode;
    const username = req.body.username;
    const endTime = req.body.endTime;
    const currentTime = new Date();
    if ((new Date(currentTime).getTime()) > (new Date(endTime).getTime())) {
        res.send({ message: "Confirmation code has expired"});
    } else {
        db.query(
            "UPDATE managerData SET active = 1 WHERE confirmCode = ? AND username = ?",
            [confirmCode, username],
            (err, result) => {
                if (err) {
                    console.log("Unable to activate account.");
                    console.log(err);
                } else {
                    res.send({result});
                    console.log("Successfully Activated Account.");
                }
            }
        )
    }
})

app.post("/api/managerRegister", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const emailAddress = req.body.email;
    const businessName = req.body.business;
    const encryptedPassword = encrypt(req.body.password);
    const confirmCode = req.body.confirmCode;
    const sqlInsert = "INSERT INTO managerData (firstName, lastName, username, emailAddress, password, businessName, confirmCode) VALUES (?,?,?,?,?,?,?)"
    db.query(sqlInsert, [firstName, lastName, username, emailAddress, encryptedPassword, businessName, confirmCode], (err, result) => {
        if (err) {
            console.log(err.sqlMessage);
            if (err.sqlMessage.includes(username)) {
                res.send({ message: "Username has already been taken"});
            } else {
                res.send({ message: "Business name has already been taken"});
            }
        } else {
            db.query("INSERT INTO facilityData (businessName) VALUES (?)", [businessName], (err, result) => {
                if (err) {
                    console.log(err);
                }
            });
            res.send({ result });
            const mailOptions = {
                from:
                {
                    name: 'no-reply@scheduleswift.com',
                    address: 'scheduleswift@gmail.com'
                },
                to: emailAddress,
                subject: "Confirm Your Account",
                html: "<html><h1>Welcome to Schedule Swift!</h1><body><h4>" + firstName + ",</h4>"
                    + "<p>Here is the confirmation code to confirm your account. This code will expire in 10 minutes. Once you enter the confirmation code, your account will be activated and you will be automatically redirected to the main page.</p>"
                    + "<h4>Confirmation Code:</h4>"
                    + "<p><center><font size=" + "+3" + "><b>" + confirmCode + "</b></font></center></p></body></html>"
            };
            transport.sendMail(mailOptions, (err, res) => {
                if (err) {
                    console.log("Unable to send email.");
                    console.log(err);
                }
                else {
                    console.log("The email was successfully sent.");
                }
            });
        }
    })
})

app.post("/api/customerSignIn", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const encryptedPassword = encrypt(password);
    const confirmCode = req.body.confirmCode;
    db.query(
        "SELECT * FROM userData WHERE username = ? AND password = ?",
        [username, encryptedPassword],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result.length == 1) {
                res.send({ result });
                if (result[0].active == 0) {
                    db.query(
                        "UPDATE userData SET confirmCode = ? WHERE username = ?",
                        [confirmCode, username],
                        (err, result) => {
                            if (err) {
                                console.log("Unable to set new confirmation code.");
                                console.log(err);
                            } else {
                                console.log("Successfully set new confirmation code to " + confirmCode);
                            }
                        }
                    )
                    const mailOptions = {
                        from:
                        {
                            name: 'no-reply@scheduleswift.com',
                            address: 'scheduleswift@gmail.com'
                        },
                        to: result[0].emailAddress,
                        subject: "Confirm Your Account",
                        html: "<html><h1>Welcome to Schedule Swift!</h1><body><h4>" + result[0].firstName + ",</h4>"
                            + "<p>Here is the confirmation code to confirm your account. This code will expire in 10 minutes. Once you enter the confirmation code, your account will be activated and you will be automatically redirected to the main page.</p>"
                            + "<h4>Confirmation Code:</h4>"
                            + "<p><center><font size=" + "+3" + "><b>" + confirmCode + "</b></font></center></p></body></html>"
                    };
                    transport.sendMail(mailOptions, (err, res) => {
                        if (err) {
                            console.log("Unable to send email.");
                            console.log(err);
                        }
                        else {
                            console.log("The email was successfully sent.");
                        }
                    });
                }
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
                console.log(result);
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
            if (result.length == 1) {
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

app.post("/api/getReservation", (req, res) => {
    const ID = req.body.ID;
    db.query(
        "SELECT * FROM reservations WHERE ID = ?",
        [ID],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                console.log({ result })
                res.send({ result : result })
            }
        }
    )
})

app.post("/api/updateReservation", (req, res) => {
    const ID = req.body.ID;
    const businessName = req.body.businessName;
    const isReserved = "Yes";
    let reservationDate = req.body.reservationDate;
    let reservationSubstring = reservationDate.substring(0, 10);
    const reservable = req.body.reservable;
    const price = req.body.price;
    const reservedBy = req.body.reservedBy;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const numPeople = req.body.numPeople;
    const numReservable = req.body.numReservable;
    db.query(
        "UPDATE reservations SET numReservable = ?, startTime = ?, endTime = ?, reservedBy = ?, \
            numPeople = ?, businessName = ?, reservationDate = ?, reservableItem = ?, price = ?, isReserved = ? WHERE ID = ?",
        [numReservable, startTime, endTime, reservedBy, numPeople, businessName, reservationSubstring, reservable, price, isReserved, ID],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                console.log(result);
                res.send( { id: result.insertId } )
            }
        }
    )
})

app.post("/api/createReservation", (req, res) => {
    const businessName = req.body.businessName;
    const isReserved = "Yes";
    let reservationDate = req.body.reservationDate;
    let reservationSubstring = reservationDate.substring(0, 10);
    const reservable = req.body.reservable;
    const price = req.body.price;
    const reservedBy = req.body.reservedBy;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const numPeople = req.body.numPeople;
    const numReservable = req.body.numReservable;
    db.query(
        "INSERT INTO reservations (numReservable, startTime, endTime, reservedBy, \
            numPeople, businessName, reservationDate, reservableItem, price, isReserved) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [numReservable, startTime, endTime, reservedBy, numPeople, businessName, reservationSubstring, reservable, price, isReserved],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                console.log(result);
                res.send( { id: result.insertId } )
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

app.post("/api/addBusinessNotes", (req, res) => {
    const businessName = req.body.businessName;
    const noteSubject = req.body.noteSubject;
    const noteBody = req.body.noteBody;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const formattedDate = `${month}-${day}-${year}`;
    db.query(
        "INSERT INTO managerNotes (date, businessName, noteSubject, noteBody) VALUES (?,?,?,?)",
        [formattedDate, businessName, noteSubject, noteBody],
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

app.post("/api/getBusinessNotes", (req, res) => {
    const businessName = req.body.businessName
    db.query(
        "SELECT * FROM managerNotes WHERE businessName = ?",
        [businessName],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                console.log(result)
                res.send({ result: result })
            }
        }
    )
})

app.post("/api/managerDeleteNote", (req, res) => {
    const noteID = req.body.noteID;
    db.query(
        "DELETE FROM managerNotes WHERE ID = ?",
        [noteID],
        (err, result) => {
            if (err) {
                console.log(err)
            }
            if (result) {
                console.log(result)
                res.send({ result: result })
            }
        }
    )
})




app.listen(3001, () => {
    console.log("Running on Port 3001");
})