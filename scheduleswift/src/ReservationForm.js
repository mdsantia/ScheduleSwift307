import React from "react";
import './ReservationForm.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReservationInfo from "./Components/ReservationInfo.component";
import MakeReservation from "./Components/makeReservation.component";
import MainPage from "./Components/mainPage.component";
function ReservationForm() {
    return (
        <Router>
            <div className="Reservation Form">
                    <Routes>
                            <Route exact path="/" element={<MakeReservation />} />
                            <Route exact path="/main" element={<MainPage />} />
                            <Route exact path="/info" element={<ReservationInfo />} />
                    </Routes>
            </div>
        </Router>
    )
}

export default ReservationForm;




