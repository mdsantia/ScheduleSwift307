// import * as React from 'react';
// import Link from '@mui/material/Link';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Title from './Title';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useState, useEffect } from 'react';
// import Axios from 'axios';
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import axios from 'axios';
// import { InputLabel } from '@mui/material';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import { Calendar, dateFnsLocalizer } from "react-big-calendar"

// export default function Orders(props) {
//     const [usersData, setData] = useState('');
//     const [newUsername, setNewUsername] = useState('');
//     const [newEmail, setNewEmail] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const navigate = useNavigate();

//     const locales = {
//         "en-US": requestAnimationFrame("date-fns/locale/en-US")
//     }
    
//     const localizer =dateFnsLocalizer({
//         format,
//         parse,
//         startOfWeek,
//         getDay,
//         locales
//     })
    
//     const events = [
//         {
//             title: "Big Meeting",
//             allDay: true,
//             start: new Date(2021,6,0),
//             end : new Date(2021,6,0)
    
//         },
//         {
//             title: "Vacation",
//             start: new Date(2021,6,0),
//             end : new Date(2021,6,0)
    
//         },
//         {
//             title: "Conference",
//             start: new Date(2021,6,0),
//             end : new Date(2021,6,0)
    
//         },
    
//     ]

//     return (
//         <React.Fragment>
//             <div className="Cal">
//                 <Calendar localizer={localizer} 
//                 events={events} 
//                 startAccessor="start" 
//                 endAccessor="end" 
//                 style={{height: 500, margin: "50px"}} 
//                 />
//             </div>
//         </React.Fragment>
//     );
// }