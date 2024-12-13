import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const response = await axios.get('/api/admin/doctors');
            setDoctors(response.data);
        };
        fetchDoctors();
    }, []);

    return (
        <div>
            <h1>Admin Panel</h1>
            <h2>Doctors List</h2>
            <ul>
                {doctors.map(doctor => (
                    <li key={doctor._id}>{doctor.name}</li>
                ))}
            </ul>
            {/* Add forms for adding/editing doctors, hospitals, etc. */}
        </div>
    );
};

export default AdminPanel;
