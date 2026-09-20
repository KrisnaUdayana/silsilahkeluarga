import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CalendarDays,
  Edit,
  Film,
  Image as ImageIcon,
  Link2,
  Plus,
  Trash2,
  UploadCloud,
  Video,
  X,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { galleryApi, getAssetUrl } from '../../services/api';
import type { GalleryEvent, GalleryMedia, GalleryYear } from '../../types';

type ApiErrorBody = { error?: string };
type ModalMode = 'year' | 'event' | 'media' | null;

const getApiErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorBody>(err)) {
    return err.response?.data?.error || fallback;
  }

  return fallback;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type UploadFileItem = {
  id: string;
  file: File;
  previewUrl: string;
  isVideo: boolean;
  name: string;
  size: number;
};

const emptyYearForm = {
  yearLabel: '',
  title: '',
  location: '',
  status: '',
  description: '',
  featured: false,
  sortOrder: 0,
};

const emptyEventForm = {
  title: '',
  eventDate: '',
  summary: '',
  sortOrder: 0,
};

const emptyMediaForm = {
  mediaType: 'PHOTO' as 'PHOTO' | 'VIDEO',
  url: '',
  caption: '',
  thumbnailUrl: '',
  sortOrder: 0,
};

export function GalleryAdmin() {
  const [years, setYears] = useState<GalleryYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedYear, setSelectedYear] = useState<GalleryYear | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<GalleryMedia | null>(null);
  const [yearForm, setYearForm] = useState(emptyYearForm);
  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [mediaForm, setMediaForm] = useState(emptyMediaForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Drag & drop upload states
  const [uploadFiles, setUploadFiles] = useState<UploadFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaSourceTab, setMediaSourceTab] = useState<'upload' | 'url'>('upload');

  const loadGallery = async () => {
    setLoading(true);
    try {
      setYears(await galleryApi.getAll());
    } catch (error) {
      setNotice({ type: 'error', message: getApiErrorMessage(error, 'Gagal memuat galeri.') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const openCreateYear = () => {
    setSelectedYear(null);
    setYearForm({ ...emptyYearForm, sortOrder: years.length + 1 });
    setFormError('');
    setModalMode('year');
  };

  const openEditYear = (year: GalleryYear) => {
    setSelectedYear(year);
    setYearForm({
      yearLabel: year.yearLabel,
      title: year.title,
      location: year.location || '',
      status: year.status || '',
      description: year.description || '',
      featured: year.featured,
      sortOrder: year.sortOrder,
    });
    setFormError('');
    setModalMode('year');
  };

  const openCreateEvent = (year: GalleryYear) => {
    setSelectedYear(year);
    setSelectedEvent(null);
    setEventForm({ ...emptyEventForm, sortOrder: year.events.length + 1 });
    setFormError('');
    setModalMode('event');
  };

  const openEditEvent = (year: GalleryYear, event: GalleryEvent) => {
    setSelectedYear(year);
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      eventDate: event.eventDate || '',
      summary: event.summary || '',
      sortOrder: event.sortOrder,
    });
    setFormError('');
    setModalMode('event');
  };

  const openCreateMedia = (event: GalleryEvent) => {
    setSelectedEvent(event);
    setSelectedMedia(null);
    setMediaForm({ ...emptyMediaForm, sortOrder: event.media.length + 1 });
    setUploadFiles([]);
    setMediaSourceTab('upload');
    setFormError('');
    setModalMode('media');
  };

  const openEditMedia = (event: GalleryEvent, media: GalleryMedia) => {
    setSelectedEvent(event);
    setSelectedMedia(media);
    setMediaForm({
      mediaType: media.mediaType,
      url: media.url,
      caption: media.caption || '',
      thumbnailUrl: media.thumbnailUrl || '',
      sortOrder: media.sortOrder,
    });
    setUploadFiles([]);
    setFormError('');
    setModalMode('media');
  };

  const handleFileSelection = (fileList: FileList | File[]) => {
    const incomingFiles = Array.from(fileList);
    const newItems: UploadFileItem[] = incomingFiles.map((file) => {
      const isVideo = file.type.startsWith('video/');
      const previewUrl = URL.createObjectURL(file);
      return {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl,
        isVideo,
        name: file.name,
        size: file.size,
      };
    });
    setUploadFiles((prev) => [...prev, ...newItems]);
    setFormError('');
  };

  const removeUploadFile = (id: string) => {
    setUploadFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const closeModal = () => {
    uploadFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setUploadFiles([]);
    setModalMode(null);
    setSelectedYear(null);
    setSelectedEvent(null);
    setSelectedMedia(null);
    setMediaSourceTab('upload');
    setFormError('');
  };

  const submitYear = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (selectedYear) {
        await galleryApi.updateYear(selectedYear.id, yearForm);
      } else {
        await galleryApi.createYear(yearForm);
      }
      closeModal();
      await loadGallery();
      setNotice({ type: 'success', message: 'Tahun galeri berhasil disimpan.' });
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Gagal menyimpan tahun galeri.'));
    } finally {
      setFormLoading(false);
    }
  };

  const submitEvent = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedYear && !selectedEvent) return;

    setFormLoading(true);
    setFormError('');
    try {
      if (selectedEvent) {
        await galleryApi.updateEvent(selectedEvent.id, eventForm);
      } else if (selectedYear) {
        await galleryApi.createEvent(selectedYear.id, eventForm);
      }
      closeModal();
      await loadGallery();
      setNotice({ type: 'success', message: 'Acara galeri berhasil disimpan.' });
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Gagal menyimpan acara galeri.'));
    } finally {
      setFormLoading(false);
    }
  };

  const submitMedia = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedEvent && !selectedMedia) return;

    setFormLoading(true);
    setFormError('');
    try {
      if (selectedMedia) {
        await galleryApi.updateMedia(selectedMedia.id, mediaForm);
        setNotice({ type: 'success', message: 'Media galeri berhasil disimpan.' });
      } else if (selectedEvent) {
        if (mediaSourceTab === 'upload') {
          if (uploadFiles.length === 0) {
            setFormError('Silakan pilih atau tarik setidaknya 1 file foto/video terlebih dahulu.');
            setFormLoading(false);
            return;
          }
          await galleryApi.uploadMedia(
            selectedEvent.id,
            uploadFiles.map((f) => f.file),
            mediaForm.caption,
            mediaForm.sortOrder
          );
          setNotice({ type: 'success', message: `${uploadFiles.length} file media berhasil diunggah.` });
        } else {
          if (!mediaForm.url.trim()) {
            setFormError('URL media tidak boleh kosong.');
            setFormLoading(false);
            return;
          }
          await galleryApi.createMedia(selectedEvent.id, mediaForm);
          setNotice({ type: 'success', message: 'Media galeri berhasil disimpan.' });
        }
      }
      closeModal();
      await loadGallery();
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Gagal menyimpan media galeri.'));
    } finally {
      setFormLoading(false);
    }
  };

  const deleteYear = async (year: GalleryYear) => {
    if (!window.confirm(`Hapus tahun galeri ${year.yearLabel} beserta semua acara dan medianya?`)) return;
    try {
      await galleryApi.deleteYear(year.id);
      await loadGallery();
      setNotice({ type: 'success', message: 'Tahun galeri berhasil dihapus.' });
    } catch (error) {
      setNotice({ type: 'error', message: getApiErrorMessage(error, 'Gagal menghapus tahun galeri.') });
    }
  };

  const deleteEvent = async (event: GalleryEvent) => {
    if (!window.confirm(`Hapus acara "${event.title}" beserta semua medianya?`)) return;
    try {
      await galleryApi.deleteEvent(event.id);
      await loadGallery();
      setNotice({ type: 'success', message: 'Acara galeri berhasil dihapus.' });
    } catch (error) {
      setNotice({ type: 'error', message: getApiErrorMessage(error, 'Gagal menghapus acara galeri.') });
    }
  };

  const deleteMedia = async (media: GalleryMedia) => {
    if (!window.confirm('Hapus media galeri ini?')) return;
    try {
      await galleryApi.deleteMedia(media.id);
      await loadGallery();
      setNotice({ type: 'success', message: 'Media galeri berhasil dihapus.' });
    } catch (error) {
      setNotice({ type: 'error', message: getApiErrorMessage(error, 'Gagal menghapus media galeri.') });
    }
  };

  if (loading) {
    return (
      <div className="card p-8 flex justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kelola Galeri</h2>
          <p className="text-slate-500 mt-1">Atur tahun, dua acara per tahun, foto, dan video.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateYear}>
          <Plus size={18} />
          Tambah Tahun
        </button>
      </div>

      {notice && (
        <div className={`mb-5 rounded-lg p-4 text-sm ${notice.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {notice.message}
        </div>
      )}

      {years.length === 0 ? (
        <div className="card p-8 text-center">
          <CalendarDays size={36} className="mx-auto text-lime-800 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Belum ada galeri</h3>
          <p className="text-slate-500 mt-1">Mulai dengan membuat tahun galeri, lalu tambahkan 2 acara dan media.</p>
        </div>
      ) : (
        <div className="admin-gallery-list">
          {years.map((year) => (
            <section className="admin-gallery-year" key={year.id}>
              <div className="admin-gallery-year-header">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-lime-700">Tahun</div>
                  <h3>{year.yearLabel}</h3>
                  <p>{year.title}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => openCreateEvent(year)}>
                    <Plus size={16} />
                    Acara
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEditYear(year)}>
                    <Edit size={16} />
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm text-red-500 hover:text-red-600" onClick={() => deleteYear(year)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="admin-gallery-events">
                {year.events.map((galleryEvent) => (
                  <article className="admin-gallery-event" key={galleryEvent.id}>
                    <div className="admin-gallery-event-header">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-slate-400">{galleryEvent.eventDate || 'Tanggal belum diisi'}</div>
                        <h4>{galleryEvent.title}</h4>
                        <p>{galleryEvent.summary || 'Ringkasan belum diisi.'}</p>
                      </div>
                      <div className="flex gap-1">
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEditEvent(year, galleryEvent)}>
                          <Edit size={16} />
                        </button>
                        <button type="button" className="btn btn-ghost btn-sm text-red-500 hover:text-red-600" onClick={() => deleteEvent(galleryEvent)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="admin-gallery-media-bar">
                      <span>
                        <ImageIcon size={15} />
                        {galleryEvent.media.filter((media) => media.mediaType === 'PHOTO').length} foto
                      </span>
                      <span>
                        <Video size={15} />
                        {galleryEvent.media.filter((media) => media.mediaType === 'VIDEO').length} video
                      </span>
                      <button type="button" onClick={() => openCreateMedia(galleryEvent)}>
                        <Plus size={15} />
                        Media
                      </button>
                    </div>

                    {galleryEvent.media.length > 0 && (
                      <div className="admin-gallery-media-list">
                        {galleryEvent.media.map((media) => (
                          <div className="admin-gallery-media-item" key={media.id}>
                            {media.mediaType === 'PHOTO' ? (
                              <img
                                src={getAssetUrl(media.url)}
                                alt={media.caption || 'Foto'}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                                <Video size={18} />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={media.mediaType === 'PHOTO' ? 'badge-male badge text-[10px] px-2 py-0.5' : 'badge-female badge text-[10px] px-2 py-0.5'}>
                                  {media.mediaType}
                                </span>
                                <strong className="truncate text-sm text-slate-800">{media.caption || media.url}</strong>
                              </div>
                              <small className="text-xs text-slate-400 truncate block mt-0.5">{media.url}</small>
                            </div>
                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEditMedia(galleryEvent, media)}>
                              <Edit size={15} />
                            </button>
                            <button type="button" className="btn btn-ghost btn-sm text-red-500 hover:text-red-600" onClick={() => deleteMedia(media)}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* MODAL TAHUN */}
      <Modal isOpen={modalMode === 'year'} onClose={closeModal} title={selectedYear ? 'Edit Tahun Galeri' : 'Tambah Tahun Galeri'}>
        <form onSubmit={submitYear}>
          {formError && <div className="p-3 bg-red-50 text-red-500 rounded-lg mb-4 text-sm">{formError}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Tahun/Label</label>
              <input className="form-input" value={yearForm.yearLabel} onChange={(e) => setYearForm({ ...yearForm, yearLabel: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Urutan</label>
              <input type="number" className="form-input" value={yearForm.sortOrder} onChange={(e) => setYearForm({ ...yearForm, sortOrder: Number(e.target.value) })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Judul</label>
            <input className="form-input" value={yearForm.title} onChange={(e) => setYearForm({ ...yearForm, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Lokasi</label>
              <input className="form-input" value={yearForm.location} onChange={(e) => setYearForm({ ...yearForm, location: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <input className="form-input" value={yearForm.status} onChange={(e) => setYearForm({ ...yearForm, status: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea className="form-textarea" value={yearForm.description} onChange={(e) => setYearForm({ ...yearForm, description: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={yearForm.featured} onChange={(e) => setYearForm({ ...yearForm, featured: e.target.checked })} />
            Tandai sebagai unggulan
          </label>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={formLoading}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>{formLoading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      {/* MODAL ACARA */}
      <Modal isOpen={modalMode === 'event'} onClose={closeModal} title={selectedEvent ? 'Edit Acara' : 'Tambah Acara'}>
        <form onSubmit={submitEvent}>
          {formError && <div className="p-3 bg-red-50 text-red-500 rounded-lg mb-4 text-sm">{formError}</div>}
          <div className="form-group">
            <label className="form-label">Judul Acara</label>
            <input className="form-input" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Tanggal/Label</label>
              <input className="form-input" value={eventForm.eventDate} onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Urutan</label>
              <input type="number" className="form-input" value={eventForm.sortOrder} onChange={(e) => setEventForm({ ...eventForm, sortOrder: Number(e.target.value) })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Ringkasan</label>
            <textarea className="form-textarea" value={eventForm.summary} onChange={(e) => setEventForm({ ...eventForm, summary: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={formLoading}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>{formLoading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      {/* MODAL MEDIA DENGAN GOOGLE FORM STYLE DRAG & DROP FILE UPLOAD */}
      <Modal
        isOpen={modalMode === 'media'}
        onClose={closeModal}
        title={selectedMedia ? 'Edit Media' : `Tambah Media — ${selectedEvent?.title || 'Acara'}`}
      >
        <form onSubmit={submitMedia}>
          {formError && <div className="p-3 bg-red-50 text-red-500 rounded-lg mb-4 text-sm">{formError}</div>}

          {!selectedMedia ? (
            <>
              {/* Tab Selector: Upload File vs URL Link */}
              <div className="flex rounded-lg bg-slate-100 p-1 mb-4">
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                    mediaSourceTab === 'upload' ? 'bg-white text-lime-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setMediaSourceTab('upload')}
                >
                  <UploadCloud size={16} />
                  Pilih / Drag & Drop File
                </button>
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                    mediaSourceTab === 'url' ? 'bg-white text-lime-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setMediaSourceTab('url')}
                >
                  <Link2 size={16} />
                  Tautan URL / Link
                </button>
              </div>

              {mediaSourceTab === 'upload' ? (
                <div className="space-y-4">
                  {/* Modern Google Form style Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleFileSelection(e.dataTransfer.files);
                      }
                    }}
                    onClick={() => document.getElementById('gallery-file-input')?.click()}
                    className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                      isDragging
                        ? 'border-lime-600 bg-lime-100/50 scale-[1.01]'
                        : 'border-slate-300 hover:border-lime-600 hover:bg-lime-50/40 bg-slate-50/50'
                    }`}
                  >
                    <input
                      id="gallery-file-input"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileSelection(e.target.files);
                          e.target.value = '';
                        }
                      }}
                    />
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime-100 text-lime-800 mb-3 shadow-inner">
                      <UploadCloud size={28} />
                    </div>
                    <p className="font-bold text-slate-800 text-base">
                      Tarik & lepas foto atau video ke sini
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      atau <span className="text-lime-700 font-bold underline">klik untuk pilih dari komputer / galeri HP</span>
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2 text-[11px] text-slate-400">
                      <span>Foto (JPG, PNG, WebP)</span>
                      <span>•</span>
                      <span>Video (MP4, WebM)</span>
                      <span>•</span>
                      <span>Bisa pilih banyak file sekaligus</span>
                    </div>
                  </div>

                  {/* Selected Files Preview List */}
                  {uploadFiles.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                        <span>{uploadFiles.length} file dipilih:</span>
                        <button
                          type="button"
                          onClick={() => {
                            uploadFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
                            setUploadFiles([]);
                          }}
                          className="text-red-500 hover:underline"
                        >
                          Hapus Semua
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                        {uploadFiles.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm"
                          >
                            {item.isVideo ? (
                              <div className="h-12 w-12 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                <Film size={22} />
                              </div>
                            ) : (
                              <img
                                src={item.previewUrl}
                                alt={item.name}
                                className="h-12 w-12 rounded-md object-cover border border-slate-100 shrink-0"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-slate-700">{item.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                  item.isVideo ? 'bg-blue-100 text-blue-700' : 'bg-lime-100 text-lime-800'
                                }`}>
                                  {item.isVideo ? 'Video' : 'Foto'}
                                </span>
                                <span className="text-[11px] text-slate-400">{formatFileSize(item.size)}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeUploadFile(item.id);
                              }}
                              className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                              title="Hapus file ini"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">
                      Keterangan / Caption <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      className="form-input"
                      value={mediaForm.caption}
                      onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                      placeholder="Contoh: Foto bersama keluarga inti, Sesi ramah tamah"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Tipe Media</label>
                      <select
                        className="form-select"
                        value={mediaForm.mediaType}
                        onChange={(e) => setMediaForm({ ...mediaForm, mediaType: e.target.value as 'PHOTO' | 'VIDEO' })}
                      >
                        <option value="PHOTO">Foto</option>
                        <option value="VIDEO">Video</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Urutan</label>
                      <input
                        type="number"
                        className="form-input"
                        value={mediaForm.sortOrder}
                        onChange={(e) => setMediaForm({ ...mediaForm, sortOrder: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL Media</label>
                    <input
                      className="form-input"
                      value={mediaForm.url}
                      onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                      required={mediaSourceTab === 'url'}
                      placeholder="https://... atau /uploads/..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Caption</label>
                    <input
                      className="form-input"
                      value={mediaForm.caption}
                      onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                      placeholder="Keterangan media"
                    />
                  </div>
                  {mediaForm.mediaType === 'VIDEO' && (
                    <div className="form-group">
                      <label className="form-label">Thumbnail Video (Opsional)</label>
                      <input
                        className="form-input"
                        value={mediaForm.thumbnailUrl}
                        onChange={(e) => setMediaForm({ ...mediaForm, thumbnailUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Edit existing media */
            <div className="space-y-4">
              {selectedMedia.mediaType === 'PHOTO' ? (
                <div className="rounded-lg overflow-hidden border border-slate-200 max-h-48 flex items-center justify-center bg-slate-900/5">
                  <img src={getAssetUrl(mediaForm.url)} alt={mediaForm.caption || ''} className="max-h-48 object-contain" />
                </div>
              ) : (
                <div className="rounded-lg p-4 bg-blue-50 border border-blue-200 text-blue-800 flex items-center gap-3">
                  <Video size={24} />
                  <div className="text-xs truncate">
                    <strong>URL Video:</strong> {mediaForm.url}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Tipe Media</label>
                  <select
                    className="form-select"
                    value={mediaForm.mediaType}
                    onChange={(e) => setMediaForm({ ...mediaForm, mediaType: e.target.value as 'PHOTO' | 'VIDEO' })}
                  >
                    <option value="PHOTO">Foto</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Urutan</label>
                  <input
                    type="number"
                    className="form-input"
                    value={mediaForm.sortOrder}
                    onChange={(e) => setMediaForm({ ...mediaForm, sortOrder: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">URL Media</label>
                <input
                  className="form-input"
                  value={mediaForm.url}
                  onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Caption</label>
                <input
                  className="form-input"
                  value={mediaForm.caption}
                  onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={formLoading}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading
                ? 'Mengunggah...'
                : selectedMedia
                ? 'Simpan Perubahan'
                : mediaSourceTab === 'upload' && uploadFiles.length > 1
                ? `Unggah ${uploadFiles.length} File`
                : 'Unggah & Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
