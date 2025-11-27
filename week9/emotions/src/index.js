import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import FacebookEmojiCounter from './Facebookemoji'
import ToggleMode from './ToggleModeComponent' 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <React.Fragment>
 <FacebookEmojiCounter type= "Like"/>
 < FacebookEmojiCounter type= "Love"/>
 < FacebookEmojiCounter type= "happy"/>
 < ToggleMode/>
 </React.Fragment>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
