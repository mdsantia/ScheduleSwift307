import Axios from 'axios';
import React, { Component, useState } from 'react';
import { set } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
const Search = () => {
    const [organizers, setOrganizers] = useState('');
    const [date, setDate] = useState('');
    const [starttime, setStartTime] = useState('');
    const [endtime, setEndTime] = useState('');
    const [confID, setConfID] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const send = () => {
        navigate("/info");
    }

    const fillInfo = e => {
        e.preventDefault();
        Axios.post("http://localhost:3001/api/eventSelect", {
            confID : confID,
        }).then((result) => {
            if (result.data.message) {
                setError(`${confID} is invalid!`)
            } else {
                setError("")
                setOrganizers({result});
                // setDate(result);
                // setStartTime(result);
                // setEndTime(result);
                // setOrganizers("mdsantia");
                setDate("10/10/22");
                setStartTime("1010");
                setEndTime("2100");
                navigate("/info", {
                state: {
                    date : date,
                    starttime : starttime,
                    endtime : endtime,
                    organizers : organizers,
                    confID : confID,
                }
                });
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
                        onChange={(e) => {setConfID(e.target.value)} }
                        />
                    </div>
                    <br></br>
                    <div className='d-grid'>
                        <button onClick={fillInfo}>
                            Submit
                        </button>
                    </div>
                    <div className="wrong-confid">{error}</div>
                </form>
                <h3>{organizers} {date} {starttime} {endtime}</h3> 
            </div>
        </div>
    )
}

export default Search;