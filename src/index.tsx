import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

import UserProvider from "./providers/UserProvider";


ReactDOM.render(<UserProvider><App /></UserProvider>, document.getElementById('root'));