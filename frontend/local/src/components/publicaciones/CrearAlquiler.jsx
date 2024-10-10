import React, { useState } from 'react';
import axios from 'axios';
import { apiRequestWithTokenRefresh } from '../../auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaMoneyBillWave, FaMapMarkerAlt, FaBed, FaBath, FaCar, FaWifi, FaSnowflake, FaDog, FaSwimmingPool, FaBuilding  ,FaHouseUser,FaRegFlag, FaTimes} from 'react-icons/fa';
import { MdTitle, MdDescription, MdSquareFoot, MdCalendarToday ,MdChair,MdYard,MdOutlineBalcony} from 'react-icons/md';
const CrearAlquiler = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        ubicacion: '',
        superficie: '',
        num_habitaciones: '',
        num_banos: '',
        num_garajes: '',
        tiene_balcon: false,
        tiene_patio: false,
        amueblado: false,
        ano_construccion: '',
        tipo_propiedad: '',
        wifi: false,
        calefaccion: false,
        aire_acondicionado: false,
        piscina: false,
        mascotas_permitidas: false,
        country: '',
        imagenes: []
    });
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(prevImages => [...prevImages, ...files]);
        setFormData(prevData => ({
            ...prevData,
            imagenes: [...prevData.imagenes, ...files]
        }));
    };
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else if (name === 'imagenes') {
            setFormData({
                ...formData,
                imagenes: files
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'imagenes') {
                for (const file of formData[key]) {
                    data.append('imagenes', file);
                }
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            await apiRequestWithTokenRefresh(async () => {
                const token = localStorage.getItem('access_token');
                return axios.post('http://localhost:8000/alquiler/alquileres/', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    }
                });
            });
            alert('Alquiler publicado con éxito');
            navigate('/Alquileres');
        } catch (error) {
            console.error('Error al crear el alquiler:', error.response ? error.response.data : error);
        }
    };

    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-xl"
        >
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 border-b-2 border-blue-500 pb-4">Crear Nuevo Alquiler</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col space-y-2">
                        <label htmlFor="titulo" className="flex items-center text-gray-700 font-semibold">
                            <MdTitle className="mr-2 text-blue-500" />
                            Título
                        </label>
                        <input
                            id="titulo"
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Título atractivo para tu alquiler"
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white shadow-sm"
                        />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col space-y-2">
                        <label htmlFor="descripcion" className="flex items-center text-gray-700 font-semibold">
                            <MdDescription className="mr-2 text-blue-500" />
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Describe tu propiedad"
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 h-32 resize-none bg-white shadow-sm"
                        />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col space-y-2">
                        <label htmlFor="precio" className="flex items-center text-gray-700 font-semibold">
                            <FaMoneyBillWave className="mr-2 text-green-500" />
                            Precio
                        </label>
                        <input
                            id="precio"
                            type="number"
                            name="precio"
                            value={formData.precio}
                            onChange={handleChange}
                            placeholder="Precio mensual"
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 bg-white shadow-sm"
                        />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col space-y-2">
                        <label htmlFor="ubicacion" className="flex items-center text-gray-700 font-semibold">
                            <FaMapMarkerAlt className="mr-2 text-red-500" />
                            Ubicación
                        </label>
                        <input
                            id="ubicacion"
                            type="text"
                            name="ubicacion"
                            value={formData.ubicacion}
                            onChange={handleChange}
                            placeholder="Dirección de la propiedad"
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 bg-white shadow-sm"
                        />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col space-y-2">
                            <label htmlFor="superficie" className="mb-2 text-gray-600 font-semibold"> 
                            <MdSquareFoot className="mr-2 text-red-500" />
                            Superficie (m²)</label>
                            
                            <input
                                id="superficie"
                                type="number"
                                name="superficie"
                                value={formData.superficie}
                                onChange={handleChange}
                                placeholder="Superficie (m²)"
                                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col space-y-2">
                        <div className="flex flex-col">
                        <label htmlFor="num_habitaciones" className="mb-2 text-gray-600 font-semibold"
                        > <FaBed className="mr-2 text-red-500" />
                        Número de habitaciones</label>
                        <input
                            id="num_habitaciones"
                            type="number"
                            name="num_habitaciones"
                            value={formData.num_habitaciones}
                            onChange={handleChange}
                            placeholder="Número de habitaciones"
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col space-y-2">
                            <div className="flex flex-col">
                            <label htmlFor="num_banos" className="mb-2 text-gray-600 font-semibold">
                            <FaBath className="mr-2 text-red-500" />
                                Número de baños</label>
                            <input
                                id="num_banos"
                                type="number"
                                name="num_banos"
                                value={formData.num_banos}
                                onChange={handleChange}
                                placeholder="Número de baños"
                                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col space-y-2">
                        <label htmlFor="num_garajes" className="mb-2 text-gray-600 font-semibold"> 
                        < FaCar className="mr-2 text-red-500" />Número de garajes</label>
                        <input
                            id="num_garajes"
                            type="number"
                            name="num_garajes"
                            value={formData.num_garajes}
                            onChange={handleChange}
                            placeholder="Número de garajes"
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col space-y-2">
                    <label htmlFor="ano_construccion" className="mb-2 text-gray-600 font-semibold">
                    < FaBuilding className="mr-2 text-red-500" />
                    Año de construcción</label>
                    <input
                        id="ano_construccion"
                        type="number"
                        name="ano_construccion"
                        value={formData.ano_construccion}
                        onChange={handleChange}
                        placeholder="Año de construcción"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col space-y-2">
                    <label htmlFor="tipo_propiedad" className="mb-2 text-gray-600 font-semibold">
                    < FaHouseUser className="mr-2 text-red-500" />
                    Tipo de propiedad</label>
                    <select
                        id="tipo_propiedad"
                        name="tipo_propiedad"
                        value={formData.tipo_propiedad}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="casa">Casa</option>
                        <option value="departamento">Departamento</option>
                        <option value="chalet">Chalet</option>
                        <option value="duplex">Dúplex</option>
                        <option value="piso">Piso</option>
                    </select>
                    </motion.div>
                    <motion.div whileHover={{  scale: 1.02 }} className="flex flex-col space-y-2">
                    <label htmlFor="country" className="mb-2 text-gray-600 font-semibold">
                    < FaRegFlag className="mr-2 text-red-500" />
                    País</label>
                    <input
                        id="country"
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="País"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    </motion.div>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
                    <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="tiene_balcon"
                                checked={formData.tiene_balcon}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">
                                <MdOutlineBalcony className="inline mr-2 text-blue-500" />
                                Tiene balcón</span>
                        </label>
                        
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="piscina"
                                checked={formData.piscina}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">
                            <FaSwimmingPool className="inline mr-2 text-blue-500" /> Piscina</span>
                        </label>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
                    <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="mascotas_permitidas"
                                checked={formData.mascotas_permitidas}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">
                            <FaDog className="inline mr-2 text-blue-500" /> 
                            Mascotas </span>
                        </label>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="wifi"
                            checked={formData.wifi}
                            onChange={handleChange}
                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                        />
                        <label htmlFor="wifi" className="text-gray-700 font-medium">
                            <FaWifi className="inline mr-2 text-blue-500" /> Wi-Fi
                        </label>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
                    <input
                                type="checkbox"
                                name="tiene_patio"
                                checked={formData.tiene_patio}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">
                            <MdYard className="inline mr-2 text-yellow-300" /> 
                            patio</span>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
                    <input
                                type="checkbox"
                                name="amueblado"
                                checked={formData.amueblado}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">
                            <MdChair className="inline mr-2 text-yellow-950" /> 
                            
                            Amueblado</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="aire_acondicionado"
                            checked={formData.aire_acondicionado}
                            onChange={handleChange}
                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                        />
                        <label htmlFor="aire_acondicionado" className="text-gray-700 font-medium">
                            <FaSnowflake className="inline mr-2 text-blue-300" /> A/C
                        </label>
                        
                    </motion.div>

                    {/* Añade los demás checkboxes siguiendo el mismo patrón */}
                </div>

                <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex flex-col space-y-4"
                    >
                        <label htmlFor="imagenes" className="flex items-center text-gray-700 font-semibold">
                            <FaHome className="mr-2 text-purple-500" />
                            Imágenes
                        </label>
                        <input
                            id="imagenes"
                            type="file"
                            name="imagenes"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="imagenes"
                            className="cursor-pointer bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-300"
                        >
                            Seleccionar imágenes
                        </label>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {selectedImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Selected ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => {
                                            setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
                                            setFormData(prevData => ({
                                                ...prevData,
                                                imagenes: prevData.imagenes.filter((_, i) => i !== index)
                                            }));
                                        }}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full py-4 px-6 bg-black text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300"
                >
                    Publicar alquiler
                </motion.button>
            </form>
        </motion.div>
    );
};

export default CrearAlquiler;
