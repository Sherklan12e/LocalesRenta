import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai"; 
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const username = localStorage.getItem('username');
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const loggedIn = localStorage.getItem('loggedIn');
   

    const token = localStorage.getItem('access_token');
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    
    const showToastMessage = () => {
        toast.success("Success Notification !", {
          position: toast.POSITION.TOP_RIGHT,
        });
    };
    useEffect(() => {
        
        // Si está logueado y es la primera vez, mostramos el mensaje
        if (loggedIn === 'true') {
            toast.success('Bienvenido!', { position: 'top-right' });
            localStorage.removeItem('loggedIn');  // Lo removemos para que no se muestre nuevamente
        }else{
            console.log('a')
        }

        setIsLoggedIn(!!localStorage.getItem('access_token')); // Verificamos si hay un token
    }, []);
   
    useEffect(() => {
        if (!token){
            console.error("Token no encontrada perra , por favor logeate");
            return;
        }
       
        axios.get(`http://127.0.0.1:8000/api/profile/${username}/`,{
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })
        .then (response => {
            setProfile(response.data);
        }) 
        .catch(error => {
            console.log('error al perdir fecht', error)
            setProfile(null)
        });

    }, [username])

    const toggleProfileMenu = () => {
        setProfileMenuOpen(!isProfileMenuOpen);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        setProfile(null); 
        navigate('/login');
    };
    const handleSearch = (e) => {
        e.preventDefault();
        // Manejar la búsqueda, por ejemplo, redirigiendo a una página de resultados
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }; 
    
    
    if(loggedIn){
        showToastMessage
       
    }

    return (
        <>     
        <nav className="bg-black p-4 relative">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-white text-xl font-bold">
                    <Link to="/">Rent</Link>
                   
                </div>
                
                <ToastContainer />
                <div className="hidden md:flex space-x-6">
                    <Link to="/Alquileres" className="text-white hover:text-gray-300">Locales</Link>
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="px-2 py-1 h-9 rounded-lg text-black placeholder-gray-400"
                        />
                        <button type="submit" className="absolute right-2">
                            <AiOutlineSearch className="text-white text-xl" />
                        </button>
                    </form>
                </div>
                {/* Profile/Sign in */}
                <div className="flex items-center space-x-4">
                    {profile ? (
                        <>
                            <div className="relative">
                                <img
                                    src={profile.profile_picture}
                                    alt="profile"
                                    className="w-10 h-10 rounded-full border-1 border-white cursor-pointer"
                                    onClick={toggleProfileMenu}
                                />
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-10">
                                        <Link to={`/profile/${username}/`} className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
                                        <Link to="/publicar" className="block w-full text-left px-4 py-2 hover:bg-gray-200">Publicar</Link>
                                        <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
                                    </div>
                                )}
                            </div>
                            <Link to="/post" className="text-white hover:text-gray-300">Post</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
                            <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={toggleMenu}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-4 bg-blue-600">
                    <Link to="/" className="block py-2 px-4 text-white hover:bg-blue-500">Home</Link>
                    <Link to="/about" className="block py-2 px-4 text-white hover:bg-blue-500">About</Link>
                    <Link to="/contact" className="block py-2 px-4 text-white hover:bg-blue-500">Contact</Link>
                    {username ? (
                        <>
                            <Link to="/profile" className="block py-2 px-4 text-white hover:bg-blue-500">Profile</Link>
                            <button onClick={logout} className="block w-full py-2 px-4 text-left text-white hover:bg-blue-500">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block py-2 px-4 text-white hover:bg-blue-500">Login</Link>
                            <Link to="/register" className="block py-2 px-4 text-white hover:bg-blue-500">Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
        </>
    );
};

export default Navbar;
