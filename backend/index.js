
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'mysecretkey'; // 🔐 Use env in production

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(
  'mongodb+srv://guptadhananjay978:oV6VRcyRsPtP10Vs@mern-cluster.p6t7urt.mongodb.net/?retryWrites=true&w=majority&appName=MERN-cluster',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ Import User model
const User = require('./models/User');

// ✅ Mount auth routes
app.use('/api/auth', authRoutes);

// ✅ Middleware to verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Optional: attach decoded user info
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token.' });
  }
}

// ✅ GET all users (🔐 protected)
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ✅ POST - Add a new user (🔐 protected)
app.post('/api/users', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser = await User.create({ name, email });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// ✅ PUT - Update a user by ID (🔐 protected)
app.put('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ✅ DELETE - Remove a user by ID (🔐 protected)
app.delete('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
