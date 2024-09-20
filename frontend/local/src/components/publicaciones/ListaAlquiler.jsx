import React, { useState, useEffect } from 'react';
import { VscKebabVertical } from "react-icons/vsc";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
const ListaAlquileres = () => {
    const [alquileres, setAlquileres] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAlquiler, setSelectedAlquiler] = useState(null);
    const id = localStorage.getItem('id');
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const { username } = useParams();
    // sacar datos del usuario 
    let userId = null;
    if (token){
        const descodificado = jwtDecode(token);
        userId = descodificado.user_id;
    }

    





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

    const openModal = (alquiler) => {
        setSelectedAlquiler(alquiler);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedAlquiler(null);
    };

    return (
        <div>
            <div className="container mx-auto px-4 m-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {alquileres.map(alquiler => (
                        <div key={alquiler.id} className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                            {/* Contenedor relativo para la imagen y el botón */}
                            <div className="relative">
                                {/* Imagen con click handler */}
                                {alquiler.imagenes && alquiler.imagenes.length > 0 ? (
                                    <img 
                                        onClick={() => handleDetalle(alquiler.id)} 
                                        className="w-full h-58 object-cover" 
                                        src={alquiler.imagenes[0].imagen} // Asumiendo que tomas la primera imagen
                                        alt={alquiler.titulo}
                                    />
                                ) : (
                                    <img 
                                        onClick={() => handleDetalle(alquiler.id)} 
                                        src="https://www.dropbox.com/scl/fi/qp9v9jfykx02wla9l8jrf/35a4098a7a089a791cc381ee7bdd2dc2.jpg?rlkey=ff5y2muw14ra5rh57k4wcy50n&st=v1o9im3c&dl=1"
                                        alt="Imagen por defecto"
                                    />
                                )}
                                {/* Botón en la esquina superior derecha */}
                                <button 
                                    onClick={() => openModal(alquiler)} 
                                    className="absolute top-2 right-2 text-white text-center"
                                >
                                    <VscKebabVertical size={24} />
                                </button>
                            </div>
                            {/* Detalles del alquiler */}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800">{alquiler.titulo}</h2>
                                <p className="text-lg font-semibold text-green-600 mt-2">${alquiler.precio}</p>
                                <div className="mt-4">
                                    <p className="text-gray-600"><strong>País:</strong> {alquiler.country}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */} 
            {showModal && selectedAlquiler && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-80 p-6">
                        <h3 className="text-lg font-bold mb-4">Opciones</h3>
                        <div className="mt-4 flex justify-between">
                            {console.log(selectedAlquiler.user , "id del usuario")}
                            
                           
                                <> 
                                    {/* <button
                                        onClick={() => {
                                            handleEdit(selectedAlquiler.id);
                                            closeModal();
                                        }}
                                        className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Editar
                                    </button> */}
                                        {userId === selectedAlquiler.user && (
                                        <button
                                                onClick={() => {
                                                    handleDelete(selectedAlquiler.id);
                                                    closeModal();
                                                }}
                                                className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        )}

                                </>
                        </div>
                        <button
                            onClick={closeModal}
                            className="mt-4 w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListaAlquileres;
