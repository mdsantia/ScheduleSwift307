import React, { useState, Component } from "react";
import Axios from 'axios';

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const submitSignup = () => {
        Axios.post('http://localhost:3001/api/insert', {
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            password: password
        }).then(() => {
            alert("Successful Insert");
        })
    }
    return (
        <form>
            <h3>Sign Up</h3>
            <div className="mb-3">
                <label>First name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    onChange={(e) => { setFirstName(e.target.value) }}
                />
            </div>
            <div className="mb-3">
                <label>Last name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    onChange={(e) => { setLastName(e.target.value) }}
                />
            </div>
            <div className="mb-3">
                <label>Email address</label>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={(e) => { setEmailAddress(e.target.value) }}
                />
            </div>
            <div className="mb-3">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={(e) => { setPassword(e.target.value) }}
                />
            </div>
            <div className="d-grid">
                <button type="submit" className="btn btn-primary" onClick={submitSignup}>
                    Sign Up
                </button>
            </div>
            <p className="forgot-password text-right">
                Already registered <a href="/sign-in">sign in?</a>
            </p>
        </form>
    )
}
export default SignUp;