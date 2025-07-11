const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(
  'mongodb+srv://guptadhananjay978:oV6VRcyRsPtP10Vs@mern-cluster.p6t7urt.mongodb.net/?retryWrites=true&w=majority&appName=MERN-cluster',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => {
  console.log('Connected to MongoDB');
  return User.insertMany([
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Bob Builder', email: 'bob@example.com' }
  ]);
}).then(() => {
  console.log('✅ Sample users inserted');
  mongoose.disconnect();
}).catch(err => {
  console.error('❌ Error inserting users:', err);
});
