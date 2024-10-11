import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineMenu, AiOutlineClose, AiOutlineHome, AiOutlineUser, AiOutlinePlus, AiOutlineLogout } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [profile, setProfile] = useState(null);
    const [filterOptions, setFilterOptions] = useState({
        minPrice: "",
        maxPrice: "",
        location: "",
        propertyType: ""
    });
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('access_token');
    const location = useLocation();

    useEffect(() => {
        setProfileMenuOpen(false);
        setIsOpen(false);
    }, [location]);
    useEffect(() => {
        if (token) {
            axios.get(`http://127.0.0.1:8000/api/profile/${username}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => setProfile(response.data))
            .catch(error => console.error('Error fetching profile:', error));
        }
    }, [username, token]);

    const handleSearch = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams({
            q: searchQuery,
            min_price: filterOptions.minPrice,
            max_price: filterOptions.maxPrice,
            location: filterOptions.location,
            property_type: filterOptions.propertyType
        }).toString();
        navigate(`/search?${queryParams}`);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions(prev => ({ ...prev, [name]: value }));
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        setProfile(null);
        toast.success('Has cerrado sesión exitosamente', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        navigate('/');
    };

    return (
        <nav className="bg-color_turquesa6 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold flex items-center">
                    <AiOutlineHome className="mr-2" />
                    Rent
                </Link>
                <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                <div className="hidden md:flex items-center space-x-4 flex-grow justify-center">
                        <Link to="/Alquileres" className="text-white hover:text-gray-200 transition duration-300">Locales</Link>
                        <div className="relative flex items-center w-full max-w-xl">
                        <form onSubmit={handleSearch} className="flex items-center w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar..."
                            className="w-full px-4 py-2 rounded-l-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 border-r-0"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-r-full hover:bg-blue-600 transition duration-300 flex items-center">
                            <AiOutlineSearch className="text-xl size-6" />
                        </button>
                        </form>
                        <button 
                            onClick={() => setFilterMenuOpen(!isFilterMenuOpen)} 
                            className="ml-2 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition duration-300"
                        >
                            <FaFilter />
                        </button>
                        <AnimatePresence>
                            {isFilterMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-4 z-10 top-full"
                                >
                                    <div className="px-4 space-y-3">
                                        <input
                                            type="number"
                                            name="minPrice"
                                            value={filterOptions.minPrice}
                                            onChange={handleFilterChange}
                                            placeholder="Precio mínimo"
                                            className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                        <input
                                            type="number"
                                            name="maxPrice"
                                            value={filterOptions.maxPrice}
                                            onChange={handleFilterChange}
                                            placeholder="Precio máximo"
                                            className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                        <input
                                            type="text"
                                            name="location"
                                            value={filterOptions.location}
                                            onChange={handleFilterChange}
                                            placeholder="Ubicación"
                                            className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                        <select
                                            name="propertyType"
                                            value={filterOptions.propertyType}
                                            onChange={handleFilterChange}
                                            className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            <option value="">Tipo de propiedad</option>
                                            <option value="casa">Casa</option>
                                            <option value="apartamento">Apartamento</option>
                                            <option value="local">Local comercial</option>
                                        </select>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    {profile ? (
                        <div className="relative">
                            <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={profile.profile_picture}
                                alt="Profile"
                                className="w-10 h-10 rounded-full cursor-pointer border-white"
                                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                            />
                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10"
                                    >
                                        <Link to={`/profile/${username}`} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                            <AiOutlineUser className="inline-block mr-2" />
                                            Perfil
                                        </Link>
                                        <Link to="/publicar" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                            <AiOutlinePlus className="inline-block mr-2" />
                                            Publicar
                                        </Link>
                                        <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                                            <AiOutlineLogout className="inline-block mr-2" />
                                            Cerrar sesión
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:text-gray-200 transition duration-300">Iniciar sesión</Link>
                            <Link to="/register" className="bg-white text-blue-500 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-300">Registrarse</Link>
                        </>
                    )}
                </div>

                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-blue-600 mt-2 rounded-lg shadow-lg"
                    >
                        <Link to="/Alquileres" className="block py-2 px-4 text-white hover:bg-blue-700">Locales</Link>
                        <form onSubmit={handleSearch} className="px-4 py-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none"
                            />
                        </form>
                        {profile ? (
                            <>
                                <Link to={`/profile/${username}`} className="block py-2 px-4 text-white hover:bg-blue-700">Perfil</Link>
                                <Link to="/publicar" className="block py-2 px-4 text-white hover:bg-blue-700">Publicar</Link>
                                <button onClick={logout} className="block w-full text-left py-2 px-4 text-white hover:bg-blue-700">Cerrar sesión</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block py-2 px-4 text-white hover:bg-blue-700">Iniciar sesión</Link>
                                <Link to="/register" className="block py-2 px-4 text-white hover:bg-blue-700">Registrarse</Link>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;