// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import { AuthProvider } from './components/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import VerifyOtp from './services/verifyOtp';
import DoctorSelection from './components/DoctorSelection';
import AppointmentBooking from './components/AppointmentBooking';
import AppointmentPreview from './components/AppointmentPreview'; // Import AppointmentPreview
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App = () => {
    return (
        <AuthProvider>
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={
                        <ProtectedRoute restricted>
                            <Register />
                        </ProtectedRoute>
                        } />
                    <Route path="/login" element={
                        <ProtectedRoute restricted>
                        <Login />
                        </ProtectedRoute>
                        } />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/verify-otp" element={<VerifyOtp />} />
                    <Route path='/reset-password/:token' element={<ResetPassword />} />
                    <Route path="/doctor-selection" element={<DoctorSelection />} />
                    <Route path="/appointment/:doctorId" element={<AppointmentBooking />} />
                    <Route path="/appointment-preview" element={<AppointmentPreview />} /> {/* Add Route */}
                </Routes>
                <Footer />
            </div>
        </Router>
        </AuthProvider>
    );
};

export default App;
