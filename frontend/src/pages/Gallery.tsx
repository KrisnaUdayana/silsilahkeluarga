import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Camera, Clock, Image, MapPin, Play, Sparkles, Video } from 'lucide-react';
import { galleryApi, getAssetUrl } from '../services/api';
import type { GalleryYear } from '../types';

const demoGalleryYears: GalleryYear[] = [
  {
    id: 'demo-2022',
    yearLabel: '2022',
    title: 'Awal Dokumentasi',
    location: 'Semarapura Kangin',
    status: 'Siap diisi',
    featured: true,
    sortOrder: 1,
    createdAt: '',
    updatedAt: '',
    events: [
      {
        id: 'demo-2022-1',
        galleryYearId: 'demo-2022',
        title: 'Pertemuan Keluarga',
        eventDate: 'Januari 2022',
        summary: 'Dokumentasi suasana berkumpul, potret keluarga, dan catatan awal arsip visual.',
        sortOrder: 1,
        createdAt: '',
        updatedAt: '',
        media: [],
      },
      {
        id: 'demo-2022-2',
        galleryYearId: 'demo-2022',
        title: 'Dokumentasi Pura',
        eventDate: 'Agustus 2022',
        summary: 'Foto lingkungan pura, kegiatan bersama, serta rekaman singkat suasana acara.',
        sortOrder: 2,
        createdAt: '',
        updatedAt: '',
        media: [],
      },
    ],
  },
  {
    id: 'demo-2023',
    yearLabel: '2023',
    title: 'Cerita yang Berlanjut',
    location: 'Klungkung',
    status: 'Siap diisi',
    featured: false,
    sortOrder: 2,
    createdAt: '',
    updatedAt: '',
    events: [
      {
        id: 'demo-2023-1',
        galleryYearId: 'demo-2023',
        title: 'Kegiatan Keluarga',
        eventDate: 'Maret 2023',
        summary: 'Album untuk kegiatan keluarga dan momen kebersamaan yang terjadi sepanjang tahun.',
        sortOrder: 1,
        createdAt: '',
        updatedAt: '',
        media: [],
      },
      {
        id: 'demo-2023-2',
        galleryYearId: 'demo-2023',
        title: 'Upacara dan Potret Anggota',
        eventDate: 'November 2023',
        summary: 'Ruang untuk foto acara adat, dokumentasi generasi, dan video kenangan keluarga.',
        sortOrder: 2,
        createdAt: '',
        updatedAt: '',
        media: [],
      },
    ],
  },
  {
    id: 'demo-2026',
    yearLabel: '2026',
    title: 'Arsip Terkini',
    location: 'Pura Dalem Majapahit',
    status: 'Tahun aktif',
    featured: true,
    sortOrder: 3,
    createdAt: '',
    updatedAt: '',
    events: [
      {
        id: 'demo-2026-1',
        galleryYearId: 'demo-2026',
        title: 'Foto Keluarga Terbaru',
        eventDate: 'Februari 2026',
        summary: 'Album terbaru untuk memperbarui potret anggota dan dokumentasi keluarga besar.',
        sortOrder: 1,
        createdAt: '',
        updatedAt: '',
        media: [],
      },
      {
        id: 'demo-2026-2',
        galleryYearId: 'demo-2026',
        title: 'Kumpulan Acara Tahun Ini',
        eventDate: 'September 2026',
        summary: 'Dokumentasi kegiatan tahun berjalan yang bisa terus ditambah oleh admin.',
        sortOrder: 2,
        createdAt: '',
        updatedAt: '',
        media: [],
      },
    ],
  },
  {
    id: 'demo-future',
    yearLabel: 'Masa Mendatang',
    title: 'Ruang Generasi Berikutnya',
    location: 'Akan diperbarui',
    status: 'Direncanakan',
    featured: false,
    sortOrder: 4,
    createdAt: '',
    updatedAt: '',
    events: [
      {
        id: 'demo-future-1',
        galleryYearId: 'demo-future',
        title: 'Album Tahun Berikutnya',
        eventDate: 'Akan datang',
        summary: 'Slot acara pertama untuk dokumentasi keluarga di tahun-tahun berikutnya.',
        sortOrder: 1,
        createdAt: '',
        updatedAt: '',
        media: [],
      },
      {
        id: 'demo-future-2',
        galleryYearId: 'demo-future',
        title: 'Warisan Visual Baru',
        eventDate: 'Akan datang',
        summary: 'Slot acara kedua untuk menambah foto, video, dan catatan visual generasi baru.',
        sortOrder: 2,
        createdAt: '',
        updatedAt: '',
        media: [],
      },
    ],
  },
];

