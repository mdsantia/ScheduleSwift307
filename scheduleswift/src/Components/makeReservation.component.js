import React, { Component } from 'react';
import { useNavigate } from "react-router-dom";

const MakeReservation = () => {
    const [confID, setConfID] = useState('');
    const [firstName, setFirstName] = useState(0);
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [numItem1, setNumItem1] = useState(0);
    const [numItem2, setNumItem2] = useState(0);
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [communicationMethod, setCommunicationMethod] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const email = document.getElementById("mail");

    email.addEventListener("input", (event) => {
    if (email.validity.typeMismatch) {
        email.setCustomValidity("I am expecting an e-mail address!");
        email.reportValidity();
    } else {
        email.setCustomValidity("");
    }
    });

    const info = () => {
        navigate("/info", {
            state : {
                date : 'result.data.date',
                    email : 'result.data.email',
                    phone : 'result.data.phone',
                    starttime : 'result.data.starttime',
                    endtime : 'result.data.endtime',
                    organizers : 'result.data.organizers',
                    confID : 'confID',
            }
        });
    }

    const main = () => {
        navigate("/main");
    }
    
    const onSubmit = () => {
        Axios.post('http://localhost:3001/api/eventInsert', {
            confID: '1234567890',
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
        }).then(() => {
            alert("Successful Insert");
        })
        navigate("/info");
    };

    return (
        <form className="reservation-form" id="makeform">
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
                            id="firstnameinput"
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
                            placeholder="XXXXXXXXXX"
                            pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
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
                                id="starttime"
                                required="required"
                            />
                            <div className="divider"></div>
                            <label for="endtime" className="label-title">to</label>
                            <div className="divider"></div>
                            <input
                                type="time" className="form-input"
                                id="endtime"
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
                                id="item1"
                                min="0"
                                max="10"
                            />
                        </div>
                    </div>
                    <div className="form-group right">
                        <label for="item2" className="label-title">Number Of Item #2:</label>
                        <div className="divider"></div>
                        <input
                            type="number"
                            className="form-input-item"
                            id="item2"
                            min="0"
                            max="10"
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
                        <button type="submit" className="btn" id="make" onClick={info}>Make Reservation</button>
                        <div className="divider"/>
                        <button type="submit" className="btn" onClick={main}>Cancel</button>
                    </center>
                </div>
            </div>
    </form>
    ) 
}

export default MakeReservation;
