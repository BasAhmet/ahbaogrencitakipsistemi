const { getStudentByNumber } = require('../services/userService');

const loginProcess = async (req, res) => {
    const { kullaniciAdi, kursNumarasi, girisTipi } = req.body;

    try {
        // 1. DURUM: EĞER GİRİŞ YAPAN KİŞİ ÖĞRETMENSE
        if (girisTipi === 'admin') {
            if (kursNumarasi === '12345') {
                return res.redirect('/admin/dashboard');
            } else {
                // Hata mesajını şık kutuya gönderiyoruz
                return res.render('login', { error: 'Öğretmen şifresi yanlış!' });
            }
        }

        // 2. DURUM: EĞER GİRİŞ YAPAN KİŞİ ÖĞRENCİ VEYA VELİ İSE
        const student = await getStudentByNumber(kursNumarasi);

        // Veritabanında öğrenci yoksa uyarı ver
        if (!student) {
            return res.render('login', { error: 'Bu kurs numarasına ait bir öğrenci bulunamadı.' });
        }

        // --- YENİ EKLENEN KISIM: AKILLI İSİM KONTROLÜ ---
        // Veritabanındaki ve formdan gelen ismin boşluklarını silip küçük harfe çevirerek karşılaştırıyoruz
        const dbName = student.adSoyad.toLowerCase().trim();
        const inputName = kullaniciAdi.toLowerCase().trim();

        if (dbName !== inputName) {
            return res.render('login', { error: 'Girdiğiniz Ad Soyad, bu Kurs Numarası ile eşleşmiyor.' });
        }
        // ------------------------------------------------

        // Öğrenci varsa ve isim doğruysa yetkisine göre yönlendir
        if (girisTipi === 'veli') {
            return res.redirect(`/veli/dashboard?id=${kursNumarasi}`);
        } else if (girisTipi === 'ogrenci') {
            return res.redirect(`/ogrenci/dashboard?id=${kursNumarasi}`);
        }

    } catch (error) {
        console.error("Giriş işlemi sırasında hata:", error);
        return res.render('login', { error: 'Sistemsel bir hata oluştu, lütfen tekrar deneyin.' });
    }
};

module.exports = { loginProcess };
