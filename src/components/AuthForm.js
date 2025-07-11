import React, { useState } from 'react';
import axios from 'axios';

function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, formData);
      alert(`${isLogin ? 'Login' : 'Registration'} successful`);

      // ✅ Store JWT token
      localStorage.setItem('token', res.data.token);
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>{isLogin ? '🔐 Login' : '📝 Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '10px' }}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
}

export default AuthForm;
