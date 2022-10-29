import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { Button, Box, TextField, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Orders(props) {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [noteSubject, setNoteSubject] = useState('');
    const [noteBody, setNoteBody] = useState('');
    function getNotes(businessName) {
        Axios.post("http://localhost:3001/api/getBusinessNotes", {
            businessName: props.businessName
        }).then((result) => {
            const allNotes = result.data.result;
            console.log(allNotes);
            setNotes(allNotes);

        })
    }
    const addNotes = (event) => {
        event.preventDefault();
        Axios.post("http://localhost:3001/api/addBusinessNotes", {
            businessName: props.businessName,
            noteSubject: noteSubject,
            noteBody: noteBody
        }).then((result) => {
            if (result.data.err) {
                alert("Error! Something has gone wrong!")
            } else {
                setNoteBody('');
                setNoteSubject('');
                getNotes(props.businessName);
                navigate("/managerNotes", {
                    state: {
                        username: props.username,
                        password: props.password,
                        businessName: props.businessName
                    }
                })
            }
        })
    }

    function clearNote(noteID) {
        Axios.post("http://localhost:3001/api/managerDeleteNote", {
            noteID: noteID
        }).then((result) => {
            if (result.data.result.affectedRows === 0) {
            } else {
                getNotes(props.businessName);
            }
        })
    }
    useEffect(() => {
        getNotes(props.businessName);
    }, []);
    if (notes.length > 0) {
        return (
            <React.Fragment>
                <Title>{props.businessName}'s Daily Notes</Title>
                <Box mb={10}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Date</TableCell>
                                <TableCell align="left">Subject</TableCell>
                                <TableCell align="left">Note Information </TableCell>
                                <TableCell align="right">Clear Note</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notes.map((note, index) => (
                                <TableRow key={note.ID}>
                                    <TableCell>{note.date}</TableCell>
                                    <TableCell>{note.noteSubject}</TableCell>
                                    <TableCell align="left">{note.noteBody}</TableCell>
                                    <TableCell align="right"><Button onClick={() => clearNote(note.ID)}>Clear</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
                <Divider> Add an Additional Note </Divider>
                <Box component="form" onSubmit={addNotes} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        id="noteSubject"
                        label="Note Subject"
                        name="noteSubject"
                        value={noteSubject}
                        autoComplete="noteSubject"
                        onChange={(e) => setNoteSubject(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        name="noteBody"
                        label="Note Body"
                        type="noteBody"
                        id="noteBody"
                        value={noteBody}
                        autoComplete="noteBody"
                        InputProps={{
                            maxLength: 500,
                        }}
                        onChange={(e) => setNoteBody(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add Note
                    </Button>
                </Box>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <p>No current notes</p>
                <Divider> Add an Additional Note </Divider>

                <Box component="form" onSubmit={addNotes} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        id="noteSubject"
                        label="Note Subject"
                        name="noteSubject"
                        value={noteSubject}
                        autoComplete="noteSubject"
                        onChange={(e) => setNoteSubject(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        name="noteBody"
                        label="Note Body"
                        type="noteBody"
                        id="noteBody"
                        value={noteBody}
                        autoComplete="noteBody"
                        inputProps={
                            { maxLength: 80 }
                        }
                        onChange={(e) => setNoteBody(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add Note
                    </Button>
                </Box>
            </React.Fragment>
        )
    }
}