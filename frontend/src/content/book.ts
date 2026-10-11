import source from './majapahit.json';

export const book = source;
export const pdfUrl = '/sumber/majapahit-2013.pdf';
export const scanUrl = (page: number) => `/sumber/halaman/${String(page).padStart(2, '0')}.webp`;
export const sourceUrl = (page: number) => `/sumber?halaman=${page}#scan`;

export const chapters = [
  { slug: 'sampul', title: 'Sampul', category: 'Dokumen', description: 'Identitas dan sampul asli buku Pura Dalem Majapahit.' },
  { slug: 'kata-pengantar', title: 'Kata Pengantar', category: 'Tentang pura', description: 'Pengantar penulis tentang Pura Dalem Majapahit dan harapan bagi keluarga serta pemedek.' },
  { slug: 'daftar-isi', title: 'Daftar Isi', category: 'Dokumen', description: 'Daftar pembahasan dan lampiran sebagaimana tercantum dalam buku.' },
  { slug: 'tujuan-dan-tyaga', title: 'Tujuan dan Tyaga', category: 'Bab I', description: 'Tujuan hidup, yadnya, penyucian, Catur Purusaartha, serta pemaknaan Pura Dalem dan Dalem Pura.' },
  { slug: 'surya-majapahit', title: 'Surya Majapahit dan Panca Mahabhuta', category: 'Bab II · Lambang & tattwa', description: 'Bhuana Agung, Bhuana Alit, Dewata Nawa Sanga, dan Panca Mahabhuta dalam uraian penulis.' },
  { slug: 'pelinggih', title: 'Pelinggih dan Pesimpangan', category: 'Lanjutan Bab II', description: 'Uraian bangunan suci, pesimpangan, dan mantram. Bagian ini merupakan lanjutan Bab II dalam buku.' },
  { slug: 'piodalan', title: 'Piodalan Satwika Yadnya Ring Pura Dalem Majapahit', category: 'Bab III', description: 'Pelaksanaan piodalan, banten, dan aturan pemedek sebagaimana dijelaskan dalam buku.' },
  { slug: 'permohonan-dan-harapan', title: 'Permohonan dan Harapan', category: 'Bab IV', description: 'Bunga Hati, bhakti, kerukunan keluarga, dan kasih terhadap sesama makhluk hidup.' },
];

export const chapterPages = (slug: string) => book.pages
  .map(page => ({ ...page, blocks: page.blocks.filter(block => block.chapter === slug) }))
  .filter(page => page.blocks.length > 0);

export function pageRange(slug: string) {
  const pages = chapterPages(slug);
  const first = pages[0];
  const last = pages[pages.length - 1];
  return {
    printed: first.printedPage ? `${first.printedPage}${first !== last ? `–${last.printedPage}` : ''}` : 'Sampul',
    pdf: `${first.pdfPage}${first !== last ? `–${last.pdfPage}` : ''}`,
  };
}
