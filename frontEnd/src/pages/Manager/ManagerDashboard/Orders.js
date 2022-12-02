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
import { Button, TextField, Grid, Typography, Divider, Stack, NativeSelect, InputLabel } from '@mui/material';
import { Dayjs } from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Modal from '@mui/material/Modal';
import { getDate } from 'date-fns';

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
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const formattedDate = `${year}-${month}-${day}`;

    const [open, setOpen] = React.useState(false);
    const [openExcTime, setOpenExcTime] = useState(Dayjs | null);
    const [closeExcTime, setCloseExcTime] = useState(Dayjs | null);
    const [allNonReserves, setAllNonReserves] = useState([]);
    const [exceptionDate, setExceptionDate] = useState(new Date(formattedDate));
    const [nonReservable, setNonReservable] = useState('');
    const [nonReservablePrice, setNonReservablePrice] = useState('');
    const [table, setTable] = useState([]);
    const [timeArray, setTimeArray] = useState([<Grid item xs={12} sm={4} fullWidth align="center"><strong>CLOSED</strong></Grid>,
    <Grid item xs={12} sm={4} fullWidth align="center"><strong>CLOSED</strong></Grid>]);

    const box = [];
    const [rows, setRows] = useState([]);
    const [openTime, setOpenTime] = useState(Dayjs | null);
    const [closeTime, setCloseTime] = useState(Dayjs | null);
    const [closed, setClosed] = useState('');

    const [faq, setFAQ] = useState([]);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const [contact, setContact] = useState([]);
    const [contactType, setContactType] = useState('Address');
    const [actualContact, setActualContact] = useState('');

    const [format, setFormat] = useState('');


    function getBusinessHours() {
        Axios.post("http://" + getIP() + ":3001/api/getFacilitysData", {
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
                    if (val[i] === 'null' || val[i] == "") {
                        closed.push(1);
                        open.push(new Date(formattedDate+"T00:00"));
                    } else {
                        closed.push(0);
                        open.push(val[i]);
                    }
                } else {
                    if (val[i] === 'null' || val[i] == "") {
                        close.push(new Date(formattedDate+"T23:59"));
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
    
    const handleOpen = (event) => {
        setOpen(true);
        event.preventDefault();
    }

    const handleClose = () => setOpen(false);

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
        Axios.post("http://" + getIP() + ":3001/api/updateTimes", {
                businessName: props.businessName,
                open: open,
                close: close
            }).then((result) => {
                // alert(`Your reservation has been saved! Your reservation's id is ${result.data.id}`);
            })
    }

    function formatPhone(number) {
        let p1 = number.substring(0, 3);
        let p2 = number.substring(3,6);
        let p3 = number.substring(6, 10);

        let finalNum = "(" + p1 + ")" + "-" + p2 + "-" + p3;

        console.log(finalNum);
        setFormat(finalNum);
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
            if (((timeDiff(openTime[i], closeTime[i]) < 0)) && !closed[i])
                return true;
        }
        if (count == 7) {
            return true;
        }
        return false;
    }

    function getFAQ(businessName) {

        Axios.post("http://" + getIP() + ":3001/api/managerGetFAQ", {
            businessName: props.businessName
        }).then((result) => {
            const faqs = result.data.result;
            setFAQ(faqs);
        })
    }

    function getNonReserves(businessName) {
        Axios.post("http://" + getIP() + ":3001/api/getNonReserves", {
            businessName: props.businessName
        }).then((result) => {
            const allNonReserves = result.data.result;
            setAllNonReserves(allNonReserves);
        })
    }

    const addFAQ = (event) => {

        event.preventDefault();
        Axios.post("http://" + getIP() + ":3001/api/addManagerFAQ", {
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

    const addNonReserve = (event) => {
        event.preventDefault();
        Axios.post("http://" + getIP() + ":3001/api/addNonReserve", {
            businessName: props.businessName,
            nonReservable: nonReservable,
            price: nonReservablePrice
        }).then((result) => {
            if(result.data.err) {
                alert("Error! Something has gone wrong!")
            } else {
                setNonReservable('');
                setNonReservablePrice('');
                getNonReserves(props.businessName);
            }
        })
    }

    function clearFAQ(faqID) {
        Axios.post("http://" + getIP() + ":3001/api/managerDeleteFAQ", {
            faqID: faqID
        }).then((result) => {
            if (result.data.result.affectedRows === 0) {
            } else {
                getFAQ(props.businessName);
            }
        })
    }
    function clearNonRes(nonResID) {
        Axios.post("http://" + getIP() + ":3001/api/deleteNonReserve", {
            nonResID: nonResID
        }).then((result) => {
            if (result.data.result.affectedRows === 0) {

            } else {
                getNonReserves(props.businessName);
            }
        })
    }

    const addDate = (event) => {
        event.preventDefault();
        Axios.post("http://" + getIP() + ":3001/api/addExceptionDate", {
            businessName: props.businessName,
            date: exceptionDate,
            startTime: openExcTime?openExcTime:"closed",
            endTime: closeExcTime?closeExcTime:"closed"
        }).then((result) => {
            if (result.data.err) {
                alert("Error! Something has gone wrong!")
            } else {
                getDates(props.businessName);
            }
        })
    }

    function getDates(businessName) {
        Axios.post("http://" + getIP() + ":3001/api/getExceptionDates", {
            businessName: props.businessName
        }).then((result) => {
            const datesTemp = result.data.result;
            var tableTemp = [];
            if (datesTemp.length > 0) {
                tableTemp.push(<Title>Saved Exception Dates</Title>);
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
                                <TableCell><strong>{(new Date(date.date + "T00:00")).toDateString()}</strong></TableCell>
                                <TableCell>{(date.startTime === 'closed')?<strong>CLOSED</strong>:(new Date(date.startTime)).toLocaleTimeString()}</TableCell>
                                <TableCell>{(date.endTime === 'closed')?<strong>CLOSED</strong>:(new Date(date.endTime)).toLocaleTimeString()}</TableCell>
                                <TableCell align="right"><Button onClick={() => {clearDate(date.ID)}}>Remove</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                );
            }
            setTable(tableTemp);
        })
    }

    function clearDate(id) {
        Axios.post("http://" + getIP() + ":3001/api/deleteExceptionDate", {
            id: id
        }).then((result) => {
            if (result.data.result.affectedRows === 0) {
            } else {
                getDates(props.businessName);
            }
        })
    }

    function openClose(event) {
        event.preventDefault();
        let arr = [];
        if (openExcTime) {
            setOpenExcTime(null);
            setCloseExcTime(null);
            arr.push(<Grid item xs={12} sm={4} fullWidth align="center"><strong>CLOSED</strong></Grid>);
        } else {
            setOpenExcTime(new Date(formattedDate + "T00:00"));
            setCloseExcTime(new Date(formattedDate + "T23:59"));
        }
        setTimeArray(arr);
    }

    const changeContact = (event) => {

        event.preventDefault();

        if (contactType == "Phone") {
            var phoneno = /^\d{10}$/;
            if(actualContact.match(phoneno)){

                Axios.post("http://" + getIP() + ":3001/api/changeContact", {
                businessName: props.businessName,
                contactType: contactType,
                actualContact: actualContact

                }).then((result) => {
                    if (result.data.err) {
                        alert("Error! Something has gone wrong!")
                    } else {
                        getContact(props.businessName);
                    }
                }) 
            } else {
                alert("Enter a Valid Phone Number");
            }
        
        } else {

            Axios.post("http://" + getIP() + ":3001/api/changeContact", {
                businessName: props.businessName,
                contactType: contactType,
                actualContact: actualContact
            }).then((result) => {
                if (result.data.err) {
                    alert("Error! Something has gone wrong!")
                } else {
                    getContact(props.businessName);
                }
            }) 
        }
    }

    function getContact(businessName) {
        Axios.post("http://" + getIP() + ":3001/api/managerGetContact", {
            businessName: businessName,
        }).then((result) => {
            formatPhone(result.data[0].phoneNumber);
            setContact(result.data[0]);
        })
    }

    useEffect(() => {
        getBusinessHours();
        getFAQ(props.businessName);
        getDates(props.businessName);
        getNonReserves(props.businessName);
        getContact(props.businessName);
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
                            Save Default Business Hours
                    </Button>
                    {table[0]}
                    {table[1]}
                    <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleOpen}
                        >
                            Add an exception
                    </Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        disableEscapeKeyDown
                        aria-labelledby='modal-modal-title'
                        aria-describedby='modal-modal-description'
                    ><Box sx={style}>
                    <Typography id="modal-modal-title" align="center">Add an Exception Date</Typography>
                    <But onClick={openClose} fullWidth>{openExcTime?"CLOSE":"OPEN"}</But>
                    <br></br>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    id="reservationDate"
                                    label="Select Date"
                                    validate="true"
                                    value={exceptionDate}
                                    onChange={(newValue) => { setExceptionDate(newValue)} }
                                    renderInput={(params) => <TextField {...params}/>}
                                    shouldDisableDate={(date) => {
                                        if (date < new Date(new Date()).toDateString() + "T00:00") {
                                            return true;
                                        }
                                        return false;
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        {(openExcTime)?<Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Open Time"
                                value={openExcTime}
                                fullWidth
                                onChange={(newValue) => { setOpenExcTime(newValue) }}
                                renderInput={(params) => <TextField {...params} required/>}
                                />
                        </LocalizationProvider>
                        </Grid>:
                        <Grid item xs={12} sm={4} fullWidth align="center">
                            <strong>CLOSED</strong>
                        </Grid>}
                        {(closeExcTime)?<Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Close Time"
                                value={closeExcTime}
                                fullWidth
                                onChange={(newValue) => { setCloseExcTime(newValue) }}
                                renderInput={(params) => <TextField {...params} required />}
                                shouldDisableTime={(timeValue, clockType) => {
                                    const openHour = new Date((openExcTime)).getHours()
                                    const openMinute = new Date((openExcTime)).getMinutes()
                                    if ((clockType === 'hours' && timeValue < openHour)) {
                                        return true;
                                    }
                                    if ((clockType === 'hours' && timeValue < openHour)
                                    || ((new Date(`${closeExcTime}`).getHours()) === openHour && 
                                    clockType === 'minutes' && timeValue <= openMinute)) {
                                        return true;
                                    }
                                    return false;
                                }}
                                />
                        </LocalizationProvider>
                        </Grid>:
                        <Grid item xs={12} sm={4} fullWidth align="center">
                            <strong>CLOSED</strong>
                        </Grid>}
                    </Grid>
                    <Button align="center" onClick={handleClose}>Cancel</Button>
                    <Button align="center" form='my-form' onClick={addDate}>Submit</Button>
                </Box>
                </Modal>
                </Box>
                <br></br>
                <br></br>
                <Title>Non-Reservables</Title>
                <Table size="small">
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
                                <TableCell align="right"><Button onClick={() => clearNonRes(nonRes.ID)}>Clear</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <br></br>
                <br></br>
                <Divider> Add a Non-Reservable Item </Divider>
                <Box component="form" onSubmit={addNonReserve} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        id="nonReservable"
                        label="Non-Reservable Item"
                        name="nonReservable"
                        value={nonReservable}
                        autoComplete="nonReservable"
                        onChange={(e) => setNonReservable(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        name="nonReservablePrice"
                        label="Non-Reservable Item's Price"
                        type="number"
                        id="nonReservablePrice"
                        value={nonReservablePrice}
                        autoComplete="nonReservablePrice"
                        InputProps={{
                            maxLength: 500,
                        }}
                        onChange={(e) => setNonReservablePrice(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add Non-Reservable
                    </Button>
                </Box>
                <br></br><Title>FAQ</Title>
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
                <br></br>
                <br></br>
                <Title>Contact Information</Title>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>{contact.address}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Phone</TableCell>
                            <TableCell>{format}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>{contact.email}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <br></br>
                <Box component="form" onSubmit={changeContact} noValidate sx={{ mt: 1 }}>

                    <Stack alignItems="center">

                    <p id="demo-simple-select-label"><u>Select Contact to Change</u></p>

                    <NativeSelect id="select" sx={{width: 1/5}}
                    onChange={(e) => setContactType(e.target.value)}>
                        <option value={"Address"}>Address</option>
                        <option value={"Phone"}>Phone</option>
                        <option value={"Email"}>Email</option>
                    </NativeSelect>
                    
                    <TextField
                        //sx={{m:3}}
                        margin="normal"
                        required
                        name="contact"
                        label="Contact"
                        type="answer"
                        id="answer"
                        value={actualContact}
                        autoComplete="contact"
                        InputProps={{
                            maxLength: 500,
                        }}
                        onChange={(e) => setActualContact(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ m: 1 }}
                    >
                        Change Contact
                    </Button>

                    </Stack>
                </Box>

            </React.Fragment >
        );
    } else {
        return (
            <p>Awaiting Response</p>
        )
    }
}