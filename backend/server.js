// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('./config/passportConfig');
const session = require('express-session');



// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Route Handlers
app.use('/api/auth', require('./routes/authRoutes'));               // Authentication routes
app.use('/api/appointments', require('./routes/appointmentRoutes')); // Appointment management routes
app.use('/api/admin', require('./routes/adminRoutes'));             // Admin management routes
app.use('/api/search', require('./routes/searchRoutes'));           // Search functionality routes
// Handle 404 errors (route not found)
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack); // Log the error stack
    res.status(500).json({ message: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✨Server running on http://localhost:${PORT}`));
