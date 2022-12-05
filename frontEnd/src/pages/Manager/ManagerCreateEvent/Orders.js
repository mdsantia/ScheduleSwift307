import * as React from 'react';
import { getIP } from '../../..';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Axios from 'axios';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MenuUnstyled, useSlotProps } from '@mui/base';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EventIcon from '@mui/icons-material/Event';
import { MenuItem, Select } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { Button, TextField, Grid, Typography, Divider } from '@mui/material';


function preventDefault(event) {
    event.preventDefault();
}

export default function Orders(props) {
    const box = [];
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [editPolicy, setEditPolicy] = useState([]);
    const [numReservableItems, setNumReservableItems] = useState(1);
    const [nameArray, setNameArray] = useState([]);
    const [numArray, setNumArray] = useState([]);
    const [priceArray, setPriceArray] = useState([]);
    const [numPeople, setNumPeople] = useState([]);
    const businessName = props.businessName;
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(null);
    var paymentDetails = [];
    const [paymentStatus, setPaymentStatus] = useState("none");
    const [isPayment, setIsPayment] = useState(false);
    const [paymentNum, setPaymentNum] = useState(0);
    const [notes, setNotes] = useState([]);
    const [note, setNote] = useState('');
    useEffect(() => {
        insertValues();
    }, [])

    function getNotes(businessName) {
        Axios.post("http://" + getIP() + ":3001/api/reservationGetNotes", {
            businessName: props.businessName
        }).then((result) => {
            const notes = result.data.result;
            setNotes(notes);
        })
    }

    const addNote = (event) => {
        let editList = [...editPolicy];
        editList.push(false);
        setEditPolicy(editList);
        event.preventDefault();
        Axios.post("http://" + getIP() + ":3001/api/addReservationNote", {
            businessName: props.businessName,
            note: note
        }).then((result) => {
            if (result.data.err) {
                alert("Error! Something has gone wrong!")
            } else {
                setNote('');
                getNotes(props.businessName);
            }
        })
    }

    function editNote(index) {
        let editList = [...editPolicy];
        if (editList[index]) {
            Axios.post("http://" + getIP() + ":3001/api/editReservationNote", {
                note: notes[index],
                id: notes[index].ID
            }).then((result) => {
                if (result.data.err) {
                    alert("Error! Something has gone wrong!")
                } else {
                    getNotes(props.businessName);
                }
            })
        }
        editList[index] = !editList[index];
        setEditPolicy(editList);
    }

    function clearNote(noteID) {
        if(window.confirm("Are you sure you want to clear this policy/note?")) {
            Axios.post("http://" + getIP() + ":3001/api/reservationDeleteNote", {
                noteID: parseInt(noteID)
            }).then((result) => {
                if (result.data.result.affectedRows === 0) {
                    alert("no!")
                } else {
                    getNotes(props.businessName);
                }
            })
        }
    }

    function makeDetails() {
        if (isPayment) {
            if (paymentStatus === "depositFixed") {
            paymentDetails.push(
                <Grid container={2}><Grid item xs={12} sm={6}>
                    <Select
                    fullWidth
                    value={paymentStatus}
                    label="Select Payment Details"
                    onChange={(newVal) => { setPaymentStatus(newVal.target.value) }}>
                    <MenuItem value={"required"}>Complete Payment Required</MenuItem>
                    <MenuItem value={"depositPer"}>Deposit By Percentage Of Total</MenuItem>
                    <MenuItem value={"depositFixed"}>Fixed Amount Deposit</MenuItem>
                    <MenuItem value={"optional"}>Allow Customer To Opt For Payment</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                    fullWidth
                    value={parseFloat(paymentNum).toFixed(2)}
                    InputProps={{inputProps : {min:0.01, step:0.10}}}
                    type="number"
                    label="Minimum Deposit Payment Required in $:"
                    onChange={(newVal) => { setPaymentNum(parseFloat(newVal.target.value)) }}>
                    </TextField>
                </Grid></Grid>);
            } else if (paymentStatus === "depositPer") {
                    paymentDetails.push(
                    <Grid container={2}><Grid item xs={12} sm={6}>
                        <Select
                        fullWidth
                        value={paymentStatus}
                        label="Select Payment Details"
                        onChange={(newVal) => { setPaymentStatus(newVal.target.value) }}>
                        <MenuItem value={"required"}>Complete Payment Required</MenuItem>
                        <MenuItem value={"depositPer"}>Deposit By Percentage Of Total</MenuItem>
                        <MenuItem value={"depositFixed"}>Fixed Amount Deposit</MenuItem>
                        <MenuItem value={"optional"}>Allow Customer To Opt For Payment</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        fullWidth
                        value={parseFloat(paymentNum).toFixed(1)}
                        InputProps={{inputProps : {min:1, max:100, step:0.10}}}
                        type="number"
                        label="Minimum Deposit Payment Required in %:"
                        onChange={(newVal) => { setPaymentNum(parseFloat(newVal.target.value)) }}>
                        </TextField>
                    </Grid></Grid>);
            } else {
                paymentDetails = [];
                paymentDetails.push(
                <Grid container={2}><Grid item xs={12} sm={6}>
                    <Select
                    fullWidth
                    value={paymentStatus}
                    label="Select Payment Details"
                    onChange={(newVal) => { setPaymentStatus(newVal.target.value) }}>
                    <MenuItem value={"required"}>Complete Payment Required</MenuItem>
                    <MenuItem value={"depositPer"}>Deposit By Percentage Of Total</MenuItem>
                    <MenuItem value={"depositFixed"}>Fixed Amount Deposit</MenuItem>
                    <MenuItem value={"optional"}>Allow Customer To Opt For Payment</MenuItem>
                    </Select>
                </Grid></Grid>);
            }
        }
    }

    const UpdatePayment = (event) => {
        event.preventDefault();
        if (isPayment) {
            setIsPayment(false);
            paymentDetails = null;
            return;
        } else {
            setIsPayment(true);
        }
    }

    function makeBox() {
        for (let element = 1; element <= numReservableItems; element++) {
            // Then the code pushes each time it loops to the empty array I initiated.
            box.push(
                <Grid container spacing={2}>
                    <Grid  item xs={12} sm={3}>
                    <TextField
                        required
                        fullWidth
                        name={'Reserved' + element}
                        label={'Reserved ' + element}
                        type={element}
                        id={element}
                        value={nameArray[element - 1]}
                        onChange={(newValue) => { 
                            let newArr = [...nameArray];
                            newArr[parseInt(newValue.target.id) - 1] = newValue.target.value;
                            setNameArray(newArr);
                        }}
                    />
                    </Grid>
                    <Grid  item xs={12} sm={3}>
                    <TextField
                        required
                        fullWidth
                        name={'Price' + element}
                        label={'Price ' + element}
                        id={element}
                        value={priceArray[element - 1]}
                        type="number" InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
                        onChange={(newValue) => { 
                            let newArr = [...priceArray];
                            newArr[parseInt(newValue.target.id) - 1] = parseFloat(newValue.target.value);
                            setPriceArray(newArr);
                        }}
                    />
                    </Grid>
                    <Grid  item xs={12} sm={4}>
                    <TextField
                        required
                        fullWidth
                        name={'Reserved' + element}
                        label={'#Reserved ' + element}
                        InputProps={{ inputProps: { min: 0, step: 1 } }}
                        type="number"
                        id={element}
                        value={numArray[element - 1]}
                        onChange={(newValue) => { 
                            let newArr = [...numArray];
                            newArr[parseInt(newValue.target.id) - 1] = newValue.target.value;
                            setNumArray(newArr);
                        }}
                    />
                    </Grid>
                </Grid>
            );
            }
    }

    const add_rem = (event) => {
        event.preventDefault();
        console.log(numReservableItems);
        if (event.currentTarget.id === 'Add') {
            if (numReservableItems < 10) {
                setNumReservableItems(parseInt(numReservableItems) + 1);
            }
        } else if (event.currentTarget.id === "Remove") {
            if (numReservableItems > 1) {
                setNumReservableItems(numReservableItems - 1);
            }
        }
    }

    function insertValues() {
        let ReservedItems = "";
        let maxPeople = 0;
        let prices = "";
        getNotes(props.businessName);
        Axios.post("http://" + getIP() + ":3001/api/getFacilitysData", {
            businessName: businessName
        }).then((result) => {
            if (result.data.err) {
                alert("Facility data missing!");
            } else {
                // UPDATE NUM OF RESERVABLES
                if (!result.data.result[0].numReservable) {
                    setNumReservableItems(1);
                } else {
                    setNumReservableItems(parseInt(result.data.result[0].numReservable));
    
                    // UPDATE NAMES
                    ReservedItems = String(result.data.result[0].reservableItem).split(";");
                    setNameArray(ReservedItems);
    
                    // UPDATE PRICES
                    prices = String(result.data.result[0].prices).split(";");
                    setPriceArray(prices);
                }
            }
        })
    }
    
    function disableSave() {
        const startHour = new Date(startTime).getHours();
        const startMinute = new Date(startTime).getMinutes();
        const endHour = new Date(endTime).getHours();
        const endMinute = new Date(endTime).getMinutes();
        if (startHour > endHour || (endHour === startHour && endMinute <= startMinute) || currentDate === null || endTime === null) {
            return true;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (startTime === null || endTime === null) {
            alert("Enter time constraints");
            return;
        }
        const data = new FormData(event.currentTarget);
        let ReservedItems = "";
        for (let element = 1; element <= numReservableItems; element++) {
            if (ReservedItems === "") {
                ReservedItems = ReservedItems.concat(data.get("Reserved" + element));
            } else {
                ReservedItems = ReservedItems.concat(";", data.get("Reserved" + element));
            }
        }
        let prices = "";
        for (let element = 0; element < numReservableItems; element++) {
            if (prices === "") {
                prices = prices.concat(priceArray[element]);
            } else {
                prices = prices.concat(";", priceArray[element]);
            }
        }
        let maximums = "";
        for (let element = 1; element <= numReservableItems; element++) {
            if (maximums === "") {
                maximums = maximums.concat(data.get("Max" + element));
            } else {
                maximums = maximums.concat(";", data.get("Max" + element));
            }
        }
        let numReserved = "";
        for (let element = 0; element < numReservableItems; element++) {
            if (numReserved === "") {
                numReserved = numReserved.concat(numArray[element]);
            } else {
                numReserved = numReserved.concat(";", numArray[element]);
            }
        }
        alert("Event created! Waiting on customers to accept.");
        Axios.post("http://" + getIP() + ":3001/api/managerCreateEvent", {
            businessName: data.get('business'),
            reservationDate: currentDate,
            reservable: ReservedItems,
            numReserved: numReserved,
            startTime: startTime,
            endTime: endTime,
            price: prices,
            numPeople: numPeople
        })
        navigate("/facilityReservations", {
            state: {
                username: props.username,
                password: props.password,
                businessName: props.businessName
            }
        });
        console.log({
            username: props.username,
            password: props.password,
            businessName: currentDate
        });
    }
    return (
        <React.Fragment>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <EventIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {props.businessName} Event Creation
                </Typography>
                <Typography style={{color:"#98622E"}} component="h5" variant="h8">
                    * Prices are assigned per unit of reservable item.
                </Typography>
                <Box component="form" validate="true" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="business"
                                fullWidth
                                id="business"
                                label="Business"
                                defaultValue={props.businessName}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    id="reservationDate"
                                    label="Select Date"
                                    value={currentDate}
                                    InputProps={{ onKeyDown: (event) => { event.preventDefault();} } }
                                    onChange={(newValue) => { setCurrentDate(newValue) }}
                                    renderInput={(params) => <TextField {...params} />}
                                    shouldDisableDate={(date) => {
                                        if (date < new Date()) {
                                            return true;
                                        }
                                        return false;
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Start Time"
                                    InputProps={{ onKeyDown: (event) => { event.preventDefault();} } }
                                    value={startTime}
                                    fullWidth
                                    onChange={(newValue) => { setStartTime(newValue) }}
                                    renderInput={(params) => <TextField {...params} />}shouldDisableTime={(timeValue, clockType) => {
                                        if (clockType === 'minutes' && timeValue % 5) {
                                            return true;
                                        }
                                        return false;
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="End Time"
                                    value={endTime}
                                    InputProps={{ onKeyDown: (event) => { event.preventDefault();} } }
                                    fullWidth
                                    onChange={(newValue) => { setEndTime(newValue) }}
                                    renderInput={(params) => <TextField {...params} />}
                                    shouldDisableTime={(timeValue, clockType) => {
                                    if ((clockType === 'hours' && timeValue < (new Date(startTime).getHours()))
                                        || ((new Date(startTime).getHours()) === (new Date(endTime).getHours()) && 
                                            clockType === 'minutes' && timeValue <= (new Date(startTime).getMinutes()) )) {
                                            return true;
                                        }
                                        if (clockType === 'minutes' && timeValue % 5) {
                                            return true;
                                        }
                                        return false;
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    name="numPeople"
                                    label="Max Party Size"
                                    type="number"
                                    id="numPeople"
                                    InputProps={{ inputProps: { min: 1, step: 1 } }}
                                    value={numPeople}
                                    onChange={(newValue) => { 
                                        setNumPeople(parseInt(newValue.target.value));
                                    }}
                                />
                            </Grid>
                        {/* And here I render the box array */}
                            {/* There is going to be a max of 10 items */}
                            {makeBox()}
                            <Grid item xs={12} sm={6}>
                                {box[0]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[1]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[2]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[3]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[4]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[5]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[6]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[7]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[8]}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {box[9]}
                            </Grid>
                    </Grid>
                    <Grid container={2}>
                    <Grid item sm={1}></Grid>
                    <Grid item sm={4}>
                    <Button
                        onClick={add_rem}
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        id="Add"
                    >
                        Add Reservable Item
                    </Button></Grid><Grid item sm={2}></Grid><Grid item sm={4}>
                    <Button
                        onClick={add_rem}
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        id="Remove"
                    >
                        Remove Reservable Item
                    </Button></Grid></Grid>
                    <Grid>{makeDetails()} {paymentDetails[0]}</Grid>
                    <Button
                        onClick={UpdatePayment}
                        // fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add/Remove Payment Requirements
                    </Button>

                    <Title>Notes and Policies</Title>
                    <Typography style={{color:"#98622E"}} component="h5" variant="h8">
                    * All the notes and policies added will also be included in confirmation email sent to the customer.
                    </Typography>
                    <Typography style={{color:"#98622E"}} component="h5" variant="h8">
                    * Customers must agree to these policies to make a reservation at your facility.
                    </Typography>
                <Table size="small">
                    {/* <TableHead>
                        <TableRow>
                            <TableCell size="small">Notes:</TableCell>
                        </TableRow>
                    </TableHead> */}
                    <TableBody>
                        {notes.map((note, index) => (
                            <TableRow>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{editPolicy[index] ? 
                                <TextField fullWidth value={note.note} onChange={(val) => {let temp = [...notes];
                                    temp[index].note = val.target.value;
                                    setNotes(temp)
                                    }}>
                                    </TextField>:<strong>{note.note}</strong>}
                                </TableCell>
                                <TableCell align="right"><Button onClick={() => editNote(index)}>{editPolicy[index] ? "Update":"Edit"}</Button></TableCell>
                                <TableCell align="right"><Button onClick={() => clearNote(note.ID)}>Clear</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <br></br>
                <br></br>
                <Divider> Add Additional Notes and Policies for the Customer </Divider>
                <Grid fullWidth>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Note/Policy"
                        name="Note"
                        value={note}
                        autoComplete="note"
                        onChange={(e) => setNote(e.target.value)}
                    />
                </Grid>
                <Button
                    onClick={addNote}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Add Notes/Policies
                </Button>
                    <Button
                        type="submit"
                        disabled={disableSave()?true:false}
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    );
}