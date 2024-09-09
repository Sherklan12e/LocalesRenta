import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditarAlquiler = () => {

    const [alquiler, setAlquiler] = useState(null);
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
        imagenes: [],  // Lista de imágenes actuales
        eliminarImagenes: [] 
    });
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchAlquiler = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/alquiler/alquileres/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Agrega el token JWT a la cabecera
                    }
                });
                setAlquiler(response.data);
                const alquilerData = response.data;
                setAlquiler(alquilerData);
                setFormData({
                    titulo: response.data.titulo,
                    descripcion: response.data.descripcion,
                    precio: response.data.precio,
                    ubicacion: response.data.ubicacion,
                    superficie: response.data.superficie,
                    num_habitaciones: response.data.num_habitaciones,
                    num_banos: response.data.num_banos,
                    num_garajes: response.data.num_garajes,
                    tiene_balcon: response.data.tiene_balcon,
                    tiene_patio: response.data.tiene_patio,
                    amueblado: response.data.amueblado,
                    ano_construccion: response.data.ano_construccion,
                    tipo_propiedad: response.data.tipo_propiedad,
                    wifi: response.data.wifi,
                    calefaccion: response.data.calefaccion,
                    aire_acondicionado: response.data.aire_acondicionado,
                    piscina: response.data.piscina,
                    mascotas_permitidas: response.data.mascotas_permitidas,
                    country: response.data.country,
                    imagenes: alquilerData.imagenes.map(img => img.imagen) // Si quieres manejar imágenes, puedes añadir la lógica aquí
                    
                });
            } catch (error) {
                console.error('Error al obtener la publicación:', error);
            }
        };

        fetchAlquiler();
    }, [id, token]);
    
    const handleRemoveImage = (index) => {
        const updatedImages = [...formData.imagenes];
        const imageToRemove = updatedImages.splice(index, 1)[0];
        
        // Si la imagen tiene un ID, se añade a la lista de imágenes a eliminar
        if (imageToRemove.id) {
            setFormData(prevState => ({
                ...prevState,
                eliminarImagenes: [...(prevState.eliminarImagenes || []), imageToRemove.id]
            }));
        }
        
        // Actualiza el estado
        setFormData(prevState => ({
            ...prevState,
            imagenes: updatedImages
        }));
    };
    
    
    
    
    
    
    
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'imagenes') {
                for (const file of formData[key]) {
                    data.append('imagenes', file);
                }
            } else if (key === 'eliminarImagenes') {
                data.append('eliminar_imagenes', JSON.stringify(formData[key])); // Convertir a JSON
            } else {
                data.append(key, formData[key]);
            }
        });
    
        try {
            await axios.put(`http://127.0.0.1:8000/alquiler/alquileres/${id}/`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            navigate('/Alquileres');
        } catch (error) {
            console.error('Error al actualizar la publicación:', error);
        }
    };
    if (!alquiler) return <p>Cargando...</p>;
   
    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">Editar Publicación</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Título</label>
                    <input
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        className="form-input mt-1 block w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        className="form-textarea mt-1 block w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        className="form-input mt-1 block w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Ubicación</label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        className="form-input mt-1 block w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Superficie</label>
                    <input
                        type="number"
                        name="superficie"
                        value={formData.superficie}
                        onChange={handleChange}
                        className="form-input mt-1 block w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Número de Habitaciones</label>
                    <input
                        type="number"
                        name="num_habitaciones"
                        value={formData.num_habitaciones}
                        onChange={handleChange}
                        className="form-input mt-1 block w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Número de Baños</label>
                    <input
                        type="number"
                        name="num_banos"
                        value={formData.num_banos}
                        onChange={handleChange}
                        className="form-input mt-1 block w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Número de Garajes</label>
                    <input
                        type="number"
                        name="num_garajes"
                        value={formData.num_garajes}
                        onChange={handleChange}
                        className="form-input mt-1 block w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Año de Construcción</label>
                    <input
                        type="number"
                        name="ano_construccion"
                        value={formData.ano_construccion}
                        onChange={handleChange}
                        className="form-input mt-1 block w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Propiedad</label>
                    <select
                        name="tipo_propiedad"
                        value={formData.tipo_propiedad}
                        onChange={handleChange}
                        className="form-select mt-1 block w-full"
                    >
                        <option value="casa">Casa</option>
                        <option value="departamento">Departamento</option>
                        <option value="chalet">Chalet</option>
                        <option value="duplex">Dúplex</option>
                        <option value="piso">Piso</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Wi-Fi</label>
                    <input
                        type="checkbox"
                        name="wifi"
                        checked={formData.wifi}
                        onChange={handleChange}
                        className="form-checkbox mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Calefacción</label>
                    <input
                        type="checkbox"
                        name="calefaccion"
                        checked={formData.calefaccion}
                        onChange={handleChange}
                        className="form-checkbox mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Aire Acondicionado</label>
                    <input
                        type="checkbox"
                        name="aire_acondicionado"
                        checked={formData.aire_acondicionado}
                        onChange={handleChange}
                        className="form-checkbox mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Piscina</label>
                    <input
                        type="checkbox"
                        name="piscina"
                        checked={formData.piscina}
                        onChange={handleChange}
                        className="form-checkbox mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Mascotas Permitidas</label>
                    <input
                        type="checkbox"
                        name="mascotas_permitidas"
                        checked={formData.mascotas_permitidas}
                        onChange={handleChange}
                        className="form-checkbox mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Balcon</label>
                    <input
                        type="checkbox"
                        name="tiene_balcon"
                        checked={formData.tiene_balcon}
                        onChange={handleChange}
                        className="form-checkbox mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Patio</label>
                    <input
                        type="checkbox"
                        name="tiene_patio"
                        checked={formData.tiene_patio}
                        onChange={handleChange}
                        className="form-checkbox mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Imágenes</label>
                    <input
                        type="file"
                        name="imagenes"
                        onChange={handleChange}
                        multiple
                        className="form-input mt-1 block w-full"
                    />
                    {formData.imagenes.map((imagen, index) => (
                        <div key={index} className="mb-4">
                            <img src={imagen} alt={`Imagen ${index + 1}`} className="h-24 w-24 object-cover" />
                            <button type="button" onClick={() => handleRemoveImage(index)} className="ml-2 p-2 bg-red-500 text-white">
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Actualizar Alquiler
                </button>
            </form>
        </div>
    );
};

export default EditarAlquiler;
