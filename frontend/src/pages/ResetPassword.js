import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 2000);
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
                Reset Password
            </Typography>
            <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
            />
            <Button
                variant="contained"
                fullWidth
                onClick={handleResetPassword}
                sx={{
                    background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                    color: 'white',
                    py: 1.5,
                    fontSize: '1rem',
                }}
            >
                Reset Password
            </Button>
            {message && (
                <Typography sx={{ mt: 3, textAlign: 'center', color: 'green' }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default ResetPassword;
