import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

firebase.initializeApp({
    apiKey: "AIzaSyBX98q1Jib8Xp4MpVjpdiIyc5t0G-xTsxA",
    authDomain: "ctrace-2ea71.firebaseapp.com",
    databaseURL: "https://ctrace-2ea71.firebaseio.com",
    projectId: "ctrace-2ea71",
    storageBucket: "ctrace-2ea71.appspot.com",
    messagingSenderId: "911215583610",
    appId: "1:911215583610:web:beee87aec4caf404f636c3",
    measurementId: "G-S3N25RBXBM"
});

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);

// TODO
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
