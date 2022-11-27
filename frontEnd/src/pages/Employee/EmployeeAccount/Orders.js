import * as React from 'react';
import { getIP } from '../../..';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { InputLabel } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function Orders(props) {
    const [employeeData, setData] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        getAccountInfo();
    }, []);

    function getAccountInfo() {
        axios.post("http://" + getIP() + ":3001/api/customerEdit", {
            username: props.username,
            password: props.password,
            businessName: props.businessName,
            isEmployee: true
        })
            .then((response) => {
                const employeeData = response.data;
                setData(employeeData.result[0]);
                setNewUsername(employeeData.result[0].username)
                setNewEmail(employeeData.result[0].emailAddress)
            })
    }

    const handleSignOut = () => {
        if(window.confirm("Are you sure you want to sign out of your account?")) {
            navigate("/employeeSignIn");
        }
    };

    return (
        <React.Fragment>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <AccountCircleIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Account Information
                </Typography>
                <Box component="form" validate="true" sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>First Name</InputLabel>
                            <TextField
                                name="firstName"
                                fullWidth
                                id="firstName"
                                value={employeeData.firstName}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Last Name</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                name="lastName"
                                autoComplete="family-name"
                                value={employeeData.lastName}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel>Business Name</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="businessName"
                                name="businessName"
                                autoComplete="family-name"
                                value={employeeData.businessName}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Username</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                name="username"
                                autoComplete="username"
                                value={employeeData.username}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Email</InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                name="email"
                                autoComplete="email"
                                value={employeeData.emailAddress}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    );
}