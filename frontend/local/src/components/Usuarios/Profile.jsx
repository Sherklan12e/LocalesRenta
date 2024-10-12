import React, { useState, useEffect } from 'react';
import { RiInstagramFill, RiFacebookCircleFill } from "react-icons/ri";
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Profile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [alquileres, setAlquileres] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const currentUser = localStorage.getItem('username');
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
                console.log('Alquileres obtenidos:', response.data); // Verifica los alquileres obtenidos
                const userAlquileres = response.data.filter(alquiler => alquiler.user === profile.user);
                console.log('Alquileres del usuario:', userAlquileres); // Verifica los alquileres filtrados
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

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-gray-200 flex justify-center py-12 px-4 lg:px-8">
            <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-6xl   ">
                <div className="relative flex items-center space-x-8">
                    <img
                        className="w-36 h-36 rounded-full object-cover shadow-lg transition-transform transform hover:scale-110"
                        src={profile.profile_picture}
                        alt="Profile"
                    />
                    <div className="flex-grow">
                        <h1 className="text-4xl font-bold text-gray-800 tracking-wider">{profile.username}</h1>
                        <p className="text-lg text-gray-600 mt-2">@{profile.username}</p>
                        <p className="text-gray-500 mt-1 text-sm">{profile.location}</p>
                        <div className="mt-4 flex items-center space-x-4">
                            <a href={profile.instagram} target='_blank' rel="noopener noreferrer" className="text-red-500 hover:text-red-600 transition duration-300">
                                <RiInstagramFill className='text-4xl' />
                            </a>
                            <a href={profile.facebook} target='_blank' rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition duration-300">
                                <RiFacebookCircleFill className='text-4xl' />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="text-gray-600 text-lg leading-relaxed">{profile.bio}</p>
                </div>

                <div className="flex justify-between items-center mt-8">
                {currentUser === profile.username ? (
                        <Link to='edit' className="inline-block text-blue-600 font-semibold underline transition duration-300 hover:text-blue-800">
                            Editar Perfil
                        </Link>
                    ) : null}

                    <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-full hover:shadow-xl transform transition-transform hover:-translate-y-1 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800">
                        Enviar mensaje
                    </button>
                </div>
                  
                    
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Posts</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {alquileres.map(alquiler => (
                            
                            profile.user === alquiler.user && (
                                <div key={alquiler.id} className="relative group rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                                    {console.log(alquileres,"alquiler")}
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
            </div>
        </div>
    );
}

export default Profile;
