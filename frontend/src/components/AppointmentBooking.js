import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './AppointmentBooking.css';

const AppointmentBooking = () => {
    const location = useLocation();
    const selectedDoctor = location.state?.doctor;

    // State variables
    const [date, setDate] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('morning');
    const [error, setError] = useState('');

    // Handle booking and payment function
    const handleBookingAndPayment = async () => {
        // Validate fields
        if (!date.trim()) {
            setError('Please select a date.');
            return;
        }
        if (!userEmail.trim()) {
            setError('Please enter your email.');
            return;
        }
        if (!userName.trim()) {
            setError('Please enter your name.');
            return;
        }

        try {
            // Booking appointment
            const bookingResponse = await fetch('http://localhost:5000/api/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorName: selectedDoctor.name,
                    userName,
                    date,
                    time: selectedPeriod,
                    userEmail,
                    specialty: selectedDoctor.specialty,
                    location: selectedDoctor.location,
                }),
            });

            if (bookingResponse.ok) {
                alert('Appointment booked successfully!');

                // Proceed to payment
                const paymentResponse = await fetch('http://localhost:5000/create-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: userName,
                        mobileNumber: '9999999999',
                        amount: 500, // Replace with actual amount logic
                    }),
                });

                if (paymentResponse.ok) {
                    const paymentData = await paymentResponse.json();
                    if (paymentData.url) {
                        window.location.href = paymentData.url; // Redirect to payment gateway
                    }
                } else {
                    const paymentError = await paymentResponse.json();
                    setError(paymentError.message || 'Failed to initiate payment.');
                }
            } else {
                const bookingError = await bookingResponse.json();
                setError(bookingError.message || 'Failed to book appointment.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    if (!selectedDoctor) {
        return <p>Please select a doctor first.</p>;
    }

    return (
        <div className="appointment-booking-container">
            <h2>Book an Appointment with {selectedDoctor.name}</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label htmlFor="userName">Your Name:</label>
                <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
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
                    required
                />
            </div>
            <div className="form-group">
                <label>Select Time Period:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="morning"
                            checked={selectedPeriod === 'morning'}
                            onChange={() => setSelectedPeriod('morning')}
                        />
                        Morning
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="afternoon"
                            checked={selectedPeriod === 'afternoon'}
                            onChange={() => setSelectedPeriod('afternoon')}
                        />
                        Afternoon
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="evening"
                            checked={selectedPeriod === 'evening'}
                            onChange={() => setSelectedPeriod('evening')}
                        />
                        Evening
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
                    required
                />
            </div>
            <button className="book-button" onClick={handleBookingAndPayment}>
                Book Appointment & Pay
            </button>
        </div>
    );
};

export default AppointmentBooking;
