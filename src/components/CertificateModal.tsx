import React, { useState } from 'react';
import { Award, CheckCircle, RotateCcw, Printer, Sparkles, Shield, User } from 'lucide-react';
import { soundSys } from '../utils/audio';

interface CertificateModalProps {
  score: number;
  maxScore: number;
  onRestart: () => void;
  onDownloadHtml: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  score,
  maxScore,
  onRestart,
  onDownloadHtml,
}) => {
  const [studentName, setStudentName] = useState('Genç Güvenli İletişim Uzmanı');
  const [isEditingName, setIsEditingName] = useState(false);

  const handlePrint = () => {
    soundSys.playClick();
    window.print();
  };

  const today = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border-4 border-sky-600/30 overflow-hidden my-6">
        {/* Sertifika Gövdesi (Yazdırılabilir Alan) */}
        <div className="p-8 sm:p-12 relative bg-gradient-to-b from-sky-50/60 via-white to-sky-50/40 print:p-6 print:m-0 border-8 border-double border-sky-700/20 m-2 rounded-xl">
          {/* Köşe Süsleri */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-sky-600"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-sky-600"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-sky-600"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-sky-600"></div>

          {/* Üst Logo ve Başlık */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-600 text-white shadow-lg mb-2">
              <Award className="w-9 h-9" />
            </div>
            <p className="text-xs font-mono font-bold text-sky-800 tracking-widest uppercase">
              TÜRKİYE AKILLI TAHTA & EĞİTİM TEKNOLOJİLERİ
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              GÜVENLİ İLETİŞİM UZMANI SERTİFİKASI
            </h1>
            <p className="text-sm text-slate-600">
              PATİ-KOD: Sokak Köpeği Beden Dili ve Kamu Güvenliği Simülasyonu
            </p>
          </div>

          {/* Tebrik ve Öğrenci İsmi */}
          <div className="text-center my-6 py-4 border-y border-dashed border-sky-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
              Bu Başarı Belgesi Gururla Verilmiştir:
            </p>
            {isEditingName ? (
              <div className="inline-flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="text-center text-xl font-bold text-sky-900 border-b-2 border-sky-600 outline-none px-2 py-1 bg-sky-50/50 rounded"
                  autoFocus
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                />
                <button
                  onClick={() => setIsEditingName(false)}
                  className="text-xs bg-sky-600 text-white px-2 py-1 rounded font-medium"
                >
                  Kaydet
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingName(true)}
                className="cursor-pointer group inline-flex items-center justify-center gap-2"
                title="İsmi değiştirmek için tıklayın"
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-900 tracking-normal group-hover:text-sky-700 underline decoration-sky-300 underline-offset-4">
                  {studentName}
                </h2>
                <User className="w-5 h-5 text-sky-600 opacity-60 group-hover:opacity-100" />
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2">
              (İsmi değiştirmek için yukarıdaki yazıya tıklayabilirsiniz)
            </p>
          </div>

          {/* Skor ve Başarı Mesajı */}
          <div className="bg-white/80 p-4 rounded-xl border border-sky-100 shadow-sm max-w-xl mx-auto text-center mb-6">
            <div className="flex items-center justify-center gap-4 text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> 3/3 Modül Başarılı
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-sky-800">
                <Sparkles className="w-4 h-4 text-sky-600" /> Güvenlik Skoru:{' '}
                <strong className="text-lg text-sky-900 font-mono">{score} / {maxScore}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Sokak köpeklerinin sakinleştirici beden dili sinyallerini doğru okumuş, paniksiz
              fiziksel duruş (Ağaç Duruşu) sergilemiş ve kaynak koruma alanlarını güvenle yönetme yetkinliği kazanmıştır.
            </p>
          </div>

          {/* 3 TEMEL GÜVENLİK KURALI ÖZETİ */}
          <div className="space-y-2.5 max-w-2xl mx-auto mb-8">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-sky-600" />
              Hayat Kurtaran 3 Altın Güvenlik Kuralı:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-left">
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                <p className="font-bold text-sky-900 mb-1">1. Beden Dilini Oku</p>
                <p className="text-slate-600 text-[11px] leading-tight">
                  Geriye yatık kulak, göz akı (Whale Eye) ve dudak yalama yüksek stres işaretidir; asla zorla yaklaşma.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                <p className="font-bold text-sky-900 mb-1">2. Ağaç Ol (Tree Pose)</p>
                <p className="text-slate-600 text-[11px] leading-tight">
                  Köpek havlayarak gelirse çığlık atma, koşma. Kollarını göğsünde topla, yan dön, göz teması kurmadan hareketsiz dur.
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                <p className="font-bold text-sky-900 mb-1">3. Kavis ve Sakin Ses</p>
                <p className="text-slate-600 text-[11px] leading-tight">
                  Yemek yiyen veya uyuyan köpeğin üstüne düz yürüme. Geniş bir C kavisi çiz ve düşük, monoton sakin ses tonu kullan.
                </p>
              </div>
            </div>
          </div>

          {/* Alt Mühür ve İmza */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-600 max-w-xl mx-auto">
            <div>
              <p className="font-bold text-slate-800">Düzenlenme Tarihi</p>
              <p className="font-mono text-slate-600">{today}</p>
            </div>

            {/* Mühür */}
            <div className="w-16 h-16 rounded-full border-2 border-red-600 flex flex-col items-center justify-center text-red-600 font-extrabold rotate-[-12deg] p-1 shadow-sm">
              <span className="text-[9px] uppercase tracking-tighter">ONAYLANDI</span>
              <span className="text-[14px]">🐾</span>
              <span className="text-[8px] uppercase">PATİ-KOD</span>
            </div>

            <div className="text-right">
              <p className="font-bold text-slate-800">Pedagojik Kurul</p>
              <p className="font-mono text-slate-600">AI Etoloji Komitesi</p>
            </div>
          </div>
        </div>

        {/* Aksiyon Butonları (Yazdırma sırasında gizlenir) */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            Yeniden Başlat
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadHtml}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors shadow"
              title="Flash bellek ile çevrimdışı taşımak için tek dosya HTML indir"
            >
              📥 Flash Belleğe İndir (.html)
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-700 text-white font-semibold text-sm hover:bg-sky-800 transition-colors shadow"
            >
              <Printer className="w-4 h-4" />
              Sertifikayı Yazdır / PDF Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
