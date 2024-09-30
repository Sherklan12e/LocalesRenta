// Profile.js

import React, { useState, useEffect } from 'react';
import { RiInstagramFill,RiFacebookCircleFill } from "react-icons/ri";
import { useParams , useNavigate} from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
function Profile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [alquileres, setAlquileres] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    let usuarioId = null;
    if (token){
        const decodificar = jwtDecode(token);
        usuarioId = decodificar.user_id;
    }
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

    useEffect(() =>{
        const fechAlquierles = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/alquiler/alquileres/view/', {
                    headers: {
                        'Authorization':`Bearer ${token}`
                    }
                });
                setAlquileres(response.data);
            } catch (error){
                console.error('Error al obtener los alquileres: ', error);
            }
        };
        fechAlquierles();
    }, [token]);
    const handleDetalle = (id) => {
        navigate(`/detalle-alquiler/${id}`);
    }

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
                        <p className="text-lg font-bold text-gray-800">nada por ahora</p>
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

                <div className="mt-6">
                    <p className="text-gray-600">
                        {profile.bio}
                    </p>
                </div>

                <div className="mt-6">
                    <a href=""> <RiInstagramFill  className=' text-3xl' /></a>
                </div>
                
                <div className="mt-6">
                    <a href="">   <RiFacebookCircleFill className='text-3xl'  /> </a>
                   

                </div>

                <div className="mt-6 flex justify-center">
                    <button className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600">
                        Enviar mensaje
                    </button>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800">Posts</h2>
                    {console.log(alquileres, "alquileres")}
                    {console.log(profile.id , "id  del usuario")}
                    {alquileres.map(alquileres => (
                        
                        profile.id === alquileres.user &&  (
                       
                        <div key={alquileres.id} className="grid grid-cols-3 gap-4 mt-4">
                            
                            {alquileres.imagenes && alquileres.imagenes.length > 0 ? (
                                <img
                                onClick={() => handleDetalle(alquileres.id)} 
                                className="w-full h-32 object-cover rounded-lg"
                                src={alquileres.imagenes[0].imagen}
                                alt="Post 1"    
                                />
                            ):(
                                <img
                                className="w-full h-32 object-cover rounded-lg"
                                src="https://www.dropbox.com/scl/fi/qp9v9jfykx02wla9l8jrf/35a4098a7a089a791cc381ee7bdd2dc2.jpg?rlkey=ff5y2muw14ra5rh57k4wcy50n&st=v1o9im3c&dl=1 "
                                alt="Post 1"    
                            />
                            )}

                        </div> 
                        )
                       
                       

                    ))}
                    
                </div>
            </div>
        </div>
    );
}

export default Profile;
