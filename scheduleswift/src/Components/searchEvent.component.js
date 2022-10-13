import Axios from 'axios';
import React, { Component, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
const Search = () => {
    const [organizers, setOrganizers] = useState('');
    const [date, setDate] = useState('');
    const [starttime, setStartTime] = useState('');
    const [endtime, setEndTime] = useState('');
    const [confID, setConfID] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    let inputHandler = (e) => {
        setConfID(e.target.value);
      };

    const send = () => {
        navigate("/info");
    }

    const fillInfo = e => {
        e.preventDefault();
        Axios.post("http://localhost:3001/api/eventSelect", {
            confID : confID
        }).then((result) => {
            if (result.data.message) {
                setDate(result.data.date);
                setOrganizers(result.data.organizers);
                setStartTime(result.data.starttime);
                setEndTime(result.data.endtime);
            } else {
                navigate("/info");
            }
        })
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3> Search</h3>
                    <div>
                    <button onClick={send}>info</button>
                    </div>
                    <div className="search">
                        <input
                        type="text"
                        className='form-control'
                        placeholder='Enter Confirmation ID for your event'
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Search;