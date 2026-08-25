import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import Navbar from './components/Navbar';
import RutaProtegida from './components/RutaProtegida';

import Home from './pages/publico/Home';
import Login from './pages/publico/Login';
import Registro from './pages/publico/Registro';
import Catalogo from './pages/publico/Catalogo';

import Carrito from './pages/cliente/Carrito';
import MisPedidos from './pages/cliente/MisPedidos';

import AdminLayout from './pages/admin/AdminLayout';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import Socios from './pages/admin/Socios';
import Membresias from './pages/admin/Membresias';
import Pagos from './pages/admin/Pagos';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import OrdenesAdmin from './pages/admin/OrdenesAdmin';

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/catalogo" element={<Catalogo />} />

            <Route
              path="/carrito"
              element={
                <RutaProtegida rolRequerido="cliente">
                  <Carrito />
                </RutaProtegida>
              }
            />
            <Route
              path="/mis-pedidos"
              element={
                <RutaProtegida rolRequerido="cliente">
                  <MisPedidos />
                </RutaProtegida>
              }
            />

            <Route
              path="/admin"
              element={
                <RutaProtegida rolRequerido="administrador">
                  <AdminLayout />
                </RutaProtegida>
              }
            >
              <Route index element={<DashboardAdmin />} />
              <Route path="socios" element={<Socios />} />
              <Route path="membresias" element={<Membresias />} />
              <Route path="pagos" element={<Pagos />} />
              <Route path="productos" element={<ProductosAdmin />} />
              <Route path="ordenes" element={<OrdenesAdmin />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}
