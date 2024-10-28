import React, { Suspense, lazy ,useEffect} from 'react';
import './css/index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/publicaciones/LoadingSpinner';
import { DarkModeProvider } from './contexts/DarkModeContext';


// Importar componentes de forma diferida
const Login = lazy(() => import('./components/Usuarios/Login'));
const Register = lazy(() => import('./components/Usuarios/Register'));
const Home = lazy(() => import('./mainpage'));
const Navbar = lazy(() => import('./components/Layouts/Navbar'));
const Footer = lazy(() => import('./components/Layouts/Footer'));
const Post = lazy(() => import('./components/post/Post'));
const ListaAlquileres = lazy(() => import('./components/publicaciones/ListaAlquiler'));
const CrearPublicacion = lazy(() => import('./components/publicaciones/CrearAlquiler'));
const EditarAlquiler = lazy(() => import('./components/publicaciones/EditarAlquiler'));
const DetalleAlquiler = lazy(() => import('./components/publicaciones/DetallesAlquiler'));
const Profile = lazy(() => import('./components/Usuarios/Profile'));
const EditProfile = lazy(() => import('./components/Usuarios/EditarProfile'));
const SearchResults = lazy(() => import('./components/publicaciones/SearchResults'));
const ChatInterface = lazy(() => import('./components/Chat/ChatInterface'));


function App() {
  return (
    <DarkModeProvider> 
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
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
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/profile/:username/edit" element={<EditProfile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/chat/:username" element={< ChatInterface />} />
        </Routes>
        <Footer />
      </Suspense>
    </Router>
    </DarkModeProvider>
  );
}

export default App;