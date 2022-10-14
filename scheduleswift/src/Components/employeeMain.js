import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EmployeeMain = () => {
    const { state } = useLocation();
    return (
        <div>
            <h1> This is the Employee Main Page</h1>
            <h1>{state.username}</h1>
            <h1>{state.password}</h1>
            <h1>{state.userType}</h1>
        </div>
    )
}

export default EmployeeMain;