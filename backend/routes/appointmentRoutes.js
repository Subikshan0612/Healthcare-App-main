// routes/appointments.js

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment'); // Ensure this path correctly points to your Appointment model

// Book an appointment
router.post('/book', async (req, res) => {
    const { doctorName, userName, date, time, userEmail, specialty, location } = req.body;

    // Create a new appointment instance with provided details
    const newAppointment = new Appointment({
        doctorName,    // Store doctor's name
        userName,      // Store user's name
        date,          // Appointment date
        time,          // Appointment time
        userEmail,     // User's email
        specialty,     // Doctor's specialty
        location,      // Doctor's location
    });

    try {
        // Save the appointment to the database
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully!' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Failed to book appointment.' });
    }
});

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Failed to fetch appointments.' });
    }
});

// Cancel an appointment by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        if (!deletedAppointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }
        res.status(200).json({ message: 'Appointment canceled successfully.' });
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).json({ message: 'Failed to cancel appointment.' });
    }
});

module.exports = router;
