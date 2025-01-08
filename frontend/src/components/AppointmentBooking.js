import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AppointmentBooking.css';

const AppointmentBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedDoctor = location.state?.doctor;

    const [date, setDate] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('morning');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!date.trim()) {
            setError('Please select a date.');
            return false;
        }
        if (!userEmail.trim()) {
            setError('Please enter your email.');
            return false;
        }
        if (!userName.trim()) {
            setError('Please enter your name.');
            return false;
        }
        return true;
    };

    const handleBookingAndPayment = async () => {
        if (!validateForm()) return;
    
        setLoading(true);
        setError('');
        setSuccessMessage('');
    
        // Format date to dd-mm-yyyy
        const dateObj = new Date(date);
        const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;
    
        try {
            const bookingResponse = await axios.post('http://localhost:5000/api/appointments/book', {
                doctorName: selectedDoctor.name,
                userName,
                date: formattedDate,
                time: selectedPeriod,
                userEmail,
                specialty: selectedDoctor.specialty,
                location: selectedDoctor.location,
                hospital: selectedDoctor.hospital,
            });
    
            if (bookingResponse.status === 201) {
                setSuccessMessage('Appointment booked successfully! Check your email for confirmation.');
                setTimeout(() => {
                    navigate('/appointment-preview');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to book appointment. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };
                

                // // Initiate payment
                // const paymentResponse = await axios.post('http://localhost:5000/create-order', {
                //     name: userName,
                //     mobileNumber: '9999999999',
                //     amount: 500,
                // });

                // if (paymentResponse.data.url) {
                //     window.location.href = paymentResponse.data.url;
                // }
    //         }
    //     } catch (error) {
    //         setError(error.response?.data?.message || 'Failed to book appointment. Please try again.');
    //         console.error('Error:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    if (!selectedDoctor) {
        return <div className="error-container">Please select a doctor first.</div>;
    }

    return (
        <div className="appointment-booking-container">
            <h2>Book an Appointment with {selectedDoctor.name}</h2>
            
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <div className="doctor-info">
                <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
                <p><strong>Location:</strong> {selectedDoctor.location}</p>
                <p><strong>Hospital:</strong> {selectedDoctor.hospital}</p>
            </div>

            <div className="form-group">
                <label htmlFor="userName">Your Name:</label>
                <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="date">Select Date:</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={getTodayDate()}
                    required
                />
            </div>

            <div className="form-group">
                <label>Select Time Period:</label>
                <div className="radio-group">
                    <label className="radio-label">
                        <input
                            type="radio"
                            value="morning"
                            checked={selectedPeriod === 'morning'}
                            onChange={() => setSelectedPeriod('morning')}
                        />
                        Morning (9:00 AM - 12:00 PM)
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            value="afternoon"
                            checked={selectedPeriod === 'afternoon'}
                            onChange={() => setSelectedPeriod('afternoon')}
                        />
                        Afternoon (2:00 PM - 5:00 PM)
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            value="evening"
                            checked={selectedPeriod === 'evening'}
                            onChange={() => setSelectedPeriod('evening')}
                        />
                        Evening (6:00 PM - 9:00 PM)
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="email">Your Email:</label>
                <input
                    type="email"
                    id="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                />
            </div>

            <button 
                className="book-button" 
                onClick={handleBookingAndPayment}
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Book Appointment & Pay'}
            </button>
        </div>
    );
};

export default AppointmentBooking;
