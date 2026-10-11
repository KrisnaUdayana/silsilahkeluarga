import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const book = JSON.parse(await readFile(new URL('src/content/majapahit.json', root), 'utf8'));
const expectedChapters = ['sampul', 'kata-pengantar', 'daftar-isi', 'tujuan-dan-tyaga', 'surya-majapahit', 'pelinggih', 'piodalan', 'permohonan-dan-harapan'];
assert.equal(book.pages.length, 24, 'Sumber PDF harus tercakup seluruhnya');
const ids = new Set();
const chapters = new Set();
for (const [index, page] of book.pages.entries()) {
  assert.equal(page.pdfPage, index + 1, 'Nomor PDF harus berurutan');
  assert.equal(page.printedPage, index === 0 ? null : index < 4 ? ['i','ii','iii'][index - 1] : String(index - 3));
  assert.ok(page.blocks.length, `Halaman ${page.pdfPage} belum memiliki transkripsi`);
  for (const block of page.blocks) {
    assert.ok(!ids.has(block.id), `ID ganda: ${block.id}`);
    ids.add(block.id);
    assert.ok(expectedChapters.includes(block.chapter), `Bab tidak dikenal: ${block.chapter}`);
    assert.ok(['paragraph', 'heading', 'mantra'].includes(block.type));
    assert.ok(block.text.trim().length > 0);
    assert.ok(!/lorem ipsum|TODO|\[isi di sini\]/i.test(block.text));
    chapters.add(block.chapter);
  }
  const asset = await stat(new URL(`public/sumber/halaman/${String(page.pdfPage).padStart(2, '0')}.webp`, root));
  assert.ok(asset.size > 1000, `Scan ${page.pdfPage} tidak valid`);
}
assert.deepEqual([...chapters], expectedChapters, 'Urutan bab berbeda dari sumber');
for (const [page, expected] of [[10,['tujuan-dan-tyaga','surya-majapahit']], [13,['surya-majapahit','pelinggih']], [20,['pelinggih','piodalan']], [23,['piodalan','permohonan-dan-harapan']]]) {
  assert.deepEqual([...new Set(book.pages[page - 1].blocks.map(block => block.chapter))], expected);
}
assert.equal(book.missingAppendices.length, 4);
assert.ok((await stat(new URL('public/sumber/majapahit-2013.pdf', root))).size > 1000);
console.log(`Lulus: ${book.pages.length} halaman, ${ids.size} blok, ${chapters.size} bagian, 24 scan, batas bab, dan dokumen PDF.`);
