import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="home-hero">
        <div className="home-hero-overlay" />
        <div className="container home-hero-inner">
          <div className="home-hero-content">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 p-2 backdrop-blur-md border border-white/20 shadow-xl">
                <img src="/logomajapahit.png" alt="Logo Pura Dalem Majapahit" className="h-full w-full object-contain drop-shadow" />
              </div>
              <div className="home-kicker my-0">
                Profil Keluarga Besar
              </div>
            </div>

            <h1>Pura Dalem Majapahit Semarapura Kangin Klungkung</h1>
            <p>
              Platform dokumentasi silsilah keluarga untuk merawat identitas, mengenali hubungan kekerabatan, dan
              menghadirkan arsip keluarga yang hidup lintas generasi.
            </p>

            <div className="home-hero-actions">
              <Link to="/tree" className="home-primary-action">
                Lihat Pohon Silsilah
                <ArrowRight size={20} />
              </Link>
              <Link to="/members" className="home-secondary-action">
                Daftar Anggota
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
