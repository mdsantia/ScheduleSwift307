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
import Logo from '../ScheduleSwift logo.png';
import { stepButtonClasses } from '@mui/material';

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

const theme = createTheme({
    palette: {
        primary: {
            light: '#6b5e51',
            main: '#694a2e',
            dark: '#292018',
        },
        secondary: {
            main: '#b71c1c',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
    },
});

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

const EmailChangeForm = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [newEmail, setNewEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState('');
    var [uniqueConfirmCode, setUniqueConfirmCode] = useState(state.confirmCode);
    var [endTime, setEndTime] = useState(state.endTime);

    const handleSubmit = () => {
        const newConfirmCode = makeUniqueID(8);
        const newEndTime = new Date();
        newEndTime.setMinutes((newEndTime.getMinutes() + 1));
        uniqueConfirmCode = newConfirmCode;
        endTime = newEndTime;
        setUniqueConfirmCode(newConfirmCode);
        setEndTime(newEndTime);
        // if (endTime.getMinutes() < 10) {
        //     endTime.setHours(startTime.getHours() + 1);
        // } else {
        // endTime.setHours(startTime.getHours());
        // }
        if (newEmail === '') {
            setEmailStatus("Please enter in a new email address.");
        } else {
            if (state.businessName) {
                Axios.post("http://localhost:3001/api/changeEmail", {
                    username: state.username,
                    email: newEmail,
                    businessName: state.businessName
                });
                Axios.post("http://localhost:3001/api/sendConfirmEmail", {
                    username: state.username,
                    email: newEmail,
                    firstName: state.firstName,
                    businessName: state.businessName,
                    confirmCode: uniqueConfirmCode
                });
            } else {
                Axios.post("http://localhost:3001/api/changeEmail", {
                    username: state.username,
                    email: newEmail
                });
                Axios.post("http://localhost:3001/api/sendConfirmEmail", {
                    username: state.username,
                    email: newEmail,
                    firstName: state.firstName,
                    confirmCode: uniqueConfirmCode
                });
            }
            alert("Your email address has been successfully changed!\nAn email containing a new confirmation code has automatically been sent to this email address.");
            if (state.businessName) {
                navigate("/managerConfirmAccount", {
                    state: {
                        username: state.username,
                        password: state.password,
                        businessName: state.businessName,
                        email: newEmail,
                        firstName: state.firstName,
                        confirmCode: uniqueConfirmCode,
                        endTime: endTime
                    }
                });
            } else {
                navigate("/customerConfirmAccount", {
                    state: {
                        username: state.username,
                        password: state.password,
                        email: newEmail,
                        firstName: state.firstName,
                        confirmCode: uniqueConfirmCode,
                        endTime: endTime
                    }
                });
            }
        }
    };

    const handleGoBack = () => {
        if (state.businessName) {
            navigate("/managerConfirmAccount", {
                state: {
                    username: state.username,
                    password: state.password,
                    businessName: state.businessName,
                    email: state.email,
                    firstName: state.firstName,
                    confirmCode: state.confirmCode,
                    endTime: state.endTime,
                }
            });
        } else {
            navigate("/customerConfirmAccount", {
                state: {
                    username: state.username,
                    password: state.password,
                    email: state.email,
                    firstName: state.firstName,
                    confirmCode: state.confirmCode,
                    endTime: state.endTime,
                }
            });
        }
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
                    <img src={Logo} alt='Logo'/>
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
                    <Typography component="h1" variant="h5"><b>Change Email Address</b></Typography>
                    <Typography justifyContent="flex-end" component="h1" variant="body2">
                        The current email address connected to your account is:
                    </Typography>
                    <span><b>{state.email}</b></span>
                    <Typography justifyContent="flex-end" component="h1" variant="body2">
                        Please enter the new email address you would like to connect your account to:
                    </Typography>
                    <Box component="form" validate="true"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            name="newEmail"
                            required
                            fullWidth
                            id="newEmail"
                            label="New Email Address "
                            autoFocus
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                    </Box>
                    <Typography color="error.main" justifyContent="flex-end" component="h1" variant="body2">{emailStatus}</Typography>  
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleGoBack}
                    >
                        Go Back
                    </Button>
                    <Copyright sx={{ mt: 5 }} />
                </Box>
            </Container>
        </ThemeProvider>
    );
}
export default EmailChangeForm;