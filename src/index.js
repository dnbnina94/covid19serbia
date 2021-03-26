import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import msieversion from './ie-detection';
import React from 'react';
import ReactDOM from 'react-dom';
import ErrorComponent from "./components/ErrorComponent";
import App from './components/App';
import { Provider } from 'react-redux';
import store from './redux/store';

import ie from './img/ie.png';
import {
   IE_TEXT_MAIN,
   IE_SUB_TEXT
} from "./consts";

const rootElement = document.getElementById('root');

const jsx = !msieversion() ? 
            <Provider store={store}>
               <App />
            </Provider> :
            <ErrorComponent img={ie} mainText={IE_TEXT_MAIN} subText={IE_SUB_TEXT} />

ReactDOM.render(
   jsx,
   rootElement
);

// ReactDOM.render(
//    <div>AAAA</div>,
//    rootElement
// );
