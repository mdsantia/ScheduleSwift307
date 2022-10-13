import Axios from 'axios';
import React, { Component, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
const Password = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const { state } = useLocation();

    const validationSchema = Yup.object().shape({
        yupPassword: Yup.string()
            .required("Password is Required.")
            .min(6, "Password must be at least 6 characters")
            .max(40, "Password must be less than 40 characters"),
        yupConfirmPassword: Yup.string()
            .required("Confirm Password is Required.")
            .oneOf([Yup.ref('yupPassword'), null], "Confirm Password does not match.")
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = data => {
        console.log(JSON.stringify(data, null, 2));
        Axios.post('http://localhost:3001/api/forgot', {
            username: state.username,
            email: state.email,
            newPassword: password,
        }).then((result) => {
            if (result.data.message) {
                setStatus(result.data.message);
            } else {
                navigate("/main");
            }
        })
        navigate("/main");
    }
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h3>Change Password</h3>
                    <div className="mb-3">
                        <label>New Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.yupPassword ? 'is-invalid' : ''}`}
                            placeholder="Enter New Password"
                            {...register('yupPassword')}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="invalid-feedback">{errors.yupPassword?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.yupConfirmPassword ? 'is-invalid' : ''}`}
                            placeholder="Confirm New Password"
                            {...register('yupConfirmPassword')}
                        />
                        <div className="invalid-feedback">{errors.yupConfirmPassword?.message}</div>
                    </div>
                    <div className='wrong-pass'>
                        <p></p>
                    </div>
                    <div className='d-grid'>
                        <button type='submit' className='btn btn-primary '>
                            Change
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Password;