import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [alquileres, setAlquileres] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAlquileres = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/alquiler/alquileres/view/'); // Cambia la URL según tu configuración
        setAlquileres(response.data);
      } catch (error) {
        console.error('Error fetching alquileres:', error);
      }
    };

    fetchAlquileres();
  }, []);

  const handleDetalle = (id) => {
    navigate(`/detalle-alquiler/${id}`)
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className="relative bg-cover brightness-50 bg-no-repeat bg-center h-lvh"
        style={{ backgroundImage: `url('https://i.pinimg.com/originals/28/eb/eb/28ebeb4cbc97ee8671d9fb275549fcf0.jpg')` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold">Encuentra tu hogar ideal</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 p-4">
        <form className=" rounded p-6">
          <input
            type="text"
            placeholder="Buscar por ubicación, tipo de propiedad..."
            className="w-full md:w-2/3 p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="mt-4 md:mt-0 md:ml-4 w-full md:w-auto bg-black text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Sección de propiedades */}
      <div className="max-w-6xl mx-auto mt-12 p-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Propiedades destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {alquileres.slice(0, 3).map(alquiler => (
            
            <div key={alquiler.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              
              <img
              onClick={() => handleDetalle(alquiler.id)} 
                src={alquiler.imagenes[0].imagen }
                alt={alquiler.titulo}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{alquiler.titulo}</h3>
                <p className="text-gray-600 mt-2">
                  {alquiler.num_habitaciones} habitaciones • {alquiler.num_banos} baños • {alquiler.superficie} m²
                </p>
                <p className="text-blue-600 font-bold mt-4">${alquiler.precio}/mes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
