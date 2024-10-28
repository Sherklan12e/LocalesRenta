import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Video from '../../assets/video_login/casas.mp4';
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://sherklan.pythonanywhere.com/api/login/', {
                username,
                password
            });
    
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('username', username);
            localStorage.setItem('id', response.data.id);
            
            // Show success toast notification
            toast.success('¡Inicio de sesión exitoso!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
    
            setMessage('Login successful!');
            navigate('/');
            window.location.reload();
        } catch (error) {
            // Show error toast notification
            toast.error('Error al iniciar sesión. Por favor, verifica tus credenciales.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setMessage('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-100 p-6 overflow-hidden">
        <video
            autoPlay
            loop
            muted
            className="absolute z-0 w-full h-full object-cover"
        >
            <source src="https://videos.pexels.com/video-files/4301618/4301618-hd_1920_1080_30fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <div className="relative z-10 w-full max-w-sm bg-transparent bg-opacity-60 rounded-lg shadow-md p-10 backdrop-blur-md">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label htmlFor="username" className="block font-medium mb-2">Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block font-medium mb-2">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Login
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-center ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </div>
    </div>
    );
};

export default Login;
