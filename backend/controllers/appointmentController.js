const Appointment = require('../models/Appointment');

// Function to book an appointment
exports.bookAppointment = async (req, res) => {
    const { doctorId, date, time, userEmail, specialty, location } = req.body;

    try {
        // Check for required fields
        if (!doctorId || !date || !time || !userEmail || !specialty || !location) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new appointment document
        const newAppointment = new Appointment({
            doctorId,
            date,
            time,
            specialty,
            location,
            userEmail,
        });

        // Save appointment to the database
        const savedAppointment = await newAppointment.save();
        console.log('Appointment saved:', savedAppointment);

        // Respond with a success message
        res.status(201).json({ message: 'Appointment booked successfully!', appointment: savedAppointment });
    } catch (error) {
        console.error('Error in booking appointment:', error);
        // Respond with an error message
        res.status(500).json({ message: 'Failed to book appointment', error: error.message });
    }
};
