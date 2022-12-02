import * as React from 'react';
import { getIP } from '../../..';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { Button, Tab } from '@mui/material';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Logo from '../Logo.png';

function preventDefault(event) {
    event.preventDefault();
}

export default function Orders(props) {
    const [memberSince, setMemberSince] = useState('');
    const [numActiveReservations, setNumActiveReservations] = useState('');
    const [numCancelledReservations, setNumCancelledReservations] = useState('');
    const [numCompletedReservations, setNumCompletedReservations] = useState('');

    useEffect(() => {
        getCustomerStats();
    }, []);
    function getCustomerStats() {
        Axios.post("http://" + getIP() + ":3001/api/getCustomerStats", {
            username: props.username,
            password: props.password
        })
            .then((response) => {
                const responseData = response.data;
                setMemberSince(responseData.result[0].creationDate)
                setNumActiveReservations(responseData.result[0].numActiveReservations);
                setNumCancelledReservations(responseData.result[0].numCancelledReservations);
                setNumCompletedReservations(responseData.result[0].numCompletedReservations);
            })
    }
    const navigate = useNavigate();
    return (
        <React.Fragment>
            <Title>Customer Stats</Title>
            <Table size="small" align='center'>
                <tbody align='center'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Member Since</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableCell align='center'>{memberSince}</TableCell>
                    </TableBody>
                    <br></br>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Active Reservations</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableCell align='center'>{numActiveReservations}</TableCell>
                    </TableBody>
                    <br></br>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Cancelled Reservations</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableCell align='center'>{numCancelledReservations}</TableCell>
                    </TableBody>
                    <br></br>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Completed Reservations</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableCell align='center'>{numCompletedReservations}</TableCell>
                    </TableBody>
                </tbody>
            </Table>
        </React.Fragment>
    );
}