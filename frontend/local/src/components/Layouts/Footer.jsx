import React from 'react';
import { motion } from 'framer-motion';
const Footer = () => {
  return (
 
      <div className="bg-blue-600 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Amplia selección", description: "Miles de propiedades para elegir" },
              { title: "Proceso sencillo", description: "Búsqueda y alquiler sin complicaciones" },
              { title: "Soporte 24/7", description: "Estamos aquí para ayudarte en todo momento" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Footer;
