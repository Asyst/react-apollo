import React from 'react';
import { render } from 'react-dom';

import App from './App';

window.React = React;

render(
    <App />,
    document.getElementById('root')
);