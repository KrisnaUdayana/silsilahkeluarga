import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import '../knowledge/knowledge.css';

export function SiteHeader() {
  const { pathname, hash } = useLocation();
  const menu = useRef<HTMLDetailsElement>(null);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname, hash]);

  const links = <>
    <NavLink to="/" end>Beranda</NavLink>
    <NavLink to="/pengetahuan">Sejarah &amp; Tradisi</NavLink>
    <NavLink to="/tree">Silsilah</NavLink>
    <NavLink to="/members">Anggota</NavLink>
    {isAuthenticated && user?.role === 'ADMIN' && <NavLink to="/admin">Admin</NavLink>}
    {isAuthenticated
      ? <button className="k-header-logout" type="button" onClick={() => {
        if (menu.current) menu.current.open = false;
        logout();
      }}>Keluar</button>
      : <NavLink to="/login">Masuk</NavLink>}
  </>;

  return <div className="knowledge k-header-shell">
    <a className="k-skip" href="#isi">Langsung ke isi</a>
    <header className="k-header k-width">
      <Link className="k-brand" to="/">
        <img src="/logomajapahit.png" alt="" width="38" height="38" />
        <span><strong>Pura Dalem Majapahit</strong><small>Semarapura · Klungkung</small></span>
      </Link>
      <nav className="k-nav" aria-label="Navigasi utama">{links}</nav>
      <details className="k-mobile-menu" ref={menu}>
        <summary aria-label="Menu navigasi">☰</summary>
        <nav aria-label="Navigasi HP">{links}</nav>
      </details>
    </header>
  </div>;
}
