import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { TextField, Button, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import './styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const googleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const githubLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/github';
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            console.log(response.data);
            const { token } = response.data;
            login(token); // Update global authentication state
            navigate('/doctor-selection'); // Redirect to doctor selection page
        } catch (error) {
            console.error('Login failed:', error.message);
            setMessage('Login failed. Please check your credentials and try again.');
        }
    };

    React.useEffect(() => {
        gsap.from(".login-container", { opacity: 0, y: -50, duration: 1 });
    }, []);

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
    
        if (token) {
            localStorage.setItem('token', token); // Persist token
            login(token); // Update context
            navigate('/doctor-selection'); // Redirect
        }
    }, [login, navigate]);
    

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="login-container"
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
            <Typography
                variant="h4"
                component={motion.h2}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 2, textAlign: 'center', color: '#333' }}
            >
                SignIn
            </Typography>

            <form onSubmit={handleLogin}>
                <TextField
                    type="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    type="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ mb: 3 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                        color: 'white',
                        py: 1.5,
                        fontSize: '1rem',
                        textTransform: 'none',
                        '&:hover': { background: '#1976D2' },
                    }}
                >
                    SignIn
                </Button>

                <Typography
                    variant="body2"
                    sx={{ mt: 2, textAlign: 'center', cursor: 'pointer', color: '#2196F3' }}
                    onClick={() => navigate('/forgot-password')}
                >
                    Forgot Password?
                </Typography>
            </form>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <button onClick={googleLogin} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#DB4437', color: '#fff', border: 'none', borderRadius: '5px' }}>
                        Sign-in with Google
                    </button>
                    <button onClick={githubLogin} style={{ padding: '10px 20px', backgroundColor: '#24292e', color: '#fff', border: 'none', borderRadius: '5px' }}>
                        Sign-in with GitHub
                    </button>
                </div>


            {message && (
                <Typography
                    component={motion.p}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    sx={{ color: 'red', mt: 2, textAlign: 'center' }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Login;

