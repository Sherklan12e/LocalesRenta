import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Usuarios/Login';
import Register from './components/Usuarios/Register';
import Home from './mainpage';
import Navbar from './components/Layouts/Navbar';
import Footer from './components/Layouts/Footer';
import Post from './components/post/Post';
// import PrivateRoute from './PrivateRoute';
// import ProtectedComponent from './ProtectedComponent';

function App() {
  return (
      <Router>
        <Navbar />
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register/>} />
              < Route path="/" element={<Home/>} />
              <Route path="/post" element={<Post/>} />
              {/* <Route path="/protected" element={<PrivateRoute component={ProtectedComponent} />} /> */}
              {/* Define otras rutas aquí */}
          </Routes>
          <Footer/>
      </Router>
  );
}

export default App;

