import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAssetUrl, personApi } from '../services/api';
import type { Person } from '../types';
import { 
  User, 
  Calendar,
  MapPin,
  Briefcase,
  ArrowLeft,
  Users,
  Heart
} from 'lucide-react';

export function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    personApi.getById(id)
      .then(data => {
        setPerson(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Gagal memuat data');
        setLoading(false);
      });
  }, [id]);

  const formatDate = (date?: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const calculateAge = (birthDate?: string | null, deathDate?: string | null) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="container py-12">
        <div className="card p-8 text-center">
          <p className="text-red-500">{error || 'Anggota keluarga tidak ditemukan'}</p>
          <Link to="/members" className="btn btn-secondary mt-4">
            <ArrowLeft size={18} />
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const age = calculateAge(person.birthDate, person.deathDate);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with photo */}
      <div 
        className="py-12 text-white"
        style={{
          background: person.gender === 'MALE' 
            ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
            : 'linear-gradient(135deg, #EC4899, #DB2777)',
        }}
      >
        <div className="container">
          <Link 
            to="/members" 
            className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-6"
          >
            <ArrowLeft size={18} />
            Kembali ke Daftar
          </Link>

          <div className="flex items-center gap-8 flex-wrap">
            {/* Photo */}
            <div 
              className="w-36 h-36 rounded-2xl flex items-center justify-center border-4 border-white/30 shadow-lg"
              style={{
                background: person.profilePhoto 
                  ? `url(${getAssetUrl(person.profilePhoto)}) center/cover`
                  : 'rgba(255,255,255,0.2)',
              }}
            >
              {!person.profilePhoto && <User size={60} />}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {person.fullName}
              </h1>
              {person.nickname && (
                <p className="text-xl opacity-90 mb-2">
                  "{person.nickname}"
                </p>
              )}
              <div className="flex gap-3 flex-wrap">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {person.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
                </span>
                {age !== null && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {person.deathDate ? `Wafat usia ${age} tahun` : `${age} tahun`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Basic info */}
          <div>
            <div className="card mb-6">
              <div className="card-header">
                <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                  <User size={20} />
                  Informasi Pribadi
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                      <Calendar size={14} />
                      Tanggal Lahir
                    </div>
                    <div className="font-medium text-slate-700">{formatDate(person.birthDate)}</div>
                  </div>

                  {person.deathDate && (
                    <div>
                      <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Tanggal Wafat
                      </div>
                      <div className="font-medium text-slate-700">{formatDate(person.deathDate)}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                      <MapPin size={14} />
                      Tempat Lahir
                    </div>
                    <div className="font-medium text-slate-700">{person.birthPlace || '-'}</div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                      <Briefcase size={14} />
                      Pekerjaan
                    </div>
                    <div className="font-medium text-slate-700">{person.occupation || '-'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography */}
            {person.biography && (
              <div className="card">
                <div className="card-header">
                  <h3 className="font-semibold text-slate-800">Biografi</h3>
                </div>
                <div className="card-body">
                  <p className="leading-relaxed text-slate-600">
                    {person.biography}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Family */}
          <div>
            {/* Parents */}
            <div className="card mb-6">
              <div className="card-header">
                <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                  <Users size={20} />
                  Orang Tua
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {person.father ? (
                    <Link to={`/members/${person.father.id}`} className="block">
                      <div className="card p-4 flex items-center gap-4 hover:shadow-md">
                        <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                          <User size={24} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">
                            {person.father.fullName}
                          </div>
                          <div className="text-sm text-slate-400">
                            Ayah
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="text-slate-400">
                      Data ayah tidak tersedia
                    </div>
                  )}

                  {person.mother ? (
                    <Link to={`/members/${person.mother.id}`} className="block">
                      <div className="card p-4 flex items-center gap-4 hover:shadow-md">
                        <div className="w-12 h-12 rounded-lg bg-pink-500 flex items-center justify-center text-white">
                          <User size={24} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">
                            {person.mother.fullName}
                          </div>
                          <div className="text-sm text-slate-400">
                            Ibu
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="text-slate-400">
                      Data ibu tidak tersedia
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Spouse */}
            {person.spouses && person.spouses.length > 0 && (
              <div className="card mb-6">
                <div className="card-header">
                  <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                    <Heart size={20} />
                    {person.gender === 'MALE' ? 'Istri' : person.gender === 'FEMALE' ? 'Suami' : 'Pasangan'}
                  </h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    {person.spouses.map(spouse => (
                      <Link key={spouse.id} to={`/members/${spouse.id}`} className="block">
                        <div className="card p-4 flex items-center gap-4 hover:shadow-md">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                            style={{ background: person.gender === 'MALE' ? '#EC4899' : '#3B82F6' }}
                          >
                            <User size={24} />
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">
                              {spouse.fullName}
                            </div>
                            {spouse.marriageDate && (
                              <div className="text-sm text-slate-400">
                                Menikah {formatDate(spouse.marriageDate)}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Children */}
            {person.children && person.children.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                    <Users size={20} />
                    Anak ({person.children.length})
                  </h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    {person.children.map(child => (
                      <Link key={child.id} to={`/members/${child.id}`} className="block">
                        <div className="card p-4 flex items-center gap-4 hover:shadow-md">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ background: child.gender === 'MALE' ? '#3B82F6' : '#EC4899' }}
                          >
                            <User size={20} />
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">
                              {child.fullName}
                            </div>
                            {child.birthDate && (
                              <div className="text-sm text-slate-400">
                                Lahir {formatDate(child.birthDate)}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
