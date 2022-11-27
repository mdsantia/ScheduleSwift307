import * as React from 'react';
import { getIP } from '../../..';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import Logo from '../Logo.png';
import EventIcon from '@mui/icons-material/Event';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

function preventDefault(event) {
    event.preventDefault();
}

export default function Orders() {
    const { state } = useLocation();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const navigate = useNavigate();
    const [reservationDetails, setReservationDetails] = useState(null);
    const [reservableItems, setReservableItems] = useState(null);
    const box = [];

    function makeBox() {
        for (const element in reservableItems) {
            // Then the code pushes each time it loops to the empty array I initiated.
            box.push(
                <Grid>
                    <TextField
                        required
                        fullWidth
                        name={reservableItems[element]}
                        label={reservableItems[element]}
                        type={reservableItems[element]}
                        id={reservableItems[element]}
                    />
                </Grid>
            );
            }
    }

    function getReservationDetails() {
        Axios.post("http://" + getIP() + ":3001/api/customerMakeReservation", {
            reservationID: state.reservationID,
            username: state.username
        }).then((result) => {
            setReservationDetails(result.data.result[0]);
            setReservableItems(result.data.result[0].reservableItem.split(";"));
        })
    }
    useEffect(() => {
        getReservationDetails();
    }, [])
    function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let numReservedItems = "";
        for (const element in reservableItems) {
            if (numReservedItems === "") {
                numReservedItems = numReservedItems.concat(data.get(reservableItems[element]));
            } else {
                numReservedItems = numReservedItems.concat(";", data.get(reservableItems[element]));
            }
        }
        Axios.post("http://" + getIP() + ":3001/api/customerConfirmReservation", {
            reservationID: state.reservationID,
            startTime: startTime,
            endTime: endTime,
            reservedBy: state.username,
            numPeople: data.get('numPeople'),
            numReservable: numReservedItems
        }).then((result) => {
        })
        navigate("/customerMain", {
            state: {
                username: state.username,
                password: state.password
            }
        })
    }
    if (reservationDetails) {
        console.log(reservationDetails[0])
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
                        <EventIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Make Reservation
                    </Typography>
                    <Box component="form" validate="true" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="business"
                                    label="Business Name"
                                    fullWidth
                                    defaultValue={reservationDetails.businessName}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    id="reservationDate"
                                    label="Reservation Date"
                                    name="reservationDate"
                                    defaultValue={reservationDetails.reservationDate}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Start Time"
                                        value={startTime}
                                        fullWidth
                                        onChange={(newValue) => { setStartTime(newValue) }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="End Time"
                                        value={endTime}
                                        fullWidth
                                        onChange={(newValue) => { setEndTime(newValue) }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="reservedBy"
                                    label="Reserved By"
                                    type="username"
                                    defaultValue={state.username}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    id="reservedBy"

                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="numPeople"
                                    label="Party Size"
                                    type="numPeople"
                                    id="numPeople"
                                />
                            </Grid>
                            {/* And here I render the box array */}
                            {/* There is going to be a max of 10 items */}
                            {makeBox()}
                            <Grid item xs={12} sm={6}>
                                {box[0]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[1]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[2]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[3]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[4]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[5]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[6]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[7]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[8]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[9]}
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Make Reservation
                        </Button>
                    </Box>
                </Box>
            </React.Fragment>
        );
    } else {
        return (
            <p>Awaiting Results </p>
        )
    }
}