import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { AuthContext } from './AuthContext'

const DoctorSelection = () => {
    const navigate = useNavigate();
    const [specialtyFilter, setSpecialtyFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [hospitalFilter, setHospitalFilter] = useState('');

    const { login } = useContext(AuthContext);

    const doctors = [
        { id: '63f847f5e152fa29e074aa21', name: 'Dr. K.Suma', specialty: 'Obstetrics & Gynaecology', location: 'Hyderabad', area: 'Ameerpet', hospital: 'Apollo, Hyderabad', description: 'MBBS, DGO' },
        { id: '63f847f5e152fa29e074aa22', name: 'Dr. G.Keertana Reddy', specialty: 'Obstetrics & Gynaecology', location: 'Hyderabad', area: 'Sanathnagar', hospital: 'Apollo, Hyderabad', description: 'MBBS, DGO' },
        { id: '63f847f5e152fa29e074aa23', name:'Dr. Roopa Ghanta', specialty: 'Obstetrics & Gynaecology', location: 'Hyderabad', area: 'Khairatabad', hospital: 'Apollo, Hyderabad', description: 'MBBS, DGO' },
        { id: '63f847f5e152fa29e074aa25', name: 'Dr. Anupama', specialty: 'Orthopedic', location: 'Hyderabad', area: 'Nampally', hospital: 'Apollo, Hyderabad', description: 'MBBS, DGO' },
         { id: '63f847f5e152fa29e074aa26', name: 'Dr. Padmavati Kapila', specialty: 'Pediatrician', location: 'Hyderabad', area: 'Secunderabad', hospital: 'Apollo, Hyderabad', description: 'MBBS, DGO' },
         { id: '63f847f5e152fa29e074aa27', name: 'Dr. Sreelatha Jella', specialty: 'Psychiatrist', location: 'Bangalore', area: 'Jayanagar', hospital: 'Apollo, Bangalore', description: 'MBBS, DGO' },
        { id: '63f847f5e152fa29e074aa28', name: 'Dr. Archana Agarwal', specialty: 'Cardiologist', location: 'Bangalore', area: 'Koramangala', hospital: 'Apollo, Bangalore', description: 'MBBS, DGO' },
         { id: '63f847f5e152fa29e074aa29', name: 'Dr. Rashmi Swaroop', specialty: 'Orthopedics', location: 'Bangalore', area: 'Malleshwaram', hospital: 'Apollo, Bangalore', description: 'MBBS, DGO' },
         { id: '63f847f5e152fa29e074aa2a', name: 'Dr. Rashmi Vasanth', specialty: 'Psychiatrist', location: 'Bangalore', area: 'Whitefield', hospital: 'Apollo, Bangalore', description: 'MBBS, DGO' },
         { id: '63f847f5e152fa29e074aa2b', name: 'Dr. M.Gowri', specialty: 'Obstetrics & Gynaecology', location: 'Bangalore', area: 'Electronic City', hospital: 'Apollo, Bangalore', description: 'MBBS, DGO' },
         { id: '63f847f5e152fa29e074aa2c', name: 'Dr. Triveni M P', specialty: 'Cardiologist', location: 'Chennai', area: 'Nungambakkam', hospital: 'Apollo, Chennai', description: 'MBBS, DGO' },
         { id: '63f847f5e152fa29e074aa2d', name: 'Dr. Harini P Shetty', specialty: 'Dentist', location: 'Chennai', area: 'Kodambakkam', hospital: 'Apollo, Chennai', description: 'MBBS, DGO' },
         { id: '63f847f5e152fa29e074aa2e', name: 'Dr. Bhargavi Reddy', specialty: 'Pediatrician', location: 'Chennai', area: 'T.Nagar', hospital: 'Apollo, Chennai', description: 'MBBS, DGO' },
         { id: '63f847f5e152fa29e074aa2f', name: 'Dr. Anilasre Atluri', specialty: 'Dermatologist', location: 'Chennai', area: 'Chetpet', hospital: 'Apollo, Chennai', description: 'MBBS, DGO' },
         { id: '63f847f5e152fa29e074aa2g', name: 'Dr. S.Samundi Sankari', specialty: 'Psychiatrist', location: 'Chennai', area: 'Pudupet', hospital: 'KMCH, Chennai', description: 'MBBS, DGO' },
    ];

    const handleSelectDoctor = (doctor) => {
        navigate(`/appointment/${doctor.id}`, { state: { doctor } });
    };

    const filteredDoctors = doctors.filter((doctor) =>
        (specialtyFilter ? doctor.specialty.toLowerCase().includes(specialtyFilter.toLowerCase()) : true) &&
        (locationFilter ? doctor.location.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
        (hospitalFilter ? doctor.hospital.toLowerCase().includes(hospitalFilter.toLowerCase()) : true)
    );

    React.useEffect(() => {
        gsap.from(".doctor-item", { opacity: 0, y: 30, duration: 0.8, stagger: 0.2 });
    }, [filteredDoctors]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            login(token)
        }
    }, [login]);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            sx={{
                p: 4,
                maxWidth: '1000px',
                margin: 'auto',
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                Select a Doctor
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 4,
                }}
            >
                <TextField
                    label="Filter by Specialty"
                    variant="outlined"
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    sx={{ width: '300px' }}
                />
                <TextField
                    label="Filter by Location"
                    variant="outlined"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    sx={{ width: '300px' }}
                />
                <TextField
                    label="Filter by Hospital"
                    variant="outlined"
                    value={hospitalFilter}
                    onChange={(e) => setHospitalFilter(e.target.value)}
                    sx={{ width: '300px' }}
                />
            </Box>

            <Grid container spacing={3} justifyContent="center">
                {filteredDoctors.map((doctor) => (
                    <Grid item xs={12} md={6} lg={4} key={doctor.id}>
                        <Paper
                            //className="doctor-item"
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: 'left',
                                borderRadius: '10px',
                                // background: 'linear-gradient(to right, #ff7e5f, #feb47b)', // Vibrant orange gradient
                                backgroundColor: '#004d67',
                                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                                color: '#fff',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                {doctor.name}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#ffffff', opacity: 0.9 }}>
                                Specialty: {doctor.specialty}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ffffff', opacity: 0.8, mb: 2 }}>
                                Location: {doctor.location}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ffffff', opacity: 0.8 }}>
                                Hospital: {doctor.hospital}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => handleSelectDoctor(doctor)}
                                sx={{
                                    borderRadius: '20px',
                                    background: '#00c853', // Bright green
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        background: '#00b843',
                                    },
                                }}
                            >
                                Select
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {filteredDoctors.length === 0 && (
                <Typography variant="body1" sx={{ mt: 4, color: '#999' }}>
                    No doctors found for the selected criteria.
                </Typography>
            )}
        </Box>
    );
};

export default DoctorSelection;



