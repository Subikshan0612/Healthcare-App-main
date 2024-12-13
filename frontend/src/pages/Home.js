import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import SearchBar from '../components/Searchbar';
import './styles/Home.css';

const Home = () => {
    React.useEffect(() => {
        gsap.from(".home-container", { opacity: 0, y: 50, duration: 1 });
    }, []);

    const handleSearch = (query) => {
        console.log('Searching for:', query);
        // Implement search functionality (e.g., filter doctors or hospitals)
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="home-container"
            sx={{
                maxWidth: '800px',
                margin: 'auto',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                background: '#f9f9f9',
                mt: 8,
                textAlign: 'center',
            }}
        >
            <Typography
                variant="h3"
                component={motion.h1}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 2, color: '#333' }}
            >
                Welcome to the Healthcare App
            </Typography>
            <Typography
                variant="body1"
                component={motion.p}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 4, color: '#555' }}
            >
                Find the best doctors, hospitals, and healthcare services near you.
            </Typography>
            <SearchBar onSearch={handleSearch} />
        </Box>
    );
};

export default Home;

