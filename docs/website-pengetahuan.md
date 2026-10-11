# Website pengetahuan Pura Dalem Majapahit

## Hasil

- Beranda mengikuti referensi `design/pengetahuan-majapahit`.
- `/pengetahuan` memuat urutan bacaan; delapan bagian mencakup sampul, kata pengantar, daftar isi, dan seluruh pembahasan PDF.
- `/pengetahuan/:slug` menampilkan teks lengkap, rujukan halaman cetak/PDF, catatan pembacaan, dan navigasi sebelumnya/berikutnya.
- `/sumber` menyediakan pembaca 24 scan, unduhan PDF asli, peta cakupan, serta catatan lampiran yang tidak tersedia.
- Materi disimpan pada `frontend/src/content/majapahit.json`; metadata bagian ada pada `frontend/src/content/book.ts`.
- Gaya baru seluruhnya berada di bawah `.knowledge`, pada stylesheet terpisah.

## Menjalankan

Dari `frontend`, jalankan `npm run dev`, lalu buka http://localhost:5173.
Halaman pengetahuan dan sumber dapat dibaca tanpa backend/database.

Untuk silsilah, anggota, login, dan admin, aktifkan MySQL dengan konfigurasi proyek yang sudah ada, kemudian jalankan `npm run dev` dari `backend`.
Tidak perlu menjalankan seed, reset database, atau migrasi untuk perubahan ini.

## Validasi

- Build TypeScript/Vite: lulus.
- ESLint frontend: lulus.
- `node scripts/check-knowledge.mjs`: lulus untuk 24 halaman, 107 blok, delapan bagian, 24 scan, dan batas pembahasan.
- Beranda desktop dan HP diperiksa secara visual. Artikel, mantram, tautan halaman, dan pembaca scan diperiksa pada browser.
- Berkas TreeView.tsx, index.css, Navbar.tsx, dan Layout.tsx tetap identik dengan sebelum pengerjaan (SHA-256 dibandingkan).
- Pada pemeriksaan terakhir, API silsilah belum dapat memuat data karena MySQL pada localhost:3306 tidak aktif. Interaksi pohon dengan data langsung belum dapat diverifikasi pada sesi terakhir. Tidak ada perubahan backend atau database.

## Materi yang perlu ditelaah

Lihat `inventaris-materi.md` atau `/sumber#catatan`. Semua halaman sumber tersedia, tetapi ejaan sejumlah mantram/istilah tetap memerlukan penelaahan keluarga atau pemangku. Tulisan kecil pada lambang sampul tersedia dalam scan, belum ditranskripsi karena resolusi.

Empat lampiran yang disebut daftar isi tidak ada pada PDF sumber: silsilah Nang Djegdjeg, pengempon, pengurus, serta fotokopi sertifikat tanah. Website tidak mengarang isi lampiran tersebut.
