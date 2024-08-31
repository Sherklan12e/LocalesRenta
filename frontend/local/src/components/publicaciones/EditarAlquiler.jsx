import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditarAlquiler = () => {

    const [alquiler, setAlquiler] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [superficie, setSuperficie] = useState('');
    const [country, setCountry] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchAlquiler = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/alquiler/alquileres/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Agrega el token JWT a la cabecera
                    }
                });
                setAlquiler(response.data);
                setTitulo(response.data.titulo);
                setDescripcion(response.data.descripcion);
                setPrecio(response.data.precio);
                setUbicacion(response.data.ubicacion);
                setSuperficie(response.data.superficie);
                setCountry(response.data.country);
            } catch (error) {
                console.error('Error al obtener la publicación:', error);
            }
        };

        fetchAlquiler();
    }, [id, token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/alquiler/alquileres/${id}/`, {
                titulo,
                descripcion,
                precio,
                ubicacion,
                superficie,
                country
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Agrega el token JWT a la cabecera
                }
            });
            navigate('/Alquileres'); // Redirige a la lista de alquileres después de guardar
        } catch (error) {
            console.error('Error al actualizar la publicación:', error);
        }
    };

    if (!alquiler) return <p>Cargando...</p>;

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">Editar Publicación</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="form-input mt-1 block w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="form-textarea mt-1 block w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                    <input
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        className="form-input mt-1 block w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Ubicación</label>
                    <input
                        type="text"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        className="form-input mt-1 block w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Superficie</label>
                    <input
                        type="number"
                        value={superficie}
                        onChange={(e) => setSuperficie(e.target.value)}
                        className="form-input mt-1 block w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">País</label>
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="form-input mt-1 block w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-600"
                >
                    Guardar
                </button>
            </form>
        </div>
    );
};

export default EditarAlquiler;
