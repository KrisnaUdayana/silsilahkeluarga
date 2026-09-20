import { CalendarDays, Camera, Clock, Image, MapPin, Sparkles } from 'lucide-react';

const galleryYears = [
  {
    year: '2022',
    title: 'Awal Dokumentasi',
    location: 'Semarapura Kangin',
    description: 'Ruang arsip untuk foto keluarga, kegiatan adat, dan momen kebersamaan yang mulai dikumpulkan.',
    status: 'Siap diisi',
    featured: true,
    moments: ['Pertemuan keluarga', 'Dokumentasi pura', 'Foto generasi'],
  },
  {
    year: '2023',
    title: 'Cerita yang Berlanjut',
    location: 'Klungkung',
    description: 'Album untuk menyimpan kegiatan keluarga sepanjang tahun dan memperkaya catatan visual silsilah.',
    status: 'Siap diisi',
    featured: false,
    moments: ['Kegiatan keluarga', 'Upacara', 'Potret anggota'],
  },
  {
    year: '2026',
    title: 'Arsip Terkini',
    location: 'Pura Dalem Majapahit',
    description: 'Bagian untuk dokumentasi terbaru agar galeri tetap hidup dan mudah ditemukan berdasarkan tahun.',
    status: 'Tahun aktif',
    featured: true,
    moments: ['Foto terbaru', 'Kumpulan acara', 'Album keluarga'],
  },
  {
    year: 'Masa Mendatang',
    title: 'Ruang Generasi Berikutnya',
    location: 'Akan diperbarui',
    description: 'Tempat untuk album tahun-tahun berikutnya, sehingga dokumentasi keluarga terus bertumbuh.',
    status: 'Direncanakan',
    featured: false,
    moments: ['Album baru', 'Catatan visual', 'Warisan digital'],
  },
];

export function GalleryPage() {
  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="container gallery-hero-inner">
          <div className="gallery-hero-copy">
            <div className="gallery-kicker">
              <Camera size={18} />
              Galeri Keluarga
            </div>
            <h1>Arsip visual keluarga dari tahun ke tahun.</h1>
            <p>
              Galeri ini disiapkan sebagai ruang dokumentasi foto dan kenangan keluarga berdasarkan tahun, mulai dari
              arsip lama sampai album untuk masa yang akan datang.
            </p>
          </div>

          <div className="gallery-hero-panel" aria-label="Ringkasan galeri">
            <div>
              <strong>{galleryYears.length}</strong>
              <span>Periode</span>
            </div>
            <div>
              <strong>2022</strong>
              <span>Mulai Arsip</span>
            </div>
            <div>
              <strong>Digital</strong>
              <span>Album</span>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-years-section">
        <div className="container">
          <div className="gallery-section-heading">
            <div className="gallery-section-label">Album Tahunan</div>
            <h2>Pilih periode dokumentasi keluarga.</h2>
          </div>

          <div className="gallery-year-grid">
            {galleryYears.map((item) => (
              <article className={`gallery-year-card ${item.featured ? 'gallery-year-card-featured' : ''}`} key={item.year}>
                <div className="gallery-year-cover">
                  <span>{item.year}</span>
                </div>
                <div className="gallery-year-body">
                  <div className="gallery-card-meta">
                    <span>
                      <CalendarDays size={15} />
                      {item.status}
                    </span>
                    <span>
                      <MapPin size={15} />
                      {item.location}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="gallery-moment-list">
                    {item.moments.map((moment) => (
                      <span key={moment}>{moment}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-timeline-section">
        <div className="container gallery-timeline-grid">
          <div>
            <div className="gallery-section-label">Alur Galeri</div>
            <h2>Layout sudah siap untuk pertumbuhan album berikutnya.</h2>
            <p>
              Saat foto sudah tersedia, setiap kartu tahun bisa diisi dengan kumpulan gambar, caption, lokasi, dan
              penanda kegiatan keluarga.
            </p>
          </div>

          <div className="gallery-timeline">
            {galleryYears.map((item) => (
              <div className="gallery-timeline-item" key={item.year}>
                <div className="gallery-timeline-dot">
                  {item.year === 'Masa Mendatang' ? <Clock size={18} /> : <Image size={18} />}
                </div>
                <div>
                  <strong>{item.year}</strong>
                  <span>{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-empty-state">
        <div className="container">
          <div className="gallery-empty-panel">
            <Sparkles size={24} />
            <div>
              <h2>Siap dihubungkan ke fitur upload foto.</h2>
              <p>Untuk tahap ini halaman galeri sudah memiliki struktur tahun dan ruang album yang jelas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
