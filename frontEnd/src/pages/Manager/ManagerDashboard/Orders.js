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
import { Button, TextField, Grid, Typography, Divider } from '@mui/material';
import { Dayjs } from 'dayjs';

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

export default function Orders(props) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const formattedDate = `${year}-${month}-${day}`;

    const box = [];
    const [rows, setRows] = useState([]);
    const [openTime, setOpenTime] = useState(Dayjs | null);
    const [closeTime, setCloseTime] = useState(Dayjs | null);
    const [closed, setClosed] = useState('');

    const [faq, setFAQ] = useState([]);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    function getBusinessHours() {
        Axios.post("http://localhost:3001/api/getFacilitysData", {
            businessName: props.businessName
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

        // setClosed([0, 0, 0, 0, 0, 0, 0]);
        // setOpenTime([formattedDate, formattedDate, formattedDate, formattedDate, formattedDate, formattedDate, formattedDate]);
        // setCloseTime([formattedDate, formattedDate, formattedDate, formattedDate, formattedDate, formattedDate, formattedDate]);
        setRows([createDay(0, 'Sunday'), createDay(1, 'Monday') , 
        createDay(2, 'Tuesday'), createDay(3, 'Wednesday'), 
        createDay(4, 'Thursday'), createDay(5, 'Friday'), 
        createDay(6, 'Saturday')]);
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`${props.businessName}'s Business Hours have been saved!`);
        let open = [...openTime];
        let close = [...closeTime];
        for (let i = 0; i < 7; i++) {
            if (closed[i]) {
                open[i] = null;
                close[i] = null;
                setOpenTime(open);
                setCloseTime(close);
            }
        }
        Axios.post("http://localhost:3001/api/updateTimes", {
                businessName: props.businessName,
                open: open,
                close: close
            }).then((result) => {
                // alert(`Your reservation has been saved! Your reservation's id is ${result.data.id}`);
            })
    }

    const col = (day) => {
        let row = [];
        if (!closed[day]) {
            row.push(
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        label="Open Time"
                        value={openTime[day]}
                        fullWidth
                        onChange={(newValue) => { let open = [...openTime]; open[day] = newValue; setOpenTime(open) }}
                        renderInput={(params) => <TextField {...params} required/>}
                        shouldDisableTime={(timeValue, clockType) => {
                        // if (clockType === 'minutes' && timeValue % 5) {
                        //     return true;
                        // }
                        return false;
                        }}
                    />
                </LocalizationProvider>
            )
            row.push(
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        validate
                        label="Close Time"
                        value={closeTime[day]}
                        fullWidth
                        onChange={(newValue) => { let close = [...closeTime]; close[day] = newValue; setCloseTime(close) }}
                        renderInput={(params) => <TextField {...params} required/>}
                        shouldDisableTime={(timeValue, clockType) => {
                            const openHour = new Date((openTime[day])).getHours()
                            const openMinute = new Date((openTime[day])).getMinutes()
                        if ((clockType === 'hours' && timeValue < openHour)) {
                                return true;
                            }
                        // if ((clockType === 'minutes' && (new Date(closeTime[day]).getHours()) === openHour && timeValue <= openMinute)
                        //     || ((new Date(closeTime[day]).getHours()) === closeHour && clockType === 'minutes' && timeValue > closeMinute)) {
                        //         return true;
                        //     }
                        if ((clockType === 'hours' && timeValue < (new Date(`${openTime[day]}`).getHours()))
                            || ((new Date(`${openTime[day]}`).getHours()) === (new Date(`${closeTime[day]}`).getHours()) && 
                                clockType === 'minutes' && timeValue <= (new Date(`${openTime[day]}`).getMinutes()) )) {
                                return true;
                            }
                        // if (clockType === 'minutes' && timeValue % 5) {
                        //         return true;
                        //     }
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
    
    const close = (e) => {
        e.preventDefault();
        let copy = [...closed];
        if (closed[e.currentTarget.id]) {
            copy[e.currentTarget.id] = 0;
        } else {
            copy[e.currentTarget.id] = 1;
        }
        setClosed(copy);
    }

    function test () {
        let count = 0;
        for (let i = 0; i < 7; i++) {
            if (closed[i]) {
                count++;
            }
            if (((timeDiff(openTime[i]), closeTime[i]) > 0) && !closed[i])
                return true;
        }
        if (count == 7) {
            return true;
        }
        return false;
    }

    function getFAQ(businessName) {

        Axios.post("http://localhost:3001/api/managerGetFAQ", {
            businessName: props.businessName
        }).then((result) => {
            const faqs = result.data.result;
            setFAQ(faqs);
            console.log("test");
        })
    }

    const addFAQ = (event) => {

        event.preventDefault();
        Axios.post("http://localhost:3001/api/addManagerFAQ", {
            businessName: props.businessName,
            question: question,
            answer: answer
        }).then((result) => {
            if (result.data.err) {
                alert("Error! Something has gone wrong!")
            } else {
                setQuestion('');
                setAnswer('');
                getFAQ(props.businessName);
            }
        })
    }

    function clearFAQ(faqID) {
        Axios.post("http://localhost:3001/api/managerDeleteFAQ", {
            faqID: faqID
        }).then((result) => {
            if (result.data.result.affectedRows === 0) {
            } else {
                getFAQ(props.businessName);
            }
        })
    }

    useEffect(() => {
        getBusinessHours();
        getFAQ(props.businessName);
    }, []);
    if (rows.length > 0) {

        return (
            <React.Fragment>
                <Box component="form" validate="true" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Title>{props.businessName}'s Business Hours</Title>
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
                                    <TableCell align="center"><Button id={weekday.int} onClick={close}>{closed[weekday.int] ? "OPEN":"CLOSE"}</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button
                            type="submit"
                            disabled={
                                (test())
                             ? false : true }
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Save
                    </Button>
                </Box>
                <br></br>
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
                                <TableCell align="right"><Button onClick={() => clearFAQ(faq.ID)}>Clear</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <br></br>
                <br></br>
                <Divider> Add an Additional FAQ </Divider>
                <Box component="form" onSubmit={addFAQ} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        id="question"
                        label="Question"
                        name="question"
                        value={question}
                        autoComplete="question"
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        name="answer"
                        label="Answer"
                        type="answer"
                        id="answer"
                        value={answer}
                        autoComplete="answer"
                        InputProps={{
                            maxLength: 500,
                        }}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add FAQ
                    </Button>
                </Box>
            </React.Fragment >
        );
    } else {
        return (
            <p>Awaiting Response</p>
        )
    }
}