const express = require('express');
const router = express.Router();

// Veritabanı fonksiyonlarımızı çağırıyoruz
const { getStudentByNumber, getHomeworksByStudentId, completeHomework } = require('../services/userService');

// 1. Öğrenci Giriş Sayfasını Gösterme
router.get('/login', (req, res) => {
    res.render('student/login', { error: null });
});

// 2. Öğrenci Giriş İşlemi (POST)
router.post('/login', async (req, res) => {
    const { kursNumarasi, adSoyad } = req.body;

    try {
        const student = await getStudentByNumber(kursNumarasi);

        if (student) {
            // Veritabanındaki isim ile girilen ismi küçük harfe çevirip, başındaki/sonundaki boşlukları siliyoruz
            const dbName = student.adSoyad.toLowerCase().trim();
            const inputName = adSoyad.toLowerCase().trim();

            if (dbName === inputName) {
                // İsimler eşleşiyorsa panele al
                res.redirect(`/ogrenci/dashboard?id=${kursNumarasi}`);
            } else {
                // İsim yanlışsa uyarı ver
                res.render('student/login', { error: 'Girdiğiniz Ad Soyad, bu Kurs Numarası ile eşleşmiyor.' });
            }
        } else {
            // Numara komple yanlışsa
            res.render('student/login', { error: 'Hatalı kurs numarası girdiniz. Lütfen tekrar deneyin.' });
        }
    } catch (error) {
        console.error("Giriş hatası:", error);
        res.render('student/login', { error: 'Sistemsel bir hata oluştu.' });
    }
});

// 3. Ortak Dashboard Yükleme Fonksiyonu
const renderDashboard = async (req, res) => {
    // Hem ?id=301 hem de /301 kullanımını yakalar
    const kursNumarasi = req.query.id || req.params.id;

    if (!kursNumarasi) {
        return res.redirect('/ogrenci/login');
    }

    try {
        const student = await getStudentByNumber(kursNumarasi);
        
        if (!student) {
            return res.redirect('/ogrenci/login');
        }

        const homeworks = await getHomeworksByStudentId(kursNumarasi);
        res.render('student/dashboard', { student, homeworks });

    } catch (error) {
        console.error("Panel yüklenme hatası:", error);
        res.send("Panel yüklenirken bir hata oluştu.");
    }
};

// Hem /dashboard?id=301 hem de /dashboard/301 adreslerini dinliyoruz
router.get('/dashboard', renderDashboard);
router.get('/dashboard/:id', renderDashboard);

// YENİ EKLENEN ROTA: Formdan gelen sonuçları yakalama
router.post('/odev-tamamla', async (req, res) => {
    // Formdaki inputların name değerlerini çekiyoruz
    const { odevId, kursNumarasi, dogru, yanlis, bos } = req.body;

    try {
        // Veritabanı fonksiyonumuzu çağırıp sonuçları işliyoruz
        await completeHomework(odevId, dogru, yanlis, bos);

        // İşlem bitince öğrenciyi kendi paneline geri yolluyoruz
        res.redirect(`/ogrenci/dashboard?id=${kursNumarasi}`);
    } catch (error) {
        console.error("Ödev tamamlama hatası:", error);
        res.send("Sonuçlar kaydedilirken bir hata oluştu.");
    }
});

module.exports = router;
