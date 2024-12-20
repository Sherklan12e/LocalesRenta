import React, { useState, useEffect } from 'react';
import { VscKebabVertical } from "react-icons/vsc";
import { FaMapMarkerAlt, FaBed, FaBath, FaRuler } from "react-icons/fa";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
const ListaAlquileres = () => {
    const [alquileres, setAlquileres] = useState([]);
    const [loading, setLoading] = useState(true);

    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1); // Para paginación
    const [showModal, setShowModal] = useState(false);
    const [selectedAlquiler, setSelectedAlquiler] = useState(null);
    const id = localStorage.getItem('id');
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const { username } = useParams();
    let userId = null;
    if (token) {
        const descodificado = jwtDecode(token);
        userId = descodificado.user_id;
    }

    useEffect(() => {
        setLoading(true);
        const fetchAlquileres = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/alquiler/alquileres/view/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setAlquileres(response.data);
                 if (response.data.length < 9) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error al obtener los alquileres:', error);
            } finally {
                setLoading(false);
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
    const getCachedImage = (url) => {
        const cachedImage = localStorage.getItem(url);
        if (cachedImage) {
            return cachedImage;
        }
        return null;
    };

    const handleImageLoad = (url) => {
        localStorage.setItem(url, url);
    };

    const SkeletonCard = () => {
        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                    <div className="h-8 bg-blue-600 rounded"></div>
                </div>
            </div>
        );
    };
    return (
        <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Alquileres Disponibles</h1>
                <InfiniteScroll
                    dataLength={alquileres.length}
                    next={() => setPage(prev => prev + 1)} // Incrementa la página
                    hasMore={hasMore}
                    loader={hasMore && loading ? <SkeletonCard /> : null} 
                    endMessage={<p>No hay más alquileres para mostrar.</p>}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                         {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : (
                            alquileres.map(alquiler => {
                                const cachedImage = getCachedImage(alquiler.imagenes[0]?.imagen);
                                return (
                                    <motion.div
                                        key={alquiler.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                                    >
                                    <div className="relative">
                                        <div className="aspect-w-16 aspect-h-9">
                                            <LazyLoadImage
                                                onClick={() => handleDetalle(alquiler.id)}
                                                className="w-full h-full object-cover cursor-pointer"
                                                src={cachedImage || alquiler.imagenes[0]?.imagen}
                                                alt={alquiler.titulo}
                                                effect="blur"
                                                placeholderSrc="https://via.placeholder.com/400x300?text=Loading..."
                                                onLoad={() => handleImageLoad(alquiler.imagenes[0]?.imagen)}
                                                loading="lazy" fetchpriority="high"
                                            />
                                        </div>
                                        <button
                                            onClick={() => openModal(alquiler)}
                                            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition duration-300"
                                        >
                                            <VscKebabVertical size={20} className="text-gray-600" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                            <h2 className="text-xl font-bold text-white">{alquiler.titulo}</h2>
                                            <p className="text-sm text-gray-300 flex items-center mt-1">
                                                <FaMapMarkerAlt className="mr-1" /> {alquiler.ubicacion}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-2xl font-bold text-green-600 mb-4">${alquiler.precio}/mes</p>
                                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                                            <span className="flex items-center"><FaBed className="mr-1" /> {alquiler.num_habitaciones} hab</span>
                                            <span className="flex items-center"><FaBath className="mr-1" /> {alquiler.num_banos} baños</span>
                                            <span className="flex items-center"><FaRuler className="mr-1" /> {alquiler.superficie} m²</span>
                                        </div>
                                        <button
                                            onClick={() => handleDetalle(alquiler.id)}
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                        >
                                            Ver detalles
                                        </button>
                                    </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </InfiniteScroll>
            </div>

            <AnimatePresence>
                {showModal && selectedAlquiler && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Opciones</h3>
                            <div className="space-y-4">
                                {userId === selectedAlquiler.user && (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleEdit(selectedAlquiler.id);
                                                closeModal();
                                            }}
                                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete(selectedAlquiler.id);
                                                closeModal();
                                            }}
                                            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={closeModal}
                                    className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ListaAlquileres;