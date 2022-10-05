import React, { Component } from 'react';
export default class MakeReservation extends Component {
    render() {
        <form>
            <h1>Reservation Form</h1>
            <div className="form-row">
                <div className="form-group col-md-7">
                    <label for="inputFirstName">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputFirstName"
                        placeholder="Enter Your First Name"
                    />
                </div>
                <div className="form-group col-md-7">
                    <label for="inputLastName">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputLastName"
                        placeholder="Enter Your Last Name"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-7">
                    <label form="inputEmailAddress">Email Address</label>
                    <input 
                        type="text"
                        className="form-control"
                        id="inputEmailAddress"
                        placeholder="email@example.com"
                    />
                </div>
                <div className="form-group col-md-7">
                    <label for="inputPhoneNumber">Phone Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputPhoneNumber"
                        placeholder="(XXX) XXX-XXXX"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-7">
                    <label for="inputMonth">Date</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputMonth"
                        placeholder="MM"
                    />
                </div>
                <div className="form-group col-md-7">
                    <label for="inputDay">/</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputDay"
                        placeholder="DD"
                    />
                </div>
                <div className="form-group col-md-7">
                    <label for="inputYear">/</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputYear"
                        placeholder="YYYY"
                    />    
                </div>
                <div className="form-group col-md-7">
                    <label for="inputStartTime">Time</label>
                    <input 
                        type="text"
                        className="form-control"
                        id="inputStartTime"
                        placeholder="X:XX"
                    />
                </div>
                <div className="form-group col-md-7">
                    <label for="inputEndTime">to</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputEndTime"
                        placeholder="X:XX"
                    />
                </div>
            </div>
            <div className="form-row">
                <label for="inputItem1">Item</label>
                <input
                    type="text"
                    className="form-control"
                    id="inputItem1"
                />
            </div>
            <div className="form-row">
                <label for="inputItem2">Item</label>
                <input
                    type="text"
                    className="form-control"
                    id="inputItem2"
                />
            </div>
            <div className="form-row">
                <label for="inputAdditionalInfo">Additional Information</label>
                <input
                    type="text"
                    className="form-control"
                    id="inputAdditionalInfo"
                    placeholder="If there is any other additional information we should know about your 
                    reservation, please feel free to write it here."
                />
            </div>
        </form>
    }
}