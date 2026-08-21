const express = require('express');
const router = express.Router();
const { getStudentByNumber, getHomeworksByStudentId } = require('../services/userService');

// Öğrenci Paneli Ana Sayfası
router.get('/dashboard', async (req, res) => {
    const studentId = req.query.id; // URL'deki id parametresi (örneğin: ?id=5566)

    try {
        const student = await getStudentByNumber(studentId);
        const homeworks = await getHomeworksByStudentId(studentId);

        // Öğrenci bulunamazsa bile sayfa çökmesin diye varsayılan isim geçiyoruz
        res.render('ogrenci/dashboard', { 
            student: student || { adSoyad: 'Öğrenci' }, 
            homeworks: homeworks || [] 
        });
    } catch (error) {
        console.error("Öğrenci paneli yüklenirken hata:", error);
        res.render('ogrenci/dashboard', { student: { adSoyad: 'Öğrenci' }, homeworks: [] });
    }
});

module.exports = router;
