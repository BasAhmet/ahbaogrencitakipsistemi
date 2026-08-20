const admin = require('firebase-admin');
require('dotenv').config();

try {
    // Vercel'de veya lokalde .env dosyasından güvenlik anahtarını alıyoruz
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : null;

    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("🔥 Firebase Firestore bağlantısı başarıyla sağlandı!");
    } else {
        console.log("⚠️ Firebase yetki belgesi bulunamadı. (GitHub arayüzünde normaldir, canlıda eklenecek)");
    }
} catch (error) {
    console.error("Firebase bağlantı hatası:", error);
}

const db = admin.firestore();

module.exports = { admin, db };
