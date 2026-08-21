const express = require('express');
const router = express.Router();

// Öğretmen Yönetim Paneli Ana Sayfası
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
});

// Öğrenciler Sayfasını Gösterme Rotası (YENİ EKLENEN)
router.get('/students', (req, res) => {
    res.render('admin/students');
});

// Yeni Öğrenci Ekleme İşlemi (POST) (YENİ EKLENEN)
router.post('/student-add', (req, res) => {
    const { adSoyad, sinif, kursNumarasi } = req.body;
    console.log("Formdan gelen yeni öğrenci:", adSoyad, sinif, kursNumarasi);
    
    // Şimdilik veritabanına yazmadık, sadece formun çalıştığını test etmek için sayfayı yeniliyoruz.
    res.redirect('/admin/students');
});

module.exports = router;
