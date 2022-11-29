import * as React from 'react';
import { getIP } from '../../..';
import styled from "styled-components";
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Title from './Title';
import Axios from 'axios';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useEffect, useState } from 'react';
import { Button, TextField, Grid, Typography, Divider, AccordionSummary } from '@mui/material';
import { Dayjs } from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Modal from '@mui/material/Modal';
import { getDate } from 'date-fns';
import { get } from 'react-hook-form';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

function preventDefault(event) {
    event.preventDefault();
}

function createDay(int, day) {
    return {int, day};
}

function timeDiff(start, end) {
    var arg1 = new Date(start);
    var arg2 = new Date(end);
    arg1.setDate((new Date("2022-03-11")).getDate());
    arg2.setDate((new Date("2022-03-11")).getDate());
    if (arg1.toString() === arg2.toString()) {
        return 0;
    }
    return arg1.getTime() - arg2.getTime();
}

const style={
    position: 'absolute',
    top: "50%",
    left: "50%",
    transform: 'translate(-50%,-50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const But = styled.button`
background-color: #694a2e;
color: white;
font-size: 20px;
padding: 10px 60px;
border-radius: 5px;
margin: 10px 0px;
cursor: pointer;
`;

export default function Orders(props) {


    const [shifts, setShifts] = useState([]);
    const { state } = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState([]);

    function getShifts(username) {

        Axios.post("http://" + getIP() + ":3001/api/getShifts", {
            username: state.other
        }).then((result) => {
            const shifts = result.data.result;
            setShifts(shifts);
        })
    }

    function getName() {

        Axios.post("http://" + getIP() + ":3001/api/getEmployeeName", {
            username: state.other,
        }).then((result) => {
            const name = result.data.result[0];
            console.log(name)
            setName(name);
        })
    }

    useEffect(() => {
        getShifts(props.other);
        getName();
    }, []);

    const open = (e) => {
        e.preventDefault();
        if (e.currentTarget.name === 'Dash') {
            navigate("/managerViewShifts", {
                state: {
                    username: state.username,
                    password: state.password,
                    businessName: props.businessName,
                    other: e.currentTarget.id
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

    if (shifts.length > 0) {

        return (
            <React.Fragment>
                <Box component="form" validate="true" /*onSubmit={}*/ sx={{ mt: 3 }}>
                    <Title>{name.firstName}'s Shifts</Title>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time Clocked In</TableCell>
                                <TableCell>Time Clocked Out</TableCell>
                                <TableCell>Total Time of Shift</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {shifts.map((shifts, index) => (
                            <TableRow>
                                <TableCell>{shifts.date}</TableCell>
                                <TableCell>{shifts.timeClockedIn}</TableCell>
                                <TableCell>{shifts.timeClockedOut}</TableCell>
                                <TableCell>{shifts.timeOfShift}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </Box>

            </React.Fragment >
        );
    } else {
        return (
            <p>No Shifts</p>
        )
    }
}