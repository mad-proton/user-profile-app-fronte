import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('There was an error fetching the users!', error));
    }, []);

    const deleteUser = (id) => {
        axios.delete(`/api/users/${id}`)
            .then(() => setUsers(users.filter(user => user._id !== id)))
            .catch(error => console.error('There was an error deleting the user!', error));
    };

    return (
        <div>
            <h1>User List</h1>
            <Link to="/user/new">Create New User</Link>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        {user.username} - {user.profession}
                        <Link to={`/user/${user._id}/edit`}>Edit</Link>
                        <button onClick={() => deleteUser(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
