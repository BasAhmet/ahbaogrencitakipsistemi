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

// 5. YENİ EKLENEN: Öğrencinin Ödevlerini Getirme Fonksiyonu
const getHomeworksByStudentId = async (ogrenciId) => {
    try {
        const snapshot = await db.collection('homeworks')
            .where('ogrenciId', '==', ogrenciId)
            .get();
        
        const homeworks = [];
        snapshot.forEach(doc => {
            homeworks.push({ id: doc.id, ...doc.data() });
        });
        return homeworks;
    } catch (error) {
        console.error("Öğrenci ödevleri getirilirken hata:", error);
        return [];
    }
};

// 6. YENİ EKLENEN: Ödevi Tamamlama ve Sonuçları Kaydetme
const completeHomework = async (odevId, dogru, yanlis, bos) => {
    try {
        const hwRef = db.collection('homeworks').doc(odevId);
        
        await hwRef.update({
            durum: 'Tamamlandı',
            tamamlanmaTarihi: new Date(), // YENİ: Ödevin bittiği anı da kaydediyoruz
            sonuclar: {
                dogru: parseInt(dogru),
                yanlis: parseInt(yanlis),
                bos: parseInt(bos)
            }
        });
        
        return true;
    } catch (error) {
        console.error("Ödev güncellenirken hata:", error);
        throw error;
    }
};

// 7. Öğrenci Silme Fonksiyonu
const deleteStudent = async (kursNumarasi) => {
    try {
        // Kurs numarasını document ID olarak kullandığımız için direkt siliyoruz
        await db.collection('students').doc(kursNumarasi).delete();
        return true;
    } catch (error) {
        console.error("Öğrenci silinirken hata:", error);
        throw error;
    }
};

// 8. Öğretmen paneli için tüm ödevleri getirme
const getAllHomeworks = async () => {
    try {
        const snapshot = await db.collection('homeworks').orderBy('eklenmeTarihi', 'desc').get();
        const homeworks = [];
        
        snapshot.forEach(doc => {
            homeworks.push({ id: doc.id, ...doc.data() });
        });
        
        return homeworks;
    } catch (error) {
        console.error("Tüm ödevler getirilirken hata:", error);
        return [];
    }
};

// YENİ: Sisteme yeni bir kitap ve konu hiyerarşisi ekleme
const addBook = async (bookData) => {
    try {
        await db.collection('kitaplar').add({
            kitapAdi: bookData.kitapAdi,
            icerik: bookData.icerik, // Konular, test sayıları ve soru sayılarının olduğu dizi (array)
            eklenmeTarihi: new Date()
        });
        return true;
    } catch (error) {
        console.error("Kitap eklenirken hata:", error);
        throw error;
    }
};

// 9. Ödev atama ekranı için tüm kitapları getirme
const getAllBooks = async () => {
    try {
        const snapshot = await db.collection('kitaplar').orderBy('eklenmeTarihi', 'desc').get();
        const books = [];
        
        snapshot.forEach(doc => {
            books.push({ id: doc.id, ...doc.data() });
        });
        
        return books;
    } catch (error) {
        console.error("Kitaplar getirilirken hata:", error);
        return [];
    }
};


// Modülleri dışa aktarma
module.exports = { 
    addStudent, 
    getStudentByNumber, 
    getAllStudents, 
    addHomework, 
    getHomeworksByStudentId,
    completeHomework,
    deleteStudent,
    getAllHomeworks,
    addBook,
    getAllBooks
};
