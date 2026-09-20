import { Link } from "react-router-dom";
import { TreePine, History, Users, BookText, ArrowRight, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { statsApi } from "../services/api";

export function HomePage() {
  const [stats, setStats] = useState<{ totalPersons: number; totalMarriages: number } | null>(null);

  useEffect(() => {
    statsApi.getPublicStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-lime-700 to-lime-900 text-white py-20 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5" />

        <div className="container relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-10">
            {/* Left content */}
            <div className="flex-1 min-w-[400px] max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm mb-6">
                <History size={18} />
                Dokumentasi Keluarga Digital
              </div>

              <h1 className="text-4xl md:text-4xl font-bold mb-4 leading-tight text-white">Silsilah Keluarga Pura Dalem Majapahit Semarapura Kangin Klungkung</h1>

              <p className="text-lg text-white/90 mb-8 leading-relaxed">Visualisasi hubungan kekerabatan keluarga lintas generasi dalam bentuk pohon interaktif yang mudah dipahami</p>

              <div className="flex gap-4 flex-wrap">
                <Link to="/tree" className="btn btn-lg bg-white text-lime-900 hover:bg-slate-50 shadow-lg">
                  Lihat Pohon Silsilah
                  <ArrowRight size={20} />
                </Link>
                <Link to="/members" className="btn btn-lg bg-transparent text-white border-2 border-white/30 hover:bg-white/10">
                  Daftar Anggota
                </Link>
              </div>
            </div>

            {/* Right illustration */}
            <div className="flex-shrink-0 flex justify-center">
              <div className="w-56 h-56 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20">
                <TreePine size={100} strokeWidth={1.5} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-lime-900 mb-12">Mengapa Dokumentasi Silsilah Penting?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <History className="w-20 h-20 mx-auto mb-5 text-lime-900" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Melestarikan Sejarah</h3>
              <p className="text-slate-500">Mencatat dan melestarikan cerita, tradisi, dan nilai-nilai keluarga untuk generasi mendatang.</p>
            </div>

            <div className="card p-8 text-center">
              <Users size={36} className="w-20 h-20 mx-auto mb-5 text-lime-900" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Menghubungkan Generasi</h3>
              <p className="text-slate-500">Memahami Hubungan dan Mengetahui Silsilah Keluarga</p>
            </div>

            <div className="card p-8 text-center">
              <BookText size={36} className="w-20 h-20 mx-auto mb-5 text-lime-900" />
              <h3 className="text-xl font-bold text-black mb-2">Warisan untuk Anak Cucu</h3>
              <p className="text-slate-500">Menciptakan warisan digital yang dapat digunakan oleh anak, cucu, dan generasi yang akan datang</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <section className="py-12 bg-white border-b border-slate-100">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto text-center">
                <div className="card p-6">
                  <div className="text-5xl font-bold text-lime-800 mb-2">{stats.totalPersons}</div>
                  <div className="text-slate-500 flex items-center justify-center gap-2">
                    <Heart size={18} />
                    Anggota Keluarga
                  </div>
                </div>
                <div className="card p-6">
                  <div className="text-5xl font-bold text-lime-800 mb-2">{stats.totalMarriages}</div>
                  <div className="text-slate-500 flex items-center justify-center gap-2">
                    <Heart size={18} />
                    Pernikahan
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
