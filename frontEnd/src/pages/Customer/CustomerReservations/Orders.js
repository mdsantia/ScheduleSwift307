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
    // const [ numEntries, setNumEntries ] = useState([]);
    // const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');

    function getReservations() {
        Axios.post("http://localhost:3001/api/activeEvents", {
            username: state.username
        }).then((result) => {
            const allReserves = result.data.result;
            console.log(allReserves);
            setReservations(allReserves);
        })
    }
    
    function editReservation (reserveID, businessName) {
        navigate("/managerEditForm", {
            state: {
                username: state.username,
                password: state.password,
                businessName: businessName,
                ID: reserveID
            }
        })
    }

    function deleteReservation(resID) {
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

    // Generate Order Data
    // function createData(id, date, time, name, paymentMethod, price, numReservable, reservables) {
    //     var amount = 0;
    //     if (!price.includes(";")) {
    //         amount = price;
    //         return { id, date, time, name, paymentMethod, amount };
    //     }
    //     const numReservableItems = reservables.split(";").length;
    //     const priceArray = price.split(";");
    //     const num = numReservable.split(";");
    //     for (let i = 0; i < numReservableItems; i++) {
    //         if (num[i]) {
    //             amount = amount + parseFloat(priceArray[i]) * num[i];
    //         }
    //     }
    //     return { id, date, time, name, paymentMethod, amount };
    // }

    // useEffect(() => {
    //     startFill();
    // }, []);

    // function startFill() {
    //     if (rows.length === 0) {
    //         Axios.post("http://localhost:3001/api/activeEvents", {
    //             username : state.username,
    //         }).then((result) => {
    //             if (!result.data.message) {
    //                 let row = [];
    //                 for (let entryNum = 0; entryNum < 5; entryNum++) {
    //                     if (result.data[entryNum]) {
    //                         row.push(createData(result.data[entryNum].ID, result.data[entryNum]["reservationDate"],
    //                         (new Date(result.data[entryNum]["startTime"])).toLocaleTimeString(), 
    //                         result.data[entryNum]["businessName"], 'Yes', 
    //                         result.data[entryNum]["price"], 
    //                         result.data[entryNum]["numReservable"], result.data[entryNum]["reservableItem"]));
    //                         setRows(row);
    //                         setNumEntries(entryNum+1);
    //                     } else {
    //                         break;
    //                     }
    //                 }
    //             }
    //         })
    //     }
    // }

    // const edit = (e) => {
    //     navigate("/requestForm", {
    //         state: {
    //             username: state.username,
    //             password: state.password,
    //             businessName: e.currentTarget.name,
    //             ID: e.currentTarget.id
    //         }
    //     })
    // }

    // function deleteReservation(resID) {
    //     Axios.post("http://localhost:3001/api/managerDeleteReservation", {
    //         reservationID: resID
    //     }).then((result) => {
    //         if (result.data.result.affectedRows === 0) {
    //             // setError("No Reservation with that ID exists")
    //         } else {
    //             // setError("");
    //             startFill();
    //             alert("Your reservation has been cancelled!\nA confirmation email has been sent to you containing the details of your cancelled reservation.");
    //         }
    //     })
    // }

    // const addRow = (e) => {
    //     e.preventDefault();
    //     Axios.post("http://localhost:3001/api/activeEvents", {
    //         username : state.username,
    //     }).then((result) => {
    //         if (result.data.message || result.data.err) {
    //             alert(`There are no more associated active reservations to your account.`);
    //         } else {
    //             for (let entryNum = 0 + numEntries; entryNum < 5 + numEntries; entryNum++) {
    //                 rows.push(createData(result.data[entryNum]["ID"], result.data[entryNum]["reservationDate"],
    //                 result.data[entryNum]["startTime"], result.data[entryNum]["businessName"], 'Yes', result.data[entryNum]["price"]));
    //                 setRows(rows);
    //                 setNumEntries(entryNum+1);
    //             }
    //         }
    //     })
    // }

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
                            <TableCell align="right">Edit</TableCell>
                            <TableCell align="right">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((reserve) => (
                            <TableRow key={reserve.ID}>
                                <TableCell>{reserve.reservationDate}</TableCell>
                                <TableCell>{reserve.startTime}</TableCell>
                                <TableCell>{reserve.reservedBy}</TableCell>
                                <TableCell>{reserve.isReserved}</TableCell>
                                <TableCell>{`$${parseFloat(total(reserve.numReservable, reserve.price)).toFixed(2)}`}</TableCell>
                                <TableCell align="right"><Button onClick={() => editReservation(reserve.ID, reserve.businessName)}>
                                    Edit</Button></TableCell>
                                <TableCell align="right"><Button onClick={() => deleteReservation(reserve.ID)}>
                                    Delete</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Link color="primary" href="#" sx={{ mt: 3 }}>
                    See more reservations
                </Link>
            </React.Fragment>
        );
    } else {
        return (
            <p>No Active Reservations</p>
        )
    }
}