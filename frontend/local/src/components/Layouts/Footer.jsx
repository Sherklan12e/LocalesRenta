import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-12">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Alquileres. Todos los derechos reservados.</p>
        <div className="mt-4 space-x-4">
          <a href="/privacy" className="hover:underline">Política de Privacidad</a>
          <a href="/terms" className="hover:underline">Términos de Servicio</a>
          <a href="/contact" className="hover:underline">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
