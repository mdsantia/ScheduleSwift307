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
import CottageIcon from '@mui/icons-material/Cottage';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <CottageIcon />
                    </Avatar>
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
    );
}