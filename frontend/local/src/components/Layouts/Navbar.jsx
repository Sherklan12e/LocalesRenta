import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Actualización aquí

const Navbar = () => {
    const username = localStorage.getItem('username');
    const navigate = useNavigate(); // Actualización aquí

    const logout = () => {
        // Elimina los tokens del localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username'); // Eliminar el nombre de usuario si está almacenado

        // Redirige al usuario a la página de inicio de sesión
        navigate('/login'); // Actualización aquí
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <a href="/" className="text-xl font-bold">
                    Alquileres
                </a>
                <div className="hidden md:flex space-x-6">
                    <a href="/" className="hover:underline">Inicio</a>
                    <a href="/about" className="hover:underline">Nosotros</a>
                    <a href="/contact" className="hover:underline">Contacto</a>
                        {username ? (
                            <>
                                <a href='/'> {username}</a>
                                <p><Link to="/post">Post</Link></p>
                                <button onClick={logout}>Logout</button>
                            </>
                        ) : (
                            <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                </div>
                <div className="md:hidden">
                    <button className="text-white focus:outline-none">
                        {/* Icono de menú para dispositivos móviles */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
