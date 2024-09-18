// Profile.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        axios.get(`http://127.0.0.1:8000/api/profile/${username}/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Profile data from API:', response.data);
            setProfile(response.data);
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
        });
        
    }, [username]);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {console.log(profile)}
            <h1>{profile.username}</h1>
            <h1>{profile.id}</h1>
            {profile.profile_picture ? (
                <img src={profile.profile_picture} alt="Profile" />
            ) : (
                <p>No profile picture available</p>
            )}
            <p>Email: {profile.email}</p>
            <p>Bio: {profile.bio}</p>
            <p>Location: {profile.location}</p>
        </div>
    );
}

export default Profile;
a