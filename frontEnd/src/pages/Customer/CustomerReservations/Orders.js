import * as React from 'react';
import Axios from 'axios';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Logo from '../Logo.png';

export default function Orders(props) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');

    function getReservations() {
        Axios.post("http://localhost:3001/api/activeEvents", {
            username: state.username
        }).then((result) => {
            const allReserves = result.data.result;
            setReservations(allReserves);
        })
    }
    
    function editReservation (reserveID, businessName) {
        navigate("/requestForm", {
            state: {
                username: state.username,
                password: state.password,
                businessName: businessName,
                ID: reserveID
            }
        })
    }

    function deleteReservation(resID) {
        if(window.confirm("ID: " + resID + "\nAre you sure you want to cancel this reservation?")) {
            Axios.post("http://localhost:3001/api/managerDeleteReservation", {
                reservationID: resID
            }).then((result) => {
                if (result.data.result.affectedRows === 0) {
                    setError("No Reservation with that ID exists")
                } else {
                    setError("");
                    getReservations();
                    alert("Your reservation has been cancelled!\nA confirmation email has been sent to you containing the details of your cancelled reservation.");
                }
            })
        }
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

    useEffect(() => {
        getReservations()
    }, []);

    console.log(reservations);
    console.log(reservations.length);
    if (reservations.length > 0) {
        return (
            <React.Fragment>
                <Title>Customer Reservations</Title>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Business Name</TableCell>
                            <TableCell>Payment Method</TableCell>
                            <TableCell>Price</TableCell>
                            {/* <TableCell align="right">Edit</TableCell> */}
                            {/* <TableCell align="right">Delete</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((reserve) => (
                            <TableRow key={reserve.ID}>
                                <TableCell>{reserve.reservationDate}</TableCell>
                                <TableCell>{(new Date(reserve.startTime)).toLocaleTimeString()}</TableCell>
                                <TableCell>{reserve.businessName}</TableCell>
                                <TableCell>{reserve.isReserved}</TableCell>
                                <TableCell>{`$${parseFloat(total(reserve.numReservable, reserve.price)).toFixed(2)}`}</TableCell>
                                <TableCell align="right"><Button onClick={() => editReservation(reserve.ID, reserve.businessName)}>
                                    VIEW/EDIT</Button></TableCell>
                                <TableCell align="right"><Button onClick={() => deleteReservation(reserve.ID)}>
                                    CANCEL</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* <Link color="primary" href="#" sx={{ mt: 3 }}>
                    See more reservations
                </Link> */}
            </React.Fragment>
        );
    } else {
        return (
            <p>No Active Reservations</p>
        )
    }
}