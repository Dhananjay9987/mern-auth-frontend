import React, { useState } from 'react';
import axios from 'axios';

function AddUserForm({ onUserAdded }) {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ name: '', email: '' });
      onUserAdded();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add user');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button type="submit">➕ Add User</button>
    </form>
  );
}

export default AddUserForm;

