/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Volume2,
  VolumeX,
  Download,
  Code2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Copy,
  Check,
  Eye,
  Ear,
  Smile,
  Activity
} from 'lucide-react';
import { soundSys } from './utils/audio';
import { DogIllustration, DogState } from './components/DogIllustration';
import { AudioVisualizer } from './components/AudioVisualizer';
import { AiVetPanel, AiAnalysisState } from './components/AiVetPanel';
import { CertificateModal } from './components/CertificateModal';
import { generateSingleFileHtmlCode } from './utils/singleFileHtmlGenerator';

export default function App() {
  // Global Durumlar
  const [currentModule, setCurrentModule] = useState<1 | 2 | 3>(1);
  const [securityScore, setSecurityScore] = useState<number>(100);
  const [stressLevel, setStressLevel] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Modül 1 Durumu (Görsel Okuma ve Beden Dili Analizi)
  const [inspectedHotspots, setInspectedHotspots] = useState<Set<'ears' | 'eyes' | 'mouth'>>(new Set());
  const [activeHotspot, setActiveHotspot] = useState<'ears' | 'eyes' | 'mouth' | null>(null);
  const [module1DiagnosisAnswer, setModule1DiagnosisAnswer] = useState<number | null>(null);
  const [module1Completed, setModule1Completed] = useState<boolean>(false);

  // Modül 2 Durumu (Fiziksel Duruş ve Eylem Seçimi)
  const [selectedAction, setSelectedAction] = useState<'run' | 'stare' | 'tree' | null>(null);
  const [module2Completed, setModule2Completed] = useState<boolean>(false);

  // Modül 3 Durumu (Sesli İletişim ve Alan Yönetimi)
  const [selectedWalkStrategy, setSelectedWalkStrategy] = useState<'panic' | 'calm_curve' | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [soundMode, setSoundMode] = useState<'calm' | 'panic' | 'idle'>('idle');
  const [soundLabel, setSoundLabel] = useState<string>('Hazır');
  const [module3Completed, setModule3Completed] = useState<boolean>(false);

  // Dinamik Köpek Beden Dili State'i
  const [dogState, setDogState] = useState<DogState>({
    stressLevel: 75,
    earState: 'pinned_back',
    eyeState: 'whale_eye',
    mouthState: 'lip_lick',
    tailState: 'tucked',
    posture: 'crouched_fear',
  });

  // AI Veteriner Uzmanı Analizi State'i
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisState>({
    technicalStatus: '[AI Durum Analizi: Modül_1 // Görsel_Gözlem_Aşamasındasınız]',
    pedagogicalFeedback:
      'Sokak köpekleri iletişimlerinin %90’ını mikro beden hareketleriyle ifade eder. Tehdit algılayan bir köpek aniden saldırmadan önce mutlaka sakinleştirici veya savunmacı sinyaller verir. Köpeğin üzerindeki 1, 2 ve 3 numaralı noktalara dokunarak sinyalleri inceleyin.',
    verdict: 'info',
    etologicalTerm: 'Turid Rugaas Sakinleştirici Sinyalleri (Calming Signals)',
  });

  // Ses Durumu Senkronizasyonu
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundSys.isMuted = next;
    if (!next) {
      soundSys.playClick();
    }
  };

  // Tek Dosya HTML İndirme (Flash bellek için)
  const handleDownloadSingleFile = () => {
    soundSys.playClick();
    const htmlContent = generateSingleFileHtmlCode();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pati-kod-simulator.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Kodu Panoya Kopyalama
  const handleCopyCode = async () => {
    soundSys.playClick();
    try {
      await navigator.clipboard.writeText(generateSingleFileHtmlCode());
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Modül 1: Hotspot Tıklaması
  const handleSelectHotspot = (spot: 'ears' | 'eyes' | 'mouth') => {
    soundSys.playClick();
    setActiveHotspot(spot);
    const updated = new Set(inspectedHotspots);
    updated.add(spot);
    setInspectedHotspots(updated);

    if (spot === 'ears') {
      setAiAnalysis({
        technicalStatus: '[AI Durum Analizi: Pinned_Ears // Savunma_Pozisyonu: Aktif]',
        pedagogicalFeedback:
          'Kafaya yapışık ve arkaya doğru yatırılmış kulaklar, köpeğin ciddi bir iç gerilim yaşadığını, ortamı güvensiz bulduğunu ve ani hareketlerde savunma refleksi gösterebileceğini bildirir. Rahat bir köpeğin kulakları hafif gevşek veya dikkate dayalı öndedir.',
        verdict: 'warning',
        etologicalTerm: 'Postüral Savunma Gerilimi',
      });
    } else if (spot === 'eyes') {
      setAiAnalysis({
        technicalStatus: '[AI Durum Analizi: Whale_Eye_Confirmed // Fiksasyon Oranı: %92]',
        pedagogicalFeedback:
          'Whale Eye (Balina Gözü), köpeğin göz akının (sklerasının) hilal şeklinde dışarıdan açıkça görünmesidir. Köpek başını çevirmeden yan gözle tehdit olarak gördüğü kişiyi odaklar. Bu sinyal, sınırlarının aşıldığına dair net bir uyarıdır.',
        verdict: 'danger',
        etologicalTerm: 'Whale Eye (Göz Akı Sinyali)',
      });
    } else if (spot === 'mouth') {
      setAiAnalysis({
        technicalStatus: '[AI Durum Analizi: Lip_Licking_Loop // Otonom_Yatıştırma]',
        pedagogicalFeedback:
          'Dudak ve burun yalama (Lip Lick) hareketi, köpeklerin stres altında salgıladığı yatıştırıcı bir fizyolojik reflekstir. Köpek "Lütfen üzerime gelme, çatışma istemiyorum" demektedir. Açlıkla ilgisi yoktur.',
        verdict: 'info',
        etologicalTerm: 'Calming Signal: Dudak Yalama',
      });
    }
  };

  // Modül 1: Teşhis Yanıtı
  const handleDiagnosisChoice = (optionIndex: number) => {
    setModule1DiagnosisAnswer(optionIndex);
    if (optionIndex === 1) {
      // Doğru Seçenek (B)
      soundSys.playSuccess();
      setModule1Completed(true);
      setSecurityScore((prev) => Math.min(100, prev + 10));
      setAiAnalysis({
        technicalStatus: '[AI Durum Analizi: Teşhis_Doğrulandı // +10 Güvenlik Puanı]',
        pedagogicalFeedback:
          'Harika tespit! Göz akı, geriye yapışık kulak ve dudak yalama sinyalleri bir arada görüldüğünde köpeğin yüksek stres altında olduğu ve kendi güvenli alanına çekilmek istediği kesinleşir. Asla sevmeye çalışılmamalı veya sıkıştırılmamalıdır.',
        verdict: 'correct',
        etologicalTerm: 'Doğru Beden Dili Okuması',
      });
    } else {
      // Yanlış Seçenek
      soundSys.playWarning();
      setSecurityScore((prev) => Math.max(0, prev - 15));
      setAiAnalysis({
        technicalStatus: '[AI Durum Analizi: Hatalı_Yorumlama // -15 Ceza Puanı]',
        pedagogicalFeedback:
          'Hatalı Yorum: Dudak yalamak açlık veya oyun istemek değildir. Bu sinyaller dikkate alınmaz ve köpeğin üstüne gidilirse, köpek kendini savunmak için hırlamaya veya ısırmaya mecbur kalabilir. Lütfen doğru seçeneği işaretleyin.',
        verdict: 'danger',
        etologicalTerm: 'Yanlış Teşhis Tehlikesi',
      });
    }
  };

  // Modül 2'ye Geçiş
  const proceedToModule2 = () => {
    soundSys.playClick();
    setCurrentModule(2);
    setStressLevel(85);
    setDogState({
      stressLevel: 85,
      earState: 'tense_alert',
      eyeState: 'whale_eye',
      mouthState: 'barking',
      tailState: 'stiff_high',
      posture: 'tense_forward',
    });
    soundSys.playDogBark();
    setAiAnalysis({
      technicalStatus: '[AI Durum Analizi: Dinamik_Tehdit_Senaryosu // Nabız: Yüksek]',
      pedagogicalFeedback:
        'Senaryo: Sokakta yürürken köpek aniden havlayarak hızla üzerinize doğru koşmaya başladı! Bu kritik anda vücut diliniz ve duruşunuz saldırıyı başlatabilir veya tamamen engelleyebilir. Ne yapacaksınız?',
      verdict: 'warning',
      etologicalTerm: 'Yırtıcı Av Güdüsü (Prey Drive) Eşiği',
    });
  };

  // Modül 2: Aksiyon Seçimi
  const handleModule2Action = (action: 'run' | 'stare' | 'tree') => {
    setSelectedAction(action);
    if (action === 'tree') {
      // DOĞRU: Ağaç Olmak
      soundSys.playSuccess();
      setModule2Completed(true);
      setStressLevel(25);
      setDogState({
        stressLevel: 25,
        earState: 'relaxed',
        eyeState: 'relaxed',
        mouthState: 'relaxed',
        tailState: 'relaxed_wag',
        posture: 'calm_sitting',
      });
      setAiAnalysis({
        technicalStatus: '[AI Durum Analizi: Ağaç_Duruşu_Uygulandı // Av_Güdüsü: Sıfırlandı]',
        pedagogicalFeedback:
          'Kusursuz Karar! "Ağaç Olmak" (Tree Pose): Hareketsiz durup elleri göğüste toplamak ve bakışları yana kaçırmak, köpeğin beynindeki kovalanacak av veya savaşılacak rakip algısını anında söndürür. Köpek sizi koklar, cansız bir nesne gibi sıkıcı bulur ve ilgisini kaybederek uzaklaşır. Stres seviyesi %25e geriledi.',
        verdict: 'correct',
        etologicalTerm: 'Sosyal Tehdit İptali: Tree Pose',
      });
    } else if (action === 'run') {
      // YANLIŞ: Çığlık atıp kaçmak
      soundSys.playDogBark();
      soundSys.playWarning();
      setSecurityScore((prev) => Math.max(0, prev - 25));
      setStressLevel(95);
      setDogState((prev) => ({ ...prev, stressLevel: 95, mouthState: 'barking' }));
      setAiAnalysis({
        technicalStatus: '[AI Durum Analizi: Av_Güdüsü_Tetiklendi // HATA: -25 Puan]',
        pedagogicalFeedback:
          'HAYATİ HATA: Hiçbir insan bir sokak köpeğinden hızlı koşamaz! Kaçmak ve çığlık atmak, köpeğin atalarından miras kalan kovalama ve yakalama refleksini (Prey Drive) otomatik olarak devreye sokar. Asla arkanızı dönüp koşmayın!',
        verdict: 'danger',
        etologicalTerm: 'Avcılık Refleksinin Uyarılması',
      });
    } else if (action === 'stare') {
      // YANLIŞ: Göz teması ve dik bakış
      soundSys.playDogBark();
      soundSys.playWarning();
      setSecurityScore((prev) => Math.max(0, prev - 20));
      setStressLevel(90);
      setDogState((prev) => ({ ...prev, stressLevel: 90, mouthState: 'tense_growl' }));
      setAiAnalysis({
        technicalStatus: '[AI Durum Analizi: Doğrudan_Meydan_Okuma // HATA: -20 Puan]',
        pedagogicalFeedback:
          'CİDDİ HATA: Hayvanlar aleminde doğrudan gözlerin içine dik dik bakmak ve el-kol sallamak bir düello davetidir. Köpek bunu "bana saldıracak" şeklinde yorumlayarak savunma ısırığına geçebilir. Gözlerinizi yere veya yanlara kaydırarak yan durmalısınız.',
        verdict: 'danger',
        etologicalTerm: 'Doğrudan Tehdit / Dominans Yanılgısı',
      });
    }
  };

  // Modül 3'e Geçiş
  const proceedToModule3 = () => {
    soundSys.playClick();
    setCurrentModule(3);
    setStressLevel(70);
    setSelectedAction(null);
    setDogState({
      stressLevel: 70,
      earState: 'tense_alert',
      eyeState: 'whale_eye',
      mouthState: 'tense_growl',
      tailState: 'stiff_high',
      posture: 'tense_forward',
    });
    setAiAnalysis({
      technicalStatus: '[AI Durum Analizi: Kaynak_Koruma_Modu // Alan_Yönetimi_Aktif]',
      pedagogicalFeedback:
        'Senaryo: Köpek yerde lezzetli bir kemiği koruyor (Kaynak Koruma - Resource Guarding). Sokaktan geçmeniz gerekiyor. Köpeğin ses algısını test etmek için aşağıdaki ses frekanslarını ve yürüme rotalarını deneyin.',
      verdict: 'info',
      etologicalTerm: 'Kaynak Koruma Davranışı (Resource Guarding)',
    });
  };

  // Modül 3: Ses Frekansı ve Rota Testi
  const handleAcousticStrategy = (strategy: 'panic' | 'calm_curve') => {
    setSelectedWalkStrategy(strategy);
    if (strategy === 'panic') {
      setSoundMode('panic');
      setSoundLabel('Tiz Çığlık (1800 Hz)');
      soundSys.playPanicTone((analyser) => {
        setAnalyserNode(analyser);
      });
      setStressLevel(95);
      setSecurityScore((prev) => Math.max(0, prev - 15));
      setDogState((prev) => ({
        ...prev,
        stressLevel: 95,
        mouthState: 'barking',
        tailState: 'stiff_high',
      }));
      setAiAnalysis({
        technicalStatus: '[AI Durum Analizi: Akustik_Alarm // Reaktif_Saldırganlık: %95]',
        pedagogicalFeedback:
          'HATA: Tiz çığlıklar (1400 - 2200 Hz), köpekte panik ve kavga alarmı yaratır. Ayrıca doğrudan yiyeceğin üzerine doğru düz çizgide yürümek, yemeğini gasbetmeye geldiğiniz şeklinde algılanır. Köpek kemiğini korumak için sertleşir.',
        verdict: 'danger',
        etologicalTerm: 'Akustik Tehdit & Doğrusal Yaklaşım Hatası',
      });
    } else {
      // SAKİN FREKANS VE GENİŞ KAVİS (C-CURVE)
      setSoundMode('calm');
      setSoundLabel('Sakin Monoton Ton (180 Hz)');
      soundSys.playCalmTone((analyser) => {
        setAnalyserNode(analyser);
      });
      setStressLevel(15);
      setDogState({
        stressLevel: 15,
        earState: 'relaxed',
        eyeState: 'relaxed',
        mouthState: 'relaxed',
        tailState: 'relaxed_wag',
        posture: 'calm_sitting',
      });
      setModule3Completed(true);
      setAiAnalysis({
        technicalStatus: '[AI Durum Analizi: C_Kavisi_Kabul_Edildi // Stres Seviyesi: %15]',
        pedagogicalFeedback:
          'KUSURSUZ PROTOKOL: Düşük frekanslı (170-200 Hz), sakin ve monoton ses tonu köpeğe tehlike olmadığını bildirir. En önemlisi; doğrudan üstüne değil, bir hilal (C harfi) gibi geniş bir kavis çizerek geçmek, köpekler dünyasında "Yemeğin ve alanın tamamen senin, sana saygı duyuyorum" demektir. Simülasyonu başarıyla tamamladınız!',
        verdict: 'correct',
        etologicalTerm: 'Geniş Kavis (Curved Approach) & Düşük Frekans',
      });
    }
  };

  // Tüm Modülleri Tamamlayıp Sertifikayı Açma
  const handleOpenCertificate = () => {
    soundSys.playVictory();
    setShowCertificate(true);
  };

  // Simülasyonu Baştan Başlatma
  const handleRestart = () => {
    soundSys.playClick();
    setCurrentModule(1);
    setSecurityScore(100);
    setStressLevel(75);
    setInspectedHotspots(new Set());
    setActiveHotspot(null);
    setModule1DiagnosisAnswer(null);
    setModule1Completed(false);
    setSelectedAction(null);
    setModule2Completed(false);
    setSelectedWalkStrategy(null);
    setModule3Completed(false);
    setShowCertificate(false);
    setDogState({
      stressLevel: 75,
      earState: 'pinned_back',
      eyeState: 'whale_eye',
      mouthState: 'lip_lick',
      tailState: 'tucked',
      posture: 'crouched_fear',
    });
    setAiAnalysis({
      technicalStatus: '[AI Durum Analizi: Modül_1 // Görsel_Gözlem_Aşamasındasınız]',
      pedagogicalFeedback:
        'Sokak köpekleri iletişimlerinin %90’ını mikro beden hareketleriyle ifade eder. Tehdit algılayan bir köpek aniden saldırmadan önce mutlaka sakinleştirici veya savunmacı sinyaller verir. Köpeğin üzerindeki 1, 2 ve 3 numaralı noktalara dokunarak sinyalleri inceleyin.',
      verdict: 'info',
      etologicalTerm: 'Turid Rugaas Sakinleştirici Sinyalleri (Calming Signals)',
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-[#0F172A] flex flex-col font-sans select-none">
      {/* ============================================================== */}
      {/* 1. ÜST SABİT DURUM ÇUBUĞU (HUD)                                */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-[#E2E8F0] shadow-sm px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo ve Başlık */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center text-xl font-bold shadow-sm">
              🐾
            </span>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-[#0F172A] leading-tight">
                PATİ-KOD
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Sokak Köpeği Beden Dili & Güvenli İletişim Simülatörü
              </p>
            </div>
          </div>

          {/* HUD Metrikleri */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Aktif Modül Tab Göstergesi */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <span
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currentModule === 1 ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-500'
                }`}
              >
                1. İnceleme
              </span>
              <span
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currentModule === 2 ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-500'
                }`}
              >
                2. Duruş
              </span>
              <span
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currentModule === 3 ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-500'
                }`}
              >
                3. Ses & Kavis
              </span>
            </div>

            {/* Güvenlik Skoru */}
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Güvenlik Skoru
              </span>
              <span className="font-mono text-base sm:text-lg font-extrabold text-[#0284C7] tabular-nums">
                {securityScore} / 100
              </span>
            </div>

            {/* Köpeğin Stres Seviyesi Barı */}
            <div className="flex flex-col w-32 sm:w-44">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-500 uppercase">Köpek Stresi</span>
                <span
                  className={`font-mono font-bold ${
                    stressLevel >= 70
                      ? 'text-red-600'
                      : stressLevel >= 35
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  %{stressLevel}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    stressLevel >= 70
                      ? 'bg-red-500'
                      : stressLevel >= 35
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${stressLevel}%` }}
                />
              </div>
            </div>

            {/* Ses Aç / Kapa Butonu */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isMuted
                  ? 'bg-slate-100 text-slate-500 border-slate-300'
                  : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
              }`}
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
              <span className="hidden md:inline">{isMuted ? 'Sessiz' : 'Ses Açık'}</span>
            </button>

            {/* Flash Bellek İçin Tek Dosya İndir */}
            <button
              onClick={handleDownloadSingleFile}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              title="İnternetsiz akıllı tahtalarda flash bellekle çalıştırmak için tek dosya HTML indir"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Flash Belleğe İndir (.html)</span>
            </button>

            {/* Tek Dosya Kodunu Görüntüle */}
            <button
              onClick={() => setShowCodeModal(true)}
              className="p-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs"
              title="Tek Dosya Kaynak Kodunu Görüntüle"
            >
              <Code2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. ANA EĞİTİM ALANI: İKİ BÖLMELİ AKILLI TAHTA SAHNESİ            */}
      {/* ============================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SOL SAHNE: DİNAMİK SVG KÖPEK VE ETKİLEŞİM KATMANI (7 Kolon) */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                {currentModule === 1 && 'Modül 1 / 3: Görsel Okuma ve Beden Dili Analizi'}
                {currentModule === 2 && 'Modül 2 / 3: Fiziksel Duruş ve Eylem Seçimi'}
                {currentModule === 3 && 'Modül 3 / 3: Sesli İletişim ve Alan Yönetimi'}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                {currentModule === 1 && 'Sokak Köpeğinin Beden Dilini İnceleyin'}
                {currentModule === 2 && 'Köpek Havlayarak Üzerinize Geliyor!'}
                {currentModule === 3 && 'Yiyeceğini Koruyan Köpeğin Yanından Geçiş'}
              </h2>
            </div>
            {currentModule === 1 && (
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-sky-50 text-sky-800 rounded-full border border-sky-200">
                İncelenen: {inspectedHotspots.size} / 3
              </span>
            )}
          </div>

          {/* SVG Köpek Çizimi Sahnesi */}
          <div className="w-full bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] rounded-xl border border-slate-200 overflow-hidden p-2 relative">
            <DogIllustration
              state={dogState}
              showHotspots={currentModule === 1}
              activeHotspot={activeHotspot}
              inspectedSpots={inspectedHotspots}
              onSelectHotspot={handleSelectHotspot}
              showBone={currentModule === 3}
              actionResult={selectedAction}
              walkStrategy={selectedWalkStrategy}
            />
          </div>

          {/* Alt İpucu Şeridi */}
          <div className="bg-sky-50 border-l-4 border-sky-600 p-3 rounded-r-lg text-xs sm:text-sm text-sky-950 flex items-center justify-between">
            <p>
              {currentModule === 1 && (
                <>
                  💡 <strong>Akıllı Tahta İpucu:</strong> Köpeğin başındaki{' '}
                  <strong>1 (Kulaklar)</strong>, <strong>2 (Gözler)</strong> ve{' '}
                  <strong>3 (Ağız/Burun)</strong> numaralı dairelere dokunarak stres işaretlerini
                  okuyun.
                </>
              )}
              {currentModule === 2 && (
                <>
                  ⚠️ <strong>Kritik Karar:</strong> Ani hareketler köpeğin av güdüsünü tetikler.
                  Doğru fiziksel duruşu seçin!
                </>
              )}
              {currentModule === 3 && (
                <>
                  🎯 <strong>Alan Yönetimi:</strong> Yiyecek koruyan köpeğe doğrudan düz yürümek
                  tehdittir. Ses tonunu ve rotanızı test edin.
                </>
              )}
            </p>
          </div>
        </section>

        {/* SAĞ PANEL: MODÜL ETKİLEŞİMİ & AI VETERİNER DAVRANIŞ UZMANI (5 Kolon) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          {/* AKTİF MODÜL KARTI */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            {/* ================= MODÜL 1 İÇERİĞİ ================= */}
            {currentModule === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    1. Aşama: Stres Belirtilerini Keşfet
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sokaktaki güçlü AmStaff tipi köpeğin gergin olduğunu gösteren 3 kritik noktayı
                    inceleyin:
                  </p>
                </div>

                {/* Hotspot Kontrol Listesi */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleSelectHotspot('ears')}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                      inspectedHotspots.has('ears')
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 hover:bg-sky-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Ear className="w-4 h-4 text-sky-600" />
                      1. Kulak Pozisyonu (Geriye Yapışık)
                    </span>
                    {inspectedHotspots.has('ears') ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">İncele</span>
                    )}
                  </button>

                  <button
                    onClick={() => handleSelectHotspot('eyes')}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                      inspectedHotspots.has('eyes')
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 hover:bg-sky-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-sky-600" />
                      2. Whale Eye (Göz Akının Görünmesi)
                    </span>
                    {inspectedHotspots.has('eyes') ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">İncele</span>
                    )}
                  </button>

                  <button
                    onClick={() => handleSelectHotspot('mouth')}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                      inspectedHotspots.has('mouth')
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 hover:bg-sky-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Smile className="w-4 h-4 text-sky-600" />
                      3. Dudak Yalama (Lip Lick - Yatıştırma)
                    </span>
                    {inspectedHotspots.has('mouth') ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">İncele</span>
                    )}
                  </button>
                </div>

                {/* 3 Nokta Tamamlandıysa Açılan Teşhis Sorusu */}
                {inspectedHotspots.size >= 3 && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase tracking-wide">
                      <HelpCircle className="w-4 h-4 text-sky-600" />
                      Teşhis Sorusu: Köpek Ne Anlatıyor?
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleDiagnosisChoice(0)}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          module1DiagnosisAnswer === 0
                            ? 'bg-red-50 border-red-300 text-red-900'
                            : 'bg-white border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        A) Oyun oynamak istiyor ve yanına gelip sevmemi bekliyor.
                      </button>

                      <button
                        onClick={() => handleDiagnosisChoice(1)}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          module1DiagnosisAnswer === 1
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                            : 'bg-white border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        B) Yüksek stres altında, korkmuş ve sınırlarına saygı duyulup uzak durulmasını istiyor.
                      </button>

                      <button
                        onClick={() => handleDiagnosisChoice(2)}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          module1DiagnosisAnswer === 2
                            ? 'bg-red-50 border-red-300 text-red-900'
                            : 'bg-white border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        C) Karnı çok acıkmış ve elinizdeki çantada yiyecek arıyor.
                      </button>
                    </div>

                    {module1Completed && (
                      <button
                        onClick={proceedToModule2}
                        className="w-full mt-3 py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm shadow transition-all flex items-center justify-center gap-2"
                      >
                        <span>Modül 2'ye Geç: Eylem Seçimi</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ================= MODÜL 2 İÇERİĞİ ================= */}
            {currentModule === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Anlık Refleks: Köpek Havlayarak Koşuyor!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Hayatta kalmak ve olası bir yaralanmayı önlemek için hangisini yapacaksınız?
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => handleModule2Action('run')}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      selectedAction === 'run'
                        ? 'bg-red-50 border-red-400 text-red-900'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">🏃‍♂️</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs">A) Çığlık Atıp Hızla Koşarak Kaçmak</p>
                      <p className="text-[11px] text-slate-500">
                        Arkanızı dönüp tüm gücünüzle ters yöne koşarsınız.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleModule2Action('stare')}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      selectedAction === 'stare'
                        ? 'bg-red-50 border-red-400 text-red-900'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">👀</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs">
                        B) Gözlerinin İçine Dik Dik Bakıp El Kol Sallamak
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Tehditkar sesle bağırıp köpeğin gözlerine kilitlenirsiniz.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleModule2Action('tree')}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      selectedAction === 'tree'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">🌳</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs">
                        C) 'Ağaç Olmak' (Tree Pose - En Güvenli Duruş)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Sabit dur, kollarını göğsünde topla, bakışlarını yere/yana kaçır ve yan dön!
                      </p>
                    </div>
                  </button>
                </div>

                {module2Completed && (
                  <button
                    onClick={proceedToModule3}
                    className="w-full mt-2 py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm shadow transition-all flex items-center justify-center gap-2"
                  >
                    <span>Modül 3'e Geç: Ses & Alan Yönetimi</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            )}

            {/* ================= MODÜL 3 İÇERİĞİ ================= */}
            {currentModule === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Kaynak Koruma & Akustik Frekans Testi
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Yerdeki kemiği koruyan köpeğin yanından güvenle geçmek için ses tonunuzu ve
                    rotanızı test edin:
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => handleAcousticStrategy('panic')}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      selectedWalkStrategy === 'panic'
                        ? 'bg-red-50 border-red-400 text-red-900'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">📢</span>
                    <div>
                      <p className="font-bold text-xs">
                        Yüksek / Panik Çığlık (1800 Hz) + Düz Üstüne Yürüme
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Tiz ve alarmlı ses tonu köpekte saldırgan tepki uyandırır.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAcousticStrategy('calm_curve')}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      selectedWalkStrategy === 'calm_curve'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">🎵</span>
                    <div>
                      <p className="font-bold text-xs">
                        Sakin / Düşük Frekans (180 Hz) + Geniş Kavis (C-Curve)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Monoton güven verici ses ve kişisel alanına saygı gösteren kavisli yürüyüş.
                      </p>
                    </div>
                  </button>
                </div>

                {/* CANLI SES FREKANSI GÖRSELLEŞTİRİCİSİ */}
                <AudioVisualizer
                  analyserNode={analyserNode}
                  mode={soundMode}
                  label={soundLabel}
                />

                {module3Completed && (
                  <button
                    onClick={handleOpenCertificate}
                    className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 animate-bounce"
                  >
                    <span>🎓 Simülasyonu Bitir ve Sertifikayı Al</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* AI VETERİNER DAVRANIŞ UZMANI PANELİ */}
          <AiVetPanel analysis={aiAnalysis} />
        </section>
      </main>

      {/* ============================================================== */}
      {/* 3. SERTİFİKA VE BAŞARI BELGESİ MODALI                          */}
      {/* ============================================================== */}
      {showCertificate && (
        <CertificateModal
          score={securityScore}
          maxScore={100}
          onRestart={handleRestart}
          onDownloadHtml={handleDownloadSingleFile}
        />
      )}

      {/* ============================================================== */}
      {/* 4. TEK DOSYA KAYNAK KODU MODALI (Kopyalama & Denetim İçin)      */}
      {/* ============================================================== */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Tek Dosya (Single-File HTML) Kaynak Kodu
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Kopyalandı!' : 'Tüm Kodu Kopyala'}</span>
                </button>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 bg-slate-950 overflow-auto">
              <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                {generateSingleFileHtmlCode()}
              </pre>
            </div>
            <div className="px-6 py-3 border-t bg-slate-50 text-xs text-slate-600 flex justify-between items-center">
              <span>Sıfır harici kütüphane, tamamen offline uyumlu tek dosya.</span>
              <button
                onClick={handleDownloadSingleFile}
                className="text-sky-700 font-bold hover:underline"
              >
                Doğrudan İndir (.html)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
