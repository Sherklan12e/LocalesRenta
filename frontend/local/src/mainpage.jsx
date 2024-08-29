import React from 'react';

const MainPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative bg-cover bg-center h-96" style={{ backgroundImage: `url('https://example.com/banner-image.jpg')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold">Encuentra tu hogar ideal</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 p-4">
        <form className="bg-white shadow-md rounded p-6">
          <div className="flex flex-col md:flex-row items-center">
            <input
              type="text"
              placeholder="Buscar por ubicación, tipo de propiedad..."
              className="w-full md:w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="mt-4 md:mt-0 md:ml-4 w-full md:w-auto bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Sección de propiedades */}
      <div className="max-w-6xl mx-auto mt-12 p-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Propiedades destacadas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Propiedad 1 */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src="https://example.com/property1.jpg" alt="Propiedad 1" className="w-full h-56 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold">Casa en la playa</h3>
              <p className="text-gray-600 mt-2">3 habitaciones • 2 baños • 150 m²</p>
              <p className="text-blue-600 font-bold mt-4">$1500/mes</p>
            </div>
          </div>

          {/* Propiedad 2 */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src="https://example.com/property2.jpg" alt="Propiedad 2" className="w-full h-56 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold">Apartamento en el centro</h3>
              <p className="text-gray-600 mt-2">2 habitaciones • 1 baño • 80 m²</p>
              <p className="text-blue-600 font-bold mt-4">$1200/mes</p>
            </div>
          </div>

          {/* Propiedad 3 */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src="https://example.com/property3.jpg" alt="Propiedad 3" className="w-full h-56 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold">Casa en las montañas</h3>
              <p className="text-gray-600 mt-2">4 habitaciones • 3 baños • 200 m²</p>
              <p className="text-blue-600 font-bold mt-4">$1800/mes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
