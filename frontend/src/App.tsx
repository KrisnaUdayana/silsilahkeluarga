import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout, ProtectedRoute } from './components/common';
import { useAuthStore } from './store/authStore';

// Pages
import { HomePage } from './pages/Home';
import { LoginPage } from './pages/Login';
import { TreePage } from './pages/TreeView';
import { MembersPage } from './pages/Members';
import { PersonDetailPage } from './pages/PersonDetail';
import { AdminDashboard } from './pages/admin/Dashboard';

import './index.css';

function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50">
      <div className="container py-16">
        <div className="card p-8 text-center max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-lime-900 mb-3">Halaman tidak ditemukan</h1>
          <p className="text-slate-500 mb-6">Alamat yang dibuka tidak tersedia atau sudah berubah.</p>
          <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'var(--color-bg)'
      }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes - no login required */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tree" element={<TreePage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/members/:id" element={<PersonDetailPage />} />

          {/* Admin only routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
