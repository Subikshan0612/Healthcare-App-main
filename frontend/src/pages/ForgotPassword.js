import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message || 'An error occurred.');
        }
    };

    return (
        <Box
            sx={{
                maxWidth: '400px',
                margin: 'auto',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                background: '#f9f9f9',
                mt: 8,
            }}
        >
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
                Forgot Password
            </Typography>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
            />
            <Button
                variant="contained"
                fullWidth
                onClick={handleForgotPassword}
                sx={{
                    background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                    color: 'white',
                    py: 1.5,
                    fontSize: '1rem',
                }}
            >
                Send Reset Link
            </Button>
            {message && (
                <Typography sx={{ mt: 3, textAlign: 'center', color: 'green' }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default ForgotPassword;
