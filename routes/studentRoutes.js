const express = require('express');
const router = express.Router();

// Öğrenci Paneli Ana Sayfası
router.get('/dashboard', (req, res) => {
    // Şimdilik sadece tasarımı render ediyoruz. 
    // İleride buraya URL'den gelen id'ye göre öğrencinin gerçek verilerini çeken kodları ekleyeceğiz.
    res.render('student/dashboard');
});

// Ödev Teslim İşlemi (Form gönderildiğinde çalışacak)
router.post('/odev-teslim', (req, res) => {
    // Formdan gelen Doğru, Yanlış, Boş ve Yapılamayan Soru verileri burada yakalanacak.
    const { odevId, dogru, yanlis, bos, yapilamayanSorular } = req.body;
    console.log("Ödev Teslim Edildi:", req.body);
    
    // Şimdilik aynı sayfaya geri yönlendiriyoruz.
    res.redirect('/ogrenci/dashboard');
});

module.exports = router;

