const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Register User

const transporter = nodemailer.createTransport({
    host:process.env.HOST,
    service:process.env.SERVICE,
    post:Number(process.env.EMAIL_PORT),
    secure:Boolean(process.env.SECURE),
    auth: {
        user: process.env.USER, 
        pass: process.env.PASS 
    }
})

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, otp });
        await user.save();

        const mailOptions = {
            from: process.env.USER, 
            to: email,
            subject: "Thanks for Signing up in HealthCare...    Here is your OTP code",
            text: `Hey ${name} welcome to the HealthCare... , Your OTP for verification code is ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: "User Registered Successfully, An OTP has been sent" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOtpHandler = async (req, res) => {
    const { email, otp, username } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        console.log("User found:", user); // Add this log to check the user data

        if (user.otp === otp) {
            user.isVerified = true;
            user.otp = null; // Clear OTP
            const token = jwt.sign({
                email: user.email,
                isVerified: true,
                userId: user._id
            }, process.env.JWT_SECRET);

            user.token = token;
            await user.save();

            console.log("Token generated:", token); // Add this log to check token generation

            return res.status(200).json({ message: "OTP verified successfully", token });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (err) {
        console.error("Error during OTP verification:", err); // Log the error
        return res.status(500).json({ message: "Failed to verify user", error: err.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });
        res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};


// Handle Google and GitHub Login
exports.handleOAuthCallback = (req, res) => {
    const user = req.user; // User info comes from passport
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Redirect to frontend with the token
    res.redirect(`http://localhost:3000/doctor-selection?token=${token}`);
};

