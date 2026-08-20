const { db } = require('../config/firebase');

// Öğrenci Ekleme Fonksiyonu
const addStudent = async (studentData) => {
    try {
        // Öğrencinin kurs numarasını ID olarak belirliyoruz ki girişte bulması kolay olsun
        const docRef = db.collection('users').doc(studentData.kursNumarasi);
        await docRef.set({
            isim: studentData.isim,
            kursNumarasi: studentData.kursNumarasi,
            rol: 'ogrenci',
            kayitTarihi: new Date().toISOString()
        });
        return { success: true, id: studentData.kursNumarasi };
    } catch (error) {
        console.error("Öğrenci ekleme hatası:", error);
        return { success: false, error: error.message };
    }
};

// Giriş Ekranı İçin Öğrenci Arama Fonksiyonu
const getStudentByNumber = async (kursNumarasi) => {
    try {
        const doc = await db.collection('users').doc(kursNumarasi).get();
        if (!doc.exists) return null; // Öğrenci bulunamadı
        return doc.data(); // Öğrenci bilgilerini döndür
    } catch (error) {
        console.error("Öğrenci arama hatası:", error);
        return null;
    }
};

module.exports = { addStudent, getStudentByNumber };
