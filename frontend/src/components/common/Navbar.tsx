import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogIn, LogOut } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="w-full px-4 sm:px-8 navbar-inner">
        <Link to="/" className="navbar-brand flex items-center gap-3">
          <img src="/logomajapahit.png" alt="Logo Silsilah" className="h-9 w-9 object-contain" />
          <span className="text-lime-900 font-bold tracking-tight">Silsilah Keluarga</span>
        </Link>

        <ul className="navbar-nav">
          <li>
            <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
              Beranda
            </Link>
          </li>
          <li>
            <Link to="/tree" className={`navbar-link ${isActive('/tree') ? 'active' : ''}`}>
              Pohon Silsilah
            </Link>
          </li>
          <li>
            <Link to="/members" className={`navbar-link ${isActive('/members') ? 'active' : ''}`}>
              Anggota
            </Link>
          </li>

          {isAuthenticated && user?.role === 'ADMIN' && (
            <li>
              <Link to="/admin" className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}>
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
