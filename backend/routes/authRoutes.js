const express = require('express');
const { registerUser, loginUser, verifyOtpHandler,  forgotPassword, resetPassword, handleOAuthCallback} = require('../controllers/authController');
const router = express.Router();
const passport = require('passport');
const User = require("../models/User");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtpHandler)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    handleOAuthCallback
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    handleOAuthCallback
);

module.exports = router;
