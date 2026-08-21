const express = require('express');
const router = express.Router();
const { getStudentByNumber, getHomeworksByStudentId, completeHomework } = require('../services/userService');

// Öğrenci Paneli Ana Sayfası
router.get('/dashboard', async (req, res) => {
    try {
        const studentId = req.query.id; 

        if (!studentId) {
            return res.send("Hata: Şifre (ID) bulunamadı! Lütfen giriş ekranından tekrar girin.");
        }

        const student = await getStudentByNumber(studentId);
        // Tüm ödevleri çekiyoruz (eğer ödev yoksa boş liste döndürüyoruz)
        const allHomeworks = await getHomeworksByStudentId(studentId) || [];

        // İŞTE YENİ EKLENEN KISIM: Ödevleri durumlarına göre ikiye ayırıyoruz
        const aktifOdevler = allHomeworks.filter(hw => hw.durum === 'Bekliyor');
        const tamamlananOdevler = allHomeworks.filter(hw => hw.durum === 'Tamamlandı');

        res.render('student/dashboard', { 
            student: student || { adSoyad: 'Kayıt Bulunamadı' }, 
            aktifOdevler: aktifOdevler,
            tamamlananOdevler: tamamlananOdevler
        });
        
    } catch (error) {
        console.error("Öğrenci paneli hatası:", error);
        res.send("Sunucu hatası oluştu: " + error.message);
    }
});

// Ödev Teslim İşlemi (POST)
router.post('/homework-complete', async (req, res) => {
    // Formdan gelen verileri yakalıyoruz
    const { homeworkId, studentId, dogru, yanlis, bos, yapilamayanlar } = req.body;

    try {
        // Firebase'deki ödevi sonuçlarla güncelliyoruz
        await completeHomework(homeworkId, { dogru, yanlis, bos, yapilamayanlar });
        
        // İşlem başarılı olunca öğrenciyi kendi paneline geri gönderiyoruz
        res.redirect(`/ogrenci/dashboard?id=${studentId}`);
    } catch (error) {
        console.error("Ödev teslim hatası:", error);
        res.send("Ödev kaydedilirken bir hata oluştu: " + error.message);
    }
});

module.exports = router;
