// ==UserScript==
// @name         🏝️ Time Island & Sidebar Widgets v4
// @namespace    https://achma-learning.github.io/
// @version      4.6.0
// @description  Floating island with clock, dates (EN/Hijri), prayer countdown, live age + sidebar: prayer times (35 Moroccan cities), weather, calendar, life-in-weeks grid, live age counter, stopwatch, notes, editable links. Auto-hide, section toggles, scale/font/blur/color presets, prayer glow. Alt+Ctrl=sidebar, Alt+T=island.
// @author       Achma
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.aladhan.com
// @connect      wttr.in
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  // ═══════════════════════════════════════════
  //  §0  DATA — Cities, Prayers, Months
  // ═══════════════════════════════════════════
  const CITIES=[
    [1,'الرباط','Rabat','Rabat',34.02,-6.84],[7,'القنيطرة','Kénitra','Kenitra',34.26,-6.58],
    [14,'طنجة','Tanger','Tangier',35.76,-5.83],[15,'تطوان','Tétouan','Tetouan',35.59,-5.36],
    [18,'شفشاون','Chefchaouen','Chefchaouen',35.17,-5.26],[23,'الحسيمة','Al Hoceïma','Al Hoceima',35.25,-3.93],
    [29,'وزان','Ouezzane','Ouazzane',34.80,-5.58],[31,'وجدة','Oujda','Oujda',34.68,-1.91],
    [39,'الناظور','Nador','Nador',35.17,-2.93],[35,'كرسيف','Guercif','Guercif',34.23,-3.35],
    [58,'الدار البيضاء','Casablanca','Casablanca',33.57,-7.59],[59,'المحمدية','Mohammedia','Mohammedia',33.69,-7.38],
    [61,'سطات','Settat','Settat',33.00,-7.62],[65,'برشيد','Berrechid','Berrechid',33.27,-7.59],
    [66,'الجديدة','El Jadida','El Jadida',33.23,-8.50],[73,'بني ملال','Béni Mellal','Beni Mellal',32.34,-6.35],
    [79,'خريبكة','Khouribga','Khouribga',32.88,-6.91],[81,'فاس','Fès','Fez',34.02,-5.01],
    [89,'تازة','Taza','Taza',34.21,-4.01],[99,'مكناس','Meknès','Meknes',33.89,-5.55],
    [100,'يفرن','Ifrane','Ifrane',33.53,-5.11],[103,'آزرو','Azrou','Azrou',33.44,-5.22],
    [104,'مراكش','Marrakech','Marrakech',31.63,-7.98],[106,'الصويرة','Essaouira','Essaouira',31.51,-9.77],
    [108,'بنجرير','Benguerir','Benguerir',32.23,-7.95],[111,'آسفي','Safi','Safi',32.30,-9.24],
    [117,'أكادير','Agadir','Agadir',30.43,-9.60],[118,'تارودانت','Taroudant','Taroudant',30.47,-8.88],
    [119,'تزنيت','Tiznit','Tiznit',29.70,-9.80],[123,'طاطا','Tata','Tata',29.75,-7.97],
    [128,'الرشيدية','Errachidia','Errachidia',31.93,-4.43],[136,'ميدلت','Midelt','Midelt',32.68,-4.73],
    [137,'زاكورة','Zagora','Zagora',30.33,-5.84],[138,'ورزازات','Ouarzazate','Ouarzazate',30.92,-6.90],
    [139,'تنغير','Tinghir','Tinghir',31.51,-5.53],[149,'كلميم','Guelmim','Guelmim',28.98,-10.06],
    [152,'طانطان','Tan-Tan','Tan-Tan',28.44,-11.10],[156,'العيون','Laâyoune','Laayoune',27.13,-13.16],
    [165,'الداخلة','Dakhla','Dakhla',23.68,-15.96],[148,'سيدي إفني','Sidi Ifni','Sidi Ifni',29.38,-10.17],
  ];

  const PRAYERS=[
    {key:'Fajr',ar:'الفجر',icon:'🌅'},{key:'Sunrise',ar:'الشروق',icon:'☀️'},
    {key:'Dhuhr',ar:'الظهر',icon:'🌤️'},{key:'Asr',ar:'العصر',icon:'⛅'},
    {key:'Maghrib',ar:'المغرب',icon:'🌇'},{key:'Isha',ar:'العشاء',icon:'🌙'},
  ];
  const HIJRI_M=['مُحَرَّم','صَفَر','رَبِيع الأَوَّل','رَبِيع الثَّانِي','جُمَادَى الأُولَى','جُمَادَى الثَّانِيَة','رَجَب','شَعْبَان','رَمَضَان','شَوَّال','ذُو القَعْدَة','ذُو الحِجَّة'];
  const EN_M=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const EN_D=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const EN_DS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const AR_D=['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const WICON={'Sunny':'☀️','Clear':'☀️','Partly cloudy':'⛅','Partly Cloudy':'⛅','Cloudy':'☁️','Overcast':'☁️','Mist':'🌫️','Fog':'🌫️','Light rain':'🌧️','Rain':'🌧️','Heavy rain':'🌧️','Thunderstorm':'⛈️','Snow':'❄️','Patchy rain possible':'🌦️','Light drizzle':'🌦️'};

  // ═══════════════════════════════════════════
  //  §1  HELPERS
  // ═══════════════════════════════════════════
  const P=n=>String(n).padStart(2,'0');
  const gGet=(k,d)=>{try{return GM_getValue(k,d)}catch{return d}};
  const gSet=(k,v)=>{try{GM_setValue(k,v)}catch{}};
  const tMin=s=>{if(!s)return-1;const p=s.split(':');return+p[0]*60+(+p[1])};
  const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  // XSS-safe: only our own hardcoded prayer names ever go through innerHTML below
  const escHtml=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  function toHijri(gY,gM,gD){
    const a=Math.floor((14-(gM+1))/12),y=gY+4800-a,m=(gM+1)+12*a-3;
    let jd=gD+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;
    let l=jd-1948440+10632;const n=Math.floor((l-1)/10631);l=l-10631*n+354;
    const j=Math.floor((10985-l)/5316)*Math.floor((50*l)/17719)+Math.floor(l/5670)*Math.floor((43*l)/15238);
    l=l-Math.floor((30-j)/15)*Math.floor((17719*j)/50)-Math.floor(j/16)*Math.floor((15238*j)/43)+29;
    const hM=Math.floor((24*l)/709);return{year:30*n+j-30,month:hM,day:l-Math.floor((709*hM)/24)};
  }

  // ═══════════════════════════════════════════
  //  §2  STATE
  // ═══════════════════════════════════════════
  let selCity = gGet('ti_city_idx', 22);
  let prayerData = null;
  let prayerHijri = '';
  let swOn=false,swT0=0,swE=0,swI=null;
  let prayGlow=false;                     // transient — true when within GLOW_MIN of adhan
  const GLOW_MIN=15;                      // glow lasts 15 minutes after each prayer time
  const cfg = {
    islandPos:   gGet('ti_pos','top-center'),
    showIsland:  gGet('ti_showIsland', true),
    showClock:   gGet('ti_showClock', true),
    lockIsland:  gGet('ti_lockIsland', false),
    islandScale: gGet('ti_islandScale', 'medium'),   // small | medium | large | xl
    fontPreset:  gGet('ti_fontPreset', 'default'),    // default | digital | papyrus
    showEmojis:  gGet('ti_showEmojis', true),
    showPopups:  gGet('ti_showPopups', true),
    islandBg:    gGet('ti_islandBg', 'default'),     // 'default' | 'transparent' | '#rrggbb'
    islandBlur:  gGet('ti_islandBlur', 24),           // 0-40 px (#9)
    secClk:      gGet('ti_secClk', true),             // island section toggles (#6)
    secDate:     gGet('ti_secDate', true),
    secHijri:    gGet('ti_secHijri', true),
    secPray:     gGet('ti_secPray', true),
    autoHide:    gGet('ti_autoHide', false),           // Windows-style auto-hide
    showLifeCal: gGet('ti_showLifeCal', true),
    lifeBday:    gGet('ti_lifeBday', ''),               // ISO date string e.g. '2000-01-15'
    lifeExpect:  gGet('ti_lifeExpect', 80),             // years
    glowDur:     gGet('ti_glowDur', 3),                // 1 | 3 | 5 seconds
    showLiveAge: gGet('ti_showLiveAge', true),
    secAge:      gGet('ti_secAge', false),              // live age section on island
    clickPopups: gGet('ti_clickPopups', false),          // click (instead of hover) to open popups
  };

  const DEFAULT_LINKS=[
    {n:'Google',u:'https://www.google.com'},{n:'MAP',u:'https://www.mapnews.ma/ar/'},
    {n:'Mawaqit',u:'https://mawaqit.net'},{n:'Hespress',u:'https://en.hespress.com/'},
    {n:'Feed',u:'https://achma-learning.github.io/feed/'},{n:'Calendar',u:'https://calendar.google.com'},
  ];
  let userLinks=JSON.parse(gGet('ti_links',JSON.stringify(DEFAULT_LINKS)));

  function getCity(){ return CITIES[selCity] || CITIES.find(c=>c[3]==='Marrakech') || CITIES[0]; }

  // ═══════════════════════════════════════════
  //  §2b  GOOGLE FONTS LOADER (for presets)
  // ═══════════════════════════════════════════
  function loadFontPreset(preset){
    const old=document.getElementById('ti-gfonts');
    if(old)old.remove();
    if(preset==='digital'){
      const lk=document.createElement('link');
      lk.id='ti-gfonts'; lk.rel='stylesheet';
      lk.href='https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Inter:wght@400;500;600&family=Noto+Sans+Arabic:wght@400;600;700&family=Rubik:wght@400;600&display=swap';
      document.head.appendChild(lk);
    }
  }
  loadFontPreset(cfg.fontPreset);

  // ═══════════════════════════════════════════
  //  §3  INJECT CSS
  // ═══════════════════════════════════════════
  GM_addStyle(`
:root{--ti:rgba(15,23,42,.88);--tig:rgba(255,255,255,.06);--tib:rgba(255,255,255,.10);--tit:#e2e8f0;--tid:#94a3b8;--tia:#38bdf8;--tia2:#a78bfa;--tig2:#34d399;--tir:#dc2626;--tio:#fb923c;--tif:'Segoe UI',system-ui,-apple-system,sans-serif;--tim:'SF Mono','Cascadia Code','Fira Code',monospace;--tiar:'Amiri','Traditional Arabic','Noto Naskh Arabic',serif}

#ti-island{position:fixed;z-index:2147483646;display:flex;align-items:center;gap:2px;background:var(--ti);backdrop-filter:blur(24px) saturate(1.8);-webkit-backdrop-filter:blur(24px) saturate(1.8);border:1px solid var(--tib);border-radius:52px;padding:6px 8px;box-shadow:0 8px 32px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.05);font-family:var(--tif);cursor:default;user-select:none;transition:opacity .35s,transform .35s,box-shadow .25s,top .4s,left .4s,bottom .4s,right .4s;animation:tiIn .5s cubic-bezier(.16,1,.3,1) both}
#ti-island.ti-top-center{top:12px;left:50%;transform:translateX(-50%)}
#ti-island.ti-top-left{top:12px;left:16px;transform:none}
#ti-island.ti-top-right{top:12px;right:16px;left:auto;transform:none}
#ti-island.ti-bottom-center{bottom:12px;top:auto;left:50%;transform:translateX(-50%)}
#ti-island.ti-hide{opacity:0!important;pointer-events:none!important;transform:translateY(-30px)!important}
#ti-island:hover{box-shadow:0 8px 32px rgba(0,0,0,.4),0 0 24px rgba(56,189,248,.12)}

/* ── Auto-hide (Windows-style) ── */
#ti-island.ti-auto-out.ti-top-center,
#ti-island.ti-auto-out.ti-top-left,
#ti-island.ti-auto-out.ti-top-right{transform:translateY(calc(-100% - 16px))!important;opacity:.15!important;pointer-events:none!important}
#ti-island.ti-auto-out.ti-bottom-center{transform:translateY(calc(100% + 16px))!important;opacity:.15!important;pointer-events:none!important}
#ti-hotzone{position:fixed;z-index:2147483644;display:none}
#ti-hotzone.active{display:block}
@keyframes tiIn{from{opacity:0;transform:translateY(-30px) scale(.92)}}

/* ── Island scale (zoom is spec-standard since 2024) ── */
#ti-island.ti-scale-small{zoom:.82}
#ti-island.ti-scale-large{zoom:1.18}
#ti-island.ti-scale-xl{zoom:1.38}

/* ── Island lock indicator ── */
#ti-island.ti-locked{border-color:rgba(56,189,248,.25)}
#ti-island.ti-locked .ti-dot{background:var(--tia)}

/* ── Hide island emojis when toggled off ── */
#ti-island.ti-no-emoji .ti-emoji{display:none}

/* ── Transparent island bg ── */
#ti-island.ti-bg-clear{background:transparent!important;border-color:rgba(255,255,255,.08)!important;box-shadow:none!important}

/* ── Prayer time glow — animated white/purple/gold border ── */
@keyframes tiPrayGlow{
  0%,100%{border-color:rgba(255,255,255,.9);box-shadow:0 0 18px rgba(255,255,255,.25),0 8px 32px rgba(0,0,0,.4)}
  33%{border-color:rgba(167,139,250,.9);box-shadow:0 0 18px rgba(167,139,250,.3),0 8px 32px rgba(0,0,0,.4)}
  66%{border-color:rgba(250,204,21,.9);box-shadow:0 0 18px rgba(250,204,21,.25),0 8px 32px rgba(0,0,0,.4)}
}
#ti-island.ti-pray-glow{animation:tiPrayGlow 3s ease-in-out infinite;border-width:1.5px}

/* ── Live Age (island + sidebar) ── */
.ti-age{font-size:11px;color:var(--tig2);font-weight:600;font-family:var(--tim);white-space:nowrap}
.ti-age-w{text-align:center;padding:4px 0}
.ti-age-live{font-family:var(--tim);font-size:28px;font-weight:700;color:var(--tit);line-height:1.3;letter-spacing:.5px}
.ti-age-live span{color:var(--tid);font-size:11px;font-weight:400}
.ti-age-sub{font-size:11px;color:var(--tid);margin-top:4px}
.ti-age-prompt{text-align:center;padding:14px 10px;color:var(--tid);font-size:12px}

/* ── Blur slider ── */
.ti-set-range-row{display:flex;align-items:center;gap:8px;padding:4px 0}
.ti-set-range{flex:1;-webkit-appearance:none;height:4px;background:var(--tib);border-radius:2px;outline:none}
.ti-set-range::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--tia);cursor:pointer}
.ti-set-range::-moz-range-thumb{width:14px;height:14px;border:none;border-radius:50%;background:var(--tia);cursor:pointer}
.ti-set-range-val{font-size:11px;font-family:var(--tim);color:var(--tid);min-width:32px;text-align:right}

/* ── Quick Links editor ── */
.ti-lnk-wrap{display:flex;flex-direction:column;gap:8px}
.ti-lnk-list{display:flex;flex-wrap:wrap;gap:6px}
.ti-la-del{display:none;margin-left:2px;color:rgba(248,113,113,.8);font-size:13px;cursor:pointer;line-height:1}
.ti-la:hover .ti-la-del{display:inline}
.ti-lnk-add{display:flex;gap:6px;align-items:center}
.ti-lnk-inp{flex:1;background:rgba(0,0,0,.2);border:1px solid var(--tib);color:var(--tit);padding:5px 8px;border-radius:6px;font-size:11px;font-family:var(--tif);outline:none}
.ti-lnk-inp:focus{border-color:var(--tia)}
.ti-lnk-inp::placeholder{color:rgba(148,163,184,.4)}
.ti-lnk-btn{padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid var(--tia);background:rgba(56,189,248,.1);color:var(--tia);transition:background .2s}
.ti-lnk-btn:hover{background:rgba(56,189,248,.2)}

/* ── Color picker row ── */
.ti-set-color{display:flex;flex-direction:column;gap:8px;padding:8px 0}
.ti-set-color-label{font-size:12px;color:var(--tid)}
.ti-set-color-row{display:flex;align-items:center;gap:8px}
.ti-set-color-pick{width:36px;height:28px;border:1px solid var(--tib);border-radius:6px;cursor:pointer;background:none;padding:0;overflow:hidden}
.ti-set-color-pick::-webkit-color-swatch-wrapper{padding:0}
.ti-set-color-pick::-webkit-color-swatch{border:none;border-radius:4px}
.ti-set-color-pick::-moz-color-swatch{border:none;border-radius:4px}
.ti-set-hex{flex:1;background:rgba(0,0,0,.2);border:1px solid var(--tib);color:var(--tit);padding:5px 8px;border-radius:8px;font-size:11px;font-family:var(--tim);outline:none;text-transform:uppercase;letter-spacing:.5px;transition:border-color .2s}
.ti-set-hex:focus{border-color:var(--tia)}
.ti-set-hex::placeholder{color:rgba(148,163,184,.4);text-transform:none;letter-spacing:0}
.ti-set-color-btns{display:flex;gap:6px}
.ti-set-cbtn{padding:4px 10px;border-radius:6px;font-size:10px;font-weight:600;cursor:pointer;border:1px solid var(--tib);background:var(--tig);color:var(--tid);transition:background .2s,color .2s}
.ti-set-cbtn:hover{background:rgba(255,255,255,.1);color:var(--tit)}
.ti-set-cbtn.active{border-color:var(--tia);color:var(--tia)}

/* ── Font preset: Digital ── */
#ti-island.ti-font-digital .ti-clk{font-family:'Orbitron',var(--tim);letter-spacing:1.5px}
#ti-island.ti-font-digital .ti-en{font-family:'Inter',var(--tif)}
#ti-island.ti-font-digital .ti-ar{font-family:'Noto Sans Arabic',var(--tiar)}
#ti-island.ti-font-digital .ti-np{font-family:'Rubik',var(--tif)}

/* ── Font preset: Papyrus ── */
#ti-island.ti-font-papyrus .ti-clk,
#ti-island.ti-font-papyrus .ti-clk .ti-clk-s,
#ti-island.ti-font-papyrus .ti-en,
#ti-island.ti-font-papyrus .ti-ar,
#ti-island.ti-font-papyrus .ti-np{font-family:'Papyrus','Segoe Script','Comic Sans MS',fantasy}

.ti-s{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:40px;transition:background .2s;position:relative;white-space:nowrap}
.ti-s:hover{background:var(--tig)}
.ti-d{width:1px;height:20px;background:var(--tib);flex-shrink:0}
.ti-dot{width:6px;height:6px;border-radius:50%;background:var(--tig2);animation:tiP 2s ease-in-out infinite}
@keyframes tiP{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}

.ti-clk{font-family:var(--tim);font-size:14px;font-weight:600;color:var(--tit);letter-spacing:.5px}
.ti-clk-s{font-size:10px;color:var(--tid);font-weight:400;vertical-align:super;margin-left:1px}
.ti-en{font-size:12.5px;color:var(--tit);font-weight:500}
.ti-ar{font-size:13px;color:var(--tia2);font-family:var(--tiar);font-weight:600;direction:rtl}
.ti-np{font-size:11px;color:var(--tio);font-weight:600;font-family:var(--tim);direction:ltr;unicode-bidi:isolate}
.ti-np-ar{direction:rtl;unicode-bidi:isolate;display:inline}
.ti-np-ltr{direction:ltr;unicode-bidi:isolate;display:inline}

/* Popups */
.ti-pop{position:fixed;z-index:2147483647;background:var(--ti);backdrop-filter:blur(24px) saturate(1.8);border:1px solid var(--tib);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.4);font-family:var(--tif);color:var(--tit);opacity:0;transform:translateY(-8px);transition:opacity .25s,transform .25s;pointer-events:none}
.ti-pop.show{opacity:1;transform:translateY(0);pointer-events:auto}

/* Calendar popup */
.ti-cp{padding:16px;min-width:280px}
.ti-ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-weight:600;font-size:14px}
.ti-cn{background:var(--tig);border:1px solid var(--tib);color:var(--tit);border-radius:8px;width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;transition:background .2s}
.ti-cn:hover{background:rgba(255,255,255,.12)}
.ti-cg{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center}
.ti-cw{font-size:10px;color:var(--tid);font-weight:600;padding:4px 0;text-transform:uppercase}
.ti-cd{font-size:12.5px;padding:6px 2px;border-radius:8px;cursor:default}
.ti-cd:hover{background:var(--tig)}
.ti-ct{background:var(--tia)!important;color:#0f172a!important;font-weight:700;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;margin:0 auto}
.ti-co{color:rgba(148,163,184,.3)}

/* Hijri popup */
.ti-hp{padding:20px;min-width:240px;border-color:rgba(167,139,250,.25);box-shadow:0 8px 32px rgba(0,0,0,.4),0 0 20px rgba(167,139,250,.1);direction:rtl;text-align:center;font-family:var(--tiar)}
.ti-hl{font-size:12px;color:var(--tia2);margin-bottom:6px;font-family:var(--tif);letter-spacing:1px;text-transform:uppercase}
.ti-hd{font-size:42px;font-weight:700;color:var(--tia2);line-height:1.1}
.ti-hm{font-size:22px;margin:4px 0;font-weight:600}
.ti-hy{font-size:16px;color:var(--tid)}
.ti-hw{font-size:15px;color:var(--tid);margin-top:8px;padding-top:8px;border-top:1px solid var(--tib)}

/* Google Calendar popup */
.ti-gcp{padding:16px;min-width:240px;text-align:center}
.ti-gcp-title{font-size:13px;font-weight:600;margin-bottom:10px;color:var(--tia)}
.ti-gcp-date{font-size:11px;color:var(--tid);margin-bottom:12px}
.ti-gcp-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(66,133,244,.15);border:1px solid rgba(66,133,244,.3);border-radius:20px;color:#8ab4f8;text-decoration:none;font-size:12px;font-weight:600;transition:background .2s}
.ti-gcp-btn:hover{background:rgba(66,133,244,.25)}

/* Prayer times popup (hover on countdown) */
.ti-pp{padding:16px;min-width:270px}
.ti-pp-hdr{text-align:center;margin-bottom:10px}
.ti-pp-label{font-size:11px;color:var(--tia);font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
.ti-pp-hijri{font-size:13px;font-weight:700;color:var(--tia2);font-family:var(--tiar);direction:rtl}
.ti-pp-city{font-size:11px;color:var(--tid);margin-top:2px}
.ti-pp-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;direction:rtl}
.ti-pp-item{background:rgba(0,0,0,.2);border-radius:8px;padding:8px 6px;text-align:center}
.ti-pp-item.on{background:var(--tir)}
.ti-pp-item .pp-name{font-size:10px;color:var(--tid);margin-bottom:2px;font-family:var(--tiar)}
.ti-pp-item .pp-time{font-size:14px;font-weight:700;color:var(--tit);font-family:var(--tim);font-variant-numeric:tabular-nums}
.ti-pp-item.on .pp-name,.ti-pp-item.on .pp-time{color:#fff}
.ti-pp-cd{text-align:center;margin-top:10px;padding-top:8px;border-top:1px solid var(--tib);font-family:var(--tim);font-size:13px;color:var(--tio);font-weight:600;direction:ltr;unicode-bidi:isolate}

/* Sidebar */
#ti-sb{position:fixed;top:0;right:0;width:320px;height:100vh;z-index:2147483645;background:var(--ti);backdrop-filter:blur(24px) saturate(1.8);border-left:1px solid var(--tib);box-shadow:-4px 0 32px rgba(0,0,0,.3);font-family:var(--tif);color:var(--tit);transform:translateX(100%);transition:transform .4s cubic-bezier(.16,1,.3,1);overflow-y:auto;overflow-x:hidden}
#ti-sb.open{transform:translateX(0)}
#ti-sb::-webkit-scrollbar{width:4px}
#ti-sb::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px}

.ti-sbh{padding:20px;border-bottom:1px solid var(--tib);display:flex;justify-content:space-between;align-items:center}
.ti-sbt{font-size:16px;font-weight:700;background:linear-gradient(135deg,var(--tia),var(--tia2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.ti-sbx{background:var(--tig);border:1px solid var(--tib);color:var(--tid);width:32px;height:32px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:background .2s,color .2s}
.ti-sbx:hover{background:rgba(255,255,255,.1);color:var(--tit)}

/* Widget card */
.ti-w{margin:12px;padding:16px;background:var(--tig);border:1px solid var(--tib);border-radius:16px;transition:border-color .2s}
.ti-w:hover{border-color:rgba(255,255,255,.15)}
.ti-wt{font-size:11px;font-weight:600;color:var(--tid);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;display:flex;align-items:center;gap:6px}

/* Prayer widget */
.ti-pg{display:grid;grid-template-columns:1fr 1fr;gap:6px;direction:rtl}
.ti-pi{background:rgba(0,0,0,.2);border-radius:10px;padding:10px 6px;text-align:center;transition:all .2s}
.ti-pi.on{background:var(--tir)}
.ti-pi.on .ti-pn,.ti-pi.on .ti-pt{color:#fff}
.ti-pn{font-size:11px;color:var(--tid);margin-bottom:3px;font-family:var(--tiar)}
.ti-pt{font-size:15px;font-weight:700;color:var(--tit);font-family:var(--tim);font-variant-numeric:tabular-nums}
.ti-phj{text-align:center;direction:rtl;font-family:var(--tiar);font-size:14px;font-weight:700;color:var(--tia2);margin-bottom:4px}
.ti-pgr{text-align:center;font-size:11px;color:var(--tid);margin-bottom:8px}
.ti-pcd{text-align:center;font-family:var(--tim);font-size:13px;color:var(--tio);margin-top:8px;font-weight:600;direction:ltr;unicode-bidi:isolate}
.ti-habous{text-align:center;margin-top:8px}
.ti-habous-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 14px;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.3);border-radius:20px;color:var(--tig2);text-decoration:none;font-size:11px;font-weight:600;transition:background .2s,transform .15s;cursor:pointer;font-family:var(--tif)}
.ti-habous-btn:hover{background:rgba(52,211,153,.2);transform:translateY(-1px)}
.ti-pld{padding:24px;text-align:center;color:var(--tid);font-size:13px}

/* City search */
.ti-cs{position:relative;margin-bottom:10px}
.ti-csi{width:100%;background:rgba(0,0,0,.2);border:1px solid var(--tib);color:var(--tit);padding:8px 10px;border-radius:10px;font-size:12px;font-family:var(--tif);text-align:center;outline:none;direction:ltr;transition:border-color .2s}
.ti-csi:focus{border-color:var(--tia)}
.ti-csi::placeholder{color:rgba(148,163,184,.4)}
.ti-csd{display:none;position:absolute;top:100%;left:0;right:0;max-height:200px;overflow-y:auto;background:rgba(15,23,42,.96);border:1px solid var(--tib);border-top:none;border-radius:0 0 10px 10px;z-index:50;scrollbar-width:thin}
.ti-csd.open{display:block}
.ti-csdi{padding:8px 10px;cursor:pointer;font-size:12px;color:var(--tit);transition:background .15s;direction:ltr;text-align:left}
.ti-csdi:hover,.ti-csdi.hl{background:rgba(56,189,248,.1);color:var(--tia)}
.ti-csdi.sel{font-weight:700;color:var(--tia)}

/* Weather */
.ti-ww{background:linear-gradient(135deg,#3b82f6,#06b6d4);border-radius:16px;padding:16px;color:#fff;margin:12px;box-shadow:0 4px 16px rgba(0,0,0,.2)}
.ti-wwh{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.ti-wwc{font-size:14px;font-weight:600}
.ti-wwi{font-size:2rem}
.ti-wwt{font-size:2.2rem;font-weight:700;line-height:1}
.ti-wwd{font-size:12px;opacity:.85;margin-top:2px}
.ti-wwg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.2)}
.ti-wwgl{font-size:10px;opacity:.7;text-align:center}
.ti-wwgv{font-size:13px;font-weight:600;text-align:center}
.ti-wwld{padding:20px;text-align:center;color:rgba(255,255,255,.7);font-size:12px}

/* Sidebar calendar */
.ti-scg{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;text-align:center}
.ti-scw{font-size:10px;color:var(--tid);font-weight:600;padding:6px 0 4px}
.ti-scd{font-size:12px;padding:7px 2px;border-radius:8px;cursor:default;transition:background .15s}
.ti-scd:hover{background:rgba(255,255,255,.06)}
.ti-scd.today{background:var(--tia);color:#0f172a;font-weight:700;border-radius:50%}
.ti-scd.oth{color:rgba(148,163,184,.25)}
.ti-sch{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.ti-sch span{font-size:13px;font-weight:600}
.ti-scn{background:none;border:1px solid var(--tib);color:var(--tid);border-radius:6px;width:24px;height:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;transition:background .2s}
.ti-scn:hover{background:var(--tig)}

/* Settings */
.ti-set-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:12px}
.ti-set-label{color:var(--tid)}
.ti-set-sel{background:rgba(0,0,0,.2);border:1px solid var(--tib);color:var(--tit);padding:4px 8px;border-radius:8px;font-size:11px;font-family:var(--tif);cursor:pointer;outline:none}
.ti-set-tog{width:40px;height:22px;border-radius:11px;border:none;cursor:pointer;position:relative;transition:background .2s}
.ti-set-tog.on{background:var(--tia)}
.ti-set-tog.off{background:rgba(255,255,255,.15)}
.ti-set-tog::after{content:'';position:absolute;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s}
.ti-set-tog.on::after{left:21px}
.ti-set-tog.off::after{left:3px}
.ti-set-divider{height:1px;background:var(--tib);margin:6px 0}

/* Links */
.ti-lnk{display:flex;flex-wrap:wrap;gap:6px}
.ti-la{display:inline-flex;align-items:center;gap:4px;padding:6px 12px;background:var(--tig);border:1px solid var(--tib);border-radius:20px;color:var(--tit);text-decoration:none;font-size:11.5px;font-weight:500;transition:background .2s,border-color .2s,transform .15s}
.ti-la:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);transform:translateY(-1px)}

.ti-kbd{display:inline-flex;padding:2px 6px;font-size:10px;font-family:var(--tim);background:var(--tig);border:1px solid var(--tib);border-radius:4px;color:var(--tid)}
.ti-foot{padding:16px 20px;border-top:1px solid var(--tib);text-align:center;font-size:10px;color:rgba(148,163,184,.4)}

/* Stopwatch */
.ti-swd{font-family:var(--tim);font-size:28px;font-weight:600;text-align:center;color:var(--tit);padding:8px 0;letter-spacing:2px}
.ti-swb{display:flex;gap:8px;justify-content:center}
.ti-swbn{padding:6px 18px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid var(--tib);background:var(--tig);color:var(--tit);transition:background .2s,transform .1s;text-transform:uppercase;letter-spacing:.5px}
.ti-swbn:hover{background:rgba(255,255,255,.1)}
.ti-swbn:active{transform:scale(.96)}

/* Notepad */
.ti-np-ta{width:100%;min-height:80px;background:rgba(0,0,0,.2);border:1px solid var(--tib);border-radius:10px;color:var(--tit);font-family:var(--tif);font-size:12.5px;padding:10px;resize:vertical;outline:none;transition:border-color .2s}
.ti-np-ta:focus{border-color:var(--tia)}
.ti-np-ta::placeholder{color:rgba(148,163,184,.4)}

/* Analog clock in sidebar */
.ti-clkw{text-align:center;padding:8px 0}
.ti-clks{width:140px;height:140px;margin:0 auto;display:block}
.ti-ckf{fill:none;stroke:var(--tib);stroke-width:2}
.ti-ckt{stroke:var(--tid);stroke-width:1.5;stroke-linecap:round}
.ti-cktm{stroke:rgba(148,163,184,.25);stroke-width:1}
.ti-ckh{stroke:var(--tit);stroke-width:3.5;stroke-linecap:round}
.ti-ckm{stroke:var(--tit);stroke-width:2.5;stroke-linecap:round}
.ti-cks{stroke:var(--tia);stroke-width:1.2;stroke-linecap:round}
.ti-ckc{fill:var(--tia)}
.ti-ckn{fill:var(--tid);font-size:10px;font-family:var(--tif);font-weight:600;text-anchor:middle;dominant-baseline:central}
.ti-dig{font-family:var(--tim);font-size:22px;font-weight:600;color:var(--tit);margin-top:8px;letter-spacing:1px;text-align:center}
.ti-dig-s{font-size:13px;color:var(--tid)}

/* ── Life Calendar ── */
.ti-lc-row{display:flex;gap:6px;align-items:center;justify-content:center;margin-bottom:6px}
.ti-lc-input{background:rgba(0,0,0,.2);border:1px solid var(--tib);color:var(--tit);padding:4px 6px;border-radius:6px;font-size:11px;font-family:var(--tim);outline:none;text-align:center;transition:border-color .2s}
.ti-lc-input:focus{border-color:var(--tia)}
.ti-lc-input[type="number"]{width:48px}
.ti-lc-stats{display:flex;justify-content:center;gap:10px;margin:6px 0 4px;font-size:10px}
.ti-lc-stat{text-align:center}
.ti-lc-stat-val{font-size:13px;font-weight:700;font-family:var(--tim);line-height:1.2}
.ti-lc-stat-val.lived{color:var(--tia)}
.ti-lc-stat-val.left{color:var(--tig2)}
.ti-lc-stat-val.pct{color:var(--tia2)}
.ti-lc-stat-lbl{color:var(--tid);font-size:8px;text-transform:uppercase;letter-spacing:.5px}
.ti-lc-bar{height:4px;border-radius:2px;background:rgba(255,255,255,.06);margin:4px 0 8px;overflow:hidden}
.ti-lc-bar-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--tia),var(--tia2));transition:width .5s ease}
.ti-lc-grid-wrap{position:relative}
.ti-lc-grid{display:grid;grid-template-columns:repeat(52,1fr);gap:0}
.ti-lc-wk{width:100%;height:3px;border-radius:0;background:rgba(255,255,255,.06)}
.ti-lc-wk.lived{background:var(--tia)}
.ti-lc-wk.cur{background:var(--tio);box-shadow:0 0 3px rgba(251,146,60,.6)}
.ti-lc-wk:hover{outline:1px solid rgba(255,255,255,.4);border-radius:1px;z-index:1;position:relative}
.ti-lc-wk.decade{border-top:1px solid rgba(148,163,184,.2)}
.ti-lc-legend{display:flex;justify-content:center;gap:10px;margin-top:6px;font-size:8px;color:var(--tid)}
.ti-lc-leg-dot{display:inline-block;width:7px;height:7px;border-radius:1px;margin-right:3px;vertical-align:middle}
.ti-lc-prompt{text-align:center;padding:16px 10px;color:var(--tid);font-size:12px}
  `);

  // ═══════════════════════════════════════════
  //  §4  BUILD DOM
  // ═══════════════════════════════════════════

  // --- Island ---
  const island=document.createElement('div');
  island.id='ti-island';
  // Class list is rebuilt by syncIslandClasses()
  island.innerHTML=`
    <div class="ti-s" id="ti-s-clk" data-sec="clk"><span class="ti-dot"></span><span class="ti-clk" id="ti-clk"></span></div>
    <div class="ti-d" data-sep="clk-date"></div>
    <div class="ti-s" id="ti-s-en" data-sec="date"><span class="ti-emoji" style="font-size:14px;line-height:1">📅</span><span class="ti-en" id="ti-en"></span></div>
    <div class="ti-d" data-sep="date-hijri"></div>
    <div class="ti-s" id="ti-s-ar" data-sec="hijri"><span class="ti-emoji" style="font-size:14px;line-height:1">🌙</span><span class="ti-ar" id="ti-ar"></span></div>
    <div class="ti-d" data-sep="hijri-pray"></div>
    <div class="ti-s" id="ti-s-np" data-sec="pray"><span class="ti-emoji" style="font-size:14px;line-height:1">🕌</span><span class="ti-np" id="ti-np"></span></div>
    <div class="ti-d" data-sep="pray-age"></div>
    <div class="ti-s" id="ti-s-age" data-sec="age"><span class="ti-emoji" style="font-size:14px;line-height:1">⏳</span><span class="ti-age" id="ti-age"></span></div>`;
  document.body.appendChild(island);

  /** Rebuild island className + inline styles from cfg — single source of truth */
  function syncIslandClasses(){
    let cls='ti-'+cfg.islandPos;
    if(!cfg.showIsland) cls+=' ti-hide';
    if(cfg.lockIsland)  cls+=' ti-locked';
    if(!cfg.showEmojis)  cls+=' ti-no-emoji';
    if(cfg.islandScale!=='medium') cls+=' ti-scale-'+cfg.islandScale;
    if(cfg.fontPreset!=='default') cls+=' ti-font-'+cfg.fontPreset;
    if(cfg.islandBg==='transparent') cls+=' ti-bg-clear';
    if(prayGlow) cls+=' ti-pray-glow';
    island.className=cls;
    // Glow animation duration
    island.style.animationDuration=prayGlow?cfg.glowDur+'s':'';

    // Inline blur (#9) — applies to all bg modes
    const blurVal=`blur(${cfg.islandBlur}px) saturate(1.8)`;
    if(cfg.islandBg!=='default'&&cfg.islandBg!=='transparent'&&/^#[0-9a-f]{6}$/i.test(cfg.islandBg)){
      island.style.background=cfg.islandBg+'dd';
      island.style.backdropFilter=blurVal;
      island.style.webkitBackdropFilter=blurVal;
    }else if(cfg.islandBg==='transparent'){
      island.style.background='';
      island.style.backdropFilter=cfg.islandBlur>0?blurVal:'none';
      island.style.webkitBackdropFilter=cfg.islandBlur>0?blurVal:'none';
    }else{
      island.style.background='';
      island.style.backdropFilter=blurVal;
      island.style.webkitBackdropFilter=blurVal;
    }

    // Section visibility (#6) — show/hide sections + dividers
    syncIslandSections();
  }

  /** Show/hide island sections and their adjacent dividers */
  function syncIslandSections(){
    const secMap={clk:cfg.secClk,date:cfg.secDate,hijri:cfg.secHijri,pray:cfg.secPray,age:cfg.secAge};
    const order=['clk','date','hijri','pray','age'];
    // Hide/show each section
    order.forEach(k=>{
      const el=island.querySelector(`[data-sec="${k}"]`);
      if(el) el.style.display=secMap[k]?'':'none';
    });
    // Divider visible only when both its neighbours are visible
    island.querySelectorAll('[data-sep]').forEach(div=>{
      const[a,b]=div.dataset.sep.split('-');
      div.style.display=(secMap[a]&&secMap[b])?'':'none';
    });
  }
  syncIslandClasses();

  // --- Auto-hide hotzone (Windows-style) ---
  const hotzone=document.createElement('div');
  hotzone.id='ti-hotzone';
  document.body.appendChild(hotzone);
  let autoTimer=null;

  /** Position the invisible hotzone strip at the island's edge */
  function syncHotzone(){
    if(!cfg.autoHide){hotzone.classList.remove('active');island.classList.remove('ti-auto-out');return}
    hotzone.classList.add('active');
    const isBottom=cfg.islandPos==='bottom-center';
    Object.assign(hotzone.style,{
      left:'0',right:'0',width:'100%',height:'14px',
      top:isBottom?'':'0',bottom:isBottom?'0':'',
    });
    // Start hidden after brief delay
    clearTimeout(autoTimer);
    autoTimer=setTimeout(()=>{island.classList.add('ti-auto-out')},1200);
  }

  function autoHideShow(){
    clearTimeout(autoTimer);
    island.classList.remove('ti-auto-out');
  }
  function autoHideHide(){
    if(!cfg.autoHide)return;
    clearTimeout(autoTimer);
    autoTimer=setTimeout(()=>{island.classList.add('ti-auto-out')},600);
  }

  hotzone.addEventListener('mouseenter',autoHideShow);
  hotzone.addEventListener('mouseleave',autoHideHide);
  island.addEventListener('mouseenter',()=>{if(cfg.autoHide)autoHideShow()});
  island.addEventListener('mouseleave',()=>{if(cfg.autoHide)autoHideHide()});
  if(cfg.autoHide)syncHotzone();

  // --- Popups ---
  const calPop=document.createElement('div');calPop.className='ti-pop ti-cp';document.body.appendChild(calPop);
  const hijPop=document.createElement('div');hijPop.className='ti-pop ti-hp';document.body.appendChild(hijPop);
  const gcPop=document.createElement('div');gcPop.className='ti-pop ti-gcp';document.body.appendChild(gcPop);
  const prayPop=document.createElement('div');prayPop.className='ti-pop ti-pp';document.body.appendChild(prayPop);

  // --- Sidebar ---
  const sb=document.createElement('div');
  sb.id='ti-sb';
  sb.innerHTML=`
    <div class="ti-sbh"><span class="ti-sbt">⚡ Widgets</span><button class="ti-sbx" id="ti-x">✕</button></div>

    <!-- PRAYER -->
    <div class="ti-w" id="ti-pw">
      <div class="ti-wt">🕌 مواقيت الصلاة</div>
      <div class="ti-cs"><input class="ti-csi" id="ti-ci" placeholder="ابحث / Search city..." autocomplete="off"><div class="ti-csd" id="ti-cd"></div></div>
      <div class="ti-phj" id="ti-phj"></div>
      <div class="ti-pgr" id="ti-pgr"></div>
      <div id="ti-pg"><div class="ti-pld">جاري التحميل...</div></div>
      <div class="ti-pcd" id="ti-pcd"></div>
      <div class="ti-habous" id="ti-habous"><a class="ti-habous-btn" id="ti-habous-btn" href="#" target="_blank">📅 الشهري / Monthly</a></div>
    </div>

    <!-- WEATHER -->
    <div class="ti-ww" id="ti-ww"><div class="ti-wwld">Loading weather...</div></div>

    <!-- CALENDAR -->
    <div class="ti-w"><div class="ti-wt">📅 Calendar</div><div id="ti-sc"></div></div>

    <!-- CLOCK -->
    <div class="ti-w" id="ti-clk-w">
      <div class="ti-wt">🕐 Clock</div>
      <div class="ti-clkw"><svg class="ti-clks" viewBox="0 0 200 200" id="ti-svg"><circle cx="100" cy="100" r="92" class="ti-ckf"/></svg><div class="ti-dig" id="ti-dig"></div></div>
    </div>

    <!-- STOPWATCH -->
    <div class="ti-w"><div class="ti-wt">⏱️ Stopwatch</div><div class="ti-swd" id="ti-sw">00:00.00</div><div class="ti-swb"><button class="ti-swbn" id="ti-swg" style="border-color:rgba(52,211,153,.4);color:var(--tig2)">Start</button><button class="ti-swbn" id="ti-sws" style="display:none;border-color:rgba(248,113,113,.4);color:#f87171">Stop</button><button class="ti-swbn" id="ti-swr">Reset</button></div></div>

    <!-- NOTEPAD -->
    <div class="ti-w"><div class="ti-wt">📝 Quick Notes</div><textarea class="ti-np-ta" id="ti-notes" placeholder="Type notes... (auto-saved)"></textarea></div>

    <!-- LIFE CALENDAR -->
    <div class="ti-w" id="ti-lc-w" style="padding:12px;${cfg.showLifeCal?'':'display:none'}">
      <div class="ti-wt">⏳ Life Calendar</div>
      <div class="ti-lc-row">
        <span style="font-size:10px;color:var(--tid)">Born</span>
        <input type="date" class="ti-lc-input" id="ti-lc-bday" value="${cfg.lifeBday}">
        <span style="font-size:10px;color:var(--tid)">Expect</span>
        <input type="number" class="ti-lc-input" id="ti-lc-exp" min="40" max="120" value="${cfg.lifeExpect}">
        <span style="font-size:10px;color:var(--tid)">yr</span>
      </div>
      <div id="ti-lc-body"></div>
    </div>

    <!-- LIVE AGE -->
    <div class="ti-w" id="ti-la-w" style="${cfg.showLiveAge?'':'display:none'}">
      <div class="ti-wt">💀 Live Age</div>
      <div class="ti-age-w"><div id="ti-la-body"><div class="ti-age-prompt">Set birthday in Life Calendar above</div></div></div>
    </div>

    <!-- SETTINGS -->
    <div class="ti-w" id="ti-settings">
      <div class="ti-wt">⚙️ Settings</div>

      <div class="ti-set-row"><span class="ti-set-label">Show Island</span><button class="ti-set-tog ${cfg.showIsland?'on':'off'}" id="ti-tog-island"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">Show Clock Widget</span><button class="ti-set-tog ${cfg.showClock?'on':'off'}" id="ti-tog-clock"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">Show Life Calendar</span><button class="ti-set-tog ${cfg.showLifeCal?'on':'off'}" id="ti-tog-lifecal"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">Show Live Age</span><button class="ti-set-tog ${cfg.showLiveAge?'on':'off'}" id="ti-tog-liveage"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">Lock Island Position</span><button class="ti-set-tog ${cfg.lockIsland?'on':'off'}" id="ti-tog-lock"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">Show Island Emojis</span><button class="ti-set-tog ${cfg.showEmojis?'on':'off'}" id="ti-tog-emoji"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">Show Hover Popups</span><button class="ti-set-tog ${cfg.showPopups?'on':'off'}" id="ti-tog-popups"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">Click to Open Popups</span><button class="ti-set-tog ${cfg.clickPopups?'on':'off'}" id="ti-tog-clickpopups"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">Auto-Hide Island</span><button class="ti-set-tog ${cfg.autoHide?'on':'off'}" id="ti-tog-autohide"></button></div>

      <div class="ti-set-divider"></div>
      <div style="font-size:10px;font-weight:600;color:var(--tid);text-transform:uppercase;letter-spacing:1px;margin:2px 0 4px">Island Sections</div>
      <div class="ti-set-row"><span class="ti-set-label">🕐 Clock</span><button class="ti-set-tog ${cfg.secClk?'on':'off'}" id="ti-tog-secClk"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">📅 English Date</span><button class="ti-set-tog ${cfg.secDate?'on':'off'}" id="ti-tog-secDate"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">🌙 Hijri Date</span><button class="ti-set-tog ${cfg.secHijri?'on':'off'}" id="ti-tog-secHijri"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">🕌 Prayer Countdown</span><button class="ti-set-tog ${cfg.secPray?'on':'off'}" id="ti-tog-secPray"></button></div>
      <div class="ti-set-row"><span class="ti-set-label">⏳ Live Age</span><button class="ti-set-tog ${cfg.secAge?'on':'off'}" id="ti-tog-secAge"></button></div>

      <div class="ti-set-divider"></div>

      <div class="ti-set-row"><span class="ti-set-label">Island Position</span><select class="ti-set-sel" id="ti-sel-pos"><option value="top-center">Top Center</option><option value="top-left">Top Left</option><option value="top-right">Top Right</option><option value="bottom-center">Bottom Center</option></select></div>
      <div class="ti-set-row"><span class="ti-set-label">Island Scale</span><select class="ti-set-sel" id="ti-sel-scale"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option><option value="xl">XL</option></select></div>
      <div class="ti-set-row"><span class="ti-set-label">Font Preset</span><select class="ti-set-sel" id="ti-sel-font"><option value="default">Default</option><option value="digital">Digital</option><option value="papyrus">Papyrus</option></select></div>
      <div class="ti-set-row"><span class="ti-set-label">Prayer Glow Speed</span><select class="ti-set-sel" id="ti-sel-glow"><option value="1">Fast (1s)</option><option value="3">Normal (3s)</option><option value="5">Slow (5s)</option></select></div>

      <div class="ti-set-row"><span class="ti-set-label">Blur</span><div class="ti-set-range-row"><input type="range" class="ti-set-range" id="ti-rng-blur" min="0" max="40" value="${cfg.islandBlur}"><span class="ti-set-range-val" id="ti-blur-val">${cfg.islandBlur}px</span></div></div>

      <div class="ti-set-color">
        <span class="ti-set-color-label">Island Background</span>
        <div class="ti-set-color-row">
          <input type="color" class="ti-set-color-pick" id="ti-bg-pick" value="${cfg.islandBg.startsWith('#')?cfg.islandBg:'#0f172a'}">
          <input type="text" class="ti-set-hex" id="ti-bg-hex" placeholder="#0f172a" maxlength="7" value="${cfg.islandBg.startsWith('#')?cfg.islandBg:''}">
        </div>
        <div class="ti-set-color-btns">
          <button class="ti-set-cbtn${cfg.islandBg==='default'?' active':''}" id="ti-bg-def">Default</button>
          <button class="ti-set-cbtn${cfg.islandBg==='transparent'?' active':''}" id="ti-bg-clear">Transparent</button>
        </div>
      </div>

      <div class="ti-set-divider"></div>

      <div style="display:flex;flex-direction:column;gap:6px;font-size:12px">
        <div style="display:flex;justify-content:space-between;align-items:center"><span style="color:var(--tid)">Toggle Sidebar</span><span><span class="ti-kbd">Alt</span>+<span class="ti-kbd">Ctrl</span></span></div>
        <div style="display:flex;justify-content:space-between;align-items:center"><span style="color:var(--tid)">Toggle Island</span><span><span class="ti-kbd">Alt</span>+<span class="ti-kbd">T</span></span></div>
      </div>
    </div>

    <!-- LINKS (dynamic #7) -->
    <div class="ti-w" id="ti-lnk-w"><div class="ti-wt">🔗 Quick Links</div>
      <div class="ti-lnk-wrap">
        <div class="ti-lnk-list" id="ti-lnk-list"></div>
        <div class="ti-lnk-add">
          <input class="ti-lnk-inp" id="ti-lnk-name" placeholder="Name">
          <input class="ti-lnk-inp" id="ti-lnk-url" placeholder="https://..." style="flex:2">
          <button type="button" class="ti-lnk-btn" id="ti-lnk-addbtn">+</button>
        </div>
      </div>
    </div>

    <div class="ti-foot">🏝️ Time Island v4.6.0</div>`;
  document.body.appendChild(sb);

  // ═══════════════════════════════════════════
  //  §5  CACHE DOM REFS
  // ═══════════════════════════════════════════
  const $=k=>document.getElementById(k);
  const R={clk:$('ti-clk'),en:$('ti-en'),ar:$('ti-ar'),np:$('ti-np'),phj:$('ti-phj'),pgr:$('ti-pgr'),pg:$('ti-pg'),pcd:$('ti-pcd'),sc:$('ti-sc'),dig:$('ti-dig'),sw:$('ti-sw'),notes:$('ti-notes'),ww:$('ti-ww'),ci:$('ti-ci'),cd:$('ti-cd'),age:$('ti-age'),habous:$('ti-habous-btn')};

  /** Update Habous monthly link to match the selected city (#14) */
  function syncHabousLink(){
    const c=getCity();
    R.habous.href=`https://www.habous.gov.ma/prieres/horaire_hijri_2.php?ville=${c[0]}`;
  }
  syncHabousLink();

  // ═══════════════════════════════════════════
  //  §6  ANALOG CLOCK SVG
  // ═══════════════════════════════════════════
  const svg=$('ti-svg'),NS='http://www.w3.org/2000/svg';
  for(let i=0;i<60;i++){const a=i*6*Math.PI/180,hr=i%5===0,l=document.createElementNS(NS,'line'),r1=hr?78:83;l.setAttribute('x1',100+(r1)*Math.sin(a));l.setAttribute('y1',100-r1*Math.cos(a));l.setAttribute('x2',100+88*Math.sin(a));l.setAttribute('y2',100-88*Math.cos(a));l.setAttribute('class',hr?'ti-ckt':'ti-cktm');svg.appendChild(l)}
  for(let i=1;i<=12;i++){const a=i*30*Math.PI/180,t=document.createElementNS(NS,'text');t.setAttribute('x',100+68*Math.sin(a));t.setAttribute('y',100-68*Math.cos(a));t.setAttribute('class','ti-ckn');t.textContent=i;svg.appendChild(t)}
  const HN={};['h','m','s'].forEach(k=>{const l=document.createElementNS(NS,'line');l.setAttribute('x1',100);l.setAttribute('y1',100);l.setAttribute('x2',100);l.setAttribute('y2',100);l.setAttribute('class',k==='h'?'ti-ckh':k==='m'?'ti-ckm':'ti-cks');svg.appendChild(l);HN[k]=l});
  const cc=document.createElementNS(NS,'circle');cc.setAttribute('cx',100);cc.setAttribute('cy',100);cc.setAttribute('r',4);cc.setAttribute('class','ti-ckc');svg.appendChild(cc);
  function sH(el,deg,len){const r=deg*Math.PI/180;el.setAttribute('x2',100+len*Math.sin(r));el.setAttribute('y2',100-len*Math.cos(r))}

  // ═══════════════════════════════════════════
  //  §7  CITY SEARCH
  // ═══════════════════════════════════════════
  let hlIdx=-1;
  function cityDisplay(){const c=getCity();return `${c[1]} - ${c[2]}`}
  R.ci.value=cityDisplay();

  function renderDD(q=''){
    const qn=norm(q.trim());
    const filtered=qn?CITIES.filter(c=>c[1].includes(q.trim())||norm(c[2]).includes(qn)||norm(c[3]).includes(qn)):CITIES;
    if(!filtered.length){R.cd.innerHTML='<div style="padding:12px;text-align:center;color:var(--tid);font-size:11px">No results</div>';}
    else{R.cd.innerHTML=filtered.map((c,i)=>{const cur=CITIES[selCity];const isSel=cur&&c[0]===cur[0];return `<div class="ti-csdi${isSel?' sel':''}${i===hlIdx?' hl':''}" data-i="${CITIES.indexOf(c)}">${c[1]} - ${c[2]}</div>`}).join('')}
    R.cd.classList.add('open');
  }

  function pickCity(idx){
    selCity=idx;gSet('ti_city_idx',idx);
    R.ci.value=cityDisplay();R.cd.classList.remove('open');hlIdx=-1;
    fetchPrayer();fetchWeather();syncHabousLink();
  }

  R.ci.addEventListener('focus',()=>{R.ci.select();renderDD(R.ci.value===cityDisplay()?'':R.ci.value)});
  R.ci.addEventListener('input',()=>{hlIdx=-1;renderDD(R.ci.value)});
  R.ci.addEventListener('keydown',e=>{
    const items=R.cd.querySelectorAll('.ti-csdi');
    if(e.key==='ArrowDown'){e.preventDefault();hlIdx=Math.min(hlIdx+1,items.length-1);items.forEach((el,i)=>el.classList.toggle('hl',i===hlIdx));items[hlIdx]?.scrollIntoView({block:'nearest'})}
    else if(e.key==='ArrowUp'){e.preventDefault();hlIdx=Math.max(hlIdx-1,0);items.forEach((el,i)=>el.classList.toggle('hl',i===hlIdx));items[hlIdx]?.scrollIntoView({block:'nearest'})}
    else if(e.key==='Enter'){e.preventDefault();if(hlIdx>=0&&items[hlIdx])pickCity(+items[hlIdx].dataset.i)}
    else if(e.key==='Escape'){R.ci.value=cityDisplay();R.cd.classList.remove('open');R.ci.blur()}
  });
  R.cd.addEventListener('click',e=>{const it=e.target.closest('.ti-csdi');if(it)pickCity(+it.dataset.i)});
  document.addEventListener('click',e=>{if(!e.target.closest('.ti-cs')){R.cd.classList.remove('open');R.ci.value=cityDisplay()}});

  // ═══════════════════════════════════════════
  //  §8  PRAYER TIMES (AlAdhan API)
  // ═══════════════════════════════════════════
  function fetchPrayer(){
    R.pg.innerHTML='<div class="ti-pld">جاري التحميل...</div>';
    const c=getCity();const now=new Date();
    const ds=`${P(now.getDate())}-${P(now.getMonth()+1)}-${now.getFullYear()}`;
    const url=`https://api.aladhan.com/v1/timings/${ds}?latitude=${c[4]}&longitude=${c[5]}&method=21`;
    GM_xmlhttpRequest({method:'GET',url,onload(r){
      try{
        const d=JSON.parse(r.responseText);if(d.code!==200)throw 0;
        prayerData={};PRAYERS.forEach(p=>{prayerData[p.key]=d.data.timings[p.key]});
        const h=d.data.date.hijri;
        prayerHijri=`${h.day} ${h.month.ar||h.month.en} ${h.year} هـ`;
        R.phj.textContent=prayerHijri;
        R.pgr.textContent=`الموافق ${now.getDate()} ${EN_M[now.getMonth()]} ${now.getFullYear()}`;
        renderPG();
      }catch{R.pg.innerHTML='<div class="ti-pld" style="color:var(--tir)">خطأ في التحميل</div>'}
    },onerror(){R.pg.innerHTML='<div class="ti-pld" style="color:var(--tir)">خطأ في الاتصال</div>'}});
  }

  function getActive(){
    if(!prayerData)return{act:null,nxt:null,nxtM:-1};
    const now=new Date(),nm=now.getHours()*60+now.getMinutes();
    let act='Isha',nxt=null,nxtM=-1;
    for(let i=PRAYERS.length-1;i>=0;i--){const t=tMin(prayerData[PRAYERS[i].key]);if(t>=0&&nm>=t){act=PRAYERS[i].key;break}if(i===0&&nm<t)act='Isha'}
    for(let i=0;i<PRAYERS.length;i++){const t=tMin(prayerData[PRAYERS[i].key]);if(t>nm){nxt=PRAYERS[i];nxtM=t-nm;break}}
    if(!nxt){nxt=PRAYERS[0];nxtM=(1440-nm)+tMin(prayerData.Fajr)}
    return{act,nxt,nxtM};
  }

  function renderPG(){
    if(!prayerData)return;const{act}=getActive();
    R.pg.innerHTML='<div class="ti-pg">'+PRAYERS.map(p=>`<div class="ti-pi${p.key===act?' on':''}"><div class="ti-pn">${p.icon} ${p.ar}</div><div class="ti-pt">${prayerData[p.key]||'--:--'}</div></div>`).join('')+'</div>';
  }

  // ── v4.1.0 FIX: Bidi-safe countdown formatting ──
  // Arabic text (RTL) and Latin countdown (LTR) are wrapped in
  // unicode-bidi:isolate spans so the browser's bidi algorithm
  // never re-orders the dash/colon/numbers into the wrong run.
  function fmtCountdown(arName, timeStr){
    return `<span class="ti-np-ar">${escHtml(arName)}</span>`
         + ` : `
         + `<span class="ti-np-ltr">${escHtml(timeStr)}</span>`;
  }

  function updCountdown(){
    const{act,nxt,nxtM}=getActive();
    if(!nxt||nxtM<0){R.np.innerHTML='';R.pcd.innerHTML='';return}
    const h=Math.floor(nxtM/60),m=nxtM%60;
    const s=h>0?`${h}h ${P(m)}m`:`${m}m`;
    // Island: "الفجر : 8h 35m"
    R.np.innerHTML=fmtCountdown(nxt.ar, s);
    // Sidebar widget: "⏳ الفجر : 8h 35m"
    R.pcd.innerHTML=`⏳ ${fmtCountdown(nxt.ar, s)}`;

    // ── Prayer glow: light up border for GLOW_MIN after each adhan ──
    let glowNow=false;
    if(act&&prayerData&&prayerData[act]){
      const now=new Date(), nm=now.getHours()*60+now.getMinutes();
      const actT=tMin(prayerData[act]);
      // Minutes since this prayer started (handle midnight wrap for Isha)
      const elapsed = nm >= actT ? nm - actT : (1440 - actT) + nm;
      // Exclude Sunrise — it's not a prayer, just an informational time
      glowNow = act !== 'Sunrise' && elapsed < GLOW_MIN;
    }
    if(glowNow!==prayGlow){
      prayGlow=glowNow;
      syncIslandClasses();   // only rebuilds on actual transition
    }
  }

  // ═══════════════════════════════════════════
  //  §9  WEATHER (wttr.in, synced with city)
  // ═══════════════════════════════════════════
  function fetchWeather(){
    const c=getCity();const city=c[3].replace(/\s+/g,'+');
    R.ww.innerHTML='<div class="ti-wwld">Loading weather...</div>';
    GM_xmlhttpRequest({method:'GET',url:`https://wttr.in/${city}?format=j1`,onload(r){
      try{
        const d=JSON.parse(r.responseText);const cur=d.current_condition[0];
        const desc=cur.weatherDesc?.[0]?.value||'N/A';
        const ico=WICON[desc]||'🌤️';
        R.ww.innerHTML=`
          <div class="ti-wwh"><div><div class="ti-wwc">${c[3]}</div><div class="ti-wwt">${cur.temp_C}°C</div><div class="ti-wwd">${desc}</div></div><div class="ti-wwi">${ico}</div></div>
          <div class="ti-wwg"><div><div class="ti-wwgl">Humidity</div><div class="ti-wwgv">${cur.humidity}%</div></div><div><div class="ti-wwgl">Wind</div><div class="ti-wwgv">${cur.windspeedKmph} km/h</div></div><div><div class="ti-wwgl">Feels</div><div class="ti-wwgv">${cur.FeelsLikeC}°C</div></div></div>`;
      }catch{R.ww.innerHTML='<div class="ti-wwld">Weather unavailable</div>'}
    },onerror(){R.ww.innerHTML='<div class="ti-wwld">Weather unavailable</div>'}});
  }

  // ═══════════════════════════════════════════
  //  §10  POPUPS — Calendar, Hijri, GCal
  // ═══════════════════════════════════════════
  let cY,cM;function initCal(){const n=new Date();cY=n.getFullYear();cM=n.getMonth()}initCal();

  function renderCalPop(){
    const now=new Date(),first=new Date(cY,cM,1),sd=first.getDay(),dim=new Date(cY,cM+1,0).getDate(),pdim=new Date(cY,cM,0).getDate();
    let h=`<div class="ti-ch"><button class="ti-cn" data-d="-1">◀</button><span>${EN_M[cM]} ${cY}</span><button class="ti-cn" data-d="1">▶</button></div><div class="ti-cg">`;
    EN_DS.forEach(d=>h+=`<div class="ti-cw">${d}</div>`);
    for(let i=sd-1;i>=0;i--)h+=`<div class="ti-cd ti-co">${pdim-i}</div>`;
    for(let d=1;d<=dim;d++){const t=d===now.getDate()&&cM===now.getMonth()&&cY===now.getFullYear();h+=t?`<div class="ti-cd"><div class="ti-ct">${d}</div></div>`:`<div class="ti-cd">${d}</div>`}
    const rem=(7-((sd+dim)%7))%7;for(let d=1;d<=rem;d++)h+=`<div class="ti-cd ti-co">${d}</div>`;
    h+='</div>';calPop.innerHTML=h;
    calPop.querySelectorAll('.ti-cn').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();cM+=+b.dataset.d;if(cM>11){cM=0;cY++}else if(cM<0){cM=11;cY--}renderCalPop()}));
  }

  function renderHijPop(){
    const now=new Date(),h=toHijri(now.getFullYear(),now.getMonth(),now.getDate());
    hijPop.innerHTML=`<div class="ti-hl">التاريخ الهجري</div><div class="ti-hd">${h.day}</div><div class="ti-hm">${HIJRI_M[h.month-1]||''}</div><div class="ti-hy">${h.year} هـ</div><div class="ti-hw">${AR_D[now.getDay()]}</div>`;
  }

  function renderGcPop(){
    const now=new Date();
    const dateStr=`${EN_D[now.getDay()]}, ${EN_M[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    const gcUrl=`https://calendar.google.com/calendar/r/day/${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`;
    gcPop.innerHTML=`<div class="ti-gcp-title">📅 Today's Schedule</div><div class="ti-gcp-date">${dateStr}</div><a class="ti-gcp-btn" href="${gcUrl}" target="_blank">Open Google Calendar →</a>`;
  }

  // ── Prayer Times popup (hover on countdown section) ──
  function renderPrayPop(){
    const city=getCity();
    if(!prayerData){
      prayPop.innerHTML='<div style="padding:16px;text-align:center;color:var(--tid);font-size:12px">جاري التحميل...</div>';
      return;
    }
    const{act,nxt,nxtM}=getActive();
    let h='<div class="ti-pp-hdr"><div class="ti-pp-label">🕌 مواقيت الصلاة</div>';
    if(prayerHijri)h+=`<div class="ti-pp-hijri">${prayerHijri}</div>`;
    h+=`<div class="ti-pp-city">${city[2]}</div></div>`;
    h+='<div class="ti-pp-grid">';
    PRAYERS.forEach(p=>{
      h+=`<div class="ti-pp-item${p.key===act?' on':''}"><div class="pp-name">${p.icon} ${p.ar}</div><div class="pp-time">${prayerData[p.key]||'--:--'}</div></div>`;
    });
    h+='</div>';
    if(nxt&&nxtM>=0){
      const hr=Math.floor(nxtM/60),mn=nxtM%60;
      const ts=hr>0?`${hr}h ${P(mn)}m`:`${mn}m`;
      h+=`<div class="ti-pp-cd">${fmtCountdown(nxt.ar,ts)}</div>`;
    }
    prayPop.innerHTML=h;
  }

  // Smart popup positioning: above island when in bottom half, below when in top half.
  // cfg.showPopups is a master kill-switch — when OFF no popup opens at all.
  // cfg.clickPopups switches from hover to click-to-toggle mode.
  const allPopups=[]; // track all popups for outside-click dismiss
  function positionPopup(trig,popup,posRight){
    const r=trig.getBoundingClientRect();
    const pH=popup.offsetHeight;
    const midY=window.innerHeight/2;
    if(r.top+r.height/2>midY){
      popup.style.top=Math.max(4,r.top-pH-10)+'px';
    }else{
      popup.style.top=(r.bottom+10)+'px';
    }
    popup.style.bottom='auto';
    if(posRight){popup.style.right='8px';popup.style.left='auto'}
    else{popup.style.left=Math.max(8,r.left-60)+'px';popup.style.right='auto'}
  }

  function closeAllPopups(){allPopups.forEach(p=>p.classList.remove('show'))}

  function hoverSetup(trigId,popup,renderFn,posRight){
    let timer;
    const trig=document.getElementById(trigId);
    allPopups.push(popup);

    // ── Hover mode ──
    trig.addEventListener('mouseenter',()=>{
      if(!cfg.showPopups||cfg.clickPopups)return;
      clearTimeout(timer);
      renderFn();
      positionPopup(trig,popup,posRight);
      popup.classList.add('show');
    });
    trig.addEventListener('mouseleave',()=>{
      if(cfg.clickPopups)return;
      timer=setTimeout(()=>popup.classList.remove('show'),300);
    });
    popup.addEventListener('mouseenter',()=>{if(!cfg.clickPopups)clearTimeout(timer)});
    popup.addEventListener('mouseleave',()=>{
      if(cfg.clickPopups)return;
      timer=setTimeout(()=>popup.classList.remove('show'),200);
    });

    // ── Click mode ──
    trig.addEventListener('click',e=>{
      if(!cfg.showPopups||!cfg.clickPopups)return;
      e.stopPropagation();
      const wasOpen=popup.classList.contains('show');
      closeAllPopups();
      if(!wasOpen){
        renderFn();
        positionPopup(trig,popup,posRight);
        popup.classList.add('show');
      }
    });
    popup.addEventListener('click',e=>e.stopPropagation());
  }
  // Close popups on outside click (click mode)
  document.addEventListener('click',()=>{if(cfg.clickPopups)closeAllPopups()});

  hoverSetup('ti-s-en',calPop,()=>{initCal();renderCalPop()},false);
  hoverSetup('ti-s-ar',hijPop,renderHijPop,true);
  hoverSetup('ti-s-clk',gcPop,renderGcPop,false);
  hoverSetup('ti-s-np',prayPop,renderPrayPop,true);

  // ═══════════════════════════════════════════
  //  §11  SIDEBAR CALENDAR
  // ═══════════════════════════════════════════
  let sY,sM;function initSC(){const n=new Date();sY=n.getFullYear();sM=n.getMonth()}initSC();
  function renderSC(){
    const now=new Date(),first=new Date(sY,sM,1),sd=first.getDay(),dim=new Date(sY,sM+1,0).getDate(),pdim=new Date(sY,sM,0).getDate();
    let h=`<div class="ti-sch"><button class="ti-scn" data-d="-1">◀</button><span>${EN_M[sM]} ${sY}</span><button class="ti-scn" data-d="1">▶</button></div><div class="ti-scg">`;
    EN_DS.forEach(d=>h+=`<div class="ti-scw">${d}</div>`);
    for(let i=sd-1;i>=0;i--)h+=`<div class="ti-scd oth">${pdim-i}</div>`;
    for(let d=1;d<=dim;d++){const t=d===now.getDate()&&sM===now.getMonth()&&sY===now.getFullYear();h+=`<div class="ti-scd${t?' today':''}">${d}</div>`}
    const rem=(7-((sd+dim)%7))%7;for(let d=1;d<=rem;d++)h+=`<div class="ti-scd oth">${d}</div>`;
    h+='</div>';R.sc.innerHTML=h;
    R.sc.querySelectorAll('.ti-scn').forEach(b=>b.addEventListener('click',()=>{sM+=+b.dataset.d;if(sM>11){sM=0;sY++}else if(sM<0){sM=11;sY--}renderSC()}));
  }

  // ═══════════════════════════════════════════
  //  §11b  LIFE CALENDAR
  // ═══════════════════════════════════════════
  const lcBody=$('ti-lc-body'), lcBday=$('ti-lc-bday'), lcExp=$('ti-lc-exp');

  function renderLifeCal(){
    if(!cfg.lifeBday){
      lcBody.innerHTML='<div class="ti-lc-prompt">Enter your birthday above to see<br>your life in weeks</div>';
      return;
    }
    const bday=new Date(cfg.lifeBday+'T00:00:00');
    if(isNaN(bday.getTime())){lcBody.innerHTML='<div class="ti-lc-prompt">Invalid date</div>';return}
    const now=new Date(), exp=cfg.lifeExpect;
    const totalWeeks=exp*52;
    // Weeks lived = floor of ms difference
    const msLived=now.getTime()-bday.getTime();
    if(msLived<0){lcBody.innerHTML='<div class="ti-lc-prompt">Birthday is in the future</div>';return}
    const weeksLived=Math.floor(msLived/(7*24*60*60*1000));
    const weeksLeft=Math.max(0,totalWeeks-weeksLived);
    const pct=Math.min(100,(weeksLived/totalWeeks*100)).toFixed(1);

    // Stats + progress bar
    const ageYrs=Math.floor(msLived/(365.25*24*60*60*1000));
    const ageMo=Math.floor((msLived%(365.25*24*60*60*1000))/(30.44*24*60*60*1000));
    let h='<div class="ti-lc-stats">';
    h+=`<div class="ti-lc-stat"><div class="ti-lc-stat-val lived">${ageYrs}y ${ageMo}m</div><div class="ti-lc-stat-lbl">Age</div></div>`;
    h+=`<div class="ti-lc-stat"><div class="ti-lc-stat-val lived">${weeksLived.toLocaleString()}</div><div class="ti-lc-stat-lbl">Weeks Lived</div></div>`;
    h+=`<div class="ti-lc-stat"><div class="ti-lc-stat-val left">${weeksLeft.toLocaleString()}</div><div class="ti-lc-stat-lbl">Weeks Left</div></div>`;
    h+=`<div class="ti-lc-stat"><div class="ti-lc-stat-val pct">${pct}%</div><div class="ti-lc-stat-lbl">Elapsed</div></div>`;
    h+='</div>';
    h+=`<div class="ti-lc-bar"><div class="ti-lc-bar-fill" style="width:${pct}%"></div></div>`;

    // Grid: 52 columns (weeks) × exp rows (years)
    h+='<div class="ti-lc-grid-wrap"><div class="ti-lc-grid">';
    for(let yr=0;yr<exp;yr++){
      const isDec=yr>0&&yr%10===0;
      for(let wk=0;wk<52;wk++){
        const w=yr*52+wk;
        let cls = w < weeksLived ? 'lived' : (w === weeksLived ? 'cur' : '');
        if(isDec) cls+=' decade';
        h+=`<div class="ti-lc-wk ${cls}" title="Age ${yr}, Week ${wk+1}"></div>`;
      }
    }
    h+='</div></div>';

    // Legend
    h+='<div class="ti-lc-legend">';
    h+='<span><span class="ti-lc-leg-dot" style="background:var(--tia)"></span>Lived</span>';
    h+='<span><span class="ti-lc-leg-dot" style="background:var(--tio)"></span>Now</span>';
    h+='<span><span class="ti-lc-leg-dot" style="background:rgba(255,255,255,.06)"></span>Future</span>';
    h+='</div>';

    lcBody.innerHTML=h;
  }

  lcBday.addEventListener('change',()=>{
    cfg.lifeBday=lcBday.value;gSet('ti_lifeBday',cfg.lifeBday);
    renderLifeCal();updLiveAge();
  });
  lcExp.addEventListener('change',()=>{
    const v=Math.max(40,Math.min(120,+lcExp.value||80));
    lcExp.value=v;cfg.lifeExpect=v;gSet('ti_lifeExpect',v);
    renderLifeCal();
  });
  renderLifeCal();

  // ═══════════════════════════════════════════
  //  §11c  LIVE AGE (mortality-style real-time counter)
  // ═══════════════════════════════════════════
  const laBody=$('ti-la-body');

  /** Compute precise age breakdown from birthday to now */
  function calcAge(bdayStr){
    if(!bdayStr)return null;
    const b=new Date(bdayStr+'T00:00:00');
    if(isNaN(b.getTime()))return null;
    const now=new Date();
    if(now<b)return null;
    let y=now.getFullYear()-b.getFullYear();
    let mo=now.getMonth()-b.getMonth();
    let d=now.getDate()-b.getDate();
    if(d<0){mo--;const prev=new Date(now.getFullYear(),now.getMonth(),0);d+=prev.getDate()}
    if(mo<0){y--;mo+=12}
    const h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
    // Total days alive for secondary stat
    const totalDays=Math.floor((now-b)/(86400000));
    return{y,mo,d,h,m,s,totalDays};
  }

  /** Update sidebar live age widget + island section — called every second from tick() */
  function updLiveAge(){
    const a=calcAge(cfg.lifeBday);
    if(!a){
      laBody.innerHTML='<div class="ti-age-prompt">Set birthday in Life Calendar above</div>';
      R.age.textContent='';
      return;
    }
    // Sidebar: large format
    laBody.innerHTML=`<div class="ti-age-live">${a.y}<span>y</span> ${a.mo}<span>mo</span> ${a.d}<span>d</span><br>${P(a.h)}<span>h</span> ${P(a.m)}<span>m</span> ${P(a.s)}<span>s</span></div><div class="ti-age-sub">${a.totalDays.toLocaleString()} days alive</div>`;
    // Island: compact
    R.age.textContent=`${a.y}y ${a.mo}m ${a.d}d`;
  }

  // ═══════════════════════════════════════════
  //  §12  STOPWATCH & NOTEPAD
  // ═══════════════════════════════════════════
  const swG=$('ti-swg'),swS=$('ti-sws'),swR=$('ti-swr');
  function fSW(ms){const m=Math.floor(ms/60000),s=Math.floor((ms%60000)/1000),c=Math.floor((ms%1000)/10);return`${P(m)}:${P(s)}.${P(c)}`}
  swG.addEventListener('click',()=>{swOn=true;swT0=Date.now()-swE;swG.style.display='none';swS.style.display='';swI=setInterval(()=>{swE=Date.now()-swT0;R.sw.textContent=fSW(swE)},30)});
  swS.addEventListener('click',()=>{swOn=false;clearInterval(swI);swS.style.display='none';swG.style.display=''});
  swR.addEventListener('click',()=>{swOn=false;clearInterval(swI);swE=0;R.sw.textContent='00:00.00';swS.style.display='none';swG.style.display=''});
  R.notes.value=gGet('ti_notepad','');
  R.notes.addEventListener('input',()=>gSet('ti_notepad',R.notes.value));

  // ═══════════════════════════════════════════
  //  §13  SETTINGS
  // ═══════════════════════════════════════════
  $('ti-x').addEventListener('click',()=>sb.classList.remove('open'));

  // --- Select: Island Position ---
  const selPos=$('ti-sel-pos');
  selPos.value=cfg.islandPos;
  selPos.addEventListener('change',e=>{
    cfg.islandPos=e.target.value;gSet('ti_pos',cfg.islandPos);
    syncIslandClasses();
  });

  // --- Select: Island Scale ---
  const selScale=$('ti-sel-scale');
  selScale.value=cfg.islandScale;
  selScale.addEventListener('change',e=>{
    cfg.islandScale=e.target.value;gSet('ti_islandScale',cfg.islandScale);
    syncIslandClasses();
  });

  // --- Select: Font Preset ---
  const selFont=$('ti-sel-font');
  selFont.value=cfg.fontPreset;
  selFont.addEventListener('change',e=>{
    cfg.fontPreset=e.target.value;gSet('ti_fontPreset',cfg.fontPreset);
    loadFontPreset(cfg.fontPreset);
    syncIslandClasses();
  });

  // --- Island Background Color ---
  const bgPick=$('ti-bg-pick'), bgHex=$('ti-bg-hex'),
        bgDef=$('ti-bg-def'),   bgClear=$('ti-bg-clear');

  function applyBg(val){
    cfg.islandBg=val; gSet('ti_islandBg',val);
    syncIslandClasses();
    // Update UI active states
    bgDef.classList.toggle('active', val==='default');
    bgClear.classList.toggle('active', val==='transparent');
    // Sync color picker / hex with custom value
    if(val.startsWith('#')){ bgPick.value=val; bgHex.value=val; }
  }

  bgPick.addEventListener('input',e=>applyBg(e.target.value));
  bgHex.addEventListener('input',()=>{
    let v=bgHex.value.trim();
    if(v&&!v.startsWith('#')) v='#'+v;
    if(/^#[0-9a-f]{6}$/i.test(v)){ bgPick.value=v; applyBg(v); }
  });
  bgHex.addEventListener('blur',()=>{
    // Fix partial input on blur
    if(bgHex.value&&!/^#[0-9a-f]{6}$/i.test(bgHex.value)){
      bgHex.value=cfg.islandBg.startsWith('#')?cfg.islandBg:'';
    }
  });
  bgDef.addEventListener('click',()=>{ bgHex.value=''; applyBg('default'); });
  bgClear.addEventListener('click',()=>{ bgHex.value=''; applyBg('transparent'); });

  // --- Toggle helpers ---
  function setupTog(id,key,onToggle){
    const btn=document.getElementById(id);
    btn.addEventListener('click',()=>{
      cfg[key]=!cfg[key];gSet('ti_'+key,cfg[key]);
      btn.className='ti-set-tog '+(cfg[key]?'on':'off');
      onToggle(cfg[key]);
    });
  }

  setupTog('ti-tog-island','showIsland',()=>syncIslandClasses());
  setupTog('ti-tog-clock','showClock',v=>{$('ti-clk-w').style.display=v?'':'none'});
  setupTog('ti-tog-lifecal','showLifeCal',v=>{$('ti-lc-w').style.display=v?'':'none'});
  setupTog('ti-tog-lock','lockIsland',()=>syncIslandClasses());
  setupTog('ti-tog-emoji','showEmojis',()=>syncIslandClasses());
  setupTog('ti-tog-popups','showPopups',v=>{if(!v)closeAllPopups()});
  setupTog('ti-tog-clickpopups','clickPopups',()=>{closeAllPopups()});
  setupTog('ti-tog-autohide','autoHide',v=>{
    if(v){syncHotzone()}else{hotzone.classList.remove('active');island.classList.remove('ti-auto-out')}
  });
  // Section toggles (#6)
  setupTog('ti-tog-secClk','secClk',()=>syncIslandClasses());
  setupTog('ti-tog-secDate','secDate',()=>syncIslandClasses());
  setupTog('ti-tog-secHijri','secHijri',()=>syncIslandClasses());
  setupTog('ti-tog-secPray','secPray',()=>syncIslandClasses());
  setupTog('ti-tog-secAge','secAge',()=>syncIslandClasses());
  setupTog('ti-tog-liveage','showLiveAge',v=>{$('ti-la-w').style.display=v?'':'none'});
  if(!cfg.showClock)$('ti-clk-w').style.display='none';

  // --- Glow duration ---
  const selGlow=$('ti-sel-glow');
  selGlow.value=cfg.glowDur;
  selGlow.addEventListener('change',e=>{
    cfg.glowDur=+e.target.value;gSet('ti_glowDur',cfg.glowDur);
    if(prayGlow)syncIslandClasses();
  });

  // --- Blur slider (#9) ---
  const rngBlur=$('ti-rng-blur'), blurVal=$('ti-blur-val');
  rngBlur.addEventListener('input',()=>{
    cfg.islandBlur=+rngBlur.value; gSet('ti_islandBlur',cfg.islandBlur);
    blurVal.textContent=cfg.islandBlur+'px';
    syncIslandClasses();
  });

  // --- Quick Links CRUD (#7) ---
  function renderLinks(){
    const list=$('ti-lnk-list');
    list.innerHTML=userLinks.map((lk,i)=>
      `<a class="ti-la" href="${escHtml(lk.u)}" target="_blank">${escHtml(lk.n)}<span class="ti-la-del" data-i="${i}">✕</span></a>`
    ).join('');
    list.querySelectorAll('.ti-la-del').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        userLinks.splice(+btn.dataset.i,1);
        gSet('ti_links',JSON.stringify(userLinks));
        renderLinks();
      });
    });
  }
  renderLinks();

  function addLink(){
    const nameEl=$('ti-lnk-name'),urlEl=$('ti-lnk-url');
    const n=nameEl.value.trim(), u=urlEl.value.trim();
    if(!n||!u)return;
    userLinks.push({n,u});
    gSet('ti_links',JSON.stringify(userLinks));
    nameEl.value='';urlEl.value='';
    renderLinks();
  }
  $('ti-lnk-addbtn').addEventListener('click',addLink);
  $('ti-lnk-name').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addLink()}});
  $('ti-lnk-url').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addLink()}});

  // ═══════════════════════════════════════════
  //  §14  MAIN TICK (requestAnimationFrame)
  // ═══════════════════════════════════════════
  let lastS=-1;
  function tick(){
    const now=new Date(),s=now.getSeconds();
    if(s!==lastS){
      lastS=s;
      const h=now.getHours(),m=now.getMinutes(),h12=h%12||12,ap=h<12?'AM':'PM';
      R.clk.innerHTML=`${P(h12)}:${P(m)}<span class="ti-clk-s">${P(s)} ${ap}</span>`;
      R.en.textContent=`${EN_D[now.getDay()]}, ${EN_M[now.getMonth()]} ${now.getDate()}`;
      const hij=toHijri(now.getFullYear(),now.getMonth(),now.getDate());
      R.ar.textContent=`${hij.day} ${HIJRI_M[hij.month-1]||''} ${hij.year}`;
      R.dig.innerHTML=`${P(h)}:${P(m)}:<span class="ti-dig-s">${P(s)}</span>`;
      sH(HN.h,((h%12)+m/60)*30,42);sH(HN.m,(m+s/60)*6,56);sH(HN.s,s*6,62);
      updCountdown();
      updLiveAge();
      if(s===0)renderPG();
    }
    requestAnimationFrame(tick);
  }

  // ═══════════════════════════════════════════
  //  §15  SHORTCUTS & DRAG
  // ═══════════════════════════════════════════
  document.addEventListener('keydown',e=>{
    if(e.altKey&&e.ctrlKey&&!e.shiftKey&&!e.metaKey){e.preventDefault();sb.classList.toggle('open')}
    if(e.altKey&&!e.ctrlKey&&(e.key==='t'||e.key==='T')){
      e.preventDefault();cfg.showIsland=!cfg.showIsland;gSet('ti_showIsland',cfg.showIsland);
      syncIslandClasses();
      $('ti-tog-island').className='ti-set-tog '+(cfg.showIsland?'on':'off');
    }
  });

  // Drag — disabled when cfg.lockIsland is true
  // #8 FIX: clamp to viewport bounds using visual (post-zoom) dimensions
  let drag=false,dx=0,dy=0;
  island.addEventListener('mousedown',e=>{
    if(cfg.lockIsland||e.target.closest('button'))return;
    drag=true;const r=island.getBoundingClientRect();
    dx=e.clientX-r.left;dy=e.clientY-r.top;
    island.style.transition='none';island.style.cursor='grabbing';
  });
  document.addEventListener('mousemove',e=>{
    if(!drag)return;
    const r=island.getBoundingClientRect();
    const x=Math.max(0,Math.min(e.clientX-dx, window.innerWidth-r.width));
    const y=Math.max(0,Math.min(e.clientY-dy, window.innerHeight-r.height));
    island.style.left=x+'px';island.style.top=y+'px';
    island.style.bottom='auto';island.style.right='auto';island.style.transform='none';
  });
  document.addEventListener('mouseup',()=>{if(!drag)return;drag=false;island.style.transition='';island.style.cursor=''});

  // ═══════════════════════════════════════════
  //  §16  INIT
  // ═══════════════════════════════════════════
  renderSC();
  requestAnimationFrame(tick);
  fetchPrayer();
  fetchWeather();
  setInterval(fetchPrayer,3600000);
  setInterval(fetchWeather,1800000);
  setInterval(()=>{renderSC()},60000);

})();
