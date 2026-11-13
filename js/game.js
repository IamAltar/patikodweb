// ============================================================================
// PATİ-KOD: Görünmez Önyargı ve Güvenli İletişim
// Çift Perspektifli 4 Aşamalı İnteraktif Oyun Motoru & AI Etolog Koçu
// ============================================================================

(function () {
  // Oyun Durumu (State)
  const state = {
    playerName: "Empati Elçisi",
    currentChapter: 0, // 0: Hero/Giriş, 1: Dedektif, 2: Ağaç Olmak, 3: Ses & Kavis, 4: Empati Aynası
    calmness: 45,      // 0 - 100 Köpek Güven & Sakinlik Barı
    stress: 55,        // 0 - 100 Köpek Stres Barı (%100 olduğunda Oyun Biter)
    bpm: 110,          // Köpek Kalp Atışı (Nabız)
    empathyScore: 100,
    safetyScore: 100,
    isGameOver: false,
    badges: {
      empathy: false,
      tree: false,
      voice: false,
      arc: false
    },
    completedChapters: {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false
    },
    // Bölüm 1: Hotspot durumları
    inspectedHotspots: {},
    // Bölüm 2: QTE Ağaç Olmak durumları
    qteStep: 0,
    qteTimer: null,
    qteTimeLeft: 100,
    qteSlowMode: false,
    qteCompleted: false,
    // Bölüm 3: Ses Frekansı & Kavisli Yürüyüş
    voiceFreq: 540,    // Hedef: 180 - 260 Hz
    walkAngle: 15,     // Hedef: 50 - 75 derece kavis
    simAnimating: false,
    simProgress: 0,
    // Bölüm 4: Empati Aynası (First-Person)
    dogVisionActive: false,
    clearedPrejudices: {},
    puddleReflected: false,
    // Canvas Efektleri
    rainDrops: [],
    ripples: [],
    typewriterTimer: null
  };

  // Görsel Kaynak Çözücü (Önce gömülü Base64, yoksa yerel dosya)
  function getSceneImage(key) {
    if (window.PATIKOD_IMAGES && window.PATIKOD_IMAGES[key]) {
      return window.PATIKOD_IMAGES[key];
    }
    const map = {
      hero: "assets/images/hero_amstaff_rain.jpg",
      scene1: "assets/images/scene1_stress_whale_eye.jpg",
      scene2: "assets/images/scene2_play_bow.jpg",
      scene3: "assets/images/scene3_resource_guarding.jpg",
      scene4: "assets/images/scene4_first_person_empathy.jpg"
    };
    return map[key] || map.hero;
  }

  // Bölüm 1: Beden Dili Dedektifi Hotspot Verileri (Durum 1: Korku ve Stres)
  const CHAPTER1_HOTSPOTS = [
    {
      id: "ears",
      num: "1",
      label: "Geriye Yatmış Kulaklar",
      x: 54,
      y: 20,
      diagramKey: "ears",
      title: "Kulaklar Geriye Yatmış (Pinned Ears)",
      shortDesc: "Kulakların kafatasına doğru geriye yapışması saldırganlık değil, yoğun endişe, çekinme ve 'kendini küçültme' çabasıdır.",
      coachMsg: "Harika gözlem! Çoğu insan AmStaff/Pitbull gibi güçlü ırkların geriye yatmış kulaklarını 'saldırı hazırlığı' sanır. Oysa etolojide bu, köpeğin korktuğunu ve çatışmadan kaçınmak istediğini gösteren klasik bir yatıştırma sinyalidir.",
      scienceRef: "Turid Rugaas - Calming Signals (Sakinleştirici Sinyaller)",
      empathyDelta: 25,
      safetyDelta: 15,
      calmDelta: 8
    },
    {
      id: "whale_eye",
      num: "2",
      label: "Göz Akı (Whale Eye)",
      x: 62,
      y: 28,
      diagramKey: "whaleEye",
      title: "Whale Eye / Yarım Ay Göz Akı",
      shortDesc: "Köpek başını başka yöne çevirirken göz ucuyla sana bakıyor ve gözünün beyaz kısmı (sklera) yarım ay şeklinde görünüyor.",
      coachMsg: "Kritik bir sinyali yakaladın! 'Whale Eye' (Balina Gözü), köpeğin yüksek stres altında olduğunu ve 'Lütfen kişisel alanıma daha fazla yaklaşma' dediğini gösterir. Bu anda köpeği sevmek için el uzatmak en sık yapılan hatadır!",
      scienceRef: "Dr. Sophia Yin - Düşük Stresli Hayvan İletişimi",
      empathyDelta: 30,
      safetyDelta: 25,
      calmDelta: 8
    },
    {
      id: "nose_lick",
      num: "3",
      label: "Burun Yalama",
      x: 69,
      y: 38,
      diagramKey: "noseLick",
      title: "Burun Ucunu Yalama (Nose Lick)",
      shortDesc: "Aç olmadığı halde dilini hızlıca çıkarıp burnunun ucunu yalaması, hem kendini hem de karşısındakini sakinleştirme sinyalidir.",
      coachMsg: "Süper dedektiflik! Köpekler gerildiklerinde tıpkı insanların stres anında dudaklarını ıslatması gibi burunlarını yalarlar. Tarçın şu an sana 'Ben barışçılım, lütfen sen de sakin kal' mesajı gönderiyor.",
      scienceRef: "Klinik Kanid Etolojisi - Yatıştırıcı Jestler",
      empathyDelta: 25,
      safetyDelta: 20,
      calmDelta: 8
    },
    {
      id: "tucked_tail",
      num: "4",
      label: "Alçak & Kısılmış Kuyruk",
      x: 31,
      y: 78,
      diagramKey: "tuckedTail",
      title: "Kuyruk Aşağıda ve Karın Altına Yakın",
      shortDesc: "Kuyruğun yere paralel veya bacakların arasına doğru çekilmiş olması güvensizlik, üşüme ve korku belirtisidir.",
      coachMsg: "Çok doğru! Kuyruk köpeğin duygusal barometresidir. Kuyruğunu aşağı indirip vücudunu kambur tutan bir köpek kesinlikle kabadayılık yapmıyordur; tam aksine kendini korumaya çalışıyordur.",
      scienceRef: "Davranışsal Veterinerlik & Postür Analizi",
      empathyDelta: 20,
      safetyDelta: 20,
      calmDelta: 7
    },
    {
      id: "prejudice_collar",
      num: "5",
      label: "Görünmez Önyargı Etiketi",
      x: 51,
      y: 46,
      diagramKey: "prejudiceFilter",
      title: "Görünmez Önyargı: Irk Değil Beden Dili Konuşur",
      shortDesc: "Kaslı omuz yapısı ve geniş çene hattı insanlarda 'tehlikeli ırk' önyargısı tetikler; ancak Tarçın'ın kalbi korkuyla çarpıyor.",
      coachMsg: "Empati Gözlüğü'nün en önemli sırrını çözdün! Bir köpeğin ırkı (AmStaff, Pitbull, Melez) onun o anki niyetini söylemez; niyetini kulakları, gözleri, burnu ve duruşu söyler!",
      scienceRef: "Toplumsal Önyargı & Hayvan Refahı Çalışmaları",
      empathyDelta: 35,
      safetyDelta: 15,
      calmDelta: 9
    }
  ];

  // Bölüm 2: Kriz Anında "Ağaç Olmak" 3 Aşamalı QTE Soruları
  const CHAPTER2_QTE_STEPS = [
    {
      stepTitle: "Adım 1/3: Ayaklar ve Gövde Refleksi",
      situation: "Parkta heyecanlı/stresli bir köpek aniden sana doğru koşmaya başladı! İlk 3 saniyede bedeninle ne yaparsın?",
      options: [
        {
          text: "🌳 Olduğum yerde dururum, ayakları birleştirip AĞAÇ KÖKÜ gibi sabit kalırım.",
          correct: true,
          coach: "Mükemmel refleks! Koşmak köpeklerdeki 'Av ve Kovalama Güdüsünü' (Prey Drive) otomatik olarak tetikler. Olduğun yerde sabit durduğunda köpek için 'kovalanacak hareketli hedef' olmaktan çıkarsın!",
          science: "Etoloji Kuralı #1: Hareket Hızı = Uyarılma Seviyesi"
        },
        {
          text: "🏃 Arkamı dönüp çığlık atarak olanca gücümle koşarım!",
          correct: false,
          mistakeTitle: "Kriz Anında Çığlık Atarak Koşmak (Kaçış Hatası)",
          coach: "Bir köpekten çığlık atarak koşup kaçmak, köpekteki 'Av ve Kovalama İçgüdüsünü' (Prey Drive) anında tetikler! En uysal köpek bile hızla kaçan ve tiz ses çıkaran bir hedefi refleks olarak kovalar.",
          science: "Klinik Etoloji: Kaçış Refleksi Kovalama Güdüsünü Tetikler"
        },
        {
          text: "🦶 Üzerine doğru sertçe adım atıp ayağımla yeri döverim!",
          correct: false,
          mistakeTitle: "Gergin Köpeğin Üzerine Yürümek (Tehdit Hatası)",
          coach: "Korkmuş veya uyarılmış bir köpeğin üzerine doğru sert adım atmak, onu 'Kaç ya da Savaş' (Fight or Flight) tepkisinde köşeye sıkışmış hissettirir ve savunma amaçlı ısırmaya zorlar.",
          science: "Klinik Etoloji: Karşı Tehdit Savunma Agresyonunu Başlatır"
        }
      ]
    },
    {
      stepTitle: "Adım 2/3: Kollar ve Eller Pozisyonu",
      situation: "Köpek hemen yanına kadar geldi ve etrafını kokluyor. Ellerini ve kollarını nasıl tutmalısın?",
      options: [
        {
          text: "🙌 Kollarımı havaya kaldırıp ellerimi sallayarak uzaklaştırmaya çalışırım.",
          correct: false,
          mistakeTitle: "Kolları Havada Sallamak (Hareketli Hedef Hatası)",
          coach: "Havada hızla sallanan kollar ve parmaklar, uyarılmış bir köpek için ya yakalanması gereken bir 'oyuncak' ya da kendisine vurulacak bir 'tehdit' olarak algılanır ve stresi %100'e çıkarır.",
          science: "Doggone Safe Protokolü: Uç Nokta Hareketleri Hedef Oluşturur"
        },
        {
          text: "🤝 Kollarımı göğsümde/karnımda kenetlerim, ellerimi saklayıp DALLARINI TOPLAMIŞ bir ağaç olurum.",
          correct: true,
          coach: "Harikasın! Kolları göğüste birleştirmek hem parmaklarını korur hem de vücut profilini daraltarak köpeğe 'Sana zarar vermeyeceğim, sıkıcı ve sakin bir ağacım' mesajı verir.",
          science: "Etoloji Kuralı #2: Kapalı ve Sakin Beden Profili"
        },
        {
          text: "✋ Hemen elimi köpeğin başının üstüne uzatıp tepesinden okşamaya çalışırım.",
          correct: false,
          mistakeTitle: "Tanımadığın Gergin Köpeğin Başının Üstüne El Uzatmak",
          coach: "Tanımadığın ve henüz sakinleşmemiş bir köpeğin başının üstünden el uzatmak, köpek beden dilinde baskınlık ve tehdit (Looming) olarak algılanır; köpeğin stres barını kritik eşiğe taşır.",
          science: "Dr. Sophia Yin: Baş Üstü Temas Korku Tepkisini Tetikler"
        }
      ]
    },
    {
      stepTitle: "Adım 3/3: Bakış ve Baş Duruşu",
      situation: "Köpek yüzüne doğru bakıyor. Gözlerinle ve başınla hangi sinyali göndermelisin?",
      options: [
        {
          text: "👀 Köpeğin gözlerinin içine dik dik ve sertçe bakarım ki benden çekinsin.",
          correct: false,
          mistakeTitle: "Köpekle Doğrudan Dik Göz Teması Kurmak (Meydan Okuma)",
          coach: "Köpek iletişiminde gözlerin içine dik dik ve sabit bakmak (Direct Stare), açık bir 'Meydan Okuma ve Kavga Daveti'dir! Stres altındaki bir köpeğe dik bakmak iletişim kazasına yol açar.",
          science: "Turid Rugaas: Doğrudan Göz Teması = Meydan Okuma"
        },
        {
          text: "😌 Başımı hafifçe yana/aşağı çevirir, göz temasını yumuşatıp yere veya uzak bir noktaya bakarım.",
          correct: true,
          coach: "Muhteşem! Başını hafifçe yana çevirmek ve göz temasını kaçırmak, köpeklerin kendi aralarında kullandığı en güçlü 'Sakinleştirici Sinyal'dir (Look Away). Tarçın tamamen sakinleşti ve şimdi sana Oyun Selamı veriyor!",
          science: "Turid Rugaas - Baş Çevirme (Head Turn) Sinyali"
        }
      ]
    }
  ];

  // Bölüm 4: Empati Aynası Önyargı Balonları
  const CHAPTER4_PREJUDICES = [
    {
      id: "p1",
      x: 36,
      y: 27,
      prejudiceText: "😨 'Eyvah AmStaff! Çene kilidi varmış, kesin saldırır!'",
      truthText: "💚 Bilimsel Gerçek: Hiçbir köpek ırkında 'çene kilidi' diye anatomik bir mekanizma yoktur. Davranışı ırk değil, yetiştirilme ve iletişim belirler.",
      coachMsg: "İlk önyargı bulutunu dağıttın! Veteriner anatomisinde 'çene kilitlenmesi' tamamen şehir efsanesidir. AmStaff'lar doğru sosyalleşme ve sevgiyle son derece duygusal ve insan odaklı dostlardır."
    },
    {
      id: "p2",
      x: 68,
      y: 23,
      prejudiceText: "😠 'Bakışına bakın, ne kadar soğuk ve tehlikeli duruyor!'",
      truthText: "💚 Empati Gerçeği: Şu an benim gözümden bakıyorsun! Yağmurda üşüdüm, korkuyorum ve sadece güvenli bir dost arıyorum.",
      coachMsg: "İkinci önyargıyı da kırdın! İnsanlar korktuklarında köpeğin gözündeki yardım ve güven arayışını 'kötü bakış' olarak etiketler. Oysa Tarçın sadece anlaşılma ihtiyacı duyuyor."
    },
    {
      id: "p3",
      x: 84,
      y: 34,
      prejudiceText: "🏃 'Çocukları çekin, bağırıp taş atalım da kaçsın!'",
      truthText: "💚 Güvenli İletişim: Bağırmak ve taş atmak travma ve savunma korkusu yaratır. Ağaç olmak, sakin ses ve kavisli yürüyüş herkesi korur.",
      coachMsg: "Tüm önyargı bulutları dağıldı! Sokak hayvanlarına şiddet ve panikle yaklaşmak yerine bilimsel beden diliyle yaklaşmak hem çocukları korur hem de sokaktaki canların güvenini kazanır. Şimdi yerdeki Su Birikintisine (Empati Aynasına) tıkla!"
    }
  ];

  // AI Koç Hızlı Soru-Cevap Bankası
  const AI_FAQ = {
    whale: {
      text: "Whale Eye (Yarım Ay Göz), köpeğin başını hafifçe çevirirken gözünü hedeften ayırmaması sonucu göz akının (sklera) hilal şeklinde görünmesidir. 'Şu an çok gerginim, lütfen üstüme gelme' demektir.",
      ref: "Klinik Etoloji Sözlüğü - Whale Eye"
    },
    amstaff: {
      text: "AmStaff (American Staffordshire Terrier) ve Pitbull tipi köpekler kaslı yapıları yüzünden 'görünmez önyargı' kurbanıdır. Oysa bilimsel araştırmalar ırkın değil, insan davranışının ve beden dili okuryazarlığının güvenliği belirlediğini kanıtlar.",
      ref: "AVMA & Hayvan Refahı Raporları"
    },
    tree: {
      text: "'Ağaç Olmak' (Be a Tree), özellikle çocuklar için uluslararası köpek ısırığı önleme programlarının 1 numaralı kuralıdır: Dur, ayaklarını birleştir, kollarını göğsünde kenetle ve yere bak. Hareket bittiğinde köpek ilgisini kaybeder ve sakinleşir.",
      ref: "Doggone Safe - Uluslararası Güvenli İletişim Protokolü"
    }
  };

  // ============================================================================
  // TÜM ZAMANLAYICILARI TEMİZLEME & GAME OVER (OYUN BİTTİ) SİSTEMİ
  // ============================================================================

  function stopAllTimersAndLoops() {
    if (state.qteTimer) {
      clearInterval(state.qteTimer);
      state.qteTimer = null;
    }
    window.patiAudio.stopHeartbeatLoop();
    state.simAnimating = false;
  }

  function triggerGameOver(mistakeTitle, aiAnalysisText, scienceRule = "Klinik Etoloji & Güvenli İletişim İhlali") {
    // Döngüye girmesini önlemek için anında tüm aktif zamanlayıcıları durdur
    stopAllTimersAndLoops();
    state.isGameOver = true;

    // Köpek Stres Barını %100 (Kritik Seviye) yap, Güven Barını %0'a çek
    state.stress = 100;
    state.calmness = 0;
    state.bpm = 168;
    updateHUD();

    window.patiAudio.playError();
    speakCoach(aiAnalysisText, scienceRule);

    // Game Over Modalını Doldur ve Aç
    const modal = document.getElementById("gameOverModalBackdrop");
    const mistakeEl = document.getElementById("gameOverMistakeTitle");
    const analysisEl = document.getElementById("gameOverAiAnalysisText");
    const scienceEl = document.getElementById("gameOverScienceTag");
    const avatarEl = document.getElementById("gameOverAiAvatar");

    if (mistakeEl) mistakeEl.textContent = mistakeTitle;
    if (analysisEl) analysisEl.textContent = aiAnalysisText;
    if (scienceEl) scienceEl.textContent = `🧬 ${scienceRule}`;
    if (avatarEl && window.PATIKOD_SVGS) {
      avatarEl.innerHTML = window.PATIKOD_SVGS.drPatiAvatar;
    }

    if (modal) {
      modal.classList.add("open");
    }
  }

  function restartGameFromChapter1() {
    window.patiAudio.playClick();
    stopAllTimersAndLoops();

    // Tüm değişkenleri, barları ve rozetleri sıfırla
    state.isGameOver = false;
    state.calmness = 45;
    state.stress = 55;
    state.bpm = 110;
    state.empathyScore = 100;
    state.safetyScore = 100;
    state.badges = {
      empathy: false,
      tree: false,
      voice: false,
      arc: false
    };
    state.completedChapters = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false
    };
    state.inspectedHotspots = {};
    state.qteStep = 0;
    state.qteTimeLeft = 100;
    state.qteCompleted = false;
    state.voiceFreq = 540;
    state.walkAngle = 15;
    state.simAnimating = false;
    state.simProgress = 0;
    state.dogVisionActive = false;
    state.clearedPrejudices = {};
    state.puddleReflected = false;

    const modal = document.getElementById("gameOverModalBackdrop");
    if (modal) {
      modal.classList.remove("open");
    }

    updateHUD();
    // Doğrudan 1. Bölümden temiz şekilde başlat
    goToChapter(1);
  }

  // ============================================================================
  // HUD & DİYALOG GÜNCELLEME FONKSİYONLARI
  // ============================================================================

  function updateHUD() {
    if (!state.isGameOver) {
      state.calmness = Math.max(0, Math.min(100, state.calmness));
      state.stress = Math.max(0, Math.min(100, 100 - state.calmness));
      state.bpm = Math.round(152 - state.calmness * 0.82);
    }

    const calmFill = document.getElementById("hudCalmFill");
    const calmPct = document.getElementById("hudCalmPercent");
    const stressFill = document.getElementById("hudStressFill");
    const stressPct = document.getElementById("hudStressPercent");
    const calmStatus = document.getElementById("hudCalmStatus");
    const bpmText = document.getElementById("hudBpmValue");

    if (calmFill) calmFill.style.width = `${state.calmness}%`;
    if (calmPct) calmPct.textContent = `%${Math.round(state.calmness)}`;
    if (stressFill) stressFill.style.width = `${state.stress}%`;
    if (stressPct) stressPct.textContent = `%${Math.round(state.stress)}`;
    if (bpmText) bpmText.textContent = `${state.bpm} BPM`;

    if (calmStatus) {
      if (state.stress >= 100 || state.isGameOver) {
        calmStatus.textContent = "🚨 KRİTİK STRES (%100)";
        calmStatus.style.background = "rgba(244, 63, 94, 0.35)";
        calmStatus.style.color = "#fecdd3";
        calmStatus.style.borderColor = "#f43f5e";
      } else if (state.calmness < 35) {
        calmStatus.textContent = "Yüksek Stres / Korku";
        calmStatus.style.background = "rgba(244, 63, 94, 0.25)";
        calmStatus.style.color = "#fda4af";
        calmStatus.style.borderColor = "#f43f5e";
      } else if (state.calmness < 68) {
        calmStatus.textContent = "Tedirgin / Gözlemliyor";
        calmStatus.style.background = "rgba(245, 158, 11, 0.22)";
        calmStatus.style.color = "#fde68a";
        calmStatus.style.borderColor = "#f59e0b";
      } else if (state.calmness < 90) {
        calmStatus.textContent = "Sakinleşiyor / Dengeli";
        calmStatus.style.background = "rgba(56, 189, 248, 0.22)";
        calmStatus.style.color = "#bae6fd";
        calmStatus.style.borderColor = "#38bdf8";
      } else {
        calmStatus.textContent = "Tam Güven & Empati Bağı";
        calmStatus.style.background = "rgba(16, 185, 129, 0.25)";
        calmStatus.style.color = "#a7f3d0";
        calmStatus.style.borderColor = "#10b981";
      }
    }

    const empEl = document.getElementById("scoreEmpathy");
    const safEl = document.getElementById("scoreSafety");
    const totEl = document.getElementById("scoreTotal");
    if (empEl) empEl.textContent = state.empathyScore;
    if (safEl) safEl.textContent = state.safetyScore;
    if (totEl) totEl.textContent = state.empathyScore + state.safetyScore;

    // Rozet slotlarını güncelle
    Object.keys(state.badges).forEach((badgeKey) => {
      const slot = document.getElementById(`badgeSlot_${badgeKey}`);
      if (slot) {
        slot.classList.toggle("unlocked", !!state.badges[badgeKey]);
      }
    });

    // Stepper butonlarını güncelle
    document.querySelectorAll(".step-btn").forEach((btn) => {
      const ch = parseInt(btn.getAttribute("data-chapter"), 10);
      btn.classList.toggle("active", ch === state.currentChapter);
      btn.classList.toggle("completed", !!state.completedChapters[ch]);
    });
  }

  function addScore(empathyDelta, safetyDelta, calmDelta, event) {
    state.empathyScore = Math.max(0, state.empathyScore + empathyDelta);
    state.safetyScore = Math.max(0, state.safetyScore + safetyDelta);
    state.calmness = Math.max(0, Math.min(100, state.calmness + calmDelta));
    state.stress = Math.max(0, Math.min(100, 100 - state.calmness));
    updateHUD();

    // Yüzen skor efekti
    if (empathyDelta !== 0 || safetyDelta !== 0) {
      const pop = document.createElement("div");
      pop.className = "floating-score";
      const totalD = empathyDelta + safetyDelta;
      pop.textContent = totalD >= 0 ? `+${totalD} PATİ-KOD` : `${totalD} Stres`;
      pop.style.color = totalD >= 0 ? "#34d399" : "#fb7185";
      const x = event && event.clientX ? event.clientX : window.innerWidth / 2;
      const y = event && event.clientY ? event.clientY : window.innerHeight / 2;
      pop.style.left = `${x - 30}px`;
      pop.style.top = `${y - 20}px`;
      document.body.appendChild(pop);
      setTimeout(() => pop.remove(), 1100);
    }
  }

  function unlockBadge(badgeKey) {
    if (!state.badges[badgeKey]) {
      state.badges[badgeKey] = true;
      window.patiAudio.playFanfare();
      updateHUD();
    }
  }

  // AI Veteriner & Davranış Koçu Typewriter (Daktilo) Efekti
  function speakCoach(message, scienceReference = "Klinik Hayvan Davranışları (Etoloji) Analizi") {
    const textEl = document.getElementById("aiTypewriterText");
    const refEl = document.getElementById("aiScienceTag");
    if (!textEl) return;

    if (refEl) refEl.textContent = `🧬 ${scienceReference}`;

    if (state.typewriterTimer) {
      clearInterval(state.typewriterTimer);
      state.typewriterTimer = null;
    }

    textEl.innerHTML = "";
    let idx = 0;
    state.typewriterTimer = setInterval(() => {
      if (idx < message.length) {
        textEl.innerHTML =
          message.slice(0, idx + 1) + '<span class="ai-typewriter-cursor"></span>';
        if (idx % 3 === 0) {
          window.patiAudio.playTypewriterTick();
        }
        idx++;
      } else {
        clearInterval(state.typewriterTimer);
        state.typewriterTimer = null;
      }
    }, 18);
  }

  // ============================================================================
  // SAHNE VE BÖLÜM RENDER MOTORU (0, 1, 2, 3, 4)
  // ============================================================================

  function goToChapter(chapterNum) {
    window.patiAudio.playClick();
    stopAllTimersAndLoops();

    state.currentChapter = chapterNum;
    const imgEl = document.getElementById("sceneMainImg");
    const overlayEl = document.getElementById("sceneInteractiveLayer");
    const sidebarEl = document.getElementById("interactionSidebar");
    const topTagLeft = document.getElementById("sceneTagLeft");
    const topTagRight = document.getElementById("sceneTagRight");

    if (!imgEl || !overlayEl || !sidebarEl) return;

    imgEl.classList.remove("dog-vision-mode");
    overlayEl.innerHTML = "";

    if (chapterNum === 0) {
      renderHeroStage(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
    } else if (chapterNum === 1) {
      renderChapter1(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
    } else if (chapterNum === 2) {
      renderChapter2(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
    } else if (chapterNum === 3) {
      renderChapter3(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
    } else if (chapterNum === 4) {
      renderChapter4(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
    }

    updateHUD();
  }

  // ----------------------------------------------------------------------------
  // SAHNE 0: ANA KAPAK / HERO SAHNESİ (Yağmurlu Sokakta AmStaff "Tarçın")
  // ----------------------------------------------------------------------------
  function renderHeroStage(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight) {
    imgEl.src = getSceneImage("hero");
    topTagLeft.innerHTML = "🌧️ <strong>Ana Sahne:</strong> Yağmurlu Sokak & Görünmez Önyargı";
    topTagRight.innerHTML = "🐾 Karakter: <strong>Tarçın (AmStaff, 3 Yaşında)</strong>";

    overlayEl.innerHTML = `
      <div class="puddle-mirror-hotspot" id="heroPuddleBtn" style="top:77%; left:52%; width:230px; height:76px;">
        💧 Su Birikintisine & Tarçın'a Yaklaş
      </div>
    `;
    document.getElementById("heroPuddleBtn").addEventListener("click", (e) => {
      createCanvasRipple(0.52, 0.77);
      addScore(10, 10, 5, e);
      goToChapter(1);
    });

    sidebarEl.innerHTML = `
      <div>
        <span class="chapter-badge-header">✨ İnteraktif Hikaye Kitabı & Oyun</span>
        <h2 class="sidebar-title">Görünmez Önyargıyı Kırmaya Hazır Mısın?</h2>
        <p class="sidebar-desc">
          Yağmurlu bir akşamüstü... Sokaktan geçen herkes gri-beyaz bir <strong>AmStaff (American Staffordshire Terrier)</strong> olan <strong>Tarçın</strong>'ı görünce korkuyla kaldırım değiştiriyor. Oysa Tarçın su birikintisindeki yansımasına bakarak sadece onu anlayacak bir dost bekliyor.
        </p>

        <div class="simulator-control-group" style="margin-top:10px;">
          <label for="playerNameInput" style="font-size:0.78rem; font-weight:700; color:#bae6fd; display:block; margin-bottom:6px;">
            🎓 Dijital Sertifika İçin Adın / Unvanın:
          </label>
          <input
            id="playerNameInput"
            type="text"
            value="${state.playerName}"
            placeholder="Adınızı yazın..."
            style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid rgba(56,189,248,0.4); background:#090d16; color:#fff; font-weight:700;"
          />
        </div>

        <div class="signal-detail-card" style="margin-top:10px;">
          <div class="signal-detail-svg">${window.PATIKOD_SVGS.badges.empathy.svg}</div>
          <div>
            <div style="font-weight:800; font-size:0.86rem; color:#fde68a;">4 Aşamalı Çift Perspektifli Görev</div>
            <div style="font-size:0.76rem; color:#cbd5e1; margin-top:2px;">
              1️⃣ Beden Dili Dedektifi (Hotspot & Teşhis)<br/>
              2️⃣ Kriz Anında 'Ağaç Olmak' (QTE)<br/>
              3️⃣ Ses Frekansı & Kavisli Rota<br/>
              4️⃣ Empati Aynası (Köpeğin Gözünden)
            </div>
          </div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <button class="primary-action-btn" id="startStoryBtn">
          🔍 Bölüm 1: Beden Dili Dedektifine Başla →
        </button>
      </div>
    `;

    const nameInput = document.getElementById("playerNameInput");
    if (nameInput) {
      nameInput.addEventListener("input", (e) => {
        state.playerName = e.target.value.trim() || "Empati Elçisi";
      });
    }

    document.getElementById("startStoryBtn").addEventListener("click", () => {
      goToChapter(1);
    });

    speakCoach(
      "Merhaba! Ben Dr. Pati, AI Veteriner ve Hayvan Davranışları (Etoloji) Koçunum. Dikkatli ol: Yanlış bir fiziksel hamle köpeğin Stres Barını %100'e çıkararak 'İletişim Kazasına (Game Over)' yol açar! Hazırsan Bölüm 1'e başlayalım.",
      "Etolojiye Giriş & Görünmez Önyargı"
    );
  }

  // ----------------------------------------------------------------------------
  // BÖLÜM 1: BEDEN DİLİ DEDEKTİFİ (Parlayan Hotspotlar & Yaklaşım Kararı)
  // ----------------------------------------------------------------------------
  function renderChapter1(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight) {
    imgEl.src = getSceneImage("scene1");
    topTagLeft.innerHTML = "🔍 <strong>Bölüm 1:</strong> Beden Dili Dedektifi (Durum 1: Korku ve Stres)";
    const inspectedCount = Object.keys(state.inspectedHotspots).length;
    topTagRight.innerHTML = `🎯 Çözülen Sinyal: <strong>${inspectedCount} / ${CHAPTER1_HOTSPOTS.length}</strong>`;

    overlayEl.innerHTML = "";
    CHAPTER1_HOTSPOTS.forEach((hs) => {
      const pin = document.createElement("button");
      pin.className = "hotspot-pin" + (state.inspectedHotspots[hs.id] ? " inspected" : "");
      pin.style.left = `${hs.x}%`;
      pin.style.top = `${hs.y}%`;
      pin.innerHTML = `
        <span>${state.inspectedHotspots[hs.id] ? "✓" : hs.num}</span>
        <span class="hotspot-label-tag">${hs.label}</span>
      `;
      pin.addEventListener("click", (e) => {
        window.patiAudio.playHotspotScan();
        const firstTime = !state.inspectedHotspots[hs.id];
        state.inspectedHotspots[hs.id] = true;
        if (firstTime) {
          addScore(hs.empathyDelta, hs.safetyDelta, hs.calmDelta, e);
        }
        if (Object.keys(state.inspectedHotspots).length >= CHAPTER1_HOTSPOTS.length) {
          unlockBadge("empathy");
          state.completedChapters[1] = true;
        }
        renderChapter1(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
        showHotspotDetailInSidebar(hs, sidebarEl);
        speakCoach(hs.coachMsg, hs.scienceRef);
      });
      overlayEl.appendChild(pin);
    });

    showHotspotDetailInSidebar(CHAPTER1_HOTSPOTS[0], sidebarEl, true);
    if (inspectedCount === 0) {
      speakCoach(
        "Bölüm 1'e hoş geldin! Görseldeki Tarçın'ın üzerinde parlayan 5 numaralı noktaya (Hotspot) tıklayarak sinyalleri analiz et ve sağdaki 'Dedektif Kararı' sorusunda doğru yaklaşımı seç!",
        "Bölüm 1: Turid Rugaas Sakinleştirici Sinyaller Analizi"
      );
    }
  }

  function showHotspotDetailInSidebar(activeHs, sidebarEl, isInitial = false) {
    const inspectedCount = Object.keys(state.inspectedHotspots).length;
    const diagSvg = window.PATIKOD_SVGS.signalDiagrams[activeHs.diagramKey] || "";

    sidebarEl.innerHTML = `
      <div>
        <span class="chapter-badge-header">🔍 Bölüm 1/4 • Beden Dili Dedektifi</span>
        <h2 class="sidebar-title">Sinyalleri Çöz (${inspectedCount}/5) & Doğru Eylemi Seç</h2>

        <div class="signal-detail-card">
          <div class="signal-detail-svg">${diagSvg}</div>
          <div>
            <div style="font-size:0.7rem; color:#38bdf8; font-weight:800; text-transform:uppercase;">
              ${isInitial && inspectedCount === 0 ? "Görseldeki Noktalara Tıkla" : "İncelenen Sinyal Analizi"}
            </div>
            <div style="font-weight:800; font-size:0.9rem; color:#fff; margin:2px 0;">${activeHs.title}</div>
            <div style="font-size:0.77rem; color:#cbd5e1;">${activeHs.shortDesc}</div>
          </div>
        </div>

        <!-- Dedektif Karar Testi (Yanlış seçimde Stres %100 olur ve Game Over açılır) -->
        <div class="simulator-control-group">
          <div style="font-size:0.77rem; font-weight:800; color:#fde68a; margin-bottom:6px;">
            ⚖️ Dedektif Kararı: Kulakları geride, göz akı (Whale Eye) görünen ve burnunu yalayan bu köpeğe nasıl yaklaşmalısın?
          </div>
          <div class="choice-list">
            <button type="button" class="choice-btn" id="ch1CorrectBtn">
              ✅ Mesafemi korur, el uzatmadan yan durarak sakinleşmesi için alan tanırım.
            </button>
            <button type="button" class="choice-btn" id="ch1WrongPetBtn">
              ❌ Korkmasın diye hızlıca üstüne eğilip başının tepesinden okşarım.
            </button>
            <button type="button" class="choice-btn" id="ch1WrongStareBtn">
              ❌ Gözlerinin içine dik dik bakarak üstüne doğru yürürüm.
            </button>
          </div>
        </div>

        <!-- 3 Durum Hızlı Karşılaştırma Seçici -->
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-top:4px;">
          <button type="button" class="ai-chip-btn" id="previewState1Btn" style="border-color:#f43f5e;">1. Korku & Stres</button>
          <button type="button" class="ai-chip-btn" id="previewState2Btn" style="border-color:#10b981;">2. Oyun Selamı</button>
          <button type="button" class="ai-chip-btn" id="previewState3Btn" style="border-color:#f59e0b;">3. Kaynak Koruma</button>
        </div>
      </div>

      <div>
        <button type="button" class="primary-action-btn" id="toChapter2Btn">
          ⚡ Bölüm 2: Kriz Anında 'Ağaç Olmak' →
        </button>
      </div>
    `;

    // Doğru ve Yanlış Karar Bağlantıları
    document.getElementById("ch1CorrectBtn").addEventListener("click", (e) => {
      window.patiAudio.playSuccess();
      addScore(30, 30, 12, e);
      unlockBadge("empathy");
      state.completedChapters[1] = true;
      speakCoach(
        "Tebrikler! Korku ve stres sinyalleri (Whale Eye, geriye yatmış kulaklar, burun yalama) veren bir köpeğe alan tanımak en güvenli ve empatik yaklaşımdır. Şimdi Bölüm 2'ye geçebilirsin!",
        "Dr. Sophia Yin - Düşük Stresli Alan Saygısı"
      );
      setTimeout(() => goToChapter(2), 900);
    });

    document.getElementById("ch1WrongPetBtn").addEventListener("click", () => {
      triggerGameOver(
        "Stresli Köpeğin Üzerine Eğilip Başını Okşamak",
        "Kulaklarını geriye yatırmış, göz akı (Whale Eye) görünen ve burnunu yalayan bir köpek 'Çok korkuyorum, alanıma girme' demektedir. Bu anda üzerine eğilip başının üstüne el uzatmak köpeğin stresini %100'e çıkarır ve savunma ısırığını tetikler!",
        "Klinik Etoloji: Whale Eye & Kişisel Alan İhlali"
      );
    });

    document.getElementById("ch1WrongStareBtn").addEventListener("click", () => {
      triggerGameOver(
        "Korkmuş Köpekle Dik Göz Teması Kurup Üzerine Yürümek",
        "Sakinleştirici sinyal (burun yalama) göndererek barış isteyen gergin bir köpeğin gözlerinin içine dik dik bakıp üzerine yürümek, köpek dilinde açık bir saldırı tehdididir ve stres barını anında %100 kritik seviyeye ulaştırır!",
        "Turid Rugaas - Yatıştırıcı Sinyallerin İhlali"
      );
    });

    const imgEl = document.getElementById("sceneMainImg");
    const topTagLeft = document.getElementById("sceneTagLeft");

    document.getElementById("previewState1Btn").addEventListener("click", () => {
      window.patiAudio.playClick();
      imgEl.src = getSceneImage("scene1");
      topTagLeft.innerHTML = "🔍 <strong>Durum 1 (Korku ve Stres):</strong> Kulaklar geride, Whale Eye, Burun Yalama";
      speakCoach(
        "Durum 1 (Korku ve Stres): Kulaklar geriye yatmış, göz akı (Whale Eye) görünüyor ve burnunu yalıyor. Bu köpeğe el uzatılmaz; sakin kalınıp alan tanınır.",
        "Durum 1 Karşılaştırması: Korku ve Stres"
      );
    });

    document.getElementById("previewState2Btn").addEventListener("click", () => {
      window.patiAudio.playClick();
      imgEl.src = getSceneImage("scene2");
      topTagLeft.innerHTML = "🎾 <strong>Durum 2 (Heyecan ve Oyun):</strong> Ön ayaklar yerde (Play Bow), kuyruk yukarıda";
      speakCoach(
        "Durum 2 (Heyecan ve Oyun - Play Bow): Ön ayaklar yere eğilmiş, göğüs yere yakın, kuyruk ise yukarıda neşeyle sallanıyor! Köpek dünyasında bu duruş 'Gel oyun oynayalım, sana zarar vermem' demektir.",
        "Durum 2 Karşılaştırması: Play Bow (Oyun Selamı)"
      );
    });

    document.getElementById("previewState3Btn").addEventListener("click", () => {
      window.patiAudio.playClick();
      imgEl.src = getSceneImage("scene3");
      topTagLeft.innerHTML = "🥣 <strong>Durum 3 (Kaynak Koruma):</strong> Mama kabının başında kasılmış nöbet duruşu";
      speakCoach(
        "Durum 3 (Kaynak Koruma - Resource Guarding): Köpek yerdeki mama kabının ve kemiğin üzerinde dik ve kasılmış duruyor. Yemek yiyen bir köpeğin yanına doğrudan yürünmez; geniş bir kavis çizerek uzaklaşılır!",
        "Durum 3 Karşılaştırması: Kaynak Koruma (Resource Guarding)"
      );
    });

    document.getElementById("toChapter2Btn").addEventListener("click", () => {
      goToChapter(2);
    });
  }

  // ----------------------------------------------------------------------------
  // BÖLÜM 2: KRİZ ANINDA 'AĞAÇ OLMAK' (Zamanlayıcılı QTE & Fiziksel Duruş)
  // ----------------------------------------------------------------------------
  function renderChapter2(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight) {
    stopAllTimersAndLoops();
    const isFinished = state.qteCompleted;
    imgEl.src = isFinished ? getSceneImage("scene2") : getSceneImage("scene1");
    topTagLeft.innerHTML = isFinished
      ? "🌳 <strong>Bölüm 2 Tamamlandı:</strong> Tarçın Sakinleşti ve Oyun Selamı (Play Bow) Veriyor!"
      : "⚡ <strong>Bölüm 2 (QTE Kriz Anı):</strong> Üzerine Koşan Köpeğe Karşı 'Ağaç Olmak'";
    topTagRight.innerHTML = isFinished
      ? "🏆 <strong>Ağaç Olma Duruşu Rozeti Kazanıldı!</strong>"
      : `⏱️ Refleks Aşaması: <strong>${state.qteStep + 1} / ${CHAPTER2_QTE_STEPS.length}</strong>`;

    if (isFinished) {
      overlayEl.innerHTML = `
        <div class="qte-overlay-hud" style="border-color:#10b981;">
          <div style="font-size:0.86rem; font-weight:800; color:#a7f3d0;">
            ✅ Kriz Başarıyla Yönetildi! Sen 'Ağaç' olunca Tarçın tehdit olmadığını anladı ve Durum 2 (Oyun Selamı / Play Bow) duruşuna geçti!
          </div>
        </div>
      `;
      sidebarEl.innerHTML = `
        <div>
          <span class="chapter-badge-header">🌳 Bölüm 2/4 • Kriz Anında Ağaç Olmak</span>
          <h2 class="sidebar-title">Mükemmel 'Ağaç Olma' Duruşu!</h2>
          <p class="sidebar-desc">
            Üç kritik refleks adımını da hatasız uyguladın:
          </p>
          <div class="signal-detail-card">
            <div class="signal-detail-svg">${window.PATIKOD_SVGS.badges.tree.svg}</div>
            <div style="font-size:0.8rem; color:#e2e8f0;">
              <strong>1. Kök Sal:</strong> Koşma, olduğun yerde sabit dur.<br/>
              <strong>2. Dallarını Topla:</strong> Kollarını göğsünde kenetle.<br/>
              <strong>3. Bakışını Yumuşat:</strong> Gözlerinin içine dik bakma, yere/yana bak.
            </div>
          </div>
        </div>
        <button type="button" class="primary-action-btn" id="toChapter3Btn">
          🔊 Bölüm 3: Ses Frekansı & Alan Saygısı →
        </button>
      `;

      document.getElementById("toChapter3Btn").addEventListener("click", () => {
        goToChapter(3);
      });
      return;
    }

    // Aktif QTE Adımı
    const currentQte = CHAPTER2_QTE_STEPS[state.qteStep];
    state.qteTimeLeft = 100;
    window.patiAudio.startHeartbeatLoop(124);

    overlayEl.innerHTML = `
      <div class="qte-overlay-hud">
        <span style="font-size:0.8rem; font-weight:800; color:#fda4af; white-space:nowrap;">
          💓 KRİZ ZAMANLAYICISI:
        </span>
        <div class="qte-timer-bar-wrap">
          <div class="qte-timer-bar-fill" id="qteTimerFill" style="width:100%;"></div>
        </div>
        <button type="button" class="ai-chip-btn" id="toggleSlowQteBtn">
          ${state.qteSlowMode ? "🐢 Eğitim Hızı: Açık" : "⚡ Normal Hız"}
        </button>
      </div>
    `;

    document.getElementById("toggleSlowQteBtn").addEventListener("click", () => {
      state.qteSlowMode = !state.qteSlowMode;
      document.getElementById("toggleSlowQteBtn").textContent = state.qteSlowMode
        ? "🐢 Eğitim Hızı: Açık"
        : "⚡ Normal Hız";
    });

    // QTE Zamanlayıcısı: Süre bittiğinde sonsuz döngüye GİRMEZ, doğrudan Game Over ekranını açar!
    state.qteTimer = setInterval(() => {
      if (state.isGameOver) {
        stopAllTimersAndLoops();
        return;
      }
      const decay = state.qteSlowMode ? 0.45 : 0.95;
      state.qteTimeLeft = Math.max(0, state.qteTimeLeft - decay);
      const fill = document.getElementById("qteTimerFill");
      if (fill) fill.style.width = `${state.qteTimeLeft}%`;

      if (state.qteTimeLeft <= 0) {
        triggerGameOver(
          "Kriz Anında Kararsızlık ve Panik (Süre Doldu!)",
          "Üzerine doğru koşan heyecanlı veya gergin bir köpeğe karşı saniyeler içinde 'Ağaç Olma Duruşuna' (sabit durma, kolları kenetleme ve bakışı kaçırma) geçememek panik hareketlerine ve köpeğin stres barının %100'e ulaşmasına neden oldu.",
          "QTE Kriz Yönetimi: Zamanında Ağaç Olma Refleksi"
        );
      }
    }, 120);

    sidebarEl.innerHTML = `
      <div>
        <span class="chapter-badge-header">⚡ Bölüm 2/4 • Quick Time Event (QTE)</span>
        <h2 class="sidebar-title">${currentQte.stepTitle}</h2>
        <p class="sidebar-desc">${currentQte.situation}</p>

        <div class="choice-list" id="qteChoicesContainer"></div>
      </div>

      <div style="font-size:0.76rem; color:#fda4af; border-top:1px solid rgba(148,163,184,0.18); padding-top:8px;">
        ⚠️ <strong>Dikkat:</strong> Yanlış bir refleks seçimi veya sürenin dolması Köpek Stres Barını %100'e çıkarır ve oyunu sonlandırır!
      </div>
    `;

    const choicesBox = document.getElementById("qteChoicesContainer");
    currentQte.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn";
      btn.innerHTML = `<span>${opt.text}</span>`;
      btn.addEventListener("click", (e) => {
        if (opt.correct) {
          stopAllTimersAndLoops();
          btn.classList.add("correct");
          window.patiAudio.playSuccess();
          addScore(30, 35, 16, e);
          speakCoach(opt.coach, opt.science);

          setTimeout(() => {
            if (state.isGameOver) return;
            if (state.qteStep < CHAPTER2_QTE_STEPS.length - 1) {
              state.qteStep++;
              renderChapter2(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
            } else {
              state.qteCompleted = true;
              state.completedChapters[2] = true;
              unlockBadge("tree");
              renderChapter2(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
            }
          }, 750);
        } else {
          // YANLIŞ HAMLE: Döngüye girmez, doğrudan Stres %100 olur ve Game Over ekranı açılır!
          btn.classList.add("wrong");
          triggerGameOver(opt.mistakeTitle || "Yanlış Kriz Refleksi", opt.coach, opt.science);
        }
      });
      choicesBox.appendChild(btn);
    });

    if (state.qteStep === 0) {
      speakCoach(
        "Dikkat! Heyecanlı veya gergin bir köpek sana doğru koşuyor! Zamanlayıcı dolmadan doğru fiziksel duruşu seçerek 'Ağaç Olma' tekniğini uygula. Yanlış hamle Stres Barını %100'e ulaştırır!",
        "Bölüm 2: Kriz Anında Ağaç Olma Protokolü"
      );
    }
  }

  // ----------------------------------------------------------------------------
  // BÖLÜM 3: SES FREKANSI VE ALAN SAYGISI (Akustik & Kavisli Rota Simülatörü)
  // ----------------------------------------------------------------------------
  function renderChapter3(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight) {
    imgEl.src = getSceneImage("scene3");
    topTagLeft.innerHTML = "🔊 <strong>Bölüm 3:</strong> Ses Frekansı & Alan Saygısı (Durum 3: Kaynak Koruma)";
    const isVoiceGood = state.voiceFreq >= 170 && state.voiceFreq <= 270;
    const isArcGood = state.walkAngle >= 50 && state.walkAngle <= 80;
    topTagRight.innerHTML = `Ses: <strong>${state.voiceFreq} Hz</strong> | Rota Açısı: <strong>${state.walkAngle}° Kavis</strong>`;

    overlayEl.innerHTML = "";

    sidebarEl.innerHTML = `
      <div>
        <span class="chapter-badge-header">🔊 Bölüm 3/4 • Akustik & Alan Simülatörü</span>
        <h2 class="sidebar-title">Sakin Ses Dalgası & Kavisli Yürüyüş</h2>
        <p class="sidebar-desc">
          Tarçın yerde mama kabının başında (<strong>Durum 3: Kaynak Koruma</strong>). Geçişi başlatmadan önce <strong>Ses Frekansını (180–260 Hz)</strong> ve <strong>Yürüme Açısını (50°–75° Geniş Kavis)</strong> güvenli aralığa getir!
        </p>

        <!-- 1. Ses Frekansı Kaydırıcısı & Osiloskop -->
        <div class="simulator-control-group">
          <div class="sim-slider-header">
            <span>🎙️ Ses Frekansı (Ton Yüksekliği):</span>
            <span id="freqLabelVal" style="color:${isVoiceGood ? "#34d399" : "#fb7185"};">
              ${state.voiceFreq} Hz (${isVoiceGood ? "Sakin & Güven Verici ✓" : state.voiceFreq > 270 ? "Çok Tiz / Panik ⚠" : "Çok Boğuk / Sert ⚠"})
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="850"
            step="10"
            value="${state.voiceFreq}"
            class="sim-range-input"
            id="voiceFreqSlider"
          />
          <canvas id="oscilloscopeCanvas" class="oscilloscope-canvas" width="360" height="62"></canvas>
          <div style="display:flex; justify-content:space-between; margin-top:6px; gap:6px;">
            <button type="button" class="ai-chip-btn" id="micAutoCalmBtn" style="flex:1;">
              🎙️ Mikrofon Simülasyonu: Sakin Ses Tonu Ayarla (220 Hz)
            </button>
          </div>
        </div>

        <!-- 2. Yürüme Açısı (Kavis Çizerek Yürüme) Kaydırıcısı -->
        <div class="simulator-control-group">
          <div class="sim-slider-header">
            <span>🧭 Yürüme Açısı (Kavis / Yay Çizme):</span>
            <span id="arcLabelVal" style="color:${isArcGood ? "#34d399" : "#fbbf24"};">
              ${state.walkAngle}° (${isArcGood ? "Güvenli Geniş Kavis ✓" : "Mama Kabına Çok Yakın ⚠"})
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value="${state.walkAngle}"
            class="sim-range-input"
            id="walkAngleSlider"
          />
          <div style="font-size:0.73rem; color:#94a3b8; margin-top:4px;">
            Sol ekranda rotanın mama kabının <strong>Kırmızı Koruma Çemberinden</strong> uzaklaştığını doğrula! Yanlış ayarlarla geçiş yapmak Stres Barını %100'e çıkarır.
          </div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <button type="button" class="primary-action-btn" id="runSimBtn" style="background:linear-gradient(135deg,#0ea5e9,#10b981);">
          🚶‍♂️ Güvenli Geçiş Simülasyonunu Başlat
        </button>
        ${
          state.completedChapters[3]
            ? `<button type="button" class="primary-action-btn" id="toChapter4Btn">
                🪞 Bölüm 4: Empati Aynası (Final Twist) →
              </button>`
            : ""
        }
      </div>
    `;

    const freqSlider = document.getElementById("voiceFreqSlider");
    const angleSlider = document.getElementById("walkAngleSlider");

    freqSlider.addEventListener("input", (e) => {
      state.voiceFreq = parseInt(e.target.value, 10);
      window.patiAudio.playFrequencyPreview(state.voiceFreq);
      const good = state.voiceFreq >= 170 && state.voiceFreq <= 270;
      const lbl = document.getElementById("freqLabelVal");
      if (lbl) {
        lbl.style.color = good ? "#34d399" : "#fb7185";
        lbl.textContent = `${state.voiceFreq} Hz (${
          good ? "Sakin & Güven Verici ✓" : state.voiceFreq > 270 ? "Çok Tiz / Panik ⚠" : "Çok Boğuk / Sert ⚠"
        })`;
      }
      topTagRight.innerHTML = `Ses: <strong>${state.voiceFreq} Hz</strong> | Rota Açısı: <strong>${state.walkAngle}° Kavis</strong>`;
    });

    document.getElementById("micAutoCalmBtn").addEventListener("click", (e) => {
      state.voiceFreq = 220;
      freqSlider.value = 220;
      window.patiAudio.playFrequencyPreview(220);
      addScore(15, 15, 6, e);
      renderChapter3(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
      speakCoach(
        "Mikrofon simülasyonu 220 Hz yumuşak ve ritmik ses dalgasına ayarlandı! Şimdi Yürüme Açısını da 50°–75° (Geniş Kavis) aralığına getirerek geçişi başlatabilirsin.",
        "Biyo-Akustik & Kanid İşitme Hassasiyeti"
      );
    });

    angleSlider.addEventListener("input", (e) => {
      state.walkAngle = parseInt(e.target.value, 10);
      const good = state.walkAngle >= 50 && state.walkAngle <= 80;
      const lbl = document.getElementById("arcLabelVal");
      if (lbl) {
        lbl.style.color = good ? "#34d399" : "#fbbf24";
        lbl.textContent = `${state.walkAngle}° (${
          good ? "Güvenli Geniş Kavis ✓" : "Mama Kabına Çok Yakın ⚠"
        })`;
      }
      topTagRight.innerHTML = `Ses: <strong>${state.voiceFreq} Hz</strong> | Rota Açısı: <strong>${state.walkAngle}° Kavis</strong>`;
    });

    document.getElementById("runSimBtn").addEventListener("click", (e) => {
      const voiceOk = state.voiceFreq >= 170 && state.voiceFreq <= 270;
      const arcOk = state.walkAngle >= 50 && state.walkAngle <= 80;

      if (voiceOk && arcOk) {
        window.patiAudio.playSuccess();
        state.simAnimating = true;
        state.simProgress = 0;
        addScore(40, 45, 22, e);
        unlockBadge("voice");
        unlockBadge("arc");
        state.completedChapters[3] = true;
        speakCoach(
          "Kusursuz simülasyon! 220 Hz civarı sakin ses dalgası ve geniş kavisli yürüyüş rotasıyla Tarçın'ın mama kabı koruma alanına hiç girmeden güvenle geçtin. 'Sakin Ses Dalgası' ve 'Kavis Çizerek Yürüme' rozetlerini kazandın!",
          "Bölüm 3 Başarılı: Alan Saygısı & Kavis Çizme (Arc Walking)"
        );
        setTimeout(() => {
          if (!state.isGameOver) {
            renderChapter3(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
          }
        }, 1600);
      } else if (!voiceOk && !arcOk) {
        triggerGameOver(
          `Tiz/Stresli Ses (${state.voiceFreq} Hz) ve Mama Kabının Üzerine Doğrudan Yürüme (${state.walkAngle}°)`,
          `Yemek yiyen ve kaynak koruma (Resource Guarding) davranışı gösteren bir köpeğin mama kabı çemberine ${state.walkAngle}° gibi dar bir açıyla doğrudan yürümek ve aynı anda ${state.voiceFreq} Hz stresli ses frekansı çıkarmak köpeğin mamasını çalacağın algısı yaratır!`,
          "Etoloji İhlali: Kaynak Koruma Alanı & Akustik Stres"
        );
      } else if (!voiceOk) {
        triggerGameOver(
          `Yanlış Ses Frekansı ile Yaklaşma (${state.voiceFreq} Hz)`,
          `Kaynak koruyan gergin bir köpeğin yanından geçerken ${state.voiceFreq} Hz (${
            state.voiceFreq > 270 ? "yüksek/tiz panik tonu" : "sert/boğuk tehdit tonu"
          }) kullanmak köpeğin işitme sisteminde alarm tetikledi ve Stres Barını %100'e ulaştırdı! Güvenli aralık 180–260 Hz sakin ses dalgasıdır.`,
          "Biyo-Akustik İhlal: Yüksek Frekanslı Uyarılma"
        );
      } else {
        triggerGameOver(
          `Mama Kabı Koruma Çemberini İhlal Etme (${state.walkAngle}° Dar Açı)`,
          `Yerdeki mama kabını koruyan (Durum 3: Kaynak Koruma) bir köpeğin yanından kavis çizmeden (${state.walkAngle}° açıyla) doğrudan geçmeye çalıştın! Köpek bunu kaynağına yönelik bir tehdit olarak algıladı. En az 50°–75° geniş bir yay (kavis) çizerek yürümeliydin.`,
          "Turid Rugaas - Kavis Çizerek Yürüme (Arc Walking) İhlali"
        );
      }
    });

    const toCh4 = document.getElementById("toChapter4Btn");
    if (toCh4) {
      toCh4.addEventListener("click", () => goToChapter(4));
    }

    if (!state.completedChapters[3]) {
      speakCoach(
        "Bölüm 3'te Tarçın yerdeki mama kabını koruyor (Durum 3: Kaynak Koruma). Geçişi başlatmadan önce Ses Frekansını 180–260 Hz aralığına ve Yürüme Açısını 50°–75° geniş kavis aralığına ayarla!",
        "Bölüm 3: Kaynak Koruma (Resource Guarding) & Kavisli Rota"
      );
    }
  }

  // ----------------------------------------------------------------------------
  // BÖLÜM 4: EMPATİ AYNASI (Final Twist - Birinci Şahıs Köpek Gözü & Sertifika)
  // ----------------------------------------------------------------------------
  function renderChapter4(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight) {
    imgEl.src = getSceneImage("scene4");
    imgEl.classList.toggle("dog-vision-mode", state.dogVisionActive);

    const clearedCount = Object.keys(state.clearedPrejudices).length;
    topTagLeft.innerHTML = "🐾 <strong>Bölüm 4 (Final Twist):</strong> Birinci Şahıs Köpek Gözü (Tarçın'ın Perspektifi)";
    topTagRight.innerHTML = `💭 Dönüştürülen Önyargı: <strong>${clearedCount} / ${CHAPTER4_PREJUDICES.length}</strong>`;

    overlayEl.innerHTML = "";

    // Önyargı balonlarını sahne üzerine yerleştir
    CHAPTER4_PREJUDICES.forEach((item) => {
      const isCleared = !!state.clearedPrejudices[item.id];
      const bubble = document.createElement("button");
      bubble.type = "button";
      bubble.className = "prejudice-bubble" + (isCleared ? " transformed" : "");
      bubble.style.left = `${item.x}%`;
      bubble.style.top = `${item.y}%`;
      bubble.innerHTML = isCleared ? item.truthText : item.prejudiceText;

      bubble.addEventListener("click", (e) => {
        window.patiAudio.playHotspotScan();
        if (!state.clearedPrejudices[item.id]) {
          state.clearedPrejudices[item.id] = true;
          addScore(35, 25, 10, e);
        }
        speakCoach(item.coachMsg, "Empati Aynası: Birinci Şahıs Perspektif Deneyimi");
        renderChapter4(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
      });

      overlayEl.appendChild(bubble);
    });

    // Su birikintisi yansıma noktası (Empati Aynası)
    const puddleBtn = document.createElement("div");
    puddleBtn.className = "puddle-mirror-hotspot";
    puddleBtn.innerHTML =
      clearedCount >= CHAPTER4_PREJUDICES.length
        ? "✨ Su Birikintisindeki Yansımaya Bak ve Mezun Ol!"
        : "💧 Su Birikintisi Yansıması (Önce 3 Önyargı Bulutuna Tıkla)";
    puddleBtn.addEventListener("click", (e) => {
      createCanvasRipple(0.5, 0.63);
      if (clearedCount < CHAPTER4_PREJUDICES.length) {
        window.patiAudio.playClick();
        speakCoach(
          "Su birikintisindeki gerçek yansımayı berraklaştırmak için önce sokaktaki insanların üzerinde duran 3 kırmızı 'Önyargı Balonuna' tıklayarak onları empati gerçeğine dönüştür!",
          "Empati Aynası Görevi"
        );
        return;
      }
      state.puddleReflected = true;
      state.calmness = 100;
      state.stress = 0;
      state.completedChapters[4] = true;
      unlockBadge("empathy");
      unlockBadge("tree");
      unlockBadge("voice");
      unlockBadge("arc");
      addScore(50, 50, 30, e);
      speakCoach(
        "Tebrikler! Su birikintisinde bir 'canavar' değil, anlaşılmayı bekleyen sadık bir can dostu ve ona güvenli iletişimle yaklaşan bilge bir insan yansıdı! Dijital Sertifikan hazır!",
        "PATİ-KOD Mezuniyeti: Görünmez Önyargı Kırıldı"
      );
      openCertificateModal();
    });
    overlayEl.appendChild(puddleBtn);

    sidebarEl.innerHTML = `
      <div>
        <span class="chapter-badge-header">🪞 Bölüm 4/4 • Final Twist: Empati Aynası</span>
        <h2 class="sidebar-title">Şimdi Sen Tarçın'sın: Onun Gözünden Bak!</h2>
        <p class="sidebar-desc">
          Kamera döndü! Ekranın altındaki patiler <strong>senin patilerin</strong>. İnsanların sana sadece dış görünüşün (AmStaff olman) yüzünden nasıl korkuyla baktığını deneyimle.
        </p>

        <div class="simulator-control-group">
          <div style="font-size:0.78rem; font-weight:800; color:#7dd3fc; margin-bottom:6px;">
            👁️ Biyolojik Görüş Simülasyonu:
          </div>
          <button type="button" class="ai-chip-btn" id="toggleDogVisionBtn" style="width:100%; padding:9px; font-weight:800;">
            ${
              state.dogVisionActive
                ? "🌈 İnsan Görüşüne Dön (Tam Renk Spektrumu)"
                : "🐕 Köpek Gözü Spektrumunu Aç (Dikromatik Mavi-Sarı Görüş)"
            }
          </button>
        </div>

        <div class="signal-detail-card">
          <div class="signal-detail-svg">${window.PATIKOD_SVGS.badges.empathy.svg}</div>
          <div style="font-size:0.8rem; color:#e2e8f0;">
            <strong>Görev 1:</strong> Sokaktaki insanların üzerindeki <strong>3 kırmızı önyargı balonuna</strong> tıklayarak gerçeği açığa çıkar (${clearedCount}/3).<br/>
            <strong>Görev 2:</strong> Yerdeki <strong>Su Birikintisine</strong> tıklayarak yansımanı gör ve <strong>Dijital Sertifikanı</strong> al!
          </div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <button type="button" class="primary-action-btn" id="openCertBtnDirect">
          🎓 Dijital Mezuniyet Sertifikasını Görüntüle & İndir
        </button>
      </div>
    `;

    document.getElementById("toggleDogVisionBtn").addEventListener("click", () => {
      window.patiAudio.playClick();
      state.dogVisionActive = !state.dogVisionActive;
      renderChapter4(imgEl, overlayEl, sidebarEl, topTagLeft, topTagRight);
      speakCoach(
        state.dogVisionActive
          ? "Köpek Görüşü (Dikromatik Spektrum) aktif! Köpekler kırmızı ve yeşili ayırt edemez; dünyayı mavi, sarı ve gri tonlarında görürler ama hareket ve beden dili algıları insanlardan çok daha keskindir!"
          : "İnsan renk spektrumuna geri döndün.",
        "Kanid Oftalmoloji: Dikromatik Renk Algısı"
      );
    });

    document.getElementById("openCertBtnDirect").addEventListener("click", () => {
      state.calmness = 100;
      state.stress = 0;
      unlockBadge("empathy");
      unlockBadge("tree");
      unlockBadge("voice");
      unlockBadge("arc");
      updateHUD();
      openCertificateModal();
    });

    if (clearedCount === 0) {
      speakCoach(
        "Bölüm 4: Empati Aynası! Şu an dünyaya Tarçın'ın birinci şahıs (First-Person) gözünden bakıyorsun. İnsanların üzerindeki 3 önyargı balonuna tıkla, ardından su birikintisindeki yansımana dokunarak mezun ol!",
        "Bölüm 4: Empati Aynası & Perspektif Alma"
      );
    }
  }

  // ============================================================================
  // CANLI CANVAS GÖRSEL EFEKT MOTORU (Yağmur, Su Halkaları, Bölüm 3 Rota & Osiloskop)
  // ============================================================================

  function initVisualCanvasLoop() {
    const fxCanvas = document.getElementById("sceneFxCanvas");
    if (!fxCanvas) return;
    const ctx = fxCanvas.getContext("2d");

    for (let i = 0; i < 70; i++) {
      state.rainDrops.push({
        x: Math.random(),
        y: Math.random(),
        len: 12 + Math.random() * 16,
        speed: 0.012 + Math.random() * 0.015,
        alpha: 0.18 + Math.random() * 0.35
      });
    }

    function renderFrame() {
      const rect = fxCanvas.parentElement.getBoundingClientRect();
      if (fxCanvas.width !== Math.floor(rect.width) || fxCanvas.height !== Math.floor(rect.height)) {
        fxCanvas.width = Math.floor(rect.width);
        fxCanvas.height = Math.floor(rect.height);
      }

      const w = fxCanvas.width;
      const h = fxCanvas.height;
      ctx.clearRect(0, 0, w, h);

      if (state.currentChapter === 0 || state.currentChapter === 3 || state.currentChapter === 4) {
        ctx.strokeStyle = "rgba(186, 230, 253, 0.42)";
        ctx.lineWidth = 1.3;
        state.rainDrops.forEach((d) => {
          const px = d.x * w;
          const py = d.y * h;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - 3, py + d.len);
          ctx.stroke();

          d.y += d.speed;
          if (d.y > 1) {
            d.y = -0.05;
            d.x = Math.random();
            if (Math.random() < 0.08) {
              createCanvasRipple(0.25 + Math.random() * 0.5, 0.65 + Math.random() * 0.25, 18);
            }
          }
        });
      }

      for (let i = state.ripples.length - 1; i >= 0; i--) {
        const rp = state.ripples[i];
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(rp.x * w, rp.y * h, rp.r, rp.r * 0.38, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(253, 224, 71, ${rp.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        rp.r += 1.2;
        rp.alpha -= 0.016;
        if (rp.alpha <= 0) {
          state.ripples.splice(i, 1);
        }
      }

      if (state.currentChapter === 3) {
        drawChapter3Overlay(ctx, w, h);
        drawChapter3Oscilloscope();
      }

      requestAnimationFrame(renderFrame);
    }

    requestAnimationFrame(renderFrame);
  }

  function createCanvasRipple(normX, normY, maxR = 45) {
    state.ripples.push({
      x: normX,
      y: normY,
      r: 4,
      maxR: maxR,
      alpha: 0.85
    });
  }

  function drawChapter3Overlay(ctx, w, h) {
    const bowlX = w * 0.47;
    const bowlY = h * 0.78;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(bowlX, bowlY, w * 0.16, h * 0.09, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(244, 63, 94, 0.22)";
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = "#f43f5e";
    ctx.stroke();

    ctx.fillStyle = "#fecdd3";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚠️ Mama Kabı Koruma Alanı", bowlX, bowlY + h * 0.12);

    const startX = w * 0.1;
    const startY = h * 0.84;
    const endX = w * 0.9;
    const endY = h * 0.82;
    const arcLift = (state.walkAngle / 80) * (h * 0.58);
    const ctrlX = w * 0.5;
    const ctrlY = h * 0.82 - arcLift;

    const isSafeArc = state.walkAngle >= 50 && state.walkAngle <= 80;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = isSafeArc ? "#34d399" : "#fbbf24";
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(startX, startY, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#38bdf8";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(endX, endY, 7, 0, Math.PI * 2);
    ctx.fillStyle = isSafeArc ? "#10b981" : "#f59e0b";
    ctx.fill();

    if (state.simAnimating) {
      state.simProgress += 0.012;
      if (state.simProgress > 1) {
        state.simAnimating = false;
        state.simProgress = 1;
      }
      const t = state.simProgress;
      const px = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * endX;
      const py = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * endY;

      ctx.beginPath();
      ctx.arc(px, py, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    }

    ctx.restore();
  }

  let oscPhase = 0;
  function drawChapter3Oscilloscope() {
    const osc = document.getElementById("oscilloscopeCanvas");
    if (!osc) return;
    const octx = osc.getContext("2d");
    const w = osc.width;
    const h = osc.height;

    octx.clearRect(0, 0, w, h);
    const isCalm = state.voiceFreq >= 170 && state.voiceFreq <= 270;

    octx.beginPath();
    octx.lineWidth = 2.5;
    octx.strokeStyle = isCalm ? "#34d399" : "#f43f5e";

    const cycles = (state.voiceFreq / 120) * 1.4;
    const amp = isCalm ? h * 0.26 : h * 0.38;

    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin((x / w) * Math.PI * 2 * cycles + oscPhase) * amp;
      if (x === 0) octx.moveTo(x, y);
      else octx.lineTo(x, y);
    }
    octx.stroke();
    oscPhase += 0.14;
  }

  // ============================================================================
  // DİJİTAL SERTİFİKA ÜRETİCİSİ (HTML5 CANVAS & İNDİRİLEBİLİR PNG)
  // ============================================================================

  function openCertificateModal() {
    const modal = document.getElementById("certificateModalBackdrop");
    if (!modal) return;
    modal.classList.add("open");
    window.patiAudio.playFanfare();
    renderCertificateCanvas();
  }

  function renderCertificateCanvas() {
    const canvas = document.getElementById("certificateCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#090d16");
    grad.addColorStop(0.5, "#1e1b4b");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, w - 36, h - 36);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, w - 56, h - 56);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("YAPAY ZEKA VE TASARIM DERSİ • TOPLUMSAL FAYDA PROJESİ", w / 2, 68);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText("PATİ-KOD: GÜVENLİ İLETİŞİM & EMPATİ SERTİFİKASI", w / 2, 108);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText("Bu dijital sertifika, görünmez ırk önyargısını kırarak bilimsel etoloji eğitimini tamamlayan", w / 2, 148);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText(state.playerName.toUpperCase(), w / 2, 195);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "16px sans-serif";
    ctx.fillText(
      "adlı katılımcıya 'Beden Dili Dedektifi', 'Ağaç Olma Duruşu', 'Sakin Ses' ve 'Kavisli Rota' yetkinliğiyle verilmiştir.",
      w / 2,
      232
    );

    const stats = [
      { label: "EMPATİ SKORU", val: `${state.empathyScore}`, color: "#f472b6" },
      { label: "GÜVENLİK SKORU", val: `${state.safetyScore}`, color: "#38bdf8" },
      { label: "KÖPEK GÜVEN BARI", val: `%${Math.round(state.calmness)}`, color: "#34d399" },
      { label: "KAZANILAN ROZET", val: "4 / 4 TAM", color: "#fbbf24" }
    ];

    stats.forEach((st, i) => {
      const bx = 65 + i * 195;
      const by = 265;
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = st.color;
      ctx.lineWidth = 2;
      ctx.fillRect(bx, by, 175, 82);
      ctx.strokeRect(bx, by, 175, 82);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(st.label, bx + 87.5, by + 28);

      ctx.fillStyle = st.color;
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(st.val, bx + 87.5, by + 62);
    });

    ctx.fillStyle = "#fde68a";
    ctx.font = "italic 16px sans-serif";
    ctx.fillText(
      '"Korku önyargıdan, güvenlik ise doğru iletişim ve empatiden doğar." — Dr. Pati & Tarçın',
      w / 2,
      395
    );

    const dateStr = new Date().toLocaleDateString("tr-TR");
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`Tarih: ${dateStr}  |  Doğrulama Kodu: PATIKOD-${state.empathyScore + state.safetyScore}-AI`, w / 2, 430);
  }

  function toggleFullscreenMode() {
    window.patiAudio.playClick();
    const gameShell = document.getElementById("patiGameShell") || document.documentElement;
    if (!document.fullscreenElement) {
      if (gameShell.requestFullscreen) {
        gameShell.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  // ============================================================================
  // SAYFA BAŞLATMA & ETKİLEŞİM BAĞLANTILARI
  // ============================================================================

  function initApp() {
    // 1. Rozet Envanteri Slotlarını Doldur
    const slotsContainer = document.getElementById("hudBadgeSlots");
    if (slotsContainer && window.PATIKOD_SVGS) {
      slotsContainer.innerHTML = "";
      Object.keys(window.PATIKOD_SVGS.badges).forEach((key) => {
        const b = window.PATIKOD_SVGS.badges[key];
        const div = document.createElement("div");
        div.className = "badge-slot";
        div.id = `badgeSlot_${key}`;
        div.title = `${b.name}: ${b.desc}`;
        div.innerHTML = b.svg;
        div.addEventListener("click", () => {
          window.patiAudio.playClick();
          speakCoach(`${b.name} (${b.subtitle}): ${b.desc}`, "Rozet Envanteri Bilgisi");
        });
        slotsContainer.appendChild(div);
      });
    }

    // 2. Dr. Pati Avatarını Yükle
    const avatarBox = document.getElementById("aiAvatarContainer");
    if (avatarBox && window.PATIKOD_SVGS) {
      avatarBox.innerHTML = window.PATIKOD_SVGS.drPatiAvatar + '<span class="ai-live-dot"></span>';
    }

    // 3. Alt Vitrin (Sadece index.html'de varsa doldur)
    const galleryImgs = {
      galleryImgHero: "hero",
      galleryImgState1: "scene1",
      galleryImgState2: "scene2",
      galleryImgState3: "scene3",
      galleryImgState4: "scene4"
    };
    Object.keys(galleryImgs).forEach((elId) => {
      const el = document.getElementById(elId);
      if (el) el.src = getSceneImage(galleryImgs[elId]);
    });

    const badgesGrid = document.getElementById("badgesShowcaseGrid");
    if (badgesGrid && window.PATIKOD_SVGS) {
      badgesGrid.innerHTML = "";
      Object.keys(window.PATIKOD_SVGS.badges).forEach((key) => {
        const b = window.PATIKOD_SVGS.badges[key];
        const card = document.createElement("div");
        card.className = "badge-showcase-card";
        card.innerHTML = `
          <div class="badge-showcase-icon">${b.svg}</div>
          <div>
            <div style="font-size:0.72rem; font-weight:800; color:${b.color}; text-transform:uppercase;">${b.subtitle}</div>
            <div style="font-size:0.98rem; font-weight:800; color:#fff; margin:2px 0;">${b.name}</div>
            <div style="font-size:0.79rem; color:#94a3b8;">${b.desc}</div>
          </div>
        `;
        badgesGrid.appendChild(card);
      });
    }

    // 4. Bölüm Adım Butonları (Stepper)
    document.querySelectorAll(".step-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ch = parseInt(btn.getAttribute("data-chapter"), 10);
        goToChapter(ch);
      });
    });

    // 5. Galeri Kartlarından Doğrudan Sahneye Geçiş Butonları
    document.querySelectorAll("[data-jump-chapter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ch = parseInt(btn.getAttribute("data-jump-chapter"), 10);
        goToChapter(ch);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    // 6. AI Koç Hızlı Soru Çipleri
    document.querySelectorAll("[data-ai-faq]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.patiAudio.playClick();
        const key = btn.getAttribute("data-ai-faq");
        if (AI_FAQ[key]) {
          speakCoach(AI_FAQ[key].text, AI_FAQ[key].ref);
        }
      });
    });

    // 7. Ses, Yağmur ve Tam Ekran Kontrolleri (Hem index.html hem oyun.html HUD için)
    document.querySelectorAll(".js-toggle-sound").forEach((btn) => {
      btn.addEventListener("click", () => {
        const on = window.patiAudio.toggleMute();
        document.querySelectorAll(".js-toggle-sound").forEach((b) => {
          b.innerHTML = on ? "🔊 Ses: Açık" : "🔇 Ses: Kapalı";
        });
      });
    });

    document.querySelectorAll(".js-toggle-rain").forEach((btn) => {
      btn.addEventListener("click", () => {
        const playing = window.patiAudio.toggleRain();
        document.querySelectorAll(".js-toggle-rain").forEach((b) => {
          b.innerHTML = playing ? "🌧️ Yağmur: Açık" : "🌧️ Yağmur Sesi";
        });
      });
    });

    document.querySelectorAll(".js-fullscreen-btn").forEach((btn) => {
      btn.addEventListener("click", toggleFullscreenMode);
    });

    // Bağımsız oyun.html dosyasını indirme butonu (Hem oyun.html içinden hem portal üzerinden)
    document.querySelectorAll(".js-download-standalone").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        window.patiAudio.playClick();
        if (window.IS_STANDALONE_BUNDLE || window.location.protocol === "file:") {
          e.preventDefault();
          const htmlContent = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
          const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "oyun.html";
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            URL.revokeObjectURL(url);
            a.remove();
          }, 500);
        }
      });
    });

    // 8. Game Over "Tekrar Dene (Restart)" Butonu
    const restartBtn = document.getElementById("restartGameFromCh1Btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", restartGameFromChapter1);
    }

    // 9. Sertifika Modalı Kontrolleri
    const closeCertBtn = document.getElementById("closeCertModalBtn");
    if (closeCertBtn) {
      closeCertBtn.addEventListener("click", () => {
        document.getElementById("certificateModalBackdrop").classList.remove("open");
      });
    }

    const downloadCertPngBtn = document.getElementById("downloadCertPngBtn");
    if (downloadCertPngBtn) {
      downloadCertPngBtn.addEventListener("click", () => {
        const canvas = document.getElementById("certificateCanvas");
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `PATIKOD-Sertifika-${state.playerName.replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }

    // 10. Sosyal Farkındalık Portalı Bileşenleri (Beden Dili Sözlüğü SVG, Flip Cards, SSS Akordeon, Hero Görseli)
    const heroShowcaseImg = document.getElementById("portalHeroImg");
    if (heroShowcaseImg) {
      heroShowcaseImg.src = getSceneImage("hero");
    }

    if (window.PATIKOD_SVGS) {
      document.querySelectorAll("[data-dict-svg]").forEach((el) => {
        const key = el.getAttribute("data-dict-svg");
        if (window.PATIKOD_SVGS.signalDiagrams && window.PATIKOD_SVGS.signalDiagrams[key]) {
          el.innerHTML = window.PATIKOD_SVGS.signalDiagrams[key];
        }
      });

      document.querySelectorAll("[data-badge-svg]").forEach((el) => {
        const key = el.getAttribute("data-badge-svg");
        if (window.PATIKOD_SVGS.badges && window.PATIKOD_SVGS.badges[key]) {
          el.innerHTML = window.PATIKOD_SVGS.badges[key].svg;
        }
      });
    }

    // Dönen Kartlar (Flip Cards) Tıklama Desteği
    document.querySelectorAll(".flip-card").forEach((card) => {
      card.addEventListener("click", () => {
        window.patiAudio.playClick();
        card.classList.toggle("is-flipped");
      });
    });

    // SSS Akordeon Menü Desteği
    document.querySelectorAll(".faq-question-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.patiAudio.playClick();
        const item = btn.closest(".faq-item");
        if (!item) return;
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach((other) => other.classList.remove("open"));
        if (!isOpen) {
          item.classList.add("open");
        }
      });
    });

    // Sticky Navbar Aktif Sekme Vurgusu
    document.querySelectorAll(".nav-tab-btn").forEach((tab) => {
      tab.addEventListener("click", () => {
        window.patiAudio.playClick();
        document.querySelectorAll(".nav-tab-btn").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
      });
    });

    // 11. Başlangıç Sahnesini ve Canvas Döngüsünü Başlat
    initVisualCanvasLoop();
    goToChapter(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
