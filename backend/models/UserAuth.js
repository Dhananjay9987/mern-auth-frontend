const mongoose = require('mongoose');

const UserAuthSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model('UserAuth', UserAuthSchema);
