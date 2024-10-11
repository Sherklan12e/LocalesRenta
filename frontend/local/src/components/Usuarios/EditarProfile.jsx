import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUser, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';

function Profile() {
    const [errors, setErrors] = useState({});
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
    const [previewImage, setPreviewImage] = useState(null);

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
                setPreviewImage(response.data.profile_picture);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
    }, [username, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileData({ ...profileData, profile_picture: file });
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const formData = new FormData();
        for (const key in profileData) {
            if (key === 'profile_picture') {
                if (typeof profileData[key] === 'object') {
                    formData.append(key, profileData[key]);
                }
                // Don't append if it's a URL (string)
            } else {
                formData.append(key, profileData[key]);
            }
        }
    
        console.log('Data being sent to server:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/profile/${username}/update/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Profile updated:', response.data);
            const newUsername = response.data.username;
            if (newUsername !== username) {
                localStorage.setItem('username', newUsername);
                navigate(`/profile/${newUsername}`);
            } else {
                navigate(`/profile/${username}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response) {
                console.log('Error response:', error.response);
                console.log('Error data:', error.response.data);
                setErrors(error.response.data);
            } else if (error.request) {
                console.log('Error request:', error.request);
                setErrors({ general: 'No response received from the server.' });
            } else {
                console.log('Error message:', error.message);
                setErrors({ general: 'An error occurred while updating the profile.' });
            }
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="h-48 w-full object-cover md:w-48"
                        >
                            <img
                                className="h-48 w-full object-cover md:w-48"
                                src={previewImage || "https://via.placeholder.com/150"}
                                alt="Profile"
                            />
                        </motion.div>
                    </div>
                    <div className="p-8 w-full">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Editar Perfil</div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                        {errors.general && <p className="text-red-500">{errors.general}</p>}
                            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-2">
                                <FaUser className="text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={profileData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} className="flex items-start space-x-2">
                                <MdDescription className="text-gray-400 mt-3" />
                                <textarea
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleChange}
                                    placeholder="Bio"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    rows="3"
                                />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-2">
                                <FaMapMarkerAlt className="text-gray-400" />
                                <input
                                    type="text"
                                    name="location"
                                    value={profileData.location}
                                    onChange={handleChange}
                                    placeholder="Location"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-2">
                                <FaFacebook className="text-gray-400" />
                                <input
                                    type="url"
                                    name="facebook"
                                    value={profileData.facebook}
                                    onChange={handleChange}
                                    placeholder="https://facebook.com/usuario"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-2">
                                <FaInstagram className="text-gray-400" />
                                <input
                                    type="url"
                                    name="instagram"
                                    value={profileData.instagram}
                                    onChange={handleChange}
                                    placeholder="https://instagram.com/usuario"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-2">
                                <input
                                    type="file"
                                    name="profile_picture"
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-indigo-50 file:text-indigo-700
                                        hover:file:bg-indigo-100"
                                />
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Update Profile
                            </motion.button>
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </form>
                    </div>
                </div>
               
            </div>
        </div>
    );
}

export default Profile;