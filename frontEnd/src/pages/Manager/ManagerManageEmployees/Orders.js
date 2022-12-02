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
import { Button, TextField, Grid, Typography, Divider } from '@mui/material';
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


    const [names, setNames] = useState([]);
    const { state } = useLocation();
    const navigate = useNavigate();

    function getNames(businessName) {

        Axios.post("http://" + getIP() + ":3001/api/getEmployees", {
            businessName: props.businessName,
        }).then((result) => {
            if (result.data.err) {
                alert("Error! Something has gone wrong!")
            } else {
                const names = result.data.result;
                setNames(names);
            }
        })
    }

    useEffect(() => {
        getNames(props.businessName);

    }, []);

    const open = (e) => {
        e.preventDefault();
        if (e.currentTarget.name === 'Dash') {
            navigate("/managerViewShifts", {
                state: {
                    username: state.username,
                    password: state.password,
                    businessName: props.businessName,
                    other: e.currentTarget.id,
                }
            })
        } else if (e.currentTarget.name === 'Make') {
            navigate("/managerChangePermissions", {
                state: {
                    username: state.username,
                    password: state.password,
                    businessName: props.businessName,
                    other: e.currentTarget.id,

                }
            })
        } else {

            Axios.post("http://" + getIP() + ":3001/api/deleteEmployee", {
                username: e.currentTarget.id,

            }).then((result) => {
                if (result.data.err) {
                    alert("Error! Something has gone wrong!")
                } else {
                    getNames(props.businessName);
                }
            })

        }
    }

    if (names.length > 0) {

        return (
            <React.Fragment>
                <Box component="form" validate="true" /*onSubmit={}*/ sx={{ mt: 3 }}>
                    <Title>{props.businessName}'s Employees</Title>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">First Name</TableCell>
                                <TableCell align="center">Last Name</TableCell>
                                <TableCell align="center">Username</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {names.map((names, index) => (
                                <TableRow>
                                    <TableCell align="center">{names.firstName}</TableCell>
                                    <TableCell align="center">{names.lastName}</TableCell>
                                    <TableCell align="center">{names.username}</TableCell>
                                    <TableCell align="right"><Button name = {"Dash"} id ={names.username} onClick={open}>
                                    View Shifts</Button></TableCell>
                                    <TableCell align="right"><Button name = {"Make"} id ={names.username} onClick={open}>
                                    Change Permissions</Button></TableCell>
                                    <TableCell align="right"><Button name = {"Delete"} id ={names.username} onClick={open}>
                                    Delete Employee</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

            </React.Fragment >
        );
    } else {
        return (
            <p>No Employees</p>
        )
    }
}