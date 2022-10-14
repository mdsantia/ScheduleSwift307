import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ManagerMain = () => {
    const { state } = useLocation();
    return (
        <div>
            <h1> This is the Manager Main Page</h1>
            <h1>{state.username}</h1>
            <h1>{state.password}</h1>
            <h1>{state.userType}</h1>
        </div>
    )
}

export default ManagerMain;