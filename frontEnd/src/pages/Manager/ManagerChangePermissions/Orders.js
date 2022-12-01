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


    const [permission, setPermission] = useState([]);
    const { state } = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState([]);

    function getPermission(businessName) {

        Axios.post("http://" + getIP() + ":3001/api/getPermissions", {
            username: state.other,
        }).then((result) => {
            if (result.data.err) {
                alert("Error! Something has gone wrong!")
            } else {
                const permissions = result.data.result;
                console.log(permissions);
                setPermission(permissions);
            }
        })
    }

    function getName() {

        Axios.post("http://" + getIP() + ":3001/api/getEmployeeName", {
            username: state.other,
        }).then((result) => {
            const name = result.data.result[0];
            setName(name);
        })
    }

    useEffect(() => {
        getPermission(state.other);
        getName();
    }, []);

    const back = (e) => {
        e.preventDefault();
            navigate("/managerManageEmployees", {
                state: {
                    username: state.username,
                    password: state.password,
                    businessName: props.businessName,
                }
            })
        
    }

    const changeIt = (e) => {
        e.preventDefault();

        let yesno;

        if (e.currentTarget.id === "No") {
            yesno = "Yes";
        } else {
            yesno = "No";
        }

        if (e.currentTarget.name === "Delete") {

            Axios.post("http://" + getIP() + ":3001/api/changeDelete", {
                username: state.other,
                changed: yesno,
            }).then((result) => {
                getPermission(state.order);
            })

        } else if (e.currentTarget.name === "Edit") {

            Axios.post("http://" + getIP() + ":3001/api/changeEdit", {
                username: state.other,
                changed: yesno,
            }).then((result) => {
                getPermission(state.order);
            })
        } else {

            Axios.post("http://" + getIP() + ":3001/api/changeView", {
                username: state.other,
                changed: yesno,
            }).then((result) => {
                getPermission(state.order);
            })
        }
        
    }

        return (
            <React.Fragment>
                <Box component="form" validate="true" /*onSubmit={}*/ sx={{ mt: 3 }}>
                    <Title>{name.firstName}'s Permisions</Title>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Delete</TableCell>
                                <TableCell align="center">Edit</TableCell>
                                <TableCell align="center">View</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {permission.map((permission, index) => (
                                <TableRow>
                                    <TableCell align="center"><Button name = {"Delete"} id= {permission.deleteReservations} onClick={changeIt}>
                                    {permission.deleteReservations}</Button></TableCell>
                                    <TableCell align="center"><Button name = {"Edit"} id= {permission.editReservations} onClick={changeIt}>
                                    {permission.editReservations}</Button></TableCell>
                                    <TableCell align="center"><Button name = {"View"} id= {permission.viewReservations} onClick={changeIt}>
                                    {permission.viewReservations}</Button></TableCell>
                                    <TableCell align="center"><Button name = {"Back"} onClick={back}>
                                    Go Back</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

            </React.Fragment >
        );
}