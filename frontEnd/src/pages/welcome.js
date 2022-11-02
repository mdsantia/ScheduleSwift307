import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CottageIcon from '@mui/icons-material/Cottage';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Logo from './ScheduleSwift logo.png';
import Background from './homepage-background.jpg';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Schedule Swift
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const styles = {
    paperContainer: {
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
    },
    elementsContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    boxContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backgroundImage: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
        backdropFilter: 'blur(10px)',
        boxShadow: '10px 10px 10px rgba(30, 30, 30, 0.1)'
    }
}

const theme = createTheme({
    background: {
        paper: '#ffffff',
        default: '#6b5e51',
    },
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

export default function SignIn() {
    const navigate = useNavigate();
    const customerSubmit = () => {
        navigate("./customerRegister", {
            state: {
                userType: "customer"
            }
        })
    };

    const employeeSubmit = () => {
        navigate("./employeeSignIn", {
            state: {
                userType: "employee"
            }
        })
    };

    const managerSubmit = () => {
        navigate("./managerRegister", {
            state: {
                userType: "manager"
            }
        })
    }

    return (
        // <Paper style={styles.paperContainer}>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs" color="primary.dark">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: 'primary.light',
                        }}
                    >
                        <img src={Logo} alt="Logo"/>
                    {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <CottageIcon />
                    </Avatar> */}
                        <Typography component="h1" variant="h5">
                            Welcome to Schedule Swift
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={customerSubmit}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                I am a Customer!
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={employeeSubmit}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                I am an Employee!
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={managerSubmit}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                I am a Manager!
                            </Button>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </Container>
            </ThemeProvider>
        // </Paper>
    );
}