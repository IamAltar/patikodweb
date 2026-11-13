// ============================================================================
// PATİ-KOD: Özel Üretim Vektörel İkonlar, Oyun Rozetleri ve Etolojik Diyagramlar
// Sıfırdan tasarlanmış gömülü SVG varlık kütüphanesi (Kırık link riski %0)
// ============================================================================

window.PATIKOD_SVGS = {
  // 1. OYUNCU EYLEM ROZETLERİ & İKONLARI
  badges: {
    empathy: {
      id: "empathy",
      name: "Empati Gözlüğü",
      subtitle: "Beden Dili Dedektifi",
      color: "#f472b6",
      desc: "Dış görünüş ve ırk önyargısının ötesine geçerek köpeğin kulak, göz (Whale Eye), burun ve kuyruk sinyallerini bilimsel etolojiyle okudun.",
      svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="empGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ec4899"/>
            <stop offset="50%" stop-color="#8b5cf6"/>
            <stop offset="100%" stop-color="#38bdf8"/>
          </linearGradient>
          <radialGradient id="empGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f472b6" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#empGlow)"/>
        <polygon points="60,6 106,32 106,88 60,114 14,88 14,32" fill="#131629" stroke="url(#empGrad)" stroke-width="4"/>
        <polygon points="60,13 99,36 99,84 60,107 21,84 21,36" fill="#1e1b4b" stroke="#f472b6" stroke-width="1" stroke-opacity="0.4"/>
        <rect x="22" y="44" width="32" height="24" rx="10" fill="#311042" stroke="#f472b6" stroke-width="3.2"/>
        <rect x="66" y="44" width="32" height="24" rx="10" fill="#172554" stroke="#38bdf8" stroke-width="3.2"/>
        <path d="M54 54 C58 50, 62 50, 66 54" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>
        <path d="M22 52 L15 48 M98 52 L105 48" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M38 61 C38 61 30 55 30 50.5 C30 48 32 46.5 34.5 46.5 C36.2 46.5 37.5 47.5 38 48.8 C38.5 47.5 39.8 46.5 41.5 46.5 C44 46.5 46 48 46 50.5 C46 55 38 61 38 61 Z" fill="#fb7185"/>
        <circle cx="82" cy="58" r="4.2" fill="#38bdf8"/>
        <circle cx="76.5" cy="52" r="2.1" fill="#7dd3fc"/>
        <circle cx="80" cy="49.8" r="2.1" fill="#7dd3fc"/>
        <circle cx="84.2" cy="49.8" r="2.1" fill="#7dd3fc"/>
        <circle cx="87.5" cy="52" r="2.1" fill="#7dd3fc"/>
        <path d="M60 22 L62.5 28 L69 28.5 L64 32.5 L65.5 39 L60 35.5 L54.5 39 L56 32.5 L51 28.5 L57.5 28 Z" fill="#fde047"/>
        <path d="M34 84 Q60 94 86 84" stroke="url(#empGrad)" stroke-width="3" stroke-linecap="round"/>
        <text x="60" y="79" text-anchor="middle" fill="#f8fafc" font-size="8.5" font-weight="800" font-family="sans-serif" letter-spacing="0.8">EMPATİ GÖZLÜĞÜ</text>
      </svg>`
    },

    tree: {
      id: "tree",
      name: "Ağaç Olma Duruşu",
      subtitle: "Kriz Anı Sakinlik Ustası",
      color: "#34d399",
      desc: "Üzerine koşan heyecanlı veya gergin bir köpeğe karşı kaçmak yerine kök salıp kollarını kenetleyerek ve göz temasını yumuşatarak 'Ağaç Olma' tekniğini uyguladın.",
      svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="treeGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#10b981"/>
            <stop offset="60%" stop-color="#059669"/>
            <stop offset="100%" stop-color="#f59e0b"/>
          </linearGradient>
          <radialGradient id="treeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#064e3b" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#treeGlow)"/>
        <polygon points="60,6 106,32 106,88 60,114 14,88 14,32" fill="#0d1f1c" stroke="url(#treeGrad)" stroke-width="4"/>
        <circle cx="60" cy="40" r="22" fill="#065f46" fill-opacity="0.7" stroke="#34d399" stroke-width="1.8"/>
        <circle cx="44" cy="46" r="14" fill="#047857" fill-opacity="0.65"/>
        <circle cx="76" cy="46" r="14" fill="#047857" fill-opacity="0.65"/>
        <circle cx="60" cy="36" r="7.5" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
        <path d="M56.5 36.5 Q58 38 59.5 36.5 M61.5 36.5 Q63 38 64.5 36.5" stroke="#451a03" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M48 48 C48 45 72 45 72 48 L70 72 L50 72 Z" fill="#10b981" stroke="#a7f3d0" stroke-width="1.8"/>
        <path d="M48 53 L70 60 M72 53 L50 60" stroke="#fef3c7" stroke-width="4" stroke-linecap="round"/>
        <rect x="54" y="72" width="12" height="17" rx="3" fill="#b45309"/>
        <path d="M54 88 Q42 94 35 96 M60 89 L60 98 M66 88 Q78 94 85 96" stroke="#f59e0b" stroke-width="2.8" stroke-linecap="round"/>
        <text x="60" y="106" text-anchor="middle" fill="#ecfdf5" font-size="8" font-weight="800" font-family="sans-serif" letter-spacing="0.6">AĞAÇ OLMA DURUŞU</text>
      </svg>`
    },

    voice: {
      id: "voice",
      name: "Sakin Ses Dalgası",
      subtitle: "Akustik Uyum Uzmanı",
      color: "#38bdf8",
      desc: "Köpeklerin yüksek frekanslı çığlıkları ve sert tonları tehdit/panik olarak algıladığını bilerek, düşük-orta frekanslı yumuşak ses dalgasıyla güven verdin.",
      svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="voiceGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="50%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#2dd4bf"/>
          </linearGradient>
          <radialGradient id="voiceGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#voiceGlow)"/>
        <polygon points="60,6 106,32 106,88 60,114 14,88 14,32" fill="#0f172a" stroke="url(#voiceGrad)" stroke-width="4"/>
        <path d="M22 58 Q34 38, 46 58 T70 58 T98 58" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M22 58 Q34 74, 46 58 T70 58 T98 58" stroke="#2dd4bf" stroke-width="2.2" stroke-opacity="0.7" stroke-dasharray="3 3" stroke-linecap="round" fill="none"/>
        <circle cx="60" cy="58" r="13" fill="#1e293b" stroke="#7dd3fc" stroke-width="2.5"/>
        <path d="M60 65 C60 65 51 59 51 54.5 C51 52 53 50.5 55.2 50.5 C57 50.5 58.8 51.8 60 53.2 C61.2 51.8 63 50.5 64.8 50.5 C67 50.5 69 52 69 54.5 C69 59 60 65 60 65 Z" fill="#38bdf8"/>
        <line x1="42" y1="30" x2="42" y2="38" stroke="#7dd3fc" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="51" y1="26" x2="51" y2="38" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="60" y1="22" x2="60" y2="38" stroke="#2dd4bf" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="69" y1="26" x2="69" y2="38" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="78" y1="30" x2="78" y2="38" stroke="#7dd3fc" stroke-width="2.5" stroke-linecap="round"/>
        <text x="60" y="92" text-anchor="middle" fill="#e0f2fe" font-size="8" font-weight="800" font-family="sans-serif" letter-spacing="0.6">SAKİN SES DALGASI</text>
      </svg>`
    },

    arc: {
      id: "arc",
      name: "Kavis Çizerek Yürüme",
      subtitle: "Alan Saygısı & Rota Ustası",
      color: "#fbbf24",
      desc: "Kaynak koruyan veya tedirgin bir köpeğin üstüne doğrudan (dik açıyla) yürümek yerine, geniş bir yay/kavis çizerek kişisel alanına saygı gösterdin.",
      svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="50%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#10b981"/>
          </linearGradient>
          <radialGradient id="arcGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#1c1917" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#arcGlow)"/>
        <polygon points="60,6 106,32 106,88 60,114 14,88 14,32" fill="#1c1917" stroke="url(#arcGrad)" stroke-width="4"/>
        <circle cx="60" cy="68" r="15" fill="#7f1d1d" fill-opacity="0.45" stroke="#f87171" stroke-width="1.8" stroke-dasharray="3 2"/>
        <circle cx="60" cy="70" r="4" fill="#fca5a5"/>
        <circle cx="55" cy="64" r="2" fill="#fca5a5"/>
        <circle cx="60" cy="62.5" r="2" fill="#fca5a5"/>
        <circle cx="65" cy="64" r="2" fill="#fca5a5"/>
        <path d="M26 74 C28 30, 92 30, 94 74" stroke="#34d399" stroke-width="4" stroke-dasharray="6 4" stroke-linecap="round" fill="none"/>
        <polygon points="94,78 88,69 99,69" fill="#34d399"/>
        <circle cx="26" cy="74" r="4.5" fill="#fbbf24" stroke="#fef3c7" stroke-width="1.5"/>
        <text x="60" y="96" text-anchor="middle" fill="#fef3c7" font-size="7.6" font-weight="800" font-family="sans-serif" letter-spacing="0.5">KAVİSLİ GÜVENLİ ROTA</text>
      </svg>`
    }
  },

  // 2. AI VETERİNER & DAVRANIŞ KOÇU PORTRESİ (Dr. Pati)
  drPatiAvatar: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vetBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#0f766e"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="47" fill="url(#vetBg)" stroke="#38bdf8" stroke-width="3"/>
    <circle cx="50" cy="50" r="42" stroke="#2dd4bf" stroke-width="1.2" stroke-dasharray="5 4" stroke-opacity="0.7"/>
    <path d="M24 88 C26 68, 74 68, 76 88" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>
    <path d="M40 69 L50 84 L60 69" fill="#0d9488"/>
    <path d="M35 70 Q32 82 43 84" stroke="#94a3b8" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="44" cy="84" r="3.5" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.5"/>
    <circle cx="50" cy="44" r="18" fill="#fed7aa"/>
    <path d="M31 41 C31 24, 69 24, 69 41 C65 33, 35 33, 31 41 Z" fill="#334155"/>
    <rect x="35" y="38" width="13" height="9" rx="3" fill="#0ea5e9" fill-opacity="0.25" stroke="#38bdf8" stroke-width="2"/>
    <rect x="52" y="38" width="13" height="9" rx="3" fill="#0ea5e9" fill-opacity="0.25" stroke="#38bdf8" stroke-width="2"/>
    <line x1="48" y1="42" x2="52" y2="42" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="41.5" cy="42.5" r="2" fill="#0f172a"/>
    <circle cx="58.5" cy="42.5" r="2" fill="#0f172a"/>
    <path d="M44 52 Q50 57 56 52" stroke="#9a3412" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M68 44 Q73 50 61 55" stroke="#2dd4bf" stroke-width="2" stroke-linecap="round"/>
    <circle cx="60" cy="55" r="2.5" fill="#2dd4bf"/>
  </svg>`,

  // 3. ETOLOJİK SİNYAL MİNİ DİYAGRAMLARI (Oyun İçi & Köpek Beden Dili Sözlüğü İçin)
  signalDiagrams: {
    ears: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#f472b6" stroke-width="2"/>
      <path d="M25 46 C25 32 55 32 55 46" fill="#64748b"/>
      <path d="M28 36 L14 42 L24 46 Z" fill="#475569" stroke="#f472b6" stroke-width="2"/>
      <path d="M52 36 L66 42 L56 46 Z" fill="#475569" stroke="#f472b6" stroke-width="2"/>
      <path d="M26 26 Q18 28 15 35" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
      <path d="M54 26 Q62 28 65 35" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
      <text x="40" y="66" text-anchor="middle" fill="#fbcfe8" font-size="7.5" font-weight="700">GERİYE YATMIŞ KULAK</text>
    </svg>`,
    whaleEye: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2"/>
      <ellipse cx="40" cy="38" rx="20" ry="12" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="48" cy="38" r="10" fill="#b45309"/>
      <circle cx="50" cy="38" r="5" fill="#0f172a"/>
      <circle cx="46" cy="35" r="2" fill="#ffffff"/>
      <path d="M23 38 C25 31 32 29 37 30" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/>
      <text x="40" y="66" text-anchor="middle" fill="#bae6fd" font-size="7.5" font-weight="700">WHALE EYE (GÖZ AKI)</text>
    </svg>`,
    noseLick: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#34d399" stroke-width="2"/>
      <rect x="22" y="32" width="28" height="18" rx="8" fill="#94a3b8"/>
      <ellipse cx="44" cy="38" rx="6" ry="4.5" fill="#1e293b"/>
      <path d="M44 48 C56 48, 58 33, 47 32 C44 32, 43 36, 46 38" fill="#fb7185" stroke="#f43f5e" stroke-width="1.5"/>
      <text x="40" y="66" text-anchor="middle" fill="#a7f3d0" font-size="7.2" font-weight="700">BURUN YALAMA SİNYALİ</text>
    </svg>`,
    tuckedTail: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#fbbf24" stroke-width="2"/>
      <path d="M28 26 Q48 26 50 44 L46 56 L36 56 L36 44" fill="#64748b"/>
      <path d="M48 40 Q52 54 32 54" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" fill="none"/>
      <text x="40" y="68" text-anchor="middle" fill="#fde68a" font-size="7.5" font-weight="700">KISILMIŞ ALÇAK KUYRUK</text>
    </svg>`,
    prejudiceFilter: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#a855f7" stroke-width="2"/>
      <path d="M40 54 C40 54 24 44 24 34 C24 29 28 26 32.5 26 C36 26 38.5 28 40 30.5 C41.5 28 44 26 47.5 26 C52 26 56 29 56 34 C56 44 40 54 40 54 Z" fill="#ec4899"/>
      <line x1="22" y1="22" x2="58" y2="56" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="4 3"/>
      <text x="40" y="68" text-anchor="middle" fill="#e9d5ff" font-size="7.2" font-weight="700">ÖNYARGIYI KALDIR</text>
    </svg>`,
    playBow: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
      <!-- Play bow dog posture vector -->
      <path d="M16 52 L34 52 L42 38 L58 28 L58 52" stroke="#34d399" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="32" cy="42" r="6" fill="#6ee7b7"/>
      <path d="M58 28 Q66 18 62 14" stroke="#fbbf24" stroke-width="3.5" stroke-linecap="round"/>
      <text x="40" y="68" text-anchor="middle" fill="#a7f3d0" font-size="7.2" font-weight="700">OYUN SELAMİ (PLAY BOW)</text>
    </svg>`,
    tailPositions: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2"/>
      <!-- Neutral/Relaxed vs Stiff Vertical Tail -->
      <path d="M35 48 L35 20" stroke="#f43f5e" stroke-width="4" stroke-linecap="round"/>
      <path d="M35 48 Q52 46 62 36" stroke="#34d399" stroke-width="4" stroke-linecap="round"/>
      <circle cx="35" cy="48" r="5" fill="#94a3b8"/>
      <text x="40" y="68" text-anchor="middle" fill="#bae6fd" font-size="7.2" font-weight="700">DİK GERGİN vs RAHAT</text>
    </svg>`,
    piloerection: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#31102f" stroke="#f43f5e" stroke-width="2"/>
      <!-- Dog back line with raised hackles (spiky fur along spine) -->
      <path d="M18 48 Q40 42 62 48" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
      <path d="M22 44 L25 32 L29 43 L33 30 L37 42 L41 29 L45 42 L49 31 L53 43 L57 34 L60 45" stroke="#fb7185" stroke-width="2.2" stroke-linejoin="round"/>
      <text x="40" y="68" text-anchor="middle" fill="#fecdd3" font-size="7" font-weight="700">KABARMIŞ TÜY (HACKLES)</text>
    </svg>`
  }
};
