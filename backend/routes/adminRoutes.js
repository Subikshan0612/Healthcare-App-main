const express = require('express');
const router = express.Router();
const { getDoctors, addDoctor, updateDoctor, deleteDoctor } = require('../controllers/adminController'); // Import your controller functions

// Route to get all doctors
router.get('/doctors', getDoctors);

// Route to add a new doctor
router.post('/doctors', addDoctor);

// Route to update a doctor's information
router.put('/doctors/:id', updateDoctor);

// Route to delete a doctor
router.delete('/doctors/:id', deleteDoctor);

module.exports = router;
