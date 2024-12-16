import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { FcGoogle } from 'react-icons/fc'; // Google logo
import { FaGithub } from 'react-icons/fa'; // GitHub logo
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Password visibility icons

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const googleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const githubLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/github';
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                phone,
            });

            setMessage('An OTP has been sent to your email successfully! Please verify.');
            setTimeout(() => {
                navigate('/verify-otp', { state: { email } });
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    useEffect(() => {
        gsap.from('.register-container', { opacity: 0, y: -50, duration: 1 });
    }, []);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="register-container"
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
                SignUp
            </Typography>

            <form onSubmit={handleRegister}>
                <TextField
                    type="text"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ marginBottom: '16px' }}
                />
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
                    style={{ marginBottom: '16px' }}
                />
                <TextField
                    type="text"
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    SignUp
                </Button>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '20px',
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
                            width: '48%',
                        }}
                    >
                        <FcGoogle size={24} />
                        Sign-In with Google
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
                            width: '48%',
                        }}
                    >
                        <FaGithub size={24} />
                        Sign-In withGitHub
                    </button>
                </div>
            </form>

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

export default Register;
