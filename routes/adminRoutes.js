const express = require('express');
const router = express.Router();

const { addStudent, getAllStudents, addHomework } = require('../services/userService');

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

// Ödev Ata Sayfasını Gösterme
router.get('/homework', async (req, res) => {
    try {
        // Öğretmen kime ödev vereceğini seçebilsin diye kayıtlı öğrencileri çekiyoruz
        const studentsList = await getAllStudents(); 
        res.render('admin/homework', { students: studentsList });
    } catch (error) {
        console.error("Ödev sayfası yüklenemedi:", error);
        res.render('admin/homework', { students: [] });
    }
});

// Ödevi Veritabanına Kaydetme İşlemi (POST)
router.post('/homework-add', async (req, res) => {
    const { ogrenciId, kitap, konu, sonTarih } = req.body;
    try {
        await addHomework({ ogrenciId, kitap, konu, sonTarih });
        // Kayıt başarılıysa sayfayı yenile
        res.redirect('/admin/homework'); 
    } catch (error) {
        console.error("Ödev atanırken hata:", error);
        res.send("Ödev atanırken sistemsel bir hata oluştu.");
    }
});

module.exports = router;
