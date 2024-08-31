import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListaAlquileres = () => {
    const [alquileres, setAlquileres] = useState([]);

    useEffect(() => {
        const fetchAlquileres = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/alquiler/alquileres/view/');
                setAlquileres(response.data);
            } catch (error) {
                console.error('Error al obtener los alquileres:', error);
            }
        };

        fetchAlquileres();
    }, []);

    return (
        <div>
            <h2>Lista de Alquileres</h2>
            <ul>
                {alquileres.map(alquiler => (
                    <li key={alquiler.id}>
                        <h3>{alquiler.titulo}</h3>
                        <p>{alquiler.descripcion}</p>
                        <p>Precio: {alquiler.precio}</p>
                        <p>Ubicación: {alquiler.ubicacion}</p>
                        <p>Superficie: {alquiler.superficie} m²</p>
                        <p>País: {alquiler.country}</p>
                        {alquiler.imagen && <img src={`http://localhost:8000${alquiler.imagen}`} alt={alquiler.titulo} />}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListaAlquileres;
