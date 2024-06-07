import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const professions = {
    "Marketing Professional": ["Growth marketing", "Digital Marketing", "Product Marketing", "Paid marketing", "Organic marketing"],
    "Entrepreneur": ["Startup enthusiast", "SME", "Product enthusiast", "Product Leader", "Product owner"],
    "Content Creator": ["Youtube", "Twitch", "Twitter", "Video Content"]
};

const UserProfile = () => {
    const [user, setUser] = useState({});
    const [availableInterests, setAvailableInterests] = useState([]);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('/api/users/profile', {
                    headers: { Authorization: token },
                });
                setUser(response.data);
                setAvailableInterests(professions[response.data.profession]);
            } catch (error) {
                console.error('Error fetching user profile', error);
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

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

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/api/users/${user._id}`, user, {
                headers: { Authorization: token },
            });
            setConfirmationMessage('Profile updated successfully!');
            setTimeout(() => setConfirmationMessage(''), 3000); // Clear message after 3 seconds
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    return (
        <div>
            <h1>Edit Profile</h1>
            {confirmationMessage && <p>{confirmationMessage}</p>}
            <form onSubmit={handleUpdate}>
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
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default UserProfile;
