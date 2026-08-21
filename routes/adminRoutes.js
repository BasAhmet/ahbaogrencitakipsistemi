const express = require('express');
const router = express.Router();

// Öğretmen Yönetim Paneli Ana Sayfası
router.get('/dashboard', (req, res) => {
    // views/admin klasöründeki dashboard.ejs dosyasını ekrana basar
    res.render('admin/dashboard');
});

module.exports = router;
