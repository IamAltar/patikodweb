/**
 * Bu yardımcı fonksiyon, uygulamanın tamamını (HTML5 + CSS3 + Vanilla JS + SVG + Web Audio API)
 * TEK BİR BAĞIMSIZ .HTML DOSYASI (Single-File HTML) olarak üretir.
 * Bu dosya internet bağlantısı olmaksızın flash bellekle akıllı tahtalara taşınıp çift tıklanarak çalışır.
 */

export const generateSingleFileHtmlCode = (): string => {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PATİ-KOD: Sokak Köpeği Beden Dili ve Güvenli İletişim Simülatörü</title>
  <meta name="description" content="Okullarda akıllı tahta ve çevrimdışı kullanıma uygun, sentetik Web Audio API ve interaktif SVG destekli sokak köpeği beden dili simülatörü.">
  <style>
    /* --- CSS RESET VE TEMEL STİLLER --- */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg-main: #F0F7FF;
      --surface: #FFFFFF;
      --surface-sub: #E2E8F0;
      --text-main: #0F172A;
      --text-muted: #475569;
      --primary: #0284C7;
      --primary-hover: #0369A1;
      --success: #059669;
      --danger: #DC2626;
      --warning: #D97706;
      --radius: 12px;
    }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-main);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      user-select: none;
      -webkit-user-select: none;
    }

    /* --- ÜST DURUM ÇUBUĞU (HUD) --- */
    header {
      background: #FFFFFF;
      border-bottom: 2px solid var(--surface-sub);
      padding: 12px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 40;
      box-shadow: 0 2px 4px rgba(15, 23, 42, 0.04);
    }
    .brand-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hud-metrics {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }
    .metric-card {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .metric-label {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }
    .metric-value {
      font-size: 1.15rem;
      font-weight: 800;
      font-family: monospace;
      color: #0284C7;
    }
    .stress-bar-container {
      width: 180px;
      height: 14px;
      background: #E2E8F0;
      border-radius: 999px;
      overflow: hidden;
      position: relative;
    }
    .stress-bar-fill {
      height: 100%;
      width: 75%;
      background: linear-gradient(90deg, #10B981, #F59E0B, #EF4444);
      transition: width 0.4s ease;
    }

    /* --- ANA OYUN ALANI --- */
    main {
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 20px;
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 24px;
      align-items: start;
    }
    @media (max-width: 960px) {
      main { grid-template-columns: 1fr; }
    }

    /* --- SAHNE VE KÖPEK İLLÜSTRASYONU --- */
    .stage-card {
      background: #FFFFFF;
      border: 1px solid var(--surface-sub);
      border-radius: var(--radius);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.04);
      position: relative;
    }
    .stage-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--surface-sub);
      padding-bottom: 12px;
    }
    .module-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      background: #E0F2FE;
      color: #0369A1;
      text-transform: uppercase;
    }
    .svg-wrapper {
      width: 100%;
      aspect-ratio: 4/3;
      position: relative;
      background: radial-gradient(circle at center, #F8FAFC 0%, #EDF2F7 100%);
      border-radius: 8px;
      overflow: hidden;
    }
    svg {
      width: 100%;
      height: 100%;
    }

    /* Animasyonlar */
    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 0.2; }
      100% { transform: scale(0.9); opacity: 0.8; }
    }
    .pulse-ring {
      animation: pulse 1.8s infinite ease-in-out;
      transform-origin: center;
    }
    .hotspot {
      cursor: pointer;
    }
    .hotspot:hover circle.base-btn {
      fill: #0284C7;
      stroke: #FFFFFF;
    }

    /* --- SAĞ ETKİLEŞİM PANELİ --- */
    .interactive-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .action-card {
      background: #FFFFFF;
      border: 1px solid var(--surface-sub);
      border-radius: var(--radius);
      padding: 20px;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.04);
    }
    .btn-action {
      width: 100%;
      padding: 14px 18px;
      margin-top: 10px;
      border-radius: 8px;
      border: 2px solid var(--surface-sub);
      background: #FFFFFF;
      color: var(--text-main);
      font-size: 0.95rem;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.2s ease;
    }
    .btn-action:hover {
      border-color: var(--primary);
      background: #F0F7FF;
    }
    .btn-action.correct {
      border-color: var(--success);
      background: #ECFDF5;
      color: #065F46;
    }
    .btn-action.wrong {
      border-color: var(--danger);
      background: #FEF2F2;
      color: #991B1B;
    }

    /* --- AI VETERİNER DAVRANIŞ UZMANI PANELİ --- */
    .ai-vet-box {
      background: #FFFFFF;
      border: 1px solid #BAE6FD;
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05);
    }
    .ai-vet-header {
      background: #F0F9FF;
      border-bottom: 1px solid #BAE6FD;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.85rem;
      font-weight: 800;
      color: #0369A1;
    }
    .ai-vet-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .ai-status-line {
      background: #0F172A;
      color: #38BDF8;
      font-family: monospace;
      font-size: 0.78rem;
      padding: 8px 12px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .ai-feedback-text {
      font-size: 0.92rem;
      line-height: 1.5;
      color: #1E293B;
    }

    /* --- SES GÖRSELLEŞTİRİCİSİ CANVAS --- */
    #visualizerCanvas {
      width: 100%;
      height: 90px;
      background: #020617;
      border-radius: 8px;
      display: block;
      margin-top: 10px;
    }

    /* --- MODAL SERTİFİKA --- */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 100;
    }
    .certificate-container {
      background: #FFFFFF;
      max-width: 760px;
      width: 100%;
      border-radius: 16px;
      padding: 36px;
      border: 6px double #0284C7;
      position: relative;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.25);
    }
    .btn-primary {
      background: var(--primary);
      color: #FFFFFF;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-primary:hover {
      background: var(--primary-hover);
    }
  </style>
