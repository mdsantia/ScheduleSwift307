import * as React from 'react';
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
    const [managerData, setData] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        getAccountInfo();
    }, []);

    function getAccountInfo() {
        axios.post("http://localhost:3001/api/customerEdit", {
            username: props.username,
            password: props.password,
            businessName: props.businessName
        })
            .then((response) => {
                const managerData = response.data;
                setData(managerData.result[0]);
                setNewUsername(managerData.result[0].username)
                setNewEmail(managerData.result[0].emailAddress)
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        Axios.post("http://localhost:3001/api/updateCustomerInfo", {
            oldUsername: managerData.username,
            oldPassword: managerData.password,
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
            businessName: managerData.businessName
        }).then(() => {
            navigate("/managerMain", {
                state: {
                    username: data.get('username'),
                    email: data.get('email'),
                    password: data.get('password'),
                    businessName: managerData.businessName
                }
            })
        })
    };

    const handleSignOut = () => {
        if(window.confirm("Are you sure you want to sign out of your account?")) {
            navigate("/managerSignIn");
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
                    Edit Account Information
                </Typography>
                <Box component="form" validate="true" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>First Name</InputLabel>
                            <TextField
                                name="firstName"
                                fullWidth
                                id="firstName"
                                value={managerData.firstName}
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
                                value={managerData.lastName}
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
                                value={managerData.businessName}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                name="username"
                                label="Username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                value={newEmail}
                                autoComplete="email"
                                onChange={(e) => setNewEmail(e.target.value)}
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
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Edit
                    </Button>
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