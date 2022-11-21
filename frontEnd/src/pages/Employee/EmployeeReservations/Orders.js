import * as React from 'react';
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

export default function Orders(props) {
    const [reservations, setReservations] = useState([]);
    const [deleteRes, setDeleteRes] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function getReservations(business) {
        Axios.post("http://localhost:3001/api/getBusinessReservations", {
            businessName: props.businessName
        }).then((result) => {
            const allReserves = result.data.result;
            console.log(allReserves);
            setReservations(allReserves);

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
                            <TableCell align="right">Edit</TableCell>
                            <TableCell align="right">Delete</TableCell>
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
                                <TableCell align="right"><Button onClick={() => editReservation(reserve.ID)}>Edit</Button></TableCell>
                                <TableCell align="right"><Button onClick={() => deleteReservation(reserve.ID, reserve.isReserved)}>Delete</Button></TableCell>
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