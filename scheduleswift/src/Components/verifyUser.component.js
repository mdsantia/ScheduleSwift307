import Axios from 'axios';
import React, { Component, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
const VerifyUser = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [verifyStatus, setVerifyStatus] = useState("");
    const [userType, setUserType] = useState('');
    const navigate = useNavigate();

    const verify = e => {
        e.preventDefault();
        Axios.post("http://localhost:3001/api/verify", {
            username: username,
            email: email,
            userType: userType,
        }).then((result) => {
            if (result.data.message) {
                setVerifyStatus(result.data.message);
            } else {
                navigate('/forgot', {
                    state: {
                        username: username,
                        email: email,
                        userType: userType
                    }
                });
            }
        })
    }
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3>Verify User</h3>
                    <div className="mb-3">
                        <label>Username</label>
                        <input
                            type="text"
                            className='form-control'
                            placeholder="Enter Username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className='form-control'
                            placeholder="Enter Email Address"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div class="form-check">
                        <input
                            type="radio"
                            class="form-check-input"
                            id="radio1"
                            name="optradio"
                            value="customer"
                            onChange={(e) => setUserType(e.target.value)} />I'm a Customer
                        <label class="form-check-label" for="radio1"></label>
                    </div>
                    <div class="form-check">
                        <input
                            type="radio"
                            class="form-check-input"
                            id="radio2" name="optradio"
                            value="employee"
                            onChange={(e) => setUserType(e.target.value)} />I'm an Employee
                        <label class="form-check-label" for="radio2"></label>
                    </div>
                    <div class="form-check">
                        <input
                            type="radio"
                            class="form-check-input"
                            id="radio3" name="optradio"
                            value="manager"
                            onChange={(e) => setUserType(e.target.value)} />I'm a Manager
                        <label class="form-check-label" for="radio3"></label>
                    </div>
                    <div className='wrong-pass'>
                        <p>{verifyStatus}</p>
                    </div>
                    <div className='d-grid'>
                        <button type='submit' className='btn btn-primary ' onClick={verify}>
                            Verify
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default VerifyUser;