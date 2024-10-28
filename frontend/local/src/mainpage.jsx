import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBed, FaBath, FaRuler, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { Typewriter } from 'react-simple-typewriter';
import { useDarkMode } from './contexts/DarkModeContext';
import ImageS from './assets/images/pexels-binyaminmellish-106399.jpg'
const MainPage = () => {
  const { darkMode } = useDarkMode();
  const [alquileres, setAlquileres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlquileres = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/alquiler/alquileres/view/');
        setAlquileres(response.data);
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

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-cover bg-center h-screen"
        style={{ backgroundImage: `url('${ImageS}')` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-center  ` }>
            <h1 className="text-5xl md:text-7xl text-white font-bold mb-6">
              Encuentra tu{' '}
              <span className="text-color_turquesa1">
                <Typewriter
                  words={['hogar ideal', 'departamento', 'local', 'piso']}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </span>
            </h1>
            <motion.form
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4"
            >
              <input
                type="text"
                placeholder="Buscar por ubicación, tipo de propiedad..."
                className={ `w-full md:w-96 p-4 ${darkMode ? 'bg-color_turquesa9 text-white ' : 'bg-white  text-black'} rounded-lg focus:outline-none focus:ring-2 focus:ring-color_turquesa1 shadow-md`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="w-full md:w-auto bg-color_turquesa6 text-white p-4 rounded-lg hover:bg-color_turquesa1 transition duration-300 flex items-center justify-center shadow-md"
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
          className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
        >
          Propiedades destacadas
        </motion.h2>

        <Slider {...settings}>
          {alquileres.map((alquiler) => (
            <motion.div
              key={alquiler.id}
              className={`mx-4 p-2 border rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <img
                  onClick={() => handleDetalle(alquiler.id)}
                  src={alquiler.imagenes && alquiler.imagenes.length > 0 ? alquiler.imagenes[0].imagen : "https://via.placeholder.com/400x300"}
                  alt={alquiler.titulo}
                  className="w-full h-64 object-cover cursor-pointer rounded-t-lg transition-transform duration-300 hover:scale-110"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{alquiler.titulo}</h3>
                  <p className="text-gray-600 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    {alquiler.ubicacion}
                  </p>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <FaBed className="mr-1 text-blue-500" /> {alquiler.num_habitaciones} hab
                    </span>
                    <span className="flex items-center">
                      <FaBath className="mr-1 text-blue-500" /> {alquiler.num_banos} baños
                    </span>
                    <span className="flex items-center">
                      <FaRuler className="mr-1 text-blue-500" /> {alquiler.superficie} m²
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">${alquiler.precio}/mes</p>
                  <button
                    onClick={() => handleDetalle(alquiler.id)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MainPage;
