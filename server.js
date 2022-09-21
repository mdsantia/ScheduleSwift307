const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // middleware
app.use(bodyParser.urlencoded({ extended: false }));


// Route to Homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
  });


// Route to Login Page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
  });

// Route to Main Page
app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
})


  app.post('/login', (req, res) => {
    // Insert Login Code Here
    let username = req.body.username;
    let password = req.body.password;
    // Admin Login, Bypassess Verification
    if (username == "sysadmin" && password == "sys1234") {
        res.sendFile(__dirname + '/static/index.html');
    } else {
        res.send(`Username: ${username} Password: ${password}`);
    }
  });

  const port = 3001 // Port we will listen on

  // Function to listen on the port
  app.listen(port, () => console.log(`This app is listening on port ${port}`));