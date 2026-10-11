import { Link, useParams } from 'react-router-dom';
import { book, chapters, chapterPages, pageRange, sourceUrl, scanUrl } from '../content/book';
import { usePageTitle } from '../components/knowledge/usePageTitle';

export function KnowledgeIndexPage() {
  usePageTitle('Sejarah & Tradisi');
  return <>
    <div className="k-breadcrumb"><Link to="/">Beranda</Link> / Sejarah &amp; Tradisi</div>
    <header className="k-page-heading"><p className="k-label">Daftar pembahasan</p><h1>Sejarah &amp; Tradisi</h1><p>Seluruh teks buku, disusun mengikuti urutan aslinya. Pelinggih dan pesimpangan ditempatkan sebagai bagian tersendiri dari Bab II.</p></header>
    <div className="k-index">
      {chapters.map(chapter => <Link key={chapter.slug} to={`/pengetahuan/${chapter.slug}`}>
        <span className="k-label">{chapter.category}</span><div><h2>{chapter.title}</h2><p>{chapter.description}</p></div><span className="k-index-pages">{chapter.slug === 'sampul' ? 'Sampul' : `Hlm. ${pageRange(chapter.slug).printed}`} <span aria-hidden="true">↗</span></span>
      </Link>)}
    </div>
    <p className="k-editor-note">Lampiran yang disebut dalam daftar isi tidak disertakan dalam PDF sumber. <Link to="/sumber#kelengkapan">Lihat kelengkapan dokumen →</Link></p>
  </>;
}

export function KnowledgeArticlePage() {
  const { slug } = useParams();
  const index = chapters.findIndex(chapter => chapter.slug === slug);
  const chapter = chapters[index];
  usePageTitle(chapter?.title ?? 'Pembahasan tidak ditemukan');
  if (!chapter) return <section className="k-empty"><h1>Pembahasan tidak ditemukan</h1><Link className="k-text-link" to="/pengetahuan">Kembali ke daftar pembahasan →</Link></section>;
  const pages = chapterPages(chapter.slug);
  const range = pageRange(chapter.slug);
  const previous = chapters[index - 1];
  const next = chapters[index + 1];

  return <>
    <div className="k-breadcrumb"><Link to="/">Beranda</Link> / <Link to="/pengetahuan">Sejarah &amp; Tradisi</Link> / {chapter.title}</div>
    <header className="k-page-heading"><p className="k-label">{chapter.category}</p><h1>{chapter.title}</h1><p>{chapter.description}</p><small>Halaman cetak {range.printed} · PDF {range.pdf}</small></header>
    <div className="k-reading-grid">
      <aside className="k-reading-nav">
        <details open><summary>Dalam pembahasan ini</summary><nav aria-label="Halaman artikel">{pages.map(page => <a key={page.pdfPage} href={`#halaman-${page.pdfPage}`}>{page.printedPage ? `Halaman ${page.printedPage}` : 'Sampul'} <small>PDF {page.pdfPage}</small></a>)}</nav></details>
        <div className="k-reading-source"><p>Sumber tulisan</p><p>I Nyoman Sukera, 2013</p><Link to={sourceUrl(pages[0].pdfPage)}>Lihat dokumen sumber ↗</Link></div>
        <Link to="/pengetahuan" className="k-text-link">Seluruh pembahasan →</Link>
      </aside>
      <article className="k-article" aria-label={chapter.title}>
        <p className="k-transcription-label">Teks sumber · ejaan penulis dipertahankan</p>
        {pages.map(page => <section className="k-transcribed-page" id={`halaman-${page.pdfPage}`} key={page.pdfPage}>
          <div className="k-page-ref"><span>{page.printedPage ? `Halaman ${page.printedPage}` : 'Sampul'} · PDF {page.pdfPage}</span><Link to={sourceUrl(page.pdfPage)}>Bandingkan scan ↗</Link></div>
          {chapter.slug === 'sampul' && <img className="k-cover" src={scanUrl(1)} alt="Sampul asli Pura Dalem Majapahit, 2013" />}
          {page.blocks.map(block => block.type === 'heading' ? <h2 key={block.id}>{block.text}</h2> : block.type === 'mantra' ? <blockquote className="k-mantra" key={block.id}><p>{block.text}</p></blockquote> : <p key={block.id}>{block.text}</p>)}
          {page.notes.length > 0 && <details className="k-note"><summary>Catatan pembacaan halaman ini</summary>{page.notes.map(note => <p key={note}>{note}</p>)}</details>}
        </section>)}
        <div className="k-article-reference"><p>Rujukan: <cite>{book.title}</cite>, {book.author}, {book.year}. Halaman cetak {range.printed} (PDF {range.pdf}).</p><Link to="/sumber#catatan">Tentang transkripsi dan catatan pemeriksaan →</Link></div>
        <nav className="k-pagination" aria-label="Urutan baca">
          {previous ? <Link to={`/pengetahuan/${previous.slug}`}><small>← Sebelumnya</small><span>{previous.title}</span></Link> : <span />}
          {next ? <Link to={`/pengetahuan/${next.slug}`}><small>Berikutnya →</small><span>{next.title}</span></Link> : <Link to="/pengetahuan"><small>Selesai membaca →</small><span>Daftar pembahasan</span></Link>}
        </nav>
      </article>
      <aside className="k-related"><figure><img src="/logomajapahit.png" alt="Lambang Surya Majapahit" width="224" height="224" /><figcaption>Lambang Surya Majapahit</figcaption></figure><p className="k-label">Pembahasan terkait</p><nav aria-label="Pembahasan terkait">{chapters.filter(item => !['sampul','daftar-isi',chapter.slug].includes(item.slug)).map(item => <Link key={item.slug} to={`/pengetahuan/${item.slug}`}>{item.title}</Link>)}</nav></aside>
    </div>
  </>;
}
