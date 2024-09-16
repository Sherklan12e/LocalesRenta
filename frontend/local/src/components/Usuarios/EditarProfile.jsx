// EditProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = () => {
    const [profileData, setProfileData] = useState({
        bio: '',
        profile_picture: '',
        location: ''
    });

    useEffect(() => {
        axios.get('http://localhost:8000/api/profile/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setProfileData(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the profile!', error);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('http://localhost:8000/api/profile/', profileData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log('Profile updated:', response.data);
        })
        .catch(error => {
            console.error('There was an error updating the profile!', error);
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Bio</label>
            <input
                type="text"
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            />
            <label>Location</label>
            <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
            />
            <label>Profile Picture</label>
            <input
                type="file"
                onChange={(e) => setProfileData({...profileData, profile_picture: e.target.files[0]})}
            />
            <button type="submit">Save Changes</button>
        </form>
    );
}

export default EditProfile;
