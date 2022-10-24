import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Axios from 'axios';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useEffect, useState } from 'react';
import { Button, TextField, Grid, Typography } from '@mui/material';

function preventDefault(event) {
    event.preventDefault();
}

function createDay(day, open, close) {
    return {day, open, close};
}

export default function Orders(props) {
    const box = [];
    const [reservations, setReservations] = useState([]);
    const [deleteRes, setDeleteRes] = useState('');
    const [error, setError] = useState('');
    function getBusinessHours(business) {
        setReservations([createDay('Sunday', '', ''), createDay('Monday', '', '') , 
        createDay('Tuesday', '', '')]);
        // Axios.post("http://localhost:3001/api/getBusinessHours", {
        //     businessName: props.businessName
        // }).then((result) => {
        //     const allReserves = result.data.result;
        //     console.log(allReserves);
        //     setReservations(allReserves);
        // })
    }
    function editHours(day) {
        
        // Axios.post("http://localhost:3001/api/managerDeleteReservation", {
        //     reservationID: day
        // }).then((result) => {
        //     if (result.data.result.affectedRows == 0) {
        //         setError("No Reservation with that ID exists")
        //     } else {
        //         setError("");
        //         getBusinessHours(props.businessName);
        //     }
        // })
    }

    useEffect(() => {
        getBusinessHours(props.businessName)
    }, []);
    if (reservations.length > 0) {
        return (
            <React.Fragment>
                <Title>{props.businessName}'s Business Hours</Title>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Week Day</TableCell>
                            <TableCell align="center">Opens at</TableCell>
                            <TableCell align="center">Closes at</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((weekday, index) => (
                            <TableRow key={weekday.day}>
                                <TableCell align="center">{<b>{weekday.day}</b>}</TableCell>
                                <TableCell align="center">{box}</TableCell>
                                <TableCell align="center">{weekday.close}</TableCell>
                                <TableCell align="center"><Button onClick={() => editHours(weekday.day)}>Edit</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Save
                </Button>
            </React.Fragment >
        );
    } else {
        return (
            <p>Awaiting Response</p>
        )
    }
}