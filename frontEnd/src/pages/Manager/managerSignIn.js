import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Axios from 'axios';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

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

export default function ManagerSignIn() {
    const [loginStatus, setLoginStatus] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const uniqueConfirmCode = makeUniqueID(8);
        Axios.post("http://localhost:3001/api/managerSignIn", {
            username: data.get('username'),
            password: data.get('password'),
            confirmCode: uniqueConfirmCode,
        }).then((result) => {
            console.log(result);
            if (result.data.message) {
                setLoginStatus(result.data.message);
            } else if (result.data.result[0].active == 0) {
                var endTime = new Date();
                    endTime.setMinutes((endTime.getMinutes() + 1));
                    // if (endTime.getMinutes() < 10) {
                    //     endTime.setHours(startTime.getHours() + 1);
                    // } else {
                    // endTime.setHours(startTime.getHours());
                    // }
                navigate("/managerConfirmAccount", {
                    state: {
                        username: data.get('username'),
                        password: data.get('password'),
                        businessName: result.data.result[0].businessName,
                        email: result.data.result[0].emailAddress,
                        firstName: result.data.result[0].firstName,
                        confirmCode: uniqueConfirmCode,
                        endTime: endTime,
                    }
                });
                alert("You have not activated your account. A confirmation email containing a new confirmation code has automatically been resent to you.");
            } else {
                navigate("/managerMain", {
                    state: {
                        username: data.get('username'),
                        password: data.get('password'),
                        businessName: result.data.result[0].businessName
                    }
                });
            }
        })
        console.log({
            username: data.get('username'),
            password: data.get('password'),
        });
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
                        Manager Sign In
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Typography color="error.main" justifyContent="flex-end" component="h1" variant="body2">{loginStatus}</Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/managerVerify" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/managerRegister" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}