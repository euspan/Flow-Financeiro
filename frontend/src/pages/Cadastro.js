import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { cadastro } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    if (senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres'); return; }
    setCarregando(true);
    try {
      await cadastro(nome, email, senha);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao cadastrar');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={estilos.tela}>
      <div style={estilos.mascote}>🚀</div>
      <h1 style={estilos.logo}>Flow Financeiro</h1>
      <p style={estilos.tagline}>Sua jornada financeira começa aqui!</p>

      <div style={estilos.card}>
        <h2 style={estilos.titulo}>Criar conta gratuita 🌱</h2>

        {erro && <div style={estilos.erro}>{erro}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'SEU NOME', type: 'text', value: nome, set: setNome, placeholder: 'Ex: Maria Silva' },
            { label: 'E-MAIL', type: 'email', value: email, set: setEmail, placeholder: 'seu@email.com' },
            { label: 'SENHA (mín. 6 caracteres)', type: 'password', value: senha, set: setSenha, placeholder: '••••••••' },
          ].map((c) => (
            <div key={c.label} style={estilos.campo}>
              <label style={estilos.label}>{c.label}</label>
              <input type={c.type} placeholder={c.placeholder} value={c.value} onChange={(e) => c.set(e.target.value)} style={estilos.input} required />
            </div>
          ))}

          <button type="submit" style={estilos.botao} disabled={carregando}>
            {carregando ? 'Criando conta...' : 'CRIAR CONTA'}
          </button>
        </form>

        <p style={estilos.link}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: '#16a34a', fontWeight: 800 }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}

const estilos = {
  tela: { minHeight: '100vh', background: 'linear-gradient(160deg, #16a34a, #065f46)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Nunito', sans-serif" },
  mascote: { fontSize: 72, marginBottom: 8 },
  logo: { color: 'white', fontSize: 36, fontFamily: "'Fredoka One', cursive", marginBottom: 4 },
  tagline: { color: '#a7f3d0', fontSize: 14, marginBottom: 32 },
  card: { background: 'white', borderRadius: 24, padding: '32px 28px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  titulo: { fontSize: 22, fontWeight: 800, color: '#14532d', marginBottom: 24 },
  erro: { background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14, fontWeight: 600 },
  campo: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, fontWeight: 800, color: '#6b7280', marginBottom: 6, letterSpacing: 1 },
  input: { width: '100%', padding: '14px 16px', border: '2px solid #bbf7d0', borderRadius: 10, fontSize: 15, fontWeight: 600, fontFamily: "'Nunito', sans-serif", outline: 'none', boxSizing: 'border-box' },
  botao: { width: '100%', padding: 16, background: '#16a34a', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 1, boxShadow: '0 4px 0 #166534', fontFamily: "'Nunito', sans-serif", marginTop: 8 },
  link: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' },
};
