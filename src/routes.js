import Home from "./pages/home";
import Catalogo from "./pages/Catalogo";
import About from "./pages/About";
import Admin from "./pages/admin";
import Eventos from "./pages/eventos";
import Carrinho from "pages/Carrinho";
import Contato from "pages/Contato";
import Denuncia from "pages/Canaldenuncia";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ScrollToTop from "Components/ScrollToTop";
function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/denuncia" element={<Denuncia />} />
          {/* Rota protegida */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;