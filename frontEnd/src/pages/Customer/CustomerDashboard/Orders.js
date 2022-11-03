import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Logo from '../Logo.png';

function preventDefault(event) {
    event.preventDefault();
}

export default function Orders() {
    const { state } = useLocation();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const navigate = useNavigate();
    const [numFacilities, setNumFacilities] = useState(null);
    const [rows, setRows] = useState([]);

    // Generate Order Data
    function createData(id, name) {
        return { id, name };
    }

    function startFill() {
        Axios.post("http://localhost:3001/api/allFacilityData").then((result) => {
            if (result.data.err) {
                alert("Facility data missing!");
            } else {
                // UPDATE ARRAY WITH ALL THE FACILITY DETAILS
                let response = result.data.result
                if (response.length > 0) {
                    if (!numFacilities) {
                        let row = [...rows];
                        for (let entryNum = 0; entryNum < 5; entryNum++) {
                            row.push(createData(response[entryNum]["ID"],
                            response[entryNum]["businessName"]));
                            setRows(row);
                            setNumFacilities(numFacilities+1);
                        }
                    }
                }
            }
        })
    }
    useEffect(() => {
        startFill();
    }, [])

    const open = (e) => {
        e.preventDefault();
        if (e.currentTarget.name === 'Dash') {
            navigate("/facilityHomepage", {
                state: {
                    username: state.username,
                    password: state.password,
                    businessName: e.currentTarget.id
                }
            })
        } else {
            navigate("/requestForm", {
                state: {
                    username: state.username,
                    password: state.password,
                    businessName: e.currentTarget.id
                }
            })
        }
    }
    
    const addRow = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:3001/api/allFacilityData").then((result) => {
            if (result.data.message) {
                alert(`There are no more associated active reservations to your account.`);
            } else {
                let response = result.data.result
                for (let entryNum = 0 + numFacilities; entryNum < 5 + numFacilities; entryNum++) {
                    rows.push(createData(response[entryNum]["ID"],
                        response[entryNum]["businessName"]));
                    setRows(rows);
                    setNumFacilities(numFacilities+1);
                }
            }
        })
    }

    function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        navigate("/customerReserve", {
            state: {
                username: state.username,
                password: state.password
            }
        })
    }
    if (rows) {
        console.log(rows)
        return (
            <React.Fragment>
                <Title>Customer Reservations</Title>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'>Business Name</TableCell>
                            <TableCell align='center'>Business Dashboard</TableCell>
                            <TableCell align='right'>Business Reservation Form</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell  align="left">{row.name}</TableCell>
                                <TableCell align="center"><Button name = {"Dash"} id={row.name} onClick={open}>
                                    See {row.name}'s Home Page</Button></TableCell>
                                <TableCell align="right"><Button name = {"Make"} id={row.name} onClick={open}>
                                    Make Reservation</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Link color="primary" href="#" onClick={addRow} sx={{ mt: 3 }}>
                    See more facilities
                </Link>
            </React.Fragment>
        );
    } else {
        return (
            <p>Awaiting Results </p>
        )
    }
}