import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import Axios from 'axios';
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                ScheduleSwift
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

const CustomerRegister = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const creationDate = `${month}/${day}/${year}`;
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [usernameStatus, setUsernameStatus] = useState('');
    const checkPasswords = () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
        } else {
            setError(null);
        }
    }

    const makeUniqueID = (length) => {
        // Reference to ran string https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setUsernameStatus('');
        const data = new FormData(event.currentTarget);
        if (error !== "Passwords do not match!") {
            const uniqueConfirmCode = makeUniqueID(8);
            Axios.post("http://localhost:3001/api/customerRegister", {
                firstName: data.get('firstName'),
                lastName: data.get('lastName'),
                username: data.get('username'),
                email: data.get('email'),
                password: data.get('password'),
                creationDate: creationDate,
                confirmCode: uniqueConfirmCode,
            }).then((result) => {
                if (result.data.err) {
                    setUsernameStatus("This username has already been taken.");
                } else {
                    var endTime = new Date();
                    endTime.setMinutes((endTime.getMinutes() + 1));
                    // if (endTime.getMinutes() < 10) {
                    //     endTime.setHours(startTime.getHours() + 1);
                    // } else {
                    // endTime.setHours(startTime.getHours());
                    // }
                    console.log("Initial confirmCode: " + uniqueConfirmCode);
                    console.log("Initial endTime: " + endTime);
                    navigate("/customerConfirmAccount", {
                        state: {
                            username: data.get('username'),
                            password: data.get('password'),
                            email: data.get('email'),
                            firstName: data.get('firstName'),
                            confirmCode: uniqueConfirmCode,
                            endTime: endTime,
                        }
                    });
                    console.log({
                        firstName: data.get('firstName'),
                        lastName: data.get('lastName'),
                        username: data.get('username'),
                        email: data.get('email'),
                        password: data.get('password'),
                    });
                }
            })
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Customer Sign up
                    </Typography>
                    <Box component="form" validate="true" onSubmit={onSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                />
                            </Grid>
                            <Typography color="error.main" justifyContent="flex-end" component="h1" variant="body2">{usernameStatus}</Typography>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="confirmPassword"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={checkPasswords}
                                />
                            </Grid>
                        </Grid>
                        <Typography color="error.main" justifyContent="flex-end" component="h1" variant="body2"><p>{error}</p></Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/customerSignIn" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
export default CustomerRegister;