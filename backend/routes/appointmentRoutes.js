// routes/appointments.js

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    post: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

// Book an appointment with email confirmation
router.post('/book', async (req, res) => {
    const { doctorName, userName, date, time, userEmail, specialty, location } = req.body;

    const newAppointment = new Appointment({
        doctorName,
        userName,
        date,
        time,
        userEmail,
        specialty,
        location,
    });

    try {
        // Save appointment
        const savedAppointment = await newAppointment.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.USER,
            to: userEmail,
            subject: 'Your Healthcare Appointment Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2c5282;">Appointment Confirmation</h2>
                    <p>Hello ${userName},</p>
                    <p>Your appointment has been successfully scheduled.</p>
                    
                    <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #2c5282;">Appointment Details:</h3>
                        <ul style="list-style: none; padding-left: 0;">
                            <li>🏥 <strong>Doctor:</strong> Dr. ${doctorName}</li>
                            <li>🔬 <strong>Specialty:</strong> ${specialty}</li>
                            <li>📅 <strong>Date:</strong> ${date}</li>
                            <li>⏰ <strong>Time:</strong> ${time}</li>
                            <li>📍 <strong>Location:</strong> ${location}</li>
                        </ul>
                    </div>
                    
                    <p>Please arrive 10 minutes before your scheduled time.</p>
                    <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
                    
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #edf2f7;">
                        <p>Best regards,<br>Healthcare Team</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: 'Appointment booked successfully! Confirmation email sent.',
            appointment: savedAppointment
        });

    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Failed to book appointment.' });
    }
});

// Keep existing GET and DELETE routes
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Failed to fetch appointments.' });
    }
});

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
