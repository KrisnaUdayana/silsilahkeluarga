import { CalendarDays, Camera, Clock, Image, MapPin, Play, Sparkles, Video } from 'lucide-react';

const galleryYears = [
  {
    year: '2022',
    title: 'Awal Dokumentasi',
    location: 'Semarapura Kangin',
    status: 'Siap diisi',
    featured: true,
    events: [
      {
        title: 'Pertemuan Keluarga',
        date: 'Januari 2022',
        summary: 'Dokumentasi suasana berkumpul, potret keluarga, dan catatan awal arsip visual.',
        photos: 18,
        videos: 2,
      },
      {
        title: 'Dokumentasi Pura',
        date: 'Agustus 2022',
        summary: 'Foto lingkungan pura, kegiatan bersama, serta rekaman singkat suasana acara.',
        photos: 24,
        videos: 3,
      },
    ],
  },
  {
    year: '2023',
    title: 'Cerita yang Berlanjut',
    location: 'Klungkung',
    status: 'Siap diisi',
    featured: false,
    events: [
      {
        title: 'Kegiatan Keluarga',
        date: 'Maret 2023',
        summary: 'Album untuk kegiatan keluarga dan momen kebersamaan yang terjadi sepanjang tahun.',
        photos: 32,
        videos: 4,
      },
      {
        title: 'Upacara dan Potret Anggota',
        date: 'November 2023',
        summary: 'Ruang untuk foto acara adat, dokumentasi generasi, dan video kenangan keluarga.',
        photos: 27,
        videos: 2,
      },
    ],
  },
  {
    year: '2026',
    title: 'Arsip Terkini',
    location: 'Pura Dalem Majapahit',
    status: 'Tahun aktif',
    featured: true,
    events: [
      {
        title: 'Foto Keluarga Terbaru',
        date: 'Februari 2026',
        summary: 'Album terbaru untuk memperbarui potret anggota dan dokumentasi keluarga besar.',
        photos: 20,
        videos: 2,
      },
      {
        title: 'Kumpulan Acara Tahun Ini',
        date: 'September 2026',
        summary: 'Dokumentasi kegiatan tahun berjalan yang bisa terus ditambah oleh admin.',
        photos: 36,
        videos: 5,
      },
    ],
  },
  {
    year: 'Masa Mendatang',
    title: 'Ruang Generasi Berikutnya',
    location: 'Akan diperbarui',
    status: 'Direncanakan',
    featured: false,
    events: [
      {
        title: 'Album Tahun Berikutnya',
        date: 'Akan datang',
        summary: 'Slot acara pertama untuk dokumentasi keluarga di tahun-tahun berikutnya.',
        photos: 0,
        videos: 0,
      },
      {
        title: 'Warisan Visual Baru',
        date: 'Akan datang',
        summary: 'Slot acara kedua untuk menambah foto, video, dan catatan visual generasi baru.',
        photos: 0,
        videos: 0,
      },
    ],
  },
];

export function GalleryPage() {
  const totalEvents = galleryYears.reduce((total, item) => total + item.events.length, 0);

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
              Setiap tahun memiliki dua ruang acara. Di dalamnya tersedia tampilan untuk foto, video, jumlah media, dan
              ringkasan kegiatan keluarga.
            </p>
          </div>

          <div className="gallery-hero-panel" aria-label="Ringkasan galeri">
            <div>
              <strong>{galleryYears.length}</strong>
              <span>Periode</span>
            </div>
            <div>
              <strong>{totalEvents}</strong>
              <span>Acara</span>
            </div>
            <div>
              <strong>Foto/Video</strong>
              <span>Media</span>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-years-section">
        <div className="container">
          <div className="gallery-section-heading">
            <div className="gallery-section-label">Album Tahunan</div>
            <h2>Setiap tahun disusun menjadi dua acara utama.</h2>
          </div>

          <div className="gallery-year-list">
            {galleryYears.map((item) => (
              <section className={`gallery-year-block ${item.featured ? 'gallery-year-block-featured' : ''}`} key={item.year}>
                <div className="gallery-year-header">
                  <div>
                    <div className="gallery-year-label">Tahun</div>
                    <h3>{item.year}</h3>
                    <p>{item.title}</p>
                  </div>
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
                </div>

                <div className="gallery-event-grid">
                  {item.events.map((event, eventIndex) => (
                    <article className="gallery-event-card" key={event.title}>
                      <div className="gallery-event-media">
                        <div className="gallery-photo-stack" aria-label={`Pratinjau foto ${event.title}`}>
                          <span className="gallery-photo-tile gallery-photo-tile-large">
                            <Image size={24} />
                          </span>
                          <span className="gallery-photo-tile">
                            <Camera size={18} />
                          </span>
                          <span className="gallery-photo-tile">
                            <Image size={18} />
                          </span>
                        </div>

                        <div className="gallery-video-preview" aria-label={`Pratinjau video ${event.title}`}>
                          <div className="gallery-play-button">
                            <Play size={20} fill="currentColor" />
                          </div>
                          <span>Video acara {eventIndex + 1}</span>
                        </div>
                      </div>

                      <div className="gallery-event-body">
                        <div className="gallery-event-date">
                          <Clock size={15} />
                          {event.date}
                        </div>
                        <h4>{event.title}</h4>
                        <p>{event.summary}</p>

                        <div className="gallery-media-counts">
                          <span>
                            <Image size={16} />
                            {event.photos} foto
                          </span>
                          <span>
                            <Video size={16} />
                            {event.videos} video
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-timeline-section">
        <div className="container gallery-timeline-grid">
          <div>
            <div className="gallery-section-label">Alur Galeri</div>
            <h2>Foto dan video tetap dikelompokkan berdasarkan tahun dan acara.</h2>
            <p>
              Saat fitur upload sudah disambungkan, admin bisa mengisi setiap acara dengan beberapa foto, video, caption,
              dan keterangan lokasi.
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
                  <span>{item.events.length} acara, foto, dan video</span>
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
              <h2>Struktur media sudah siap.</h2>
              <p>Berikutnya halaman ini bisa dibuat dinamis: tambah acara, upload foto, upload video, dan filter tahun.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
