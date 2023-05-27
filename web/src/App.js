import './App.css';
import logo from './logo.svg';
import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
// import AddIcon from '@mui/icons-material/Add';

function App() {
  const [value, setValue] = React.useState('option1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="App">
    <ToggleButton
      value="check"
      // selected={selected}
      onChange={() => {
        // setSelected(!selected);
      }}
    >
      {/* <AddIcon /> */}
    </ToggleButton>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
