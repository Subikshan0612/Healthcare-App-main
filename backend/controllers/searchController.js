const Doctor = require('../models/Doctor');

exports.searchDoctors = async (req, res) => {
    const { query } = req.query; // Get search query from request
    const doctors = await Doctor.find({ name: { $regex: query, $options: 'i' } });
    res.json(doctors);
};
