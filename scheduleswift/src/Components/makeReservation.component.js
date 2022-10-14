import React, { Component, ReactDOM, useState } from 'react';
import { useNavigate } from "react-router-dom";

const MakeReservation = () => {
    // const [organizers, setOrganizers] = useState('');
    // const [date, setDate] = useState('');
    // const [starttime, setStartTime] = useState('');
    // const [endtime, setEndTime] = useState('');
    // const [confID, setConfID] = useState('');
    // const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    const main = () => {
        navigate("/main-page");
    }

    function checkInfo() {
        let allAreFilled = true;
        document.getElementById("reservation-form").querySelectorAll("[required]").forEach(function(i) {
            // if (!allAreFilled) {
            //     return;
            // }
        //     if (i.type === "email") {
        //         let emailValueCheck = false;
        //         document.getElementById("reservation-form").querySelectorAll(`[form-group-input=${i.email}]`).forEach(function(e) {
        //             if (e.checked) emailValueCheck = true;
        //         })
        //         allAreFilled = emailValueCheck;
        //         return;
        //     }
        //     if (i.type === "tel") {
        //         let phoneValueCheck = false;
        //         document.getElementById("reservation-form").querySelectorAll(`[form-group-input=${i.phone}]`).forEach(function(p) {
        //             if (p.checked) phoneValueCheck = true;
        //         })
        //         allAreFilled = phoneValueCheck;
        //         return;
        //     }
        //     if (i.type === "date") {
        //         let dateValueCheck = false;
        //         document.getElementById("reservation-form").querySelectorAll(`[form-group-input=${i.date}]`).forEach(function(d) {
        //             if (d.checked) dateValueCheck = true;
        //         })
        //         allAreFilled = dateValueCheck;
        //         return;
        //     }
        //     if (i.type === "time") {
        //         let timeValueCheck = false;
        //         document.getElementById("reservation-form").querySelectorAll(`[form-group-input=${i.time}]`).forEach(function(t) {
        //             if (t.checked) timeValueCheck = true;
        //         })
        //         allAreFilled = timeValueCheck;
        //         return;
        //     }
        //     if (i.type === "number") {
        //         let itemValueCheck = false;
        //         document.getElementById("reservation-form").querySelectorAll(`[form-group-input=${i.item}]`).forEach(function(n) {
        //             if (n.checked) itemValueCheck = true;
        //         })
        //         allAreFilled = itemValueCheck;
        //         return;
        //     }
        //     if (i.type === "radio") {
        //         let radioValueCheck = false;
        //         document.getElementById("reservationForm").querySelectorAll(`[input-group-input=${i.item}]`).forEach(function(r) {
        //             if (r.checked) radioValueCheck = true;
        //           })
        //           allAreFilled = radioValueCheck;
        //           return;
        //     }
        //     if (!i.value) { allAreFilled = false;  return; }
        })
        if (!allAreFilled) {
            alert('Fill all the fields');
        } else {
            navigate("/info");
        }
    }

    return (
        <form className="reservation-form">
            <div className="form-header">
                <h1>Reservation Form</h1>
                <h2>[Business Name]</h2>
                <h3>[Name of Reservation/Event]</h3>
            </div>
            {/* First Name and Last Name Fields */}
            <div className="form-body">
                <div className="horizontal-group">
                    <div className="form-group left">
                        <label for="firstname" className="label-title">First Name</label>
                        <input 
                            type="text"
                            className="form-input" 
                            id="firstname"
                            placeholder="Enter Your First Name" 
                            required="required"
                        />
                    </div>
                    <div className="form-group right">
                        <label for="lastname" className="label-title">Last Name</label>
                        <input
                            type="text"
                            className="form-input"
                            id="lastname"
                            placeholder="Enter Your Last Name"
                            requried="required"
                        />   
                    </div>
                </div>

                {/* Email and Phone Number Fields */}
                <div className="horizontal-group">
                    <div className="form-group left">
                        <label for="email" className="label-title">Email</label>
                        <input
                            type="email"
                            className="form-input-email"
                            id="email"
                            placeholder="email@example.com"
                            required="required"
                        />
                    </div>
                    <div className="form-group right">
                        <label for="phone" className="label-title">Phone Number</label>
                        <input
                            type="tel"
                            className="form-input"
                            id="phone"
                            placeholder="XXX-XXX-XXXX"
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            required="required"
                        />
                    </div>
                </div>

                {/* Date and Time Fields */}
                <div className="horizontal-group">
                    <div className="form-group left">
                        <label for="date" className="label-title">Date</label>
                        <input
                            type="date"
                            className="form-input"
                            id="date"
                            required="required"
                        />
                    </div>
                    <div className="form-group right">
                        <label for="time" className="label-title">Time</label>
                        <div className="two-column">
                            <input
                                type="time"
                                className="form-input"
                                id="time"
                                required="required"
                            />
                            <div className="divider"></div>
                            <label for="endtime" className="label-title">to</label>
                            <div className="divider"></div>
                            <input
                                type="time"                                        
                                className="form-input"
                                id="time"
                                required="required"
                            />                                    
                        </div>
                    </div>
                </div>
                
                {/* Item Fields */}
                <div className="horizontal-group">
                    <div className="form-group left">
                        <div className="two-column">
                            <label for="item1" className="label-title">Number Of Item #1:</label>
                            <div className="divider"></div>
                            <input
                                type="number"
                                className="form-input-item"
                                id="item"
                                min="0"
                                max="10"
                                required="required"
                            />
                        </div>
                    </div>
                    <div className="form-group right">
                        <label for="item2" className="label-title">Number Of Item #2:</label>
                        <div className="divider"></div>
                        <input
                            type="text"
                            className="form-input-item"
                            id="item"
                            min="0"
                            max="10"
                            required="required"
                        />
                    </div>
                </div>

                {/* Additional Information Field */}
                <div className="form-group">
                    <label for="additionalinfo" className="label-title">Additional Information</label>
                    <textarea
                        rows="4"
                        cols="50"
                        className="form-input"
                        id="additionalinfo"
                        placeholder="Please include any important additional information about your reservation here."
                    />
                </div>

                {/* Reservation Notification Options */}
                <label className="label-title">Please select your preferred method of communication for receiving notifications and reminders about this reservation.</label>
                <div className="input-group">
                    <input
                        type="radio"
                        className="input-group-input"
                        name="communication"
                        id="option1"
                        value="email"
                        required="required"
                    />
                    <label className="input-group-label">Email</label>
                </div>
                <div className="input-group">
                <input
                        type="radio"
                        className="input-group-input"
                        name="communication"
                        id="option2"
                        value="txtmessage"
                        required="required"
                    />
                    <label className="input-group-label">Text Message</label>
                </div>
                <br></br>

                {/* Make Reservation and Cancel Buttons */}
                <div class="form-footer">
                    <center>
                        <button id="reserveButton" type="submit" className="btn" onClick={checkInfo}>Make Reservation</button>
                        <div className="divider"/>
                        <button id="cancelButton" type="submit" className="btn" onClick={main}>Cancel</button>
                    </center>
                </div>
            </div>
    </form>
    ); 
}

export default MakeReservation;