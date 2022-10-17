import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';



function preventDefault(event) {
    event.preventDefault();
}

export default function Orders() {
    return (
        <React.Fragment>
            <Title>Current Active Reservations</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Business Name</TableCell>
                        <TableCell>Reserved Item</TableCell>
                        <TableCell>Reserved</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                </TableBody>
            </Table>
            <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
                See more orders
            </Link>
        </React.Fragment>
    );
}