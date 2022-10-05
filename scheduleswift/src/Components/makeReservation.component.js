import React, { Component } from 'react';
export default class MakeReservation extends Component {
    render() {
        return (
            <form class="reservation-form">
                <div class="form-header">
                    <h1>Reservation Form</h1>
                </div>
                <div className="form-body">
                    <div className="horizontal-group">
                        <div className="form-group left">
                            <label for="firstname" className="label-title">First Name *</label>
                            <input 
                                type="text"
                                className="form-input" 
                                id="firstname"
                                placeholder="Enter Your First Name" 
                                required="required"
                            />
                        </div>
                        <div className="form-group right">
                            <label for="lastname" className="label-title">Last Name *</label>
                            <input
                                type="text"
                                className="form-input"
                                id="lastname"
                                placeholder="Enter Your First Name"
                                requried="required"
                            />   
                        </div>
                    </div>
                </div>


                {/* <label for="inputFullName" className="col-sm-2 col-form-label">Full Name:</label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        className="form-control"
                        id="inputFullName"
                        placeholder="Enter Your First and Last Name"
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
                <textarea
                    type="text"
                    className="form-control"
                    id="inputAdditionalInfo"
                    placeholder="If there is any other additional information we should know about your 
                    reservation, please feel free to write it here."
                />
            </div> */}
        </form>
        ) 
    }
}