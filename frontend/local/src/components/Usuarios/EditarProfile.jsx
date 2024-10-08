import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile() {

    const token = localStorage.getItem('access_token'); 
    const { username } = useParams();
    const [profileData, setProfileData] = useState({
        username: '',
        bio: '',
        profile_picture: '',
        location: '',
        facebook: '',
        instagram: '',
    });

   

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };
    useEffect(() => {
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
                setProfileData(response.data);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });

    }, [username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Use FormData to handle the file upload
        const formData = new FormData();
        formData.append('username', profileData.username);
        formData.append('bio', profileData.bio);
        formData.append('location', profileData.location);
        formData.append('facebook', profileData.facebook);
        formData.append('instagram', profileData.instagram);
    
        // Only append profile_picture if a file was selected
        if (profileData.profile_picture) {
            formData.append('profile_picture', profileData.profile_picture); // Append picture if exists
        }
    
        try {
            await axios.put(`http://127.0.0.1:8000/api/profile/${username}/update/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('There was an error updating the profile!', error.response?.data);
            alert('Error updating profile: ' + (error.response?.data.detail || 'Unknown error'));
        }
    };
    
    
    console.log(profileData.profile_picture); // should log the File object, not just the name
   
    console.log(profileData.profile_picture); // Should output a File object

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
            type="file"
            name="profile_picture"
            onChange={(e) => {
                const file = e.target.files[0];
                setProfileData({ ...profileData, profile_picture: file });
            }}
            />

    
        <input
            type="text"
            name="username"
            value={profileData.username ?? ''}
            onChange={handleChange}
            placeholder="Username"
        />
        <textarea
            name="bio"
            value={profileData.bio ?? ''}
            onChange={handleChange}
            placeholder="Bio"
        />
        <input
            type="text"
            name="location"
            value={profileData.location ?? ''}
            onChange={handleChange}
            placeholder="Location"
        />
        <input
            type="text"
            name="facebook"
            value={profileData.facebook ?? ''}
            onChange={handleChange}
            placeholder="Facebook"
        />
        <input
            type="text"
            name="instagram"
            value={profileData.instagram ?? ''}
            onChange={handleChange}
            placeholder="Instagram"
        />
        <button type="submit">Update Profile</button>
    </form>
    

    );
}

export default Profile;
