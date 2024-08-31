import React, { useState } from 'react';
import axios from 'axios';
import { apiRequestWithTokenRefresh } from '../../auth';
<<<<<<< HEAD
const CrearAlquiler = () => {
=======
import { useNavigate } from 'react-router-dom';
const CrearAlquiler = () => {
    const navigate = useNavigate();
>>>>>>> f47f790 (a)
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        precio: '',
        ubicacion: '',
        superficie: '',
        country: '',
        imagen: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imagen') {
            setFormData({
                ...formData,
                [name]: files[0] // Handle file input
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

        const token = localStorage.getItem('access_token');
        const data = new FormData();
        data.append('titulo', formData.titulo);
        data.append('descripcion', formData.descripcion);
        data.append('precio', formData.precio);
        data.append('ubicacion', formData.ubicacion);
        data.append('superficie', formData.superficie);
        data.append('country', formData.country);
        if (formData.imagen) data.append('imagen', formData.imagen);

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
<<<<<<< HEAD
=======
            navigate('/Alquileres');
>>>>>>> f47f790 (a)
        } catch (error) {
            console.error('Error al crear el alquiler:', error.response ? error.response.data : error);
        }
    
};

return (
    <form onSubmit={handleSubmit}>
        <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Título"
        />
        <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
        />
        <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="Precio"
        />
        <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Ubicación"
        />
        <input
            type="number"
            name="superficie"
            value={formData.superficie}
            onChange={handleChange}
            placeholder="Superficie"
        />
        <select name="country" onChange={handleChange} required>
            <option value="">Selecciona un país</option>
            <option value="AR">Argentina</option>
            <option value="BR">Brasil</option>
            <option value="CL">Chile</option>
            {/* Agrega más países según sea necesario */}
        </select>
        <input
            type="file"
            name="imagen"
            onChange={handleChange}
        />
        <button type="submit">Crear Alquiler</button>
    </form>
);
};

export default CrearAlquiler;
