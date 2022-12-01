import * as React from 'react';
import { getIP } from '../../..';
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
    const [table, setTable] = useState([]);
    const [FAQarray, setFAQarray] = useState([]);
    const [NONarray, setNONarray] = useState([]);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [allNonReserves, setAllNonReserves] = useState([]);
    const [contact, setContact] = useState([]);

    function getBusinessHours() {
        Axios.post("http://" + getIP() + ":3001/api/getFacilitysData", {
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
                    if (val[i] === 'null' || val[i] == null) {
                        closed.push(1);
                        open.push(formattedDate);
                    } else {
                        closed.push(0);
                        open.push(val[i]);
                    }
                } else {
                    if (val[i] === 'null' || val[i] == null) {
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
                        // shouldDisableTime={(timeValue, clockType) => {
                        // if (clockType === 'minutes' && timeValue % 5) {
                        //     return true;
                        // }
                        // return false;
                        // }}
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
                        // shouldDisableTime={(timeValue, clockType) => {
                        // if (clockType === 'minutes' && timeValue % 5) {
                        //     return true;
                        // }
                        // return false;
                        // }}
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

        Axios.post("http://" + getIP() + ":3001/api/managerGetFAQ", {
            businessName: state.businessName
        }).then((result) => {
            const faqs = result.data.result;
            let temp = [];
            setFAQ(faqs);
            if (faqs.length > 0) {
                console.log("here")
                temp.push(<Title>Frquently Asked Questions</Title>);
                temp.push(<Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell size="small">Question:</TableCell>
                        <TableCell>Answer:</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {faqs.map((faq, index) => (
                        <TableRow>
                            <TableCell><strong>{faq.question}</strong></TableCell>
                            <TableCell>{faq.answer}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>);
            }
            setFAQarray(temp);
        })
    }
    function getNonReserves(businessName) {
        Axios.post("http://" + getIP() + ":3001/api/getNonReserves", {
            businessName: state.businessName
        }).then((result) => {
            const allNonReserves = result.data.result;
            setAllNonReserves(allNonReserves);
            let temp = [];
            if (allNonReserves.length > 0) {
                temp.push(<Title>Non-Reservable Items</Title>);
                temp.push(<Typography>If you are interested in any of these items, feel free to contact {state.businessName}!</Typography>);
                temp.push(<Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell size="small">Non-Reservable Item:</TableCell>
                        <TableCell>Price:</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {allNonReserves.map((nonRes, index) => (
                        <TableRow>
                            <TableCell><strong>{nonRes.nonReservable}</strong></TableCell>
                            <TableCell>${nonRes.price}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>);
            }
            setNONarray(temp);
        })
    }
    function getContact(businessName) {

        Axios.post("http://" + getIP() + ":3001/api/managerGetContact", {
            businessName: state.businessName
        }).then((result) => {
            const contacts = result.data.result;
            setContact(contacts);
        })
    }
    function getDates(businessName) {
        Axios.post("http://" + getIP() + ":3001/api/getExceptionDates", {
            businessName: state.businessName
        }).then((result) => {
            const datesTemp = result.data.result;
            var tableTemp = [];
            if (datesTemp.length > 0) {
                tableTemp.push(<Title>The aforementioned hours do not apply on:</Title>);
                tableTemp.push(
                    <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell size="small">Date</TableCell>
                            <TableCell>Opens at</TableCell>
                            <TableCell>Closes at</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datesTemp.map((date, index) => (
                            <TableRow>
                                <TableCell><strong>{(new Date(date.date)).toDateString()}</strong></TableCell>
                                <TableCell>{(date.startTime === 'closed')?<strong>CLOSED</strong>:(new Date(date.startTime)).toLocaleTimeString()}</TableCell>
                                <TableCell>{(date.endTime === 'closed')?<strong>CLOSED</strong>:(new Date(date.endTime)).toLocaleTimeString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                );
            }
            setTable(tableTemp);
        })
    }

    useEffect(() => {
        getBusinessHours();
        getFAQ(state.businessName);
        getContact(state.businessName);
        getDates(state.businessName);
        getNonReserves(state.businessName);
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
                    {table[0]?<br></br>:false}
                    {table[0]}
                    {table[1]}
                </Box>
                {FAQarray[0]?<br></br>:false}
                {FAQarray[0]}
                {FAQarray[1]}
                {NONarray[0]?<br></br>:false}
                {NONarray[0]}
                {NONarray[1]}
                {NONarray[2]}
                <br></br>
                <Title>Contact Information</Title>
                <Table size="small">
                    {/* <TableHead>
                        <TableRow>
                            <TableCell size="small">Contact Type:</TableCell>
                            <TableCell>Contact:</TableCell>
                        </TableRow>
                    </TableHead> */}
                    <TableBody>
                        {contact.map((contact, index) => (
                            <TableRow>
                                <TableCell><strong>{contact.contactType}</strong></TableCell>
                                <TableCell>{contact.actualContact}</TableCell>
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
            </React.Fragment>
        );
    } else {
        return (
            <p>Awaiting Response</p>
        )
    }
}