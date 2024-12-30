const express = require('express');
const {
    registerUser,
    loginUser,
    verifyOtpHandler,
    forgotPassword,
    resetPassword,
    handleOAuthCallback
} = require('../controllers/authController');
const router = express.Router();
const passport = require('passport');
const User = require("../models/User");

// Registration and Login Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtpHandler);
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

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    handleOAuthCallback
);

// LinkedIn OAuth
router.get('/linkedin', passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] }));
router.get(
    '/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/' }),
    handleOAuthCallback
);

module.exports = router;
