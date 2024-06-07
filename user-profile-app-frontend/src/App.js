import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<UserList />} />
                    <Route path="/user/new" element={<UserForm />} />
                    <Route path="/user/:id/edit" element={<UserForm />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <UserProfile />
                        </PrivateRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
