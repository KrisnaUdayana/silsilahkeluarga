import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 border-t border-slate-100 text-center text-slate-500 text-sm bg-white">
        <p>&copy; 2026 Silsilah Keluarga - Sistem Dokumentasi Silsilah Keluarga</p>
      </footer>
    </div>
  );
}
