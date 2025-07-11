import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUserForm from './AddUserForm';
import AuthForm from './components/AuthForm';


function App() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: '', email: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
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
      alert('Failed to delete user');
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
      alert('Failed to update user');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>MERN Stack Auth App 🚀</h1>

      {!isLoggedIn ? (
        <AuthForm onAuthSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <>
          <button onClick={handleLogout} style={{ marginBottom: '20px' }}>🚪 Logout</button>

          <h2>👤 User List</h2>
          <AddUserForm onUserAdded={fetchUsers} />

          <ul>
            {users.map(user => (
              <li key={user._id}>
                {editUserId === user._id ? (
                  <>
                    <input
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      placeholder="Name"
                    />
                    <input
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      placeholder="Email"
                    />
                    <button onClick={() => handleUpdate(user._id)}>💾 Save</button>
                    <button onClick={() => setEditUserId(null)}>❌ Cancel</button>
                  </>
                ) : (
                  <>
                    {user.name} — {user.email}
                    <button onClick={() => handleEdit(user)} style={{ marginLeft: '10px' }}>✏️ Edit</button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      style={{ marginLeft: '10px', color: 'red' }}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;




