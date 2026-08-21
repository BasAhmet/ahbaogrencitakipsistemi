const express = require('express');
const router = express.Router();
const { loginProcess } = require('../controllers/authController');

// Ana Sayfa (Siteye girildiğinde direkt giriş ekranına yönlendiriyoruz)
router.get('/', (req, res) => {
    res.redirect('/login');
});

// Giriş Ekranını Gösterme Rotası (Kullanıcı /login adresine geldiğinde)
router.get('/login', (req, res) => {
    // views klasöründeki login.ejs dosyasını ekrana basar
    res.render('login'); 
});

// Form Gönderildiğinde Çalışacak Rota (POST isteği)
router.post('/login', loginProcess);

module.exports = router;
