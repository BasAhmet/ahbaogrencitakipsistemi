const { db } = require('../config/firebase');

// Yeni Kitap/Kaynak Ekleme
const addBook = async (bookData) => {
    try {
        const docRef = await db.collection('books').add(bookData);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Kitap ekleme hatası:", error);
        return { success: false, error: error.message };
    }
};

// Ödev Atama Ekranı İçin Tüm Kitapları Getirme
const getAllBooks = async () => {
    try {
        const snapshot = await db.collection('books').get();
        let books = [];
        snapshot.forEach(doc => {
            books.push({ id: doc.id, ...doc.data() });
        });
        return books; // Kitap listesini dizi (array) olarak döndür
    } catch (error) {
        console.error("Kitap listeleme hatası:", error);
        return [];
    }
};

module.exports = { addBook, getAllBooks };
