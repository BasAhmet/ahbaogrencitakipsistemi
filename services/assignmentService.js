const { db } = require('../config/firebase');

// Mükerrer kontrollü ödev atama fonksiyonu
const assignHomework = async (ogrenciId, kitap, konu, sonTarih) => {
    try {
        // 1. Aynı öğrenciye, aynı kitap ve konunun daha önce verilip verilmediğini kontrol et
        const mevcut = await db.collection('odevler')
            .where('ogrenciId', '==', ogrenciId)
            .where('kitap', '==', kitap)
            .where('konu', '==', konu)
            .get();

        if (!mevcut.empty) {
            return { success: false, message: "Bu ödev bu öğrenciye daha önce atanmış!" };
        }

        // 2. Tabloda öğrenci adının düzgün görünmesi için öğrenciyi bul
        const ogrenciDoc = await db.collection('ogrenciler').where('kursNumarasi', '==', ogrenciId).get();
        const ogrenciAdSoyad = ogrenciDoc.empty ? ogrenciId : ogrenciDoc.docs[0].data().adSoyad;

        // 3. Yeni ödevi kaydet
        await db.collection('odevler').add({
            ogrenciId,
            ogrenciAdSoyad,
            kitap,
            konu,
            sonTarih,
            durum: 'Bekliyor',
            eklenmeTarihi: new Date()
        });

        return { success: true };
    } catch (error) {
        console.error("Ödev atama servis hatası:", error);
        throw error;
    }
};
// Öğrencinin (veya Velinin) Kendi Ödevlerini Görmesi İçin
const getAssignmentsByStudent = async (kursNumarasi) => {
    try {
        // Sadece o öğrenciye ait ödevleri filtrele
        const snapshot = await db.collection('assignments')
                                 .where('ogrenciNo', '==', kursNumarasi)
                                 .get();
        let assignments = [];
        snapshot.forEach(doc => {
            assignments.push({ id: doc.id, ...doc.data() });
        });
        return assignments;
    } catch (error) {
        console.error("Ödevleri getirme hatası:", error);
        return [];
    }
};
// Tek bir ödevin detaylarını getirme fonksiyonu
const getHomeworkById = async (id) => {
    try {
        const doc = await db.collection('odevler').doc(id).get();
        if (!doc.exists) {
            return null;
        }
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error("Ödev detayı getirme hatası:", error);
        throw error;
    }
};

module.exports = {
    assignHomework,
    getHomeworkById, 
    getAssignmentsByStudent  
};


