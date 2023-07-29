import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Login from './Login';
import { ContextProvider } from './Context';

import './styles.css';

ReactDOM.render(
  <ContextProvider>
    <Login />
  </ContextProvider>,
  document.getElementById('root'),
);
