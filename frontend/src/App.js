import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Páginas
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Perfil from './pages/Perfil';
import Dashboard from './pages/Dashboard';

// Rota protegida: redireciona para login se não estiver autenticado
function RotaPrivada({ children }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return <div style={{ textAlign: 'center', marginTop: 80, fontSize: 40 }}>🌱</div>;
  return usuario ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas privadas (precisam de login) */}
        <Route path="/" element={<RotaPrivada><Home /></RotaPrivada>} />
        <Route path="/quiz/:id" element={<RotaPrivada><Quiz /></RotaPrivada>} />
        <Route path="/perfil" element={<RotaPrivada><Perfil /></RotaPrivada>} />
        <Route path="/dashboard" element={<RotaPrivada><Dashboard /></RotaPrivada>} />

        {/* Qualquer rota desconhecida → início */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
