import { useState, useEffect } from 'react';
import axios from 'axios';
import { statsApi, personApi, userApi } from '../../services/api';
import type { Stats, Person, User } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { Modal } from '../../components/common/Modal';
import { 
  Settings,
  Users,
  Heart,
  TreePine,
  UserPlus,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

type AdminTab = 'overview' | 'persons' | 'users';

type ApiErrorBody = {
  error?: string;
};

const getApiErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorBody>(err)) {
    return err.response?.data?.error || fallback;
  }

  return fallback;
};

export function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingPersonId, setDeletingPersonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    birthDate: '',
    birthPlace: '',
    occupation: '',
    fatherId: '',
    motherId: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoadError('');

    try {
      const [statsData, personsData, usersData] = await Promise.all([
        statsApi.getStats(),
        personApi.getAll(),
        userApi.getAll()
      ]);
      setStats(statsData);
      setPersons(personsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setLoadError(getApiErrorMessage(err, 'Gagal memuat data admin.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setNotice(null);
    setEditingPerson(null);
    setFormData({
      fullName: '',
      nickname: '',
      gender: 'MALE',
      birthDate: '',
      birthPlace: '',
      occupation: '',
      fatherId: '',
      motherId: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleEdit = (person: Person) => {
    setNotice(null);
    setEditingPerson(person);
    setFormData({
      fullName: person.fullName,
      nickname: person.nickname || '',
      gender: person.gender,
      birthDate: person.birthDate ? new Date(person.birthDate).toISOString().split('T')[0] : '',
      birthPlace: person.birthPlace || '',
      occupation: person.occupation || '',
      fatherId: person.fatherId || '',
      motherId: person.motherId || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    setDeletingPersonId(id);
    setNotice(null);
    try {
      await personApi.delete(id);
      await loadData();
      setNotice({ type: 'success', message: 'Data berhasil dihapus.' });
    } catch (err: unknown) {
      setNotice({ type: 'error', message: getApiErrorMessage(err, 'Gagal menghapus data') });
    } finally {
      setDeletingPersonId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formLoading) return;

    setFormLoading(true);
    setFormError('');

    try {
      const dataToSubmit = {
        ...formData,
        fatherId: formData.fatherId || undefined,
        motherId: formData.motherId || undefined
      };

      if (editingPerson) {
        await personApi.update(editingPerson.id, dataToSubmit);
      } else {
        await personApi.create(dataToSubmit);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      setFormError(getApiErrorMessage(err, 'Terjadi kesalahan saat menyimpan data'));
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="spinner" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container py-12">
          <div className="card p-8 text-center max-w-xl mx-auto">
            <h1 className="text-xl font-semibold text-slate-800 mb-2">Panel admin tidak dapat dimuat</h1>
            <p className="text-red-500 mb-5">{loadError}</p>
            <button type="button" className="btn btn-primary" onClick={loadData}>
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
            <Settings size={32} />
            Panel Admin
          </h1>
          <p className="text-white/80">
            Selamat datang, {user?.person?.fullName || user?.email}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="container py-6">
        <div className="flex gap-2 border-b-2 border-slate-200 pb-2">
          {[
            { id: 'overview', label: 'Ringkasan', icon: TreePine },
            { id: 'persons', label: 'Anggota', icon: Users },
            { id: 'users', label: 'Pengguna', icon: UserPlus }
          ].map(tab => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container pb-12">
        {notice && (
          <div className={`mb-5 rounded-lg p-4 text-sm ${notice.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {notice.message}
          </div>
        )}

        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6 text-center">
                <Users size={32} className="mx-auto text-lime-800" />
                <div className="text-4xl font-bold text-lime-800 mt-2">
                  {stats.summary.totalPersons}
                </div>
                <div className="text-slate-500">Total Anggota</div>
              </div>
              <div className="card p-6 text-center">
                <Heart size={32} className="mx-auto text-pink-500" />
                <div className="text-4xl font-bold text-pink-500 mt-2">
                  {stats.summary.totalMarriages}
                </div>
                <div className="text-slate-500">Pernikahan</div>
              </div>
              <div className="card p-6 text-center">
                <TreePine size={32} className="mx-auto text-amber-500" />
                <div className="text-4xl font-bold text-amber-500 mt-2">
                  {stats.summary.estimatedGenerations}
                </div>
                <div className="text-slate-500">Generasi</div>
              </div>
              <div className="card p-6 text-center">
                <UserPlus size={32} className="mx-auto text-blue-500" />
                <div className="text-4xl font-bold text-blue-500 mt-2">
                  {stats.summary.totalUsers}
                </div>
                <div className="text-slate-500">Pengguna</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'persons' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Daftar Anggota Keluarga</h2>
              <button type="button" className="btn btn-primary" onClick={handleCreate}>
                <Plus size={18} />
                Tambah Anggota
              </button>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Nama</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Gender</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Ayah</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Ibu</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {persons.map(person => (
                      <tr key={person.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{person.fullName}</div>
                          {person.nickname && (
                            <div className="text-sm text-slate-400">
                              "{person.nickname}"
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${person.gender === 'MALE' ? 'badge-male' : 'badge-female'}`}>
                            {person.gender === 'MALE' ? 'L' : 'P'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{person.father?.fullName || '-'}</td>
                        <td className="px-4 py-3 text-slate-600">{person.mother?.fullName || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button 
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleEdit(person)}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              type="button"
                              className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"
                              onClick={() => handleDelete(person.id)}
                              disabled={deletingPersonId === person.id}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Daftar Pengguna</h2>
              <button type="button" className="btn btn-primary" disabled title="Manajemen pengguna belum tersedia">
                <Plus size={18} />
                Tambah Pengguna
              </button>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Terhubung dengan</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Login Terakhir</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${u.role === 'ADMIN' ? 'bg-lime-100 text-lime-800' : 'bg-slate-100 text-slate-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{u.person?.fullName || '-'}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {u.lastLogin 
                            ? new Date(u.lastLogin).toLocaleDateString('id-ID')
                            : 'Belum pernah'
                          }
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button type="button" className="btn btn-ghost btn-sm" disabled title="Edit pengguna belum tersedia">
                              <Edit size={16} />
                            </button>
                            <button 
                              type="button"
                              className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"
                              disabled
                              title={u.id === user?.id ? 'Tidak bisa menghapus akun sendiri' : 'Hapus pengguna belum tersedia'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPerson ? 'Edit Anggota' : 'Tambah Anggota'}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="p-3 bg-red-50 text-red-500 rounded-lg mb-4 text-sm">
              {formError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              className="form-input"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nama Panggilan</label>
            <input
              type="text"
              className="form-input"
              value={formData.nickname}
              onChange={e => setFormData({ ...formData, nickname: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jenis Kelamin</label>
            <select
              className="form-select"
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value as 'MALE' | 'FEMALE' })}
            >
              <option value="MALE">Laki-laki</option>
              <option value="FEMALE">Perempuan</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tanggal Lahir</label>
            <input
              type="date"
              className="form-input"
              value={formData.birthDate}
              onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tempat Lahir</label>
            <input
              type="text"
              className="form-input"
              value={formData.birthPlace}
              onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pekerjaan</label>
            <input
              type="text"
              className="form-input"
              value={formData.occupation}
              onChange={e => setFormData({ ...formData, occupation: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Ayah (Kandung)</label>
              <select
                className="form-select"
                value={formData.fatherId}
                onChange={e => setFormData({ ...formData, fatherId: e.target.value })}
              >
                <option value="">-- Pilih Ayah --</option>
                {persons
                  .filter(p => p.gender === 'MALE' && p.id !== editingPerson?.id)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} {p.birthDate ? `(${new Date(p.birthDate).getFullYear()})` : ''}
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ibu (Kandung)</label>
              <select
                className="form-select"
                value={formData.motherId}
                onChange={e => setFormData({ ...formData, motherId: e.target.value })}
              >
                <option value="">-- Pilih Ibu --</option>
                {persons
                  .filter(p => p.gender === 'FEMALE' && p.id !== editingPerson?.id)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} {p.birthDate ? `(${new Date(p.birthDate).getFullYear()})` : ''}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={formLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formLoading}
            >
              {formLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
