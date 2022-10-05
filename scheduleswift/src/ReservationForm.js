import React from "react";
import './ReservationForm.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MakeReservation from "./Components/makeReservation.component";
function ReservationForm() {
    return (
        <Router>
            <div className="Reservation Form">
                <div className="auth-wrapper">
                    <div className="auth-inner">
                    <Routes>
                            <Route exact path="/" element={<MakeReservation />} />
                    </Routes>
                    </div>
                </div>
            </div>
        </Router>
    )
}

export default ReservationForm;




