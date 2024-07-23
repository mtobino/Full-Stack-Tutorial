import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAmn7O0y7yVamKJ-8iI6lideLnIx6U1Mkc",
    authDomain: "my-react-blog-a2bbb.firebaseapp.com",
    projectId: "my-react-blog-a2bbb",
    storageBucket: "my-react-blog-a2bbb.appspot.com",
    messagingSenderId: "356486186070",
    appId: "1:356486186070:web:c9e5d20afe8f0c7a2667f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
