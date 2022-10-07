import Axios from 'axios';
import React, { Component, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    const navigate = useNavigate();
    const login = e => {
        e.preventDefault();
        Axios.post("http://localhost:3001/api/login", {
            username: username,
            password: password,
        }).then((result) => {
            if (result.data.message) {
                setLoginStatus(result.data.message);
            } else {
                navigate("/main");
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
                    <div className='d-grid'>
                        <button type='submit' className='btn btn-primary' onClick={login}>
                            Submit
                        </button>
                    </div>
                    <p className='forgot-password text-right'>
                        Need to <a href="/sign-up">create account?</a> | Forgot <a href="#">password?</a>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;