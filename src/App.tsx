import React, { useState } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest } from './authConfig';
import OutOfOfficeForm from './components/OutOfOfficeForm';
import './App.css';

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    instance.loginPopup(loginRequest)
      .then(response => {
        instance.setActiveAccount(response.account);
      })
      .catch(e => {
        console.error('Login failed:', e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    const account = instance.getActiveAccount();
    instance.logoutPopup({ account });
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <header className="app-header">
          <img src="/alltec-logo.png" alt="Alltec Logo" className="header-logo" />
          <span className="app-title centered-title">Out of Office Manager</span>
          <div className="header-spacer"></div>
        </header>
        <div className="login-content">
          <p>Please sign in to record your out-of-office time</p>
          <button 
            onClick={handleLogin} 
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <img src="/alltec-logo.png" alt="Alltec Logo" className="header-logo" />
        <span className="app-title centered-title">Out of Office Manager</span>
        <button onClick={handleLogout} className="logout-button">
          Sign Out
        </button>
      </header>
      <main className="app-main">
        <OutOfOfficeForm />
      </main>
    </div>
  );
}

export default App; 