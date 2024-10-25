import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

const SearchResults = () => {
    const [results, setResults] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');
    const minPrice = queryParams.get('minPrice');
    const maxPrice = queryParams.get('maxPrice');
    const locationFilter = queryParams.get('location');
    const propertyType = queryParams.get('propertyType');
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('access_token');
                let url = `https://sherklan.pythonanywhere.com/alquiler/search/?q=${query || ''}`;
                if (minPrice) url += `&min_price=${minPrice}`;
                if (maxPrice) url += `&max_price=${maxPrice}`;
                if (locationFilter) url += `&location=${locationFilter}`;
                if (propertyType) url += `&property_type=${propertyType}`;
    
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };
    
        fetchResults();
    }, [query, minPrice, maxPrice, locationFilter, propertyType]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Resultados de búsqueda para: {query}</h2>
            {results.length === 0 ? (
                <p>No se encontraron resultados.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {results.map(alquiler => (
                        <div key={alquiler.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                            <img 
                                src={alquiler.imagenes[0]?.imagen || "https://via.placeholder.com/300x200"} 
                                alt={alquiler.titulo} 
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{alquiler.titulo}</h3>
                                <p className="text-gray-600 mb-2">{alquiler.ubicacion}</p>
                                <p className="text-green-600 font-bold">${alquiler.precio}</p>
                                <Link to={`/detalle-alquiler/${alquiler.id}`} className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded">
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;