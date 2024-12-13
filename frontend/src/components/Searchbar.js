import React, { useState } from 'react';
import axios from 'axios';
import './styles/Searchbar.css';

const SearchBar = () => {
    const [specialty, setSpecialty] = useState('');
    const [location, setLocation] = useState('');
    const [area, setArea] = useState(''); // New state for area
    const [hospital, setHospital] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/api/search`, {
                params: { specialty, location, area, hospital }, // Include area in query params
            });
            setResults(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch results. Please try again.');
            setResults([]);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Area" // New input for area, placed directly under location
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Hospital"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            {error && <p className="error">{error}</p>}
            <div className="results">
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <div key={index} className="result-item">
                            <h3>{result.name}</h3>
                            <p>{result.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
