import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListaAlquileres = () => {
    const [alquileres, setAlquileres] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    const modificarEnlace = (enlace) => {
        if (enlace && enlace.endsWith('0')) {
            return enlace.slice(0, -1) + '1';
        }
        return enlace;
    };

    useEffect(() => {
        const fetchAlquileres = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/alquiler/alquileres/view/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setAlquileres(response.data);
            } catch (error) {
                console.error('Error al obtener los alquileres:', error);
            }
        };

        fetchAlquileres();
    }, [token]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/alquiler/alquileres/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAlquileres(alquileres.filter(alquiler => alquiler.id !== id));
        } catch (error) {
            console.error('Error al eliminar el alquiler:', error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/editar-alquiler/${id}`);
    };

    const handleDetalle = (id) => {
        navigate(`/detalle-alquiler/${id}`);
    };

    return (
        <div>
            <h2>Lista de Alquileres</h2>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {alquileres.map(alquiler => (
                        <div key={alquiler.id} className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                            {alquiler.imagenes && alquiler.imagenes.length > 0 ? (
                                <img
                                    className="w-full h-48 object-cover"
                                    src={modificarEnlace(alquiler.imagenes[0].image_url)} // Asumiendo que tomas la primera imagen
                                    alt={alquiler.titulo}
                                />
                            ) : (
                                <img
                                    src="https://www.dropbox.com/scl/fi/qp9v9jfykx02wla9l8jrf/35a4098a7a089a791cc381ee7bdd2dc2.jpg?rlkey=ff5y2muw14ra5rh57k4wcy50n&st=v1o9im3c&dl=1"
                                    alt="Imagen por defecto"
                                />
                            )}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800">{alquiler.titulo}</h2>
                                <p className="text-lg font-semibold text-green-600 mt-2">${alquiler.precio}</p>
                                <p className="text-gray-600 mt-4 line-clamp-3">{alquiler.descripcion}</p>
                                <div className="mt-4">
                                    <p className="text-gray-600"><strong>Ubicación:</strong> {alquiler.ubicacion}</p>
                                    <p className="text-gray-600"><strong>Superficie:</strong> {alquiler.superficie} m²</p>
                                    <p className="text-gray-600"><strong>País:</strong> {alquiler.country}</p>
                                </div>
                                <p className="text-gray-500 text-sm mt-4">Publicado el {alquiler.fecha_publicacion}</p>
                                <div className="mt-4 flex justify-between">
                                    <button
                                        onClick={() => handleEdit(alquiler.id)}
                                        className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(alquiler.id)}
                                        className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDetalle(alquiler.id)}
                                    className="mt-4 inline-block bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Ver más detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListaAlquileres;
