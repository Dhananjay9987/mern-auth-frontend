import './LoginRegisterPage.css';
import React from 'react';
import AuthForm from '../components/AuthForm';

function LoginRegisterPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Login/Register Page</h1>
      <AuthForm />
    </div>
  );
}

export default LoginRegisterPage;
