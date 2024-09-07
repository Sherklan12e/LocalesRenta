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
        imagenes: []
    });

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
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Crear Alquiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campos del formulario */}
                <div className="flex flex-col">
                    <label htmlFor="titulo" className="mb-2 text-gray-600 font-semibold">Título</label>
                    <input
                        id="titulo"
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        placeholder="Título"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="descripcion" className="mb-2 text-gray-600 font-semibold">Descripción</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        placeholder="Descripción"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="precio" className="mb-2 text-gray-600 font-semibold">Precio</label>
                    <input
                        id="precio"
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        placeholder="Precio"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="ubicacion" className="mb-2 text-gray-600 font-semibold">Ubicación</label>
                    <input
                        id="ubicacion"
                        type="text"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        placeholder="Ubicación"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="superficie" className="mb-2 text-gray-600 font-semibold">Superficie (m²)</label>
                    <input
                        id="superficie"
                        type="number"
                        name="superficie"
                        value={formData.superficie}
                        onChange={handleChange}
                        placeholder="Superficie (m²)"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="num_habitaciones" className="mb-2 text-gray-600 font-semibold">Número de habitaciones</label>
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
                <div className="flex flex-col">
                    <label htmlFor="num_banos" className="mb-2 text-gray-600 font-semibold">Número de baños</label>
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
                <div className="flex flex-col">
                    <label htmlFor="num_garajes" className="mb-2 text-gray-600 font-semibold">Número de garajes</label>
                    <input
                        id="num_garajes"
                        type="number"
                        name="num_garajes"
                        value={formData.num_garajes}
                        onChange={handleChange}
                        placeholder="Número de garajes"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="col-span-2 flex flex-col space-y-2">
                    <label className="text-gray-600 font-semibold">Características</label>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="tiene_balcon"
                                checked={formData.tiene_balcon}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Tiene balcón</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="tiene_patio"
                                checked={formData.tiene_patio}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Tiene patio</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="amueblado"
                                checked={formData.amueblado}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Amueblado</span>
                        </label>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="ano_construccion" className="mb-2 text-gray-600 font-semibold">Año de construcción</label>
                    <input
                        id="ano_construccion"
                        type="number"
                        name="ano_construccion"
                        value={formData.ano_construccion}
                        onChange={handleChange}
                        placeholder="Año de construcción"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="tipo_propiedad" className="mb-2 text-gray-600 font-semibold">Tipo de propiedad</label>
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
                </div>
                <div className="col-span-2 flex flex-col space-y-2">
                    <label className="text-gray-600 font-semibold">Servicios adicionales</label>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="wifi"
                                checked={formData.wifi}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Wi-Fi disponible</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="calefaccion"
                                checked={formData.calefaccion}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Calefacción</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="aire_acondicionado"
                                checked={formData.aire_acondicionado}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Aire acondicionado</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="piscina"
                                checked={formData.piscina}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Piscina</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="mascotas_permitidas"
                                checked={formData.mascotas_permitidas}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="ml-2 text-gray-700">Mascotas permitidas</span>
                        </label>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="country" className="mb-2 text-gray-600 font-semibold">País</label>
                    <input
                        id="country"
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="País"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="imagenes" className="mb-2 text-gray-600 font-semibold">Imágenes</label>
                    <input
                        id="imagenes"
                        type="file"
                        name="imagenes"
                        multiple
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                </div>
            </div>
            <button
                type="submit"
                className="mt-6 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Publicar alquiler
            </button>
        </form>

    );
};

export default CrearAlquiler;
