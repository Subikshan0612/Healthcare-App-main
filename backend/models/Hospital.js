// models/Hospital.js
const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true }
});

module.exports = mongoose.model('Hospital', HospitalSchema);
