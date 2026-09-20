# Silsilah Keluarga (Family Tree System)

Aplikasi berbasis web untuk visualisasi dan dokumentasi silsilah keluarga lintas generasi.

## ✨ Fitur Utama

- 🌳 **Visualisasi Pohon Silsilah** - Tampilan interaktif dengan zoom/pan
- 👥 **Manajemen Data Keluarga** - CRUD anggota keluarga (Admin)
- 🔐 **Kontrol Akses** - Role-based (Admin/Viewer)
- 💑 **Relasi Keluarga** - Orang tua, anak, dan pasangan
- 📷 **Galeri Foto** - Upload foto anggota
- 📊 **Dashboard Statistik** - Ringkasan data keluarga

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MySQL 8+ or compatible database
- npm/yarn

### Backend Setup

```bash
cd backend
npm install

# Configure database in .env
# DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/silsilah_keluarga"

npm run db:generate   # Generate Prisma client
npm run db:push       # Create/update tables from schema.prisma
npm run db:seed       # Seed sample data
npm run dev           # Start server (port 3001)
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev           # Start app (port 5173)
```

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@silsilah.local | admin123 |
| Viewer | rizky@silsilah.local | viewer123 |

## 📁 Project Structure

```
├── backend/          # Express + Prisma API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   └── prisma/
│
└── frontend/         # React + Vite
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        └── store/
```

## 🛠 Tech Stack

**Backend:** Node.js, Express, TypeScript, Prisma, MySQL, JWT

**Frontend:** React, TypeScript, Vite, Zustand, React Router

## 📖 API Documentation

API tersedia di `http://localhost:3001/api`

- `POST /auth/login` - Login
- `GET /persons` - List persons
- `GET /persons/tree` - Tree data
- `POST /persons` - Create (Admin)
- `GET /stats` - Statistics (Admin)

## 📝 License

MIT
