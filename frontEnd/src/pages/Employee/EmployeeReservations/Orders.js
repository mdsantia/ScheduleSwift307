import * as React from 'react';
import { getIP } from '../../..';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Title from './Title';
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, TextField, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TableFooter } from '@mui/material';
import { InputLabel } from '@mui/material';

function preventDefault(event) {
    event.preventDefault();
}

export default function Orders(props) {
    const [reservations, setReservations] = useState([]);
    const [deleteRes, setDeleteRes] = useState('');
    const [currentDate, setCurrentDate] = useState(null);
    const [searchUsername, setSearchUsername] = useState(null);
    const [ID, setID] = useState(null);
    const [error, setError] = useState('');
    const [reservationIDs, setReservationIDs] = useState('');
    const navigate = useNavigate();
    function getReservations(business) {
        Axios.post("http://" + getIP() + ":3001/api/getBusinessReservations", {
            businessName: props.businessName
        }).then((result) => {
            const allReserves = result.data.result;
            console.log(allReserves);
            setReservations(allReserves);
            let reservationIDs = [];
            for (let i = 0; i < allReserves.length; i++) {
                reservationIDs.push(parseInt(allReserves[i].ID));
            }
            setReservationIDs(reservationIDs);
        })
    }
    function editReservation (reserveID) {
        navigate("/employeeEditForm", {
            state: {
                username: props.username,
                password: props.password,
                businessName: props.businessName,
                ID: reserveID
            }
        })
    }
    function deleteReservation(resID) {

        Axios.post("http://" + getIP() + ":3001/api/checkDelete", {
            username: props.username
        }).then((result) => {
            console.log(result.data);
            if (result.data === "No") {
                window.alert("You don't have permissions to delete reservations!");
            } else {

            if(window.confirm("ID: " + resID + "\nAre you sure you want to cancel this reservation?")) {
                Axios.post("http://" + getIP() + ":3001/api/employeeDeleteReservation", {
                    reservationID: resID
                }).then((result) => {
                    if (result.data.result.affectedRows === 0) {
                        setError("No Reservation with that ID exists")
                 } else {
                  setError("");
                    getReservations(props.businessName);
                    alert("The reservation has been cancelled!\nA confirmation email has been sent to the organizer containing the details of the cancelled reservation.");
                    }
                 getReservations(props.business);
                })
            }
        }

        })
    }

    function total(numReservable, price) {
        var amount = 0;
        if (!price.includes(";")) {
            amount = price;
            return amount;
        }
        const priceArray = price.split(";");
        const num = numReservable.split(";");
        const numReservableItems = num.length;
        for (let i = 0; i < numReservableItems; i++) {
            if (num[i]) {
                amount = amount + parseFloat(priceArray[i]) * num[i];
            }
        }
        return amount;
    }

    const filter = () => {
        if (currentDate && searchUsername) {
            Axios.post("http://" + getIP() + ":3001/api/getReservationsbyDateUser", {
                businessName: props.businessName,
                reservationDate: currentDate,
                username: searchUsername
            }).then((result) => {
                const allReserves = result.data.result;
                setReservations(allReserves);
                let reservationIDs = [];
                for (let i = 0; i < allReserves.length; i++) {
                    reservationIDs.push(parseInt(allReserves[i].ID));
                }
                setReservationIDs(reservationIDs);
            })
        } else if (currentDate) {
            Axios.post("http://" + getIP() + ":3001/api/getReservationsbyDate", {
                businessName: props.businessName,
                reservationDate: currentDate
            }).then((result) => {
                const allReserves = result.data.result;
                setReservations(allReserves);
                let reservationIDs = [];
                for (let i = 0; i < allReserves.length; i++) {
                    reservationIDs.push(parseInt(allReserves[i].ID));
                }
                setReservationIDs(reservationIDs);
            })
        } else if (searchUsername) {
            Axios.post("http://" + getIP() + ":3001/api/getReservationsbyUsername", {
                businessName: props.businessName,
                username: searchUsername
            }).then((result) => {
                const allReserves = result.data.result;
                setReservations(allReserves);
                let reservationIDs = [];
                for (let i = 0; i < allReserves.length; i++) {
                    reservationIDs.push(parseInt(allReserves[i].ID));
                }
                setReservationIDs(reservationIDs);
            })
        } else {
            getReservations();
        }
    }

    const searchID = () => {
        if (reservationIDs.includes(parseInt(ID))) {
        navigate("/employeeEditForm", {
            state: {
                username: props.username,
                password: props.password,
                businessName: props.businessName,
                ID: ID
            }
        })} else {
            alert(`No reservation in this business has an ID: ${ID}`)
        }
    }

    useEffect(() => {
        getReservations(props.businessName)
    }, []);
    if (reservations.length > 0) {
        return (
            <React.Fragment>
                <Title>{props.businessName}'s Active Reservations</Title>
                <Grid container spacing={5}>
                <Grid paddingLeft={4} sx={{ mt: 4, mb: 2 }}>
                <TextField type="number" label='RESERVATION ID' value={ID} 
                onChange={(newVal) => {setID(parseInt(newVal.target.value))}}>
                </TextField>
                </Grid>
                <Grid padding={1} sx={{ mt: 4, mb: 2 }}> <Button onClick={searchID} 
                variant="contained">
                    Search by ID</Button></Grid>
                    <Grid paddingLeft={4} sx={{ mt: 4, mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    id="reservationDate"
                                    label="SELECT DATE"
                                    value={currentDate}
                                    onChange={(newValue) => { setCurrentDate(newValue)}}
                                    renderInput={(params) => <TextField {...params}/>}
                                    shouldDisableDate={(date) => {
                                        if (date < new Date().setDate(new Date().getDate() - 1)) {
                                            return true;
                                        }
                                        return false;
                                    }}
                                />
                            </LocalizationProvider>
                    </Grid>
                    <Grid paddingLeft={4} sx={{ mt: 4, mb: 2 }}>
                    <TextField label='ORGANIZER USERNAME' value={searchUsername} onChange={(newValue) => { setSearchUsername(newValue.target.value)}}></TextField>
                    </Grid>
                    <Grid padding={1} sx={{ mt: 4, mb: 2 }}> <Button onClick={filter} 
                    variant="contained">
                        Filter</Button></Grid>
                    <Grid padding={1} sx={{ mt: 4, mb: 2 }}> <Button onClick={getReservations} 
                    variant="contained">
                        Revert</Button></Grid>
                    </Grid>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Reservation ID</TableCell>
                            <TableCell>Reserved By</TableCell>
                            <TableCell>Date</TableCell>
                            {/* <TableCell>Business Name</TableCell> */}
                            {/* <TableCell>Reservable Item</TableCell> */}
                            <TableCell>Reserved</TableCell>
                            <TableCell>Price</TableCell>
                            {/* <TableCell align="center">Edit</TableCell> */}
                            {/* <TableCell align="center">Delete</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((reserve, index) => (
                            <TableRow key={reserve.ID}>
                                <TableCell>#{reserve.ID}</TableCell>
                                <TableCell>{reserve.reservedBy}</TableCell>
                                <TableCell>{reserve.reservationDate}</TableCell>
                                {/* <TableCell>{reserve.businessName}</TableCell> */}
                                {/* <TableCell>{reserve.reservableItem}</TableCell> */}
                                <TableCell>{reserve.isReserved}</TableCell>
                                <TableCell align="right">{`$${parseFloat(total(reserve.numReservable, reserve.price)).toFixed(2)}`}</TableCell>
                                <TableCell align="right"><Button onClick={() => editReservation(reserve.ID)}>VIEW/EDIT</Button></TableCell>
                                <TableCell align="right"><Button onClick={() => deleteReservation(reserve.ID)}>CANCEL</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment >
        );
    } else {
        return (
            <React.Fragment>
                <Grid container spacing={5}>
                <Grid paddingLeft={4} sx={{ mt: 4, mb: 2 }}>
                <TextField type="number" label='RESERVATION ID' value={ID} 
                onChange={(newVal) => {setID(parseInt(newVal.target.value))}}>
                </TextField>
                </Grid>
                <Grid padding={1} sx={{ mt: 4, mb: 2 }}> <Button onClick={searchID} 
                variant="contained">
                    Search by ID</Button></Grid>
                    <Grid paddingLeft={4} sx={{ mt: 4, mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    id="reservationDate"
                                    label="SELECT DATE"
                                    value={currentDate}
                                    onChange={(newValue) => { setCurrentDate(newValue)}}
                                    renderInput={(params) => <TextField {...params}/>}
                                    shouldDisableDate={(date) => {
                                        if (date < new Date().setDate(new Date().getDate() - 1)) {
                                            return true;
                                        }
                                        return false;
                                    }}
                                />
                            </LocalizationProvider>
                    </Grid>
                    <Grid paddingLeft={4} sx={{ mt: 4, mb: 2 }}>
                    <TextField label='ORGANIZER USERNAME' value={searchUsername} onChange={(newValue) => { setSearchUsername(newValue.target.value)}}></TextField>
                    </Grid>
                    <Grid padding={1} sx={{ mt: 4, mb: 2 }}> <Button onClick={filter} 
                    variant="contained">
                        Filter</Button></Grid>
                    <Grid padding={1} sx={{ mt: 4, mb: 2 }}> <Button onClick={getReservations} 
                    variant="contained">
                        Revert</Button></Grid>
                    </Grid>
                    <p>No Active Reservations fit the description at this business</p>
            </React.Fragment>
        )
    }
}