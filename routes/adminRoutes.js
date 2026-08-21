const express = require('express');
const router = express.Router();
// Az önce yazdığımız veritabanı fonksiyonunu içe aktarıyoruz
const { addStudent } = require('../services/userService');

// Öğretmen Yönetim Paneli Ana Sayfası
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
});

// Öğrenciler Sayfasını Gösterme Rotası (YENİ EKLENEN)
router.get('/students', (req, res) => {
    res.render('admin/students');
});

// YENİ ÖĞRENCİ EKLEME İŞLEMİ (Veritabanına Kayıt)
router.post('/student-add', async (req, res) => {
    const { adSoyad, sinif, kursNumarasi } = req.body;
    
    try {
        // Firebase'e kaydet
        await addStudent({ adSoyad, sinif, kursNumarasi });
        
        console.log(`${adSoyad} başarıyla sisteme eklendi.`);
        
        // Kayıt başarılıysa sayfayı yenile (ileride buraya başarılı mesajı da ekleyeceğiz)
        res.redirect('/admin/students');
    } catch (error) {
        console.error("Kayıt hatası:", error);
        res.send("Öğrenci eklenirken sistemsel bir hata oluştu.");
    }
});

module.exports = router;
