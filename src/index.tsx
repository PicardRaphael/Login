import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Signup from './components/Signup';
import { SignupStoreProvider } from './contexts/signup-store';

ReactDOM.render(
  <SignupStoreProvider>
    <Router>
      <Signup />
    </Router>
  </SignupStoreProvider>,
  document.getElementById('root'));