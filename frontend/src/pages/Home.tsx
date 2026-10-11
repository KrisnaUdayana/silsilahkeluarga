import { Link } from 'react-router-dom';
import { usePageTitle } from '../components/knowledge/usePageTitle';

export function HomePage() {
  usePageTitle('Beranda');
  return <>
    <section className="k-hero">
      <div>
        <p className="k-label">Pura Dalem Majapahit / Semarapura, Klungkung</p>
        <h1>Pura Dalem<br />Majapahit</h1>
        <p className="k-intro">Pengetahuan tentang pura, kawitan leluhur,<br className="k-desktop-break" /> pelinggih, dan pelaksanaan piodalan.</p>
        <div className="k-inline-links"><a href="#tentang">Tentang pura ↓</a><Link className="k-olive" to="/tree">Pohon silsilah ↗</Link></div>
      </div>
      <nav className="k-topics" aria-label="Pembahasan utama">
        <p className="k-label">Pembahasan</p>
        <Link to="/pengetahuan/surya-majapahit"><span><strong>Surya Majapahit</strong><small>Lambang dan konsep pemujaan</small></span><span aria-hidden="true">↗</span></Link>
        <Link to="/pengetahuan/pelinggih"><span><strong>Pelinggih dan pesimpangan</strong><small>Nama, fungsi, dan kaitannya</small></span><span aria-hidden="true">↗</span></Link>
        <Link to="/pengetahuan/piodalan"><span><strong>Piodalan</strong><small>Pelaksanaan dan jenis upacara</small></span><span aria-hidden="true">↗</span></Link>
        <Link className="k-all-topics" to="/pengetahuan">Seluruh pembahasan →</Link>
      </nav>
    </section>
    <section className="k-about" id="tentang">
      <p className="k-label">Tentang pura</p>
      <div><h2>Pura dan kawitan leluhur</h2>
        <p>Dalam tulisan I Nyoman Sukera, Pura Dalem Majapahit dijelaskan sebagai tempat suci bagi pretisentana atau keturunan Kawitan Leluhur Majapahit. Pembahasannya mencakup pemaknaan pura, konsep Surya Majapahit, serta bangunan suci dan pelaksanaan upacara.</p>
        <Link className="k-text-link" to="/pengetahuan/kata-pengantar">Baca pengantar tentang pura →</Link>
      </div>
    </section>
    <section className="k-symbol">
      <div><p className="k-label">Lambang &amp; tattwa</p><h2>Surya Majapahit</h2>
        <p>Surya Majapahit digunakan dalam pembahasan tattwa pembangunan tempat suci. Buku tersebut mengaitkannya dengan Bhuana Agung, Bhuana Alit, dan Dewata Nawa Sanga.</p>
        <p>Bhuana Agung dan Bhuana Alit dijelaskan bersama Panca Mahabhuta: Pretiwi, Teja, Apah, Bayu, dan Akasa.</p>
        <Link className="k-text-link" to="/pengetahuan/surya-majapahit">Baca penjelasan Surya Majapahit →</Link>
      </div>
      <figure><img src="/logomajapahit.png" alt="Lambang Surya Majapahit yang digunakan pada website" width="350" height="350" loading="lazy" /><figcaption>Lambang yang digunakan pada website ini.</figcaption></figure>
      <aside className="k-terms"><p className="k-label">Istilah</p><dl>
        <div><dt>Bhuana Agung</dt><dd>Alam semesta</dd></div>
        <div><dt>Bhuana Alit</dt><dd>Diri manusia</dd></div>
        <div><dt>Panca Mahabhuta</dt><dd>Lima unsur dalam pembahasan buku</dd></div>
      </dl></aside>
    </section>
    <section className="k-pair">
      <div><p className="k-label">Pelinggih</p><h2>Pelinggih dan pesimpangan</h2><p>Pembahasan bangunan suci, dari Padmasari dan Gedong Artha hingga Bale Kulkul dan Bale Pegongan.</p><Link className="k-text-link" to="/pengetahuan/pelinggih">Lihat pembahasan pelinggih →</Link></div>
      <div><p className="k-label">Piodalan</p><h2>Piodalan di pura</h2><p>Menurut buku, piodalan dilaksanakan pada hari Paing Galungan. Jenis pelaksanaannya dijelaskan sesuai situasi, kondisi, dan keuangan pengempon.</p><Link className="k-text-link" to="/pengetahuan/piodalan">Baca tentang piodalan →</Link></div>
    </section>
    <section className="k-family"><h2>Silsilah keluarga</h2><p>Hubungan orang tua, pasangan, dan keturunan.</p><Link to="/tree">Lihat silsilah ↗</Link></section>
  </>;
}
