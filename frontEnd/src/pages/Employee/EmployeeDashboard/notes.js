import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, notes) {
    return { id, notes };
}

const rows = [
    createData(
        0,
        "Hello",
    ),
    createData(
        1,
        'Testing',
    ),
    createData(2, 'Notes'),
    createData(
        3,
        'Notes',
    ),
    createData(
        4,
        'Notes',
    ),
];

function preventDefault(event) {
    event.preventDefault();
}

export default function Notes() {
    return (
        <React.Fragment>
            <Title>Today's Notes</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Manager Notes</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell align="center">{row.notes}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}