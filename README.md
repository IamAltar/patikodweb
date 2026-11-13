# 🐾 PATİ-KOD: Görünmez Önyargı ve Güvenli İletişim

**Ders:** Yapay Zeka ve Tasarım (Vize Ödevi)  
**Konu:** Sokak hayvanlarına ve özellikle önyargıyla yaklaşılan köpek ırklarına (*American Staffordshire Terrier / AmStaff, Pitbull vb.*) karşı hem **empati** hem de **bilimsel güvenli iletişim (etoloji)** bilinci oluşturan oyunlaştırılmış (gamified) interaktif web projesi.

---

## ✨ Proje Mimarisi ve Sayfalar

1. **Ana Tanıtım ve Oyun Web Sitesi (`index.html`):**
   - Projenin interaktif oyun ekranını, sıfırdan üretilen 2.5D hikaye sahnelerinin galerisini ve 4 özel vektörel eylem rozetinin bilimsel etoloji açıklamalarını barındırır.
2. **Sadece Oyunu İçeren Tam Ekran Bağımsız Sayfa (`oyun.html`):**
   - İçerisinde web sitesi üst/alt menüleri (navbar/footer) veya tanıtım metinleri bulunmaz.
   - Açıldığı anda doğrudan **tam ekran (100vw × 100vh)** olarak sadece **PATİ-KOD** oyununu çalıştırır.
   - Tüm CSS, JavaScript, SVG rozetler ve 5 sahnenin Base64 kodlu görselleri `oyun.html` içinde gömülüdür (standalone); hem Vercel üzerinde `.../oyun.html` adresinden hem de tek başına çevrimdışı olarak sorunsuz çalışır.

---

## 🎮 Oynanış & 'Oyun Bitti / İletişim Kazası (Game Over)' Sistemi

- **Canlı Güven & Stres Barı:** Oyuncunun doğru hamleleri *Köpek Güven & Sakinlik Barını* artırırken; yanlış bir fiziksel yaklaşım, kriz anında yanlış refleks, QTE süresinin dolması veya mama kabı koruma alanının ihlali **Köpek Stres Barını %100 (Kritik Seviye)** noktasına taşır.
- **Oyun Bitti / İletişim Kazası (Game Over) Ekranı:** Stres %100'e ulaştığında tüm zamanlayıcılar durur ve ekranda oyuncunun hangi hatayı yaptığını **🩺 AI Veteriner & Etolog Analizi (Dr. Pati)** ile bilimsel olarak açıklayan Game Over ekranı açılır.
- **🔄 Tekrar Dene (Restart):** Game Over ekranındaki buton tüm değişkenleri, barları ve skorları sıfırlayarak oyunu **1. Bölümden** temiz şekilde yeniden başlatır.
