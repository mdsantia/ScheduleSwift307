import Axios from 'axios';
import React, { Component, ReactDOM, useState } from 'react';
import {useLocation} from 'react-router-dom';
import Event from '../Event.js';
import Registration from '../Registration';
import { useNavigate } from "react-router-dom";
import Table from '../Table.js';
import FormInput from '../FormInput.js';


const ActiveEvents = () => {
    // const [organizers, setOrganizers] = useState('');
    // const [date, setDate] = useState('');
    // const [starttime, setStartTime] = useState('');
    // const [endtime, setEndTime] = useState('');
    // const [confID, setConfID] = useState('');
    // const [error, setError] = useState(null);

    const [entries, setEntries] = useState();
    const [startEntry, setStartEntry] = useState();
    const [numEntries, setNumEntries] = useState();

    const [tableData, setTableData] = useState([])
    const [formInputData, setformInputData] = useState(
        {
        facility:'[Host Facility]',
        date:'',
        starttime:'',
        endtime:'',
        confID:''
       }
    );
     
    const handleChange=(evnt)=>{  
        const newInput = (data)=>({...data, [evnt.target.name]:evnt.target.value})
       setformInputData(newInput)
    }

    const handleSubmit= (evnt) =>{
        if (evnt.currentTarget.id === "add") {
            alert("submit");
            evnt.preventDefault();
            const checkEmptyInput = !Object.values(formInputData).every(res=>res==="")
        if(checkEmptyInput)
        {
            const newData = (data)=>([...data, formInputData])
            setTableData(newData);
            const emptyInput= {facility:'[Host Facility]', date:'', starttime:'', endtime:'', confID: ''}
            setformInputData(emptyInput)
        }
    } else {
        view(evnt, evnt.currentTarget.id);
    }
    }

    const addRow = () => {
        const newData = (data)=>([...data, formInputData])
         setTableData(newData);
         const emptyInput= {date:'', startime:'', endtime:'', confID: ''}
         setformInputData(emptyInput)
    }

    const location = useLocation();

    const navigate = useNavigate();

    const main = () => {
        navigate("/");
    }

    const view = (evnt, data) => {
        evnt.preventDefault();
        alert(data);
        Axios.post("http://localhost:3001/api/eventSelect", {
            confID : data,
        }).then((result) => {
            if (result.data.message) {
                //nothing
            } else {
                navigate("/info", {
                    state: {
                        date : result.data.date,
                        email : result.data.email,
                        phone : result.data.phone,
                        starttime : result.data.starttime,
                        endtime : result.data.endtime,
                        organizers : result.data.organizers,
                        confID : data,
                    }
                });
            }
        })
    }

    return (
        <form class="reservation-info">
            <div class="form-header">
                <h1>Active Reservations</h1>
            </div>
            <div className="form-body">
            <React.Fragment>
                <div className="container">
                <div className="row">
                    <div className="col-sm-8">
                    <FormInput handleChange={handleChange} formInputData={formInputData} handleSubmit={handleSubmit}/>
                    <Table tableData={tableData} handleSubmit={handleSubmit}/>
                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>
                </div>
            </React.Fragment>
                <div className='d-grid'>
                    <div className='horizontal-group'>
                    </div>
                </div>
                <br></br>
                {/* Entry details Footer */}
                <div className='horizontal-group'>
                <button type="submit" className="btn" onClick={main}>Close</button>
                </div>
                <br></br>
            </div>
    </form>
    );
}

export default ActiveEvents;
/** Initial attempt to incorporate scroll bar */
// ReactDOM.render(<ReservationInfo/>, document.querySelector('#growth'));