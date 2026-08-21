const { getStudentByNumber } = require('../services/userService');

// Giriş İşlemini Yöneten Fonksiyon
const loginProcess = async (req, res) => {
    // login.ejs'deki formdan gelen verileri alıyoruz
    const { kullaniciAdi, kursNumarasi, girisTipi } = req.body;

    try {
        // 1. Adım: Veritabanından kurs numarasına göre öğrenciyi bul
        const student = await getStudentByNumber(kursNumarasi);

        // Eğer veritabanında böyle bir numara yoksa
        if (!student) {
            // Şimdilik basit bir mesaj döndürüyoruz, ileride ekrana şık bir uyarı basarız
            return res.send("Hata: Bu kurs numarasına ait bir öğrenci bulunamadı.");
        }

        // İsteğe bağlı: İsim eşleşiyor mu diye kontrol edilebilir (Şimdilik numara yeterli)

        // 2. Adım: Hangi butona tıklandığına göre yönlendirme yap
        if (girisTipi === 'veli') {
            console.log(`[GİRİŞ] Veli paneline yönlendiriliyor: ${student.isim}`);
            // Veli paneline, öğrencinin ID'si ile yönlendir
            return res.redirect(`/veli/dashboard?id=${kursNumarasi}`);
            
        } else if (girisTipi === 'ogrenci') {
            console.log(`[GİRİŞ] Öğrenci paneline yönlendiriliyor: ${student.isim}`);
            // Öğrenci paneline, öğrencinin ID'si ile yönlendir
            return res.redirect(`/ogrenci/dashboard?id=${kursNumarasi}`);
            
        } else if (girisTipi === 'admin') {
            // İleride kendi (öğretmen) girişinizi buradan yönlendirebiliriz
            return res.redirect('/admin/dashboard');
        }

    } catch (error) {
        console.error("Giriş işlemi sırasında hata:", error);
        return res.status(500).send("Sistemsel bir hata oluştu, lütfen tekrar deneyin.");
    }
};

module.exports = { loginProcess };
