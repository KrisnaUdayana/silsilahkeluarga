import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { TreePine, Users, Home, LogIn, LogOut, Settings } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <TreePine size={28} className="text-lime-900" />
          <span className="text-lime-900">Silsilah Keluarga</span>
        </Link>

        <ul className="navbar-nav">
          <li>
            <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
              <Home size={18} />
              Beranda
            </Link>
          </li>
          <li>
            <Link to="/tree" className={`navbar-link ${isActive('/tree') ? 'active' : ''}`}>
              <TreePine size={18} />
              Pohon Silsilah
            </Link>
          </li>
          <li>
            <Link to="/members" className={`navbar-link ${isActive('/members') ? 'active' : ''}`}>
              <Users size={18} />
              Anggota
            </Link>
          </li>

          {isAuthenticated && user?.role === 'ADMIN' && (
            <li>
              <Link to="/admin" className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}>
                <Settings size={18} />
                Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button type="button" className="btn btn-ghost" onClick={logout}>
              <LogOut size={18} />
              Keluar
            </button>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">
              <LogIn size={18} />
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
