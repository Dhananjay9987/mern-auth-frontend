import React, { useState, useEffect } from 'react';
import AddUserForm from '../components/AddUserForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: '', email: '' });

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setEditedUser({ name: user.name, email: user.email });
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, editedUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>📋 Dashboard</h2>
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>🚪 Logout</button>
      <AddUserForm onUserAdded={fetchUsers} />

      <ul>
        {users.map(user => (
          <li key={user._id}>
            {editUserId === user._id ? (
              <>
                <input
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                />
                <input
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                />
                <button onClick={() => handleUpdate(user._id)}>💾 Save</button>
                <button onClick={() => setEditUserId(null)}>❌ Cancel</button>
              </>
            ) : (
              <>
                {user.name} — {user.email}
                <button onClick={() => handleEdit(user)}>✏️</button>
                <button onClick={() => handleDelete(user._id)}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
