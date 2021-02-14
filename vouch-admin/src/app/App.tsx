import React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from 'sha-el-design/lib/components/Theme/Theme';
import { LoginSignup } from './components/Login';
import { Dashboard } from './components/Dashboard/Dashboard';

function App() {
  return (
    <ThemeProvider theme="LIGHT">
      <Router>
        <LoginSignup path="/" />
        <Dashboard path="/dashboard/*" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
