const express = require('express');
const path = require('path');
const { db } = require('./config/firebase');

const app = express();

// EJS Şablon Motoru Ayarları
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statik Dosyalar (CSS, JS, Resimler) public klasöründen okunacak
app.use(express.static(path.join(__dirname, 'public')));

// Gelen form verilerini okuyabilmek için
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotaları (Routes) İçe Aktarma
const indexRoutes = require('./routes/indexRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Bunu yeni ekledik

// Rotaları Kullanma
app.use('/', indexRoutes);
app.use('/admin', adminRoutes); // Bunu yeni ekledik (/admin ile başlayan tüm linkler buraya gidecek)

// Sunucuyu Başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda ayağa kalktı.`);
});
