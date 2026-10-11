import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { book, chapters, pdfUrl, scanUrl, sourceUrl } from '../content/book';
import { usePageTitle } from '../components/knowledge/usePageTitle';

export function SourcePage() {
  usePageTitle('Sumber');
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const value = Number(params.get('halaman') || 1);
  const pageNumber = Number.isInteger(value) && value >= 1 && value <= book.pages.length ? value : 1;
  const page = book.pages[pageNumber - 1];
  const selectPage = (number: number) => navigate(sourceUrl(number), { preventScrollReset: true });
  const reviewPages = book.pages.filter(item => item.notes.length > 0);

  return <>
    <div className="k-breadcrumb"><Link to="/">Beranda</Link> / Sumber</div>
    <header className="k-page-heading"><p className="k-label">Dokumen rujukan</p><h1>Sumber tulisan</h1><p><cite>Pura Dalem Majapahit</cite><br />{book.author} · {book.year}</p><small>Sampul: Semarapura Kelod Kangin · Kata pengantar: Klungkung, 2 April 2013</small></header>
    <section className="k-source-intro"><div><h2>Tentang dokumen</h2><p>Materi pengetahuan pada website ini berasal dari buku karya Drs. I Nyoman Sukera, MM. PDF yang tersedia memuat 24 halaman: sampul, kata pengantar, daftar isi, dan halaman cetak 1–20.</p><p>Teks lengkap dapat dibaca pada halaman Sejarah &amp; Tradisi. Scan asli disediakan untuk memeriksa tulisan, ejaan, dan gambar pada setiap halaman.</p><div className="k-inline-links"><Link to="/pengetahuan/kata-pengantar">Baca teks lengkap →</Link><a href={pdfUrl} target="_blank" rel="noreferrer">Buka PDF asli ↗</a><a href={pdfUrl} download>Unduh PDF</a></div></div><aside id="kelengkapan"><h2>Lampiran yang belum tersedia</h2><p>Daftar isi menyebut lampiran berikut, tetapi halamannya tidak ada dalam PDF ini:</p><ul>{book.missingAppendices.map(item => <li key={item}>{item}</li>)}</ul><p>Silsilah interaktif pada website merupakan fitur tersendiri, bukan transkripsi lampiran yang belum tersedia.</p></aside></section>
    <section className="k-scan-section" id="scan" aria-label="Pembaca scan asli">
      <h2>Scan halaman asli</h2>
      <div className="k-scan-controls"><button onClick={() => selectPage(pageNumber - 1)} disabled={pageNumber === 1}>← Sebelumnya</button><label>Halaman PDF <select value={pageNumber} onChange={event => selectPage(Number(event.target.value))}>{book.pages.map(item => <option key={item.pdfPage} value={item.pdfPage}>{item.pdfPage} / 24 — {item.printedPage ? `cetak ${item.printedPage}` : 'sampul'}</option>)}</select></label><button onClick={() => selectPage(pageNumber + 1)} disabled={pageNumber === 24}>Berikutnya →</button></div>
      <figure className="k-scan"><a href={scanUrl(pageNumber)} target="_blank" rel="noreferrer" aria-label={`Perbesar scan halaman PDF ${pageNumber}`}><img key={pageNumber} src={scanUrl(pageNumber)} alt={`Scan asli halaman PDF ${pageNumber}${page.printedPage ? `, halaman cetak ${page.printedPage}` : ', sampul'}`} /></a><figcaption aria-live="polite">PDF {pageNumber} dari 24 · {page.printedPage ? `Halaman cetak ${page.printedPage}` : 'Sampul'} · Klik gambar untuk memperbesar</figcaption></figure>
      <div className="k-inline-links">{[...new Set(page.blocks.map(block => block.chapter))].map(slug => <Link key={slug} to={`/pengetahuan/${slug}#halaman-${pageNumber}`}>Baca teks: {chapters.find(chapter => chapter.slug === slug)?.title} →</Link>)}</div>
    </section>
    <section className="k-source-notes" id="catatan"><h2>Catatan transkripsi</h2><p>Transkripsi diperiksa secara visual terhadap scan. Pemenggalan baris dirapikan; ejaan, variasi istilah, dan penomoran sumber dipertahankan. Penanda halaman mengikuti scan sehingga kalimat yang melewati batas halaman dapat berlanjut pada bagian berikutnya.</p><p>Mantram dan sejumlah istilah khusus masih memerlukan penelaahan keluarga atau pemangku. Catatan di bawah menunjukkan bagian yang perlu diperiksa; teks tidak dinyatakan sebagai edisi koreksi.</p><div className="k-review-list">{reviewPages.map(item => <details key={item.pdfPage}><summary>PDF {item.pdfPage} · {item.printedPage ? `halaman ${item.printedPage}` : 'sampul'}</summary>{item.notes.map(note => <p key={note}>{note}</p>)}<Link to={sourceUrl(item.pdfPage)}>Lihat scan halaman ini ↗</Link></details>)}</div></section>
    <section className="k-coverage"><h2>Peta isi dokumen</h2><p>Halaman dengan dua pembahasan ditautkan ke kedua bagian, sesuai pergantian judul pada sumber.</p><div className="k-table-scroll"><table><caption>Cakupan seluruh 24 halaman PDF</caption><thead><tr><th scope="col">PDF</th><th scope="col">Cetak</th><th scope="col">Teks di website</th><th scope="col">Sumber</th></tr></thead><tbody>{book.pages.map(item => <tr key={item.pdfPage}><td>{item.pdfPage}</td><td>{item.printedPage ?? 'Sampul'}</td><td>{[...new Set(item.blocks.map(block => block.chapter))].map(slug => <Link key={slug} to={`/pengetahuan/${slug}#halaman-${item.pdfPage}`}>{chapters.find(chapter => chapter.slug === slug)?.title}</Link>)}</td><td><Link to={sourceUrl(item.pdfPage)}>Scan {item.pdfPage} ↗</Link></td></tr>)}</tbody></table></div></section>
  </>;
}
