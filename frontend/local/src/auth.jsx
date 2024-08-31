import axios from 'axios';

// Función para refrescar el token
export const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
        });
        localStorage.setItem('access_token', response.data.access);
        return response.data.access;
    } catch (error) {
        console.error('Error al refrescar el token:', error);
        return null;
    }
};

// Función para manejar la solicitud con lógica de refresco de token
export const apiRequestWithTokenRefresh = async (request) => {
    try {
        return await request();  // Intenta la solicitud original
    } catch (error) {
        if (error.response && error.response.status === 401) {  // Si el token expiró
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                return await request();  // Reintenta la solicitud con el nuevo token
            } else {
                // Redirigir al usuario al login si el token de refresco es inválido
                window.location.href = '/login';
            }
        } else {
            throw error;
        }
    }
};
