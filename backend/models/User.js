const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    password: {
        type: String,
        required: function () {
          return this.provider === "local"; // Only require password for local (email/password) users
        },
      },
      provider: {
        type: String, // Can be 'local', 'google', 'github'
        default: "local",
      },
      googleId: {
        type: String, // For storing Google user IDs
        default: null,
      },
      githubId: {
        type: String, // For storing GitHub user IDs
        default: null,
      },
    otp: {
        type: String,
    },
    role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);