const mediaBackground = (url?: string | null) => (url ? { backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.58)), url(${getAssetUrl(url)})` } : undefined);

export function GalleryPage() {
  const [galleryYears, setGalleryYears] = useState<GalleryYear[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryApi
      .getAll()
      .then(setGalleryYears)
      .catch((error) => {
        console.error('Failed to load gallery:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayYears = galleryYears.length > 0 ? galleryYears : demoGalleryYears;
  const totalEvents = displayYears.reduce((total, item) => total + item.events.length, 0);
  const isDemo = !loading && galleryYears.length === 0;

  const totalMedia = useMemo(
    () => displayYears.reduce((total, year) => total + year.events.reduce((eventTotal, event) => eventTotal + event.media.length, 0), 0),
    [displayYears],
  );

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
              <strong>{displayYears.length}</strong>
              <span>Periode</span>
            </div>
            <div>
              <strong>{totalEvents}</strong>
              <span>Acara</span>
            </div>
            <div>
              <strong>{totalMedia || 'Foto/Video'}</strong>
              <span>Media</span>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-years-section">
        <div className="container">
          <div className="gallery-section-heading">
            <div className="gallery-section-label">Album Tahunan</div>
            <h2>{isDemo ? 'Contoh susunan dua acara per tahun.' : 'Galeri yang dikelola admin.'}</h2>
          </div>

          <div className="gallery-year-list">
            {displayYears.map((item) => (
              <section className={`gallery-year-block ${item.featured ? 'gallery-year-block-featured' : ''}`} key={item.id}>
                <div className="gallery-year-header">
                  <div>
                    <div className="gallery-year-label">Tahun</div>
                    <h3>{item.yearLabel}</h3>
                    <p>{item.title}</p>
                  </div>
                  <div className="gallery-card-meta">
                    <span>
                      <CalendarDays size={15} />
                      {item.status || 'Arsip'}
                    </span>
                    <span>
                      <MapPin size={15} />
                      {item.location || '-'}
                    </span>
                  </div>
                </div>

                <div className="gallery-event-grid">
                  {item.events.map((event, eventIndex) => {
                    const photos = event.media.filter((media) => media.mediaType === 'PHOTO');
                    const videos = event.media.filter((media) => media.mediaType === 'VIDEO');
                    const previewPhotos = photos.slice(0, 3);
                    const previewVideo = videos[0];

                    return (
                      <article className="gallery-event-card" key={event.id}>
                        <div className="gallery-event-media">
                          <div className="gallery-photo-stack" aria-label={`Pratinjau foto ${event.title}`}>
                            {[0, 1, 2].map((index) => (
                              <span
                                className={`gallery-photo-tile ${index === 0 ? 'gallery-photo-tile-large' : ''}`}
                                key={index}
                                style={mediaBackground(previewPhotos[index]?.url)}
                              >
                                {previewPhotos[index] ? null : index === 1 ? <Camera size={18} /> : <Image size={index === 0 ? 24 : 18} />}
                              </span>
                            ))}
                          </div>

                          <a
                            className="gallery-video-preview"
                            aria-label={`Pratinjau video ${event.title}`}
                            href={previewVideo?.url || undefined}
                            target={previewVideo?.url ? '_blank' : undefined}
                            rel="noreferrer"
                            style={mediaBackground(previewVideo?.thumbnailUrl)}
                          >
                            <div className="gallery-play-button">
                              <Play size={20} fill="currentColor" />
                            </div>
                            <span>{previewVideo ? previewVideo.caption || 'Putar video' : `Video acara ${eventIndex + 1}`}</span>
                          </a>
                        </div>

                        <div className="gallery-event-body">
                          <div className="gallery-event-date">
                            <Clock size={15} />
                            {event.eventDate || 'Tanggal belum diisi'}
                          </div>
                          <h4>{event.title}</h4>
                          <p>{event.summary || 'Ringkasan acara belum diisi.'}</p>

                          <div className="gallery-media-counts">
                            <span>
                              <Image size={16} />
                              {photos.length} foto
                            </span>
                            <span>
                              <Video size={16} />
                              {videos.length} video
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
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
              Admin bisa mengisi setiap acara dengan beberapa foto, video, caption, thumbnail video, dan keterangan
              lokasi.
            </p>
          </div>

          <div className="gallery-timeline">
            {displayYears.map((item) => (
              <div className="gallery-timeline-item" key={item.id}>
                <div className="gallery-timeline-dot">
                  {item.yearLabel === 'Masa Mendatang' ? <Clock size={18} /> : <Image size={18} />}
                </div>
                <div>
                  <strong>{item.yearLabel}</strong>
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
              <h2>{isDemo ? 'Belum ada data galeri dari admin.' : 'Struktur media sudah aktif.'}</h2>
              <p>{isDemo ? 'Masuk sebagai admin untuk membuat tahun, acara, foto, dan video.' : 'Data di halaman ini berasal dari panel admin galeri.'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
