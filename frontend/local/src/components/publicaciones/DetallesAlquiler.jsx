import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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

    if (!alquiler) return <p>Cargando...</p>;

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">Detalles del Alquiler</h2>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {alquiler.imagen ? (
                    <img className="w-full h-48 object-cover" src={alquiler.imagen} alt={alquiler.titulo} />
                ) : (
                    <img src="https://via.placeholder.com/600x400" alt="Imagen no disponible" />
                )}
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800">{alquiler.titulo}</h2>
                    <p className="text-lg font-semibold text-green-600 mt-2">${alquiler.precio}</p>
                    <p className="text-gray-600 mt-4">{alquiler.descripcion}</p>
                    <div className="mt-4">
                        <p className="text-gray-600"><strong>Ubicación:</strong> {alquiler.ubicacion}</p>
                        <p className="text-gray-600"><strong>Superficie:</strong> {alquiler.superficie} m²</p>
                        <p className="text-gray-600"><strong>País:</strong> {alquiler.country}</p>
                        <p className="text-gray-500 text-sm mt-4">Publicado el {alquiler.fecha_publicacion}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleAlquiler;
