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

export default function Orders(props) {
    const { state } = useLocation();
    const [ numEntries, setNumEntries ] = useState([]);
    const [rows, setRows] = useState([]);

    // Generate Order Data
    function createData(id, date, time, name, paymentMethod, amount) {
        return { id, date, time, name, paymentMethod, amount };
    }

    const addRow = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:3001/api/activeEvents", {
            username : state.username,
        }).then((result) => {
            if (result.data.message) {
                alert(`There are no more associated active reservations to your account.`);
            } else {
                alert(numEntries);
                for (let entryNum = 0 + numEntries; entryNum < 5 + numEntries; entryNum++) {
                    rows.push(createData(result.data[entryNum]["ID"], result.data[entryNum]["reservationDate"],
                    result.data[entryNum]["startTime"], result.data[entryNum]["businessName"], 'Yes', result.data[entryNum]["price"]));
                    setRows(rows);
                    setNumEntries(entryNum+1);
                }
            }
        })
    }

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
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.time}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.paymentMethod}</TableCell>
                            <TableCell>{`$${row.amount}`}</TableCell>
                            <TableCell align="right"><Button id={"Edit" + row.id}>Edit</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link color="primary" href="#" onClick={addRow} sx={{ mt: 3 }}>
                See more reservations
            </Link>
        </React.Fragment>
    );
}