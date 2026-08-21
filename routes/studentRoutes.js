const express = require('express');
const router = express.Router();
const { getStudentByNumber, getHomeworksByStudentId } = require('../services/userService');

// Öğrenci Paneli Ana Sayfası
router.get('/dashboard', async (req, res) => {
    try {
        const studentId = req.query.id; 

        if (!studentId) {
            return res.send("Hata: Şifre (ID) bulunamadı! Lütfen giriş ekranından tekrar girin.");
        }

        const student = await getStudentByNumber(studentId);
        const homeworks = await getHomeworksByStudentId(studentId);

        // İŞTE ÇÖZÜM BURADA: 'ogrenci/dashboard' yerine 'student/dashboard' klasörüne gidiyoruz!
        res.render('student/dashboard', { 
            student: student || { adSoyad: 'Kayıt Bulunamadı' }, 
            homeworks: homeworks || [] 
        });
        
    } catch (error) {
        console.error("Öğrenci paneli hatası:", error);
        res.send("Sunucu hatası oluştu: " + error.message);
    }
});

module.exports = router;
