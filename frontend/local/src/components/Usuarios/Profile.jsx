// Profile.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);



    const token = localStorage.getItem('access_token');
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

    }, [username]);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-12">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl">

                <div className="flex items-center space-x-6">
                    
                    <img
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
                        src={profile.profile_picture} // Imagen de perfil aleatoria
                        alt="Profile"
                    />

                    <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">{profile.username}</h1>

                        </div>
                        <p className="text-gray-600">@{profile.username}</p>
                        <p className="text-gray-500 mt-1">{profile.location}</p>
                    </div>
                </div>

                {/* Estadísticas del perfil */}
                <div className="mt-6 flex justify-between text-center">
                    <div>
                        <p className="text-lg font-bold text-gray-800">150</p>
                        <p className="text-gray-500">Posts</p>
                    </div>
                    {/* <div>
                        <p className="text-lg font-bold text-gray-800">1.2k</p>
                        <p className="text-gray-500">Followers</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-800">320</p>
                        <p className="text-gray-500">Following</p>
                    </div> */}
                </div>

                {/* Biografía */}
                <div className="mt-6">
                    <p className="text-gray-600">
                        {profile.bio}
                    </p>
                </div>

                {/* Botón para seguir */}
                <div className="mt-6 flex justify-center">
                    <button className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600">
                        Enviar mensaje
                    </button>
                </div>

                {/* Sección de publicaciones */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800">Posts</h2>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {/* Ejemplos de imágenes de publicaciones */}
                        <img
                            className="w-full h-32 object-cover rounded-lg"
                            src="https://source.unsplash.com/random/800x600?beach"
                            alt="Post 1"
                        />
                        <img
                            className="w-full h-32 object-cover rounded-lg"
                            src="https://source.unsplash.com/random/800x600?forest"
                            alt="Post 2"
                        />
                        <img
                            className="w-full h-32 object-cover rounded-lg"
                            src="https://source.unsplash.com/random/800x600?city"
                            alt="Post 3"
                        />
                        <img
                            className="w-full h-32 object-cover rounded-lg"
                            src="https://source.unsplash.com/random/800x600?mountains"
                            alt="Post 4"
                        />
                        <img
                            className="w-full h-32 object-cover rounded-lg"
                            src="https://source.unsplash.com/random/800x600?night"
                            alt="Post 5"
                        />
                        <img
                            className="w-full h-32 object-cover rounded-lg"
                            src="https://source.unsplash.com/random/800x600?road"
                            alt="Post 6"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
