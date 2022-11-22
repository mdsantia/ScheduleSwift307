import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import Title from './Title';
import { Button, TextField, Grid, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Icon, IconButton, Collapse, Typography, Tab } from '@mui/material';
import { ClassNames } from '@emotion/react';
export default function Orders(props) {

    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [noteSubject, setNoteSubject] = useState('');
    const [noteBody, setNoteBody] = useState('');

    const [shift, setShifts] = useState([]);
    const [inOut, setInOut] = useState('');

    function preventDefault(event) {
        event.preventDefault();
    }

    function getNotes(businessName) {
        Axios.post("http://localhost:3001/api/getBusinessNotes", {
            businessName: props.businessName
        }).then((result) => {
            const allNotes = result.data.result;
            console.log(allNotes);
            setNotes(allNotes);

        })
    }

    function getShifts(username) {
        Axios.post("http://localhost:3001/api/getShifts", {
            username: props.username
        }).then((result) => {
            const shifts = result.data.result;
            setShifts(shifts);
        })
    }

    function addShift() {

        if (inOut == "Clock In") {
            setInOut("Clock Out");
        } else {
            setInOut("Clock In");
        }


        let comp;

            Axios.post("http://localhost:3001/api/findOpenShift", {
                username: props.username
            }).then((result) => {
                const openShift = result.data.result;
                console.log(openShift);
                console.log(openShift.length)

                if (openShift.length == 0) {
                    comp = 'yes';
                } else {
                    comp = 'no';
                }
                if (comp == 'no') {
                    Axios.post("http://localhost:3001/api/closeShift", {
                        ID: openShift[0].ID,
                        oldTime: parseInt(openShift[0].time)
                    }).then((result) => {
                        getShifts(props.username);
                    })
                } else {
                    Axios.post("http://localhost:3001/api/createShifts", {
                    username: props.username
                }).then((result) => {
                    getShifts(props.username);
                })
                }

            })
            
    }

    useEffect(() => {
        getNotes(props.businessName);
        getShifts(props.username);
        setInOut("Clock In");
    }, []);
    if (notes.length > 0) {
        return (
            <React.Fragment>
                <Title>{props.businessName}'s Notes from Management</Title>
                <Box mb={10}>
                    <Table size="small" sx={{
                        "& th": {
                            color: "black",
                            fontWeight: "bold",
                            backgroundColor: "rgba(200, 199, 197, 0.8)",
                            borderStyle: "solid",
                            borderColor: "black",
                            borderRightStyle: "solid",
                            borgerRightColor: "black",
                            display: "tableRowGroup"
                        }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Subject
                                </TableCell>
                                <TableCell align="center">Details</TableCell>
                            </TableRow>
                        </TableHead>
                        {notes.map((note, index) => (
                            <TableBody>
                                <TableRow key={note.ID} >
                                    <TableCell align="left" style={{ borderRight: '0.1em solid black' }}>{note.noteSubject}</TableCell>
                                    <TableCell align="center">{note.noteBody}</TableCell>
                                </TableRow>
                            </TableBody>

                        ))}
                    </Table>
                </Box>

                <Title>Work Clock</Title>
                <Button onClick={(addShift)}>
                    {inOut}
                </Button>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Time Clocked In</TableCell>
                            <TableCell>Time Clocked Out</TableCell>
                            <TableCell>Total Time of Shift</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {shift.map((shift, index) => (
                            <TableRow>
                                <TableCell>{shift.date}</TableCell>
                                <TableCell>{shift.timeClockedIn}</TableCell>
                                <TableCell>{shift.timeClockedOut}</TableCell>
                                <TableCell>{shift.timeOfShift}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <Title>{props.businessName}'s Daily Notes</Title>
                <p>No notes at this time</p>
                <br></br>
                <br></br>
                <Title>Work Clock</Title>
                <br></br>
                <Button onClick={(addShift)}>
                    {inOut}
                </Button>

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Time Clocked In</TableCell>
                            <TableCell>Time Clocked Out</TableCell>
                            <TableCell>Total Time of Shift</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {shift.map((shift, index) => (
                            <TableRow>
                                <TableCell>{shift.date}</TableCell>
                                <TableCell>{shift.timeClockedIn}</TableCell>
                                <TableCell>{shift.timeClockedOut}</TableCell>
                                <TableCell>{shift.timeOfShift}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment>
        )
    }
}