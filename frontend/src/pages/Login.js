import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { FcGoogle } from 'react-icons/fc'; // Google logo
import { FaGithub, FaFacebook, FaLinkedin } from 'react-icons/fa'; // Icons
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Password visibility icons

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const googleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const githubLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/github';
    };

    const facebookLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/facebook';
    };

    const linkedinLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/linkedin';
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

    useEffect(() => {
        gsap.from('.login-container', { opacity: 0, y: -50, duration: 1 });
    }, []);

    useEffect(() => {
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
            style={{
                maxWidth: '400px',
                margin: 'auto',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                background: '#f9f9f9',
                marginTop: '8vh',
            }}
        >
            <Typography
                variant="h4"
                component={motion.h2}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    marginBottom: '20px',
                    textAlign: 'center',
                    color: '#333',
                }}
            >
                Sign-In
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
                    style={{ marginBottom: '16px' }}
                />
                <TextField
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    style={{ marginBottom: '24px' }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    style={{
                        padding: '12px 0',
                        fontSize: '1rem',
                        textTransform: 'none',
                    }}
                >
                    SignIn
                </Button>

                <Typography
                    variant="body2"
                    style={{
                        marginTop: '16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        color: '#2196F3',
                    }}
                    onClick={() => navigate('/forgot-password')}
                >
                    Forgot Password?
                </Typography>
            </form>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                    gap: '10px',
                }}
            >
                <button
                    onClick={googleLogin}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 20px',
                        background: 'none',
                        border: '1px solid #DB4437',
                        borderRadius: '5px',
                        color: '#DB4437',
                        cursor: 'pointer',
                        fontSize: '16px',
                        flex: '1 1 48%',
                    }}
                >
                    <FcGoogle size={24} />
                    Google
                </button>
                <button
                    onClick={githubLogin}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 20px',
                        background: 'none',
                        border: '1px solid #24292e',
                        borderRadius: '5px',
                        color: '#24292e',
                        cursor: 'pointer',
                        fontSize: '16px',
                        flex: '1 1 48%',
                    }}
                >
                    <FaGithub size={24} />
                    GitHub
                </button>
                <button
                    onClick={facebookLogin}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 20px',
                        background: 'none',
                        border: '1px solid #4267B2',
                        borderRadius: '5px',
                        color: '#4267B2',
                        cursor: 'pointer',
                        fontSize: '16px',
                        flex: '1 1 48%',
                    }}
                >
                    <FaFacebook size={24} />
                    Facebook
                </button>
                <button
                    onClick={linkedinLogin}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 20px',
                        background: 'none',
                        border: '1px solid #0077B5',
                        borderRadius: '5px',
                        color: '#0077B5',
                        cursor: 'pointer',
                        fontSize: '16px',
                        flex: '1 1 48%',
                    }}
                >
                    <FaLinkedin size={24} />
                    LinkedIn
                </button>
            </div>

            {message && (
                <Typography
                    component={motion.p}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        color: 'red',
                        marginTop: '16px',
                        textAlign: 'center',
                    }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Login;
