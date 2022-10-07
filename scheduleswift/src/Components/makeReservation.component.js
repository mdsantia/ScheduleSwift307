import React, { Component } from 'react';
export default class MakeReservation extends Component {
    render() {
        return (
            <form class="reservation-form">
                <div class="form-header">
                    <h1>Reservation Form</h1>
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
                                placeholder="Enter Your First Name"
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
                                className="form-input"
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
                                placeholder="(XXX) XXX-XXXX"
                                pattern="([0-9]{3})-[0-9]{2}-[0-9]"
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
                                    type="time"                                        className="form-input"
                                    id="endtime"
                                    required="required"
                                />                                    
                            </div>
                        </div>
                    </div>
                    
                    {/* Item Fields */}
                    <div className="horizontal-group">
                        <div className="form-group left">
                            <label for="item1" className="label-title">Item #1</label>
                            <input
                                type="text"
                                className="form-input"
                                id="item1"
                            />
                        </div>
                        <div className="form-group right">
                            <label for="item2" className="label-title">Item #2</label>
                            <input
                                type="text"
                                className="form-input"
                                id="item2"
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
                    <label className="label-title">Please select at least one way in which you would like to receive notifications and reminders about this reservation.</label>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="option1"
                            value="email"
                        />
                        <label className="form-check-label">Email</label>
                    </div>
                    <div className="form-check">
                    <input
                            type="checkbox"
                            className="form-check-input"
                            id="option2"
                            value="txtmessage"
                        />
                        <label className="form-check-label">Text Message</label>
                    </div>
                    <br></br>

                    {/* Make Reservation and Cancel Buttons */}
                    <div class="form-footer">
                        <center>
                            <button type="submit" className="btn">Make Reservation</button>
                            <div className="divider"/>
                            <button type="submit" className="btn">Cancel</button>
                        </center>
                    </div>
                </div>
        </form>
        ) 
    }
}