</head>
<body>

  <!-- HUD ÜST ÇUBUK -->
  <header>
    <div class="brand-title">
      <span>🐾</span>
      <span>PATİ-KOD</span>
      <span style="font-weight:400; font-size:0.85rem; color:#64748B;">| Beden Dili & Güvenli İletişim</span>
    </div>

    <div class="hud-metrics">
      <div class="metric-card">
        <span class="metric-label">Aktif Modül</span>
        <span id="hudModule" class="metric-value">1 / 3</span>
      </div>

      <div class="metric-card">
        <span class="metric-label">Güvenlik Skoru</span>
        <span id="hudScore" class="metric-value">100 / 100</span>
      </div>

      <div class="metric-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="metric-label">Stres Seviyesi</span>
          <span id="stressNumber" style="font-size:0.75rem; font-weight:700; font-family:monospace; color:#E11D48;">%75</span>
        </div>
        <div class="stress-bar-container">
          <div id="stressBar" class="stress-bar-fill" style="width: 75%;"></div>
        </div>
      </div>

      <button id="btnSoundToggle" class="btn-primary" style="background:#E2E8F0; color:#0F172A; padding:6px 14px; font-size:0.8rem;" onclick="toggleSound()">
        🔊 Ses: Açık
      </button>
    </div>
  </header>

  <!-- OYUN SAHNESİ VE KONTROL ALANI -->
  <main>
    <!-- SOL: DİNAMİK SVG KÖPEK VE SAHNE -->
    <section class="stage-card">
      <div class="stage-header">
        <div>
          <span id="moduleBadge" class="module-badge">Modül 1: Görsel İnceleme</span>
          <h2 id="stageTitle" style="font-size: 1.15rem; font-weight:800; margin-top:4px;">Köpeğin Beden Dilini İnceleyin</h2>
        </div>
        <span id="inspectionCounter" style="font-size:0.8rem; font-weight:700; color:#0284C7;">
          İncelenen: 0 / 3
        </span>
      </div>

      <div class="svg-wrapper">
        <svg id="dogSvg" viewBox="0 0 720 540" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#0F172A" stop-opacity="0.28" />
              <stop offset="100%" stop-color="#0F172A" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stop-color="#9C7A63" />
              <stop offset="50%" stop-color="#8D6E53" />
              <stop offset="100%" stop-color="#5A3F30" />
            </linearGradient>
            <linearGradient id="headGrad" x1="20%" y1="0%" x2="90%" y2="90%">
              <stop offset="0%" stop-color="#B18E70" />
              <stop offset="50%" stop-color="#8D6E53" />
              <stop offset="100%" stop-color="#5A3F30" />
            </linearGradient>
            <radialGradient id="whaleEyeGrad" cx="40%" cy="40%" r="65%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="70%" stop-color="#E2E8F0" />
              <stop offset="100%" stop-color="#CBD5E1" />
            </radialGradient>
          </defs>

          <!-- Gölge -->
          <ellipse cx="380" cy="465" rx="230" ry="32" fill="url(#groundShadow)" />

          <!-- Modül 3 Kemik Alanı (Gizli başlar) -->
          <g id="boneGroup" style="display:none;" transform="translate(480, 420)">
            <circle cx="40" cy="25" r="75" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-dasharray="6 4" opacity="0.8" />
            <text x="40" y="-8" text-anchor="middle" font-size="12" font-weight="bold" fill="#334155">[Kaynak Koruma Alanı]</text>
            <rect x="28" y="20" width="44" height="12" rx="4" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2" />
            <circle cx="28" cy="20" r="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
            <circle cx="28" cy="32" r="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
            <circle cx="72" cy="20" r="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
            <circle cx="72" cy="32" r="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
          </g>

          <!-- KÖPEK GÖVDESİ -->
          <g id="dogBody">
            <!-- Kuyruk -->
            <path id="svgTail" d="M 190 320 C 170 360, 200 410, 240 405" fill="none" stroke="#5A3F30" stroke-width="18" stroke-linecap="round" />
            
            <!-- Arka Bacaklar -->
            <path d="M 230 280 C 180 300, 170 380, 195 435 C 198 443, 220 445, 230 442 C 245 438, 230 380, 250 350 Z" fill="#5A3F30" />
            <ellipse cx="205" cy="442" rx="18" ry="10" fill="#5A3F30" />

            <!-- Gövde ve Sırt -->
            <path d="M 210 320 C 200 280, 230 240, 280 235 C 340 230, 400 245, 450 260 C 490 285, 495 350, 460 380 C 410 400, 310 395, 250 375 C 220 360, 212 340, 210 320 Z" fill="url(#bodyGrad)" />

            <!-- Ön But & Göğüs -->
            <path d="M 260 270 C 220 285, 210 350, 225 390 C 235 420, 240 445, 265 448 C 285 450, 285 430, 275 400 C 290 355, 315 330, 305 290 Z" fill="url(#bodyGrad)" />
            <ellipse cx="255" cy="448" rx="20" ry="10" fill="#5A3F30" />

            <!-- Ön Sol Bacak -->
            <path d="M 380 340 C 375 380, 370 425, 385 446 C 395 452, 415 450, 418 440 C 420 410, 415 365, 430 340 Z" fill="#5A3F30" />
            <ellipse cx="395" cy="448" rx="19" ry="9" fill="#5A3F30" />

            <!-- Göğüs Beyazlığı -->
            <path d="M 430 265 C 475 285, 485 340, 455 375 C 420 370, 405 320, 415 280 Z" fill="url(#bodyGrad)" />
            <path d="M 450 295 C 470 315, 465 350, 440 360 C 430 350, 435 320, 442 300 Z" fill="#F1E9DF" />

            <!-- Ön Sağ Bacak -->
            <path d="M 435 325 C 430 370, 435 415, 445 448 C 455 455, 480 452, 482 442 C 480 410, 470 360, 465 320 Z" fill="url(#bodyGrad)" />
            <ellipse cx="460" cy="450" rx="22" ry="10" fill="#5A3F30" />

            <!-- Boyun -->
            <path d="M 420 250 C 440 220, 465 195, 500 190 C 515 210, 520 240, 505 270 C 475 285, 445 275, 420 250 Z" fill="url(#headGrad)" />

            <!-- BAŞ VE YÜZ -->
            <g id="dogHead">
              <!-- Kulak (Geriye Yatık Başlangıç) -->
              <path id="svgEar" d="M 495 175 C 460 170, 420 182, 405 200 C 425 215, 460 205, 490 195 Z" fill="#B18E70" stroke="#5A3F30" stroke-width="2" />

              <!-- Kafa Yuvarlağı -->
              <path d="M 480 170 C 520 150, 565 160, 580 185 C 600 215, 590 255, 555 275 C 520 290, 475 280, 460 250 C 455 220, 465 185, 480 170 Z" fill="url(#headGrad)" />
              <ellipse cx="510" cy="235" rx="36" ry="26" fill="#B18E70" opacity="0.35" />

              <!-- Namlu ve Burun -->
              <path d="M 550 200 C 585 200, 625 205, 640 220 C 648 230, 645 250, 625 260 C 595 272, 555 270, 535 255 Z" fill="url(#headGrad)" />
              <path d="M 625 215 C 638 215, 645 224, 644 232 C 640 240, 630 242, 620 236 C 615 230, 618 217, 625 215 Z" fill="#241D1D" />

              <!-- Göz (Whale Eye Başlangıç) -->
              <g id="svgEye" transform="translate(540, 195)">
                <ellipse cx="14" cy="10" rx="16" ry="12" fill="#241D1D" />
                <ellipse cx="14" cy="10" rx="14" ry="10" fill="url(#whaleEyeGrad)" />
                <ellipse cx="18" cy="10" rx="8" ry="8" fill="#58311B" />
                <circle cx="18" cy="10" r="5" fill="#0F172A" />
                <path d="M 3 10 C 3 4, 10 2, 16 3 C 10 5, 6 8, 5 13 Z" fill="#FFFFFF" opacity="0.9" />
                <circle cx="16" cy="8" r="1.5" fill="#FFFFFF" />
                <path d="M 0 0 C 10 -4, 24 -2, 30 5" fill="none" stroke="#38261C" stroke-width="3.5" stroke-linecap="round" />
              </g>

              <!-- Dudak Çizgisi ve Dil Yalama -->
              <path d="M 545 250 C 580 255, 615 254, 638 238" fill="none" stroke="#5A3F30" stroke-width="3.5" stroke-linecap="round" />
              <path id="svgTongue" d="M 610 248 C 622 230, 634 220, 642 225 C 648 232, 638 248, 618 252 Z" fill="#E11D48" stroke="#9F1239" stroke-width="1.5" />
            </g>
          </g>

          <!-- MODÜL 1: İNTERAKTİF HOTSPOTLAR -->
          <g id="hotspotsGroup">
            <!-- 1. KULAKLAR -->
            <g class="hotspot" onclick="inspectHotspot('ears')" transform="translate(470, 150)">
              <circle cx="0" cy="0" r="24" fill="#0284C7" fill-opacity="0.25" class="pulse-ring" />
              <circle id="btnEar" class="base-btn" cx="0" cy="0" r="16" fill="#0284C7" stroke="#FFFFFF" stroke-width="3" />
              <text x="0" y="5" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">1</text>
              <rect x="-42" y="-38" width="84" height="22" rx="4" fill="#0F172A" opacity="0.9" />
              <text x="0" y="-23" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="bold">1. KULAKLAR</text>
            </g>

            <!-- 2. GÖZLER -->
            <g class="hotspot" onclick="inspectHotspot('eyes')" transform="translate(565, 185)">
              <circle cx="0" cy="0" r="24" fill="#0284C7" fill-opacity="0.25" class="pulse-ring" />
              <circle id="btnEye" class="base-btn" cx="0" cy="0" r="16" fill="#0284C7" stroke="#FFFFFF" stroke-width="3" />
              <text x="0" y="5" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">2</text>
              <rect x="-40" y="-38" width="80" height="22" rx="4" fill="#0F172A" opacity="0.9" />
              <text x="0" y="-23" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="bold">2. GÖZLER</text>
            </g>

            <!-- 3. AĞIZ / BURUN -->
            <g class="hotspot" onclick="inspectHotspot('mouth')" transform="translate(620, 245)">
              <circle cx="0" cy="0" r="24" fill="#0284C7" fill-opacity="0.25" class="pulse-ring" />
              <circle id="btnMouth" class="base-btn" cx="0" cy="0" r="16" fill="#0284C7" stroke="#FFFFFF" stroke-width="3" />
              <text x="0" y="5" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="bold">3</text>
              <rect x="-48" y="24" width="96" height="22" rx="4" fill="#0F172A" opacity="0.9" />
              <text x="0" y="39" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="bold">3. AĞIZ/BURUN</text>
            </g>
          </g>
        </svg>
      </div>

      <div id="stageNote" style="font-size:0.85rem; color:#475569; background:#F8FAFC; padding:10px 14px; border-radius:8px; border-left:3px solid #0284C7;">
        💡 <strong>İpucu:</strong> Köpeğin kafasındaki 1, 2 ve 3 numaralı analiz noktalarına tıklayarak stres sinyallerini inceleyin.
      </div>
    </section>

    <!-- SAĞ: MODÜL ETKİLEŞİM PANELİ VE AI UZMAN KUTUSU -->
    <section class="interactive-panel">
      <!-- DİNAMİK MODÜL KARTI -->
      <div id="moduleCard" class="action-card">
        <h3 id="panelTitle" style="font-size:1.05rem; font-weight:800; color:#0F172A; margin-bottom:8px;">
          Adım 1: Sinyalleri İnceleyin
        </h3>
        <p id="panelDesc" style="font-size:0.88rem; color:#475569; line-height:1.4;">
          Sokakta karşılaştığınız köpek biraz gergin görünüyor. Beden dili sinyallerini okumak için köpeğin üzerindeki 3 interaktif noktaya dokunun.
        </p>

        <!-- Modül İçerik Alanı -->
        <div id="panelDynamicContent" style="margin-top:14px;">
          <!-- Dinamik olarak JS tarafından doldurulur -->
        </div>
      </div>

      <!-- AI VETERİNER DAVRANIŞ UZMANI PANELİ -->
      <div class="ai-vet-box">
        <div class="ai-vet-header">
          <span>🧠 AI VETERİNER DAVRANIŞ UZMANI</span>
          <span style="font-family:monospace; font-size:0.75rem;">LLM-Behavior-Core</span>
        </div>
        <div class="ai-vet-body">
          <div class="ai-status-line">
            <span>&gt;</span>
            <span id="aiStatusText">[AI Durum Analizi: Modül_1 // Gözlem_Bekleniyor]</span>
          </div>
          <p id="aiFeedbackText" class="ai-feedback-text">
            Sokak köpekleri iletişimlerinin %90'ını mikro beden dili ve sakinleştirici sinyallerle gerçekleştirir. İnceleme noktalarına tıklayarak başlayın.
          </p>
        </div>
      </div>
    </section>
  </main>

  <!-- SERTİFİKA VE BİTİŞ MODALI -->
  <div id="certificateModal" class="modal-overlay">
    <div class="certificate-container">
      <div style="font-size:3rem; margin-bottom:8px;">🏆</div>
      <p style="font-size:0.75rem; font-weight:800; color:#0369A1; letter-spacing:0.1em; text-transform:uppercase;">
        MİLLİ EĞİTİM & AKILLI TAHTA ETOLOJİ SERTİFİKASI
      </p>
      <h2 style="font-size:1.8rem; font-weight:800; color:#0F172A; margin:8px 0;">
        GÜVENLİ İLETİŞİM UZMANI SERTİFİKASI
      </h2>
      <p style="font-size:0.9rem; color:#475569;">
        PATİ-KOD Sokak Köpeği Beden Dili ve Kamu Güvenliği Simülatörü Başarı Belgesi
      </p>

      <div style="margin:20px 0; padding:12px; background:#F0F7FF; border-radius:8px;">
        <p style="font-size:0.75rem; color:#64748B;">BU BELGE BAŞARIYLA VERİLMİŞTİR:</p>
        <h3 id="certStudentName" style="font-size:1.5rem; font-weight:800; color:#0369A1; margin-top:4px;">
          Genç Güvenli İletişim Uzmanı
        </h3>
      </div>

      <div style="text-align:left; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:14px; font-size:0.85rem; margin-bottom:20px;">
        <strong>Öğrenilen 3 Temel Güvenlik Kuralı:</strong>
        <ul style="margin-left:20px; margin-top:6px; line-height:1.5;">
          <li><strong>1. Whale Eye ve Dudak Yalama:</strong> Yüksek stres ve mesafe isteme sinyalidir; yaklaşma.</li>
          <li><strong>2. Ağaç Olmak:</strong> Koşmak av güdüsünü tetikler. Kollarını göğsünde birleştir, hareketsiz kal ve yan dön.</li>
          <li><strong>3. Kavis ve Sakin Ses:</strong> Yiyecek koruyan köpeğe doğrudan değil, geniş bir C kavisi çizerek sakin sesle yaklaş.</li>
        </ul>
      </div>

      <div style="display:flex; justify-content:center; gap:12px;">
        <button class="btn-primary" onclick="restartSimulation()">
          🔄 Yeniden Başlat
        </button>
        <button class="btn-primary" style="background:#059669;" onclick="window.print()">
          🖨️ Yazdır / PDF Kaydet
        </button>
      </div>
    </div>
  </div>

  <!-- TAMAMEN ÇEVRİMDIŞI ÇALIŞAN VANILLA JAVASCRIPT & WEB AUDIO API -->
  <script>
    /* --- SENTETİK SES ÜRETİCİSİ (WEB AUDIO API) --- */
    let audioCtx = null;
    let isSoundMuted = false;

    function getAudioContext() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function toggleSound() {
      isSoundMuted = !isSoundMuted;
      document.getElementById('btnSoundToggle').textContent = isSoundMuted ? '🔇 Ses: Kapalı' : '🔊 Ses: Açık';
    }

    function playBeep(freq = 440, duration = 0.1, type = 'sine') {
      if (isSoundMuted) return;
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch(e) {}
    }

    function playSuccessSound() {
      if (isSoundMuted) return;
      try {
        const ctx = getAudioContext();
        [523.25, 659.25, 783.99].forEach((f, i) => {
          setTimeout(() => playBeep(f, 0.25, 'triangle'), i * 80);
        });
      } catch(e) {}
    }

    function playWarningSound() {
      if (isSoundMuted) return;
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch(e) {}
    }

    function playDogBark() {
      if (isSoundMuted) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.16);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } catch(e) {}
    }

    let activeAnalyser = null;
    function playCalmTone() {
      if (isSoundMuted) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        activeAnalyser = ctx.createAnalyser();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        osc.connect(gain);
        gain.connect(activeAnalyser);
        activeAnalyser.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.0);
      } catch(e) {}
    }

    function playPanicTone() {
      if (isSoundMuted) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        activeAnalyser = ctx.createAnalyser();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.linearRampToValueAtTime(2200, now + 0.4);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(activeAnalyser);
        activeAnalyser.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } catch(e) {}
    }

    /* --- SİMÜLASYON DURUM YÖNETİMİ --- */
    const state = {
      module: 1,
      score: 100,
      stress: 75,
      inspected: new Set(),
      hotspotData: {
        ears: {
          title: "1. Kulaklar (Geriye Yapışık)",
          desc: "Kulaklar kafanın arkasına doğru yapıştırılmış. Bu, köpeğin tehdit altında hissettiğini ve korku temelli savunmaya geçebileceğini gösterir.",
          ai: "[AI Durum Analizi: Pinned_Ears // Savunmacı_Gerilim]"
        },
        eyes: {
          title: "2. Gözler (Whale Eye / Balina Gözü)",
          desc: "Göz akının (skleranın) hilal şeklinde belirginleşmesi, köpeğin yoğun anksiyete içinde olduğunu ve gözlerini tehditten ayırmadığını gösterir.",
          ai: "[AI Durum Analizi: Whale_Eye_Confirmed // Fiksasyon: %88]"
        },
        mouth: {
          title: "3. Ağız / Burun (Dudak Yalama - Lip Licking)",
          desc: "Hızlıca burnunu veya dudaklarını yalamak açlık değildir; etolojide Turid Rugaas tarafından tanımlanan bir 'Sakinleştirici Sinyal'dir (Calming Signal).",
          ai: "[AI Durum Analizi: Lip_Lick_Signal // Yatıştırma_Çabası]"
        }
      }
    };

    function updateHud() {
      document.getElementById('hudModule').textContent = state.module + ' / 3';
      document.getElementById('hudScore').textContent = state.score + ' / 100';
      document.getElementById('stressNumber').textContent = '%' + state.stress;
      document.getElementById('stressBar').style.width = state.stress + '%';
    }

    /* --- MODÜL 1: İNCELEME & TEŞHİS --- */
    function inspectHotspot(type) {
      playBeep(600, 0.08);
      state.inspected.add(type);
      document.getElementById('inspectionCounter').textContent = 'İncelenen: ' + state.inspected.size + ' / 3';

      const data = state.hotspotData[type];
      const btnId = type === 'ears' ? 'btnEar' : type === 'eyes' ? 'btnEye' : 'btnMouth';
      document.getElementById(btnId).setAttribute('fill', '#059669');

      document.getElementById('aiStatusText').textContent = data.ai;
      document.getElementById('aiFeedbackText').textContent = data.title + ': ' + data.desc;

      // 3 nokta da incelendi mi?
      if (state.inspected.size >= 3) {
        showModule1Quiz();
      }
    }

    function showModule1Quiz() {
      document.getElementById('panelTitle').textContent = 'Teşhis Sorusu: Köpek Ne Anlatıyor?';
      document.getElementById('panelDesc').textContent = 'Üç stres belirtisini incelediniz. Bu beden dili kombinasyonu ne anlama gelir?';

      document.getElementById('panelDynamicContent').innerHTML = \`
        <button class="btn-action" onclick="answerModule1(false, this)">
          A) Oyun oynamak istiyor ve ilgi bekliyor.
        </button>
        <button class="btn-action" onclick="answerModule1(true, this)">
          B) Yüksek stres altında, korkmuş ve sınırlarına saygı duyulmasını istiyor.
        </button>
        <button class="btn-action" onclick="answerModule1(false, this)">
          C) Karnı çok acıkmış ve yemek arıyor.
        </button>
      \`;
    }

    function answerModule1(isCorrect, btn) {
      if (isCorrect) {
        playSuccessSound();
        btn.classList.add('correct');
        document.getElementById('aiStatusText').textContent = '[AI Durum Analizi: Teşhis_Doğrulandı // +20 Güvenlik Puanı]';
        document.getElementById('aiFeedbackText').textContent = 'Tebrikler! Whale Eye, yapışık kulak ve dudak yalama sinyalleri köpeğin rahatsız olduğunu ve güvenli mesafeye ihtiyaç duyduğunu kanıtlar. İkinci aşamaya geçebilirsiniz.';
        setTimeout(() => startModule2(), 1800);
      } else {
        playWarningSound();
        btn.classList.add('wrong');
        state.score = Math.max(0, state.score - 15);
        updateHud();
        document.getElementById('aiStatusText').textContent = '[AI Durum Analizi: Hatalı_Yorumlama // -15 Ceza Puanı]';
        document.getElementById('aiFeedbackText').textContent = 'Dikkat: Dudak yalama ve gergin gözler oyun daveti veya açlık değil; ciddi bir stres ve savunma habercisidir. Lütfen doğru seçeneği seçin.';
      }
    }

    /* --- MODÜL 2: FİZİKSEL DURUŞ VE EYLEM SEÇİMİ --- */
    function startModule2() {
      state.module = 2;
      state.stress = 85;
      updateHud();

      document.getElementById('moduleBadge').textContent = 'Modül 2: Eylem Seçimi';
      document.getElementById('stageTitle').textContent = 'Köpek Size Doğru Havlayarak Geliyor!';
      document.getElementById('inspectionCounter').textContent = 'Tehlike Anı';
      document.getElementById('hotspotsGroup').style.display = 'none';

      // Köpeğin ağzı havlama durumuna geçer
      document.getElementById('svgEye').innerHTML = \`
        <ellipse cx="14" cy="10" rx="16" ry="12" fill="#241D1D" />
        <ellipse cx="14" cy="10" rx="14" ry="10" fill="#EF4444" opacity="0.4" />
        <ellipse cx="18" cy="10" rx="8" ry="8" fill="#58311B" />
        <circle cx="18" cy="10" r="5" fill="#0F172A" />
      \`;

      playDogBark();
      playWarningSound();

      document.getElementById('panelTitle').textContent = 'Anlık Karar: Hangi Eylemi Yapacaksınız?';
      document.getElementById('panelDesc').textContent = 'Köpek hızla size doğru yaklaşırken hayatta kalmak ve çatışmayı önlemek için en doğru tepki nedir?';

      document.getElementById('panelDynamicContent').innerHTML = \`
        <button class="btn-action" onclick="handleAction('run', this)">
          🏃‍♂️ A) Çığlık atıp hızla ters yöne doğru koşmak
        </button>
        <button class="btn-action" onclick="handleAction('stare', this)">
          👀 B) Gözlerinin içine dik dik bakıp el kol sallayarak bağırmak
        </button>
        <button class="btn-action" onclick="handleAction('tree', this)">
          🌳 C) 'Ağaç Olmak': Olduğun yerde dur, kollarını göğsünde topla, yan dön ve göz temasını kes!
        </button>
      \`;

      document.getElementById('aiStatusText').textContent = '[AI Durum Analizi: Tehdit_Simülasyonu // Nabız Yüksek]';
      document.getElementById('aiFeedbackText').textContent = 'Uyarı: Ani hareketler köpeklerin yırtıcı avlanma içgüdülerini (Prey Drive) tetikleyebilir. Soğukkanlı davranın.';
    }

    function handleAction(choice, btn) {
      if (choice === 'tree') {
        playSuccessSound();
        btn.classList.add('correct');
        state.stress = 25;
        updateHud();

        // Köpeğin kulakları yumuşar
        document.getElementById('svgEar').setAttribute('d', 'M 495 170 C 480 140, 495 125, 515 120 C 530 135, 525 158, 515 175 Z');
        document.getElementById('svgTail').setAttribute('d', 'M 190 310 C 150 310, 120 280, 105 240');

        document.getElementById('aiStatusText').textContent = '[AI Durum Analizi: Ağaç_Duruşu_Başarılı // Av_Güdüsü_Söndü]';
        document.getElementById('aiFeedbackText').textContent = 'Mükemmel karar! Ağaç Duruşu (Tree Pose) köpeğe hiçbir tehdit veya av sinyali vermez. Köpek sizi koklar, sıkıcı bulur ve ilgisini kaybederek uzaklaşır. Stres %25e geriledi.';

        setTimeout(() => startModule3(), 2200);
      } else if (choice === 'run') {
        playDogBark();
        playWarningSound();
        btn.classList.add('wrong');
        state.score = Math.max(0, state.score - 25);
        updateHud();
        document.getElementById('aiStatusText').textContent = '[AI Durum Analizi: Av_Güdüsü_Tetiklendi // HATA]';
        document.getElementById('aiFeedbackText').textContent = 'Kritik Hata: İnsanlar hiçbir köpekle koşu yarışını kazanamaz! Çığlık atarak kaçmak köpeğin beynindeki kovalama/yakalama refleksini tetikler.';
      } else if (choice === 'stare') {
        playDogBark();
        playWarningSound();
        btn.classList.add('wrong');
        state.score = Math.max(0, state.score - 20);
        updateHud();
        document.getElementById('aiStatusText').textContent = '[AI Durum Analizi: Meydan_Okuma_Algılandı // HATA]';
        document.getElementById('aiFeedbackText').textContent = 'Hata: Köpeğin gözlerinin içine dik dik bakmak ve el sallamak hayvanlar dünyasında doğrudan bir savaş ilanıdır. Gözlerinizi yere veya yana kaçırmalısınız.';
      }
    }

    /* --- MODÜL 3: SESLİ İLETİŞİM VE ALAN YÖNETİMİ --- */
    function startModule3() {
      state.module = 3;
      state.stress = 70;
      updateHud();

      document.getElementById('moduleBadge').textContent = 'Modül 3: Alan & Ses Yönetimi';
      document.getElementById('stageTitle').textContent = 'Köpek Yiyeceğini Koruyor (Kaynak Koruma)';
      document.getElementById('inspectionCounter').textContent = 'Canlı Frekans';

      // Kemik grubunu görünür yap
      document.getElementById('boneGroup').style.display = 'block';

      document.getElementById('panelTitle').textContent = 'Geçiş Stratejinizi ve Ses Frekansını Test Edin';
      document.getElementById('panelDesc').textContent = 'Yerde yiyeceğini koruyan köpeğin yanından geçmeniz gerekiyor. Hangi tonlama ve rota güvenlidir?';

      document.getElementById('panelDynamicContent').innerHTML = \`
        <div style="display:flex; flex-direction:column; gap:10px;">
          <button class="btn-action" onclick="testAcoustics('panic', this)">
            📢 Yüksek / Panik Çığlık (Tiz 1800 Hz) + Düz Üstüne Yürüme
          </button>
          <button class="btn-action" onclick="testAcoustics('calm', this)">
            🎵 Sakin / Düşük Frekanslı Ses (180 Hz) + Geniş Kavis (C-Curve) Çizme
          </button>
        </div>
        <canvas id="visualizerCanvas" width="360" height="90"></canvas>
      \`;

      initCanvasLoop();

      document.getElementById('aiStatusText').textContent = '[AI Durum Analizi: Kaynak_Koruma_Modu // Akustik Analiz]';
      document.getElementById('aiFeedbackText').textContent = 'Köpeklerin işitme duyusu insanlardan 4 kat daha hassastır. Yüksek tiz sesler alarm yaratırken, düşük ve monoton sesler güvenlik hissi verir.';
    }

    function testAcoustics(mode, btn) {
      if (mode === 'panic') {
        playPanicTone();
        btn.classList.add('wrong');
        state.stress = 95;
        state.score = Math.max(0, state.score - 15);
        updateHud();

        document.getElementById('aiStatusText').textContent = '[AI Durum Analizi: Yüksek_Frekans // Reaktif_Saldırı]';
        document.getElementById('aiFeedbackText').textContent = 'Tehlike: Tiz çığlıklar köpeğin stresini zirveye çıkardı. Ayrıca kaynak koruyan köpeğe doğrudan düz çizgide yürümek gasbetme girişimi olarak algılandı.';
      } else {
        playCalmTone();
        btn.classList.add('correct');
        state.stress = 15;
        updateHud();

        // Köpek tamamen rahatlar
        document.getElementById('svgEar').setAttribute('d', 'M 495 170 C 480 140, 495 125, 515 120 C 530 135, 525 158, 515 175 Z');
        document.getElementById('svgTail').setAttribute('d', 'M 190 310 C 150 310, 120 280, 105 240');

        document.getElementById('aiStatusText').textContent = '[AI Durum Analizi: C_Kavisi_Kabul_Edildi // Stres: %15]';
        document.getElementById('aiFeedbackText').textContent = 'Kusursuz Hamle! Geniş bir C kavisi çizerek köpeğin mahrem alanına saygı duydunuz. Düşük frekanslı sakin ses, ortada bir tehdit olmadığını kanıtladı. Simülasyon başarıyla bitti!';

        setTimeout(() => showCertificate(), 2400);
      }
    }

    /* --- CANVAS SES SPEKTRUMU DÖNGÜSÜ --- */
    function initCanvasLoop() {
      const canvas = document.getElementById('visualizerCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      let idleT = 0;
      function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (activeAnalyser) {
          const bufferLength = activeAnalyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          activeAnalyser.getByteTimeDomainData(dataArray);

          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#38BDF8';
          ctx.beginPath();
          const sliceWidth = canvas.width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        } else {
          // Sakin sinüs bekleme dalgası
          idleT += 0.05;
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#475569';
          ctx.beginPath();
          for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + Math.sin(x * 0.04 + idleT) * 4;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        requestAnimationFrame(render);
      }
      render();
    }

    /* --- SERTİFİKA VE YENİDEN BAŞLATMA --- */
    function showCertificate() {
      playSuccessSound();
      document.getElementById('certificateModal').style.display = 'flex';
    }

    function restartSimulation() {
      location.reload();
    }

    // Başlangıç yüklemesi
    updateHud();
  </script>
</body>
</html>`;
};
