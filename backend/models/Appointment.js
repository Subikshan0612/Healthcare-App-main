const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    specialty: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
