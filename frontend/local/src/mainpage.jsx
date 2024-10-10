import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaBed, FaBath, FaRuler, FaMapMarkerAlt } from 'react-icons/fa';

const MainPage = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [featuredAlquileres, setFeaturedAlquileres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlquileres = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/alquiler/alquileres/view/');
        setAlquileres(response.data);
        setFeaturedAlquileres(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching alquileres:', error);
      }
    };

    fetchAlquileres();
  }, []);

  const handleDetalle = (id) => {
    navigate(`/detalle-alquiler/${id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-cover bg-no-repeat bg-center h-screen"
        style={{ backgroundImage: `url('https://i.pinimg.com/originals/28/eb/eb/28ebeb4cbc97ee8671d9fb275549fcf0.jpg')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-6xl text-white font-bold mb-8"
            >
              Encuentra tu hogar ideal
            </motion.h1>
            <motion.form
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4"
            >
              <input
                type="text"
                placeholder="Buscar por ubicación, tipo de propiedad..."
                className="w-full md:w-96 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="w-full md:w-auto bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Buscar
              </button>
            </motion.form>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto mt-16 p-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800"
        >
          Propiedades destacadas
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAlquileres.map((alquiler, index) => (
            <motion.div
              key={alquiler.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <img
                onClick={() => handleDetalle(alquiler.id)}
                src={alquiler.imagenes && alquiler.imagenes.length > 0 ? alquiler.imagenes[0].imagen : "https://via.placeholder.com/400x300"}
                alt={alquiler.titulo}
                className="w-full h-64 object-cover cursor-pointer"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{alquiler.titulo}</h3>
                <p className="text-gray-600 mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  {alquiler.ubicacion}
                </p>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span className="flex items-center"><FaBed className="mr-1 text-blue-500" /> {alquiler.num_habitaciones} hab</span>
                  <span className="flex items-center"><FaBath className="mr-1 text-blue-500" /> {alquiler.num_banos} baños</span>
                  <span className="flex items-center"><FaRuler className="mr-1 text-blue-500" /> {alquiler.superficie} m²</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-4">${alquiler.precio}/mes</p>
                <button
                  onClick={() => handleDetalle(alquiler.id)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Ver detalles
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default MainPage;