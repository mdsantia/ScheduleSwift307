import React, { Component } from 'react';
const Login = () => {
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3> Sign In</h3>
                    <div className='mb-3'>
                        <label>Email Address</label>
                        <input
                            type="email"
                            className='form-control'
                            placeholder='Enter Email Address'
                        />
                    </div>
                    <div className='mb-3'>
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder='Enter Password'
                        />
                    </div>
                    <div className='d-grid'>
                        <button type='submit' className='btn btn-primary'>
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