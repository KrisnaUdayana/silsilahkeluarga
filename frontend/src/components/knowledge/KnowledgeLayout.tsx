import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SiteHeader } from '../common/SiteHeader';
import './knowledge.css';

export function KnowledgeLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return <div className="knowledge">
    <SiteHeader />
    <main id="isi" className="k-width" tabIndex={-1}><Outlet /></main>
    <footer className="k-footer k-width">
      <div><strong>Pura Dalem Majapahit</strong><p>Rujukan: <cite>Pura Dalem Majapahit</cite>, Drs. I Nyoman Sukera, MM (2013).</p></div>
      <nav aria-label="Navigasi bawah"><Link to="/tree">Silsilah</Link><Link to="/members">Anggota</Link><Link to="/sumber">Sumber</Link></nav>
    </footer>
  </div>;
}
