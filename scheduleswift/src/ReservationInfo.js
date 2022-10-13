import React from "react";
import './ReservationInfo.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReservationInfo from "./Components/ReservationInfo.component";
import Search from "./Components/searchEvent.component";
import EditInfo from "./Components/editInfo.component";

function Reservationinfo() {
    return (
        <Router>
            <div className="Reservation Info">
                    <Routes>
                            <Route exact path="/" element={<Search />} />
                            <Route exact path="/info" element={<ReservationInfo />} />
                            <Route exact path="/edit-info" element={<EditInfo />} />
                    </Routes>
            </div>
        </Router>
    );
}

export default Reservationinfo;




