import React, { useState } from 'react';
import axios from 'axios';
import { apiRequestWithTokenRefresh } from '../../auth';
import { useNavigate } from 'react-router-dom';

const CrearAlquiler = () => {
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
        imagen: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else if (name === 'imagen') {
            setFormData({
                ...formData,
                [name]: files[0]
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
            data.append(key, formData[key]);
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
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Crear Nuevo Alquiler</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Título"
                    className="border rounded-md px-4 py-2 w-full"
                    required
                />
                <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción"
                    className="border rounded-md px-4 py-2 w-full h-24"
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        placeholder="Precio"
                        className="border rounded-md px-4 py-2 w-full"
                        required
                    />
                    <input
                        type="text"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        placeholder="Ubicación"
                        className="border rounded-md px-4 py-2 w-full"
                        required
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="number"
                        name="superficie"
                        value={formData.superficie}
                        onChange={handleChange}
                        placeholder="Superficie (m²)"
                        className="border rounded-md px-4 py-2 w-full"
                        required
                    />
                    <input
                        type="number"
                        name="num_habitaciones"
                        value={formData.num_habitaciones}
                        onChange={handleChange}
                        placeholder="Habitaciones"
                        className="border rounded-md px-4 py-2 w-full"
                        required
                    />
                    <input
                        type="number"
                        name="num_banos"
                        value={formData.num_banos}
                        onChange={handleChange}
                        placeholder="Baños"
                        className="border rounded-md px-4 py-2 w-full"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="num_garajes"
                        value={formData.num_garajes}
                        onChange={handleChange}
                        placeholder="Garajes"
                        className="border rounded-md px-4 py-2 w-full"
                    />
                    <input
                        type="number"
                        name="ano_construccion"
                        value={formData.ano_construccion}
                        onChange={handleChange}
                        placeholder="Año de construcción"
                        className="border rounded-md px-4 py-2 w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="tiene_balcon"
                            checked={formData.tiene_balcon}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Tiene Balcón
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="tiene_patio"
                            checked={formData.tiene_patio}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Tiene Patio
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="amueblado"
                            checked={formData.amueblado}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Amueblado
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <select
                        name="tipo_propiedad"
                        value={formData.tipo_propiedad}
                        onChange={handleChange}
                        className="border rounded-md px-4 py-2 w-full"
                    >
                        <option value="">Tipo de propiedad</option>
                        <option value="casa">Casa</option>
                        <option value="departamento">Departamento</option>
                        <option value="chalet">Chalet</option>
                        <option value="duplex">Dúplex</option>
                        <option value="piso">Piso</option>
                    </select>

                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="border rounded-md px-4 py-2 w-full"
                        required
                    >
                        <option value="">Selecciona un país</option>
                        <option value="AR">Argentina</option>
                        <option value="BR">Brasil</option>
                        <option value="CL">Chile</option>
                    </select>
                </div>

                <input
                    type="file"
                    name="imagen"
                    onChange={handleChange}
                    className="border rounded-md px-4 py-2 w-full"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600"
                >
                    Crear Alquiler
                </button>
            </form>
        </div>
    );
};

export default CrearAlquiler;
