import React from 'react';

export interface DogState {
  stressLevel: number; // 0 - 100
  earState: 'relaxed' | 'tense_alert' | 'pinned_back';
  eyeState: 'relaxed' | 'whale_eye';
  mouthState: 'relaxed' | 'lip_lick' | 'tense_growl' | 'barking';
  tailState: 'relaxed_wag' | 'tucked' | 'stiff_high';
  posture: 'relaxed' | 'tense_forward' | 'crouched_fear' | 'calm_sitting';
}

interface DogIllustrationProps {
  state: DogState;
  showHotspots?: boolean;
  activeHotspot?: 'ears' | 'eyes' | 'mouth' | null;
  inspectedSpots?: Set<'ears' | 'eyes' | 'mouth'>;
  onSelectHotspot?: (spot: 'ears' | 'eyes' | 'mouth') => void;
  showBone?: boolean;
  actionResult?: 'run' | 'stare' | 'tree' | null;
  walkStrategy?: 'panic' | 'calm_curve' | null;
}

export const DogIllustration: React.FC<DogIllustrationProps> = ({
  state,
  showHotspots = false,
  activeHotspot = null,
  inspectedSpots = new Set(),
  onSelectHotspot,
  showBone = false,
  actionResult = null,
  walkStrategy = null,
}) => {
  const isHighStress = state.stressLevel >= 70;
  const isMedStress = state.stressLevel >= 35 && state.stressLevel < 70;

  // Palet - AmStaff kahverengi/kestane tonları ve göğüs beyaz lekesi
  const coatColor = isHighStress ? '#785A48' : '#8D6E53';
  const coatShadow = isHighStress ? '#5A3F30' : '#6F4E38';
  const coatHighlight = isHighStress ? '#9C7A63' : '#B18E70';
  const chestWhite = '#F1E9DF';
  const noseColor = '#241D1D';

  return (
    <div className="relative w-full max-w-[620px] mx-auto aspect-[4/3] flex items-center justify-center select-none">
      <svg
        viewBox="0 0 720 540"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Sokak Köpeği Beden Dili İllüstrasyonu - AmStaff tipi"
      >
        <defs>
          {/* Zemin gölgesi */}
          <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#0F172A" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </radialGradient>

          {/* Kaslı göğüs gradyanı */}
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor={coatHighlight} />
            <stop offset="55%" stopColor={coatColor} />
            <stop offset="100%" stopColor={coatShadow} />
          </linearGradient>

          {/* Baş ve kas kabartısı */}
          <linearGradient id="headGrad" x1="20%" y1="0%" x2="90%" y2="90%">
            <stop offset="0%" stopColor={coatHighlight} />
            <stop offset="50%" stopColor={coatColor} />
            <stop offset="100%" stopColor={coatShadow} />
          </linearGradient>

          {/* Göz Whale Eye degrade */}
          <radialGradient id="whaleEyeGrad" cx="40%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>
        </defs>

        {/* --- ZEMİN VE YERE DÜŞEN GÖLGE --- */}
        <ellipse
          cx="380"
          cy="465"
          rx={state.posture === 'crouched_fear' ? '250' : '230'}
          ry="32"
          fill="url(#groundShadow)"
          className="transition-all duration-300"
        />

        {/* --- MODÜL 3: KEMİK / YEMEK ALANI (Kaynak Koruma) --- */}
        {showBone && (
          <g transform="translate(480, 420)">
            {/* Koruma Güvenlik Çemberi (Kırmızı/Sarı Uyarı Çemberi) */}
            <circle
              cx="40"
              cy="25"
              r="75"
              fill="none"
              stroke={walkStrategy === 'calm_curve' ? '#059669' : '#DC2626'}
              strokeWidth="2.5"
              strokeDasharray="6 4"
              opacity="0.75"
            />
            <text
              x="40"
              y="-10"
              textAnchor="middle"
              className="text-[12px] font-bold fill-slate-700"
            >
              [Kaynak Koruma Bölgesi: 1.5m]
            </text>

            {/* Gerçekçi Kemik Çizimi */}
            <g transform="translate(10, 10)">
              <rect x="18" y="10" width="44" height="12" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
              <circle cx="18" cy="10" r="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="18" cy="22" r="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="62" cy="10" r="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="62" cy="22" r="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {/* --- MODÜL 3: YÜRÜME ROTASI GÖRSELLEŞTİRMESİ --- */}
        {walkStrategy === 'panic' && (
          <g>
            {/* Doğrudan üstüne yürüme (Hatalı düz kırmızı çizgi) */}
            <path
              d="M 680 440 L 460 380"
              fill="none"
              stroke="#DC2626"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
            />
            <polygon points="450,378 468,370 464,388" fill="#DC2626" />
            <text x="580" y="380" fill="#DC2626" className="text-[13px] font-bold">
              ✕ Doğrudan Üstüne Yürüme (Tehdit!)
            </text>
          </g>
        )}

        {walkStrategy === 'calm_curve' && (
          <g>
            {/* Geniş Kavis Çizme (Doğru yeşil C-kavis çizgisi) */}
            <path
              d="M 680 450 Q 560 520 340 490"
              fill="none"
              stroke="#059669"
              strokeWidth="5"
            />
            <polygon points="330,488 348,478 346,498" fill="#059669" />
            <text x="510" y="525" fill="#059669" className="text-[13px] font-bold">
              ✓ Geniş Kavis (C-Curve): Güvenli Geçiş
            </text>
          </g>
        )}

        {/* --- KÖPEK GÖVDESİ (AMSTAFF KASLI ANATOMİ) --- */}
        <g id="dog-main-body" className="animate-dog-pant transition-all duration-300">
          {/* 1. ARKA KUYRUK */}
          <g
            id="tail"
            className={
              state.tailState === 'relaxed_wag'
                ? 'animate-tail-happy'
                : state.tailState === 'stiff_high'
                ? 'animate-tail-tense'
                : ''
            }
          >
            {state.tailState === 'tucked' ? (
              // Bacak arasına kıstırılmış kuyruk (Korku/Yüksek Stres)
              <path
                d="M 190 320 C 170 360, 200 410, 240 405"
                fill="none"
                stroke={coatShadow}
                strokeWidth="18"
                strokeLinecap="round"
              />
            ) : state.tailState === 'stiff_high' ? (
              // Dik ve sert kuyruk (Meydan okuma / Yüksek gerilim)
              <path
                d="M 190 300 C 160 270, 145 220, 140 180"
                fill="none"
                stroke={coatColor}
                strokeWidth="18"
                strokeLinecap="round"
              />
            ) : (
              // Rahat, orta seviye sallanan kuyruk (Sakin)
              <path
                d="M 190 310 C 150 310, 120 280, 105 240"
                fill="none"
                stroke={coatColor}
                strokeWidth="18"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* 2. ARKA SOL BACAK & BUT */}
          <path
            d="M 230 280 C 180 300, 170 380, 195 435 C 198 443, 220 445, 230 442 C 245 438, 230 380, 250 350 Z"
            fill={coatShadow}
          />
          {/* Arka Sol Pati */}
          <ellipse cx="205" cy="442" rx="18" ry="10" fill={coatShadow} />

          {/* 3. ANA GÖVDE & SIRT & KASLI SIRT HATTI */}
          <path
            d="M 210 320 C 200 280, 230 240, 280 235 C 340 230, 400 245, 450 260 C 490 285, 495 350, 460 380 C 410 400, 310 395, 250 375 C 220 360, 212 340, 210 320 Z"
            fill="url(#bodyGrad)"
          />

          {/* 4. ARKA SAĞ BACAK & KASLI BUT (Ön planda) */}
          <path
            d="M 260 270 C 220 285, 210 350, 225 390 C 235 420, 240 445, 265 448 C 285 450, 285 430, 275 400 C 290 355, 315 330, 305 290 Z"
            fill="url(#bodyGrad)"
          />
          <ellipse cx="255" cy="448" rx="20" ry="10" fill={coatShadow} />

          {/* 5. GÖĞÜS & ÖN SOL BACAK (Derin göğüs, geniş omuzlar) */}
          <path
            d="M 380 340 C 375 380, 370 425, 385 446 C 395 452, 415 450, 418 440 C 420 410, 415 365, 430 340 Z"
            fill={coatShadow}
          />
          <ellipse cx="395" cy="448" rx="19" ry="9" fill={coatShadow} />

          {/* 6. GENİŞ ÖN GÖĞÜS KASI VE BEYAZ LEKE */}
          <path
            d="M 430 265 C 475 285, 485 340, 455 375 C 420 370, 405 320, 415 280 Z"
            fill="url(#bodyGrad)"
          />
          {/* Karakteristik AmStaff Beyaz Göğüs Lekesi */}
          <path
            d="M 450 295 C 470 315, 465 350, 440 360 C 430 350, 435 320, 442 300 Z"
            fill={chestWhite}
            opacity="0.95"
          />

          {/* 7. ÖN SAĞ BACAK (Ön plandaki güçlü dik bacak) */}
          <path
            d="M 435 325 C 430 370, 435 415, 445 448 C 455 455, 480 452, 482 442 C 480 410, 470 360, 465 320 Z"
            fill="url(#bodyGrad)"
          />
          <ellipse cx="460" cy="450" rx="22" ry="10" fill={coatShadow} />

          {/* 8. KASLI VE KALIN BOYUN */}
          <path
            d="M 420 250 C 440 220, 465 195, 500 190 C 515 210, 520 240, 505 270 C 475 285, 445 275, 420 250 Z"
            fill="url(#headGrad)"
          />

          {/* --- AMSTAFF BAŞ YAPISI (Geniş kafatası, belirgin yanak kasları) --- */}
          <g id="dog-head" transform={state.posture === 'tense_forward' ? 'translate(10, 0)' : ''}>
            {/* Arka Kulak (Sol Kulak) */}
            <g id="left-ear">
              {state.earState === 'pinned_back' ? (
                // Geriye kafaya yapışmış kulak (Korku / Yüksek Stres)
                <path
                  d="M 470 170 C 435 175, 415 190, 400 205 C 415 215, 445 200, 468 190 Z"
                  fill={coatShadow}
                />
              ) : state.earState === 'tense_alert' ? (
                // Dik ve gergin öne odaklı kulak
                <path
                  d="M 475 160 C 465 120, 480 95, 495 90 C 505 110, 502 145, 495 165 Z"
                  fill={coatShadow}
                />
              ) : (
                // Sakin gül kulak (Rose-ear)
                <path
                  d="M 470 165 C 455 145, 450 135, 465 130 C 478 135, 482 155, 485 170 Z"
                  fill={coatShadow}
                />
              )}
            </g>

            {/* Geniş Kafatası ve Güçlü Çene Bloğu */}
            <path
              d="M 480 170 C 520 150, 565 160, 580 185 C 600 215, 590 255, 555 275 C 520 290, 475 280, 460 250 C 455 220, 465 185, 480 170 Z"
              fill="url(#headGrad)"
            />

            {/* Belirgin Yanak Kası (Masseter Muscle Bulge) */}
            <ellipse cx="510" cy="235" rx="36" ry="26" fill={coatHighlight} opacity="0.35" />

            {/* Sağ Kulak (Ön Plandaki Kulak) */}
            <g id="right-ear">
              {state.earState === 'pinned_back' ? (
                // Geriye tamamen yatmış kulak (Hotspot 1 Odak Alanı)
                <path
                  d="M 495 175 C 460 170, 420 182, 405 200 C 425 215, 460 205, 490 195 Z"
                  fill={coatHighlight}
                  stroke={coatShadow}
                  strokeWidth="2"
                />
              ) : state.earState === 'tense_alert' ? (
                // Dik ve gergin öne dönük kulak
                <path
                  d="M 500 165 C 505 115, 530 85, 545 80 C 555 105, 545 145, 528 170 Z"
                  fill={coatHighlight}
                  stroke={coatShadow}
                  strokeWidth="2"
                />
              ) : (
                // Gevşek, hafif katlanmış doğal kulak
                <path
                  d="M 495 170 C 480 140, 495 125, 515 120 C 530 135, 525 158, 515 175 Z"
                  fill={coatHighlight}
                  stroke={coatShadow}
                  strokeWidth="2"
                />
              )}
            </g>

            {/* Burun ve Namlu (Muzzle) - Güçlü küt AmStaff burnu */}
            <path
              d="M 550 200 C 585 200, 625 205, 640 220 C 648 230, 645 250, 625 260 C 595 272, 555 270, 535 255 Z"
              fill="url(#headGrad)"
            />

            {/* Siyah Burun Ucu */}
            <path
              d="M 625 215 C 638 215, 645 224, 644 232 C 640 240, 630 242, 620 236 C 615 230, 618 217, 625 215 Z"
              fill={noseColor}
            />
            {/* Burun deliği detayı */}
            <circle cx="628" cy="227" r="2.5" fill="#0A0808" />

            {/* --- GÖZ BÖLGESİ (WHALE EYE DİNAMİĞİ - HOTSPOT 2) --- */}
            <g id="dog-eye" transform="translate(540, 195)">
              {state.eyeState === 'whale_eye' ? (
                // WHALE EYE (Balina Gözü: Gözün beyazı hilal şeklinde arkada ve altta açıkça görünür, fiksasyon)
                <g>
                  {/* Gergin göz kapağı yuvası */}
                  <ellipse cx="14" cy="10" rx="16" ry="12" fill="#241D1D" />

                  {/* Görünür Göz Akı (Sclera - Tehdit/Korku/Stres Belirteci) */}
                  <ellipse cx="14" cy="10" rx="14" ry="10" fill="url(#whaleEyeGrad)" />

                  {/* Kasıntılı gergin İris ve İğne Ucu Büyümüş Gözbebeği */}
                  <ellipse cx="18" cy="10" rx="8" ry="8" fill="#58311B" />
                  <circle cx="18" cy="10" r="5" fill="#0F172A" />

                  {/* Göz parıltısı ve hilal şeklinde beyaz vurgu */}
                  <path
                    d="M 3 10 C 3 4, 10 2, 16 3 C 10 5, 6 8, 5 13 Z"
                    fill="#FFFFFF"
                    opacity="0.9"
                  />
                  <circle cx="16" cy="8" r="1.5" fill="#FFFFFF" />

                  {/* Çatık gergin kaş çizgisi */}
                  <path
                    d="M 0 0 C 10 -4, 24 -2, 30 5"
                    fill="none"
                    stroke="#38261C"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </g>
              ) : (
                // SAKİN VE YUMUŞAK GÖZ
                <g>
                  <ellipse cx="14" cy="10" rx="12" ry="8" fill="#3D291D" />
                  <ellipse cx="14" cy="10" rx="8" ry="7" fill="#58311B" />
                  <circle cx="14" cy="10" r="4.5" fill="#0F172A" />
                  <circle cx="16" cy="8" r="1.8" fill="#FFFFFF" />
                  {/* Yumuşak kaş */}
                  <path
                    d="M 2 2 C 12 0, 22 2, 26 8"
                    fill="none"
                    stroke="#5A3F30"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </g>

            {/* --- AĞIZ VE DUDAK YALAMA HAREKETİ (LIP-LICKING - HOTSPOT 3) --- */}
            <g id="mouth-snout">
              {state.mouthState === 'tense_growl' || state.mouthState === 'barking' ? (
                // Dişler kısmen görünür / Havlama / Hırlama
                <g transform="translate(560, 240)">
                  <path
                    d="M 0 5 C 30 10, 55 12, 70 8 C 65 24, 45 28, 10 20 Z"
                    fill="#450A0A"
                  />
                  {/* Üst dişler */}
                  <polygon points="15,6 20,13 25,6" fill="#F8FAFC" />
                  <polygon points="26,6 31,14 36,6" fill="#F8FAFC" />
                  <polygon points="38,7 43,15 48,7" fill="#F8FAFC" />
                  {/* Alt çene */}
                  <path
                    d="M 0 20 C 35 28, 60 25, 68 12"
                    fill="none"
                    stroke={coatShadow}
                    strokeWidth="4"
                  />
                </g>
              ) : (
                // Kapalı gergin dudak çizgisi
                <path
                  d="M 545 250 C 580 255, 615 254, 638 238"
                  fill="none"
                  stroke={coatShadow}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}

              {/* DUDAK YALAMA (LIP LICK) ANİMASYONU (Stres / Sakinleştirici Sinyal) */}
              {(state.mouthState === 'lip_lick' || isHighStress) && (
                <g id="tongue-flick" className="animate-lip-lick">
                  <path
                    d="M 610 248 C 622 230, 634 220, 642 225 C 648 232, 638 248, 618 252 Z"
                    fill="#E11D48"
                    stroke="#9F1239"
                    strokeWidth="1.5"
                  />
                </g>
              )}
            </g>
          </g>
        </g>

        {/* --- MODÜL 2: OYUNCU DURUŞU ANİMASYONU VE ETKİLEŞİMİ --- */}
        {actionResult === 'tree' && (
          <g transform="translate(100, 140)">
            <rect x="0" y="0" width="160" height="200" rx="12" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
            <text x="80" y="30" textAnchor="middle" className="text-[13px] font-bold fill-emerald-800">
              🌳 AĞAÇ DURUŞU (BAŞARILI)
            </text>
            <circle cx="80" cy="70" r="22" fill="#059669" />
            <path d="M 60 110 L 100 110 L 95 180 L 65 180 Z" fill="#047857" />
            <path d="M 55 125 C 75 140, 85 140, 105 125" fill="none" stroke="#FFFFFF" strokeWidth="4" />
            <text x="80" y="195" textAnchor="middle" className="text-[11px] font-semibold fill-emerald-700">
              Kollar göğüste, göz teması yok
            </text>
          </g>
        )}

        {actionResult === 'run' && (
          <g transform="translate(40, 140)">
            <rect x="0" y="0" width="160" height="200" rx="12" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2" />
            <text x="80" y="30" textAnchor="middle" className="text-[13px] font-bold fill-red-800">
              🏃‍♂️ ÇIĞLIK & KAÇIŞ (TEHLİKELİ)
            </text>
            <text x="80" y="90" textAnchor="middle" className="text-[12px] font-semibold fill-red-700">
              Av Güdüsü Tetiklendi!
            </text>
            <text x="80" y="125" textAnchor="middle" className="text-[11px] fill-red-600">
              Köpek hızla peşinize takılır.
            </text>
          </g>
        )}

        {actionResult === 'stare' && (
          <g transform="translate(40, 140)">
            <rect x="0" y="0" width="160" height="200" rx="12" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2" />
            <text x="80" y="30" textAnchor="middle" className="text-[13px] font-bold fill-red-800">
              👀 DİK BAKIŞ (MEYDAN OKUMA)
            </text>
            <text x="80" y="90" textAnchor="middle" className="text-[12px] font-semibold fill-red-700">
              Tehdit Olarak Algılandı!
            </text>
            <text x="80" y="125" textAnchor="middle" className="text-[11px] fill-red-600">
              Savunma hırlaması ve agresyon!
            </text>
          </g>
        )}

        {/* --- MODÜL 1: İNTERAKTİF ANALİZ NOKTALARI (HOTSPOTS) --- */}
        {showHotspots && (
          <g id="interactive-hotspots">
            {/* 1. KULAKLAR HOTSPOT */}
            <g
              transform="translate(470, 150)"
              className="cursor-pointer"
              onClick={() => onSelectHotspot && onSelectHotspot('ears')}
            >
              <circle
                cx="0"
                cy="0"
                r="24"
                fill={inspectedSpots.has('ears') ? '#059669' : '#0284C7'}
                fillOpacity="0.25"
                className="animate-pulse-ring"
              />
              <circle
                cx="0"
                cy="0"
                r="16"
                fill={inspectedSpots.has('ears') ? '#059669' : '#0284C7'}
                stroke="#FFFFFF"
                strokeWidth="3"
              />
              <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" className="text-[12px] font-extrabold">
                1
              </text>
              <rect x="-42" y="-38" width="84" height="22" rx="4" fill="#0F172A" opacity="0.9" />
              <text x="0" y="-23" textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-bold">
                1. KULAKLAR
              </text>
            </g>

            {/* 2. GÖZLER HOTSPOT */}
            <g
              transform="translate(565, 185)"
              className="cursor-pointer"
              onClick={() => onSelectHotspot && onSelectHotspot('eyes')}
            >
              <circle
                cx="0"
                cy="0"
                r="24"
                fill={inspectedSpots.has('eyes') ? '#059669' : '#0284C7'}
                fillOpacity="0.25"
                className="animate-pulse-ring"
              />
              <circle
                cx="0"
                cy="0"
                r="16"
                fill={inspectedSpots.has('eyes') ? '#059669' : '#0284C7'}
                stroke="#FFFFFF"
                strokeWidth="3"
              />
              <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" className="text-[12px] font-extrabold">
                2
              </text>
              <rect x="-40" y="-38" width="80" height="22" rx="4" fill="#0F172A" opacity="0.9" />
              <text x="0" y="-23" textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-bold">
                2. GÖZLER
              </text>
            </g>

            {/* 3. AĞIZ / BURUN HOTSPOT */}
            <g
              transform="translate(620, 245)"
              className="cursor-pointer"
              onClick={() => onSelectHotspot && onSelectHotspot('mouth')}
            >
              <circle
                cx="0"
                cy="0"
                r="24"
                fill={inspectedSpots.has('mouth') ? '#059669' : '#0284C7'}
                fillOpacity="0.25"
                className="animate-pulse-ring"
              />
              <circle
                cx="0"
                cy="0"
                r="16"
                fill={inspectedSpots.has('mouth') ? '#059669' : '#0284C7'}
                stroke="#FFFFFF"
                strokeWidth="3"
              />
              <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" className="text-[12px] font-extrabold">
                3
              </text>
              <rect x="-48" y="24" width="96" height="22" rx="4" fill="#0F172A" opacity="0.9" />
              <text x="0" y="39" textAnchor="middle" fill="#FFFFFF" className="text-[11px] font-bold">
                3. AĞIZ/BURUN
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
