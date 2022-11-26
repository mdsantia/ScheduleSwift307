import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BallotIcon from "@mui/icons-material/Ballot";
import BentoIcon from "@mui/icons-material/Bento";
import Logo from '../Logo.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";

export const mainListItems = (
    <React.Fragment>
        <ListItemButton component={Link} to="/customerMain">
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/customerReservations">
            <ListItemIcon>
                <BallotIcon />
            </ListItemIcon>
            <ListItemText primary='My Reservations' />
        </ListItemButton>
        <ListItemButton component={Link} to="/customerReserve">
            <ListItemIcon>
                <BentoIcon />
            </ListItemIcon>
            <ListItemText primary="Business Events" />
        </ListItemButton>
        <ListItemButton component={Link} to="/customerAccount" >
            <ListItemIcon>
                <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Account Info" />
        </ListItemButton>
        <ListItemButton component={Link} to="/customerStats">
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Account Statistics" />
        </ListItemButton>
    </React.Fragment >
);