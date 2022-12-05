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
import Axios from 'axios';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Logo.png';

function preventDefault(event) {
    event.preventDefault();
}

export default function Orders(props) {
    const [allReservations, setAllReservations] = useState('');
    const [reserveRes, setReserveRes] = useState('');
    const navigate = useNavigate();
    function getReservations() {
        Axios.post("http://" + getIP() + ":3001/api/getAllAvailableReservations", {
        }).then((result) => {
            const allReserves = result.data.result;
            console.log(allReserves);
            setAllReservations(allReserves);
        })
    }
    useEffect(() => {
        getReservations()
    }, []);
    function makeReservation(resID, index) {
        const username = props.username;
        const password = props.password;
        const reservationID = resID;
        navigate("/customerSubmit", {
            state: {
                username: username,
                password: password,
                reservationID: reservationID,
                businessName: allReservations[index].businessName
            }
        })

    }

    if (allReservations.length > 0) {

        return (
            <React.Fragment>
                <Title>Current Active Reservations</Title>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Business Name</TableCell>
                            <TableCell>Reservable Item</TableCell>
                            <TableCell align="right">Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allReservations.map((reserve, index) => (
                            <TableRow key={reserve.ID}>
                                <TableCell>{reserve.reservationDate}</TableCell>
                                <TableCell>{reserve.businessName}</TableCell>
                                <TableCell>{reserve.reservableItem}</TableCell>
                                <TableCell align="right">{`$${reserve.price}`}</TableCell>
                                <TableCell><Button onClick={() => makeReservation(reserve.ID, index)}>Reserve</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment>
                <Title>Current Available Reservations</Title>
                <Table size="small" align="center">
                    <TableHead>
                        <TableRow align="center">
                            <TableCell align="center">No Current Available Reservations</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    </TableBody>
                </Table>
            </React.Fragment >
        )
    }
}