const express = require('express');
const router = express.Router();

// Veli Paneli Ana Sayfası
router.get('/dashboard', (req, res) => {
    // Şimdilik sadece tasarımı render ediyoruz. 
    res.render('parent/dashboard');
});

module.exports = router;
