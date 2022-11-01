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
import { TableFooter } from '@mui/material';
import { InputLabel } from '@mui/material';

function preventDefault(event) {
    event.preventDefault();
}

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
        navigate("/managerFillForm", {
            state: {
                username: props.username,
                password: props.password,
                businessName: props.businessName,
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
                getReservations(props.businessName);
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

    const changePrice = (event) => {

        event.preventDefault();
        const data = new FormData(event.currentTarget);

        console.log(data.get('resID'));
        console.log(data.get('newPrice'));

        Axios.post("http://localhost:3001/api/managerChangePrice", {    

            id: data.get('resID'),
            newPrice: data.get('newPrice'),

        }).then(() => {
            getReservations(props.businessName);
        })
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
                            <TableCell>Price</TableCell>
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
                                <TableCell align="right">{`$${total(reserve.numReservable, reserve.price)}`}</TableCell>
                                <TableCell><Button onClick={() => editReservation(reserve.ID)}>Edit</Button></TableCell>
                                <TableCell><Button onClick={() => deleteReservation(reserve.ID)}>Delete</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <br></br>
                <h3>Change Reservation Prices</h3>
                <Box component="form" validate="true" onSubmit={changePrice} sx={{ mt: 3 }}>
                    <Grid container spacing={0}>
                        <Grid xs={7}>
                            <TextField
                                placeholder="Reservation ID"
                                name="resID"
                                id="resID"
                                required
                            />
                        </Grid>
                        <Grid>
                        <TextField
                                placeholder="New Price"
                                id="newPrice"
                                name="newPrice"
                                required
                            />
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Change
                    </Button>
                </Box>
            </React.Fragment >
        );
    } else {
        return (
            <p>No active Reservations at this business</p>
        )
    }
}