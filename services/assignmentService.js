const { db } = require('../config/firebase');

// Öğrenciye Yeni Ödev Atama
const assignHomework = async (assignmentData) => {
    try {
        const docRef = await db.collection('assignments').add({
            ...assignmentData, // Öğrenci no, kitap, test no gibi veriler
            durum: 'bekliyor',
            verilmeTarihi: new Date().toISOString(),
            ogretmenOnayi: false
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Ödev atama hatası:", error);
        return { success: false, error: error.message };
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

module.exports = { assignHomework, getAssignmentsByStudent };
