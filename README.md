```
ozel-ders-asistanim/
│
├── 📁 public/                 # Tarayıcıda çalışacak statik dosyalar
│   ├── 📁 css/                # Tailwind çıktı dosyası (örn: output.css)
│   ├── 📁 js/                 # İstemci tarafı scriptler (Grafikler, UI etkileşimleri)
│   └── 📁 img/                # Logolar, rozetler, ikonlar
│
├── 📁 views/                  # EJS Şablonları (Görsel arayüzler)
│   ├── 📁 partials/           # Ortak parçalar (header.ejs, footer.ejs, sidebar.ejs vb.)
│   ├── 📁 admin/              # Öğretmen paneli (dashboard, ogrenci-yonetimi, kitaplik, odev-ata vb.)
│   ├── 📁 student/            # Öğrenci paneli (dashboard, odev-teslim vb.)
│   ├── 📁 parent/             # Veli paneli (dashboard - sadece okuma)
│   └── 📄 login.ejs           # Ortak giriş ekranı
│
├── 📁 routes/                 # URL yönlendirmeleri (Rotalar)
│   ├── 📄 indexRoutes.js      # Ana sayfa ve giriş/çıkış rotaları (/login, /logout)
│   ├── 📄 adminRoutes.js      # /admin/... uzantılı işlemler
│   ├── 📄 studentRoutes.js    # /ogrenci/... uzantılı işlemler
│   └── 📄 parentRoutes.js     # /veli/... uzantılı işlemler
│
├── 📁 controllers/            # İş mantığı (Rotalardan gelen istekleri işleyen beyin)
│   ├── 📄 authController.js   # Giriş ve kimlik doğrulama işlemleri
│   ├── 📄 adminController.js  # Öğretmen yetkisindeki işlemler
│   ├── 📄 studentController.js# Öğrencinin ödev kaydetme vb. işlemleri
│   └── 📄 parentController.js # Veli görüntüleme verilerini hazırlama
│
├── 📁 services/               # Firebase Firestore veritabanı işlemleri
│   ├── 📄 userService.js      # Kullanıcı (Öğrenci) okuma/yazma işlemleri
│   ├── 📄 bookService.js      # Kitap ve test envanteri işlemleri
│   └── 📄 assignmentService.js# Ödev atama ve sonuç güncelleme işlemleri
│
├── 📁 middlewares/            # Güvenlik ve yetki bariyerleri
│   └── 📄 authMiddleware.js   # Oturum kontrolü (Örn: Veli, öğrenci sayfasına giremesin)
│
├── 📁 config/                 # Proje yapılandırmaları
│   └── 📄 firebase.js         # Firebase Admin SDK bağlantı ayarları
│
├── 📄 server.js               # Uygulamanın ana başlangıç dosyası (Express kalbi)
├── 📄 package.json            # Proje bağımlılıkları (npm init ile oluşacak)
├── 📄 tailwind.config.js      # Tailwind CSS ayarları
├── 📄 .gitignore              # GitHub'a YÜKLENMEYECEK dosyalar listesi
└── 📄 .env                    # Gizli değişkenler (Örn: PORT=3000) - GitHub'a gitmez!

```


## 📁 Proje Dosya Yapısı (Project Structure)

| Klasör / Dosya | Açıklama |
| :--- | :--- |
| **ozel-ders-asistanim/** | |
| ├── 📂 **public/** | Tarayıcıda çalışacak statik dosyalar |
| │   ├── 📂 css/ | Tailwind çıktı dosyası (örn: `output.css`) |
| │   ├── 📂 js/ | İstemci tarafı scriptler (Grafikler, UI etkileşimleri) |
| │   └── 📂 img/ | Logolar, rozetler, ikonlar |
| ├── 📂 **views/** | EJS Şablonları (Görsel arayüzler) |
| │   ├── 📂 partials/ | Ortak parçalar (`header.ejs`, `footer.ejs`, `sidebar.ejs` vb.) |
| │   ├── 📂 admin/ | Öğretmen paneli (dashboard, ogrenci-yonetimi, kitaplik, odev-ata vb.) |
| │   ├── 📂 student/ | Öğrenci paneli (dashboard, odev-teslim vb.) |
| │   ├── 📂 parent/ | Veli paneli (dashboard - sadece okuma) |
| │   └── 📄 `login.ejs` | Ortak giriş ekranı |
| ├── 📂 **routes/** | URL yönlendirmeleri (Rotalar) |
| │   ├── 📄 `indexRoutes.js` | Ana sayfa ve giriş/çıkış rotaları (`/login`, `/logout`) |
| │   ├── 📄 `adminRoutes.js` | `/admin/...` uzantılı işlemler |
| │   ├── 📄 `studentRoutes.js` | `/ogrenci/...` uzantılı işlemler |
| │   └── 📄 `parentRoutes.js` | `/veli/...` uzantılı işlemler |
| ├── 📂 **controllers/** | İş mantığı (Rotalardan gelen istekleri işleyen beyin) |
| │   ├── 📄 `authController.js` | Giriş ve kimlik doğrulama işlemleri |
| │   ├── 📄 `adminController.js` | Öğretmen yetkisindeki işlemler |
| │   ├── 📄 `studentController.js` | Öğrencinin ödev kaydetme vb. işlemleri |
| │   └── 📄 `parentController.js` | Veli görüntüleme verilerini hazırlama |
| ├── 📂 **services/** | Firebase Firestore veritabanı işlemleri |
| │   ├── 📄 `userService.js` | Kullanıcı (Öğrenci) okuma/yazma işlemleri |
| │   ├── 📄 `bookService.js` | Kitap ve test envanteri işlemleri |
| │   └── 📄 `assignmentService.js` | Ödev atama ve sonuç güncelleme işlemleri |
| ├── 📂 **middlewares/** | Güvenlik ve yetki bariyerleri |
| │   └── 📄 `authMiddleware.js` | Oturum kontrolü (Örn: Veli, öğrenci sayfasına giremesin) |
| └── 📂 **config/** | Proje yapılandırmaları |
|     └── 📄 `firebase.js` | Firebase Admin SDK bağlantı ayarları |
├── 📄 `server.js` | Uygulamanın ana başlangıç dosyası (Express kalbi) |
├── 📄 `package.json` | Proje bağımlılıkları (npm init ile oluşacak) |
├── 📄 `tailwind.config.js` | Tailwind CSS ayarları |
├── 📄 `.gitignore` | GitHub'a YÜKLENMEYECEK dosyalar listesi |
└── 📄 `.env` | Gizli değişkenler (Örn: PORT=3000) - GitHub'a gitmez! |
