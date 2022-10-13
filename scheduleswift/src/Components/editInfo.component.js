import React, { Component } from 'react';
export default class EditInfo extends Component {
    render() {
        return (
            <div>
                <body>
                    <div className="container">
                        <div className="title">Edit Information</div>
                        <form>
                            <div className="user-details">
                                <div className="input-box">
                                    <span className="details">First Name</span>
                                    <input type="text" placeholder="Change First Name"/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Last Name</span>
                                    <input type="text" placeholder="Change Last Name"/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Username</span>
                                    <input type="text" placeholder="Change Username"/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Password</span>
                                    <input type="text" placeholder="Change Password"/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Email</span>
                                    <input type="text" placeholder="Change Email"/>
                                </div>
                                <div className="input-box">
                                    <span className="details">Phone Number</span>
                                    <input type="text" placeholder="Change Phone Number"/>
                                </div>
                                <div className="button">
                                    <input type="submit" value="Change Information"/>
                                </div>
                            </div>
                            <p className="go-back">
                                <a href='/viewInfo'>Cancel Changes</a>
                            </p>
                        </form>
                    </div>
                </body>
            </div>
        )
    }
}