import * as React from 'react';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
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


function preventDefault(event) {
    event.preventDefault();
}

export default function Orders(props) {
    const box = [];
    const [numReservableItems, setNumReservableItems] = useState([]);
    const [nameArray, setNameArray] = useState([]);
    const [minArray, setMinArray] = useState([]);
    const [maxArray, setMaxArray] = useState([]);
    const [priceArray, setPriceArray] = useState([]);
    const [numPeople, setNumPeople] = useState([]);
    const businessName = props.businessName;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const navigate = useNavigate();
    const formattedDate = `${year}-${month}-${day}`;
    const [currentDate, setCurrentDate] = useState(Dayjs | null);
    var paymentDetails = [];
    const [paymentStatus, setPaymentStatus] = useState("required");
    const [isPayment, setIsPayment] = useState(false);
    const [paymentNum, setPaymentNum] = useState(0);

    useEffect(() => {
        insertValues();
        setCurrentDate(formattedDate);
    }, [])

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

    function insertValues() {
        Axios.post("http://localhost:3001/api/getFacilitysData", {
            businessName: props.businessName
        }).then((result) => {
            if (result.data.err) {
                alert("Facility data missing!");
            } else {
                // UPDATE NUM OF RESERVABLES
                if (!result.data.result[0].numReservable) {
                    setNumReservableItems(1);
                } else {
                    setNumReservableItems(parseInt(result.data.result[0].numReservable));

                    // UPDATE NUM OF RESERVABLES
                    setNumPeople(result.data.result[0].numPeople);

                    // UPDATE NAMES
                    let ReservedItems = String(result.data.result[0].reservableItem).split(";");
                    setNameArray(ReservedItems);
                    
                    // UPDATE PRICES
                    let prices = String(result.data.result[0].prices).split(";");
                    setPriceArray(prices);

                    // UPDATE MAXIMUMS
                    let maxs = String(result.data.result[0].maxs).split(";");
                    setMaxArray(maxs);

                    // UPDATE MINIMUMS
                    let mins = String(result.data.result[0].mins).split(";");
                    setMinArray(mins);
                }
            }
        })
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
                    <Grid  item xs={12} sm={3}>
                    <TextField
                        required
                        fullWidth
                        name={'Min' + element}
                        label={'Min ' + element}
                        InputProps={{ inputProps: { min: 0, step: 1 } }}
                        type="number"
                        id={element}
                        value={minArray[element - 1]}
                        onChange={(newValue) => { 
                            let newArr = [...minArray];
                            newArr[parseInt(newValue.target.id) - 1] = parseInt(newValue.target.value);
                            setMinArray(newArr);
                        }}
                    />
                    </Grid>
                    <Grid  item xs={12} sm={3}>
                    <TextField
                        required
                        fullWidth
                        name={"Max" + element}
                        label={"Max " + element}
                        InputProps={{ inputProps: { min: minArray[element - 1], step: 1 } }}
                        type="number"
                        id={element}
                        value={maxArray[element - 1]}
                        onChange={(newValue) => { 
                            let newArr = [...maxArray];
                            newArr[parseInt(newValue.target.id) - 1] = parseInt(newValue.target.value);
                            setMaxArray(newArr);
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
            if (numReservableItems <= 10) {
                setNumReservableItems(numReservableItems + 1);
            }
        } else if (event.currentTarget.id === "Remove") {
            if (numReservableItems > 1) {
                setNumReservableItems(numReservableItems - 1);
            }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
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
        for (let element = 1; element <= numReservableItems; element++) {
            if (prices === "") {
                prices = prices.concat(data.get("Price" + element));
            } else {
                prices = prices.concat(";", data.get("Price" + element));
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
        let minimums = "";
        for (let element = 1; element <= numReservableItems; element++) {
            if (minimums === "") {
                minimums = minimums.concat(data.get("Min" + element));
            } else {
                minimums = minimums.concat(";", data.get("Min" + element));
            }
        }
        Axios.post("http://localhost:3001/api/updateMinMax", {
            businessName: data.get('business'),
            reservableItems: ReservedItems,
            prices: prices,
            maxs: maximums,
            mins: minimums,
            numPeople: data.get("numPeople"),
            numReservable: numReservableItems
        })
        alert("Your changes have been saved!");
        navigate("/FacilityForm", {
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
                    {props.businessName} Reservation Form Template
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
                                    // onChange={(newValue) => { setCurrentDate(newValue) }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Start Time"
                                    value={1000}
                                    fullWidth
                                    // onChange={(newValue) => { setStartTime(newValue) }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="End Time"
                                    value={3000}
                                    fullWidth
                                    // onChange={(newValue) => { setEndTime(newValue) }}
                                    renderInput={(params) => <TextField {...params} />}
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

                    <Button
                        type="submit"
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