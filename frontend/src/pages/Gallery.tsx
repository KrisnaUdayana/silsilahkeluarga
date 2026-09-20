import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Film,
  Image as ImageIcon,
  MapPin,
  Maximize2,
  Play,
  Sparkles,
  Video,
  X,
} from 'lucide-react';
import { galleryApi, getAssetUrl } from '../services/api';
import type { GalleryMedia, GalleryYear } from '../types';

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
    ],
  },
];

function getYouTubeEmbedUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
}

export function GalleryPage() {
  const [galleryYears, setGalleryYears] = useState<GalleryYear[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightbox, setLightbox] = useState<{
    mediaList: GalleryMedia[];
    currentIndex: number;
    eventTitle: string;
  } | null>(null);

  useEffect(() => {
    galleryApi
      .getAll()
      .then(setGalleryYears)
      .catch((error) => {
        console.error('Failed to load gallery:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') nextMedia();
      if (e.key === 'ArrowLeft') prevMedia();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  const displayYears = galleryYears.length > 0 ? galleryYears : demoGalleryYears;
  const totalEvents = displayYears.reduce((total, item) => total + item.events.length, 0);
  const isDemo = !loading && galleryYears.length === 0;

  const totalMedia = useMemo(
    () => displayYears.reduce((total, year) => total + year.events.reduce((eventTotal, event) => eventTotal + event.media.length, 0), 0),
    [displayYears],
  );

  const openLightbox = (mediaList: GalleryMedia[], index: number, eventTitle: string) => {
    setLightbox({
      mediaList,
      currentIndex: index,
      eventTitle,
    });
  };

  const nextMedia = () => {
    if (!lightbox) return;
    setLightbox((prev) =>
      prev
        ? {
            ...prev,
            currentIndex: (prev.currentIndex + 1) % prev.mediaList.length,
          }
        : null,
    );
  };

  const prevMedia = () => {
    if (!lightbox) return;
    setLightbox((prev) =>
      prev
        ? {
            ...prev,
            currentIndex: (prev.currentIndex - 1 + prev.mediaList.length) % prev.mediaList.length,
          }
        : null,
    );
  };

  const currentMedia = lightbox ? lightbox.mediaList[lightbox.currentIndex] : null;
  const ytEmbedUrl = currentMedia && currentMedia.mediaType === 'VIDEO' ? getYouTubeEmbedUrl(currentMedia.url) : null;

  return (
    <div className="gallery-page">
      {/* Hero Header */}
      <section className="gallery-hero">
        <div className="container gallery-hero-inner">
          <div className="gallery-hero-copy">
            <div className="gallery-kicker">
              <Camera size={18} />
              Galeri Keluarga
            </div>
            <h1>Arsip visual keluarga dari tahun ke tahun.</h1>
            <p>
              Dokumentasi foto dan video momen kebersamaan keluarga besar. Klik pada foto atau video untuk melihat dalam
              ukuran penuh.
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
              <strong>{totalMedia || '0'}</strong>
              <span>Media</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Albums Section */}
      <section className="gallery-years-section">
        <div className="container">
          <div className="gallery-section-heading">
            <div className="gallery-section-label">Album Tahunan</div>
            <h2>{isDemo ? 'Contoh susunan acara per tahun.' : 'Dokumentasi Galeri Keluarga.'}</h2>
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
                  {item.events.map((event) => {
                    const mediaList = event.media || [];
                    const photos = mediaList.filter((m) => m.mediaType === 'PHOTO');
                    const videos = mediaList.filter((m) => m.mediaType === 'VIDEO');

                    return (
                      <article className="gallery-event-card" key={event.id}>
                        {/* Dynamic Clean Media Showcase */}
                        {mediaList.length === 0 ? (
                          <div className="flex h-52 flex-col items-center justify-center bg-slate-100 text-slate-400">
                            <Camera size={36} className="mb-2 opacity-50" />
                            <span className="text-xs font-medium">Belum ada foto atau video</span>
                          </div>
                        ) : mediaList.length === 1 ? (
                          /* 1 Media: Full width clean banner */
                          <div
                            className="group relative h-64 w-full cursor-pointer overflow-hidden bg-slate-900"
                            onClick={() => openLightbox(mediaList, 0, event.title)}
                          >
                            {mediaList[0].mediaType === 'PHOTO' ? (
                              <img
                                src={getAssetUrl(mediaList[0].url)}
                                alt={mediaList[0].caption || event.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="relative h-full w-full bg-slate-900">
                                {mediaList[0].thumbnailUrl ? (
                                  <img
                                    src={getAssetUrl(mediaList[0].thumbnailUrl)}
                                    alt="Thumbnail Video"
                                    className="h-full w-full object-cover opacity-80"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-lime-950">
                                    <Video size={48} className="text-lime-400/40" />
                                  </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-lime-800 shadow-xl transition-transform group-hover:scale-110">
                                    <Play size={24} className="ml-1" fill="currentColor" />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                                <span className="truncate font-medium">{mediaList[0].caption || 'Klik untuk melihat penuh'}</span>
                                <Maximize2 size={16} />
                              </div>
                            </div>
                          </div>
                        ) : mediaList.length === 2 ? (
                          /* 2 Media: 50/50 clean grid */
                          <div className="grid h-64 grid-cols-2 gap-1 bg-slate-200">
                            {mediaList.slice(0, 2).map((item, idx) => (
                              <div
                                key={item.id}
                                className="group relative h-full w-full cursor-pointer overflow-hidden bg-slate-900"
                                onClick={() => openLightbox(mediaList, idx, event.title)}
                              >
                                {item.mediaType === 'PHOTO' ? (
                                  <img
                                    src={getAssetUrl(item.url)}
                                    alt={item.caption || ''}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-lime-950">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-lime-800 shadow-lg">
                                      <Play size={18} className="ml-0.5" fill="currentColor" />
                                    </div>
                                  </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                  <Eye size={22} className="text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* 3+ Media: 1 Main (left) + 2 Sub (right) */
                          <div className="grid h-64 grid-cols-3 gap-1 bg-slate-200">
                            {/* Main large item */}
                            <div
                              className="group relative col-span-2 h-full w-full cursor-pointer overflow-hidden bg-slate-900"
                              onClick={() => openLightbox(mediaList, 0, event.title)}
                            >
                              {mediaList[0].mediaType === 'PHOTO' ? (
                                <img
                                  src={getAssetUrl(mediaList[0].url)}
                                  alt={mediaList[0].caption || ''}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-lime-950">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-lime-800 shadow-lg">
                                    <Play size={20} className="ml-0.5" fill="currentColor" />
                                  </div>
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                <Eye size={24} className="text-white" />
                              </div>
                            </div>

                            {/* Right side items */}
                            <div className="col-span-1 grid grid-rows-2 gap-1">
                              {mediaList.slice(1, 3).map((item, idx) => {
                                const actualIndex = idx + 1;
                                const isLastSlot = actualIndex === 2;
                                const remainingCount = mediaList.length - 3;

                                return (
                                  <div
                                    key={item.id}
                                    className="group relative h-full w-full cursor-pointer overflow-hidden bg-slate-900"
                                    onClick={() => openLightbox(mediaList, actualIndex, event.title)}
                                  >
                                    {item.mediaType === 'PHOTO' ? (
                                      <img
                                        src={getAssetUrl(item.url)}
                                        alt={item.caption || ''}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                      />
                                    ) : (
                                      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-lime-950">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lime-800 shadow-md">
                                          <Play size={14} className="ml-0.5" fill="currentColor" />
                                        </div>
                                      </div>
                                    )}

                                    {/* Overlay for +N photos if more than 3 */}
                                    {isLastSlot && remainingCount > 0 ? (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 text-white transition-colors group-hover:bg-black/75">
                                        <span className="text-base font-bold">+{remainingCount}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-slate-300">Lainnya</span>
                                      </div>
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Eye size={18} className="text-white" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Event Content Body */}
                        <div className="gallery-event-body">
                          <div className="gallery-event-date">
                            <Clock size={14} />
                            {event.eventDate || 'Tanggal belum diisi'}
                          </div>
                          <h4>{event.title}</h4>
                          <p>{event.summary || 'Ringkasan acara belum diisi.'}</p>

                          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                            <div className="flex flex-wrap gap-2">
                              {photos.length > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-2.5 py-0.5 text-xs font-semibold text-lime-800">
                                  <ImageIcon size={13} />
                                  {photos.length} foto
                                </span>
                              )}
                              {videos.length > 0 && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                  <Video size={13} />
                                  {videos.length} video
                                </span>
                              )}
                            </div>

                            {mediaList.length > 0 && (
                              <button
                                type="button"
                                onClick={() => openLightbox(mediaList, 0, event.title)}
                                className="inline-flex items-center gap-1 text-xs font-bold text-lime-800 hover:text-lime-600 transition-colors"
                              >
                                <Eye size={14} />
                                Lihat Album
                              </button>
                            )}
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

      {/* Timeline Section */}
      <section className="gallery-timeline-section">
        <div className="container gallery-timeline-grid">
          <div>
            <div className="gallery-section-label">Alur Galeri</div>
            <h2>Foto dan video tersimpan rapi berdasarkan tahun dan acara.</h2>
            <p>
              Setiap momen penting keluarga diarsipkan dengan foto & video resolusi jernih yang dapat dibuka kapan saja.
            </p>
          </div>

          <div className="gallery-timeline">
            {displayYears.map((item) => (
              <div className="gallery-timeline-item" key={item.id}>
                <div className="gallery-timeline-dot">
                  {item.yearLabel === 'Masa Mendatang' ? <Clock size={18} /> : <ImageIcon size={18} />}
                </div>
                <div>
                  <strong>{item.yearLabel}</strong>
                  <span>{item.events.length} acara terdaftar</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State Banner */}
      <section className="gallery-empty-state">
        <div className="container">
          <div className="gallery-empty-panel">
            <Sparkles size={24} />
            <div>
              <h2>{isDemo ? 'Belum ada data galeri dari admin.' : 'Struktur galeri aktif.'}</h2>
              <p>
                {isDemo
                  ? 'Masuk sebagai admin untuk mulai mengunggah foto dan video keluarga.'
                  : 'Semua foto dan video dapat dikelola dan ditambah langsung melalui Panel Admin.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightbox && currentMedia && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 p-4 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightbox(null)}
        >
          {/* Lightbox Header */}
          <div
            className="flex w-full max-w-6xl items-center justify-between text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-base font-bold text-slate-100">{lightbox.eventTitle}</h3>
              <p className="text-xs text-slate-400">
                Media {lightbox.currentIndex + 1} dari {lightbox.mediaList.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105"
              title="Tutup (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Lightbox Main Media Content */}
          <div
            className="relative flex flex-1 w-full max-w-5xl items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            {lightbox.mediaList.length > 1 && (
              <button
                type="button"
                onClick={prevMedia}
                className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white shadow-xl backdrop-blur-sm transition-all hover:bg-black/90 hover:scale-110"
                title="Sebelumnya (Panah Kiri)"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Media Display */}
            {currentMedia.mediaType === 'PHOTO' ? (
              <img
                src={getAssetUrl(currentMedia.url)}
                alt={currentMedia.caption || 'Foto Galeri'}
                className="max-h-[72vh] max-w-full rounded-lg object-contain shadow-2xl transition-all select-none"
              />
            ) : ytEmbedUrl ? (
              <div className="aspect-video w-full max-w-3xl rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  src={ytEmbedUrl}
                  title="Video Player"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={getAssetUrl(currentMedia.url)}
                controls
                autoPlay
                className="max-h-[72vh] max-w-full rounded-lg shadow-2xl"
              >
                Browser Anda tidak mendukung tag video.
              </video>
            )}

            {/* Next Button */}
            {lightbox.mediaList.length > 1 && (
              <button
                type="button"
                onClick={nextMedia}
                className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white shadow-xl backdrop-blur-sm transition-all hover:bg-black/90 hover:scale-110"
                title="Selanjutnya (Panah Kanan)"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>

          {/* Lightbox Footer (Caption & Thumbnails) */}
          <div
            className="w-full max-w-4xl text-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {currentMedia.caption && (
              <p className="text-sm text-slate-200 font-medium px-4 py-1.5 rounded-full bg-white/10 inline-block backdrop-blur-sm max-w-xl truncate">
                {currentMedia.caption}
              </p>
            )}

            {/* Thumbnail Strip */}
            {lightbox.mediaList.length > 1 && (
              <div className="flex justify-center gap-2 overflow-x-auto py-1">
                {lightbox.mediaList.map((m, idx) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() =>
                      setLightbox((prev) => (prev ? { ...prev, currentIndex: idx } : null))
                    }
                    className={`h-12 w-12 shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      idx === lightbox.currentIndex
                        ? 'border-lime-400 scale-110 shadow-lg shadow-lime-400/30'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    {m.mediaType === 'PHOTO' ? (
                      <img src={getAssetUrl(m.url)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold">
                        <Film size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
