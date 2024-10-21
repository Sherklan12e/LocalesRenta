import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion ,AnimatePresence } from 'framer-motion';
import { FaUser, FaMapMarkerAlt, FaFacebook, FaInstagram, FaPhone } from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import { useDarkMode } from "../../contexts/DarkModeContext";

function EditarProfile() {
    const { darkMode } = useDarkMode();
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const token = localStorage.getItem('access_token');
    const { username } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        bio: '',
        profile_picture: '',
        location: '',
        facebook: '',
        instagram: '',
        phone_number: '',
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
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
                window.location.reload();
                navigate(`/profile/${username}`);
            }, 500);
            console.log('Profile updated:', response.data);
            const newUsername = response.data.username;
            if (newUsername !== username) {
                localStorage.setItem('username', newUsername);
                navigate(`/profile/${newUsername}`);
                window.location.reload();
            } else {
                navigate(`/profile/${username}`);
                window.location.reload();
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
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <div className={`min-h-screen ${darkMode ? 'bg-color_turquesa9 text-white ' : 'bg-gray-200  text-black'}  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
            {showNotification && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-6 rounded-xl shadow-xl z-50 text-center"
                >
                    <h3 className="text-lg font-bold tracking-wider">¡Perfil Actualizado Exitosamente!</h3>
                </motion.div>
            )}

            <div className="max-w-lg w-full  rounded-3xl shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className={`md:w-1/3   ${darkMode ? 'bg-color_turquesa9 text-white ' : 'bg-gray-100  text-black'}  p-6 flex flex-col items-center`}>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-32 h-32 mb-4"
                        >
                            <img
                                className="w-full h-full rounded-full border-4 border-gray-100  rounded-full object-cover shadow-lg transition-transform transform hover:scale-110"
                                src={previewImage || "https://via.placeholder.com/150"}
                                alt="Profile"
                                onClick={openModal}
                            />
                        </motion.div>
                        <h2 className="
                        text-lg font-semibold">Actualizar Foto</h2>
                    </div>

                    <div className="p-6 flex-grow">
                        <h3 className="text-2xl font-semibold  text-center mb-6">Editar Perfil</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

                            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center space-x-2">
                                <FaUser className="text-indigo-500" />
                                <input
                                    type="text"
                                    name="username"
                                    value={profileData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className={`w-full py-2 px-4 ${darkMode ? 'bg-slate-900 text-white ' : 'bg-white text-black'} rounded-lg shadow-sm focus:ring-indigo-500 border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            </motion.div>
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}

                            <motion.div whileHover={{ scale: 1.03 }} className="flex items-start space-x-2">
                                <MdDescription className="text-gray-500 mt-3" />
                                <textarea
                                    name="bio"
                                    value={profileData.bio ?? ''}
                                    onChange={handleChange}
                                    placeholder="Bio"
                                    className={`w-full ${darkMode ? 'bg-slate-900 text-white ' : 'bg-white text-black'} py-2 px-4 rounded-lg shadow-sm focus:ring-indigo-500 border ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
                                    rows="3"
                                />
                            </motion.div>
                            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}

                            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center space-x-2">
                                <FaMapMarkerAlt className="text-blue-500" />
                                <input
                                    type="text"
                                    name="location"
                                    value={profileData.location}
                                    onChange={handleChange}
                                    placeholder="Location"
                                    className={`w-full py-2 px-4 text-black  ${darkMode ? 'bg-slate-900 text-white ' : 'bg-white text-black'}  rounded-lg shadow-sm focus:ring-indigo-500 border-gray-300`}
                                />
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center space-x-2">
                                <FaPhone className="text-green-500" />
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={profileData.phone_number}
                                    onChange={handleChange}
                                    placeholder="Número de Teléfono"
                                    className={`${darkMode ? 'bg-slate-900 text-white ' : 'bg-white text-black'}  w-full py-2 px-4 rounded-lg shadow-sm focus:ring-indigo-500 `}
                                />
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center space-x-2">
                                <FaFacebook className="text-blue-400" />
                                <input
                                    type="url"
                                    name="facebook"
                                    value={profileData.facebook}
                                    onChange={handleChange}
                                    placeholder="https://facebook.com/usuario"
                                    className={` ${darkMode ? 'bg-slate-900 text-white ' : 'bg-white text-black'}  w-full py-2 px-4 rounded-lg shadow-sm focus:ring-indigo-500 border-gray-300`}
                                />
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center space-x-2">
                                <FaInstagram className="text-pink-500" />
                                <input
                                    type="url"
                                    name="instagram"
                                    value={profileData.instagram}
                                    onChange={handleChange}
                                    placeholder="https://instagram.com/usuario"
                                    className={`w-full py-2 ${darkMode ? 'bg-slate-900 text-white ' : 'bg-white text-black'} px-4 rounded-lg shadow-sm focus:ring-indigo-500 border-gray-300`}
                                />
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
                                <input
                                    type="file"
                                    name="profile_picture"
                                    onChange={handleImageChange}
                                    className={`w-full text-sm text-gray-500  ${darkMode ? 'bg-slate-900 text-white ' : 'bg-white text-black'} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200`}
                                />
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                type="submit"
                                className={`w-full ${darkMode ? 'bg-slate-900 text-white ' : 'bg-white text-black'} text-center py-3 px-6 bg-indigo-600 font-bold rounded-lg shadow-lg transition duration-300 hover:bg-indigo-700`}
                            >
                                Guardar Cambios
                            </motion.button>
                        </form>
                        <AnimatePresence>
                            {isModalOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                                    onClick={closeModal}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0.9 }}
                                        className="relative max-w-4xl max-h-[90vh] overflow-hidden"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <img
                                            className="w-full h-full object-contain"
                                            src={previewImage || "https://via.placeholder.com/1200x800"}
                                            alt={previewImage}
                                        />
                                        <button
                                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-300"
                                            onClick={closeModal}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default EditarProfile;
