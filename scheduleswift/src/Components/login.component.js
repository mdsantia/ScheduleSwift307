import Axios from 'axios';
import React, { Component, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    const [userType, setUserType] = useState("");
    const navigate = useNavigate();
    const login = e => {
        e.preventDefault();
        Axios.post("http://localhost:3001/api/login", {
            username: username,
            password: password,
            userType: userType,
        }).then((result) => {
            if (result.data.message) {
                setLoginStatus(result.data.message);
            } else {
                if (userType == "customer") {
                    navigate("/customer", {
                        state: {
                            username: username,
                            password: password,
                            userType: userType
                        }
                    })
                }
                if (userType == "employee") {
                    navigate("/employee", {
                        state: {
                            username: username,
                            password: password,
                            userType: userType
                        }
                    })
                }
                if (userType == "manager") {
                    navigate("/manager", {
                        state: {
                            username: username,
                            password: password,
                            userType: userType
                        }
                    });
                }
            }
        })
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3> Sign In</h3>
                    <div className='mb-3'>
                        <label>Username</label>
                        <input
                            type="text"
                            className='form-control'
                            placeholder='Enter Username'
                            onChange={(e) => { setUsername(e.target.value) }}
                        />
                    </div>
                    <div className='mb-3'>
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder='Enter Password'
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                    </div>
                    <div className='wrong-pass'>
                        <p>{loginStatus}</p>
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
                            id="radio3"
                            name="optradio"
                            value="manager"
                            onChange={(e) => setUserType(e.target.value)} />I'm a Manager
                        <label class="form-check-label" for="radio3"></label>
                    </div>
                    <div className='d-grid'>
                        <button type='submit' className='btn btn-primary' onClick={login}>
                            Login
                        </button>
                    </div>
                    <p className='forgot-password text-right'>
                        Need to <a href="/sign-up">create account?</a> | Forgot <a href="/password">password?</a>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;