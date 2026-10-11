"""Transkripsi manual berdasarkan scan, dipisah per halaman PDF dan pembahasan."""
import json
from pathlib import Path
root=Path(r'D:/Project/Silsilah Keluarga')
pages=[]
def page(n,printed,chapter,text,notes=None):
    blocks=[]
    for part in text.strip().split('\n\n'):
        kind='paragraph'
        if part.startswith('## '):kind='heading';part=part[3:]
        if part.startswith('> '):kind='mantra';part=part[2:]
        blocks.append({'id':f'pdf-{n}-{len(blocks)+1}','chapter':chapter,'type':kind,'text':part.strip()})
    pages.append({'pdfPage':n,'printedPage':printed,'blocks':blocks,'notes':notes or []})
def more(chapter,text):
    p=pages[-1]
    for part in text.strip().split('\n\n'):
        kind='paragraph'
        if part.startswith('## '):kind='heading';part=part[3:]
        if part.startswith('> '):kind='mantra';part=part[2:]
        p['blocks'].append({'id':f'pdf-{p["pdfPage"]}-{len(p["blocks"])+1}','chapter':chapter,'type':kind,'text':part.strip()})

page(1,None,'sampul','''## PURA DALEM MAJAPAHIT

DRS. I NYOMAN SUKERA, MM

SEMARAPURA KELOD KANGIN

2013''',['Tulisan kecil pada lambang sampul tidak ditranskripsi karena resolusi scan; seluruh lambang tersedia pada scan.'])
page(2,'i','kata-pengantar','''## KATA PENGANTAR

Om Swastyastu,

“Om Na Ma Si Wa Ya, Om” Pura Dalem Majapahit mengandung makna Pura yang ada di Bhuana Agung dan di Bhuana Alit (di dalam diri sendiri). Tattwa yang digunakan dalam pembangunan tempat suci di Pura dalem Majapahit adalah Surya Majapahit. Pura Dalem Majapahit adalah tempat suci untuk menyucikan pikiran, perkataan dan perilaku Pretiesntana / Keturunan Kawitan Leluhur Majapahit.

Om, Sang Hyang Widhi, tuntunlah kami dari jalan yang sesat kejalan yang benar, dari jalan yang gelap kejalan yang terang, hindarkan kami dari kematian menuju ke kehidupan yang sejati.

Permohonan dan Harapan akhir dari Krama Pengempon dan Pemedek yang tangkil ke Pura Dalem Majapahit untuk memperoleh Panugrahan Rasa Bhakti, Tresna lan Asih. Bhakti kehadapan Sang Hyang Widhi dan Leluhur Kawitan Majapahit untuk manah subakti (keyakinan, kewajiban dan''')
page(3,'ii','kata-pengantar','''keihlasan), Tresna sesama keluarga, rukun dan damai tidak memelihara rasa dendam sesama keluarga dan pretiesntana pasemetonan Leluhur Majapahit. Asih terhadap sarwa prani di lingkungan Pura Dalem dan Dalem Pura (sarwa prani hitan karah). Hasil akhir dari setiap yadnya adalah Santhi (Damai dihati, Damai di Keluarga dan Damai dalam Kehidupan (didunia dan di akhirat).

Om Santhi, Santhi, Santhi Om.

Jln. Kresna No.9. Semarapura,

Klungkung, 2 April 2013

Pemangku.

(Drs. I Nyoman Sukera.MM)''')
page(4,'iii','daftar-isi','''## DAFTAR ISI

KATA PENGANTAR — i

DAFTAR ISI — iii

I. Tujuan dan Tiaga — 1

II. Surya Majapahit dan Panca Mahabhuta — 6

III. Piodalan Satwika Yadnya Ring Pura Dalem Majapahit — 16

IV. Permohonan dan Harapan — 19

LAMPIRAN:

Silsilah Nang Djegdjeg

Pengempon Pura Dalem Majapahit

Pengurus Pura Dalem Majapahit

Foto copi Sertipikat Tanah Pura Dalem Majapahit.''',['Keempat lampiran disebutkan dalam daftar isi, tetapi tidak terdapat dalam PDF 24 halaman ini.'])
page(5,'1','tujuan-dan-tyaga','''## PRASASTI KAWITAN LELUHUR MAJAPAHIT

## I. TUJUAN DAN TYAGA

Tujuan Hidup Pretisentana Leluhur Majapahit di Bumi ini (Mercapada) adalah untuk mencapai kesejahteraan lahir dan kebahagiaan batin (Moksahartam Jagathita chaiti Dharma). Tiga Usaha (Tyaga) yang dilakukan Keturunan-Ku adalah Yadnya, Dana (Investasi) dan Tapa (Kesederhanaan dalam kehidupan).. Keturunan-Ku wajib melakukan yadnya karena Sang Hyang Prajapati menciptakan manusia dengan yadnya dan bersabda dengan yadnya engkau akan berkembang biak dan yadnya akan menjadi kamadhuk dari keinginan-keinginan-Mu. Ayah dan Ibu melahirkan anaknya juga atas dasar yadnya. Yadnya adalah semua perbuatan darma yang dilakukan dengan ketulus ikhlasan dan kesadaran untuk melakukan suatu persembahan kepada Sang Hyang Widhi (Tuhan). Perputaran roda yadnya (Cakra Yadnya) yang sifatnya timbal balik''',['Ejaan “Moksahartam Jagathita chaiti Dharma” mengikuti scan; mohon penulis/keluarga memeriksa sebelum menormalkan istilah.'])
page(6,'2','tujuan-dan-tyaga','''artinya Sang Hyang Prajapati (Widhi) beryadnya menciptakan manusia dan alam beserta isinya (kamaduk) oleh karena itu manusia wajib beryadnya kepada-Nya. Tujuan Pretisentana beryadnya adalah untuk membayar tiga hutang (Tri Rnam) yaitu 1. Hutang kepada Sang Hyang Widhi (Prajapati) dibayar dengan 1).Dewa Yadnya dan 2).Bhuta Yadnya. 2. Hutang kepada Leluhur dibayar dengan 3). Manusa Yadnya dan 4). Pitra Yadnya. 3. Hutang kepada para ilmuan (Rsi) dibayar dengan 5). Rsi yadnya (kelimanya disebut Panca yadnya). Tiga perbuatan ini dapat melahirkan orang-orang suci dan bijaksana.

Perbuatan yadnya meliputi: 1. Belajar dan mengajar, 2. Memelihara alam lingkungan, 3. Mengendalikan hawa nafsu dan panca indriya, 4.Membaca Kitab Suci Weda dan sastra Agama, 5. Saling Memelihara dan Mengasihi sesama mahluk hidup, 5. Menolong orang sakit, mengentaskan kemiskinan dan menghibur orang yang sedang ditimpa kesusahan. Jadi yadnya itu bukanlah terbatas''',['Penomoran 5 muncul dua kali pada daftar perbuatan yadnya dalam sumber; dipertahankan.'])
page(7,'3','tujuan-dan-tyaga','''kegiatan upacara keagamaan saja. Sesajen dan alat-alat upacaranya merupakan bagian dari yadnya.

Ada lima unsur penyucian yang dikandung dalam upacara agama (Bhuana Agung):1. Mantram yaitu doa-doa yang harus diucapkan oleh umat kebanyakan, Pinandita, Pendeta sesuai dengan tingkatannya. 2.Yantra yaitu alat atau simbul-simbul keagamaan yang diyakini mempunyai kekuatan spiritual untuk meningkatkan kesucian. 3.Tantra yaitu kekuatan suci dalam diri yang dibangkitkan dengan cara-cara yang ditetapkan dalam kitab suci. 4. Yadnya yaitu pengabdian yang tulus ihlas atas dasar kesadaran untuk dipersembahkan. Ketulusan ini akan dapat meningkatkan kesucian. 5. Yoga artinya mengendalikan gelombang-gelombang pikiran untuk selalu berpikir positip, kreatip, cerdas dan bijaksana. Penyucian di Buana Alit (Pada Diri Manusia): 1. Badan Kotor dibersihkan dengan air. 2. Pikiran kotor disucikan dengan kejujuran, kebijaksanaan yang benar dan Pengetahuan. 3.''')
page(8,'4','tujuan-dan-tyaga','''Jiwa (Atman) kotor disucikan dengan Tapa (kesederhanaan dalam kehidupan), Brata (pengendalian diri), Yoga (peningkatan kesadaran diri) dan Semadhi (mengusahakan kebahagian yang hakiki).

Empat Pedoman Dasar Hidup Keturunan-ku (Catur Purusaartha): 1. Dharma selalu berbuat benar dan bijaksana. Terdapat Empat Prinsip Dharma yaitu {Tapa (kesederhanaan hidup), Saucam (kesucian dan kebersihan), Satyam (kejujuran) dan Prema (cinta kasih)} 2. Kama: Dorongan (motivasi) untuk berbuat sesuatu. 3. Artha: kebutuhan materi/uang/arta benda. 4. Moksha: Kesejahteraan lahir dan kebahagian batin. Untuk mencapai Moksha (Kebebasan yang hakiki, kemahardikaan) harus dilandasi Dharma, Kama dan Arta. Arta diperoleh dengan jalan Dharma dan termotivasi untuk memperolehnya (Kama). Tanpa Kama atau termotivasi untuk memperoleh Arta manusia akan menjadi peminta-minta atau pengemis. Kama dilakukan atas dasar Dharma dan Arta. Mana''')
page(9,'5','tujuan-dan-tyaga','''kita bisa berbuat sesuatu (memenuhi nafsu pisik dan sex) tanpa mempunyai Arta dan dilandasi Dharma.

Cara untuk mencapai tujuan hidup. Keturunan-Ku hendaknya dapat menyeimbangkan, mengharmoniskan, menyatukan antara Bhuwana Agung (Ke-Jaba, keluar) dengan Bhuana Alit (Ke-Dalem). Pura Dalem bermakna Pura yang ada di Bhuana Agung (diluar diri sendiri) dan Dalem Pura juga bermakna Pura yang ada di Bhuana Alit (didalam diri sendiri). Sebagai mahluk individu manusia melaksanakan Niwerti Kedarman (cara beragama individu atau Cara beragama ke Dalem (kejero) dengan mempersembahkan kepada Sang Hyang Widhi ke 8 Bunga hati yang ada dalam diri setiap manusia yaitu 1. Kasih dan Belaskasihan, 2. Tanpa Kekerasan, 3. Pengendalian Hawa nafsu, 4. Kebenaran, 5. Kesabaran dan 6. Ketabahan, 7. Keuletan, 8. Amal dan Pengorbanan). Sebagai mahluk sosial Keturunan-Ku melaksanakan Prawerti Kedarman (beragama dengan komunitas sosial atau kelompok di Sanggah/ Merajan dan di''')
page(10,'6','tujuan-dan-tyaga','''Pura) dengan cara beragama Keluar (kejaba atau datang ke Sanggah/Merajan atau ke Pura) dengan merangkai bunga atau bebantenan, memandikan patung dengan air suci, membakar dupa dan bermacam-macam bentuk pemujaan yang lainnya kepada Sang Hyang Widhi akan menghasilkan kepuasan (Trupti) yang sifatnya sementara. Kuatkanlah keyakinan (Srada)-Mu kepada Sang Hyang Widhi bakti kehadapan Bhatara Bhatari yang di stanakan di Pura Dalem Majapahit untuk ngeraketang, mengharmoniskan dan merukunkan pretiesntana keturunan Majapahit antara kekuatan Bhuana Alit (Sang Diri atau Atman) dengan Bhuana Agung (Bhatara Bhatari) yang di Stanakan di Pura Dalem Majapahit, sehingga persembahan-Mu menjadi lebih sempurna. Sehingga Hasil akhir suatu persembahan ke Dalem dan ke Pura Dalem Majapahit adalah Santhi (Damai).''')
more('surya-majapahit','''## II. SURYA MAJAPAHIT DAN PANCA MAHABHUTA''')
page(11,'7','surya-majapahit','''Pemujaan Bhuana Agung dan Bhuana Alit disimbulkan dengan stana Pura Dalem dan Dalem Pura menggunakan konsep Surya Majapahit. Surya Majapahit menampilkan tata letak para Dewa Hindu disembilan arah mata angin disebut Dewata Nawa Sanga dengan mantram “I Sa Ba Ta A Na Ma Si Wa Ya”. Yang distanakan di Bhuana Alit atau Dalem Pura adalah Atman yang ada didalam diri sendiri sering disebut Jiwatman atau Sang Diri. Bhuana Agung dan Bhuana Alit bahan bakunya Panca Mahabhuta dimana proses pembentukan dan sistim kerjanya bersifat Maya. Panca Mahabhuta di Bhuana Agung dan di Bhuana Alit sebagai berikut: 1. Dari Pretiwi lahir bumi atau tanah, badan atau tubuh. 2. Dari Teja lahir cahaya matahari, bulan dan bintang, mata sebagai alat penglihatan. 3. Dari Apah lahir air. 4. Dari Bayu lahir angin, nafas. 5. Dari Akasa lahir suara. Setelah alam semesta ini tercipta, Atman memasuki tubuh tumbuh-tumbuhan lahirlah semua jenis tumbuh-tumbuhan [eka pramana]. Memasuki tubuh binatang [hewan]''')
page(12,'8','surya-majapahit','''lahirlah semua jenis binatang [dwi pramana] dan terakhir memasuki tubuh manusia lahirlah manusia [tri pramana]. Diantara ketiga ciptaan Sang Hyang Widhi ini manusialah yang paling sempurna karena manusia mempunyai Sabda, Bayu dan Idep [Tripramana]. Hewan hanya mempunyai Bayu dan Sabda [Dwipramana], sedangkan tumbuh-tumbuhan hanya mempunyai Bayu [Ekapramana]. Dalam wujud manusia Atman lahir di Bumi, tinggal dalam badan Jasmani, menyusup dalam sad rasa yang merupakan sari-sari Panca Maha Bhuta. Dalam penjelmaan sebagai manusia ia terlibat dalam berbagai aktifitas, dalam suka, duka lara dan pati. Ia memberi dan menerima hasil-hasil aktifitas kehidupan itu apakah hasilnya baik atau buruk. Hasil itu mengendap, menghiasi Atman dan membawa Atman kesorga atau keneraka. Hasil endapan itulah disebut karma wesana yang menentukan nasib kelahiran seseorang. Ada lahir bahagia, ada yang sengsara, ada kelahiran dewa, daitya dan sebagainya. Dalam konsep Surya Majapahit sebagai lambang Kerajaan Majapahit''')
page(13,'9','surya-majapahit','''menampilkan tata letak Para Dewa Hindu di Bhuana Agung (Pura Dalem) dan di Bhuana Alit (Dalem Pura). Leluhur-Mu mewujud nyatakan kedalam bentuk Pesimpangan / Stana / Pelinggih agar Pretiesntana Kawitan Leluhur Majapahit Bhakti, Tresna lan Asih (Damai dihati, Damai dalam keluarga dan Damai dalam Kehidupan (di Bumi maupun diakhirat). Bhakti ring Sang Hyang Widhi, Bhakti ring Leluhur (Bhatara Bhatari Dalem Majapahit) yang diwujud nyatakan dalam bangunan suci:''')
more('pelinggih','''Bhatara Dalem Majapahit dan Bhatari Dalem Majapahit (Dewa Ayu Pesaren Sari) adalah Leluhur-Mu dari Majapahit, sebagai simbul Ardenareswari Penguasa di arah tengah (Madya, Bhuah loka), bersenjata Padma, kendaraannya Lembu Nandini, saktinya Dewi Parwati (Dewi Durga), Aksara Sucinya ”I” dan ”Ya” dan menempati alat kelamin Laki-laki (Yoni) dan alat kelamin Wanita (Lingga) dalam tubuh manusia. Mantram Bhatara Dalem Majapahit:

> Om nama dewaya, ciwa sarwaya,''')
pages[-1]['notes']=['Nama “Dewa Ayu Pesaren Sari” (hlm. 9–10) dan “Dewa Ayu Pasaren Sari” (hlm. 17) mengikuti variasi dalam scan. Sebutan Yoni/Lingga ditampilkan sesuai sumber, tanpa koreksi tafsir.']
page(14,'10','pelinggih','''> isana dipataya namah, cripasupati ya namah swaha.

Dan Mantram Bhatari Dalem Majapahit (Dewa Ayu Pesaren Sari)

> Om ciwatma tattwatma sudhami swaha ya namah.

Atau bila disatukan Mantram:

> Om nama dewa aditanaya sarwa viapi waiswaya, Padmasana eka Prastitaya Ardanreswari Ya Namo namah Swaha.

Sinar suci Sang Hyang Siwa Raditya (dari Shuah Loka) menyinari Keturunan-Ku agar selalu berpikir bijaksana, cerdas, kreatif dan positif Leluhur-Mu menstanakan bangunan suci Padmasari (Sanggar Agung) sebagai Pesimpangan Pura Penataran Agung di Besakih stana Sang Hyang Widhi: penguasa arah timur laut (Ersanya), bersenjata Trisula, kendaraanya Wilmana, saktinya Dewi Mahadewi, Aksara Sucinya ”Wa” dan menempati Ineban dalam Tubuh manusia. Mantram:

> Om Cri-cri Dewa Jagatnatha, Kusumajali sarwa sastra, Om Anantya maitriwatraka, mahati bhukti ya namah swaha.''',['Mantram dan istilah “Ineban” ditranskripsi sesuai pembacaan scan; ejaan khusus perlu penelaahan keluarga/pemangku.'])
page(15,'11','pelinggih','''Agar hidup ini lebih stabil dan mantap Leluhur-Mu menstanakan Pesimpangan Pura Dasar Bhuwana di Gelgel (di Bhur Loka) sebagai stana Bhatara Gana, penguasa di dasar Bhuwana, bersenjata Kapak dan Lontar, kendaraannya Manusia berkepala Gajah, saktinya Dewa Gana dan menempati otak dalam tubuh manusia. Mantram:

> Om Hrang Hring sah Bhatara Giri Putri, Ciwa Bhumi Maha Sakti ya namah.

Keturunan-Ku dijaga dan dilindungi dalam kehidupan ini (di Bhuah Loka) oleh kekuatan energi Dewa/Dewi/Bhatara/Bhatari dari arah penjuru mata angin:

Pesimpangan Pura Lempuyang: Bhatara Iswara, penguasa di arah timur (Purwa), bersenjata Bajra, kendaraanya Gajah, saktinya Dewi Uma, aksara sucinya ”Sa” dan menempati Pepusuh dalam Tubuh manusia. Mantram:

> Om Geng Giri jaya namah, Om Agni Jaya wijaya Jagatpati ya namah swaha, Om Manki Jati ya namah.''',['Pembacaan “Manki Jati” pada mantram perlu diperiksa; scan tetap disediakan sebagai rujukan.'])
page(16,'12','pelinggih','''Pesimpangan Pura Andakasa: Bhatara Brahma, penguasa di arah selatan (Daksina) bersenjata Gada, kendaraannya Angsa, saktinya Dewi Saraswati, aksara sucinya ”Ba“ dan menempati Hati dalam Tubuh Manusia. Mantram:

> Om Indra Dewata ya namah swaha.

Pesimpangan Pura Watukaru: Bhatara Mahadewa: penguasa di arah barat (Pascima), bersenjata Nagapasa, kendaraannya Naga, saktinya Dewi Sanci, aksara sucinya ”Ta” dan menempati Ungsilan dalam Tubuh manusia. Mantram:

> Om Jaya nairitri namo namah swaha.

Pesimpangan Pura Batur: Bhatara Wisnu: penguasa di arah utara (Uttara), bersenjata Cakra Sudhasana, kendaraannya Garuda, saktinya Dewi Sri, aksara sucinya ”A” dan menempati Ampru dalam Tubuh Manusia. Mantram:

> Om Cri Dewi Danhu jiwamrta sabumi ya pariprna ya namah swaha.

Pesimpangan Pura Dalem Ped: Bhatara Ratu Telenganing Segara penguasa di tengah laut''',['Ejaan mantram, khususnya “nairitri”, “jiwamrta”, dan “pariprna”, perlu penelaahan keluarga/pemangku.'])
page(17,'13','pelinggih','''(Samudra), bersenjata Nagendra, kendaraannya kura-kura, saktinya Dewa Baruna sebagai penguasa arah tenggara aksara sucinya ”Na” dan menempati Peparu dalam Tubuh Manusia. Mantram:

> Om Nagendra kurura-murtinam, gajendra matsya-waktranam, Baruna dewa wiryanam, sarwa jagat sudhatmakam.

Pesimpangan Pura Uluwatu: Dewa Rudra penguasa arah barat daya [Nairiti], bersenjata Moksala, kendaraanya Kerbau, saktinya Dewi Samodhi / Santani, aksara sucinya ”Ma” dan menempati Usus dalam Tubuh Manusia. Mantram:

> Om Dwijendra purwani siwi, Brahmani purwa ya satriyani sarwa Dewa Massariri, Pawitri pratiya manggalai Ya namah swaha.

Pesimpangan Pura Puncak Mangu: Sapta Petala atau Hyang Ananta Bhoga, Dewa Sangkara, penguasa arah barat laut (Wayabhya), bersenjata Angkus / Duaja, kendaraannya Singa, saktinya Dewi Rodri, aksara sucinya ”Si” dan menempati Ungsilan''',['Mantram dan ejaan “Samodhi / Santani”, “Massariri”, “Rodri”, serta “Ungsilan” dipertahankan dari scan dan perlu penelaahan istilah.'])
page(18,'14','pelinggih','''dalam Tubuh Manusia. Mantram:

> Om klang kling klung kleng Hyang Adhi Kala ya dewa bhyo namah swaha.

Untuk menjaga kelangsungan hidup ini agar berhasil (Berkharisma) Keturunan-Ku mendirikan:

Gedong Artha penguasa uang, saktinya Dewi Rambut Sedana. Mantram:

> Om Cri Laksmi Dewi namo namah swaha.

Dewa Taksu (rong siki) mohon kekuatan magis agar pura dan umat berkharisma (metaksu, berhasil, sukses). Mantram:

> Om purna jaya naro namah swaha.

Piyasan stana Sang Hyang Wenang, sebagai tempat menghiyas atau merangkai Simbul seperti Daksina Pelinggih, Arca (Pretima) sebelum di Stanakan pada bangunan suci dan tempat Upakara yang akan dipersembahkan serta tempat Pendeta melaksanakan Pemujaan. Mantram:

> Om sang kala Wenang Ya namah swaha.

Panggungan: tempat banten''',['Mantram “Om klang kling klung kleng …” mengikuti pembacaan scan; mohon pemeriksaan ejaan oleh keluarga/pemangku.'])
page(19,'15','pelinggih','''Pwaregan [Dapur], Mantram di Dapur:

> Om pawitrini Saraswati ya namah swaha.

Bale Kulkul linggih Sang Hyang Iswara.

> Om Sang Hyang Iswara namah swaha.

Bangunan Suci Lebuh berbentuk Candi Bentar stana Sang Hyang Wisesa sebagai kekuatan Penjaga dan Pemberi Petunjuk jalan bagi pemedek untuk berbuat Baik, arif dan bijaksana. Sang Hyang Wisesa sering disebut Sang Panca Kala yang menguasai lokasi: 1.Sang Maha Kala bersemayam pada Tugu Apit lawang Kanan. 2.Sang Adhi Kala bersemayam pada Tugu Apit lawang Kiri. 3.Sang Kala bersemayam Tepat pada pintu gerbang Candi. 4.Sang Dora Kala bersemayam pada aling-aling Candi. 5.Sang Sunia Kala bersemayam di depan pintu gerbang Candi (di tempat menghaturkan sesajen).

> Om Sang Kala wisesa amukti sakti Ya namah swaha.

Pesimpangan Pura Beji, Pemedek sebelum tangkil ngaturang bhakti ring Pura Dalem Majapahit sepatutnya mengucapkan mantram''',['Pembacaan “pawitrini” pada mantram dapur perlu diperiksa pada scan.'])
page(20,'16','pelinggih','''“Om Na Ma Si Wa Ya Om” dan menyucikan diri lahir dan batin. Badan kotor dibersihkan dengan air, pikiran kotor disucikan dengan kebenaran, kejujuran, kebijaksanaan dan pengetahuan, atman kotor disucikan dengan tapa (kesederhanaan dalam kehidupan), brata (pengendalian diri), yoga (peningkatan kesadaran diri) dan semadi (mengusahakan kebahagiaan yang hakiki). Mantram:

> Om asuciwa suciwapi sarwa kama gato'piwah, Sintayet dewan Isanam sabahya biantara suci.

Bale Pegongan tempat memadukan rasa seni sehingga dapat menghaluskan perasaan Pretisentana Kawitan Leluhur Majapahit.''',['Mantram penyucian dipertahankan sesuai scan; ejaan “Sintayet” dan “biantara” perlu penelaahan keluarga/pemangku.'])
more('piodalan','''## III. PIODALAN SATWIKA YADNYA RING PURA DALEM MAJAPAHIT

Piodalan di Pura Dalem Majapahit dilaksanakan pada hari Paing Galungan sebagai berikut:''')
page(21,'17','piodalan','''1. Daksina mepayas munggah ring pelinggih sowang-sowang: di Palinggih Bhatara Dalem Majapahit tidak memakai Daksina mepayas karena yang dihias adalah Ratu Pejengenan (stana Dewa, Bhatara, Purusa, Yoni) dan dipelinggih Bhatari Dalem Majapahit (Dewa Ayu Pasaren Sari) menghias Pretima Bhatari Dalem (stana Dewi, Bhatari, Predana, Lingga).

2.Menggunakan satu ayaban untuk semua pelinggih (karena Sang Hyang Widhi Meraga Tunggal). Letak ayaban ditengah tombak Dewata Nawa Sanga. Daksina, Peras, Ajuman, Suci pokok, Sesayut Pengambian, Penyeneng, Sesayut Sida Karya, Sesayut Sida Purna, Sesayut Langgeng Amukti Sakti, Cecep, Rantasan dan Tetabuhan.

3. Banten di Panggungan:

Piodalan di Pura Dalem Majapahit dapat dibagi kedalam tiga jenis Piodalan tergantung situasi, kondisi dan keuangan Pengempon Pura Dalem Majapahit yaitu:''')
page(22,'18','piodalan','''3.1. Bila Piodalannya Jelih atau Nadi (Purnama) (upacaranya tiga hari) Banten di Panggungan Dapetan, sekar taman dan bebangkit dan didepan panggungan eteh-eteh gelar sanga. Piodalan dipuput oleh Pendeta.

3.2. Bila Piodalannya ApekoIeman (besoknya nyimpen) Banten dipanggungan tidak ada, di halaman Pura ngaturang segeh Agung. Piodalan dianteb Oleh Pinandita. Bila dipuput oleh Pendeta Banten di Surya ditambah dengan banten Ardenareswari.

3.3.Bila Piodalannya adatengan (saat Nyepi): Pelinggih/pesimpangan Ida Bhatara tidak mepayas dan tidak menggunakan tedung. Masing-masing pelinggih medaging lamak dan gantung-gantungan. Pada rong Pelinggih ngaturang canang sari, ayaban Ida Bhatara satu Pejati dan banten disor segehan manca warna. Piodalan dianteb oleh Pinandita (Pemangku).

4. Banten Dihadapan Sang Muput: Banten eteh-eteh Pelukatan (Toya angar, Pelukatan,''',['Kata “Apekoleman” dan “adatengan” pada jenis piodalan perlu pemeriksaan keluarga/pemangku.'])
page(23,'19','piodalan','''Durmenggala, Prayascita), Daksina, Peras, Ajuman, suci dan sesari. Banten dimadya mandala diatas lapan: daksina, peras, ajuman. Dan dibawah lapan segehan manca warna.

5. Di Pesimpangan Pura Beji munggah Daksina Mepayas, peras, ajuman. Dihalaman Beji segehan putih 5 tanding.

6. Dihalaman Jaba Pura dekat jalan: segehan cacahan 9 Tanding.

7. Aturan Pemedek: disesuaikan dengan tempat yang telah disediakan.''')
more('permohonan-dan-harapan','''## IV. PERMOHONAN DAN HARAPAN

Dengan menguatkan srada dan meyakinkan kekuatan Sang Diri (Atman) 8 jenis Bunga Hati harus ditumbuhkembangkan dalam dirimu yaitu: 1.Kasih dan Belaskasihan, 2. Tanpa Kekerasan, 3. Pengendalian Hawa nafsu, 4. Kebenaran, 5. Kesabaran dan 6. Ketabahan, 7. Keuletan, 8. Amal dan Pengorbanan) sehingga terjadi hubungan yang harmonis dengan''')
page(24,'20','permohonan-dan-harapan','''Bhatara/Bhatari yang melingga melinggih ring Pura Dalem Majapahit.

Permohonan dan Harapan akhir dari Krama Pengempon dan Pamedek yang tangkil ke Pura Dalem Majapahit untuk memperoleh Panugrahan Rasa Bhakti, Tresna lan Asih. Bhakti kehadapan Sang Hyang Widhi dan Leluhur Kawitan Majapahit untuk manah subakti (keyakinan, kewajiban dan keihlasan), Tresna sesama keluarga, rukun dan damai tidak memelihara rasa dendam sesama keluarga dan pretisentana pasemetonan Leluhur Majapahit. Asih terhadap sarwa prani di lingkungan Pura Dalem dan Dalem Pura (sarwa prani hitan karah). Hasil akhir dari setiap yadnya adalah Santhi (Damai dihati, Damai di Keluarga dan Damai dalam Kehidupan (didunia dan di akhirat).''')

# A lowercase l was previously ambiguous in the scan; use the reading recorded in notes.
pages[21]['blocks'][1]['text']=pages[21]['blocks'][1]['text'].replace('ApekoIeman','Apekoleman')
data={'title':'Pura Dalem Majapahit','author':'Drs. I Nyoman Sukera, MM','year':2013,'pages':pages,
 'missingAppendices':['Silsilah Nang Djegdjeg','Pengempon Pura Dalem Majapahit','Pengurus Pura Dalem Majapahit','Foto copi Sertipikat Tanah Pura Dalem Majapahit']}
(root/'frontend/src/content/majapahit.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'{len(pages)} halaman; {sum(len(p["blocks"]) for p in pages)} blok transkripsi')
