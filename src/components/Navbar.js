import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/');
  };

  return (
    <nav style={{ padding: '10px', backgroundColor: '#eee', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '10px' }}>🏠 Home</Link>
      {isLoggedIn ? (
        <>
          <Link to="/dashboard" style={{ marginRight: '10px' }}>📋 Dashboard</Link>
          <button onClick={handleLogout}>🚪 Logout</button>
        </>
      ) : (
        <Link to="/auth">🔐 Login/Register</Link>
      )}
    </nav>
  );
}

export default Navbar;
