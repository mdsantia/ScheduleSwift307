import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { useState, useEffect } from 'react';
import { Button, TextField, Grid, Typography } from '@mui/material';
import Axios from 'axios';

export default function Orders(props) {
    const [reservations, setReservations] = useState([]);
    const [deleteRes, setDeleteRes] = useState('');
    const [error, setError] = useState('');
    function getReservations(business) {
        Axios.post("http://localhost:3001/api/getBusinessReservations", {
            businessName: props.businessName
        }).then((result) => {
            const allReserves = result.data.result;
            console.log(allReserves);
            setReservations(allReserves);

        })
    }

    function deleteReservation(resID, isReserved) {

        if (isReserved === "No") {
            Axios.post("http://localhost:3001/api/employeeDeleteReservation", {
                reservationID: resID
            }).then((result) => {
                if (result.data.result.affectedRows === 0) {
                    setError("No Reservation with that ID exists")
                } else {
                    setError("");
                    getReservations(props.businessName);
                }
            })
        } else {
            Axios.post("http://localhost:3001/api/managerDeleteReservation", {
                reservationID: resID
            }).then((result) => {
                if (result.data.result.affectedRows === 0) {
                    setError("No Reservation with that ID exists")
                } else {
                    setError("");
                    getReservations(props.businessName);
                }
            })
        }
    }

    useEffect(() => {
        getReservations(props.businessName)
    }, []);
    if (reservations.length > 0) {
        return (
            <React.Fragment>
                <Title>{props.businessName}'s Active Reservations</Title>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Reservation ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Business Name</TableCell>
                            <TableCell>Reservable Item</TableCell>
                            <TableCell>Reserved</TableCell>
                            <TableCell align="right">Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((reserve, index) => (
                            <TableRow key={reserve.ID}>
                                <TableCell>{reserve.ID}</TableCell>
                                <TableCell>{reserve.reservationDate}</TableCell>
                                <TableCell>{reserve.businessName}</TableCell>
                                <TableCell>{reserve.reservableItem}</TableCell>
                                <TableCell>{reserve.isReserved}</TableCell>
                                <TableCell align="right">{`$${reserve.price}`}</TableCell>
                                <TableCell><Button onClick={() => deleteReservation(reserve.ID, reserve.isReserved)}>Delete</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment >
        );
    } else {
        return (
            <p>No active Reservations at this business</p>
        )
    }
}