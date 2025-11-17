import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import WeatherWidget from './weathermoodwidget';
import Hook_ControlledButtonState from './Counter';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div class="container">
    <Hook_ControlledButtonState/>
    <WeatherWidget pic='Sunny'/>
    <WeatherWidget pic='Rainy'/>
    <WeatherWidget pic='Cloudy'/>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
