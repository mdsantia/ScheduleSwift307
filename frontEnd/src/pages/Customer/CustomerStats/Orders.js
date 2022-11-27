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
    useEffect(() => {
        getMemberSince();
    }, []);
    function getMemberSince() {
        Axios.post("http://" + getIP() + ":3001/api/memberSince", {
            username: props.username,
            password: props.password
        })
            .then((response) => {
                const responseData = response.data;
                setMemberSince(responseData.result[0].creationDate)
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
                </tbody>
            </Table>
        </React.Fragment>
    );
}