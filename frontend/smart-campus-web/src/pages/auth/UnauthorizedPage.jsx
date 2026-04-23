import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#01071a',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '10px' }}>403</h1>
      <h2 style={{ marginBottom: '20px' }}>Access Denied</h2>
      <p style={{ maxWidth: '500px', marginBottom: '30px', color: '#9ca3af' }}>
        You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <Link 
        to="/" 
        style={{
          background: '#3b82f6',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: '600'
        }}
      >
        Go to Home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
