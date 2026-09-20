import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenText, Building2, HeartHandshake, Landmark, Network, ShieldCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { statsApi } from '../services/api';

const profileHighlights = [
  {
    icon: Landmark,
    title: 'Identitas Keluarga',
    description: 'Menyatukan informasi keluarga besar dalam satu arsip digital yang tertata, mudah dicari, dan mudah diperbarui.',
  },
  {
    icon: Network,
    title: 'Peta Kekerabatan',
    description: 'Menampilkan hubungan antar generasi secara visual sehingga garis keluarga dapat dipahami dengan cepat.',
  },
  {
    icon: ShieldCheck,
    title: 'Warisan Terjaga',
    description: 'Membantu menjaga nama, cerita, dan nilai keluarga agar tetap dikenal oleh generasi berikutnya.',
  },
];

const values = ['Sejarah', 'Kebersamaan', 'Tanggung Jawab', 'Pengabdian'];

export function HomePage() {
  const [stats, setStats] = useState<{ totalPersons: number; totalMarriages: number } | null>(null);

  useEffect(() => {
    statsApi.getPublicStats().then(setStats).catch(console.error);
  }, []);

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
