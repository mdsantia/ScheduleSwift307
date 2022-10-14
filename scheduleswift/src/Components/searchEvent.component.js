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
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const events = () => {
        navigate('/active', {
            state : {
                username : "mdsan",
                entries : 0
            }
        });
    }

    const main = () => {
        navigate('/main');
    }

    const fillInfo = e => {
        e.preventDefault();
        Axios.post("http://localhost:3001/api/eventSelect", {
            confID : confID,
        }).then((result) => {
            if (result.data.message) {
                setError(`${confID} Is invalid!`)
            } else {
                navigate("/info", {
                    state: {
                        date : result.data.date,
                        email : result.data.email,
                        phone : result.data.phone,
                        starttime : result.data.starttime,
                        endtime : result.data.endtime,
                        organizers : result.data.organizers,
                        confID : confID,
                    }
                    });
            }
        })
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                {/* Search an event by their unique confirmation ID */}
                <form>
                    <h3> Search</h3>
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

                {/* Button to show all the events from the user */}
                <br></br>
                    <div className='d-grid'>
                        <button onClick={events}>
                            Show all my events
                        </button>
                    </div>

                {/* Button to return back to the main page */}
                <br></br>
                    <div className='d-grid'>
                        <button onClick={main}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Search;