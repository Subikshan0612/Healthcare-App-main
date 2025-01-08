import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Searchbar.css';

const SearchBar = () => {
    const [specialty, setSpecialty] = useState('');
    const [location, setLocation] = useState('');
    const [area, setArea] = useState('');
    const [hospital, setHospital] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState({
        specialties: [],
        locations: [],
        areas: [],
        hospitals: []
    });
    const [options, setOptions] = useState({
        specialties: [],
        locations: [],
        areas: [],
        hospitals: []
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/search/options');
                setOptions(response.data);
            } catch (err) {
                setError('Failed to load options');
            }
        };
        fetchOptions();
    }, []);

    //fro exact area for the location
    const handleInputChange = async (value, field) => {
        if (field === 'areas' && location) {
            
            try {
                const response = await axios.get(`http://localhost:5000/api/search/areas`, {
                    params: { location }
                });
                const locationSpecificAreas = response.data;
                const filteredAreas = locationSpecificAreas.filter(item =>
                    item.toLowerCase().includes(value.toLowerCase())
                );
                setSuggestions(prev => ({ ...prev, [field]: filteredAreas }));
            } catch (err) {
                setError('Failed to load areas');
            }
        } else {
            const filteredSuggestions = options[field].filter(item =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(prev => ({ ...prev, [field]: filteredSuggestions }));
        }
    };
    
    

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/api/search`, {
                params: { specialty, location, area, hospital },
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
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Specialty"
                        value={specialty}
                        onChange={(e) => {
                            setSpecialty(e.target.value);
                            handleInputChange(e.target.value, 'specialties');
                        }}
                    />
                    {specialty && suggestions.specialties.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.specialties.map((item, index) => (
                                <li key={index} onClick={() => {
                                    setSpecialty(item);
                                    setSuggestions(prev => ({ ...prev, specialties: [] }));
                                }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            handleInputChange(e.target.value, 'locations');
                        }}
                    />
                    {location && suggestions.locations.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.locations.map((item, index) => (
                                <li key={index} onClick={() => {
                                    setLocation(item);
                                    setSuggestions(prev => ({ ...prev, locations: [] }));
                                }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Area"
                        value={area}
                        onChange={(e) => {
                            setArea(e.target.value);
                            handleInputChange(e.target.value, 'areas');
                        }}
                    />
                    {area && suggestions.areas.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.areas.map((item, index) => (
                                <li key={index} onClick={() => {
                                    setArea(item);
                                    setSuggestions(prev => ({ ...prev, areas: [] }));
                                }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Hospital"
                        value={hospital}
                        onChange={(e) => {
                            setHospital(e.target.value);
                            handleInputChange(e.target.value, 'hospitals');
                        }}
                    />
                    {hospital && suggestions.hospitals.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.hospitals.map((item, index) => (
                                <li key={index} onClick={() => {
                                    setHospital(item);
                                    setSuggestions(prev => ({ ...prev, hospitals: [] }));
                                }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button type="submit">Search</button>
            </form>

            {error && <p className="error">{error}</p>}
            <div className="results">
    {results.length > 0 ? (
        results.map((result, index) => (
            <div key={index} className="result-item">
                <h3>{result.name}</h3>
                <div className="doctor-details">
                    <p><strong>Specialty:</strong> {result.specialty}</p>
                    <p><strong>Hospital:</strong> {result.hospital}</p>
                    <p><strong>Location:</strong> {result.location}</p>
                    <p><strong>Area:</strong> {result.area}</p>
                    <p><strong>Qualifications:</strong> {result.description}</p>
                </div>
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
