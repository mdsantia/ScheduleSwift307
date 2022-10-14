import React from "react";
import './ReservationInfo.css';
import './ReservationForm.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReservationInfo from "./Components/ReservationInfo.component";
import Form from "./Components/makeReservation.component";
import Search from "./Components/searchEvent.component";

function Reservationinfo() {
    return (
        <Router>
            <div className="Reservation Info">
                    <Routes>
                            <Route exact path="/" element={<Search />} />
                            <Route exact path="/form" element={<Search />} />
                            <Route exact path="/info" element={<ReservationInfo />} />
                    </Routes>
            </div>
        </Router>
    );
}

export default Reservationinfo;




