import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaBed, FaBath, FaHome, FaCar, FaWifi, FaSwimmingPool, FaPaw, FaCouch, FaCalendarAlt, FaRuler, FaMapMarkerAlt, FaThermometerHalf, FaSnowflake, FaUser, FaEnvelope } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const DetalleAlquiler = () => {
    const [alquiler, setAlquiler] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [randomAlquileres, setRandomAlquileres] = useState([]);
    const { id } = useParams();
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchAlquiler = async () => {
            try {
                const response = await axios.get(`https://sherklan.pythonanywhere.com/alquiler/alquileres/${id}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAlquiler(response.data);
                if (response.data.imagenes && response.data.imagenes.length > 0) {
                    setActiveImage(response.data.imagenes[0].imagen);
                }
            } catch (error) {
                console.error('Error al obtener el detalle del alquiler:', error);
            }
        };

        const fetchRandomAlquileres = async () => {
            try {
                const response = await axios.get('https://sherklan.pythonanywhere.com/alquiler/alquileres/random/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRandomAlquileres(response.data);
            } catch (error) {
                console.error('Error al obtener alquileres aleatorios:', error);
            }
        };

        fetchAlquiler();
        fetchRandomAlquileres();
    }, [id, token]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (!alquiler) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-center text-gray-800 mb-8"
                >
                </motion.h2>
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="relative aspect-w-16 aspect-h-9">
                                <img
                                    className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-300"
                                    src={activeImage || "https://via.placeholder.com/600x400"}
                                    alt={alquiler.titulo}
                                    onClick={openModal}
                                />
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {alquiler.imagenes && alquiler.imagenes.length > 0 ? (
                                    alquiler.imagenes.map((imagen, index) => (
                                        <img
                                            key={index}
                                            className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all duration-300 ${activeImage === imagen.imagen ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-105'}`}
                                            src={imagen.imagen || "https://via.placeholder.com/100x100"}
                                            alt={`Imagen ${index + 1}`}
                                            onClick={() => setActiveImage(imagen.imagen)}
                                        />
                                    ))
                                ) : (
                                    <div className="text-gray-500">No hay imágenes disponibles</div>
                                )}
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-3xl font-semibold text-gray-800">{alquiler.titulo}</h3>
                                <p className="text-2xl font-bold text-green-600 mt-2">${alquiler.precio} / mes</p>
                            </div>
                            <p className="text-gray-600 text-lg">{alquiler.descripcion}</p>
                            <div className="space-y-2">
                                <p className="text-gray-700 flex items-center"><FaMapMarkerAlt className="mr-2 text-blue-500" /> <span className="font-semibold">Ubicación:</span> {alquiler.ubicacion}</p>
                                <p className="text-gray-700 flex items-center"> <FaHome className="mr-2 text-blue-500" />  <span className="font-semibold">Tipo :</span> {alquiler.tipo_propiedad}</p>
                                <p className="text-gray-700 flex items-center"><FaRuler className="mr-2 text-blue-500" /> <span className="font-semibold">Superficie:</span> {alquiler.superficie} m²</p>
                                <p className="text-gray-700 flex items-center"><FaCalendarAlt className="mr-2 text-blue-500" /> <span className="font-semibold">Publicado el:</span> {new Date(alquiler.fecha_publicacion).toLocaleDateString()}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Feature icon={<FaBed />} text={`${alquiler.num_habitaciones} Habitaciones`} />
                                <Feature icon={<FaBath />} text={`${alquiler.num_banos} Baños`} />
                                <Feature icon={<FaCar />} text={`${alquiler.num_garajes} Garajes`} />
                                {alquiler.tiene_balcon && <Feature icon={<FaCouch />} text="Balcón" />}
                                {alquiler.tiene_patio && <Feature icon={<FaPaw />} text="Patio" />}
                                {alquiler.wifi && <Feature icon={<FaWifi />} text="Wi-Fi" />}
                                {alquiler.piscina && <Feature icon={<FaSwimmingPool />} text="Piscina" />}
                                {alquiler.mascotas_permitidas && <Feature icon={<FaPaw />} text="Mascotas permitidas" />}
                                {alquiler.calefaccion && <Feature icon={<FaThermometerHalf />} text="Calefacción" />}
                                {alquiler.aire_acondicionado && <Feature icon={<FaSnowflake />} text="Aire acondicionado" />}
                                {alquiler.tipo_propiedad && <Feature icon={<FaSnowflake />} text="Aire acondicionado" />}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Perfil del usuario y botón de mensaje */}
                <div className="mt-8 bg-white shadow-xl rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {console.log(alquiler.username)}
                            <img src={alquiler.user_profile_image || "https://via.placeholder.com/50"} alt="User Profile" className="w-12 h-12 rounded-full" />
                            <div>
                                <h3 className="text-xl font-semibold">{alquiler.user_name}</h3>
                                <p className="text-gray-600">{alquiler.username}</p>
                            </div>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center">
                            <FaEnvelope className="mr-2" />
                            Enviar mensaje
                        </button>
                    </div>
                </div>

                {/* Publicaciones aleatorias */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Otras propiedades que te pueden interesar</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {randomAlquileres.map((alquiler) => (
                            <Link to={`/detalle-alquiler/${alquiler.id}`} key={alquiler.id}>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden"
                                >
                                    <img src={alquiler.imagenes[0]?.imagen || "https://via.placeholder.com/300x200"} alt={alquiler.titulo} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <h4 className="text-xl font-semibold text-gray-800 mb-2">{alquiler.titulo}</h4>
                                        <p className="text-gray-600 mb-2">{alquiler.ubicacion}</p>
                                        <p className="text-green-600 font-bold">${alquiler.precio} / mes</p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
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
                                src={activeImage || "https://via.placeholder.com/1200x800"}
                                alt={alquiler.titulo}
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
    );
};

const Feature = ({ icon, text }) => (
    <div className="flex items-center space-x-2 text-gray-600">
        <span className="text-blue-500">{icon}</span>
        <span>{text}</span>
    </div>
);

export default DetalleAlquiler;