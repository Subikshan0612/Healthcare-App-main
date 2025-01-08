import React, { useState, useEffect } from 'react';
import './AppointmentPreview.css';


const getValidDateRange = (appointmentDate) => {
    const currentAppointmentDate = new Date(appointmentDate.split('-').reverse().join('-'));
    const maxDate = new Date(currentAppointmentDate);
    maxDate.setDate(currentAppointmentDate.getDate() + 3);
    
    return {
        min: currentAppointmentDate.toISOString().split('T')[0],
        max: maxDate.toISOString().split('T')[0]
    };
};

const validateReschedule = (appointmentToReschedule, newDate, newTime) => {
    // Check if trying to reschedule to same date and time
    if (appointmentToReschedule.date === newDate && appointmentToReschedule.time === newTime) {
        alert('Cannot reschedule to the same date and time slot');
        return false;
    }
    return true;
};


const AppointmentsPreview = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rescheduleData, setRescheduleData] = useState({
        appointmentId: null,
        newDate: '',
        newTime: 'morning' // Default value matching AppointmentBooking.js
    });
    const [showRescheduleForm, setShowRescheduleForm] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

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

    const handleReschedule = async (id) => {
        const appointment = appointments.find(apt => apt._id === id);
        setRescheduleData({ 
            ...rescheduleData, 
            appointmentId: id,
            currentDate: appointment.date 
        });
        setShowRescheduleForm(true);
    };

    const submitReschedule = async (e) => {
        e.preventDefault();
        
        const currentAppointment = appointments.find(apt => apt._id === rescheduleData.appointmentId);
        
        if (!validateReschedule(currentAppointment, rescheduleData.newDate, rescheduleData.newTime)) {
            return;
        }
    
        try {
            const dateObj = new Date(rescheduleData.newDate);
            const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;
    
            const response = await fetch(`http://localhost:5000/api/appointments/reschedule/${rescheduleData.appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newDate: formattedDate,
                    newTime: rescheduleData.newTime
                }),
            });
    
            if (response.ok) {
                const updatedAppointments = appointments.map(apt => 
                    apt._id === rescheduleData.appointmentId 
                        ? { ...apt, date: formattedDate, time: rescheduleData.newTime }
                        : apt
                );
                setAppointments(updatedAppointments);
                setShowRescheduleForm(false);
                alert('Appointment rescheduled successfully! Confirmation email sent.');
            }
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            alert('Failed to reschedule appointment.');
        }
    };

    const cancelAppointment = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setAppointments(appointments.filter((appointment) => appointment._id !== id));
                alert('Appointment cancelled successfully!');
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
                                <p><strong>Hospital:</strong> {appointment.hospital}</p>
                            </div>
                            <div className="appointment-actions">
                                <button 
                                    className="reschedule-button"
                                    onClick={() => handleReschedule(appointment._id)}
                                >
                                    Reschedule
                                </button>
                                <button 
                                    className="cancel-button" 
                                    onClick={() => cancelAppointment(appointment._id)}
                                >
                                    Cancel Appointment
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {showRescheduleForm && (
                <div className="reschedule-form-overlay">
                    <div className="reschedule-form">
                        <h3>Reschedule Appointment</h3>
                        <form onSubmit={submitReschedule}>
                        <div className="form-group">
                            <label>New Date:</label>
                                <input
                                    type="date"
                                    value={rescheduleData.newDate}
                                    onChange={(e) => setRescheduleData({
                                    ...rescheduleData,
                                    newDate: e.target.value
                                    })}
                                    min={getValidDateRange(rescheduleData.currentDate).min}
                                    max={getValidDateRange(rescheduleData.currentDate).max}
                                    required
                                />
                        </div>
                            <div className="form-group">
                                <label>New Time:</label>
                                    <div className="radio-group">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                value="morning"
                                                checked={rescheduleData.newTime === 'morning'}
                                                onChange={(e) => setRescheduleData({
                                                ...rescheduleData,
                                                newTime: e.target.value
                                                })}
                                            />
                                            Morning (9:00 AM - 12:00 PM)
                                         </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                value="afternoon"
                                                checked={rescheduleData.newTime === 'afternoon'}
                                                onChange={(e) => setRescheduleData({
                                                ...rescheduleData,
                                                newTime: e.target.value
                                                })}
                                            />
                                            Afternoon (2:00 PM - 5:00 PM)
                                        </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                value="evening"
                                                checked={rescheduleData.newTime === 'evening'}
                                                onChange={(e) => setRescheduleData({
                                                ...rescheduleData,
                                                newTime: e.target.value
                                                })}
                                            />
                                                Evening (6:00 PM - 9:00 PM)
                                        </label>
                            </div>
                        </div>
                            <div className="form-actions">
                                <button type="submit">Confirm Reschedule</button>
                                <button type="button" onClick={() => setShowRescheduleForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentsPreview;
