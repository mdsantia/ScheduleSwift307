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
import { Calendar, momentLocalizer, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import moment from 'moment';

export default function Orders(props) {
    var [allEvents, setAllEvents] = useState([]);
    const locales = {
        'en-US': enUS,
    }
    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    })

    function getEvents(business) {
        Axios.post("http://localhost:3001/api/getBusinessReservations", {
            businessName: props.businessName
        }).then((result) => {
            var events = new Array();
            for (let i = 0; i < result.data.result.length; i++) {
                var event = {
                    title: "Reservation #" + result.data.result[i].ID,
                    start: new Date(result.data.result[i].startTime),
                    end: new Date(result.data.result[i].endTime)
                }
            }
            events.push(event);
            allEvents = events;
            setAllEvents(events);
        })
    }
    console.log(allEvents);

    useEffect(() => {
        getEvents(props.businessName)
    }, []);
        
    return (
        <React.Fragment>
            <Title>Calendar View of {props.businessName}'s Reservations</Title>
            <Calendar
                style={{ height: 625 }}
                localizer={localizer}
                events={allEvents}
                eventPropGetter={event => ({ 
                    style: {
                        backgroundColor: '#694a2e'
                    }
                })}
            />
        </React.Fragment>
    );
}