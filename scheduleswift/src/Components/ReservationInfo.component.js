import Axios from 'axios';
import React, { Component, ReactDOM, useState } from 'react';
import {useLocation} from 'react-router-dom';
import Event from '../Event.js';
import Registration from '../Registration';
import { useNavigate } from "react-router-dom";

const ReservationInfo = () => {
    // const [organizers, setOrganizers] = useState('');
    // const [date, setDate] = useState('');
    // const [starttime, setStartTime] = useState('');
    // const [endtime, setEndTime] = useState('');
    // const [confID, setConfID] = useState('');
    // const [error, setError] = useState(null);

    const location = useLocation();

    const navigate = useNavigate();

    const active = () => {
        navigate("/active");
    }

    const main = () => {
        navigate("/");
    }

    const edit = () => {
        console.log(location.state.date);
        console.log(location.state.starttime);
        navigate("/Form", {
            state: {
                confID: location.state.confID,
                firstName: location.state.organizers,
                lastName: location.state.organizers,
                emailAddress: location.state.email,
                phoneNumber: location.state.phone,
                date: location.state.date,
                startTime: location.state.startime,
                endTime: location.state.endtime,
                numItem1: location.state.numItem1,
                numItem2: location.state.numItem2,
                additionalInfo: location.state.additionalInfo,
                communicationMethod: location.state.communicationMethod
            }
        });
    }
    
    const cancelReservation = () => {
        Axios.post('http://localhost:3001/api/eventDelete', {
            confID: location.state.confID
        }).then(() => {
            alert("Successful Delete");
        })
        alert("You have successfully cancelled your reservation.");
        navigate("/main");
    };

    return (
        <form class="reservation-info">
            <div class="form-header">
                <h1>Reservation Information</h1>
            </div>
            {/* First Name and Last Name Fields */}
            <div className="form-body">
                <div className="horizontal-group">
                    <div className="form-group left">
                        <label for="Host" className="label-title">Host</label>
                        <div className="form-body">
                            <field-info for="Host" className="label">[Host/Facility name]</field-info>
                        </div>
                    </div>
                    <div className="form-group right">
                    <label for="Organizers" className="label-title">Organizers</label>
                        <div className="form-body">
                            <field-info for="Organizers" className="label">{location.state.organizers}</field-info>
                        </div>
                    </div>
                </div>

                {/* Email and Phone Number Fields */}
                <div className="horizontal-group">
                    <div className="form-group left">
                        <label for="email" className="label-title">Email</label>
                        <div className="form-body">
                            <field-info for="Email" className="label">{location.state.email}</field-info>
                        </div>
                    </div>
                    <div className="form-group right">
                        <label for="phone" className="label-title">Phone Number</label>
                        <div className="form-body">
                            <field-info for="Telephone" className="label">{location.state.phone}</field-info>
                        </div>
                    </div>
                </div>

                {/* Date and Time Fields */}
                <div className="horizontal-group">
                    <div className="form-group left">
                        <label for="date" className="label-title">Date</label>
                        <div className="form-body">
                            <field-info for="Date" className="label">{location.state.date}</field-info>
                        </div>
                    </div>
                    <div className="form-group right">
                        <label for="time" className="label-title">Time</label>
                        <div className="form-body">
                            <field-info for="Time" className="label">{location.state.starttime} - {location.state.endtime}</field-info>
                        </div>
                    </div>
                </div>

                {/* Confirmation Number Field */}
                <div className="horizontal-group">
                    <div className="form-group left">
                        <label for="confid" className="label-title">Confirmation Number</label>
                        <div className="form-body">
                            <field-info for="confid" className="label">[Confirmation ID [A-z0-9]*]: {location.state.confID}</field-info>
                        </div>
                    </div>
                    <div className="form-group right">
                        <label for="Payment" className="label-title">Payment Status</label>
                        <div className="form-body">
                            <field-info for="confid" className="label">[$Paid/$Owed]</field-info>
                        </div>
                    </div>
                </div>.

                {/* Item Fields */}
                <div className="horizontal-group">
                    <div className="form-group left">
                        <label for="item1" className="label-title">Item #1</label>
                        <div className="form-body">
                            <field-info for="item1" className="label">Selected/Quantity</field-info>
                        </div>
                    </div>
                    <div className="form-group right">
                        <label for="item2" className="label-title">Item #2</label>
                        <div className="form-body">
                            <field-info for="item2" className="label">Selected/Quantity</field-info>
                        </div>
                    </div>
                </div>

                <div className="horizontal-group">
                    <div className="form-group left">
                        <label for="item3" className="label-title">Item #3</label>
                        <div className="form-body">
                            <field-info for="item3" className="label">Selected/Quantity</field-info>
                        </div>
                    </div>
                    <div className="form-group right">
                        <label for="item4" className="label-title">Item #4</label>
                        <div className="form-body">
                            <field-info for="item4" className="label">Selected/Quantity</field-info>
                        </div>
                    </div>
                </div>
                <div className="horizontal-group">
                    <div className="form-group left">
                        <label for="item5" className="label-title">Item #5</label>
                        <div className="form-body">
                            <field-info for="item5" className="label">Selected/Quantity</field-info>
                        </div>
                    </div>
                    <div className="form-group right">
                        <label for="item6" className="label-title">Item #6</label>
                        <div className="form-body">
                            <field-info for="item6" className="label">Selected/Quantity</field-info>
                        </div>
                    </div>
                </div>

                {/* Additional Information Field */}
                <div className="form-group">
                    <label for="additionalinfo" className="label-title">Additional Information</label>
                    <div className="form-body">
                        <field-info for="addinfo" className="label">Please include any important additional information about your reservation here.</field-info>
                    </div>
                </div>

                {/* Reservation Notification Options */}
                <label className="label-title">Please select at least one way in which you would like to receive notifications and reminders about this reservation.</label>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="option1"
                        value="email"
                        // TODO change to be true if the box was selected
                        checked="true"
                    />
                    <label className="form-check-label">Email</label>
                </div>
                <div className="form-check">
                <input
                        type="checkbox"
                        className="form-check-input"
                        id="option2"
                        value="txtmessage"
                        // TODO change to be true if the box was selected
                        checked="true"
                    />
                    <label className="form-check-label">Text Message</label>
                </div>
                <br></br>

                {/* Submit and Cancel Buttons */}
                <div class="form-footer">
                    <center>
                        <button type="submit" className="btn" onClick={main}>Close</button>
                        <div className="divider"/>
                        <button type="submit" className="btn" onClick={edit}>Edit</button>
                    </center>
                </div>
            </div>
    </form>
    );
}

export default ReservationInfo;
/** Initial attempt to incorporate scroll bar */
// ReactDOM.render(<ReservationInfo/>, document.querySelector('#growth'));
