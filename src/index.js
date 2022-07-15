import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import './config/firebaseconfig';


import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  //note: because react-beautiful-dnd is no longer actively supported, there is a known issue where functionality suffers in "strict mode"
  //the two recommended fixes are to either downgrade react to a version before v18, or to remove strict mode here
  //for now i have opted to remove strict mode, as keeping the most recent version of react seems ideal, and strict mode can be toggled as needed for testing of other features
  
    <App />
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
