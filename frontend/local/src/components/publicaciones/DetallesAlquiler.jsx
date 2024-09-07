import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaBed, FaBath, FaCar, FaWifi, FaSwimmingPool, FaPaw, FaCouch, FaCalendarAlt } from 'react-icons/fa';

const DetalleAlquiler = () => {
    const [alquiler, setAlquiler] = useState(null);
    const { id } = useParams();
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchAlquiler = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/alquiler/alquileres/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setAlquiler(response.data);
            } catch (error) {
                console.error('Error al obtener el detalle del alquiler:', error);
            }
        };

        fetchAlquiler();
    }, [id, token]);

    if (!alquiler) return <p className="text-center text-gray-500">Cargando...</p>;
    const modificarEnlace = (enlace) => {
        if (enlace && enlace.endsWith('0')) {
            return enlace.slice(0, -1) + '1';
        }
        return enlace;
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">{alquiler.titulo}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="flex flex-col">
                {alquiler.imagenes && alquiler.imagenes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {alquiler.imagenes.map((imagen, index) => (
                            <img
                                key={index}
                                className="w-full h-48 object-cover rounded-lg"
                                src={imagen.imagen ? imagen.imagen : "https://via.placeholder.com/600x400"}
                                alt={`Imagen ${index + 1} de ${alquiler.titulo}`}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <img src="https://via.placeholder.com/600x400" alt="Imagen no disponible" />
                    </div>
                )}
                </div>
                <div className="p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-700">{alquiler.titulo}</h3>
                        <p className="text-lg font-semibold text-green-600 mt-2">${alquiler.precio} / mes</p>
                        <p className="text-gray-600 mt-4">{alquiler.descripcion}</p>
                        <div className="mt-6">
                            <p className="text-gray-600"><strong>Ubicación:</strong> {alquiler.ubicacion}</p>
                            <p className="text-gray-600"><strong>Superficie:</strong> {alquiler.superficie} m²</p>
                            <p className="text-gray-600"><strong>País:</strong> {alquiler.country}</p>
                            <p className="text-gray-500 text-sm mt-4">Publicado el {alquiler.fecha_publicacion}</p>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600">
                            <FaBed className="mr-2" /> {alquiler.num_habitaciones} Habitaciones
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FaBath className="mr-2" /> {alquiler.num_banos} Baños
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FaCar className="mr-2" /> {alquiler.num_garajes} Garajes
                        </div>
                        {alquiler.tiene_balcon && (
                            <div className="flex items-center text-gray-600">
                                <FaCouch className="mr-2" /> Balcón
                            </div>
                        )}
                        {alquiler.tiene_patio && (
                            <div className="flex items-center text-gray-600">
                                <FaPaw className="mr-2" /> Patio
                            </div>
                        )}
                        {alquiler.wifi && (
                            <div className="flex items-center text-gray-600">
                                <FaWifi className="mr-2" /> Wi-Fi
                            </div>
                        )}
                        {alquiler.piscina && (
                            <div className="flex items-center text-gray-600">
                                <FaSwimmingPool className="mr-2" /> Piscina
                            </div>
                        )}
                        {alquiler.mascotas_permitidas && (
                            <div className="flex items-center text-gray-600">
                                <FaPaw className="mr-2 color-red" /> Se permiten mascotas
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleAlquiler;