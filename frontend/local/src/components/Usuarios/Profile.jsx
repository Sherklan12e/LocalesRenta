// Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        bio: '',
        profile_picture: '',
        location: ''
    });
    console.log("a")
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/profile/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`  // Usando JWT
            }
        })
        .then(response => {
            setProfileData(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the profile!', error);
        });
    }, []);

    return (
        <div>
            <h1 className="m-5" >{profileData.user}'s Profile</h1>
            <p>Email: {profileData.email}</p>
            <p>Bio: {profileData.bio}</p>
            <p>Location: {profileData.location}</p>
            {profileData.profile_picture && <img src={profileData.profile_picture} alt="Profile" />}
        </div>
    );
}

export default Profile;
