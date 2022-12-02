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
const e = require("express");
const cron = require('node-cron');
const { brotliDecompress } = require("zlib");
const port = 3001;

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

var transport = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "scheduleswift@gmail.com",
        pass: "txwgbslbjbxxojvb",
    },
});

app.post('/api/getContactInfo', (req, res) => {
    const username = req.body.username;
    db.query(
        "SELECT * FROM userData WHERE username = ?",
        [username], (err, result) => {
            if (err) {
                res.send({ err: err });
            } else if (result.length == 0) {
                console.log("Unable to find customer with that username");
                res.send({ message: "Unable to find customer with that username" });
            } else {
                res.send({ result: result });
            }
        }
    )
})

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
    const paymentRequire = req.body.paymentRequire;
    const paymentValue = req.body.paymentValue;
    const prices = req.body.prices;
    const maxs = req.body.maxs;
    const mins = req.body.mins;
    const numPeople = req.body.numPeople;
    const numReservable = req.body.numReservable;
    db.query(
        "UPDATE facilityData SET `paymentValue` = ?, `paymentRequire` = ?, `reservableItem` = ?, `prices` = ?, `maxs` = ?, `mins` = ?, `numPeople` = ?, `numReservable` = ? WHERE businessName = ?",
        [paymentValue, paymentRequire, reservableItems, prices, maxs, mins, numPeople, numReservable, businessName],
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
            if (result) {
                console.log("Found a match \n");
                console.log("Query Result: \n")
                console.log({ result });
                res.send({ result });
            }
        }
    )
})

