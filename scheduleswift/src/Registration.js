import React, { useState } from "react";
import './Registration.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./Components/login.component";
import SignUp from "./Components/signup.component";
import MainPage from "./Components/mainPage.component";
import VerifyUser from "./Components/verifyUser.component";
import Password from "./Components/forgotPassword.component";
import ReservationInfo from "./Components/ReservationInfo.component";
import CustomerMain from "./Components/customerMain.component";
import EmployeeMain from "./Components/employeeMain";
import ManagerMain from "./Components/managerMain";
function Registration() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/sign-in" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/password" element={<VerifyUser />} />
                <Route path="/forgot" element={<Password />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/customer" element={<CustomerMain />} />
                <Route path="/employee" element={<EmployeeMain />} />
                <Route path="/manager" element={<ManagerMain />} />
                <Route path="/reservations" element={<ReservationInfo />} />

            </Routes>
        </Router>
    )
}

export default Registration;