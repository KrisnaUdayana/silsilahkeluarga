import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAssetUrl, personApi } from '../services/api';
import type { Person } from '../types';
import { 
  Users, 
  Search, 
  User, 
  Calendar,
  MapPin,
  Briefcase,
  Filter
} from 'lucide-react';

export function MembersPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('');

  const loadPersons = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await personApi.getAll({ gender: genderFilter || undefined });
      setPersons(data);
    } catch (err) {
      console.error('Failed to load persons:', err);
      setError('Gagal memuat data anggota keluarga.');
    } finally {
      setLoading(false);
    }
  }, [genderFilter]);

  useEffect(() => {
    loadPersons();
  }, [loadPersons]);

  const filteredPersons = persons.filter(p => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(searchLower) ||
      p.nickname?.toLowerCase().includes(searchLower) ||
      p.birthPlace?.toLowerCase().includes(searchLower) ||
      p.occupation?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (date?: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container py-12">
          <div className="card p-8 text-center max-w-xl mx-auto">
            <h1 className="text-xl font-semibold text-slate-800 mb-2">Data tidak dapat dimuat</h1>
            <p className="text-red-500 mb-5">{error}</p>
            <button type="button" className="btn btn-primary" onClick={loadPersons}>
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-lime-700 to-lime-900 text-white py-12">
        <div className="container">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Users size={32} />
            Daftar Anggota Keluarga
          </h1>
          <p className="text-white/80">
            {persons.length} anggota keluarga terdaftar
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container py-6">
        <div className="card p-4">
          <div className="flex gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[250px] relative">
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Cari nama, tempat lahir, pekerjaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Gender filter */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <select
                className="form-select w-auto"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="">Semua Jenis Kelamin</option>
                <option value="MALE">Laki-laki</option>
                <option value="FEMALE">Perempuan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Members grid */}
      <div className="container pb-12">
        {filteredPersons.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Tidak ada anggota ditemukan</h3>
            <p className="text-slate-500">Coba ubah filter pencarian Anda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersons.map(person => (
              <Link
                key={person.id}
                to={`/members/${person.id}`}
                className="block"
              >
                <div className="card p-5 h-full flex flex-col">
                  <div className="flex gap-4 mb-4">
                    {/* Avatar */}
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                      style={{
                        background: person.profilePhoto 
                          ? `url(${getAssetUrl(person.profilePhoto)}) center/cover`
                          : person.gender === 'MALE' 
                            ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                            : 'linear-gradient(135deg, #EC4899, #DB2777)',
                      }}
                    >
                      {!person.profilePhoto && <User size={28} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-800 truncate mb-1">
                        {person.fullName}
                      </h3>
                      {person.nickname && (
                        <p className="text-slate-400 text-sm mb-1">
                          "{person.nickname}"
                        </p>
                      )}
                      <span className={`badge ${person.gender === 'MALE' ? 'badge-male' : 'badge-female'}`}>
                        {person.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-sm text-slate-600 flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{formatDate(person.birthDate)}</span>
                      {person.deathDate && (
                        <span className="text-slate-400">
                          - {formatDate(person.deathDate)}
                        </span>
                      )}
                    </div>
                    
                    {person.birthPlace && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{person.birthPlace}</span>
                      </div>
                    )}
                    
                    {person.occupation && (
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} />
                        <span>{person.occupation}</span>
                      </div>
                    )}
                  </div>

                  {/* Family info */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4 text-xs text-slate-400">
                    {person.father && (
                      <span>Ayah: {person.father.fullName.split(' ')[0]}</span>
                    )}
                    {person.mother && (
                      <span>Ibu: {person.mother.fullName.split(' ')[0]}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
