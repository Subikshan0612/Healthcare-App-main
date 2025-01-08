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
    const { doctorName, userName, date, time, userEmail, specialty, location,hospital } = req.body;

    const newAppointment = new Appointment({
        doctorName,
        userName,
        date,
        time,
        userEmail,
        specialty,
        location,
        hospital,
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
                            <li>🏥 <strong>Hospital:</strong> ${hospital}</li>
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
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Send cancellation confirmation email
        const mailOptions = {
            from: process.env.USER,
            to: appointment.userEmail,
            subject: 'Appointment Cancellation Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2c5282;">Appointment Cancelled</h2>
                    <p>Hello ${appointment.userName},</p>
                    <p>Your appointment has been successfully cancelled.</p>
                    
                    <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #2c5282;">Cancelled Appointment Details:</h3>
                        <ul style="list-style: none; padding-left: 0;">
                            <li>🏥 <strong>Doctor:</strong> Dr. ${appointment.doctorName}</li>
                            <li>🔬 <strong>Specialty:</strong> ${appointment.specialty}</li>
                            <li>📅 <strong>Date:</strong> ${appointment.date}</li>
                            <li>⏰ <strong>Time:</strong> ${appointment.time}</li>
                            <li>📍 <strong>Location:</strong> ${appointment.location}</li>
                            <li>🏥 <strong>Hospital:</strong> ${appointment.hospital}</li>
                        </ul>
                    </div>
                    
                    <p>If you wish to book another appointment, please visit our website.</p>
                    
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #edf2f7;">
                        <p>Best regards,<br>Healthcare Team</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        await Appointment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Cancellation error:', error);
        res.status(500).json({ message: 'Error cancelling appointment' });
    }
});

router.put('/reschedule/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { newDate, newTime } = req.body;
        
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { date: newDate, time: newTime },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Send reschedule confirmation email
        const mailOptions = {
            from: process.env.USER,
            to: updatedAppointment.userEmail,
            subject: 'Appointment Rescheduled Successfully',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2c5282;">Appointment Rescheduled</h2>
                    <p>Hello ${updatedAppointment.userName},</p>
                    <p>Your appointment has been successfully rescheduled.</p>
                    
                    <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #2c5282;">New Appointment Details:</h3>
                        <ul style="list-style: none; padding-left: 0;">
                            <li>🏥 <strong>Doctor:</strong> Dr. ${updatedAppointment.doctorName}</li>
                            <li>🔬 <strong>Specialty:</strong> ${updatedAppointment.specialty}</li>
                            <li>📅 <strong>New Date:</strong> ${newDate}</li>
                            <li>⏰ <strong>New Time:</strong> ${newTime}</li>
                            <li>📍 <strong>Location:</strong> ${updatedAppointment.location}</li>
                            <li>🏥 <strong>Hospital:</strong> ${updatedAppointment.hospital}</li>
                        </ul>
                    </div>
                    
                    <p>Please arrive 10 minutes before your scheduled time.</p>
                    
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #edf2f7;">
                        <p>Best regards,<br>Healthcare Team</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Reschedule error:', error);
        res.status(500).json({ message: 'Error rescheduling appointment' });
    }
});



module.exports = router;
