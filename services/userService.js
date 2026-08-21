const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Yeni Öğrenci Ekleme Fonksiyonu
const addStudent = async (studentData) => {
    try {
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
            return null;
        }
    } catch (error) {
        console.error("Öğrenci aranırken hata:", error);
        return null;
    }
};

// 3. YENİ EKLENEN: Tüm Öğrencileri Listeleme Fonksiyonu
const getAllStudents = async () => {
    try {
        // Öğrencileri kayıt tarihine göre yeniden eskiye doğru (desc) getir
        const snapshot = await db.collection('students').orderBy('kayitTarihi', 'desc').get();
        const students = [];
        
        snapshot.forEach(doc => {
            students.push({ id: doc.id, ...doc.data() });
        });
        
        return students;
    } catch (error) {
        console.error("Öğrenciler getirilirken hata:", error);
        return []; // Hata olursa boş liste döndür ki sayfa çökmesin
    }
};

// 4. YENİ EKLENEN: Ödev Atama Fonksiyonu
const addHomework = async (homeworkData) => {
    try {
        // 'homeworks' adında yeni bir koleksiyon (klasör) oluşturup ödevleri oraya kaydediyoruz
        await db.collection('homeworks').add({
            ogrenciId: homeworkData.ogrenciId, // Hangi öğrenciye atandığı (Kurs Numarası)
            kitap: homeworkData.kitap,         // Örn: LGS Matematik Soru Bankası
            konu: homeworkData.konu,           // Örn: Çarpanlar ve Katlar - Test 3
            sonTarih: homeworkData.sonTarih,   // Örn: Yarın, 24 Ekim vs.
            durum: 'Bekliyor',                 // İlk atandığında öğrenci çözmediği için 'Bekliyor'
            eklenmeTarihi: new Date()
        });
        return true;
    } catch (error) {
        console.error("Ödev eklenirken hata:", error);
        throw error;
    }
};

// Modülleri dışa aktarmayı güncelledik
module.exports = { addStudent, getStudentByNumber, getAllStudents, addHomework };
