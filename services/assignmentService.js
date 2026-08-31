const { db } = require('../config/firebase');

// 1. Mükerrer kontrollü ödev atama fonksiyonu (Koleksiyon isimleri düzeltildi)
const assignHomework = async (ogrenciId, kitap, konu, sonTarih) => {
    try {
        // 'odevler' yerine 'homeworks' koleksiyonuna bakıyoruz
        const mevcut = await db.collection('homeworks')
            .where('ogrenciId', '==', ogrenciId)
            .where('kitap', '==', kitap)
            .where('konu', '==', konu)
            .get();

        if (!mevcut.empty) {
            return { success: false, message: "Bu ödev bu öğrenciye daha önce atanmış!" };
        }

        // 'ogrenciler' yerine 'students' koleksiyonunda arıyoruz
        const ogrenciDoc = await db.collection('students').doc(ogrenciId).get();
        const ogrenciAdSoyad = ogrenciDoc.exists ? ogrenciDoc.data().adSoyad : ogrenciId;

        // 'odevler' yerine 'homeworks' koleksiyonuna kaydediyoruz
        await db.collection('homeworks').add({
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

// 2. YENİ: Tek bir ödevin detaylarını getirme fonksiyonu (İnceleme ekranı için)
const getHomeworkById = async (id) => {
    try {
        const doc = await db.collection('homeworks').doc(id).get();
        if (!doc.exists) {
            return null;
        }
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error("Ödev detayı getirme hatası:", error);
        throw error;
    }
};

module.exports = { assignHomework, getHomeworkById };
