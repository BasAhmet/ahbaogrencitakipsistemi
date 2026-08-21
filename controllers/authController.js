const { getStudentByNumber } = require('../services/userService');

const loginProcess = async (req, res) => {
    const { kullaniciAdi, kursNumarasi, girisTipi } = req.body;

    try {
        // 1. DURUM: EĞER GİRİŞ YAPAN KİŞİ ÖĞRETMENSE
        if (girisTipi === 'admin') {
            // Sizin için şimdilik sabit bir şifre belirliyoruz (Örn: 12345)
            // Girişte Ad Soyad kısmına ne yazarsanız yazın, şifre 12345 ise panele girersiniz.
            if (kursNumarasi === '12345') {
                return res.redirect('/admin/dashboard');
            } else {
                return res.send("Hata: Öğretmen şifresi yanlış!");
            }
        }

        // 2. DURUM: EĞER GİRİŞ YAPAN KİŞİ ÖĞRENCİ VEYA VELİ İSE
        const student = await getStudentByNumber(kursNumarasi);

        // Veritabanında öğrenci yoksa uyarı ver
        if (!student) {
            return res.send("Hata: Bu kurs numarasına ait bir öğrenci bulunamadı.");
        }

        // Öğrenci varsa yetkisine göre yönlendir
        if (girisTipi === 'veli') {
            return res.redirect(`/veli/dashboard?id=${kursNumarasi}`);
        } else if (girisTipi === 'ogrenci') {
            return res.redirect(`/ogrenci/dashboard?id=${kursNumarasi}`);
        }

    } catch (error) {
        console.error("Giriş işlemi sırasında hata:", error);
        return res.status(500).send("Sistemsel bir hata oluştu, lütfen tekrar deneyin.");
    }
};

module.exports = { loginProcess };
