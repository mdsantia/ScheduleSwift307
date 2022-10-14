import React from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
    let navigate = useNavigate();

    const make = () => {
        navigate('/form', { 
            state: {
                firstName: 'Jenny',
                lastName: 'Ha',
                emailAddress: 'jpha@purdue.edu',
                phoneNumber: '5743547966',
                date: '2020-10-12',
                startTime: '01:00',
                endTime: '01:45',
                numItem1: 2,
                numItem2: 3,
                additionalInfo: 'this is additional info',
                communicationMethod: 'Email'
            }
        });
    }

    return (
        <form className="reservation-form" id="makeform">
            <h1> Hello World </h1>
            <button onClick={make}>Make Reservation</button>
        </form>
    )
}

export default MainPage;