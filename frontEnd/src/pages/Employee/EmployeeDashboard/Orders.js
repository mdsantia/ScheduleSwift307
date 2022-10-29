import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import Title from './Title';
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
    const [open, setOpen] = useState(false);
    function getNotes(businessName) {
        Axios.post("http://localhost:3001/api/getBusinessNotes", {
            businessName: props.businessName
        }).then((result) => {
            const allNotes = result.data.result;
            console.log(allNotes);
            setNotes(allNotes);

        })
    }
    useEffect(() => {
        getNotes(props.businessName);
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
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <Title>{props.businessName}'s Daily Notes</Title>
                <p>No notes at this time</p>
            </React.Fragment>
        )
    }
}