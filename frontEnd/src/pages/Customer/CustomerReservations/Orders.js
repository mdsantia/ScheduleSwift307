import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { Button } from '@mui/material';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
    return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
    createData(
        0,
        '16 Mar, 2019',
        'Elvis Presley',
        'Tupelo, MS',
        'Yes',
        312.44,
    ),
    createData(
        1,
        '16 Mar, 2019',
        'Paul McCartney',
        'London, UK',
        'Yes',
        866.99,
    ),
    createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'Yes', 100.81),
    createData(
        3,
        '16 Mar, 2019',
        'Michael Jackson',
        'Gary, IN',
        'Yes',
        654.39,
    ),
    createData(
        4,
        '15 Mar, 2019',
        'Bruce Springsteen',
        'Long Branch, NJ',
        'Yes',
        212.79,
    ),
];

function preventDefault(event) {
    event.preventDefault();
}

export default function Orders(props) {
    return (
        <React.Fragment>
            <Title>Customer Reservations</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Business Name</TableCell>
                        <TableCell>Business Manager</TableCell>
                        <TableCell>Available</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.shipTo}</TableCell>
                            <TableCell>{row.paymentMethod}</TableCell>
                            <TableCell>{`$${row.amount}`}</TableCell>
                            <TableCell align="right"><Button>Reserve</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
                See more reservations
            </Link>
        </React.Fragment>
    );
}