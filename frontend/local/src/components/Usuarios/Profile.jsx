import React, { useState, useEffect } from 'react';
import { RiInstagramFill, RiFacebookCircleFill, RiWhatsappFill } from "react-icons/ri";
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { motion, AnimatePresence } from 'framer-motion';

function Profile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [alquileres, setAlquileres] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const currentUser = localStorage.getItem('username');
    const { darkMode } = useDarkMode();
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
                setProfile(response.data);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
    }, [username, token]);

    useEffect(() => {
        if (!profile) return;
        const fetchAlquileres = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/alquiler/alquileres/view/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const userAlquileres = response.data.filter(alquiler => alquiler.user === profile.user);
                setAlquileres(userAlquileres);
            } catch (error) {
                console.error('Error al obtener los alquileres: ', error);
            }
        };
        fetchAlquileres();
    }, [token, profile]);

    const handleDetalle = (id) => {
        navigate(`/detalle-alquiler/${id}`);
    }

    if (!profile) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>;
    }
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <div className={`min-h-screen  ${darkMode ? 'bg-color_turquesa9 text-white ' : 'bg-white  text-black'}  flex justify-center py-12 px-4 lg:px-8`} >
            <div className={`${darkMode ? 'bg-color_turquesa10 text-white ' : 'bg-white  text-black'} shadow-2xl rounded-3xl p-10 w-full max-w-6xl   `}>
                <div className="relative flex items-center space-x-8">
                    <img
                        className="w-36 h-36 rounded-full object-cover shadow-lg transition-transform transform hover:scale-110"
                        src={profile.profile_picture}
                        alt="Profile"
                        onClick={openModal}
                    />
                    <div className="flex-grow">
                        <h1 className="text-4xl font-bold  tracking-wider">{profile.username}</h1>
                        <p className="text-lg  mt-2">@{profile.username}</p>
                        <p className=" mt-1 text-sm">{profile.location}</p>
                        <div className="mt-4 flex items-center space-x-4">
                            {profile.instagram && (
                                <a href={profile.instagram} className="text-red-500 hover:text-red-600 transition duration-300">
                                    <RiInstagramFill className='text-4xl' />
                                </a>
                            )}
                            {profile.facebook && (
                                <a href={profile.facebook} target='_blank' rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition duration-300">
                                    <RiFacebookCircleFill className='text-4xl' />
                                </a>
                            )}
                            {profile.whatsapp && (
                                <a href={`https://wa.me/${profile.whatsapp}?text=Hola%20Me%20Interesado%20en%20tu%20Local%20que%20publicaste%20en%20HANKROK%20`} target='_blank' rel="noopener noreferrer" className="text-green-500 hover:text-green-600 transition duration-300">
                                    <RiWhatsappFill className='text-4xl' />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <p className=" text-lg leading-relaxed">{profile.bio}</p>
                </div>

                <div className="flex justify-between items-center mt-8">
                    {currentUser === profile.username ? (
                        <Link to='edit' className="inline-block text-blue-600 font-semibold underline transition duration-300 hover:text-blue-800">
                            Editar Perfil
                        </Link>
                    ) : null}

                    <Link to={`/chat/${profile.username}`} className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-full hover:shadow-xl transform transition-transform hover:-translate-y-1 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800">
                        Enviar mensaje
                    </Link>
                </div>


                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Posts</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {alquileres.map(alquiler => (

                            profile.user === alquiler.user && (
                                <div key={alquiler.id} className="relative group rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                                    {alquiler.imagenes && alquiler.imagenes.length > 0 ? (
                                        <img
                                            onClick={() => handleDetalle(alquiler.id)}
                                            className="w-full h-48 object-cover transition-opacity group-hover:opacity-80 cursor-pointer"
                                            src={alquiler.imagenes[0].imagen}
                                            alt="Post"
                                        />
                                    ) : (
                                        <img
                                            className="w-full h-48 object-cover"
                                            src="https://www.dropbox.com/scl/fi/qp9v9jfykx02wla9l8jrf/35a4098a7a089a791cc381ee7bdd2dc2.jpg?rlkey=ff5y2muw14ra5rh57k4wcy50n&st=v1o9im3c&dl=1"
                                            alt="Post"
                                        />
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </div>
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
                                    src={profile.profile_picture || "https://via.placeholder.com/1200x800"}
                                    alt={profile.username}
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
    );
}

export default Profile;
