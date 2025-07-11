import React, { useState } from 'react';
import axios from 'axios';

function AddUserForm({ onUserAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users', { name, email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName('');
      setEmail('');
      onUserAdded(); // Refresh user list
    } catch (err) {
      console.error(err);
      alert('Failed to add user');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">➕ Add User</button>
    </form>
  );
}

export default AddUserForm;
