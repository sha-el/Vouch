import React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from 'sha-el-design/lib/components/Theme/Theme';
import { LoginSignup } from './components/Login';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Logout } from './components/Login/Logout';

function App() {
  return (
    <ThemeProvider theme="LIGHT">
      <Router>
        <LoginSignup path="/" />
        <Dashboard path="/dashboard/*" />
        <Logout path="/logout" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
