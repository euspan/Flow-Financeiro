import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configurar base URL do axios
const API_URL = process.env.REACT_APP_API_URL || '';
console.log('🔧 API_URL configurada:', API_URL); // Adiciona log para debug
axios.defaults.baseURL = API_URL;

// Criar o contexto
const AuthContext = createContext();

// Hook para usar o contexto em qualquer componente
export const useAuth = () => useContext(AuthContext);

// Provider: envolve toda a aplicação e disponibiliza os dados de autenticação
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Ao iniciar, verificar se há usuário salvo no localStorage
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('flowUsuario');
    if (usuarioSalvo) {
      const dados = JSON.parse(usuarioSalvo);
      setUsuario(dados);
      // Configurar o token padrão para todas as requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${dados.token}`;
    }
    setCarregando(false);
  }, []);

  // Função de login
  const login = async (email, senha) => {
    const { data } = await axios.post('/api/auth/login', { email, senha });
    localStorage.setItem('flowUsuario', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUsuario(data);
    return data;
  };

  // Função de cadastro
  const cadastro = async (nome, email, senha) => {
    const { data } = await axios.post('/api/auth/cadastro', { nome, email, senha });
    localStorage.setItem('flowUsuario', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUsuario(data);
    return data;
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('flowUsuario');
    delete axios.defaults.headers.common['Authorization'];
    setUsuario(null);
  };

  // Atualizar dados do usuário localmente (ex: após ganhar XP)
  const atualizarUsuario = (novosDados) => {
    const atualizado = { ...usuario, ...novosDados };
    localStorage.setItem('flowUsuario', JSON.stringify(atualizado));
    setUsuario(atualizado);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, cadastro, logout, atualizarUsuario, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}
