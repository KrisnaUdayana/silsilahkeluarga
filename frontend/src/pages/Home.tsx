import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenText, Building2, HeartHandshake, Landmark, Network, ShieldCheck, TreePine, Users } from 'lucide-react';
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
            <div className="home-kicker">
              <TreePine size={18} />
              Profil Keluarga Besar
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

      <section className="home-intro-section">
        <div className="container home-intro-grid">
          <div>
            <div className="home-section-label">Tentang Kami</div>
            <h2>Arsip keluarga digital yang tertata, hangat, dan mudah ditelusuri.</h2>
          </div>
          <div className="home-intro-copy">
            <p>
              Silsilah Keluarga Besar Pura Dalem Majapahit dirancang sebagai pusat informasi keluarga yang menyimpan
              data anggota, relasi orang tua-anak, pasangan, dan perjalanan generasi dalam tampilan yang jelas.
            </p>
            <p>
              Dengan dokumentasi yang rapi, setiap anggota keluarga dapat memahami asal-usul, menjaga kedekatan, dan
              meneruskan pengetahuan keluarga kepada anak cucu.
            </p>
          </div>
        </div>
      </section>

      <section className="home-stats-section">
        <div className="container home-stats-grid">
          <div className="home-stat-item">
            <strong>{stats?.totalPersons ?? '-'}</strong>
            <span>Anggota Terdokumentasi</span>
          </div>
          <div className="home-stat-item">
            <strong>{stats?.totalMarriages ?? '-'}</strong>
            <span>Relasi Pernikahan</span>
          </div>
          <div className="home-stat-item">
            <strong>Digital</strong>
            <span>Arsip Keluarga</span>
          </div>
          <div className="home-stat-item">
            <strong>Lintas</strong>
            <span>Generasi</span>
          </div>
        </div>
      </section>

      <section className="home-profile-section">
        <div className="container">
          <div className="home-section-heading">
            <div className="home-section-label">Fokus Dokumentasi</div>
            <h2>Membangun profil keluarga yang bisa dibaca, dipercaya, dan diteruskan.</h2>
          </div>

          <div className="home-highlight-grid">
            {profileHighlights.map((item) => (
              <article className="home-highlight-card" key={item.title}>
                <div className="home-highlight-icon">
                  <item.icon size={24} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-values-section">
        <div className="container home-values-grid">
          <div>
            <div className="home-section-label">Nilai Keluarga</div>
            <h2>Menjaga hubungan bukan hanya lewat nama, tetapi juga lewat ingatan bersama.</h2>
          </div>
          <div className="home-values-panel">
            {values.map((value) => (
              <div className="home-value-item" key={value}>
                <HeartHandshake size={20} />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta-section">
        <div className="container home-cta-grid">
          <div>
            <div className="home-section-label">Mulai Jelajahi</div>
            <h2>Kenali hubungan keluarga melalui pohon interaktif dan daftar anggota.</h2>
          </div>
          <div className="home-cta-actions">
            <Link to="/tree" className="btn btn-primary btn-lg">
              <Network size={20} />
              Pohon Silsilah
            </Link>
            <Link to="/members" className="btn btn-secondary btn-lg">
              <Users size={20} />
              Anggota
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              <Building2 size={20} />
              Admin
            </Link>
          </div>
        </div>
      </section>

      <section className="home-closing-band">
        <div className="container home-closing-content">
          <BookOpenText size={28} />
          <p>Setiap nama adalah bagian dari cerita. Setiap generasi adalah lanjutan dari akar yang sama.</p>
        </div>
      </section>
    </div>
  );
}
