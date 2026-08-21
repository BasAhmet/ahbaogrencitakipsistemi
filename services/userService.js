const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Yeni Öğrenci Ekleme Fonksiyonu
const addStudent = async (studentData) => {
    try {
        // Öğrencinin kurs numarasını veritabanında "kimlik (ID)" olarak kullanıyoruz.
        // Böylece aynı numaradan iki tane olamaz ve arama yaparken şimşek hızında buluruz.
        await db.collection('students').doc(studentData.kursNumarasi).set({
            adSoyad: studentData.adSoyad,
            sinif: studentData.sinif,
            kursNumarasi: studentData.kursNumarasi,
            kayitTarihi: new Date()
        });
        return true;
    } catch (error) {
        console.error("Öğrenci Firebase'e eklenirken hata:", error);
        throw error;
    }
};

// 2. Giriş Yaparken Öğrenciyi Bulma Fonksiyonu
const getStudentByNumber = async (kursNumarasi) => {
    try {
        const doc = await db.collection('students').doc(kursNumarasi).get();
        if (doc.exists) {
            return doc.data();
        } else {
            return null; // Öğrenci bulunamadı
        }
    } catch (error) {
        console.error("Öğrenci aranırken hata:", error);
        return null;
    }
};

module.exports = { addStudent, getStudentByNumber };
