import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Usuarios/Login';
import Register from './components/Usuarios/Register';
import Home from './mainpage';
import Navbar from './components/Layouts/Navbar';
import Footer from './components/Layouts/Footer';
import Post from './components/post/Post';
import ListaAlquileres from './components/publicaciones/ListaAlquiler';
<<<<<<< HEAD
// import PrivateRoute from './PrivateRoute';
// import ProtectedComponent from './ProtectedComponent';
import CrearPublicacion from './components/publicaciones/CrearAlquiler';
function App() {
  return (
      <Router>
        <Navbar />
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register/>} />
              < Route path="/" element={<Home/>} />
              <Route path="/post" element={<Post/>} />
              <Route path="/publicar" element={<CrearPublicacion/>} />
              <Route path="/Alquileres" element={<ListaAlquileres/>} />
              {/* <Route path="/protected" element={<PrivateRoute component={ProtectedComponent} />} /> */}
              {/* Define otras rutas aquí */}
          </Routes>
          <Footer/>
      </Router>
=======
import CrearPublicacion from './components/publicaciones/CrearAlquiler';
import EditarAlquiler from './components/publicaciones/EditarAlquiler';
import DetalleAlquiler from './components/publicaciones/DetallesAlquiler';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/publicar" element={<CrearPublicacion />} />
        <Route path="/Alquileres" element={<ListaAlquileres />} />
        <Route path="/editar-alquiler/:id" element={<EditarAlquiler />} />
        <Route path="/detalle-alquiler/:id" element={<DetalleAlquiler />} />
        {/* Define otras rutas aquí */}
      </Routes>
      <Footer />
    </Router>
>>>>>>> f47f790 (a)
  );
}

export default App;
<<<<<<< HEAD

=======
>>>>>>> f47f790 (a)
