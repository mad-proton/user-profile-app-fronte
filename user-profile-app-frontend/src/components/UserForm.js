import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const professions = {
    "Marketing Professional": ["Growth marketing", "Digital Marketing", "Product Marketing", "Paid marketing", "Organic marketing"],
    "Entrepreneur": ["Startup enthusiast", "SME", "Product enthusiast", "Product Leader", "Product owner"],
    "Content Creator": ["Youtube", "Twitch", "Twitter", "Video Content"]
};

const UserForm = () => {
    const [user, setUser] = useState({ username: '', profession: '', interests: [], bio: '' });
    const [availableInterests, setAvailableInterests] = useState([]);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            axios.get(`/api/users/${id}`)
                .then(response => {
                    setUser(response.data);
                    setAvailableInterests(professions[response.data.profession]);
                })
                .catch(error => console.error('There was an error fetching the user!', error));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });

        if (name === 'profession') {
            setAvailableInterests(professions[value]);
            setUser({ ...user, interests: [], profession: value });
        }
    };

    const handleInterestChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setUser({ ...user, interests: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            axios.put(`/api/users/${id}`, user)
                .then(() => {
                    setConfirmationMessage('User updated successfully!');
                    setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
                })
                .catch(error => console.error('There was an error updating the user!', error));
        } else {
            axios.post('/api/users', user)
                .then(() => {
                    setConfirmationMessage('User created successfully!');
                    setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
                })
                .catch(error => console.error('There was an error creating the user!', error));
        }
    };

    return (
        <div>
            <h1>{id ? 'Edit' : 'Create'} User</h1>
            {confirmationMessage && <p>{confirmationMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={user.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Profession</label>
                    <select name="profession" value={user.profession} onChange={handleChange} required>
                        <option value="">Select Profession</option>
                        {Object.keys(professions).map(prof => (
                            <option key={prof} value={prof}>{prof}</option>
                        ))}
                    </select>
                </div>
                {availableInterests.length > 0 && (
                    <div>
                        <label>Interests</label>
                        <select multiple value={user.interests} onChange={handleInterestChange}>
                            {availableInterests.map(interest => (
                                <option key={interest} value={interest}>{interest}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label>Bio</label>
                    <textarea name="bio" value={user.bio} onChange={handleChange} maxLength="50" required></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default UserForm;
