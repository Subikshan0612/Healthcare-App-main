// src/components/AppointmentsPreview.js
import React, { useState, useEffect } from 'react';
import './AppointmentPreview.css';

const AppointmentsPreview = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Fetch appointments from the backend
    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/appointments');
            const data = await response.json();
            setAppointments(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    // Cancel an appointment
    const cancelAppointment = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setAppointments(appointments.filter((appointment) => appointment._id !== id));
                alert('Appointment canceled successfully!');
            } else {
                alert('Failed to cancel appointment.');
            }
        } catch (error) {
            console.error('Error canceling appointment:', error);
            alert('An error occurred. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading appointments...</p>;
    }

    return (
        <div className="appointments-preview-container">
            <h2>Your Appointments</h2>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                <ul className="appointments-list">
                    {appointments.map((appointment) => (
                        <li key={appointment._id} className="appointment-item">
                            <div className="appointment-details">
                                <p><strong>Doctor:</strong> {appointment.doctorName}</p>
                                <p><strong>Date:</strong> {appointment.date}</p>
                                <p><strong>Time:</strong> {appointment.time}</p>
                                <p><strong>Specialty:</strong> {appointment.specialty}</p>
                                <p><strong>Location:</strong> {appointment.location}</p>
                            </div>
                            <button 
                                className="cancel-button" 
                                onClick={() => cancelAppointment(appointment._id)}
                            >
                                Cancel Appointment
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AppointmentsPreview;
