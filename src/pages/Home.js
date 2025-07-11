import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';  // ✅ FIXED
import { useNavigate } from 'react-router-dom';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleSuccess = () => {
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🚀 MERN Stack Auth App</h1>
      {!isLoggedIn ? (
        <AuthForm onAuthSuccess={handleSuccess} />
      ) : (
        <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      )}
    </div>
  );
}

export default Home;

