import React, { useState, useEffect } from "react";
import './App.css';
import Axios from "axios";
import Registration from './Registration';
import ReservationForm from './ReservationForm';
import ReservationInfo from './ReservationInfo';

function App() {
  return (
    <ReservationForm />
  );
}

export default App;
