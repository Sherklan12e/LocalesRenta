import React, { useState, useEffect } from 'react';
import { useParams ,useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
    const navigate = useNavigate();
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
    
        // Usamos FormData para manejar el envío de archivos
        const formData = new FormData();
        formData.append('username', profileData.username);
        formData.append('bio', profileData.bio);
        formData.append('location', profileData.location);
        formData.append('facebook', profileData.facebook);
        formData.append('instagram', profileData.instagram);
    
        // Solo agregamos profile_picture si el usuario seleccionó una nueva imagen
        if (profileData.profile_picture instanceof File) {
            formData.append('profile_picture', profileData.profile_picture);
        }
    
        try {
            await axios.put(`http://127.0.0.1:8000/api/profile/${username}/update/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Deja que axios maneje esto
                },
            });
            alert('¡Perfil actualizado con éxito!');
            navigate(-1)
        } catch (error) {
            console.error('Error al actualizar el perfil:', error.response?.data);
            alert('Error actualizando perfil: ' + (error.response?.data.detail || 'Error desconocido'));
        }
    };
    
    
    
    console.log(profileData.profile_picture); 
   

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
            type="url"
            name="facebook"
            value={profileData.facebook ?? ''}
            onChange={handleChange}
            placeholder="https://facebook/usuario1"
            
        />
        <input
            type="url"
            name="instagram"
            value={profileData.instagram ?? ''}
            onChange={handleChange}
            placeholder="https://instagram/usuario1" 
        
        />
        <button type="submit">Update Profile</button>
    </form>
    

    );
}

export default Profile;
