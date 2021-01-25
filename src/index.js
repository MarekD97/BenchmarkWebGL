import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';

import HomePage from './pages/home';
import ThreePage from './pages/three';
import BabylonPage from './pages/babylon';
import ResultsPage from './pages/results';

ReactDOM.render(
    <Router>
      <Route exact path='/' component={HomePage} />
      <Route path='/three-js' component={ThreePage} />
      <Route path='/babylon-js' component={BabylonPage} />
      <Route path='/results' component={ResultsPage} />
    </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
