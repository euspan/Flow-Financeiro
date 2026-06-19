// ── Layout component (shared navigation) ──────────────────────────────
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const xp = usuario?.xp || 0;
  const nivel = Math.floor(xp / 50) + 1;
  const sequencia = usuario?.sequencia || 0;

  const abas = [
    { path: '/', icon: '🏠', label: 'Início' },
    { path: '/dashboard', icon: '📊', label: 'Progresso' },
    { path: '/perfil', icon: '👤', label: 'Perfil' },
  ];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', fontFamily: "'Nunito', sans-serif", background: '#f0fdf4' }}>
      {/* Top bar */}
      <div style={ls.topBar}>
        <span style={ls.chip}>Nível {nivel}</span>
        <span style={ls.badge}>🔥 {sequencia}</span>
        <span style={ls.xpBadge}>⚡ {xp} XP</span>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '20px 20px 100px' }}>{children}</div>

      {/* Bottom nav */}
      <nav style={ls.nav}>
        {abas.map((aba) => {
          const ativa = location.pathname === aba.path;
          return (
            <button key={aba.path} onClick={() => navigate(aba.path)} style={{ ...ls.navBtn, background: ativa ? '#dcfce7' : 'none' }}>
              <span style={{ fontSize: 22 }}>{aba.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: ativa ? '#16a34a' : '#6b7280' }}>{aba.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

const ls = {
  topBar: { position: 'sticky', top: 0, zIndex: 50, background: 'white', borderBottom: '2px solid #bbf7d0', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  chip: { background: '#dcfce7', padding: '6px 12px', borderRadius: 20, fontWeight: 800, fontSize: 13, color: '#16a34a' },
  badge: { background: '#fff7ed', padding: '6px 12px', borderRadius: 20, fontWeight: 800, fontSize: 14, color: '#ea580c' },
  xpBadge: { background: '#fef9c3', padding: '6px 12px', borderRadius: 20, fontWeight: 800, fontSize: 14, color: '#ca8a04' },
  nav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: 'white', borderTop: '2px solid #bbf7d0', display: 'flex', justifyContent: 'space-around', padding: '10px 0 16px', zIndex: 100 },
  navBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', cursor: 'pointer', padding: '4px 16px', borderRadius: 12 },
};
