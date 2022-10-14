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
        <div class="mb-3 bg-body text-dark">

            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <a class="navbar-brand" href="#">Schedule Swift</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Reservations</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Calendar</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">About Us</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Account Information</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <body>
                <h1>ScheduleSwift Main Page Skeleton</h1>
                <form className="reservation-form" id="makeform">
                    <h1> Hello World </h1>
                    <button onClick={make}>Make Reservation</button>
                </form>
            </body>
        </div >

    )
}

export default MainPage;