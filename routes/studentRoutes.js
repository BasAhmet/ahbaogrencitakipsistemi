const express = require('express');
const router = express.Router();

// Veritabanı fonksiyonlarımızı çağırıyoruz
const { getStudentByNumber, getHomeworksByStudentId } = require('../services/userService');

// 1. Öğrenci Giriş Sayfasını Gösterme
router.get('/login', (req, res) => {
    // Sayfa ilk açıldığında hata yok
    res.render('student/login', { error: null });
});

// 2. Öğrenci Giriş İşlemi (Form Gönderildiğinde)
router.post('/login', async (req, res) => {
    const { kursNumarasi } = req.body;

    try {
        // Veritabanında bu numaraya sahip öğrenciyi ara
        const student = await getStudentByNumber(kursNumarasi);

        if (student) {
            // Öğrenci bulunduysa, onun numarasıyla dashboard'a (panele) yönlendir
            res.redirect(`/ogrenci/dashboard/${kursNumarasi}`);
        } else {
            // Öğrenci bulunamadıysa hata mesajı ile giriş sayfasına geri gönder
            res.render('student/login', { error: 'Hatalı kurs numarası girdiniz. Lütfen tekrar deneyin.' });
        }
    } catch (error) {
        console.error("Giriş hatası:", error);
        res.render('student/login', { error: 'Sistemsel bir hata oluştu, lütfen daha sonra deneyin.' });
    }
});

// 3. Öğrenci Özel Paneli (Dashboard)
router.get('/dashboard/:id', async (req, res) => {
    const kursNumarasi = req.params.id;

    try {
        // Güvenlik: Adresteki numaraya ait öğrenci gerçekten var mı?
        const student = await getStudentByNumber(kursNumarasi);
        
        if (!student) {
            // Yoksa giriş sayfasına geri postala
            return res.redirect('/ogrenci/login');
        }

        // Öğrencinin sistemdeki tüm ödevlerini Firebase'den çek
        const homeworks = await getHomeworksByStudentId(kursNumarasi);

        // Öğrenci verilerini ve ödevlerini dashboard sayfasına gönder
        res.render('student/dashboard', { student, homeworks });

    } catch (error) {
        console.error("Panel yüklenme hatası:", error);
        res.send("Panel yüklenirken bir hata oluştu.");
    }
});

module.exports = router;
