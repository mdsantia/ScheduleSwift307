import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BallotIcon from "@mui/icons-material/Ballot";
import BentoIcon from "@mui/icons-material/Bento";
import DateRangeIcon from '@mui/icons-material/DateRange';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { mainListItems } from './listItems';
import Orders from './Orders';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logo from '../Logo.png';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DescriptionIcon from '@mui/icons-material/Description';

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

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const styles = {
    logoContainer: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '90%',
    }
}

const mdTheme = createTheme({
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

function DashboardContent() {
    const { state } = useLocation();
    console.log(state);
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Manager View
                        </Typography>
                        <IconButton color="inherit">
                            <Badge color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <img src={Logo} style={styles.logoContainer} />
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <ListItemButton onClick={() => {
                            navigate("/managerMain", {
                                state: {
                                    username: state.username,
                                    password: state.password,
                                    businessName: state.businessName
                                }
                            })
                        }}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/FacilityForm", {
                                state: {
                                    username: state.username,
                                    password: state.password,
                                    businessName: state.businessName
                                }
                            })
                        }}>
                            <ListItemIcon>
                                <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText primary='Reservation Form' />
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/managerCreateEvent", {
                                state: {
                                    username: state.username,
                                    password: state.password,
                                    businessName: state.businessName
                                }
                            })
                        }}>
                            <ListItemIcon>
                                <AddBoxIcon />
                            </ListItemIcon>
                            <ListItemText primary='Create Event' />
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/facilityReservations", {
                                state: {
                                    username: state.username,
                                    password: state.password,
                                    businessName: state.businessName
                                }
                            })
                        }}>
                            <ListItemIcon>
                                <BallotIcon />
                            </ListItemIcon>
                            <ListItemText primary="Facility's Reservations" />
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/Calendar", {
                                state: {
                                    username: state.username,
                                    password: state.password,
                                    businessName: state.businessName
                                }
                            })
                        }}>
                            <ListItemIcon>
                                <DateRangeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Calendar View" />
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/managerNotes", {
                                state: {
                                    username: state.username,
                                    password: state.password,
                                    businessName: state.businessName
                                }
                            })
                        }}>
                            <ListItemIcon>
                                <BentoIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add Notes" />
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/managerAccount", {
                                state: {
                                    username: state.username,
                                    password: state.password,
                                    businessName: state.businessName
                                }
                            })
                        }}>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Account Info" />
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/managerManageEmployees", {
                                state: {
                                    username: state.username,
                                    password: state.password,
                                    businessName: state.businessName
                                }
                            })
                        }}>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="My Employees" />
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/managerCreateAccount", {
                                state: {
                                    username: state.username,
                                    password: state.password,
                                    businessName: state.businessName
                                }
                            })
                        }}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Create Emp Account" />
                        </ListItemButton>
                        <Divider sx={{ my: 1 }} />
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            {/* Recent Orders */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Orders username={state.username} password={state.password} businessName={state.businessName} />
                                </Paper>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider >
    );
}

export default function ManagerMain() {
    return <DashboardContent />;
}