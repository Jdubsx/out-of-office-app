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
    instance.logoutPopup();
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="login-container">
          <header className="app-header">
            <img src="/alltec-logo.png" alt="Alltec Logo" style={{ height: 48, marginRight: 16 }} />
            <span className="app-title">Alltec Out of Office Manager</span>
          </header>
          <p>Please sign in to manage your out-of-office status</p>
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
        <img src="/alltec-logo.png" alt="Alltec Logo" style={{ height: 48, marginRight: 16 }} />
        <span className="app-title">Alltec Out of Office Manager</span>
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