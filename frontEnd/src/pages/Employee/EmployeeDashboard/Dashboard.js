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
import BookIcon from '@mui/icons-material/Book';
import { mainListItems } from './listItems';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Orders from './Orders';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BallotIcon from "@mui/icons-material/Ballot";
import BentoIcon from "@mui/icons-material/Bento";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logo from '../Logo.png';
import { ClickAwayListener, Modal } from '@mui/material';
import Axios from 'axios';
import { useState } from 'react';
import DateRangeIcon from '@mui/icons-material/DateRange';

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
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
function DashboardContent() {
    const [open, setOpen] = React.useState(true);
    const [openModal, setOpenModal] = React.useState(false);
    const [viewed, setViewed] = React.useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
    }
    const handleCloseModal = () => {
        setOpenModal(false);
        setViewed(true);
    }
    const [dailyReservations, setDailyReservations] = useState([]); 
    const { state } = useLocation();
    const navigate = useNavigate();
    const toggleDrawer = () => {
        setOpen(!open);
    };


    function getDailyReservations(business) {
        Axios.post("http://localhost:3001/api/getDailyReservations", {
            businessName: business
        }).then((result) => {
            const todaysReserves = result.data.result;
            console.log(todaysReserves);
            setDailyReservations(todaysReserves);
        })

    }
    function parseTime(time) {
        const string = new Date(time).toLocaleTimeString();
        const realTime = string.substring(0,4) + " " + string.substring(8,10);
        return realTime;
    }


    React.useEffect(() => {
        getDailyReservations(state.businessName)
    }, [])

    if (dailyReservations.length > 0) {
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
                            Employee View
                        </Typography>
                        <IconButton onClick={handleOpenModal} color="inherit">
                            <Badge badgeContent={viewed ? 0 : dailyReservations.length} showZero color="secondary">
                                <BookIcon />
                                {/* TODO: Implement Modal Component to show daily reservations and notifications */}
                                {/* Need to setup a modal component with text fields mapped to reservations */}
                                {/* Reservations only on the day it currently is */}
                                <Modal
                                open = {openModal}
                                onClose = {handleCloseModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                            <ClickAwayListener onClickAway={handleCloseModal}>
                                <Box sx={modalStyle}>
                                    <Typography id="modal-modal-title" variant='h6' component='h2'>
                                        Reservations Occuring Today
                                    </Typography>
                                    <Table size="small">
                    <TableHead>
                        <TableRow>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dailyReservations.map((reserve, index) => (
                            <TableRow key={reserve.ID}>
                                <TableCell>Reservation by {reserve.reservedBy} at {parseTime(reserve.startTime)} today, with party of {reserve.numPeople} people</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                                </Box>
                                </ClickAwayListener>
                            </Modal>
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
                        <img src={Logo} style={styles.logoContainer}/>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <ListItemButton onClick={() => {
                            navigate("/employeeMain", {
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
                            navigate("/employeeReservations", {
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
                            navigate("/employeeCalendar", {
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
                            <ListItemText primary='Calendar View' />
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/employeeAccount", {
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
                                </Paper>
                            </Grid>
                        </Grid><Grid container spacing={3}>
                            {/* Notes */}
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
        </ThemeProvider>
    );
} else {
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
                            Employee View
                        </Typography>
                        <IconButton onClick={handleOpenModal} color="inherit">
                            <Badge badgeContent={0} showZero color="secondary">
                                <BookIcon />
                                {/* TODO: Implement Modal Component to show daily reservations and notifications */}
                                {/* Need to setup a modal component with text fields mapped to reservations */}
                                {/* Reservations only on the day it currently is */}
                                <Modal
                                open = {openModal}
                                onClose = {handleCloseModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                            <ClickAwayListener onClickAway={handleCloseModal}>
                                <Box sx={modalStyle}>
                                    <Typography id="modal-modal-title" variant='h6' component='h2'>
                                        Reservations occuring Today
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{mt: 2}}> 
                                    No Reservations Today
                                    </Typography>

                                </Box>
                                </ClickAwayListener>
                            </Modal>
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
                        <img src={Logo} style={styles.logoContainer}/>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <ListItemButton onClick={() => {
                            navigate("/employeeMain", {
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
                            navigate("/employeeReservations", {
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
                            navigate("/employeeCalendar", {
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
                            <ListItemText primary='Calendar View' />
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/employeeAccount", {
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
                                </Paper>
                            </Grid>
                        </Grid><Grid container spacing={3}>
                            {/* Notes */}
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
        </ThemeProvider>
    );
}
}

export default function EmployeeMain() {
    return <DashboardContent />;
}