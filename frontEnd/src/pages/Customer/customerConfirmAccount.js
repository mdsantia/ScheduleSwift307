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

const CustomerConfirmAccount = () => {
    const { state } = useLocation();
    const handleResend = () => {
        Axios.post("http://localhost:3001/api/sendConfirmEmail", {
            email: state.email,
            firstName: state.firstName,
            confirmCode: state.confirmCode,
         }).then((result) => {
            if (result) {
                console.log("Successfully resent confirmation email.");
            } else {
                console.log("Unable to resend confirmation email.");
            }
        })
    };

    const handleConfirmation = () => {
        console.log("confirmed hit");
    }

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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
                    <Typography component="h1" variant="h5">Confirm Account</Typography>
                    <Typography justifyContent="flex-end" component="h1" variant="body2">
                        A confirmation code has been sent to
                    </Typography>
                    <span><b>{state.email}</b></span>
                    <Typography justifyContent="flex-end" component="h1" variant="body2">
                        Enter the confirmation code below in order to activate your account. Once your account is activated, you will
                        be automatically redirected to the main page.
                    </Typography>
                    <Typography justifyContent="flex-end" component="h1" variant="body2">
                        If you did not receive an email, hit 
                    </Typography>    
                    <span><b>"Resend Confirmation Email"</b></span>
                    <Typography justifyContent="flex-end" component="h1" variant="body2">
                        and an email with the confirmation code will be re-sent.
                    </Typography>
                    <Box component="form" validate="true"  sx={{ mt: 3 }}>
                        <TextField
                            name="confirmCode"
                            required
                            fullWidth
                            id="confirmCode"
                            label="Confirmation Code"
                            autoFocus
                        />
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleConfirmation}
                    >
                    Confirm Account
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleResend}
                    >
                    Resend Confirmation Email
                    </Button>
                    <Copyright sx={{ mt: 5 }} />
                </Box>
            </Container>
        </ThemeProvider>
    );
}
export default CustomerConfirmAccount;