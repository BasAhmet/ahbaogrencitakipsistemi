const express = require('express');
const router = express.Router();

const { addStudent, 
       getAllStudents, 
       addHomework, 
       deleteStudent, 
       getAllHomeworks, 
       addBook, 
       getAllBooks,
       deleteBook
      } = require('../services/userService');

// Öğretmen Yönetim Paneli Ana Sayfası
router.get('/dashboard', async (req, res) => {
    try {
        // 1. Veritabanından tüm verileri çek
        const ogrenciler = await getAllStudents();
        const odevler = await getAllHomeworks();

        // 2. Ödevler koleksiyonunda sadece öğrenci numarası var, isimlerini eşleştirelim
        const ogrenciIsimleri = {};
        ogrenciler.forEach(ogr => {
            ogrenciIsimleri[ogr.kursNumarasi] = ogr.adSoyad;
        });

        const detayliOdevler = odevler.map(odev => ({
            ...odev,
            ogrenciAd: ogrenciIsimleri[odev.ogrenciId] || 'Bilinmeyen Öğrenci'
        }));

        // 3. İstatistik kartları için matematiksel hesaplamalar
        const kayitliOgrenci = ogrenciler.length;
        const bekleyenOdev = odevler.filter(o => o.durum === 'Bekliyor').length;
        const tamamlananOdev = odevler.filter(o => o.durum === 'Tamamlandı').length;

        // 4. Verileri ön yüze (EJS) gönder
        res.render('admin/dashboard', {
            kayitliOgrenci,
            bekleyenOdev,
            tamamlananOdev,
            sonOdevler: detayliOdevler.slice(0, 10) // Sadece en son atanan 10 ödevi listeler
        });
    } catch (error) {
        console.error("Dashboard yüklenirken hata:", error);
        // Hata olursa en azından sayfa boş verilerle açılsın ki sistem çökmesin
        res.render('admin/dashboard', {
            kayitliOgrenci: 0,
            bekleyenOdev: 0,
            tamamlananOdev: 0,
            sonOdevler: []
        });
    }
});

// Öğrenciler Sayfasını Gösterme Rotası
router.get('/students', async (req, res) => {
    try {
        // Veritabanından öğrencileri çek
        const studentsList = await getAllStudents();
        // Sayfaya (EJS'ye) bu listeyi 'students' adıyla gönder
        res.render('admin/students', { students: studentsList });
    } catch (error) {
        console.error("Öğrenciler yüklenemedi:", error);
        res.render('admin/students', { students: [] });
    }
});

// Yeni Öğrenci Ekleme İşlemi (POST)
router.post('/student-add', async (req, res) => {
    const { adSoyad, sinif, kursNumarasi } = req.body;
    try {
        await addStudent({ adSoyad, sinif, kursNumarasi });
        res.redirect('/admin/students');
    } catch (error) {
        console.error("Kayıt hatası:", error);
        res.send("Öğrenci eklenirken sistemsel bir hata oluştu.");
    }
});

// Ödev Ata Sayfasını Gösterme
router.get('/homework', async (req, res) => {
    try {
        // Hem öğrencileri hem de kitaplıktaki kaynakları çekiyoruz
        const studentsList = await getAllStudents(); 
        const booksList = await getAllBooks(); 

        res.render('admin/homework', { 
            students: studentsList,
            books: booksList // Kitapları da EJS dosyasına gönderiyoruz
        });
    } catch (error) {
        console.error("Ödev sayfası yüklenemedi:", error);
        res.render('admin/homework', { students: [], books: [] });
    }
});

// Ödevi Veritabanına Kaydetme İşlemi (POST)
// GÜNCELLENEN: Yeni Ödev Ata (Mükerrer Kontrollü)
// GÜNCELLENEN: Yeni Ödev Ata Rotası (Hatadan Arındırılmış)
const { assignHomework } = require('../services/assignmentService');

// Yeni Ödev Ata (Mükerrer Kontrollü)
router.post('/homework-add', async (req, res) => {
    const { ogrenciId, kitap, konu, sonTarih } = req.body;
    try {
        const sonuc = await assignHomework(ogrenciId, kitap, konu, sonTarih);
        
        if (!sonuc.success) {
            return res.send(`<script>alert('${sonuc.message}'); window.history.back();</script>`);
        }
        
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Ödev atama rotası hatası:", error);
        res.send("Ödev atanırken sistemsel bir hata oluştu.");
    }
});


// ÖĞRENCİ SİLME ROTASI
router.get('/student-delete/:id', async (req, res) => {
    try {
        await deleteStudent(req.params.id);
        res.redirect('/admin/students'); // Sildikten sonra listeye geri dön
    } catch (error) {
        console.error("Silme hatası:", error);
        res.redirect('/admin/students');
    }
});

// Dijital Kitaplık Sayfasını Gösterme
router.get('/library', async (req, res) => {
    try {
        const booksList = await getAllBooks();
        res.render('admin/library', { books: booksList });
    } catch (error) {
        console.error("Kitaplık yüklenemedi:", error);
        res.render('admin/library', { books: [] });
    }
});

// Yeni Kitap Ekleme İşlemi (POST)
router.post('/book-add', async (req, res) => {
    const { kitapAdi, konu, testAdlari, soruSayilari } = req.body;
    try {
        let testler = [];
        
        // Tek test girildiyse string, çoklu girildiyse array gelir. Hepsini array formatına alıyoruz.
        const adlar = Array.isArray(testAdlari) ? testAdlari : [testAdlari];
        const sayilar = Array.isArray(soruSayilari) ? soruSayilari : [soruSayilari];

        for(let i = 0; i < adlar.length; i++) {
            if(adlar[i] && sayilar[i]) {
                testler.push({ 
                    ad: adlar[i].trim(), 
                    soru: parseInt(sayilar[i]) 
                });
            }
        }

        await addBook({ kitapAdi, konu, testler });
        res.redirect('/admin/library');
    } catch (error) {
        console.error("Kitap eklenirken hata:", error);
        res.send("Kitap eklenirken sistemsel bir hata oluştu.");
    }
});

// KİTAP SİLME ROTASI
router.get('/book-delete/:id', async (req, res) => {
    try {
        await deleteBook(req.params.id);
        res.redirect('/admin/library'); // Sildikten sonra kitaplığa geri dön
    } catch (error) {
        console.error("Kitap silme hatası:", error);
        res.redirect('/admin/library');
    }
});

module.exports = router;
