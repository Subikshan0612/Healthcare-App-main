const express = require('express');
const router = express.Router();

// Dummy data for demonstration purposes
const data = [
    { name: 'Dr. K.Suma', specialty: 'Obstetrics & Gynaecology', location: 'Hyderabad', area: 'Ameerpet', hospital: 'Apollo, Hyderabad', description: 'MBBS, DGO' },
    { name: 'Dr. G.Keertana Reddy', specialty: 'Obstetrics & Gynaecology', location: 'Hyderabad', area: 'Sanathnagar', hospital: 'Apollo, Hyderabad', description: 'MBBS, DGO' },
    { name: 'Dr. Roopa Ghanta', specialty: 'Obstetrics & Gynaecology', location: 'Hyderabad', area: 'Khairatabad', hospital: 'Apollo, Hyderabad', description: 'MBBS, DGO' },
    { name: 'Dr. Anupama', specialty: 'Orthopedic', location: 'Hyderabad', area: 'Nampally', hospital: 'Apollo, Hyderabad', description: 'MBBS, DGO' },
    { name: 'Dr. Padmavati Kapila', specialty: 'Pediatrician', location: 'Hyderabad', area: 'Secunderabad', hospital: 'Apollo, Hyderabad', description: 'MBBS, DGO' },
    { name: 'Dr. Sreelatha Jella', specialty: 'Psychiatrist', location: 'Bangalore', area: 'Jayanagar', hospital: 'Apollo, Bangalore', description: 'MBBS, DGO' },
    { name: 'Dr. Archana Agarwal', specialty: 'Cardiologist', location: 'Bangalore', area: 'Koramangala', hospital: 'Apollo, Bangalore', description: 'MBBS, DGO' },
    { name: 'Dr. Rashmi Swaroop', specialty: 'Orthopedics', location: 'Bangalore', area: 'Malleshwaram', hospital: 'Apollo, Bangalore', description: 'MBBS, DGO' },
    { name: 'Dr. Rashmi Vasanth', specialty: 'Psychiatrist', location: 'Bangalore', area: 'Whitefield', hospital: 'Apollo, Bangalore', description: 'MBBS, DGO' },
    { name: 'Dr. M.Gowri', specialty: 'Obstetrics & Gynaecology', location: 'Bangalore', area: 'Electronic City', hospital: 'Apollo, Bangalore', description: 'MBBS, DGO' },
    { name: 'Dr. Triveni M P', specialty: 'Cardiologist', location: 'Chennai', area: 'Nungambakkam', hospital: 'Apollo, Chennai', description: 'MBBS, DGO' },
    { name: 'Dr. Harini P Shetty', specialty: 'Dentist', location: 'Chennai', area: 'Kodambakkam', hospital: 'Apollo, Chennai', description: 'MBBS, DGO' },
    { name: 'Dr. Bhargavi Reddy', specialty: 'Pediatrician', location: 'Chennai', area: 'T.Nagar', hospital: 'Apollo, Chennai', description: 'MBBS, DGO' },
    { name: 'Dr. Anilasre Atluri', specialty: 'Dermatologist', location: 'Chennai', area: 'Chetpet', hospital: 'Apollo, Chennai', description: 'MBBS, DGO' },
    { name: 'Dr. S.Samundi Sankari', specialty: 'Psychiatrist', location: 'Chennai', area: 'Pudupet', hospital: 'Apollo, Chennai', description: 'MBBS, DGO' },
];

// Search route
router.get('/', (req, res) => {
    const { specialty, location, area, hospital } = req.query; // Get the search parameters from query parameters

    // Filtering logic based on the search parameters
    const results = data.filter(item => 
        (specialty ? item.specialty.toLowerCase().includes(specialty.toLowerCase()) : true) &&
        (location ? item.location.toLowerCase().includes(location.toLowerCase()) : true) &&
        (area ? item.area.toLowerCase().includes(area.toLowerCase()) : true) && // Corrected to filter by area
        (hospital ? item.hospital.toLowerCase().includes(hospital.toLowerCase()) : true)
    );

    res.status(200).json(results); // Return the filtered results
});

module.exports = router;
