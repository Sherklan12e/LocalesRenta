import React, { Suspense, lazy } from 'react';
import './css/index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Usuarios/Login';
import Register from './components/Usuarios/Register';
import Home from './mainpage';
import Navbar from './components/Layouts/Navbar';
import Footer from './components/Layouts/Footer';
import Post from './components/post/Post'


const ListaAlquileres = lazy(() => import('./components/publicaciones/ListaAlquiler'));
import LoadingSpinner from './components/publicaciones/LoadingSpinner';
import CrearPublicacion from './components/publicaciones/CrearAlquiler';
import EditarAlquiler from './components/publicaciones/EditarAlquiler';
import DetalleAlquiler from './components/publicaciones/DetallesAlquiler';
import Profile from './components/Usuarios/Profile';
import EditProfile from './components/Usuarios/EditarProfile';
import SearchResults from './components/publicaciones/SearchResults';
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
        <Route path="/Alquileres" element={<Suspense fallback={<LoadingSpinner />}><ListaAlquileres /></Suspense>} />
        <Route path="/editar-alquiler/:id" element={<EditarAlquiler />} />
        <Route path="/detalle-alquiler/:id" element={<DetalleAlquiler />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile/:username/edit" element={<EditProfile />} />
        <Route path="/edi" element={<EditProfile/>} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;