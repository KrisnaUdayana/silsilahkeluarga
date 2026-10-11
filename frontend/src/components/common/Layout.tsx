import { Outlet, useMatch } from 'react-router-dom';
import { Navbar } from './Navbar';
import { SiteHeader } from './SiteHeader';

export function Layout() {
  const isTreePage = useMatch('/tree');
  return (
    <div className="min-h-screen flex flex-col">
      {isTreePage ? <SiteHeader /> : <Navbar />}
      <main id="isi" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="py-6 border-t border-slate-100 text-center text-slate-500 text-sm bg-white">
        <p>&copy; 2026 Silsilah Keluarga - Sistem Dokumentasi Silsilah Keluarga</p>
      </footer>
    </div>
  );
}
