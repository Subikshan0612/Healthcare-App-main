// controllers/adminController.js

// Dummy functions for the example. Replace these with your actual logic.
const getDoctors = (req, res) => {
    res.send('Get all doctors');
};

const addDoctor = (req, res) => {
    res.send('Add a new doctor');
};

const updateDoctor = (req, res) => {
    res.send(`Update doctor with ID ${req.params.id}`);
};

const deleteDoctor = (req, res) => {
    res.send(`Delete doctor with ID ${req.params.id}`);
};

module.exports = {
    getDoctors,
    addDoctor,
    updateDoctor,
    deleteDoctor
};
