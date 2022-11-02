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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useEffect, useState } from 'react';
import { Button, TextField, Grid, Typography } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Logo from '../Logo.png';

function preventDefault(event) {
    event.preventDefault();
}

function createDay(int, day) {
    return {int, day};
}

export default function Orders(props) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const formattedDate = `${year}-${month}-${day}`;

    const box = [];
    const { state } = useLocation();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [openTime, setOpenTime] = useState(Dayjs | null);
    const [closeTime, setCloseTime] = useState(Dayjs | null);
    const [closed, setClosed] = useState('');

    const [faq, setFAQ] = useState([]);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    function getBusinessHours() {
        Axios.post("http://localhost:3001/api/getFacilitysData", {
            businessName: state.businessName
        }).then((result) => {
            let Sun = result.data.result[0].Sun;
            let Mon = result.data.result[0].Mon;
            let Tues = result.data.result[0].Tues;
            let Wed = result.data.result[0].Wed;
            let Thurs = result.data.result[0].Thurs;
            let Fri = result.data.result[0].Fri;
            let Sat = result.data.result[0].Sat;
            let full = `${Sun};${Mon};${Tues};${Wed};${Thurs};${Fri};${Sat}`;
            let val = full.split(';');
            let closed = [];
            let open = [];
            let close = [];
            for (let i = 0; i < 14; i++) {
                if (i % 2 === 0) {
                    if (val[i] === 'null') {
                        closed.push(1);
                        open.push(formattedDate);
                    } else {
                        closed.push(0);
                        open.push(val[i]);
                    }
                } else {
                    if (val[i] === 'null') {
                        close.push(formattedDate);
                    } else {
                        close.push(val[i]);
                    }
                }
            }
            setClosed(closed);
            setOpenTime(open);
            setCloseTime(close);
        });

        setRows([createDay(0, 'Sunday'), createDay(1, 'Monday') , 
        createDay(2, 'Tuesday'), createDay(3, 'Wednesday'), 
        createDay(4, 'Thursday'), createDay(5, 'Friday'), 
        createDay(6, 'Saturday')]);
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        navigate("/requestForm", {
            state: {
                username: state.username,
                password: state.password,
                businessName: state.businessName
            }
        })
    }

    const col = (day) => {
        let row = [];
        if (!closed[day]) {
            row.push(
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        // label="Open Time"
                        value={openTime[day]}
                        fullWidth
                        // onChange={(newValue) => { let open = [...openTime]; open[day] = newValue; setOpenTime(open) }}
                        renderInput={(params) => <TextField {...params} required/>}
                        shouldDisableTime={(timeValue, clockType) => {
                        if (clockType === 'minutes' && timeValue % 5) {
                            return true;
                        }
                        return false;
                        }}
                    />
                </LocalizationProvider>
            )
            row.push(
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        // label="Close Time"
                        value={closeTime[day]}
                        fullWidth
                        renderInput={(params) => <TextField {...params} required/>}
                        shouldDisableTime={(timeValue, clockType) => {
                        if (clockType === 'minutes' && timeValue % 5) {
                            return true;
                        }
                        return false;
                        }}
                    />
                </LocalizationProvider>
            )
            box.push(row);
        } else {
            row.push(
                <b>CLOSED</b>
            )
            row.push(
                <b>CLOSED</b>
            )
            box.push(row);
        }
    }

    function getFAQ(businessName) {

        Axios.post("http://localhost:3001/api/managerGetFAQ", {
            businessName: state.businessName
        }).then((result) => {
            const faqs = result.data.result;
            setFAQ(faqs);
            console.log("test");
        })
    }

    useEffect(() => {
        getBusinessHours();
        getFAQ(state.businessName);
    }, []);
    if (rows.length > 0) {

        return (
            <React.Fragment>
                <Box component="form" validate="true" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Title>{state.businessName}'s Business Hours</Title>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Week Day</TableCell>
                                <TableCell align="center">Opens at</TableCell>
                                <TableCell align="center">Closes at</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((weekday, index) => (
                                <TableRow key={weekday.day}>
                                    <TableCell align="center">{<b>{weekday.day}</b>}</TableCell>
                                    {col(weekday.int)}
                                    <TableCell align="center">{box[weekday.int][0]}</TableCell>
                                    <TableCell align="center">{box[weekday.int][1]}</TableCell>
                                    {/* <TableCell align="center"><Button id={weekday.int} onClick={close}>Closed/OPEN</Button></TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Make Reservation
                    </Button>
                </Box>
                <br></br>
                <Title>FAQ</Title>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell size="small">Question:</TableCell>
                            <TableCell>Answer:</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {faq.map((faq, index) => (
                            <TableRow>
                                <TableCell><strong>{faq.question}</strong></TableCell>
                                <TableCell>{faq.answer}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment >
        );
    } else {
        return (
            <p>Awaiting Response</p>
        )
    }
}