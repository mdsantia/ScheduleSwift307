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
import { useSlotProps } from '@mui/base';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EventIcon from '@mui/icons-material/Event';
import Logo from '../Logo.png';


function preventDefault(event) {
    event.preventDefault();
}

export default function Orders(props) {
    const box = [];
    const [numReservableItems, setNumReservableItems] = useState(3);
    const businessName = props.businessName;
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const navigate = useNavigate();
    const formattedDate = `${year}-${month}-${day}`;
    const [currentDate, setCurrentDate] = useState(Dayjs | null);
    useEffect(() => {
        setCurrentDate(formattedDate);
    }, [])

    function makeBox() {
        for (let element = 1; element <= numReservableItems; element++) {
            // Then the code pushes each time it loops to the empty array I initiated.
            box.push(
                <Grid container spacing={2}>
                    <Grid  item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        name={"Reserved" + element}
                        label={'Reservable Item ' + element}
                        type={element}
                        id={"Reserved" + element}
                    />
                    </Grid>
                    <Grid  item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        name={"Price" + element}
                        label={'Price Item ' + element}
                        type="number"
                        id={"Price" + element}
                        InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
                    />
                    </Grid>
                </Grid>
            );
            }
    }

    const add_rem = (event) => {
        event.preventDefault();
        if (event.currentTarget.id === 'Add') {
            if (numReservableItems <= 10) {
                setNumReservableItems(numReservableItems + 1);
            }
        } else if (event.currentTarget.id === "Remove") {
            if (numReservableItems >= 1) {
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
        Axios.post("http://localhost:3001/api/managerCreateReservation", {
            businessName: data.get('business'),
            reservationDate: currentDate,
            reservable: ReservedItems,
            price: prices
        })
        navigate("/managerMain", {
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
                    Create Reservation
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
                                    onChange={(newValue) => { setCurrentDate(newValue) }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            
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
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create Reservation
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    );
}