import React from "react";
import './ReservationForm.css';
import './ReservationInfo.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MakeReservation from "./Components/makeReservation.component";
import ReservationInfo from "./Components/ReservationInfo.component";
import MainPage from "./Components/mainPage.component";

function ReservationForm() {
    return (
        <Router>
            <div className="Reservation Form">
                    <Routes>
                            <Route exact path="/" element={<MakeReservation />} />
                            <Route exact path="/info" element={<ReservationInfo />} />
                            <Route exact path="/main-page" element={<MainPage />} />
                    </Routes>
            </div>
        </Router>
    )
}

export default ReservationForm;




