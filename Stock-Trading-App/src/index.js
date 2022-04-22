import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './app/store'
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <Provider store={store}>
        <CookiesProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </CookiesProvider>
    </Provider>,
    document.getElementById('root')
);
