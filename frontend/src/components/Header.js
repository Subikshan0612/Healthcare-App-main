// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './Header.css';

// const Header = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         setIsAuthenticated(!!token); // Check if token exists
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         navigate('/login'); // Redirect to login page
//     };

//     return (
//         <header className="header">
//             <div className="logo">Healthcare App</div>
//             <nav>
//                 <ul className="nav-links">
//                     <li><Link to="/">Home</Link></li>
//                     {isAuthenticated ? (
//                         <>
//                             <li><Link to="/appointment-preview">Appointment Preview</Link></li>
//                             <li><Link to="/doctor-selection">Book Doctors</Link></li>
//                             <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
//                         </>
//                     ) : (
//                         <>
//                             <li><Link to="/register">Register</Link></li>
//                             <li><Link to="/login">Login</Link></li>
//                         </>
//                     )}
//                 </ul>
//             </nav>
//         </header>
//     );
// };

// export default Header;

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'
import './Header.css';

const Header = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="logo">Healthcare App</div>
            <nav>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    {isAuthenticated ? (
                        <>
                            <li><Link to="/appointment-preview">Appointment Preview</Link></li>
                            <li><Link to="/doctor-selection">Book Doctors</Link></li>
                            <li><button onClick={handleLogout} className="logout-btn" >Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