app.post("/api/changeEmail", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    var sqlInsert;
    if (req.body.businessName === undefined) {
        sqlInsert = "UPDATE userData SET emailAddress = ? WHERE username = ?";
    } else {
        sqlInsert = "UPDATE managerData SET emailAddress = ? WHERE username = ?";
    }
    db.query(sqlInsert, [email, username], (err, result) => {
        if (err) {
            console.log("Unable to update email address");
            console.log(err);
        } else {
            console.log("Successfully udpated email address");
        }
    });
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

app.post("/api/confirmAccount", (req, res) => {
    const confirmCode = req.body.confirmCode;
    const username = req.body.username;
    const endTime = req.body.endTime;
    const businessName = req.body.businessName;
    const currentTime = new Date();
    if ((new Date(currentTime).getTime()) > (new Date(endTime).getTime())) {
        res.send({ message: "Confirmation code has expired"});
    } else {
        var query;
        if (businessName === undefined) {
            query = "UPDATE userData SET active = 1 WHERE confirmCode = ? AND username = ?";
        } else {
            query = "UPDATE managerData SET active = 1 WHERE confirmCode = ? AND username = ?";
        }
        db.query(
            query,
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
    const phoneNumber = req.body.phoneNumber;
    const encryptedPassword = encrypt(req.body.password);
    const registerDate = req.body.creationDate;
    const confirmCode = req.body.confirmCode;
    const sqlInsert = "INSERT INTO userData (firstName, lastName, username, emailAddress, phoneNumber, password, creationDate, confirmCode) VALUES (?,?,?,?,?,?,?,?)"
    db.query(sqlInsert, [firstName, lastName, username, emailAddress, phoneNumber, encryptedPassword, registerDate, confirmCode], (err, result) => {
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
            db.query("INSERT INTO facilityData (businessName, paymentRequire, Sun, Mon, Tues, Wed, Thurs, Fri, Sat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
            [businessName, "none", ";", ";", ";", ";", ";", ";", ";"], (err, result) => {
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
    const confirmCode = req.body.confirmCode;
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
                if (result[0].active == 0) {
                    db.query(
                        "UPDATE managerData SET confirmCode = ? WHERE username = ?",
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
    const businessName = req.body.businessName;
    const isEmployee = req.body.isEmployee;
    var query;
    if (businessName === undefined) {
        query = "SELECT * FROM userData WHERE username = ? AND password = ?";
    } else if (isEmployee) {
        query = "SELECT * FROM employeeData WHERE username = ? AND password = ?";
    } else {
        query = "SELECT * FROM managerData WHERE username = ? AND password = ?";
    }
    db.query(
        query,
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
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const encryptedPassword = encrypt(password);
    const businessName = req.body.businessName;
    var query;
    if (businessName === undefined) {
        query = "UPDATE userData SET username = ?, emailAddress = ?, phoneNumber = ?, password = ? WHERE username = ? AND password = ?";
        db.query(
            query,
            [username, email, phoneNumber, encryptedPassword, oldUsername, oldPassword],
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
    } else {
        query = "UPDATE managerData SET username = ?, emailAddress = ?, password = ? WHERE username = ? AND password = ?";
        db.query(
            query,
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
    }
})

app.post("/api/getCustomerStats", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(password);
    const encrypted = encrypt(password);
    db.query(
        "SELECT * FROM userData WHERE username = ? and password = ?",
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

app.post("/api/getReservationsbyDate", (req, res) => {
    const businessName = req.body.businessName;
    let reservationDate = req.body.reservationDate;
    let reservationSubstring = reservationDate.substring(0, 10);
    db.query(
        "SELECT * FROM reservations WHERE reservationDate = ? AND businessName = ?",
        [reservationSubstring, businessName],
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

app.post("/api/getReservationsbyDateUser", (req, res) => {
    const businessName = req.body.businessName;
    let reservationDate = req.body.reservationDate;
    let reservationSubstring = reservationDate.substring(0, 10);
    const username = req.body.username;
    db.query(
        "SELECT * FROM reservations WHERE businessName = ? AND reservationDate = ? AND reservedBy LIKE ?",
        [businessName, reservationSubstring, `%${username}%`],
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

app.post("/api/getReservationsbyUsername", (req, res) => {
    const businessName = req.body.businessName;
    const username = req.body.username;
    db.query(
        "SELECT * FROM reservations WHERE businessName = ? AND reservedBy LIKE ?",
        [businessName, `%${username}%`],
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
    const startTime = reservationSubstring + req.body.startTime.substring(10,);
    const endTime = reservationSubstring + req.body.endTime.substring(10,);
    const numPeople = req.body.numPeople;
    const numReservable = req.body.numReservable;
    const modifiedBy = req.body.modifiedBy;
    db.query(
        "UPDATE reservations SET numReservable = ?, startTime = ?, endTime = ?, \
            numPeople = ?, businessName = ?, reservationDate = ?, reservableItem = ?, price = ?, isReserved = ? WHERE ID = ?",
        [numReservable, startTime, endTime, numPeople, businessName, reservationSubstring, reservable, price, isReserved, ID],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result) {
                res.send( { id: result.insertId } )
                db.query("SELECT * from userData WHERE username = ?", [reservedBy], (err2, result2) => {
                    if (err2) {
                        console.log(err2);
                        console.log("Unable to find user");
                    } else {
                        let allReservableItems = reservable.split(";");
                        let allReservablePrices = price.split(";");
                        let allNumReservable = numReservable.split(";");
                        var allReservableItemsString = "";
                        var total = 0;
                        if (allReservableItems.length === 0) {
                            allReservableItemsString += "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\">" + numReservable + " x " + reservable + "</td>";
                            allReservableItemsString += "<td width=\"20%\"> (" + numReservable + " x $" + price + ")" + "</td><td width=\"5%\">=</td>";
                            allReservableItemsString += "<td style=\"text-align:right\">$" + (price * numReservable).toFixed(2) + "</td></tr>";
                            total = price * numReservable;
                        } else {
                            for (i = 0; i < allReservableItems.length; i++) {
                                allReservableItemsString += "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\">" + allNumReservable[i] + " x " + allReservableItems[i] + "</td>";
                                allReservableItemsString += "<td width=\"20%\"> (" + allNumReservable[i] + " x $" + allReservablePrices[i] + ")" + "</td><td width=\"5%\">=</td>";
                                allReservableItemsString += "<td style=\"text-align:right\">$" + (allReservablePrices[i] * allNumReservable[i]).toFixed(2) + "</td></tr>";
                                total += allReservablePrices[i] * allNumReservable[i];
                            }
                        }
                        let policiesString = "";
                        db.query("SELECT * FROM reservationNotes WHERE businessName = ?",
                        [businessName],
                        (err3, result3) => {
                            if (err3) {
                                console.log(err3)
                                console.log("Unable to get policies!")
                            }
                            if (result3.length) {
                                policiesString += "<strong>RESERVATION POLICIES AGREED</strong>";
                                for (let i = 0; i < result3.length; i++) {
                                    policiesString += `<br />${i + 1}. ${result3[i].note}`;
                                }
                            }
                            var modificationMessage;
                            if (modifiedBy !== undefined) {
                                modificationMessage = "The following reservation has been modified/updated by " + modifiedBy + " at " + businessName + ".";
                            } else {
                                modificationMessage = "You have modified/updated the following reservation.";
                            }
                            let businessContactInfo = "";
                            db.query("SELECT * FROM managerContacts WHERE businessName = ?",
                            [businessName], (err4, result4) => {
                                if (err4) {
                                    console.log(err4);
                                    console.log("Unable to get the business's contact information.");
                                }
                                if (result4.length) {
                                    for (let i = 0; i < result4.length; i++) {
                                        businessContactInfo += "<br />" + result4[i].contactType + ": " + result4[i].actualContact;
                                    }
                                }
                                const mailOptions = {
                                    from:
                                    {
                                        name: 'no-reply@scheduleswift.com',
                                        address: 'scheduleswift@gmail.com'
                                    },
                                    to: result2[0].emailAddress,
                                    subject: "Reservation Update Confirmation for " + result2[0].firstName + " at " + businessName,
                                    html: "<html>" +
                                    "<head>" +
                                        "<style>" +
                                            "BODY			{ text-align: center; }" +
                                            "TD				{ font-family:arial;color:black;font-size:11pt;padding:4px;text-align:left; }" +
                                            ".Pref			{ font-size:10pt; }" +
                                            ".note			{ font-size:0.7em; }" +
                                            ".money			{ text-align: right; }" +
                                            ".arrival-button { padding: 10px 60px; text-align: center; background-color: #DB1A27; color: white; font-weight: bold; text-decoration: none; }" +
                                        "</style>" +
                                    "</head>" + 
                                    "<body><table width=\"600\" cellspacing=\"0\" cellpadding=\"0\"><tr><td width=\"600\" colspan=\"2\" align=\"center\" style=\"text-align:center\"><h4><center>RESERVATION UPDATE CONFIRMATION</center></h4><p><center>" + modificationMessage + "</center></p></td></tr>" +
                                        "<tr><td width=\"400\" valign=\"top\">" +
                                        "<br /><br /><strong>" + businessName + "</strong>" +
                                        // IF BUSINESS CONTACT
                                        businessContactInfo + "</td></tr><tr style=\"text-align:right;vertical-align:top\">" +
                                        "<td colspan=\"2\">Reservation ID: <strong>#" + ID + "</strong></td></tr>" +
                                        "<tr><td>Customer Username:</td><td>" + result2[0].username + "</td></tr>" +
                                        "<tr><td>Customer Name:</td><td>" + result2[0].firstName + " " + result2[0].lastName + "</td></tr>" +
                                        "<tr><td>Customer Email:</td><td>" + result2[0].emailAddress + "</td></tr>" +
                                        "<tr><td>Customer Phone Number:</td><td>" + result2[0].phoneNumber + "</td></tr>" +
                                        // "<tr><td colspan=\"2\"><p>Payment Method: Credit Card<br /></p>" +
                                        "<tr><td colspan=\"2\"><p><br /></p>" +
                                        // IF POLICIES
                                        "<p>" + policiesString + "</p>" +
                                        "<strong>RESERVATION DETAILS</strong>" +
                                        "<br />Date of Reservation: <strong>" + reservationSubstring + "</strong>" +
                                        "<br />Time of Reservation: <strong>" + new Date(startTime).toLocaleTimeString() + "</strong> to <strong>" + new Date(endTime).toLocaleTimeString() + "</strong>" +
                                        "<br />Party Size: <strong>" + numPeople + "</strong></td></tr>" +
                                        "<tr><td colspan=\"2\"></td></tr>" +
                                        "<tr /></table><br /><table style=\"border-top:solid 3px black;\" cellspacing=\"0\" cellpadding=\"3\" width=\"600\">" +
                                        allReservableItemsString +
                                        "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\"></td><td width=\"20%\" /><td width=\"5%\" /><td style=\"text-align:right\" /></tr></table>" +
                                        "<table width=\"600\" cellspacing=\"0\" cellpadding=\"0\">" +
                                        "<tr><td width\50%\"><br /><strong>TOTAL</strong></td><td width=\"50%\" class=\"money\"><br /><strong>$" + total.toFixed(2) + "</strong></td></tr>" +
                                        "<tr><td colspan=\"2\" height=\"1\" bgcolor=\"black\" /></tr><tr><td colspan=\"2\"><br />" +
                                        "<p>Thank you for reserving with ScheduleSwift!</p>" +
                                        "</td></tr></table>" +
                                    "</body>" +
                                "</html>"                     
                                }
                                transport.sendMail(mailOptions, (err, res) => {
                                    if (err) {
                                        console.log("Unable to send updated confirmation email.");
                                        console.log(err);
                                    }
                                    else {
                                        console.log("The updated confirmation email was successfully sent.");
                                    }
                                });
                                var indexOfUpdatedReservation;
                                for (let i = 0; i < scheduledEmails.length; i++) {
                                    if (scheduledEmails[i].ID === ID) {
                                        indexOfUpdatedReservation = i;
                                        break;
                                    }
                                }
                                if (scheduledEmails[indexOfUpdatedReservation]) {
                                    console.log("ID of updated reservation: " + scheduledEmails[indexOfUpdatedReservation].ID);
                                    let job = scheduledEmails[indexOfUpdatedReservation].cronSchedule;
                                    setImmediate( () => {
                                        job.stop();
                                    })
                                    const mailOptionsReminder = {
                                        from:
                                        {
                                            name: 'no-reply@scheduleswift.com',
                                            address: 'scheduleswift@gmail.com'
                                        },
                                        to: result2[0].emailAddress,
                                        subject: "Reservation Reminder for " + result2[0].firstName + " at " + businessName,
                                        html: "<html>" +
                                        "<head>" +
                                            "<style>" +
                                                "BODY			{ text-align: center; }" +
                                                "TD				{ font-family:arial;color:black;font-size:11pt;padding:4px;text-align:left; }" +
                                                ".Pref			{ font-size:10pt; }" +
                                                ".note			{ font-size:0.7em; }" +
                                                ".money			{ text-align: right; }" +
                                                ".arrival-button { padding: 10px 60px; text-align: center; background-color: #DB1A27; color: white; font-weight: bold; text-decoration: none; }" +
                                            "</style>" +
                                        "</head>" + 
                                        "<body><table width=\"600\" cellspacing=\"0\" cellpadding=\"0\"><tr><td width=\"600\" colspan=\"2\" align=\"center\" style=\"text-align:center\"><h4><center>Your Reservation is Coming Up!</center></h4><p><center>This is a reminder that the following reservation begins in 24 hours.</center></p></td></tr>" +
                                            "<tr><td width=\"400\" valign=\"top\">" +
                                            "<br /><br /><strong>" + businessName + "</strong>" +
                                            // IF BUSINESS CONTACT
                                            businessContactInfo + "</td></tr><tr style=\"text-align:right;vertical-align:top\">" +
                                            "<td colspan=\"2\">Reservation ID: <strong>#" + ID + "</strong></td></tr>" +
                                            "<tr><td>Customer Username:</td><td>" + result2[0].username + "</td></tr>" +
                                            "<tr><td>Customer Name:</td><td>" + result2[0].firstName + " " + result2[0].lastName + "</td></tr>" +
                                            "<tr><td>Customer Email:</td><td>" + result2[0].emailAddress + "</td></tr>" +
                                            "<tr><td>Customer Phone Number:</td><td>" + result2[0].phoneNumber + "</td></tr>" +
                                            // "<tr><td colspan=\"2\"><p>Payment Method: Credit Card<br /></p>" +
                                            "<tr><td colspan=\"2\"><p><br /></p>" +
                                            // IF POLICIES
                                            "<p>" + policiesString + "</p>" +
                                            "<strong>RESERVATION DETAILS</strong>" +
                                            "<br />Date of Reservation: <strong>" + reservationSubstring + "</strong>" +
                                            "<br />Time of Reservation: <strong>" + new Date(startTime).toLocaleTimeString() + "</strong> to <strong>" + new Date(endTime).toLocaleTimeString() + "</strong>" +
                                            "<br />Party Size: <strong>" + numPeople + "</strong></td></tr>" +
                                            "<tr><td colspan=\"2\"></td></tr>" +
                                            "<tr /></table><br /><table style=\"border-top:solid 3px black;\" cellspacing=\"0\" cellpadding=\"3\" width=\"600\">" +
                                            allReservableItemsString +
                                            "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\"></td><td width=\"20%\" /><td width=\"5%\" /><td style=\"text-align:right\" /></tr></table>" +
                                            "<table width=\"600\" cellspacing=\"0\" cellpadding=\"0\">" +
                                            "<tr><td width\50%\"><br /><strong>TOTAL</strong></td><td width=\"50%\" class=\"money\"><br /><strong>$" + total.toFixed(2) + "</strong></td></tr>" +
                                            "<tr><td colspan=\"2\" height=\"1\" bgcolor=\"black\" /></tr><tr><td colspan=\"2\"><br />" +
                                            "<p>Thank you for reserving with ScheduleSwift!</p>" +
                                            "</td></tr></table>" +
                                        "</body>" +
                                    "</html>"                                 
                                    }
                                    const dateVar = new Date(reservationSubstring + "T00:00");
                                    var reminderTime = new Date(startTime);
                                    reminderTime.setDate(dateVar.getDate() - 1);
                                    const minutes = reminderTime.getMinutes();
                                    const hours = reminderTime.getHours();
                                    const date = reminderTime.getDate();
                                    const month = reminderTime.getMonth() + 1;
                                    const dayOfWeek = reminderTime.getDay();
                                    scheduledEmails[indexOfUpdatedReservation].cronSchedule =
                                        cron.schedule("0 " + minutes + " " + hours + " " + date + " " + month + " " + dayOfWeek + "", function () {
                                            transport.sendMail(mailOptionsReminder, (err, res) => {
                                                if (err) {
                                                    console.log("Unable to send reminder email for Reservation #" + ID + ".");
                                                    console.log(err);
                                                }
                                                else {
                                                    console.log("Reminder email for Reservation #" + ID + " successfully sent.");
                                                }
                                            })
                                        })
                                }
                            })
                        })
                    }
                })
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
    const startTime = reservationSubstring + req.body.startTime.substring(10,);
    const endTime = reservationSubstring + req.body.endTime.substring(10,);
    const numPeople = req.body.numPeople;
    const numReservable = req.body.numReservable;
    db.query("UPDATE userData SET `numActiveReservations` = `numActiveReservations` + 1 WHERE username = ?", [reservedBy], (err4, result4) => {
        if (err4) {
            console.log("Error updating numActiveReservations");
        } else {
            console.log("Successfully updated numActiveReservations");
        }
    });
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
                res.send( { id: result.insertId } );
                db.query("SELECT * from userData WHERE username = ?", [reservedBy], (err2, result2) => {
                    if (err2) {
                        console.log(err2);
                        console.log("Unable to find user");
                    } else {
                        let allReservableItems = reservable.split(";");
                        let allReservablePrices = price.split(";");
                        let allNumReservable = numReservable.split(";");
                        var allReservableItemsString = "";
                        var total = 0;
                        if (allReservableItems.length === 0) {
                            allReservableItemsString += "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\">" + numReservable + " x " + reservable + "</td>";
                            allReservableItemsString += "<td width=\"20%\"> (" + numReservable + " x $" + price + ")" + "</td><td width=\"5%\">=</td>";
                            allReservableItemsString += "<td style=\"text-align:right\">$" + (price * numReservable).toFixed(2) + "</td></tr>";
                            total = price * numReservable;
                        } else {
                            for (let i = 0; i < allReservableItems.length; i++) {
                                allReservableItemsString += "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\">" + allNumReservable[i] + " x " + allReservableItems[i] + "</td>";
                                allReservableItemsString += "<td width=\"20%\"> (" + allNumReservable[i] + " x $" + allReservablePrices[i] + ")" + "</td><td width=\"5%\">=</td>";
                                allReservableItemsString += "<td style=\"text-align:right\">$" + (allReservablePrices[i] * allNumReservable[i]).toFixed(2) + "</td></tr>";
                                total += allReservablePrices[i] * allNumReservable[i];
                            }
                        }
                        let policiesString = "";
                        db.query("SELECT * FROM reservationNotes WHERE businessName = ?",
                        [businessName],
                        (err3, result3) => {
                            if (err3) {
                                console.log(err3)
                                console.log("Unable to get policies!")
                            }
                            if (result3.length) {
                                policiesString += "<strong>RESERVATION POLICIES AGREED</strong>";
                                for (let i = 0; i < result3.length; i++) {
                                    policiesString += `<br />${i + 1}. ${result3[i].note}`;
                                }
                            }
                            let businessContactInfo = "";
                            db.query("SELECT * FROM managerContacts WHERE businessName = ?",
                            [businessName], (err4, result4) => {
                                if (err4) {
                                    console.log(err4);
                                    console.log("Unable to get the business's contact information.");
                                }
                                if (result4.length) {
                                    for (let i = 0; i < result4.length; i++) {
                                        businessContactInfo += "<br />" + result4[i].contactType + ": " + result4[i].actualContact;
                                    }
                                }
                                const mailOptions = {
                                    from:
                                    {
                                        name: 'no-reply@scheduleswift.com',
                                        address: 'scheduleswift@gmail.com'
                                    },
                                    to: result2[0].emailAddress,
                                    subject: "Reservation Confirmation for " + result2[0].firstName + " at " + businessName,
                                    html: "<html>" +
                                    "<head>" +
                                        "<style>" +
                                            "BODY			{ text-align: center; }" +
                                            "TD				{ font-family:arial;color:black;font-size:11pt;padding:4px;text-align:left; }" +
                                            ".Pref			{ font-size:10pt; }" +
                                            ".note			{ font-size:0.7em; }" +
                                            ".money			{ text-align: right; }" +
                                            ".arrival-button { padding: 10px 60px; text-align: center; background-color: #DB1A27; color: white; font-weight: bold; text-decoration: none; }" +
                                        "</style>" +
                                    "</head>" + 
                                    "<body><table width=\"600\" cellspacing=\"0\" cellpadding=\"0\"><tr><td width=\"600\" colspan=\"2\" align=\"center\" style=\"text-align:center\"><h4><center>RESERVATION CONFIRMATION</center></h4></td></tr>" +
                                        "<tr><td width=\"400\" valign=\"top\">" +
                                        "<br /><br /><strong>" + businessName + "</strong>" +
                                        // IF BUSINESS CONTACT
                                        businessContactInfo + "</td></tr><tr style=\"text-align:right;vertical-align:top\">" +
                                        "<td colspan=\"2\">Reservation ID: <strong>#" + result.insertId + "</strong></td></tr>" +
                                        "<tr><td>Customer Username:</td><td>" + result2[0].username + "</td></tr>" +
                                        "<tr><td>Customer Name:</td><td>" + result2[0].firstName + " " + result2[0].lastName + "</td></tr>" +
                                        "<tr><td>Customer Email:</td><td>" + result2[0].emailAddress + "</td></tr>" +
                                        "<tr><td>Customer Phone Number:</td><td>" + result2[0].phoneNumber + "</td></tr>" +
                                        // "<tr><td colspan=\"2\"><p>Payment Method: Credit Card<br /></p>" +
                                        "<tr><td colspan=\"2\"><p><br /></p>" +
                                        // IF POLICIES
                                        "<p>" + policiesString + "</p>" +
                                        "<strong>RESERVATION DETAILS</strong>" +
                                        "<br />Date of Reservation: <strong>" + reservationSubstring + "</strong>" +
                                        "<br />Time of Reservation: <strong>" + new Date(startTime).toLocaleTimeString() + "</strong> to <strong>" + new Date(endTime).toLocaleTimeString() + "</strong>" +
                                        "<br />Party Size: <strong>" + numPeople + "</strong></td></tr>" +
                                        "<tr><td colspan=\"2\"></td></tr>" +
                                        "<tr /></table><br /><table style=\"border-top:solid 3px black;\" cellspacing=\"0\" cellpadding=\"3\" width=\"600\">" +
                                        allReservableItemsString +
                                        "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\"></td><td width=\"20%\" /><td width=\"5%\" /><td style=\"text-align:right\" /></tr></table>" +
                                        "<table width=\"600\" cellspacing=\"0\" cellpadding=\"0\">" +
                                        "<tr><td width\50%\"><br /><strong>TOTAL</strong></td><td width=\"50%\" class=\"money\"><br /><strong>$" + total.toFixed(2) + "</strong></td></tr>" +
                                        "<tr><td colspan=\"2\" height=\"1\" bgcolor=\"black\" /></tr><tr><td colspan=\"2\"><br />" +
                                        "<p>Thank you for reserving with ScheduleSwift!</p>" +
                                        "</td></tr></table>" +
                                    "</body>" +
                                "</html>"                     
                                }
                                transport.sendMail(mailOptions, (err, res) => {
                                    if (err) {
                                        console.log("Unable to send reservation confirmation email.");
                                        console.log(err);
                                    } else {
                                        console.log("The reservation confirmation email was successfully sent.");
                                    }
                                });
                                
                                const mailOptionsReminder = {
                                    from:
                                    {
                                        name: 'no-reply@scheduleswift.com',
                                        address: 'scheduleswift@gmail.com'
                                    },
                                    to: result2[0].emailAddress,
                                    subject: "Reservation Reminder for " + result2[0].firstName + " at " + businessName,
                                    html: "<html>" +
                                    "<head>" +
                                        "<style>" +
                                            "BODY			{ text-align: center; }" +
                                            "TD				{ font-family:arial;color:black;font-size:11pt;padding:4px;text-align:left; }" +
                                            ".Pref			{ font-size:10pt; }" +
                                            ".note			{ font-size:0.7em; }" +
                                            ".money			{ text-align: right; }" +
                                            ".arrival-button { padding: 10px 60px; text-align: center; background-color: #DB1A27; color: white; font-weight: bold; text-decoration: none; }" +
                                        "</style>" +
                                    "</head>" + 
                                    "<body><table width=\"600\" cellspacing=\"0\" cellpadding=\"0\"><tr><td width=\"600\" colspan=\"2\" align=\"center\" style=\"text-align:center\"><h4><center>Your Reservation is Coming Up!</center></h4><p><center>This is a reminder that the following reservation begins in 24 hours.</center></p></td></tr>" +
                                        "<tr><td width=\"400\" valign=\"top\">" +
                                        "<br /><br /><strong>" + businessName + "</strong>" +
                                        // IF BUSINESS CONTACT
                                        businessContactInfo + "</td></tr><tr style=\"text-align:right;vertical-align:top\">" +
                                        "<td colspan=\"2\">Reservation ID: <strong>#" + result.insertId + "</strong></td></tr>" +
                                        "<tr><td>Customer Username:</td><td>" + result2[0].username + "</td></tr>" +
                                        "<tr><td>Customer Name:</td><td>" + result2[0].firstName + " " + result2[0].lastName + "</td></tr>" +
                                        "<tr><td>Customer Email:</td><td>" + result2[0].emailAddress + "</td></tr>" +
                                        "<tr><td>Customer Phone Number:</td><td>" + result2[0].phoneNumber + "</td></tr>" +
                                        // "<tr><td colspan=\"2\"><p>Payment Method: Credit Card<br /></p>" +
                                        "<tr><td colspan=\"2\"><p><br /></p>" +
                                        // IF POLICIES
                                        "<p>" + policiesString + "</p>" +
                                        "<strong>RESERVATION DETAILS</strong>" +
                                        "<br />Date of Reservation: <strong>" + reservationSubstring + "</strong>" +
                                        "<br />Time of Reservation: <strong>" + new Date(startTime).toLocaleTimeString() + "</strong> to <strong>" + new Date(endTime).toLocaleTimeString() + "</strong>" +
                                        "<br />Party Size: <strong>" + numPeople + "</strong></td></tr>" +
                                        "<tr><td colspan=\"2\"></td></tr>" +
                                        "<tr /></table><br /><table style=\"border-top:solid 3px black;\" cellspacing=\"0\" cellpadding=\"3\" width=\"600\">" +
                                        allReservableItemsString +
                                        "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\"></td><td width=\"20%\" /><td width=\"5%\" /><td style=\"text-align:right\" /></tr></table>" +
                                        "<table width=\"600\" cellspacing=\"0\" cellpadding=\"0\">" +
                                        "<tr><td width\50%\"><br /><strong>TOTAL</strong></td><td width=\"50%\" class=\"money\"><br /><strong>$" + total.toFixed(2) + "</strong></td></tr>" +
                                        "<tr><td colspan=\"2\" height=\"1\" bgcolor=\"black\" /></tr><tr><td colspan=\"2\"><br />" +
                                        "<p>Thank you for reserving with ScheduleSwift!</p>" +
                                        "</td></tr></table>" +
                                    "</body>" +
                                "</html>"                                 
                                }
                                const dateVar = new Date(reservationSubstring + "T00:00");
                                var reminderTime = new Date(startTime);
                                reminderTime.setDate(dateVar.getDate() - 1);
                                const minutes = reminderTime.getMinutes();
                                const hours = reminderTime.getHours();
                                const date = reminderTime.getDate();
                                const month = reminderTime.getMonth() + 1;
                                const dayOfWeek = reminderTime.getDay();
                                var newScheduledEmail = {
                                    ID: result2[0].insertId,
                                    cronSchedule: 
                                        cron.schedule("0 " + minutes + " " + hours + " " + date + " " + month + " " + dayOfWeek + "", function () {
                                            transport.sendMail(mailOptionsReminder, (err, res) => {
                                                if (err) {
                                                    console.log("Unable to send reminder email for Reservation #" + result.insertId + ".");
                                                    console.log(err);
                                                }
                                                else {
                                                    console.log("Reminder email for Reservation #" + result.insertId + " successfully sent.");
                                                }
                                            })
                                        }),
                                }
                                scheduledEmails.push(newScheduledEmail);
                            });
                        });
                    }
                });
            }
    });
});

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

app.post("/api/getMaxAvailable", (req, res) => {
    const businessName = req.body.businessName;
    const date = req.body.date;
    db.query(
        "SELECT * FROM reservations WHERE businessName = ? AND reservationDate = ?",
        [businessName, date],
        (err, result) => {
            console.log( `Reservation on ${date}:`)
            if (err) {
                console.log(err)
                res.send({ err: err })
            }
            if (result.length > 0) {
                console.log( {result} )
                res.send({ result : result })
            } else {
                res.send({err : "none"});
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
    var indexOfCancelledReservation;
    for (let i = 0; i < scheduledEmails.length; i++) {
        if (scheduledEmails[i].ID === reservationID) {
            indexOfCancelledReservation = i;
            break;
        }
    }
    console.log(scheduledEmails[indexOfCancelledReservation]);
    if (scheduledEmails[indexOfCancelledReservation]) {
        let job = scheduledEmails[indexOfCancelledReservation].cronSchedule
        setImmediate( () => {
            job.stop();
        })
        scheduledEmails.splice(indexOfCancelledReservation, 1);
    }
    db.query(
        "SELECT * FROM reservations WHERE ID = ?",
        [reservationID], (err3, result3) => {
            if (err3) {
                console.log(err3);
                console.log("Unable to find reservation");
            } else {
                db.query("UPDATE userData SET `numCancelledReservations` = `numCancelledReservations` + 1, `numActiveReservations` = `numActiveReservations` - 1 WHERE username = ?", [result3[0].reservedBy], (err4, result4) => {
                    if (err4) {
                        console.log("Error updating numCancelledReservations & numActiveReservations");
                    } else {
                        console.log("Successfully updated numCancelledReservations & numActiveReservations");
                    }
                });
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
                            db.query(
                                "SELECT * FROM userData WHERE username = ?",
                                [result3[0].reservedBy], (err2, result2) => {
                                    if (err2) {
                                        console.log(err2);
                                        console.log("Unable to find user");
                                    } else {
                                        let allReservableItems = result3[0].reservableItem.split(";");
                                        let allReservablePrices = result3[0].price.split(";");
                                        let allNumReservable = result3[0].numReservable.split(";");
                                        var allReservableItemsString = "";
                                        var total = 0;
                                        if (allReservableItems.length === 0) {
                                            allReservableItemsString += "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\">" + result3[0].numReservable + " x " + result3[0].reservableItem + "</td>";
                                            allReservableItemsString += "<td width=\"20%\"> (" + result3[0].numReservable + " x $" + result3[0].price + ")" + "</td><td width=\"5%\">=</td>";
                                            allReservableItemsString += "<td style=\"text-align:right\">$" + (result3[0].price * result3[0].numReservable).toFixed(2) + "</td></tr>";
                                            total = result3[0].price * result3[0].numReservable;
                                        } else {
                                            for (i = 0; i < allReservableItems.length; i++) {
                                                allReservableItemsString += "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\">" + allNumReservable[i] + " x " + allReservableItems[i] + "</td>";
                                                allReservableItemsString += "<td width=\"20%\"> (" + allNumReservable[i] + " x $" + allReservablePrices[i] + ")" + "</td><td width=\"5%\">=</td>";
                                                allReservableItemsString += "<td style=\"text-align:right\">$" + (allReservablePrices[i] * allNumReservable[i]).toFixed(2) + "</td></tr>";
                                                total += allReservablePrices[i] * allNumReservable[i];
                                            }
                                        }
                                        let policiesString = "";
                                        db.query("SELECT * FROM reservationNotes WHERE businessName = ?",
                                        [result3[0].businessName],
                                        (err4, result4) => {
                                            if (err4) {
                                                console.log(err4)
                                                console.log("Unable to get policies!")
                                            }
                                            if (result4.length) {
                                                policiesString += "<strong>RESERVATION POLICIES AGREED</strong>";
                                                for (let i = 0; i < result4.length; i++) {
                                                    policiesString += `<br />${i + 1}. ${result3[i].note}`;
                                                }
                                            }
                                            let businessContactInfo = "";
                                            db.query("SELECT * FROM managerContacts WHERE businessName = ?",
                                            [result3[0].businessName], (err4, result4) => {
                                                if (err4) {
                                                    console.log(err4);
                                                    console.log("Unable to get the business's contact information.");
                                                }
                                                if (result4.length) {
                                                    for (let i = 0; i < result4.length; i++) {
                                                        businessContactInfo += "<br />" + result4[i].contactType + ": " + result4[i].actualContact;
                                                    }
                                                }
                                                const mailOptions = {
                                                    from:
                                                        {
                                                            name: 'no-reply@scheduleswift.com',
                                                            address: 'scheduleswift@gmail.com'
                                                        },
                                                    to: result2[0].emailAddress,
                                                    subject: "Reservation Cancellation Confirmation for " + result2[0].firstName + " at " + result3[0].businessName,
                                                    html: "<html>" +
                                                    "<head>" +
                                                        "<style>" +
                                                            "BODY			{ text-align: center; }" +
                                                            "TD				{ font-family:arial;color:black;font-size:11pt;padding:4px;text-align:left; }" +
                                                            ".Pref			{ font-size:10pt; }" +
                                                            ".note			{ font-size:0.7em; }" +
                                                            ".money			{ text-align: right; }" +
                                                            ".arrival-button { padding: 10px 60px; text-align: center; background-color: #DB1A27; color: white; font-weight: bold; text-decoration: none; }" +
                                                        "</style>" +
                                                    "</head>" + 
                                                    "<body><table width=\"600\" cellspacing=\"0\" cellpadding=\"0\"><tr><td width=\"600\" colspan=\"2\" align=\"center\" style=\"text-align:center\"><h4><center>RESERVATION CANCELLATION CONFIRMATION</center></h4><p><center>The following reservation has been cancelled.</center></p> \
                                                    Please contact " + result3[0].businessName + " if you have any questions or concerns.</td></tr>" +
                                                    "<tr><td width=\"400\" valign=\"top\">" +
                                                    "<br /><br /><strong>" + result3[0].businessName + "</strong>" +
                                                    // IF BUSINESS CONTACT
                                                    businessContactInfo + "</td></tr><tr style=\"text-align:right;vertical-align:top\">" +
                                                    "<td colspan=\"2\">Reservation ID: <strong>#" + result3[0].ID + "</strong></td></tr>" +
                                                    "<tr><td>Customer Username:</td><td>" + result2[0].username + "</td></tr>" +
                                                    "<tr><td>Customer Name:</td><td>" + result2[0].firstName + " " + result2[0].lastName + "</td></tr>" +
                                                    "<tr><td>Customer Email:</td><td>" + result2[0].emailAddress + "</td></tr>" +
                                                    "<tr><td>Customer Phone Number:</td><td>" + result2[0].phoneNumber + "</td></tr>" +
                                                    // "<tr><td colspan=\"2\"><p>Payment Method: Credit Card<br /></p>" +
                                                    "<tr><td colspan=\"2\"><p><br /></p>" +
                                                    // IF POLICIES
                                                    "<p>" + policiesString + "</p>" +                                                
                                                    "<strong>RESERVATION DETAILS</strong>" +
                                                    "<br />Date of Reservation: <strong>" + result3[0].reservationDate.substring(0, 10) + "</strong>" +
                                                    "<br />Time of Reservation: <strong>" + new Date(result3[0].startTime).toLocaleTimeString() + "</strong> to <strong>" + new Date(result3[0].endTime).toLocaleTimeString() + "</strong>" +
                                                    "<br />Party Size: <strong>" + result3[0].numPeople + "</strong></td></tr>" +
                                                    "<tr><td colspan=\"2\"></td></tr>" +
                                                    "<tr /></table><br /><table style=\"border-top:solid 3px black;\" cellspacing=\"0\" cellpadding=\"3\" width=\"600\">" +
                                                    allReservableItemsString +
                                                    "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\"></td><td width=\"20%\" /><td width=\"5%\" /><td style=\"text-align:right\" /></tr></table>" +
                                                    "<table width=\"600\" cellspacing=\"0\" cellpadding=\"0\">" +
                                                    "<tr><td width\50%\"><br /><strong>TOTAL</strong></td><td width=\"50%\" class=\"money\"><br /><strong>$" + total.toFixed(2) + "</strong></td></tr>" +
                                                    "<tr><td colspan=\"2\" height=\"1\" bgcolor=\"black\" /></tr><tr><td colspan=\"2\"><br />" +
                                                    "<p>Thank you for reserving with ScheduleSwift!</p>" +
                                                    "</td></tr></table>" +
                                                    "</body>" +
                                                "</html>"                     
                                                }
                                                transport.sendMail(mailOptions, (err, res) => {
                                                    if (err) {
                                                        console.log("Unable to send cancellation confirmation email.");
                                                        console.log(err);
                                                    } else {
                                                        console.log("The cancellation confirmation email was successfully sent.");
                                                    }
                                                });
                                            });
                                        })
                                    }
                                }
                            )
                        }
                    }
                )
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

app.post("/api/managerChangePrice", (req, res) => {
    const id = req.body.id;
    const newPrice = req.body.newPrice;

    console.log(id);
    console.log(newPrice);

    
    db.query(
        "UPDATE reservations SET price = ? WHERE ID = ?",
        [newPrice, id],
        (err, result) => {          
        console.log(result);
            if (err) {
                console.log(err);
                res.send({ err: err })
            }
            if (result) {
                res.send({ result })
            }}
                
        )
})

app.post("/api/addReservationNote", (req, res) => {
    const businessName = req.body.businessName;
    const note = req.body.note;
    db.query(
        "INSERT INTO reservationNotes (businessName, note) VALUES (?,?)",
        [businessName, note],
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

app.post("/api/editReservationNote", (req, res) => {
    const note = req.body.note;
    const id = req.body.id;
    console.log(id);
    db.query(
        "UPDATE reservationNotes SET note = ? WHERE ID = ?",
        [note, id],
        (err, result) => { 
        console.log(result);
            if (err) {
                console.log(err);
                res.send({ err: err })
            }
            if (result) {
                res.send({ result })
            }}
    )
})

app.post("/api/reservationGetNotes", (req, res) => {
    const businessName = req.body.businessName;

    db.query(
        "SELECT * FROM reservationNotes WHERE businessName = ?",
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

app.post("/api/reservationDeleteNote", (req, res) => {
    const noteID = req.body.noteID;
    console.log(noteID);
    db.query(
        "DELETE FROM reservationNotes WHERE ID = ?",
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

app.post("/api/addNonReserve", (req,res) => {
    const businessName = req.body.businessName;
    const nonReservable = req.body.nonReservable;
    const price = req.body.price;
    db.query(
        "INSERT INTO nonReservables (businessName, nonReservable, price) VALUES (?, ?, ?)",
        [businessName, nonReservable, price],
        (err, result) => {
            if (err) {
                console.log(err)
            }
            if (result) {
                console.log({result})
                res.send({result})
            }
        }
    )
})

app.post("/api/addManagerFAQ", (req, res) => {
    const businessName = req.body.businessName;
    const question = req.body.question;
    const answer = req.body.answer;
    db.query(
        "INSERT INTO managerFAQ (businessName, question, answer) VALUES (?,?,?)",
        [businessName, question, answer],
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
app.post("/api/getNonReserves", (req, res) => {
    const businessName = req.body.businessName;
    db.query(
        "SELECT * FROM nonReservables WHERE businessName = ?",
        [businessName],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({err: err})
            }
            if (result) {
                console.log(result)
                res.send({result:result})
            }
        }
    )
})
app.post("/api/managerGetFAQ", (req, res) => {
    const businessName = req.body.businessName;

    db.query(
        "SELECT * FROM managerFAQ WHERE businessName = ?",
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

app.post("/api/managerDeleteFAQ", (req, res) => {
    const faqID = req.body.faqID;
    db.query(
        "DELETE FROM managerFAQ WHERE ID = ?",
        [faqID],
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

app.post("/api/deleteNonReserve", (req, res) => {
    const nonResID = req.body.nonResID;
    db.query(
        "DELETE FROM nonReservables WHERE ID = ?",
        [nonResID],
        (err, result) => {
            if (err) {
                console.log(err)
            }
            if (result) {
                console.log(result)
                res.send({result: result})
            }
        }
    )
})

app.post("/api/addExceptionDate", (req, res) => {
    const businessName = req.body.businessName;
    let date = req.body.date;
    let dateSubstring = date.substring(0, 10);
    let startTime = req.body.startTime.substring(10,);
    startTime?startTime = dateSubstring + startTime:startTime = "closed";
    let endTime = req.body.endTime.substring(10,);
    endTime?endTime = dateSubstring + endTime:endTime = "closed";
    db.query(
        "INSERT INTO dateExceptions (businessName, date, startTime, endTime) VALUES (?,?,?,?)",
        [businessName, dateSubstring, startTime, endTime],
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

app.post("/api/getExceptionDates", (req, res) => {
    const businessName = req.body.businessName;

    db.query(
        "SELECT * FROM dateExceptions WHERE businessName = ?",
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

app.post("/api/deleteExceptionDate", (req, res) => {
    const id = req.body.id;
    db.query(
        "DELETE FROM dateExceptions WHERE ID = ?",
        [id],
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

app.post("/api/employeeDeleteReservation", (req, res) => {
    const reservationID = req.body.reservationID;
    db.query(
        "SELECT * FROM reservations WHERE ID = ?",
        [reservationID], (err3, result3) => {
            if (err3) {
                console.log(err3);
                console.log("Unable to find reservation");
            } else {
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
            }
        }
    )
})

app.post("/api/getDailyReservations", (req, res) => {
    const businessName = req.body.businessName;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day  = new Date().getDate();
    const formatted = `${year}-${month}-${day}`;
    const isReserved = 'Yes';
    db.query(
        "SELECT * FROM reservations WHERE businessName = ? AND reservationDate = ? AND isReserved = ?",
        [businessName, formatted, isReserved],
        (err, result) => {
            if (err) {
                console.log(err);
                res.send({err: err})
            }
            if (result) {
                console.log(result);
                res.send({result})
            }
        }
    )
})

app.post("/api/getShifts", (req, res) => {

    const username = req.body.username;

    console.log(req.body);

    db.query(
        "SELECT * FROM shifts WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                console.log(err);
                res.send({err: err})
            }
            if (result) {
                console.log(result);
                res.send({result})
            }
        }
    )

})

app.post("/api/getEmployeeName", (req, res) => {

    const username = req.body.username;

    db.query(
        "SELECT * FROM employeeData WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                res.send({err: err})
            }
            if (result) {
                res.send({result})
            }
        }
    )
})

app.post("/api/findOpenShift", (req, res) => {

    const username = req.body.username;
    const completed = 'no';

    db.query(
        "SELECT * FROM shifts WHERE username = ? AND completed = ?",
        [username, completed],
        (err, result) => {
            if (err) {
                res.send({err})
            }
            if (result) {
                console.log(result);
                res.send({result})
            }
        }
    )
})

app.post("/api/createShifts", (req, res) => {

    const username = req.body.username;

    let finalMinute;

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day  = new Date().getDate();
    const formatted = `${year}-${month}-${day}`;

    let hour = new Date().getHours();
    let minute = new Date().getMinutes();

    if (minute < 10) {
        finalMinute = `0${minute}`;
    } else {
        finalMinute = minute;
    }
    let ampm = 'AM';
    
    if (parseInt(hour) > 12) {
        hour = hour - 12
        ampm = "PM"
    }

    const time = `${hour}:${finalMinute} ${ampm}`;
    const time2 = `none`;
    const completed = 'no';
    const time3 = new Date().getTime();
    console.log(time3);

    db.query(
        "INSERT INTO shifts (date, username, timeClockedIn, timeClockedOut, timeOfShift, completed, time) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [formatted, username, time, time2, time2, completed, time3],
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

app.post("/api/closeShift", (req, res) => {

    const ID = req.body.ID;
    const oldTime = req.body.oldTime;
    const completed = "Yes";
    let finalMinute;

    const time = new Date().getTime();

    const totalMinutes = Math.floor((time - oldTime) / 60000);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let hour = new Date().getHours();
    let minute = new Date().getMinutes();

    if (minute < 10) {
        finalMinute = `0${minute}`;
    } else {
        finalMinute = minute;
    }
    let ampm = 'AM';
    
    if (parseInt(hour) > 12) {
        hour = hour - 12
        ampm = "PM"
    }

    const time2 = `${hour}:${finalMinute} ${ampm}`;

    const totalTime = `${hours}hrs ${minutes}mins`;

    db.query(
        "UPDATE shifts SET timeClockedOut = ?, timeOfShift = ?, completed = ? WHERE ID = ?",
        [time2, totalTime, completed, ID],
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

app.post("/api/managerGetContact", (req, res) => {

    const businessName = req.body.businessName;

    db.query(
        "SELECT * FROM managerContacts WHERE businessName = ?",
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

app.post("/api/addManagerContact", (req, res) => {
    const businessName = req.body.businessName;
    const contactType = req.body.contactType;
    const actualContact = req.body.actualContact;
    db.query(
        "INSERT INTO managerContacts (businessName, contactType, actualContact) VALUES (?,?,?)",
        [businessName, contactType, actualContact],
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

app.post("/api/managerDeleteContact", (req, res) => {
    const contactID = req.body.contactID;
    db.query(
        "DELETE FROM managerContacts WHERE ID = ?",
        [contactID],
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

app.post("/api/getEmployees", (req, res) => {
    const businessName = req.body.businessName;
    db.query(
        "SELECT * FROM employeeData WHERE businessName = ?",
        [businessName],
        (err, result) => {
            if (err) {
                console.log(err)
            }
            if (result) {
                console.log(result)
                res.send({result: result})
            }
        }
    )
})

app.post("/api/checkDelete", (req, res) => {
    const username = req.body.username;
    const del = "Yes";
    db.query(
        "SELECT * FROM permissions WHERE username = ? AND deleteReservations = ?",
        [username, del],
        (err, result) => {
            if (err) {
                console.log(err)
            }
            if (result.length == 0) {
                res.send("No");
            } else {
                res.send("Yes");
            }
        }
    )
})

app.post("/api/checkEdit", (req, res) => {
    const username = req.body.username;
    const del = "Yes";
    db.query(
        "SELECT * FROM permissions WHERE username = ? AND editReservations = ?",
        [username, del],
        (err, result) => {
            if (err) {
                console.log(err)
            }
            if (result.length == 0) {
                res.send("No");
            } else {
                res.send("Yes");
            }
        }
    )
})

app.post("/api/checkView", (req, res) => {
    const username = req.body.username;
    console.log(username);
    const del = "Yes";
    db.query(
        "SELECT * FROM permissions WHERE username = ? AND viewReservations = ?",
        [username, del],
        (err, result) => {
            if (err) {
                console.log(err)
            }
            console.log("HERE");
            console.log(result);
            console.log("HERE");
            if (result.length == 0) {
                res.send("No");
            } else {
                res.send("Yes");
            }
        }
    )
})

app.post("/api/defaultPermissions", (req, res) => {
    const username = req.body.username;
    const del = "No"
    db.query(
        "INSERT INTO permissions (username, deleteReservations, editReservations, viewReservations) VALUES (?, ?, ?, ?)",
        [username, del, del, del],
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

app.post("/api/getPermissions", (req, res) => {
    const username = req.body.username;
    db.query(
        "SELECT * FROM permissions WHERE username = ?",
        [username],
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

app.post("/api/changeDelete", (req, res) => {
    const username = req.body.username;
    const changed = req.body.changed;
    db.query(
        "UPDATE permissions SET deleteReservations = ? WHERE username = ?",
        [changed, username],
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

app.post("/api/changeEdit", (req, res) => {
    const username = req.body.username;
    const changed = req.body.changed;
    db.query(
        "UPDATE permissions SET editReservations = ? WHERE username = ?",
        [changed, username],
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

app.post("/api/changeView", (req, res) => {
    const username = req.body.username;
    const changed = req.body.changed;
    db.query(
        "UPDATE permissions SET viewReservations = ? WHERE username = ?",
        [changed, username],
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

app.post("/api/deleteEmployee", (req, res) => {
    const username = req.body.username;

    db.query(
        "DELETE FROM employeeData WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                console.log(err)
            }
            if (result) {
                //console.log({ result })
                //res.send({ result })
                db.query(
                    "DELETE FROM permissions WHERE username = ?",
                    [username],
                    (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        if (result) {
                            //console.log({ result })
                            //res.send({ result })
                            db.query(
                                "DELETE FROM shifts WHERE username = ?",
                                [username],
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
                        }
                    }
                )

            }
        }
    )
})

var scheduledEmails = new Array();

app.listen(port, () => {
    console.log("Running on Port 3001");

    db.query(
        "SELECT * FROM reservations",
        (err, result) => {
            if (err) {
                console.log(err);
                console.log("Unable to select reservations for scheduling emails");
            } else {
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        db.query (
                            "SELECT * FROM userData WHERE username = ?",
                            [result[i].reservedBy], (err2, result2) => {
                                if (err2) {
                                    console.log(err2);
                                    console.log("Unable to find user with that username for scheduling emails");
                                } else {
                                    let allReservableItems = result[i].reservableItem.split(";");
                                    let allReservablePrices = result[i].price.split(";");
                                    let allNumReservable = result[i].numReservable.split(";");
                                    var allReservableItemsString = "";
                                    var total = 0;
                                    if (allReservableItems.length === 0) {
                                        allReservableItemsString += "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\">" + result[i].numReservable + " x " + result[i].reservableItem + "</td>";
                                        allReservableItemsString += "<td width=\"20%\"> (" + result[i].numReservable + " x $" + result[i].price + ")" + "</td><td width=\"5%\">=</td>";
                                        allReservableItemsString += "<td style=\"text-align:right\">$" + (result[i].price * result[i].numReservable).toFixed(2) + "</td></tr>";
                                        total = result[i].price * result[i].numReservable;
                                    } else {
                                        for (let j = 0; j < allReservableItems.length; j++) {
                                            allReservableItemsString += "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\">" + allNumReservable[j] + " x " + allReservableItems[j] + "</td>";
                                            allReservableItemsString += "<td width=\"20%\"> (" + allNumReservable[j] + " x $" + allReservablePrices[j] + ")" + "</td><td width=\"5%\">=</td>";
                                            allReservableItemsString += "<td style=\"text-align:right\">$" + (allReservablePrices[j] * allNumReservable[j]).toFixed(2) + "</td></tr>";
                                            total += allReservablePrices[j] * allNumReservable[j];
                                        }
                                    }
                                    let policiesString = "";
                                    db.query("SELECT * FROM reservationNotes WHERE businessName = ?",
                                    [result[i].businessName],
                                    (err3, result3) => {
                                        if (err3) {
                                            console.log(err3)
                                            console.log("Unable to get policies!")
                                        }
                                        if (result3.length) {
                                            policiesString += "<strong>RESERVATION POLICIES AGREED</strong>";
                                            for (let i = 0; i < result3.length; i++) {
                                                policiesString += `<br />${i + 1}. ${result3[i].note}`;
                                            }
                                        }
                                        let businessContactInfo = "";
                                        db.query("SELECT * FROM managerContacts WHERE businessName = ?",
                                        [result[i].businessName], (err4, result4) => {
                                            if (err4) {
                                                console.log(err4);
                                                console.log("Unable to get the business's contact information.")
                                            }
                                            if (result4.length) {
                                                for (let i = 0; i < result4.length; i++) {
                                                    businessContactInfo += "<br />" + result4[i].contactType + ": " + result4[i].actualContact;
                                                }
                                            }
                                            const mailOptionsReminder = {
                                                from:
                                                {
                                                    name: 'no-reply@scheduleswift.com',
                                                    address: 'scheduleswift@gmail.com'
                                                },
                                                to: result2[0].emailAddress,
                                                subject: "Reservation Reminder for " + result2[0].firstName + " at " + result[i].businessName,
                                                html: "<html>" +
                                                "<head>" +
                                                    "<style>" +
                                                        "BODY			{ text-align: center; }" +
                                                        "TD				{ font-family:arial;color:black;font-size:11pt;padding:4px;text-align:left; }" +
                                                        ".Pref			{ font-size:10pt; }" +
                                                        ".note			{ font-size:0.7em; }" +
                                                        ".money			{ text-align: right; }" +
                                                        ".arrival-button { padding: 10px 60px; text-align: center; background-color: #DB1A27; color: white; font-weight: bold; text-decoration: none; }" +
                                                    "</style>" +
                                                "</head>" + 
                                                "<body><table width=\"600\" cellspacing=\"0\" cellpadding=\"0\"><tr><td width=\"600\" colspan=\"2\" align=\"center\" style=\"text-align:center\"><h4><center>Your Reservation is Coming Up!</center></h4><p><center>This is a reminder that the following reservation begins in 24 hours.</center></p></td></tr>" +
                                                    "<tr><td width=\"400\" valign=\"top\">" +
                                                    "<br /><br /><strong>" + result[i].businessName + "</strong>" +
                                                    // IF BUSINESS CONTACT
                                                    businessContactInfo + "</td></tr><tr style=\"text-align:right;vertical-align:top\">" +
                                                    "<td colspan=\"2\">Reservation ID: <strong>#" + result[i].ID + "</strong></td></tr>" +
                                                    "<tr><td>Customer Username:</td><td>" + result2[0].username + "</td></tr>" +
                                                    "<tr><td>Customer Name:</td><td>" + result2[0].firstName + " " + result2[0].lastName + "</td></tr>" +
                                                    "<tr><td>Customer Email:</td><td>" + result2[0].emailAddress + "</td></tr>" +
                                                    "<tr><td>Customer Phone Number:</td><td>" + result2[0].phoneNumber + "</td></tr>" +
                                                    // "<tr><td colspan=\"2\"><p>Payment Method: Credit Card<br /></p>" +
                                                    "<tr><td colspan=\"2\"><p><br /></p>" +
                                                    // IF POLICIES
                                                    "<p>" + policiesString + "</p>" +
                                                    "<strong>RESERVATION DETAILS</strong>" +
                                                    "<br />Date of Reservation: <strong>" + result[i].reservationDate + "</strong>" +
                                                    "<br />Time of Reservation: <strong>" + new Date(result[i].startTime).toLocaleTimeString() + "</strong> to <strong>" + new Date(result[i].endTime).toLocaleTimeString() + "</strong>" +
                                                    "<br />Party Size: <strong>" + result[i].numPeople + "</strong></td></tr>" +
                                                    "<tr><td colspan=\"2\"></td></tr>" +
                                                    "<tr /></table><br /><table style=\"border-top:solid 3px black;\" cellspacing=\"0\" cellpadding=\"3\" width=\"600\">" +
                                                    allReservableItemsString +
                                                    "<tr><td width=\"60%\" class=\"AttentionText\" colspan=\"2\"></td><td width=\"20%\" /><td width=\"5%\" /><td style=\"text-align:right\" /></tr></table>" +
                                                    "<table width=\"600\" cellspacing=\"0\" cellpadding=\"0\">" +
                                                    "<tr><td width\50%\"><br /><strong>TOTAL</strong></td><td width=\"50%\" class=\"money\"><br /><strong>$" + total.toFixed(2) + "</strong></td></tr>" +
                                                    "<tr><td colspan=\"2\" height=\"1\" bgcolor=\"black\" /></tr><tr><td colspan=\"2\"><br />" +
                                                    "<p>Thank you for reserving with ScheduleSwift!</p>" +
                                                    "</td></tr></table>" +
                                                "</body>" +
                                            "</html>"                                 
                                            }
                                            const dateVar = new Date(result[i].reservationDate + "T00:00");
                                            var reminderTime = new Date(result[i].startTime);
                                            reminderTime.setDate(dateVar.getDate() - 1);
                                            const minutes = reminderTime.getMinutes();
                                            const hours = reminderTime.getHours();
                                            const date = reminderTime.getDate();
                                            const month = reminderTime.getMonth() + 1;
                                            const dayOfWeek = reminderTime.getDay();
                                            var newScheduledEmail = {
                                                ID: result[i].ID,
                                                cronSchedule: 
                                                    cron.schedule("0 " + minutes + " " + hours + " " + date + " " + month + " " + dayOfWeek + "", function () {
                                                        transport.sendMail(mailOptionsReminder, (err, res) => {
                                                            if (err) {
                                                                console.log("Unable to send reminder email for Reservation #" + result[i].ID + ".");
                                                                console.log(err);
                                                            }
                                                            else {
                                                                console.log("Reminder email for Reservation #" + result[i].ID + " successfully sent.");
                                                            }
                                                        })
                                                    }),
                                            }
                                            scheduledEmails.push(newScheduledEmail);
                                        })
                                    })
                                }
                            }
                        )
                    }
                }
            }
        }
    );
    // GARBAGE COLLECTOR
    // For the first run if it crashes
    GarbageCollector();
    // It runs every day 0 0 * * *
    cron.schedule("0 0 * * *", function () {
        GarbageCollector();
    });
})

function GarbageCollector() {
    console.log("Running Garbage Collector");
    db.query(
        "SELECT * FROM reservations",
        (err, result) => {
            if (err) {
                console.log(err);
                console.log("There was an error with the garbage collector running a query")
            }
            if (result.length > 0) {
                var deleted = 0;
                for (let i = 0; i < result.length; i++) {
                    // Deletes all reservations two days prior to the current UTC times to avoid deleting reservations that havenot happened in current time
                    if (new Date(result[i].reservationDate) < new Date(new Date().setDate(new Date().getDate() - 2))) {
                        db.query("SELECT * FROM reservations WHERE ID = ?", [result[i].ID], (err2, result2) => {
                            if (err2) {
                                console.log("Error retreiving reservation with ID " + result[i].ID);
                            } else {
                                db.query("UPDATE userData SET `numCompletedReservations` = `numCompletedReservations` + 1, SET `numActiveReservations` = `numActiveReservations` - 1 WHERE username = ? "),
                                [result.data.result[0].reservedBy], (err3, result3) => {
                                    if (err3) {
                                        console.log("Error updating numCompletedReservations");
                                    } else {
                                        console.log("Successfully updated numCompletedReservations");
                                    }
                                }
                            }
                        })
                        db.query(
                            "DELETE FROM reservations WHERE ID = ?",
                            [result[i].ID], (err1, result1) => {
                                if (err1) {
                                    console.log("ERROR REMOVING GARBAGE FROM DATABASE");
                                }
                                else {
                                    console.log("SUCCESS REMOVAL OF " + result[i].ID);
                                    var indexOfCancelledReservation = -1;
                                    var reservationID = result[i].ID;
                                    for (let j = 0; j < scheduledEmails.length; j++) {
                                        if (scheduledEmails[j].ID === reservationID) {
                                            indexOfCancelledReservation = j;
                                            break;
                                        }
                                    }
                                    if (scheduledEmails[indexOfCancelledReservation] && indexOfCancelledReservation >= 0) {
                                        // console.log("cancelled reservation ID: " + scheduledEmails[indexOfCancelledReservation].ID);
                                        let job = scheduledEmails[indexOfCancelledReservation].cronSchedule;
                                        setImmediate( () => {
                                            job.stop();
                                        })
                                        scheduledEmails.splice(indexOfCancelledReservation, 1);
                                    }
                                    deleted++;
                                    console.log("Num of deleted reservations by Garbage Collector: " + deleted);
                                }
                            })
                        }
                    }
                }
            }
        )
    }