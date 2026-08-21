const express = require('express');
const router = express.Router();
// getAllStudents fonksiyonunu da dahil ettik
const { addStudent, getAllStudents } = require('../services/userService'); 

// Öğretmen Yönetim Paneli Ana Sayfası
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
});

// Öğrenciler Sayfasını Gösterme Rotası (GÜNCELLENDİ)
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

module.exports = router;
