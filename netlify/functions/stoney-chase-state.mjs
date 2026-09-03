<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stoney Chase Plot Map</title>
<style>
:root {
  --bg:#f5f6f7; --card:#fff; --text:#1f2937; --muted:#6b7280;
  --line:#d1d5db; --accent:#2563eb; --ok:#15803d; --bad:#dc2626; --warn:#ca8a04;
}
*{box-sizing:border-box}
body{margin:0;font-family:Arial,Helvetica,sans-serif;background:var(--bg);color:var(--text)}
header{padding:18px 22px;background:#fff;border-bottom:1px solid var(--line);position:relative;padding-right:110px}
header h1{margin:0 0 5px;font-size:22px}
header p{margin:0;color:var(--muted);font-size:13px}
.wrap{display:grid;grid-template-columns:minmax(500px,1.7fr) minmax(330px,.8fr);gap:18px;padding:18px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px}
.mapwrap{position:relative;overflow:auto}
.mapstage{position:relative;width:100%;min-width:720px}
.mapstage img{display:block;width:100%;height:auto}
.mapstage svg{position:absolute;inset:0;width:100%;height:100%}
.lot{fill:rgba(37,99,235,.03);stroke:rgba(37,99,235,.25);stroke-width:1.1;cursor:pointer;vector-effect:non-scaling-stroke}
.lot:hover{fill:rgba(37,99,235,.14);stroke:var(--accent);stroke-width:2}
.lot.selected{fill:rgba(37,99,235,.23);stroke:var(--accent);stroke-width:3}
.lot.blocker{fill:rgba(220,38,38,.28);stroke:var(--bad);stroke-width:3}
.lot.restricted{fill:rgba(202,138,4,.13);stroke:var(--warn);stroke-width:1.7}
.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
label{display:block;font-size:12px;font-weight:700;margin:10px 0 5px}
input,select,textarea,button{font:inherit}
input,select,textarea{width:100%;padding:9px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#fff}
textarea{min-height:75px;resize:vertical}
button{border:0;border-radius:8px;padding:10px 12px;cursor:pointer;font-weight:700}
.primary{background:var(--accent);color:white}
.secondary{background:#e5e7eb;color:#111827}
.danger{background:#fee2e2;color:#991b1b}
.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.status{margin-top:12px;padding:11px;border-radius:8px;background:#f3f4f6;font-size:13px;line-height:1.45}
.status.ok{background:#dcfce7;color:#166534}
.status.bad{background:#fee2e2;color:#991b1b}
.small{font-size:12px;color:var(--muted);line-height:1.4}
.chiprow{display:flex;gap:6px;flex-wrap:wrap;margin:7px 0}
.chip{font-size:11px;padding:4px 7px;border-radius:999px;background:#f3f4f6;border:1px solid #e5e7eb}
.selSummary{font-size:13px;line-height:1.5}
h2{font-size:17px;margin:0 0 4px}
hr{border:0;border-top:1px solid #e5e7eb;margin:14px 0}
@media(max-width:900px){.wrap{grid-template-columns:1fr}}

  .v2-zoom-title{
    font-size:12px;
    font-weight:800;
    color:#475569;
    align-self:center;
    margin-left:4px;
  }

  #v2RestrictionMode{
    position:absolute;
    top:16px;
    right:22px;
    z-index:20;
  }

/* NEW COMMUNITY MAP — neutral clickable lots */
.new-map-cleanup{fill:#d8dbde;stroke:none;pointer-events:none}
.mapstage .lot{
  fill:#d8dbde;
  stroke:#8d9399;
  stroke-width:1.15;
  stroke-linejoin:round;
  stroke-linecap:round;
  vector-effect:non-scaling-stroke;
}
.mapstage .lot:hover{fill:#e7e9eb;stroke:#5f666d}




/* =========================================================
   QUICK LOT / BLOCK EDITOR — TOP OF FLOATING PANEL
   Visible only while Edit mode is unlocked.
   ========================================================= */
.v2-quick-lot-edit{
  display:none;
  margin:0 0 10px;
  padding:10px;
  border:1px solid #dfe3e6;
  border-top:3px solid #f2c94c;
  border-radius:9px;
  background:#fafafa;
}
.v2-quick-lot-edit.show{
  display:block;
}
.v2-quick-lot-edit .v2-title{
  margin-bottom:6px;
}
.v2-quick-lot-grid{
  display:grid;
  grid-template-columns:1fr 1fr auto;
  gap:7px;
  align-items:end;
}
.v2-quick-lot-grid label{
  margin-top:0;
}
.v2-quick-lot-grid input{
  padding:7px 8px;
  font-size:12px;
}
.v2-quick-save{
  padding:8px 10px;
  white-space:nowrap;
}
.v2-quick-restrictions{
  margin-top:10px;
  padding-top:9px;
  border-top:1px solid #e5e7eb;
}
.v2-quick-restriction-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:8px;
}
.v2-quick-restriction-head button{
  white-space:nowrap;
  padding:7px 9px;
  font-size:11px;
}
#v2RestrictionPickMode.active{
  background:#f2c94c;
  color:#111827;
}
#v2QuickChips{
  margin-top:7px;
}
@media(max-width:520px){
  .v2-quick-lot-grid{
    grid-template-columns:1fr 1fr;
  }
  .v2-quick-save{
    grid-column:1 / -1;
    width:100%;
  }
}


/* =========================================================
   MOVABLE FLOATING HOMESITE PANEL
   ========================================================= */
.v2-drag-handle{
  display:flex !important;
  align-items:center;
  justify-content:center;
  gap:8px;
  width:100%;
  box-sizing:border-box;
  margin:0 0 12px 0;
  padding:10px 12px;
  border:1px solid #d7b43b;
  border-radius:7px;
  background:#fff4c2;
  color:#5f4a00;
  font-size:11px;
  font-weight:900;
  letter-spacing:.08em;
  text-transform:uppercase;
  cursor:move !important;
  cursor:grab !important;
  user-select:none;
  touch-action:none;
  pointer-events:auto !important;
  position:relative;
  z-index:999;
}
.v2-drag-handle:hover{
  background:#f9e68c;
}
.v2-drag-handle:active{
  cursor:grabbing !important;
}
.v2-drag-grip{
  font-size:18px;
  line-height:1;
}
.v2-dragging{
  transition:none !important;
}


/* =========================================================
   SELECTED HOMESITE SUMMARY BAR + SCHEME PDF
   Added as a local-test prototype. Does not change shared/live mode.
   ========================================================= */
.v2-top-summary{
  display:none;
  align-items:stretch;
  gap:0;
  padding:0 22px;
  min-height:68px;
  background:#fff;
  border-bottom:1px solid #dfe3e6;
  box-shadow:0 2px 10px rgba(31,41,55,.04);
  position:relative;
  z-index:15;
}
.v2-top-summary.show{display:flex}
.v2-top-stat{
  min-width:126px;
  padding:13px 24px 12px 0;
  margin-right:24px;
  border-right:1px solid #dfe3e6;
  display:flex;
  flex-direction:column;
  justify-content:center;
}
.v2-top-stat.wide{min-width:185px}
.v2-top-label{
  font-size:10px;
  font-weight:800;
  letter-spacing:.055em;
  text-transform:uppercase;
  color:#6b7280;
  margin-bottom:4px;
}
.v2-top-value{
  font-size:14px;
  font-weight:800;
  color:#20242a;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  max-width:210px;
}
.v2-top-status{
  display:inline-flex;
  align-items:center;
  gap:6px;
}
.v2-top-status-dot{
  width:9px;
  height:9px;
  border-radius:50%;
  background:#a3a3a3;
  flex:none;
}
.v2-top-status-dot.pending{background:#2563eb}
.v2-top-status-dot.complete{background:#15803d}
.v2-top-actions{
  margin-left:auto;
  display:flex;
  align-items:center;
  gap:9px;
  padding:10px 0;
}
.v2-pdf-btn{
  display:inline-flex;
  align-items:center;
  gap:9px;
  min-height:42px;
  padding:10px 15px;
  border:1px solid #bfc5ca;
  border-radius:8px;
  background:#fff;
  color:#20242a;
  font-size:11px;
  font-weight:900;
  letter-spacing:.035em;
  text-transform:uppercase;
  cursor:pointer;
  box-shadow:0 1px 2px rgba(0,0,0,.04);
}
.v2-pdf-btn:hover:not(:disabled){background:#f8f7f4;border-color:#8f979e}
.v2-pdf-btn:disabled{opacity:.42;cursor:not-allowed}
.v2-pdf-icon{
  width:20px;
  height:20px;
  display:grid;
  place-items:center;
  border:1px solid currentColor;
  border-radius:4px;
  font-size:11px;
  line-height:1;
}
@media(max-width:1050px){
  .v2-top-summary{overflow-x:auto;padding-right:14px}
  .v2-top-stat{min-width:120px;margin-right:16px;padding-right:16px}
  .v2-top-actions{padding-right:4px}
}

</style>
</head>
<body>
<header>
  <h1>Stoney Chase</h1>
  <p>Exterior Control Map · Stoney Chase <span id="sharedDataStatus" style="margin-left:8px;font-size:11px;color:#6b7280;">• Connecting…</span></p>

  <button
    type="button"
    id="v2RestrictionMode">
    Edit
  </button>
</header>

<!-- =========================================================
     SELECTED HOMESITE SUMMARY BAR
     ========================================================= -->
<div class="v2-top-summary" id="v2TopSummary">
  <div class="v2-top-stat wide">
    <span class="v2-top-label">Homesite</span>
    <span class="v2-top-value" id="v2TopHomesite">—</span>
  </div>

  <div class="v2-top-stat wide">
    <span class="v2-top-label">Address</span>
    <span class="v2-top-value" id="v2TopAddress">—</span>
  </div>

  <div class="v2-top-stat">
    <span class="v2-top-label">Plan / Elevation</span>
    <span class="v2-top-value" id="v2TopPlanElevation">—</span>
  </div>

  <div class="v2-top-stat">
    <span class="v2-top-label">Scheme</span>
    <span class="v2-top-value" id="v2TopScheme">—</span>
  </div>

  <div class="v2-top-stat">
    <span class="v2-top-label">Status</span>
    <span class="v2-top-value v2-top-status">
      <span class="v2-top-status-dot" id="v2TopStatusDot"></span>
      <span id="v2TopStatus">Not Saved</span>
    </span>
  </div>

  <div class="v2-top-actions">
    <button type="button" class="v2-pdf-btn" id="v2GenerateSchemePdf">
      <span class="v2-pdf-icon">▣</span>
      Generate Scheme PDF
    </button>
  </div>
</div>

<div class="wrap">
  <section class="card mapwrap">
    <div class="mapstage">
      <img alt="Community map" src="data:image/png;base64,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">
      <svg viewBox="0 0 1477 664" preserveAspectRatio="xMidYMid meet">
        <g id="newMapCleanupLayer"><polygon class="new-map-cleanup" points="1229,525 1272,546 1288,559 1293,561 1294,563 1310,571 1313,571 1317,573 1324,574 1328,576 1359,576 1378,570 1385,569 1357,514 1349,516 1338,516 1329,513 1323,508 1320,507 1317,502 1256,472"></polygon><polygon class="new-map-cleanup" points="633,524 631,478 630,475 622,469 436,476 288,484 255,484 184,475 157,475 139,479 133,487 133,516 140,551 188,547 632,527"></polygon><polygon class="new-map-cleanup" points="666,471 664,477 665,515 666,516 666,522 669,526 699,525 700,526 738,528 739,529 746,529 761,533 765,533 784,540 787,540 789,542 816,552 830,559 847,570 851,571 852,573 871,585 887,600 890,601 904,615 908,615 954,574 910,539 908,539 905,535 890,524 888,524 886,521 867,507 865,507 861,503 840,491 837,491 833,488 811,479 808,479 805,477 779,470 749,466 748,465 719,465 717,464 716,465 674,466 669,468"></polygon><polygon class="new-map-cleanup" points="1051,484 1131,484 1148,488 1153,488 1171,497 1174,497 1176,499 1194,508 1196,508 1216,519 1218,519 1244,466 1214,451 1212,451 1203,446 1200,446 1199,444 1183,436 1157,428 1147,427 1146,426 1138,426 1137,425 1058,425 1057,450 1056,451 1055,465"></polygon><polygon class="new-map-cleanup" points="1281,359 1248,426 1249,431 1252,434 1268,442 1270,442 1290,453 1293,453 1294,455 1296,455 1311,463 1317,462 1327,453 1333,450 1341,448 1356,450 1369,458 1373,464 1378,476 1378,487 1376,495 1368,507 1396,562 1397,562 1419,541 1434,515 1437,495 1439,489 1439,478 1438,477 1437,461 1429,442 1428,437 1416,420 1392,399"></polygon><polygon class="new-map-cleanup" points="624,323 619,317 612,315 607,316 586,316 585,317 563,317 562,318 541,318 540,319 518,319 517,320 496,320 495,321 474,321 473,322 429,323 428,324 401,324 400,323 391,323 378,320 370,320 366,325 362,352 360,358 360,368 359,369 363,443 368,447 381,447 382,446 403,446 404,445 427,445 428,444 450,444 451,443 473,443 474,442 496,442 497,441 518,441 519,440 586,438 587,437 606,437 607,436 621,435 627,430 629,425 627,369 626,368 626,345 625,344 625,326"></polygon><polygon class="new-map-cleanup" points="920,314 915,307 907,304 864,304 863,305 843,305 842,306 820,306 819,307 797,307 796,308 774,308 773,309 751,309 750,310 667,313 659,319 657,326 662,426 669,433 744,432 745,433 764,434 765,435 783,437 791,440 810,444 830,451 874,473 882,472 890,465 897,455 897,453 900,450 913,421 920,389"></polygon><polygon class="new-map-cleanup" points="1058,392 1134,392 1135,393 1147,393 1173,398 1186,403 1189,403 1191,405 1193,405 1212,414 1217,413 1219,411 1277,294 1278,290 1277,287 1272,283 1260,279 1239,275 1219,275 1218,274 1158,272 1157,271 1060,271 1058,272"></polygon><polygon class="new-map-cleanup" points="362,170 304,159 271,335 255,391 158,379 132,388 77,385 43,402 32,427 30,458 38,488 40,521 50,571 107,557 100,515 100,490 91,473 91,460 98,447 110,439 128,439 140,445 178,442 253,451 325,449 329,446 328,349"></polygon><polygon class="new-map-cleanup" points="641,158 600,160 599,161 581,161 580,162 564,162 563,163 547,163 546,164 529,164 528,165 512,165 511,166 494,166 493,167 477,167 476,168 460,168 459,169 439,169 438,170 399,168 395,174 390,199 390,204 385,225 385,230 380,251 380,256 376,272 375,282 381,288 386,288 392,290 433,291 434,290 449,290 450,289 471,289 472,288 495,288 496,287 518,287 519,286 542,286 543,285 565,285 566,284 589,284 590,283 650,281 648,228 645,221"></polygon><polygon class="new-map-cleanup" points="1058,118 1058,238 1059,239 1174,239 1175,240 1194,240 1195,241 1213,241 1214,242 1232,242 1233,243 1254,244 1284,253 1287,253 1292,249 1302,219 1305,203 1305,197 1306,196 1305,164 1304,163 1300,124 1297,119 1295,118"></polygon><polygon class="new-map-cleanup" points="1012,118 958,118 953,123 951,400 947,421 940,443 932,460 914,486 912,491 912,498 915,503 966,542 969,539 984,494 987,489 1012,420"></polygon><polygon class="new-map-cleanup" points="919,121 915,118 877,118 876,119 859,120 824,127 819,127 808,130 803,130 797,132 792,132 781,135 776,135 770,137 765,137 754,140 738,142 727,145 722,145 711,148 706,148 695,151 657,157 659,197 660,198 660,214 663,224 663,234 664,235 665,280 731,278 732,277 753,277 754,276 777,276 778,275 801,275 802,274 824,274 825,273 848,273 849,272 909,272 915,270 918,267 921,259 921,245 920,244 920,123"></polygon><polygon class="new-map-cleanup" points="1012,26 855,27 640,66 418,78 421,137 651,125 868,86 1012,85"></polygon><polygon class="new-map-cleanup" points="1341,15 1310,15 1280,26 1058,26 1058,85 1291,85 1300,77 1311,73 1318,73 1323,74 1331,78 1339,86 1341,92"></polygon></g>
        <g id="newMapLotLayer"><polygon class="lot" data-id="L001" points="854,27 860,77 860,88 840,91 832,53 829,31" tabindex="0" aria-label="Homesite L001"></polygon><polygon class="lot" data-id="L002" points="879,25 882,87 861,88 854,26" tabindex="0" aria-label="Homesite L002"></polygon><polygon class="lot" data-id="L003" points="904,25 904,86 882,87 880,25" tabindex="0" aria-label="Homesite L003"></polygon><polygon class="lot" data-id="L004" points="925,25 925,86 904,86 904,25" tabindex="0" aria-label="Homesite L004"></polygon><polygon class="lot" data-id="L005" points="947,25 947,86 925,86 925,25" tabindex="0" aria-label="Homesite L005"></polygon><polygon class="lot" data-id="L006" points="969,25 969,86 947,86 947,25" tabindex="0" aria-label="Homesite L006"></polygon><polygon class="lot" data-id="L007" points="991,25 991,86 969,86 969,25" tabindex="0" aria-label="Homesite L007"></polygon><polygon class="lot" data-id="L008" points="1013,25 1013,86 991,86 991,25" tabindex="0" aria-label="Homesite L008"></polygon><polygon class="lot" data-id="L009" points="1082,25 1082,86 1057,86 1057,25" tabindex="0" aria-label="Homesite L009"></polygon><polygon class="lot" data-id="L010" points="1106,25 1106,86 1082,86 1082,25" tabindex="0" aria-label="Homesite L010"></polygon><polygon class="lot" data-id="L011" points="1131,25 1131,86 1106,86 1106,25" tabindex="0" aria-label="Homesite L011"></polygon><polygon class="lot" data-id="L012" points="1156,25 1156,86 1131,86 1131,25" tabindex="0" aria-label="Homesite L012"></polygon><polygon class="lot" data-id="L013" points="1180,25 1180,86 1156,86 1156,25" tabindex="0" aria-label="Homesite L013"></polygon><polygon class="lot" data-id="L014" points="1205,25 1205,86 1180,86 1180,25" tabindex="0" aria-label="Homesite L014"></polygon><polygon class="lot" data-id="L015" points="1230,25 1230,86 1205,86 1205,25" tabindex="0" aria-label="Homesite L015"></polygon><polygon class="lot" data-id="L016" points="1254,25 1254,86 1230,86 1230,25" tabindex="0" aria-label="Homesite L016"></polygon><polygon class="lot" data-id="L017" points="1279,25 1279,86 1254,86 1254,25" tabindex="0" aria-label="Homesite L017"></polygon><polygon class="lot" data-id="L018" points="1311,15 1311,75 1292,86 1279,86 1279,25 1306,15" tabindex="0" aria-label="Homesite L018"></polygon><polygon class="lot" data-id="L019" points="1311,14 1342,14 1342,88 1338,88 1311,74" tabindex="0" aria-label="Homesite L019"></polygon><polygon class="lot" data-id="L020" points="743,48 753,108 732,111 721,51 734,48" tabindex="0" aria-label="Homesite L020"></polygon><polygon class="lot" data-id="L021" points="764,44 775,104 753,107 743,47 756,44" tabindex="0" aria-label="Homesite L021"></polygon><polygon class="lot" data-id="L022" points="786,40 796,93 796,100 775,103 765,52 765,43 777,40" tabindex="0" aria-label="Homesite L022"></polygon><polygon class="lot" data-id="L023" points="807,36 818,96 796,99 786,39 799,36" tabindex="0" aria-label="Homesite L023"></polygon><polygon class="lot" data-id="L024" points="829,32 838,79 839,92 818,95 809,49 808,35 821,32" tabindex="0" aria-label="Homesite L024"></polygon><polygon class="lot" data-id="L025" points="592,68 595,129 573,130 570,69" tabindex="0" aria-label="Homesite L025"></polygon><polygon class="lot" data-id="L026" points="614,67 617,128 595,129 592,68" tabindex="0" aria-label="Homesite L026"></polygon><polygon class="lot" data-id="L027" points="635,65 639,126 617,128 614,66" tabindex="0" aria-label="Homesite L027"></polygon><polygon class="lot" data-id="L028" points="656,63 667,124 639,126 636,65" tabindex="0" aria-label="Homesite L028"></polygon><polygon class="lot" data-id="L029" points="678,59 688,112 688,120 667,123 657,71 657,62" tabindex="0" aria-label="Homesite L029"></polygon><polygon class="lot" data-id="L030" points="700,56 710,116 689,119 678,59 691,56" tabindex="0" aria-label="Homesite L030"></polygon><polygon class="lot" data-id="L031" points="721,52 732,112 710,115 700,62 700,55 713,52" tabindex="0" aria-label="Homesite L031"></polygon><polygon class="lot" data-id="L032" points="438,77 442,138 420,138 417,77" tabindex="0" aria-label="Homesite L032"></polygon><polygon class="lot" data-id="L033" points="460,75 464,137 442,138 439,76" tabindex="0" aria-label="Homesite L033"></polygon><polygon class="lot" data-id="L034" points="482,74 486,135 464,136 460,75" tabindex="0" aria-label="Homesite L034"></polygon><polygon class="lot" data-id="L035" points="504,73 507,134 486,135 482,74" tabindex="0" aria-label="Homesite L035"></polygon><polygon class="lot" data-id="L036" points="526,72 529,133 508,134 504,73" tabindex="0" aria-label="Homesite L036"></polygon><polygon class="lot" data-id="L037" points="548,70 551,132 529,133 526,71" tabindex="0" aria-label="Homesite L037"></polygon><polygon class="lot" data-id="L038" points="570,69 573,130 551,131 548,70" tabindex="0" aria-label="Homesite L038"></polygon><polygon class="lot" data-id="L039" points="921,122 921,145 860,145 860,119 876,117 916,117" tabindex="0" aria-label="Homesite L039"></polygon><polygon class="lot" data-id="L040" points="1013,117 1013,151 952,151 952,122 955,118" tabindex="0" aria-label="Homesite L040"></polygon><polygon class="lot" data-id="L041" points="1089,117 1089,178 1057,178 1057,117" tabindex="0" aria-label="Homesite L041"></polygon><polygon class="lot" data-id="L042" points="1115,117 1115,178 1089,178 1089,117" tabindex="0" aria-label="Homesite L042"></polygon><polygon class="lot" data-id="L043" points="1141,117 1141,178 1115,178 1115,117" tabindex="0" aria-label="Homesite L043"></polygon><polygon class="lot" data-id="L044" points="1167,117 1167,179 1141,178 1141,117" tabindex="0" aria-label="Homesite L044"></polygon><polygon class="lot" data-id="L045" points="1192,117 1192,180 1167,179 1167,117" tabindex="0" aria-label="Homesite L045"></polygon><polygon class="lot" data-id="L046" points="1218,117 1218,181 1192,180 1192,117" tabindex="0" aria-label="Homesite L046"></polygon><polygon class="lot" data-id="L047" points="1244,117 1244,182 1218,181 1218,117" tabindex="0" aria-label="Homesite L047"></polygon><polygon class="lot" data-id="L048" points="1270,117 1270,184 1244,183 1244,117" tabindex="0" aria-label="Homesite L048"></polygon><polygon class="lot" data-id="L049" points="1296,117 1300,120 1307,172 1307,187 1270,184 1270,117" tabindex="0" aria-label="Homesite L049"></polygon><polygon class="lot" data-id="L050" points="808,128 828,126 843,212 821,212 806,134 806,129" tabindex="0" aria-label="Homesite L050"></polygon><polygon class="lot" data-id="L051" points="860,120 860,211 843,211 828,132 828,125 852,120" tabindex="0" aria-label="Homesite L051"></polygon><polygon class="lot" data-id="L052" points="921,145 921,172 860,172 860,145" tabindex="0" aria-label="Homesite L052"></polygon><polygon class="lot" data-id="L053" points="1013,151 1013,177 952,177 952,151" tabindex="0" aria-label="Homesite L053"></polygon><polygon class="lot" data-id="L054" points="303,158 363,169 363,177 360,192 353,193 301,183 300,174" tabindex="0" aria-label="Homesite L054"></polygon><polygon class="lot" data-id="L055" points="678,152 689,150 698,150 710,211 710,218 688,218 677,159" tabindex="0" aria-label="Homesite L055"></polygon><polygon class="lot" data-id="L056" points="700,148 720,145 731,204 732,217 710,217 699,158" tabindex="0" aria-label="Homesite L056"></polygon><polygon class="lot" data-id="L057" points="721,144 741,141 754,208 754,216 732,215 720,151" tabindex="0" aria-label="Homesite L057"></polygon><polygon class="lot" data-id="L058" points="743,140 763,137 775,201 776,215 754,214 742,149" tabindex="0" aria-label="Homesite L058"></polygon><polygon class="lot" data-id="L059" points="764,136 775,134 785,135 799,214 777,214 763,142" tabindex="0" aria-label="Homesite L059"></polygon><polygon class="lot" data-id="L060" points="786,132 806,129 821,213 799,213 785,141" tabindex="0" aria-label="Homesite L060"></polygon><polygon class="lot" data-id="L061" points="921,172 921,196 860,196 860,172" tabindex="0" aria-label="Homesite L061"></polygon><polygon class="lot" data-id="L062" points="1013,177 1013,202 952,201 952,177" tabindex="0" aria-label="Homesite L062"></polygon><polygon class="lot" data-id="L063" points="298,184 306,183 359,193 355,217 347,217 295,207" tabindex="0" aria-label="Homesite L063"></polygon><polygon class="lot" data-id="L064" points="424,168 422,230 407,231 385,227 385,219 394,173 398,167" tabindex="0" aria-label="Homesite L064"></polygon><polygon class="lot" data-id="L065" points="445,168 449,229 422,230 424,169" tabindex="0" aria-label="Homesite L065"></polygon><polygon class="lot" data-id="L066" points="467,167 471,228 449,229 445,168" tabindex="0" aria-label="Homesite L066"></polygon><polygon class="lot" data-id="L067" points="489,166 492,227 471,228 467,167" tabindex="0" aria-label="Homesite L067"></polygon><polygon class="lot" data-id="L068" points="511,165 514,226 492,227 489,166" tabindex="0" aria-label="Homesite L068"></polygon><polygon class="lot" data-id="L069" points="533,163 536,225 514,226 511,164" tabindex="0" aria-label="Homesite L069"></polygon><polygon class="lot" data-id="L070" points="555,162 558,224 536,225 533,163" tabindex="0" aria-label="Homesite L070"></polygon><polygon class="lot" data-id="L071" points="577,161 580,223 558,224 555,162" tabindex="0" aria-label="Homesite L071"></polygon><polygon class="lot" data-id="L072" points="599,160 602,222 580,223 577,161" tabindex="0" aria-label="Homesite L072"></polygon><polygon class="lot" data-id="L073" points="620,158 624,221 602,222 599,159" tabindex="0" aria-label="Homesite L073"></polygon><polygon class="lot" data-id="L074" points="642,157 646,220 624,221 621,158" tabindex="0" aria-label="Homesite L074"></polygon><polygon class="lot" data-id="L075" points="676,153 684,191 688,219 660,220 656,156" tabindex="0" aria-label="Homesite L075"></polygon><polygon class="lot" data-id="L076" points="294,207 306,208 353,217 354,224 350,241 342,241 290,231" tabindex="0" aria-label="Homesite L076"></polygon><polygon class="lot" data-id="L077" points="921,196 921,220 860,220 860,196" tabindex="0" aria-label="Homesite L077"></polygon><polygon class="lot" data-id="L078" points="1013,202 1013,226 952,226 952,201" tabindex="0" aria-label="Homesite L078"></polygon><polygon class="lot" data-id="L079" points="1083,178 1083,240 1058,240 1057,178" tabindex="0" aria-label="Homesite L079"></polygon><polygon class="lot" data-id="L080" points="1109,178 1109,240 1083,240 1083,178" tabindex="0" aria-label="Homesite L080"></polygon><polygon class="lot" data-id="L081" points="1134,178 1134,240 1109,240 1109,178" tabindex="0" aria-label="Homesite L081"></polygon><polygon class="lot" data-id="L082" points="1160,178 1160,240 1134,240 1134,178" tabindex="0" aria-label="Homesite L082"></polygon><polygon class="lot" data-id="L083" points="1188,180 1185,241 1160,240 1160,179" tabindex="0" aria-label="Homesite L083"></polygon><polygon class="lot" data-id="L084" points="1214,181 1211,242 1185,241 1188,180" tabindex="0" aria-label="Homesite L084"></polygon><polygon class="lot" data-id="L085" points="1214,181 1240,182 1237,244 1211,242" tabindex="0" aria-label="Homesite L085"></polygon><polygon class="lot" data-id="L086" points="1273,184 1261,246 1237,244 1240,183" tabindex="0" aria-label="Homesite L086"></polygon><polygon class="lot" data-id="L087" points="1307,187 1307,197 1303,220 1293,250 1288,254 1283,254 1261,247 1261,241 1273,185" tabindex="0" aria-label="Homesite L087"></polygon><polygon class="lot" data-id="L088" points="860,211 862,273 840,274 837,212" tabindex="0" aria-label="Homesite L088"></polygon><polygon class="lot" data-id="L089" points="921,220 921,244 861,244 860,220" tabindex="0" aria-label="Homesite L089"></polygon><polygon class="lot" data-id="L090" points="1013,226 1013,251 951,250 952,226" tabindex="0" aria-label="Homesite L090"></polygon><polygon class="lot" data-id="L091" points="289,231 295,231 349,242 349,250 346,265 341,266 286,255" tabindex="0" aria-label="Homesite L091"></polygon><polygon class="lot" data-id="L092" points="384,227 407,230 403,291 391,291 380,289 374,283 375,271" tabindex="0" aria-label="Homesite L092"></polygon><polygon class="lot" data-id="L093" points="451,229 454,290 432,291 430,230" tabindex="0" aria-label="Homesite L093"></polygon><polygon class="lot" data-id="L094" points="473,228 476,289 454,290 451,229" tabindex="0" aria-label="Homesite L094"></polygon><polygon class="lot" data-id="L095" points="495,227 497,288 476,289 473,228" tabindex="0" aria-label="Homesite L095"></polygon><polygon class="lot" data-id="L096" points="517,226 519,288 497,288 495,227" tabindex="0" aria-label="Homesite L096"></polygon><polygon class="lot" data-id="L097" points="539,225 541,287 519,287 517,226" tabindex="0" aria-label="Homesite L097"></polygon><polygon class="lot" data-id="L098" points="561,224 563,286 541,286 539,225" tabindex="0" aria-label="Homesite L098"></polygon><polygon class="lot" data-id="L099" points="583,223 585,285 563,285 561,224" tabindex="0" aria-label="Homesite L099"></polygon><polygon class="lot" data-id="L100" points="605,222 607,284 585,285 583,223" tabindex="0" aria-label="Homesite L100"></polygon><polygon class="lot" data-id="L101" points="626,221 628,283 607,284 605,222" tabindex="0" aria-label="Homesite L101"></polygon><polygon class="lot" data-id="L102" points="647,221 649,227 651,282 628,283 626,221" tabindex="0" aria-label="Homesite L102"></polygon><polygon class="lot" data-id="L103" points="684,219 686,280 664,281 661,220" tabindex="0" aria-label="Homesite L103"></polygon><polygon class="lot" data-id="L104" points="706,218 708,280 686,280 684,219" tabindex="0" aria-label="Homesite L104"></polygon><polygon class="lot" data-id="L105" points="728,217 730,279 708,279 706,218" tabindex="0" aria-label="Homesite L105"></polygon><polygon class="lot" data-id="L106" points="749,216 752,278 730,278 728,217" tabindex="0" aria-label="Homesite L106"></polygon><polygon class="lot" data-id="L107" points="772,215 774,277 752,277 750,216" tabindex="0" aria-label="Homesite L107"></polygon><polygon class="lot" data-id="L108" points="793,214 796,276 774,277 772,215" tabindex="0" aria-label="Homesite L108"></polygon><polygon class="lot" data-id="L109" points="815,213 818,275 796,276 793,214" tabindex="0" aria-label="Homesite L109"></polygon><polygon class="lot" data-id="L110" points="837,212 840,274 818,275 815,213" tabindex="0" aria-label="Homesite L110"></polygon><polygon class="lot" data-id="L111" points="922,244 921,264 919,268 914,272 862,273 861,244" tabindex="0" aria-label="Homesite L111"></polygon><polygon class="lot" data-id="L112" points="285,255 345,266 341,290 335,290 281,279" tabindex="0" aria-label="Homesite L112"></polygon><polygon class="lot" data-id="L113" points="429,230 432,292 403,292 407,231" tabindex="0" aria-label="Homesite L113"></polygon><polygon class="lot" data-id="L114" points="951,250 1013,251 1013,276 951,275" tabindex="0" aria-label="Homesite L114"></polygon><polygon class="lot" data-id="L115" points="280,280 288,280 340,290 336,314 329,314 277,304 276,299" tabindex="0" aria-label="Homesite L115"></polygon><polygon class="lot" data-id="L116" points="1013,276 1013,300 951,300 951,275" tabindex="0" aria-label="Homesite L116"></polygon><polygon class="lot" data-id="L117" points="1013,300 1013,328 951,327 951,300" tabindex="0" aria-label="Homesite L117"></polygon><polygon class="lot" data-id="L118" points="1082,270 1082,332 1057,332 1057,271" tabindex="0" aria-label="Homesite L118"></polygon><polygon class="lot" data-id="L119" points="1106,270 1106,332 1082,332 1082,270" tabindex="0" aria-label="Homesite L119"></polygon><polygon class="lot" data-id="L120" points="1131,270 1131,332 1106,332 1106,270" tabindex="0" aria-label="Homesite L120"></polygon><polygon class="lot" data-id="L121" points="1156,270 1156,332 1131,332 1131,270" tabindex="0" aria-label="Homesite L121"></polygon><polygon class="lot" data-id="L122" points="1180,271 1179,335 1170,335 1156,332 1156,271" tabindex="0" aria-label="Homesite L122"></polygon><polygon class="lot" data-id="L123" points="1181,272 1205,273 1202,341 1179,336" tabindex="0" aria-label="Homesite L123"></polygon><polygon class="lot" data-id="L124" points="1205,273 1230,274 1226,346 1220,346 1202,341" tabindex="0" aria-label="Homesite L124"></polygon><polygon class="lot" data-id="L125" points="1230,274 1254,276 1273,282 1278,286 1278,295 1250,351 1242,351 1226,347" tabindex="0" aria-label="Homesite L125"></polygon><polygon class="lot" data-id="L126" points="275,304 283,304 335,314 332,338 324,338 272,328" tabindex="0" aria-label="Homesite L126"></polygon><polygon class="lot" data-id="L127" points="921,313 921,332 860,332 859,330 858,304 908,303 916,306" tabindex="0" aria-label="Homesite L127"></polygon><polygon class="lot" data-id="L128" points="271,328 277,328 331,339 328,364 264,361 264,354" tabindex="0" aria-label="Homesite L128"></polygon><polygon class="lot" data-id="L129" points="486,320 489,381 467,382 464,321" tabindex="0" aria-label="Homesite L129"></polygon><polygon class="lot" data-id="L130" points="508,319 511,380 489,381 486,320" tabindex="0" aria-label="Homesite L130"></polygon><polygon class="lot" data-id="L131" points="530,318 532,379 511,380 508,319" tabindex="0" aria-label="Homesite L131"></polygon><polygon class="lot" data-id="L132" points="552,317 554,378 532,379 530,318" tabindex="0" aria-label="Homesite L132"></polygon><polygon class="lot" data-id="L133" points="574,316 576,377 554,378 552,317" tabindex="0" aria-label="Homesite L133"></polygon><polygon class="lot" data-id="L134" points="596,315 598,376 576,377 574,316" tabindex="0" aria-label="Homesite L134"></polygon><polygon class="lot" data-id="L135" points="620,316 624,320 626,325 628,375 598,376 596,315 613,314" tabindex="0" aria-label="Homesite L135"></polygon><polygon class="lot" data-id="L136" points="683,312 686,373 658,374 656,330 657,320 662,314 666,312" tabindex="0" aria-label="Homesite L136"></polygon><polygon class="lot" data-id="L137" points="705,311 708,372 686,373 683,311" tabindex="0" aria-label="Homesite L137"></polygon><polygon class="lot" data-id="L138" points="727,310 730,371 708,372 705,310" tabindex="0" aria-label="Homesite L138"></polygon><polygon class="lot" data-id="L139" points="749,309 751,370 730,371 727,309" tabindex="0" aria-label="Homesite L139"></polygon><polygon class="lot" data-id="L140" points="771,308 774,369 752,370 749,309" tabindex="0" aria-label="Homesite L140"></polygon><polygon class="lot" data-id="L141" points="793,307 795,368 774,369 771,308" tabindex="0" aria-label="Homesite L141"></polygon><polygon class="lot" data-id="L142" points="815,306 817,367 796,368 793,307" tabindex="0" aria-label="Homesite L142"></polygon><polygon class="lot" data-id="L143" points="837,305 839,366 817,367 815,306" tabindex="0" aria-label="Homesite L143"></polygon><polygon class="lot" data-id="L144" points="858,304 861,363 860,365 854,366 839,366 837,305" tabindex="0" aria-label="Homesite L144"></polygon><polygon class="lot" data-id="L145" points="921,332 921,357 861,356 860,332" tabindex="0" aria-label="Homesite L145"></polygon><polygon class="lot" data-id="L146" points="1013,328 1013,350 951,349 951,327" tabindex="0" aria-label="Homesite L146"></polygon><polygon class="lot" data-id="L147" points="399,322 393,386 359,387 359,357 366,322 369,319" tabindex="0" aria-label="Homesite L147"></polygon><polygon class="lot" data-id="L148" points="420,323 423,384 393,385 399,323" tabindex="0" aria-label="Homesite L148"></polygon><polygon class="lot" data-id="L149" points="442,322 445,383 423,384 420,323" tabindex="0" aria-label="Homesite L149"></polygon><polygon class="lot" data-id="L150" points="464,321 467,382 445,383 443,322" tabindex="0" aria-label="Homesite L150"></polygon><polygon class="lot" data-id="L151" points="1013,350 1013,374 951,374 951,349" tabindex="0" aria-label="Homesite L151"></polygon><polygon class="lot" data-id="L152" points="1082,332 1082,393 1057,393 1057,332" tabindex="0" aria-label="Homesite L152"></polygon><polygon class="lot" data-id="L153" points="1106,332 1106,393 1082,393 1082,332" tabindex="0" aria-label="Homesite L153"></polygon><polygon class="lot" data-id="L154" points="1131,332 1131,393 1106,393 1106,332" tabindex="0" aria-label="Homesite L154"></polygon><polygon class="lot" data-id="L155" points="1171,334 1171,341 1160,396 1131,393 1131,332 1159,332" tabindex="0" aria-label="Homesite L155"></polygon><polygon class="lot" data-id="L156" points="1172,335 1210,343 1210,349 1189,404 1160,397" tabindex="0" aria-label="Homesite L156"></polygon><polygon class="lot" data-id="L157" points="256,384 263,361 328,365 328,389 265,391 256,390" tabindex="0" aria-label="Homesite L157"></polygon><polygon class="lot" data-id="L158" points="855,377 861,356 921,357 921,381 855,381" tabindex="0" aria-label="Homesite L158"></polygon><polygon class="lot" data-id="L159" points="1247,351 1248,356 1218,414 1211,415 1190,406 1190,399 1211,344" tabindex="0" aria-label="Homesite L159"></polygon><polygon class="lot" data-id="L160" points="687,373 689,434 668,434 662,429 660,422 659,374" tabindex="0" aria-label="Homesite L160"></polygon><polygon class="lot" data-id="L161" points="712,372 714,433 690,434 687,373" tabindex="0" aria-label="Homesite L161"></polygon><polygon class="lot" data-id="L162" points="736,371 739,433 714,433 712,372" tabindex="0" aria-label="Homesite L162"></polygon><polygon class="lot" data-id="L163" points="761,370 763,435 739,433 737,371" tabindex="0" aria-label="Homesite L163"></polygon><polygon class="lot" data-id="L164" points="793,368 787,437 778,438 764,436 761,370" tabindex="0" aria-label="Homesite L164"></polygon><polygon class="lot" data-id="L165" points="823,367 823,374 809,444 802,444 787,440 787,427 793,369" tabindex="0" aria-label="Homesite L165"></polygon><polygon class="lot" data-id="L166" points="858,365 858,371 831,452 827,452 810,446 810,437 823,368 831,366" tabindex="0" aria-label="Homesite L166"></polygon><polygon class="lot" data-id="L167" points="921,381 920,396 913,423 907,423 848,403 848,398 854,381" tabindex="0" aria-label="Homesite L167"></polygon><polygon class="lot" data-id="L168" points="1013,374 1013,403 950,398 951,374" tabindex="0" aria-label="Homesite L168"></polygon><polygon class="lot" data-id="L169" points="1284,358 1306,366 1306,372 1271,443 1267,443 1251,435 1247,430 1247,425 1280,358" tabindex="0" aria-label="Homesite L169"></polygon><polygon class="lot" data-id="L170" points="42,401 74,385 78,385 106,439 106,443 95,454 91,454 32,427 32,423" tabindex="0" aria-label="Homesite L170"></polygon><polygon class="lot" data-id="L171" points="79,384 131,387 125,439 110,441 105,440 79,388" tabindex="0" aria-label="Homesite L171"></polygon><polygon class="lot" data-id="L172" points="156,380 149,445 139,446 125,440 131,387 150,380" tabindex="0" aria-label="Homesite L172"></polygon><polygon class="lot" data-id="L173" points="181,381 174,443 149,444 157,379" tabindex="0" aria-label="Homesite L173"></polygon><polygon class="lot" data-id="L174" points="205,384 205,395 199,445 174,443 181,382" tabindex="0" aria-label="Homesite L174"></polygon><polygon class="lot" data-id="L175" points="206,385 230,387 223,448 199,445 199,436" tabindex="0" aria-label="Homesite L175"></polygon><polygon class="lot" data-id="L176" points="230,387 254,390 254,401 247,450 223,448" tabindex="0" aria-label="Homesite L176"></polygon><polygon class="lot" data-id="L177" points="300,390 303,451 278,452 275,391" tabindex="0" aria-label="Homesite L177"></polygon><polygon class="lot" data-id="L178" points="329,389 331,445 326,450 303,451 300,390" tabindex="0" aria-label="Homesite L178"></polygon><polygon class="lot" data-id="L179" points="393,386 396,447 367,448 362,444 361,440 359,387" tabindex="0" aria-label="Homesite L179"></polygon><polygon class="lot" data-id="L180" points="420,384 420,446 396,447 393,386" tabindex="0" aria-label="Homesite L180"></polygon><polygon class="lot" data-id="L181" points="443,383 445,445 420,446 420,384" tabindex="0" aria-label="Homesite L181"></polygon><polygon class="lot" data-id="L182" points="467,382 469,444 445,445 443,383" tabindex="0" aria-label="Homesite L182"></polygon><polygon class="lot" data-id="L183" points="492,381 494,443 469,444 467,382" tabindex="0" aria-label="Homesite L183"></polygon><polygon class="lot" data-id="L184" points="517,380 519,442 494,442 492,381" tabindex="0" aria-label="Homesite L184"></polygon><polygon class="lot" data-id="L185" points="541,379 543,441 519,441 517,380" tabindex="0" aria-label="Homesite L185"></polygon><polygon class="lot" data-id="L186" points="566,378 568,439 544,440 541,379" tabindex="0" aria-label="Homesite L186"></polygon><polygon class="lot" data-id="L187" points="591,377 593,438 568,439 566,378" tabindex="0" aria-label="Homesite L187"></polygon><polygon class="lot" data-id="L188" points="628,375 630,426 628,431 624,435 619,437 593,438 591,377" tabindex="0" aria-label="Homesite L188"></polygon><polygon class="lot" data-id="L189" points="950,398 1013,403 1013,421 1008,434 1001,434 946,421" tabindex="0" aria-label="Homesite L189"></polygon><polygon class="lot" data-id="L190" points="1330,375 1330,379 1293,454 1289,454 1271,445 1271,440 1306,369 1311,368" tabindex="0" aria-label="Homesite L190"></polygon><polygon class="lot" data-id="L191" points="1353,383 1353,388 1316,463 1310,464 1293,456 1294,449 1330,377 1336,377" tabindex="0" aria-label="Homesite L191"></polygon><polygon class="lot" data-id="L192" points="1375,391 1376,397 1351,448 1323,458 1319,458 1319,454 1353,386 1359,385" tabindex="0" aria-label="Homesite L192"></polygon><polygon class="lot" data-id="L193" points="255,390 275,391 278,452 248,451 248,440" tabindex="0" aria-label="Homesite L193"></polygon><polygon class="lot" data-id="L194" points="846,404 853,404 910,423 911,429 901,451 894,452 841,425 841,419" tabindex="0" aria-label="Homesite L194"></polygon><polygon class="lot" data-id="L195" points="1381,393 1393,398 1412,414 1412,418 1370,458 1366,458 1352,451 1351,445 1377,393" tabindex="0" aria-label="Homesite L195"></polygon><polygon class="lot" data-id="L196" points="31,427 35,427 93,454 92,472 81,472 31,465 29,459" tabindex="0" aria-label="Homesite L196"></polygon><polygon class="lot" data-id="L197" points="839,426 844,426 896,452 896,459 885,472 880,474 873,474 832,454 831,448" tabindex="0" aria-label="Homesite L197"></polygon><polygon class="lot" data-id="L198" points="945,421 950,421 1005,434 1006,440 997,464 992,464 941,444 940,437" tabindex="0" aria-label="Homesite L198"></polygon><polygon class="lot" data-id="L199" points="1081,424 1081,485 1050,485 1057,424" tabindex="0" aria-label="Homesite L199"></polygon><polygon class="lot" data-id="L200" points="1106,424 1106,485 1081,485 1081,424" tabindex="0" aria-label="Homesite L200"></polygon><polygon class="lot" data-id="L201" points="1133,424 1130,485 1106,485 1106,424" tabindex="0" aria-label="Homesite L201"></polygon><polygon class="lot" data-id="L202" points="1133,424 1147,425 1170,430 1169,440 1153,489 1147,489 1130,485" tabindex="0" aria-label="Homesite L202"></polygon><polygon class="lot" data-id="L203" points="1415,417 1429,436 1438,460 1438,464 1389,474 1376,475 1370,463 1370,457 1411,417" tabindex="0" aria-label="Homesite L203"></polygon><polygon class="lot" data-id="L204" points="937,445 944,444 995,464 995,471 987,492 982,493 930,466 929,461" tabindex="0" aria-label="Homesite L204"></polygon><polygon class="lot" data-id="L205" points="1176,432 1200,443 1200,447 1175,498 1170,498 1153,490 1153,486 1170,433" tabindex="0" aria-label="Homesite L205"></polygon><polygon class="lot" data-id="L206" points="1204,445 1221,453 1222,458 1197,509 1193,509 1175,500 1175,495 1200,445" tabindex="0" aria-label="Homesite L206"></polygon><polygon class="lot" data-id="L207" points="32,466 43,466 93,473 100,486 101,493 37,495" tabindex="0" aria-label="Homesite L207"></polygon><polygon class="lot" data-id="L208" points="716,464 718,527 693,526 691,464" tabindex="0" aria-label="Homesite L208"></polygon><polygon class="lot" data-id="L209" points="747,464 742,530 718,528 716,464" tabindex="0" aria-label="Homesite L209"></polygon><polygon class="lot" data-id="L210" points="1227,456 1243,464 1244,470 1219,520 1215,520 1197,511 1197,506 1222,456" tabindex="0" aria-label="Homesite L210"></polygon><polygon class="lot" data-id="L211" points="1439,464 1440,490 1435,516 1428,516 1375,495 1378,475" tabindex="0" aria-label="Homesite L211"></polygon><polygon class="lot" data-id="L212" points="101,493 101,514 47,524 40,524 39,522 37,495" tabindex="0" aria-label="Homesite L212"></polygon><polygon class="lot" data-id="L213" points="182,474 174,549 139,552 132,517 132,486 134,482 138,478 149,475" tabindex="0" aria-label="Homesite L213"></polygon><polygon class="lot" data-id="L214" points="207,477 199,547 188,549 174,549 182,475" tabindex="0" aria-label="Homesite L214"></polygon><polygon class="lot" data-id="L215" points="329,481 331,542 307,543 304,482" tabindex="0" aria-label="Homesite L215"></polygon><polygon class="lot" data-id="L216" points="353,480 356,541 331,542 329,481" tabindex="0" aria-label="Homesite L216"></polygon><polygon class="lot" data-id="L217" points="378,479 381,540 356,541 353,480" tabindex="0" aria-label="Homesite L217"></polygon><polygon class="lot" data-id="L218" points="403,477 405,539 381,540 378,478" tabindex="0" aria-label="Homesite L218"></polygon><polygon class="lot" data-id="L219" points="427,476 430,538 405,539 403,477" tabindex="0" aria-label="Homesite L219"></polygon><polygon class="lot" data-id="L220" points="452,475 454,536 430,537 427,476" tabindex="0" aria-label="Homesite L220"></polygon><polygon class="lot" data-id="L221" points="476,474 479,535 454,536 452,475" tabindex="0" aria-label="Homesite L221"></polygon><polygon class="lot" data-id="L222" points="501,473 503,534 479,535 476,474" tabindex="0" aria-label="Homesite L222"></polygon><polygon class="lot" data-id="L223" points="525,472 528,533 504,534 501,473" tabindex="0" aria-label="Homesite L223"></polygon><polygon class="lot" data-id="L224" points="551,471 552,532 528,533 526,472" tabindex="0" aria-label="Homesite L224"></polygon><polygon class="lot" data-id="L225" points="575,470 577,531 553,532 551,470" tabindex="0" aria-label="Homesite L225"></polygon><polygon class="lot" data-id="L226" points="600,469 601,530 578,531 575,469" tabindex="0" aria-label="Homesite L226"></polygon><polygon class="lot" data-id="L227" points="626,469 631,474 633,484 633,528 602,530 600,468" tabindex="0" aria-label="Homesite L227"></polygon><polygon class="lot" data-id="L228" points="691,465 693,526 668,527 665,523 663,476 665,470 673,465" tabindex="0" aria-label="Homesite L228"></polygon><polygon class="lot" data-id="L229" points="747,465 756,465 778,469 765,534 742,530" tabindex="0" aria-label="Homesite L229"></polygon><polygon class="lot" data-id="L230" points="778,470 784,470 808,477 808,481 787,541 783,541 765,535" tabindex="0" aria-label="Homesite L230"></polygon><polygon class="lot" data-id="L231" points="812,478 836,488 836,494 810,548 804,549 788,543 788,536 808,478" tabindex="0" aria-label="Homesite L231"></polygon><polygon class="lot" data-id="L232" points="926,466 932,466 985,494 985,498 969,542 964,542 919,508 912,501 912,487" tabindex="0" aria-label="Homesite L232"></polygon><polygon class="lot" data-id="L233" points="1259,472 1275,480 1276,485 1251,535 1246,535 1230,527 1229,522 1254,472" tabindex="0" aria-label="Homesite L233"></polygon><polygon class="lot" data-id="L234" points="102,515 104,535 52,548 44,548 41,533 42,524 96,514" tabindex="0" aria-label="Homesite L234"></polygon><polygon class="lot" data-id="L235" points="231,480 224,546 199,548 200,530 207,477" tabindex="0" aria-label="Homesite L235"></polygon><polygon class="lot" data-id="L236" points="255,482 257,545 224,547 231,480" tabindex="0" aria-label="Homesite L236"></polygon><polygon class="lot" data-id="L237" points="279,483 282,544 258,545 255,483" tabindex="0" aria-label="Homesite L237"></polygon><polygon class="lot" data-id="L238" points="304,482 307,543 282,544 280,483" tabindex="0" aria-label="Homesite L238"></polygon><polygon class="lot" data-id="L239" points="841,490 864,504 864,508 831,559 826,559 811,552 810,547 837,490" tabindex="0" aria-label="Homesite L239"></polygon><polygon class="lot" data-id="L240" points="1281,483 1298,491 1298,496 1274,545 1268,546 1252,538 1251,533 1276,483" tabindex="0" aria-label="Homesite L240"></polygon><polygon class="lot" data-id="L241" points="1304,494 1318,501 1319,509 1294,560 1289,561 1273,549 1273,544 1298,494" tabindex="0" aria-label="Homesite L241"></polygon><polygon class="lot" data-id="L242" points="1374,495 1381,496 1433,517 1433,521 1420,542 1399,562 1394,561 1368,510 1368,504" tabindex="0" aria-label="Homesite L242"></polygon><polygon class="lot" data-id="L243" points="868,506 887,520 888,525 852,571 846,571 831,562 831,557 864,506" tabindex="0" aria-label="Homesite L243"></polygon><polygon class="lot" data-id="L244" points="1319,507 1324,507 1339,515 1331,576 1324,576 1309,572 1293,564 1293,560" tabindex="0" aria-label="Homesite L244"></polygon><polygon class="lot" data-id="L245" points="105,536 108,551 107,559 57,571 48,570 45,549 100,535" tabindex="0" aria-label="Homesite L245"></polygon><polygon class="lot" data-id="L246" points="892,524 907,535 907,541 872,585 868,585 851,574 851,570 887,524" tabindex="0" aria-label="Homesite L246"></polygon><polygon class="lot" data-id="L247" points="1358,513 1385,565 1385,570 1360,577 1331,577 1331,569 1339,515" tabindex="0" aria-label="Homesite L247"></polygon><polygon class="lot" data-id="L248" points="912,539 927,551 927,555 891,601 886,601 872,588 872,584 907,539" tabindex="0" aria-label="Homesite L248"></polygon><polygon class="lot" data-id="L249" points="932,554 954,572 954,576 909,616 903,616 891,605 891,600 927,554" tabindex="0" aria-label="Homesite L249"></polygon></g>
      </svg>
    </div>
    <p class="small">
      Yellow outlines = temporary restricted/conflict-check zone for the selected lot.
      Red = a lot causing a conflict. 
    </p>
  </section>

  <aside class="card">
<h2 id="lotTitle">Select a lot</h2>
    <div class="small">Click any homesite on the map to edit its selections.</div>

    <div id="editor" style="display:none">
      <div class="row">
        <div>
          <label for="lotId">Lot ID</label>
          <input id="lotId" placeholder="Lot number">
        </div>
        <div>
          <label for="plan">Plan</label>
          <input id="plan" list="planList" placeholder="Type or choose">
        </div>
      </div>

      <label for="brick">Brick</label>
      <input id="brick" list="brickList" placeholder="Type or choose brick">

      <div class="row">
        <div>
          <label for="scheme">Scheme *</label>
          <input id="scheme" list="schemeList" placeholder="A, B, C...">
        </div>
        <div>
          <label for="door">Front Door</label>
          <input id="door" list="doorList" placeholder="Door color">
        </div>
      </div>

      <label for="restricted">Lots that cannot repeat this lot</label>
      <textarea id="restricted" placeholder="Example: 109,110,111,112,114,115,116,117,121"></textarea>
      <div class="small">Comma-separated. This is where we'll map the exact “4 houses each side + across” rule.</div>

      <div class="toolbar">
        <button class="primary" id="saveBtn">Save & Check</button>
        <button class="secondary" id="clearBtn">Clear Lot</button>
      </div>

      <div id="status" class="status">No selections saved yet.</div>

      <hr>
      <strong style="font-size:13px">Saved selections</strong>
      <div id="summary" class="selSummary small">None</div>
    </div>

    <hr>
    <div class="small"><strong>Conflict rule:</strong> Plan, Brick, Scheme, and Front Door are each checked independently against the selected lot's restricted lots. We can make different categories use different rules later.</div>

    <div class="toolbar">
      <button class="secondary" id="exportBtn">Export Data</button>
      <label class="secondary" style="padding:10px 12px;border-radius:8px;cursor:pointer;font-weight:700;margin:0">
        Import Data<input id="importFile" type="file" accept=".json" style="display:none">
      </label>
      <button class="danger" id="resetBtn">Reset Prototype</button>
    </div>
  </aside>
</div>

<datalist id="schemeList">
  <option value="A"><option value="B"><option value="C"><option value="D"><option value="E">
  <option value="F"><option value="G"><option value="H"><option value="I"><option value="J">
  <option value="K"><option value="L"><option value="M">
</datalist>
<datalist id="brickList">
  <option value="Green Hollow"><option value="Cream Stone"><option value="Claymex Marble">
  <option value="Castle Rock"><option value="Mocha Brown Antique">
</datalist>
<datalist id="doorList">
  <option value="Iron Ore"><option value="Black Fox"><option value="Fireweed">
  <option value="Peppercorn"><option value="Naval">
</datalist>
<datalist id="planList">
  <option value="Plan 1"><option value="Plan 2"><option value="Plan 3"><option value="Plan 4">
</datalist>

<script>
const defaults = {"P01": {"restricted": ["P03", "P05", "P02", "P04", "P07", "P08", "P18", "P06", "P19"]}, "P02": {"restricted": ["P04", "P08", "P01", "P03", "P05", "P19", "P07", "P15", "P23"]}, "P03": {"restricted": ["P05", "P01", "P07", "P04", "P02", "P18", "P08", "P06", "P22"]}, "P04": {"restricted": ["P08", "P02", "P19", "P05", "P07", "P03", "P23", "P18", "P01"]}, "P05": {"restricted": ["P07", "P03", "P18", "P01", "P04", "P08", "P22", "P02", "P19"]}, "P06": {"restricted": ["P09", "P21", "P25", "P05", "P07", "P03", "P18", "P38", "P22"]}, "P07": {"restricted": ["P18", "P05", "P22", "P03", "P08", "P04", "P19", "P26", "P23"]}, "P08": {"restricted": ["P19", "P04", "P23", "P02", "P07", "P18", "P27", "P05", "P15"]}, "P09": {"restricted": ["P21", "P06", "P25", "P38", "P07", "P18", "P05", "P22", "P41"]}, "P10": {"restricted": ["P12", "P11", "P13", "P31", "P29", "P32", "P14", "113", "P28"]}, "P11": {"restricted": ["P10", "113", "121", "P12", "P29", "P28", "P31", "P20", "P30"]}, "P12": {"restricted": ["P10", "P13", "P14", "P11", "P32", "P31", "P33", "P16", "P29"]}, "P13": {"restricted": ["P14", "P12", "P16", "P10", "P33", "P32", "P34", "P17", "P31"]}, "P14": {"restricted": ["P13", "P16", "P12", "P17", "P34", "P33", "P35", "P10", "P32"]}, "P15": {"restricted": ["P17", "P16", "P37", "P36", "P19", "P08", "P14", "P23", "P35"]}, "P16": {"restricted": ["P14", "P17", "P13", "P15", "P35", "P34", "P36", "P12", "P33"]}, "P17": {"restricted": ["P16", "P15", "P14", "P36", "P35", "P37", "P13", "P34", "P33"]}, "P18": {"restricted": ["P07", "P22", "P26", "P05", "P19", "P08", "P23", "P39", "P03"]}, "P19": {"restricted": ["P23", "P08", "P27", "P04", "P18", "P22", "P07", "P15", "P40"]}, "P20": {"restricted": ["121", "P24", "P30", "113", "P28", "P11", "P29", "P10", "P31"]}, "P21": {"restricted": ["P09", "P25", "P06", "P38", "P41", "P18", "P22", "P07", "P26"]}, "P22": {"restricted": ["P26", "P18", "P07", "P39", "P23", "P19", "P27", "P05", "P08"]}, "P23": {"restricted": ["P19", "P27", "P08", "P40", "P22", "P26", "P18", "P04", "P15"]}, "P24": {"restricted": ["P20", "P30", "121", "P28", "P42", "113", "P43", "P44", "P11"]}, "P25": {"restricted": ["P21", "P38", "P09", "P41", "P06", "P22", "P26", "P18", "P39"]}, "P26": {"restricted": ["P22", "P39", "P18", "P27", "P23", "P07", "P40", "P19", "P38"]}, "P27": {"restricted": ["P23", "P40", "P19", "P26", "P39", "P22", "P08", "P37", "P18"]}, "P28": {"restricted": ["P29", "P30", "P31", "P11", "P32", "121", "P20", "P10", "P24"]}, "P29": {"restricted": ["P31", "P28", "P32", "P30", "P11", "P10", "P33", "P12", "P48"]}, "P30": {"restricted": ["P28", "P24", "P20", "P29", "121", "P11", "P31", "P45", "P46"]}, "P31": {"restricted": ["P29", "P32", "P33", "P28", "P10", "P12", "P11", "P34", "P13"]}, "P32": {"restricted": ["P33", "P31", "P34", "P29", "P12", "P13", "P10", "P35", "P28"]}, "P33": {"restricted": ["P32", "P34", "P31", "P35", "P13", "P14", "P12", "P29", "P36"]}, "P34": {"restricted": ["P33", "P35", "P32", "P36", "P14", "P16", "P13", "P31", "P37"]}, "P35": {"restricted": ["P36", "P34", "P33", "P37", "P16", "P17", "P14", "P32", "P15"]}, "P36": {"restricted": ["P35", "P37", "P34", "P17", "P16", "P15", "P33", "P14", "P54"]}, "P37": {"restricted": ["P36", "P35", "P15", "P17", "P27", "P40", "P34", "P23", "P16"]}, "P38": {"restricted": ["P25", "P41", "P21", "P09", "P26", "P39", "P62", "P22", "P06"]}, "P39": {"restricted": ["P26", "P22", "P40", "P27", "P60", "P59", "P18", "P23", "P61"]}, "P40": {"restricted": ["P27", "P23", "P39", "P58", "P37", "P26", "P57", "P19", "P61"]}, "P41": {"restricted": ["P38", "P25", "P62", "P21", "P63", "P59", "P39", "P09", "P26"]}, "P42": {"restricted": ["P43", "P44", "P24", "P46", "P30", "P20", "P45", "P28", "P47"]}, "P43": {"restricted": ["P44", "P42", "P46", "P45", "P24", "P30", "P47", "P28", "P20"]}, "P44": {"restricted": ["P46", "P43", "P45", "P42", "P47", "P30", "P24", "P48", "P28"]}, "P45": {"restricted": ["P47", "P46", "P48", "P44", "P49", "P30", "P28", "P43", "P29"]}, "P46": {"restricted": ["P45", "P44", "P47", "P43", "P48", "P30", "P42", "P28", "P49"]}, "P47": {"restricted": ["P48", "P45", "P49", "P46", "P50", "P44", "P28", "P29", "P30"]}, "P48": {"restricted": ["P47", "P49", "P50", "P45", "P51", "P46", "P29", "P31", "P28"]}, "P49": {"restricted": ["P48", "P50", "P47", "P51", "P52", "P45", "P31", "P32", "P29"]}, "P50": {"restricted": ["P51", "P49", "P52", "P48", "P53", "P47", "P32", "P33", "P31"]}, "P51": {"restricted": ["P52", "P50", "P53", "P49", "P54", "P48", "P33", "P34", "P32"]}, "P52": {"restricted": ["P51", "P53", "P50", "P54", "P49", "P55", "P34", "P35", "P33"]}, "P53": {"restricted": ["P52", "P54", "P51", "P55", "P50", "P56", "P35", "P36", "P34"]}, "P54": {"restricted": ["P53", "P55", "P52", "P56", "P51", "P57", "P36", "P37", "P35"]}, "P55": {"restricted": ["P56", "P54", "P57", "P53", "P58", "P52", "P37", "P36", "P61"]}, "P56": {"restricted": ["P55", "P57", "P58", "P54", "P61", "P53", "P40", "P37", "P52"]}, "P57": {"restricted": ["P58", "P56", "P61", "P55", "P54", "P60", "P40", "P59", "P53"]}, "P58": {"restricted": ["P57", "P61", "P56", "P60", "P55", "P59", "P40", "P39", "P54"]}, "P59": {"restricted": ["P60", "P63", "P61", "P62", "P58", "P39", "P57", "P26", "P40"]}, "P60": {"restricted": ["P59", "P61", "P58", "P63", "P57", "P39", "P62", "P40", "P56"]}, "P61": {"restricted": ["P58", "P60", "P57", "P59", "P56", "P63", "P40", "P39", "P55"]}, "P62": {"restricted": ["P63", "P59", "P41", "P60", "P38", "P61", "P39", "P25", "P26"]}, "P63": {"restricted": ["P59", "P62", "P60", "P61", "P41", "P39", "P58", "P38", "P26"]}, "113": {"restricted": ["121", "P11", "P20", "P10", "P24", "P30", "P28", "P12", "P29"]}, "121": {"restricted": ["P20", "113", "P11", "P24", "P30", "P28", "P10", "P29", "P31"]}};
const STORAGE_KEY = "newCommunityLotRuleTester_local_v1";
let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {
  lots: JSON.parse(JSON.stringify(defaults)),
  selections: {}
};
let selected = null;
window.__adeltonOriginalSelection = {
  clear: () => {
    selected = null;
    setMapClasses([]);
  }
};

const $ = id => document.getElementById(id);
const lots = [...document.querySelectorAll(".lot")];

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalize(v) {
  return (v || "").trim().toLowerCase();
}

function displayId(id) {
  return id.startsWith("P") ? id + " (temporary)" : id;
}

function setMapClasses(blockers=[]) {
  lots.forEach(el => {
    el.classList.remove("selected","restricted","blocker");
    if (el.dataset.id === selected) el.classList.add("selected");
    if (selected && (state.lots[selected]?.restricted || []).includes(el.dataset.id)) el.classList.add("restricted");
    if (blockers.includes(el.dataset.id)) el.classList.add("blocker");
  });
}

function loadLot(id) {
  selected = id;
  $("editor").style.display = "block";
  $("lotTitle").textContent = "Lot " + displayId(id);
  const s = state.selections[id] || {};
  $("lotId").value = id;
  $("plan").value = s.plan || "";
  $("brick").value = s.brick || "";
  $("scheme").value = s.scheme || "";
  $("door").value = s.door || "";
  $("restricted").value = (state.lots[id]?.restricted || []).join(", ");
  renderSummary();
  checkConflicts(false);
}

function getForm() {
  return {
    plan:$("plan").value.trim(),
    brick:$("brick").value.trim(),
    scheme:$("scheme").value.trim(),
    door:$("door").value.trim()
  };
}

function conflictList(form) {
  const conflicts = [];
  const related = state.lots[selected]?.restricted || [];
  const fields = [["plan","Plan"],["brick","Brick"],["scheme","Scheme"],["door","Front Door"]];
  for (const rid of related) {
    const other = state.selections[rid];
    if (!other) continue;
    for (const [key,label] of fields) {
      if (normalize(form[key]) && normalize(form[key]) === normalize(other[key])) {
        conflicts.push({lot:rid, field:label, value:form[key]});
      }
    }
  }
  return conflicts;
}

function checkConflicts(useForm=true) {
  if (!selected) return;
  const form = useForm ? getForm() : (state.selections[selected] || getForm());
  const conflicts = conflictList(form);
  const blockers = [...new Set(conflicts.map(c=>c.lot))];
  setMapClasses(blockers);
  const box = $("status");
  if (!Object.values(form).some(Boolean)) {
    box.className = "status";
    box.textContent = "No selections saved yet.";
  } else if (!conflicts.length) {
    box.className = "status ok";
    box.innerHTML = "<strong>✓ No conflicts found</strong><br>These selections are clear against the currently mapped restricted lots.";
  } else {
    box.className = "status bad";
    box.innerHTML = "<strong>✕ Conflict found</strong><br>" +
      conflicts.map(c => `${c.field} “${c.value}” conflicts with Lot ${displayId(c.lot)}.`).join("<br>");
  }
}

function renderSummary() {
  const s = state.selections[selected] || {};
  const vals = [
    ["Plan",s.plan],["Brick",s.brick],["Scheme",s.scheme],["Door",s.door]
  ].filter(x=>x[1]);
  $("summary").innerHTML = vals.length ? vals.map(x=>`<div><strong>${x[0]}:</strong> ${x[1]}</div>`).join("") : "None";
}

function renameLot(oldId,newId) {
  newId = newId.trim();
  if (!newId || newId === oldId) return oldId;
  if (state.lots[newId]) {
    alert("That lot ID already exists.");
    return oldId;
  }
  state.lots[newId] = state.lots[oldId];
  delete state.lots[oldId];
  if (state.selections[oldId]) {
    state.selections[newId] = state.selections[oldId];
    delete state.selections[oldId];
  }
  Object.values(state.lots).forEach(v => {
    v.restricted = (v.restricted || []).map(x => x === oldId ? newId : x);
  });
  const el = lots.find(x=>x.dataset.id===oldId);
  if (el) {
    el.dataset.id = newId;
    el.setAttribute("aria-label","Lot "+newId);
  }
  selected = newId;
  return newId;
}

lots.forEach(el => {
  const activate = () => loadLot(el.dataset.id);
  el.addEventListener("click", activate);
  el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
  });
});

["plan","brick","scheme","door"].forEach(id => $(id).addEventListener("input", ()=>checkConflicts(true)));

$("saveBtn").addEventListener("click", () => {
  if (!selected) return;
  const old = selected;
  const renamed = renameLot(old, $("lotId").value);
  selected = renamed;
  const parsed = $("restricted").value.split(",").map(x=>x.trim()).filter(Boolean);
  state.lots[selected] = state.lots[selected] || {restricted:[]};
  state.lots[selected].restricted = [...new Set(parsed)].filter(x=>x!==selected);
  state.selections[selected] = getForm();
  saveState();
  $("lotTitle").textContent = "Lot " + displayId(selected);
  renderSummary();
  checkConflicts(false);
});

$("clearBtn").addEventListener("click", () => {
  if (!selected) return;
  delete state.selections[selected];
  saveState();
  $("plan").value = $("brick").value = $("scheme").value = $("door").value = "";
  renderSummary(); checkConflicts(false);
});

$("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "community-lot-data.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

$("importFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      state = JSON.parse(r.result);
      saveState();
      location.reload();
    } catch { alert("That file is not valid JSON data from this prototype."); }
  };
  r.readAsText(file);
});

$("resetBtn").addEventListener("click", () => {
  if (!confirm("Reset all saved lot selections and edited relationships?")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

setMapClasses([]);
</script>
<style id="community-v2-styles">
/* ===== Community Map V2 upgrade — keeps the original embedded map ===== */

.mapstage{
  width:1256px;
  min-width:1256px;
  transform-origin:top left
}

.mapwrap{
  overflow:auto;
  max-height:760px
}

.v2-mapbar{
  display:flex;
  gap:8px;
  align-items:center;
  flex-wrap:wrap;
  margin:0 0 10px
}

.v2-mapbar button{
  background:#e5e7eb;
  color:#111827
}

.v2-mapbar button.active{
  outline:2px solid var(--accent);
  background:#dbeafe;
  color:#1d4ed8
}

.v2-zoomread{
  min-width:48px;
  text-align:center;
  font-size:12px;
  color:var(--muted)
}

.lot.v2-finalized{
  fill:rgba(34,197,94,.30)!important;
  stroke:#15803d!important;
  stroke-width:2.3!important
}

/* When nothing is selected, force the map back to its true opening-state look.
   Finalized lots remain green. */
svg.v2-map-idle .lot:not(.v2-finalized){
  fill:rgba(37,99,235,.03)!important;
  stroke:rgba(37,99,235,.25)!important;
  stroke-width:1.1!important;
}

svg.v2-map-idle .lot.v2-finalized{
  fill:rgba(34,197,94,.30)!important;
  stroke:#15803d!important;
  stroke-width:2.3!important;
}

.lot.v2-selected{
  fill:rgba(37,99,235,.23)!important;
  stroke:var(--accent)!important;
  stroke-width:3!important
}

.lot.v2-restricted{
  fill:rgba(202,138,4,.17)!important;
  stroke:var(--warn)!important;
  stroke-width:2!important
}

.lot.v2-target{
  fill:rgba(202,138,4,.30)!important;
  stroke:var(--warn)!important;
  stroke-width:3!important
}

.lot.v2-conflict{
  fill:rgba(220,38,38,.28)!important;
  stroke:var(--bad)!important;
  stroke-width:3!important
}

.v2-label-wrap{
  overflow:visible;
  pointer-events:none
}

.v2-lot-label{
  width:54px;
  height:58px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  font-family:Arial,Helvetica,sans-serif;
  font-weight:800;
  color:#111827;
  font-size:4.7px;
  line-height:1.07;
  text-shadow:
    -1px -1px 2px #fff,
     1px -1px 2px #fff,
    -1px  1px 2px #fff,
     1px  1px 2px #fff;
  pointer-events:none
}

.v2-lot-label .addr{
  font-size:7px;
  font-weight:900
}

.v2-lot-label .temp{
  font-size:6px;
  color:#667085
}

.v2-grid2{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:9px
}

.v2-grid3{
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  gap:8px
}

.v2-section{
  border-top:1px solid #e5e7eb;
  margin-top:14px;
  padding-top:12px
}

.v2-title{
  font-size:13px;
  font-weight:800;
  margin-bottom:5px
}

.v2-help{
  font-size:12px;
  color:var(--muted);
  line-height:1.4
}

.v2-check{
  display:flex;
  align-items:center;
  gap:7px;
  font-size:12px;
  margin-top:8px
}

.v2-check input{
  width:auto
}

.v2-note{
  background:#fff8e6;
  border:1px solid #f4d77f;
  color:#704b00;
  padding:9px;
  border-radius:8px;
  font-size:12px;
  line-height:1.4;
  margin-top:8px
}

.v2-chips{
  display:flex;
  gap:5px;
  flex-wrap:wrap;
  margin-top:8px
}

.v2-chip{
  display:inline-flex;
  align-items:center;
  gap:5px;
  background:#fff7db;
  border:1px solid #f2cf65;
  border-radius:999px;
  padding:4px 7px;
  font-size:11px;
  color:#704b00
}

.v2-chip button{
  padding:0;
  background:transparent;
  color:#704b00;
  font-size:12px
}

.v2-status{
  margin-top:9px;
  padding:10px;
  border-radius:8px;
  background:#f3f4f6;
  font-size:12px;
  line-height:1.45
}

.v2-status.ok{
  background:#dcfce7;
  color:#166534
}

.v2-status.bad{
  background:#fee2e2;
  color:#991b1b
}

.v2-actions{
  display:flex;
  gap:7px;
  flex-wrap:wrap;
  margin-top:10px
}

.v2-file{
  display:inline-block;
  background:#e5e7eb;
  color:#111827;
  border-radius:8px;
  padding:10px 12px;
  font-weight:700;
  cursor:pointer;
  font-size:13px;
  margin:0
}

.v2-file input{
  display:none
}


.v2-lockbar{
  margin-top:14px;
  padding:10px 11px;
  border:1px solid #d1d5db;
  border-radius:9px;
  background:#f8fafc;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}
.v2-locktext{
  font-size:12px;
  line-height:1.4;
}
.v2-locktext strong{
  display:block;
  font-size:13px;
}
.v2-locktext .override{
  display:block;
  margin-top:4px;
  color:#92400e;
}
.v2-unlock{
  flex:0 0 auto;
  background:#fef3c7;
  color:#92400e;
  border:1px solid #f59e0b;
}
.v2-modal-backdrop{
  position:fixed;
  inset:0;
  z-index:99999;
  background:rgba(15,23,42,.58);
  display:none;
  align-items:center;
  justify-content:center;
  padding:20px;
}
.v2-modal-backdrop.open{
  display:flex;
}
.v2-modal{
  width:min(520px,100%);
  max-height:85vh;
  overflow:auto;
  background:white;
  border-radius:14px;
  box-shadow:0 24px 70px rgba(0,0,0,.28);
  padding:20px;
}
.v2-modal h3{
  margin:0 0 8px;
  font-size:20px;
}
.v2-modal p{
  margin:0 0 12px;
  font-size:13px;
  line-height:1.5;
  color:#475569;
}
.v2-modal-conflicts{
  background:#fef2f2;
  border:1px solid #fecaca;
  color:#991b1b;
  padding:10px 12px;
  border-radius:9px;
  font-size:12px;
  line-height:1.5;
  margin:10px 0 12px;
}
.v2-modal textarea{
  min-height:86px;
}
.v2-modal-actions{
  display:flex;
  justify-content:flex-end;
  gap:8px;
  margin-top:14px;
}
.v2-modal button:disabled,
#v2Save:disabled,
#v2Clear:disabled{
  opacity:.45;
  cursor:not-allowed;
}

@media(max-width:900px){
  .v2-grid2,
  .v2-grid3{
    grid-template-columns:1fr
  }
}
</style>

<style id="kb-studio-polish">
/* =========================================================
   KB HOME DESIGN STUDIO - VISUAL POLISH ONLY
   Functional IDs and map behavior are intentionally unchanged.
   ========================================================= */

:root{
  --kb-red:#c8102e;
  --kb-red-dark:#9f1026;
  --kb-red-soft:#fff1f3;
  --kb-charcoal:#25282a;
  --kb-ink:#30343b;
  --kb-muted:#70757d;
  --kb-line:#e2e4e8;
  --kb-soft:#f6f7f8;
  --kb-panel:#ffffff;
  --kb-blue:#356b9a;
  --bg:#f3f4f6;
  --card:#ffffff;
  --text:#30343b;
  --muted:#70757d;
  --line:#e2e4e8;
  --accent:#356b9a;
  --ok:#1f7a4c;
  --bad:#c53636;
  --warn:#b7791f;
}

html{
  background:var(--kb-soft);
}

body{
  margin:0;
  font-family:"Segoe UI",Inter,Arial,Helvetica,sans-serif;
  background:
    linear-gradient(180deg,#f8f9fa 0,#f3f4f6 210px,#f3f4f6 100%);
  color:var(--kb-ink);
  min-height:100vh;
  letter-spacing:.005em;
}

header{
  position:relative;
  padding:20px 142px 19px 30px;
  background:#fff;
  border-top:5px solid var(--kb-red);
  border-bottom:1px solid var(--kb-line);
  box-shadow:0 1px 0 rgba(22,27,34,.02);
}

.kb-brandline{
  margin-bottom:7px;
  color:var(--kb-red);
  font-size:10px;
  font-weight:800;
  letter-spacing:.16em;
}

.kb-brandline span{
  color:#a3a7ad;
  padding:0 4px;
}

header h1{
  margin:0;
  color:var(--kb-charcoal);
  font-size:27px;
  line-height:1.1;
  font-weight:700;
  letter-spacing:-.025em;
}

header p{
  margin:5px 0 0;
  color:var(--kb-muted);
  font-size:13px;
  font-weight:500;
}

#v2RestrictionMode{
  top:25px;
  right:30px;
  min-width:76px;
  padding:9px 15px;
  border:1px solid #d7dadd;
  border-radius:7px;
  background:#fff;
  color:var(--kb-charcoal);
  box-shadow:0 1px 2px rgba(22,27,34,.05);
  font-size:12px;
  font-weight:700;
  transition:background .16s ease,border-color .16s ease,color .16s ease;
}

#v2RestrictionMode:hover{
  background:var(--kb-red-soft);
  border-color:#e4a6b0;
  color:var(--kb-red-dark);
}

#v2RestrictionMode.active{
  background:var(--kb-red);
  border-color:var(--kb-red);
  color:#fff;
  outline:none;
}

.wrap{
  width:min(1580px,calc(100% - 40px));
  margin:0 auto;
  padding:22px 0 34px;
  display:grid;
  grid-template-columns:minmax(620px,1.75fr) minmax(350px,.72fr);
  gap:20px;
  align-items:start;
}

.card{
  background:var(--kb-panel);
  border:1px solid var(--kb-line);
  border-radius:10px;
  padding:17px;
  box-shadow:0 2px 8px rgba(24,31,40,.045);
}

.mapwrap{
  position:relative;
  overflow:auto;
  max-height:760px;
  padding:14px 16px 17px;
}

.v2-mapbar{
  position:sticky;
  left:0;
  z-index:6;
  width:max-content;
  display:flex;
  align-items:center;
  gap:5px;
  margin:0 0 11px;
  padding:5px;
  border:1px solid var(--kb-line);
  border-radius:8px;
  background:#f8f9fa;
}

.v2-zoom-title{
  margin:0 5px 0 3px;
  color:#60656d;
  font-size:10px;
  font-weight:800;
  letter-spacing:.08em;
  text-transform:uppercase;
}

.v2-mapbar button{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:31px;
  height:31px;
  min-width:31px;
  padding:0;
  border:1px solid #d9dcdf;
  border-radius:6px;
  background:#fff;
  color:#33383f;
  font-size:18px;
  font-weight:500;
  box-shadow:0 1px 1px rgba(20,26,34,.03);
}

.v2-mapbar button:hover{
  background:#f0f1f2;
  border-color:#c7cbd0;
}

.mapstage{
  border:1px solid #eceef0;
  border-radius:7px;
  overflow:hidden;
  background:#fff;
}

aside.card{
  position:sticky;
  top:18px;
  padding:0;
  overflow:hidden;
}

aside.card > h2,
aside.card > .v2-panel-eyebrow,
aside.card > .v2-help,
aside.card > #v2Editor,
aside.card > .v2-section{
  margin-left:20px;
  margin-right:20px;
}

.v2-panel-eyebrow{
  margin-top:20px;
  margin-bottom:5px;
  color:var(--kb-red);
  font-size:10px;
  font-weight:800;
  letter-spacing:.13em;
}

aside.card h2{
  margin-top:0;
  margin-bottom:5px;
  color:var(--kb-charcoal);
  font-size:20px;
  font-weight:700;
  letter-spacing:-.015em;
}

.v2-panel-intro{
  margin-bottom:18px;
}

.v2-help{
  color:var(--kb-muted);
  font-size:11.5px;
  line-height:1.5;
}

#v2Editor{
  padding-bottom:4px;
}

.v2-section{
  margin-top:17px;
  padding-top:15px;
  border-top:1px solid #eceef0;
}

#v2Editor > .v2-section:first-child{
  margin-left:0;
  margin-right:0;
  margin-bottom:16px;
  padding:13px 14px;
  border:1px solid #e5e7ea;
  border-radius:8px;
  background:#fafafa;
}

.v2-title{
  color:#41464d;
  font-size:11px;
  font-weight:800;
  letter-spacing:.055em;
  text-transform:uppercase;
}

.v2-conflict-title{
  margin-bottom:7px;
}

.v2-status{
  margin-top:0;
  padding:10px 11px 10px 34px;
  position:relative;
  border:1px solid #e3e5e8;
  border-radius:7px;
  background:#f6f7f8;
  color:#555b63;
  font-size:12px;
  font-weight:600;
  line-height:1.4;
}

.v2-status::before{
  content:"";
  position:absolute;
  left:12px;
  top:50%;
  width:9px;
  height:9px;
  margin-top:-5px;
  border-radius:50%;
  background:#9aa0a7;
  box-shadow:0 0 0 3px rgba(154,160,167,.13);
}

.v2-status.ok{
  border-color:#cbe4d5;
  background:#f1f8f4;
  color:#24633f;
}

.v2-status.ok::before{
  background:#2d8b59;
  box-shadow:0 0 0 3px rgba(45,139,89,.12);
}

.v2-status.bad{
  border-color:#efc8c8;
  background:#fff3f3;
  color:#9f2929;
}

.v2-status.bad::before{
  background:#c53636;
  box-shadow:0 0 0 3px rgba(197,54,54,.12);
}

label{
  margin:12px 0 5px;
  color:#4a5058;
  font-size:11px;
  font-weight:700;
}

input,
select,
textarea{
  width:100%;
  min-height:38px;
  padding:8px 10px;
  border:1px solid #d6d9dd;
  border-radius:7px;
  background:#fff;
  color:#2f343a;
  outline:none;
  font-size:13px;
  box-shadow:inset 0 1px 0 rgba(25,31,39,.015);
  transition:border-color .14s ease,box-shadow .14s ease,background .14s ease;
}

input:hover,
select:hover,
textarea:hover{
  border-color:#bfc4ca;
}

input:focus,
select:focus,
textarea:focus{
  border-color:#9a626b;
  box-shadow:0 0 0 3px rgba(200,16,46,.08);
}

input:disabled,
select:disabled,
textarea:disabled{
  background:#f4f5f6;
  color:#8a8f96;
  cursor:not-allowed;
}

#v2ExteriorTypeDisplay{
  min-height:38px;
  display:flex;
  align-items:center;
  padding:8px 10px !important;
  border:1px solid #d6d9dd !important;
  border-radius:7px !important;
  background:#f7f8f9 !important;
  color:#555b63 !important;
  font-size:13px;
  font-weight:600 !important;
}

.v2-grid2{
  gap:10px;
}

.v2-lockbar{
  margin-top:17px;
  padding:11px 12px;
  border:1px solid #e0e3e6;
  border-radius:7px;
  background:#f7f8f9;
}

.v2-locktext{
  color:#666c74;
  font-size:11px;
  line-height:1.45;
}

.v2-locktext strong{
  margin-bottom:2px;
  color:#3f444b;
  font-size:12px;
}

button{
  border-radius:7px;
  font-size:12px;
  font-weight:700;
  transition:background .14s ease,border-color .14s ease,color .14s ease,transform .08s ease;
}

button:active{
  transform:translateY(1px);
}

.v2-actions{
  gap:8px;
  margin-top:12px;
}

.primary{
  background:var(--kb-red);
  color:#fff;
  box-shadow:0 1px 2px rgba(113,16,31,.14);
}

.primary:hover{
  background:var(--kb-red-dark);
}

.secondary,
.v2-file{
  border:1px solid #d9dcdf;
  background:#f7f8f9;
  color:#454a51;
}

.secondary:hover,
.v2-file:hover{
  background:#eef0f2;
}

.danger{
  border:1px solid #efcaca;
  background:#fff5f5;
  color:#a43131;
}

.danger:hover{
  background:#feecec;
}

.v2-unlock{
  border:1px solid #e3cb8a;
  background:#fff9e8;
  color:#7c5c15;
}

.v2-unlock:hover{
  background:#fff2c7;
}

.v2-note{
  border-color:#ead79e;
  background:#fffbef;
  color:#6f571b;
}

.v2-chip{
  border-color:#e6d595;
  background:#fffaf0;
  color:#725c1d;
}

.v2-chip button{
  color:#725c1d;
}

aside.card > .v2-section:last-child{
  margin:20px 0 0;
  padding:15px 20px 19px;
  border-top:1px solid #e4e6e9;
  background:#fafbfb;
}

aside.card > .v2-section:last-child .v2-title{
  color:#666c73;
}

.v2-file{
  display:inline-flex;
  align-items:center;
  min-height:36px;
  padding:8px 11px;
  font-size:12px;
}

.v2-modal-backdrop{
  background:rgba(28,31,35,.52);
  backdrop-filter:blur(2px);
}

.v2-modal{
  border:1px solid #e3e5e8;
  border-radius:11px;
  box-shadow:0 24px 70px rgba(22,27,34,.22);
}

.v2-modal h3{
  color:var(--kb-charcoal);
  font-size:19px;
  letter-spacing:-.01em;
}

.lot.v2-selected{
  fill:rgba(53,107,154,.19)!important;
  stroke:#356b9a!important;
}

.lot.v2-conflict{
  fill:rgba(197,54,54,.24)!important;
  stroke:#c53636!important;
}

.lot.v2-restricted,
.lot.v2-target{
  stroke:#b7791f!important;
}

.lot.v2-finalized{
  fill:rgba(45,139,89,.25)!important;
  stroke:#2d8b59!important;
}

@media(max-width:1080px){
  .wrap{
    width:min(100% - 24px,1580px);
    grid-template-columns:1fr;
  }

  aside.card{
    position:relative;
    top:auto;
  }
}

@media(max-width:640px){
  header{
    padding:17px 102px 16px 18px;
  }

  header h1{
    font-size:23px;
  }

  #v2RestrictionMode{
    top:20px;
    right:18px;
  }

  .wrap{
    width:calc(100% - 20px);
    padding-top:12px;
  }

  .card{
    border-radius:8px;
  }
}
</style>

<style id="floating-homesite-panel-polish">
:root{
  --kb-yellow:#f2c94c;
  --kb-yellow-soft:#fff8dc;
}

.wrap{
  display:block !important;
  width:min(1640px,calc(100% - 40px)) !important;
  margin:0 auto !important;
}

.mapwrap{
  width:100%;
}

header::after{
  content:"";
  position:absolute;
  left:30px;
  bottom:-1px;
  width:72px;
  height:3px;
  background:var(--kb-yellow);
  border-radius:3px 3px 0 0;
}

aside.card{
  display:none;
  position:fixed !important;
  top:102px !important;
  right:24px !important;
  width:390px !important;
  max-width:calc(100vw - 32px) !important;
  max-height:calc(100vh - 126px) !important;
  overflow-y:auto !important;
  z-index:80 !important;
  border:1px solid #dfe2e5 !important;
  border-top:4px solid var(--kb-yellow) !important;
  border-radius:11px !important;
  background:#fff !important;
  box-shadow:0 18px 48px rgba(28,32,38,.18) !important;
}

aside.card > .v2-panel-eyebrow{
  margin-top:18px !important;
  color:#7b6412 !important;
}

.v2-mapbar{
  border-left:3px solid var(--kb-yellow) !important;
}

.v2-zoom-title{
  color:#5e542f !important;
}

@media(max-width:700px){
  .wrap{
    width:calc(100% - 18px) !important;
  }

  aside.card{
    top:92px !important;
    right:10px !important;
    left:10px !important;
    width:auto !important;
    max-width:none !important;
    max-height:calc(100vh - 110px) !important;
  }

  header::after{
    left:18px;
  }
}
</style>





<style>
/* =========================================================
   STAGE 1 / STAGE 2 LOCAL PROTOTYPE STYLES
   ========================================================= */
.v2-stage-card{
  margin-top:14px;
  padding:13px;
  border:1px solid #dfe3e6;
  border-radius:10px;
  background:#fff;
}
.v2-stage-card:first-of-type{margin-top:10px}
.v2-stage-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:10px;
  margin-bottom:8px;
}
.v2-stage-kicker{
  font-size:10px;
  letter-spacing:.09em;
  font-weight:800;
  color:#6b7280;
}
.v2-stage-name{
  font-size:14px;
  font-weight:800;
  color:#1f2937;
  margin-top:2px;
}
.v2-stage-chip{
  white-space:nowrap;
  padding:4px 7px;
  border-radius:999px;
  border:1px solid #d1d5db;
  background:#f3f4f6;
  color:#6b7280;
  font-size:10px;
  font-weight:800;
}
.v2-stage-chip.saved{
  background:#dbeafe;
  border-color:#93c5fd;
  color:#1d4ed8;
}
.v2-stage-chip.complete{
  background:#dcfce7;
  border-color:#86efac;
  color:#166534;
}
.v2-stage-divider{
  border:0;
  border-top:1px solid #e5e7eb;
  margin:12px 0;
}
.v2-stage-actions{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-top:11px;
}
.v2-stage-actions button{flex:1;min-width:120px}
.v2-scheme-summary{
  margin-top:10px;
  padding:10px 11px;
  border:1px solid #e1e5e9;
  border-radius:8px;
  background:#f8fafc;
}
.v2-scheme-summary-head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:8px;
  font-size:11px;
  font-weight:800;
  margin-bottom:5px;
}
.v2-test-chip{
  color:#7c5d00;
  background:#fff7d6;
  border:1px solid #ead78c;
  border-radius:999px;
  padding:3px 6px;
  font-size:9px;
}
.v2-color-row{
  display:grid;
  grid-template-columns:1fr 1.15fr;
  gap:8px;
  padding:5px 0;
  border-top:1px solid #e5e7eb;
  font-size:11px;
  line-height:1.25;
}
.v2-color-row:first-of-type{border-top:0}
.v2-color-row span:first-child{color:#6b7280;font-weight:700}
.v2-color-row span:last-child{text-align:right;font-weight:700}
.v2-stage-disabled{
  opacity:.55;
}
.v2-stage-disabled::after{
  content:"Save Stage 1 first";
  display:block;
  margin-top:9px;
  padding:7px 8px;
  background:#f3f4f6;
  border-radius:6px;
  text-align:center;
  color:#6b7280;
  font-size:10px;
  font-weight:800;
}
.lot.v2-home-saved{
  fill:rgba(59,130,246,.18) !important;
  stroke:#3b82f6 !important;
  stroke-width:2.1 !important;
}
svg.v2-map-idle .lot.v2-home-saved{
  fill:rgba(59,130,246,.18) !important;
  stroke:#3b82f6 !important;
  opacity:1 !important;
}
.lot.v2-finalized{
  fill:rgba(22,163,74,.23) !important;
  stroke:#15803d !important;
}
.v2-local-test-note{
  margin-top:9px;
  padding:8px 10px;
  border-radius:7px;
  background:#fff7d6;
  border:1px solid #ead78c;
  color:#725c0a;
  font-size:10.5px;
  line-height:1.35;
}

.v2-home-summary{
  display:none;
  margin-top:10px;
  padding:10px 11px;
  border:1px solid #dfe3e6;
  border-radius:8px;
  background:#f3f4f6;
}
.v2-home-summary.show{display:block}
.v2-home-summary-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:7px 10px;
}
.v2-home-summary-label{
  display:block;
  font-size:9px;
  font-weight:800;
  letter-spacing:.07em;
  color:#6b7280;
  text-transform:uppercase;
  margin-bottom:2px;
}
.v2-home-summary-value{
  display:block;
  font-size:12px;
  font-weight:800;
  color:#1f2937;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.v2-home-fields.collapsed{display:none}
#v2StageHome.saved-collapsed{
  background:#f3f4f6;
  border-color:#d1d5db;
}
#v2StageHome.saved-collapsed .v2-stage-head{
  margin-bottom:0;
}

/* =========================================================
   COMPACT SAVED EXTERIOR SUMMARY
   Completed exteriors collapse just like saved Home Information.
   UNLOCK expands the full exterior controls again.
   ========================================================= */
.v2-exterior-fields.collapsed{display:none}
#v2StageExterior.saved-collapsed{
  background:#f3f4f6;
  border-color:#d1d5db;
}
#v2StageExterior.saved-collapsed .v2-stage-head{
  margin-bottom:0;
}
.v2-exterior-summary{
  display:none;
  margin-top:10px;
  padding:10px 11px;
  border:1px solid #dfe3e6;
  border-radius:8px;
  background:#fff;
}
.v2-exterior-summary.show{display:block}
.v2-exterior-summary-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px 10px;
}
.v2-exterior-summary-item{
  min-width:0;
}
.v2-exterior-summary-item.full{
  grid-column:1 / -1;
}
.v2-exterior-summary-label{
  display:block;
  font-size:9px;
  font-weight:800;
  letter-spacing:.07em;
  color:#6b7280;
  text-transform:uppercase;
  margin-bottom:2px;
}
.v2-exterior-summary-value{
  display:block;
  font-size:11px;
  font-weight:800;
  color:#1f2937;
  line-height:1.3;
  white-space:normal;
}


/* =========================================================
   COMPACT CONFLICT STATUS
   Green = one-line confirmation.
   Conflicts automatically expand using the existing status content.
   ========================================================= */
.v2-section.v2-conflict-compact{
  margin:0 0 10px !important;
  padding:0 !important;
  border:0 !important;
  background:transparent !important;
}
.v2-section.v2-conflict-compact .v2-conflict-title{
  display:none !important;
}
.v2-section.v2-conflict-compact .v2-status{
  margin:0 !important;
  min-height:0 !important;
  padding:7px 10px !important;
  border-radius:7px !important;
  font-size:11px !important;
  line-height:1.25 !important;
}
.v2-section.v2-conflict-compact .v2-status:not(.bad){
  border:1px solid #bbdfc7 !important;
  background:#eef9f1 !important;
  color:#18733a !important;
  font-weight:800 !important;
}
.v2-section.v2-conflict-compact .v2-status.bad{
  padding:10px 11px !important;
  border:1px solid #efb2b2 !important;
  background:#fff2f2 !important;
  color:#a51d1d !important;
  font-size:11.5px !important;
  line-height:1.4 !important;
}


/* =========================================================
   FIELD-LEVEL CONFLICT HIGHLIGHTING
   The top box stays one line; conflicting controls show the detail.
   ========================================================= */
.v2-field-conflict{
  border:2px solid #dc2626 !important;
  background:#fff1f2 !important;
  box-shadow:0 0 0 2px rgba(220,38,38,.08) !important;
}
label.v2-label-conflict{
  color:#b91c1c !important;
  font-weight:800 !important;
}

</style>


<script id="community-v2-upgrade">

(() => {

  const STORAGE =
  "newCommunityExteriorControlMap_local_v1";

  // =========================================================
  // LIVE SHARED MODE
  // Uses the existing Netlify Blobs endpoint and ETag protection.
  // =========================================================
  const LOCAL_TEST_MODE = false;

  const mapstage =
  document.querySelector(".mapstage");

  const svg =
  mapstage &&
  mapstage.querySelector("svg");

  const mapCard =
  document.querySelector(".mapwrap");

  const aside =
  document.querySelector("aside.card");


  if(
    !mapstage ||
    !svg ||
    !mapCard ||
    !aside
  ){

    alert(
      "Community map upgrade could not find the original map."
    );

    return;

  }


  /* =========================================================
     STOP OLD PROTOTYPE LOT CLICK HANDLERS
     ========================================================= */

  document.addEventListener(
    "click",
    e => {

      const lot =
      e.target.closest &&
      e.target.closest(".lot");


      if(
        lot &&
        mapstage.contains(lot)
      ){

        e.preventDefault();

        e.stopPropagation();

        e.stopImmediatePropagation();

        handleLotClick(
          lot.dataset.id
        );

      }

    },
    true
  );


  document.addEventListener(
    "keydown",
    e => {

      const lot =
      e.target.closest &&
      e.target.closest(".lot");


      if(
        lot &&
        mapstage.contains(lot) &&
        (
          e.key === "Enter" ||
          e.key === " "
        )
      ){

        e.preventDefault();

        e.stopPropagation();

        e.stopImmediatePropagation();

        handleLotClick(
          lot.dataset.id
        );

      }

    },
    true
  );


  /* =========================================================
     MAP CONTROLS
     ========================================================= */

  const mapbar =
  document.createElement("div");

  mapbar.className =
  "v2-mapbar";


  mapbar.innerHTML = `

    <span class="v2-zoom-title">Zoom</span>
    <button
      type="button"
      id="v2ZoomOut">−</button>

    <span
      class="v2-zoomread"
      id="v2ZoomRead"
      style="display:none">
      150%
    </span>

    <button
      type="button"
      id="v2ZoomIn">+</button>

    <button
      type="button"
      id="v2ZoomReset"
      style="display:none">
      150%
    </button>

    <button
      type="button"
      id="v2Fit" style="display:none">
      Fit
    </button>

  `;


  mapCard.insertBefore(
    mapbar,
    mapstage
  );


  /* =========================================================
     REPLACE OLD RIGHT PANEL
     ========================================================= */

  aside.innerHTML = `

    <div class="v2-drag-handle" id="v2DragHandle" title="Click and drag to move this box">
      <span class="v2-drag-grip">⠿</span>
      CLICK + DRAG TO MOVE
    </div>

    <div class="v2-panel-eyebrow">HOMESITE DETAILS</div>

    <h2 id="v2PlotTitle">
      Select a homesite
    </h2>

    <div class="v2-help v2-panel-intro">
      Choose a homesite on the map to review or enter its approved exterior selections.
    </div>


    <div
      id="v2Editor"
      style="display:none">

      <!-- CONFLICT STATUS AT TOP -->
      <div class="v2-section v2-conflict-compact" style="margin-top:0">

        <div class="v2-title v2-conflict-title">
          Selection Check
        </div>

        <div
          class="v2-status"
          id="v2Status">

          No conflicts found yet.

        </div>

      </div>


     <!-- LOT / BLOCK are assigned from the password-protected Edit mode. -->

<!-- =========================================================
     STAGE 1 — HOME INFORMATION
     ========================================================= -->
<!-- =====================================================
       QUICK EDIT — top of floating panel
       Visible only while password-protected Edit mode is unlocked.
       ===================================================== -->
    <div class="v2-quick-lot-edit" id="v2QuickLotEdit">
      <div class="v2-title">Edit Homesite</div>

      <div class="v2-quick-lot-grid">
        <div>
          <label for="v2EditLot">Lot</label>
          <input id="v2EditLot" placeholder="Lot">
        </div>

        <div>
          <label for="v2EditBlock">Block</label>
          <input id="v2EditBlock" placeholder="Block">
        </div>

        <button type="button" class="primary v2-quick-save" id="v2SaveLotBlock">
          Save Homesite
        </button>
      </div>

      <div class="v2-quick-restrictions">
        <div class="v2-quick-restriction-head">
          <div>
            <div class="v2-title" style="margin:0;">Restricted Lots</div>
            <div class="v2-help" id="v2QuickRestrictionHelp">
              Click <b>Add Restricted Lots</b>, then click the lots on the map that cannot repeat this homesite.
            </div>
          </div>

          <button type="button" class="secondary" id="v2RestrictionPickMode">
            Add Restricted Lots
          </button>
        </div>

        <label class="v2-check" style="margin-top:8px;">
          <input type="checkbox" id="v2QuickTwoWay" checked>
          Make restrictions two-way automatically
        </label>

        <div class="v2-chips" id="v2QuickChips"></div>
      </div>
    </div>

    <div class="v2-stage-card" id="v2StageHome">
  <div class="v2-stage-head">
    <div>
      <div class="v2-stage-kicker">STAGE 1</div>
      <div class="v2-stage-name">Home Information</div>
    </div>
    <span class="v2-stage-chip" id="v2HomeStageChip">Not Saved</span>
  </div>

  <div class="v2-home-fields" id="v2HomeFields">
    <label for="v2Address">Address *</label>
    <input id="v2Address" placeholder="1234 Main Street">

    <div class="v2-grid2">
      <div>
        <label for="v2Plan">House Plan *</label>
        <select id="v2Plan">
          <!-- HOUSE PLAN OPTIONS - TYPE YOUR ACTUAL PLANS HERE -->
          <option value="">Select Plan</option>
          <option value="1676">1676</option>
          <option value="1793">1793</option>
          <option value="1965">1965</option>
          <option value="2382">2382</option>
          <option value="2444">2444</option>
          <option value="2501">2501</option>
          <option value="2824">2824</option>
          <option value="2881">2881</option>
          <option value="2967">2967</option>
          <option value="3475">3475</option>
        </select>
      </div>

      <div>
        <label for="v2Elevation">Elevation *</label>
        <select id="v2Elevation">
          <!-- ELEVATION OPTIONS - TYPE YOUR ACTUAL ELEVATIONS HERE -->
          <option value="">Select Elevation</option>
          <option value="B">B</option>
          <option value="S">S</option>
          <option value="V">V</option>
          <option value="X">X</option>
        </select>
      </div>
    </div>

    <div>
      <label>Exterior Type</label>
      <div id="v2ExteriorTypeDisplay"
        style="padding:9px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#f8fafc;font-weight:700;color:#475569;">
        Choose Elevation First
      </div>
      <input type="radio" name="v2ExteriorType" id="v2AllSiding" value="all-siding" style="display:none">
      <input type="radio" name="v2ExteriorType" id="v2WithBrick" value="brick" style="display:none">
    </div>

    <div class="v2-stage-actions">
      <button type="button" class="primary" id="v2SaveHome">Save Home</button>
    </div>
  </div>

  <div class="v2-home-summary" id="v2HomeSummary">
    <div class="v2-home-summary-grid">
      <div>
        <span class="v2-home-summary-label">Address</span>
        <span class="v2-home-summary-value" id="v2HomeSummaryAddress">—</span>
      </div>
      <div>
        <span class="v2-home-summary-label">Plan / Elevation</span>
        <span class="v2-home-summary-value" id="v2HomeSummaryPlanElevation">—</span>
      </div>
    </div>

    <div class="v2-stage-actions" style="margin-top:8px">
      <button type="button" class="secondary" id="v2EditHome">Edit Home</button>
    </div>
  </div>
</div>

<!-- =========================================================
     STAGE 2 — EXTERIOR SELECTIONS
     ========================================================= -->
<div class="v2-stage-card" id="v2StageExterior">
  <div class="v2-stage-head">
    <div>
      <div class="v2-stage-kicker">STAGE 2</div>
      <div class="v2-stage-name">Exterior Selections</div>
    </div>
    <span class="v2-stage-chip" id="v2ExteriorStageChip">Waiting for Home</span>
  </div>

  <div class="v2-exterior-fields" id="v2ExteriorFields">

  <div id="v2BrickWrap" style="display:none">
    <label for="v2Brick">Brick *</label>
    <select id="v2Brick">
      <!-- BRICK OPTIONS - TYPE YOUR ACTUAL BRICK NAMES HERE -->
      <option value="">Select Brick</option>
      <option value="Brick 1">Adobe Wells</option>
      <option value="Brick 2">Sonoran Desert</option>
      <option value="Brick 3">Stone Bay</option>
      <option value="Brick 4">Grey Fog</option>
      <option value="Brick 5">Cibolo Trail</option>
      <option value="Brick 6">Mocha Brown Antique</option>
      <option value="Brick 7">Old Fancisco</option>
      <option value="Brick 8">White Birch</option>
      <option value="Brick 9">Cottonwood</option>
      <option value="Brick 10">Frostwood</option>
      <option value="Brick 11">STONE ONLY - Cream Stone</option>
      <option value="Brick 12">STONE ONLY - Texas Mix</option>
      <option value="Brick 13">STONE ONLY - Smokey Mountain</option>
    </select>
  </div>

  <label for="v2Scheme">Scheme *</label>
  <select id="v2Scheme" disabled>
    <option value="">Save Home First</option>
  </select>

  <div class="v2-scheme-summary" id="v2SchemeSummary" style="display:none">
    <div class="v2-scheme-summary-head">
      <span>Scheme Colors</span>
      <span class="v2-test-chip">SET BY SCHEME</span>
    </div>
    <div class="v2-color-row">
      <span>Primary Siding</span>
      <span id="v2PrimaryColor">—</span>
    </div>
    <div class="v2-color-row" id="v2SecondaryColorRow">
      <span>Secondary Siding</span>
      <span id="v2SecondaryColor">—</span>
    </div>
    <div class="v2-color-row">
      <span>Trim / Soffit / Columns</span>
      <span id="v2TrimColor">—</span>
    </div>
    <div class="v2-color-row">
      <span>Fascia</span>
      <span id="v2FasciaColor">—</span>
    </div>
  </div>

  <label for="v2Door">Front Door Color *</label>
  <select id="v2Door" disabled>
    <option value="">Choose Scheme First</option>
  </select>

  <label for="v2Garage">Garage Door Color *</label>
  <select id="v2Garage" disabled>
    <option value="">Choose Entry Door First</option>
  </select>

  <label for="v2Shutters">Shutter Color *</label>
  <select id="v2Shutters" disabled>
    <option value="">Choose Garage Door First</option>
  </select>

  <div class="v2-help" style="margin-top:9px">
    Selection order: Scheme → Entry Door → Garage Door → Shutters.
  </div>

  <div class="v2-stage-actions">
    <button type="button" class="primary" id="v2Save">Save Exterior</button>
  </div>
  </div>

  <div class="v2-exterior-summary" id="v2ExteriorSummary">
    <div class="v2-exterior-summary-grid">
      <div class="v2-exterior-summary-item" id="v2ExteriorSummaryBrickItem">
        <span class="v2-exterior-summary-label">Brick</span>
        <span class="v2-exterior-summary-value" id="v2ExteriorSummaryBrick">—</span>
      </div>

      <div class="v2-exterior-summary-item">
        <span class="v2-exterior-summary-label">Scheme</span>
        <span class="v2-exterior-summary-value" id="v2ExteriorSummaryScheme">—</span>
      </div>

      <div class="v2-exterior-summary-item">
        <span class="v2-exterior-summary-label">Primary Siding</span>
        <span class="v2-exterior-summary-value" id="v2ExteriorSummaryPrimary">—</span>
      </div>

      <div class="v2-exterior-summary-item" id="v2ExteriorSummarySecondaryItem">
        <span class="v2-exterior-summary-label">Secondary Siding</span>
        <span class="v2-exterior-summary-value" id="v2ExteriorSummarySecondary">—</span>
      </div>

      <div class="v2-exterior-summary-item">
        <span class="v2-exterior-summary-label">Trim / Soffit / Columns</span>
        <span class="v2-exterior-summary-value" id="v2ExteriorSummaryTrim">—</span>
      </div>

      <div class="v2-exterior-summary-item">
        <span class="v2-exterior-summary-label">Fascia</span>
        <span class="v2-exterior-summary-value" id="v2ExteriorSummaryFascia">—</span>
      </div>

      <div class="v2-exterior-summary-item">
        <span class="v2-exterior-summary-label">Front Door</span>
        <span class="v2-exterior-summary-value" id="v2ExteriorSummaryDoor">—</span>
      </div>

      <div class="v2-exterior-summary-item">
        <span class="v2-exterior-summary-label">Garage Door</span>
        <span class="v2-exterior-summary-value" id="v2ExteriorSummaryGarage">—</span>
      </div>

      <div class="v2-exterior-summary-item full">
        <span class="v2-exterior-summary-label">Shutters</span>
        <span class="v2-exterior-summary-value" id="v2ExteriorSummaryShutters">—</span>
      </div>
    </div>
  </div>
</div>


<div class="v2-lockbar" id="v2LockBar">
  <div class="v2-locktext" id="v2LockText">
    <strong>Not yet saved</strong>
    Save the home first, then complete the exterior selections.
  </div>

  <button type="button" class="v2-unlock" id="v2Unlock" style="display:none">
    UNLOCK
  </button>
</div>

<div class="v2-actions">
  <button type="button" class="secondary" id="v2Clear">
    Clear Form
  </button>

  <button type="button" class="danger" id="v2ClearSavedHome" style="display:none">
    Clear Saved Home
  </button>
</div>


      <div
        class="v2-section"
        id="v2RestrictionsSection"
        style="display:none">
        <div class="v2-title">
          Manual Restrictions
        </div>


        <div
          class="v2-help"
          id="v2RestrictionHelp">

          Restrictions are view-only.
          Click <b>Edit</b> above the map and enter the password
          to make changes.

        </div>


        <div
          id="v2RestrictionAdminControls"
          style="display:none">

          <label class="v2-check">

            <input
              type="checkbox"
              id="v2TwoWay"
              checked>

            Make restrictions two-way automatically

          </label>


          <div
            class="v2-note"
            id="v2ModeNote"
            style="display:none">

            <b>
              Restriction editing is ON.
            </b>

            <br>

            Click other homesites to add or remove them
            from this lot's restriction list.

          </div>

        </div>


        <div
          class="v2-chips"
          id="v2Chips">
        </div>

      </div>



    </div>




  `;

  // Keep the homesite details panel hidden until a lot is clicked.
  aside.style.display = "none";

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="v2-modal-backdrop" id="v2ConflictModal">
      <div class="v2-modal" role="dialog" aria-modal="true" aria-labelledby="v2ConflictTitle">
        <h3 id="v2ConflictTitle">Conflict Found</h3>

        <p>
          These selections conflict with one or more restricted homesites.
          The homesite cannot be saved unless an approved override reason is entered.
        </p>

        <div class="v2-modal-conflicts" id="v2ConflictModalList"></div>

        <label for="v2OverrideReason">Override Reason</label>
        <textarea
          id="v2OverrideReason"
          placeholder="Example: Approved per SG"></textarea>

        <div class="v2-help" style="margin-top:6px">
          A reason is required and will be saved with this homesite.
        </div>

        <div class="v2-modal-actions">
          <button type="button" class="secondary" id="v2CancelOverride">Cancel</button>
          <button type="button" class="primary" id="v2OverrideSave" disabled>Override &amp; Save</button>
        </div>
      </div>
    </div>
    `
  );


  /* =========================================================
     STATE
     ========================================================= */

const lots =
Array.from(
  svg.querySelectorAll(".lot")
);

/* Give every clickable lot a permanent internal ID */
lots.forEach((el, index) => {

  if (
    !el.dataset.id ||
    el.dataset.id === "undefined"
  ) {

    el.dataset.id =
      "P" +
      String(index + 1).padStart(2, "0");

  }

});

const ids =
lots.map(
  el => el.dataset.id
);


/* =========================================================
   LOT / BLOCK ASSIGNMENTS
   Enter these in the password-protected Edit mode.
   They are stored with the plot record, separate from home data.
   ========================================================= */
const PERMANENT_LOTS = {};



  /* =========================================================
     STONEY CHASE PERMANENT HOMESITE SETUP
     Baked from the completed 249-lot setup.
     This provides Lot / Block and restriction relationships on
     a fresh browser even before anything has been saved locally.
     ========================================================= */
  const STONEY_DEFAULT_PLOTS = {"L001":{"restricted":["L051","L024","L002"],"lot":"44","tract":"A"},"L002":{"restricted":["L001","L003"],"lot":"45","tract":"A"},"L003":{"restricted":["L002","L004"],"lot":"46","tract":"A"},"L004":{"restricted":["L003","L005"],"lot":"47","tract":"A"},"L005":{"restricted":["L004","L006"],"lot":"48","tract":"A"},"L006":{"restricted":["L005","L007"],"lot":"49","tract":"A"},"L007":{"restricted":["L006","L008"],"lot":"50","tract":"A"},"L008":{"restricted":["L007"],"lot":"51","tract":"A"},"L009":{"restricted":["L010","L041"],"lot":"1","tract":"G"},"L010":{"restricted":["L009","L011","L042","L041"],"lot":"2","tract":"G"},"L011":{"restricted":["L010","L012","L043","L042"],"lot":"3","tract":"G"},"L012":{"restricted":["L011","L013","L044","L043"],"lot":"4","tract":"G"},"L013":{"restricted":["L012","L014","L045","L044"],"lot":"5","tract":"G"},"L014":{"restricted":["L013","L015","L046","L045"],"lot":"6","tract":"G"},"L015":{"restricted":["L014","L016","L047","L046"],"lot":"7","tract":"G"},"L016":{"restricted":["L015","L017","L048","L047"],"lot":"8","tract":"G"},"L017":{"restricted":["L016","L018","L049","L048"],"lot":"9","tract":"G"},"L018":{"restricted":["L017","L019","L049"],"lot":"10","tract":"G"},"L019":{"restricted":["L018"],"lot":"11","tract":"G"},"L020":{"restricted":["L057","L058","L031","L021"],"lot":"39","tract":"A"},"L021":{"restricted":["L058","L059","L020","L022"],"lot":"40","tract":"A"},"L022":{"restricted":["L059","L060","L021","L023"],"lot":"41","tract":"A"},"L023":{"restricted":["L060","L050","L022","L024"],"lot":"42","tract":"A"},"L024":{"restricted":["L050","L051","L023","L001"],"lot":"43","tract":"A"},"L025":{"restricted":["L038","L026","L072","L071"],"lot":"32","tract":"A"},"L026":{"restricted":["L025","L072","L073","L027"],"lot":"33","tract":"A"},"L027":{"restricted":["L073","L074","L026","L028"],"lot":"34","tract":"A"},"L028":{"restricted":["L074","L075","L027","L029"],"lot":"35","tract":"A"},"L029":{"restricted":["L030","L028","L055","L075"],"lot":"36","tract":"A"},"L030":{"restricted":["L029","L055","L056","L031"],"lot":"37","tract":"A"},"L031":{"restricted":["L056","L057","L030","L020"],"lot":"38","tract":"A"},"L032":{"restricted":["L064","L065","L033"],"lot":"25","tract":"A"},"L033":{"restricted":["L034","L032","L065","L066"],"lot":"26","tract":"A"},"L034":{"restricted":["L033","L066","L067","L035"],"lot":"27","tract":"A"},"L035":{"restricted":["L067","L068","L034","L036"],"lot":"28","tract":"A"},"L036":{"restricted":["L068","L069","L035","L037"],"lot":"29","tract":"A"},"L037":{"restricted":["L069","L070","L036","L038"],"lot":"30","tract":"A"},"L038":{"restricted":["L025","L070","L071","L037"],"lot":"31","tract":"A"},"L039":{"restricted":["L052","L040"],"lot":"22","tract":"B"},"L040":{"restricted":["L039","L052","L053"],"lot":"2","tract":"E"},"L041":{"restricted":["L009","L010","L042"],"lot":"1","tract":"H"},"L042":{"restricted":["L010","L011","L041","L043"],"lot":"2","tract":"H"},"L043":{"restricted":["L011","L012","L042","L044"],"lot":"3","tract":"H"},"L044":{"restricted":["L012","L013","L043","L045"],"lot":"4","tract":"H"},"L045":{"restricted":["L013","L014","L044","L046"],"lot":"5","tract":"H"},"L046":{"restricted":["L014","L015","L045","L047"],"lot":"6","tract":"H"},"L047":{"restricted":["L015","L016","L046","L048"],"lot":"7","tract":"H"},"L048":{"restricted":["L016","L017","L047","L049"],"lot":"8","tract":"H"},"L049":{"restricted":["L017","L018","L048"],"lot":"9","tract":"H"},"L050":{"restricted":["L060","L051","L023","L024"],"lot":"20","tract":"B"},"L051":{"restricted":["L050","L024","L001"],"lot":"21","tract":"B"},"L052":{"restricted":["L039","L061","L040","L053"],"lot":"23","tract":"B"},"L053":{"restricted":["L052","L061","L040","L062"],"lot":"3","tract":"E"},"L054":{"restricted":["L063"],"lot":"24","tract":"A"},"L055":{"restricted":["L075","L056","L029","L030"],"lot":"14","tract":"B"},"L056":{"restricted":["L055","L057","L030","L031"],"lot":"15","tract":"B"},"L057":{"restricted":["L056","L058","L031","L020"],"lot":"16","tract":"B"},"L058":{"restricted":["L057","L059","L020","L021"],"lot":"17","tract":"B"},"L059":{"restricted":["L058","L060","L021","L022"],"lot":"18","tract":"B"},"L060":{"restricted":["L059","L050","L022","L023"],"lot":"19","tract":"B"},"L061":{"restricted":["L052","L077","L053","L062"],"lot":"24","tract":"B"},"L062":{"restricted":["L061","L077","L053","L078"],"lot":"4","tract":"E"},"L063":{"restricted":["L076","L054"],"lot":"23","tract":"A"},"L064":{"restricted":["L032","L065"],"lot":"1","tract":"B"},"L065":{"restricted":["L032","L033","L064","L066"],"lot":"2","tract":"B"},"L066":{"restricted":["L033","L065","L067","L034"],"lot":"3","tract":"B"},"L067":{"restricted":["L066","L068","L034","L035"],"lot":"4","tract":"B"},"L068":{"restricted":["L067","L069","L035","L036"],"lot":"5","tract":"B"},"L069":{"restricted":["L068","L070","L036","L037"],"lot":"6","tract":"B"},"L070":{"restricted":["L069","L071","L037","L038"],"lot":"7","tract":"B"},"L071":{"restricted":["L070","L072","L038","L025"],"lot":"8","tract":"B"},"L072":{"restricted":["L025","L071","L073","L026"],"lot":"9","tract":"B"},"L073":{"restricted":["L072","L074","L026","L027"],"lot":"10","tract":"B"},"L074":{"restricted":["L073","L027","L028","L075"],"lot":"11","tract":"B"},"L075":{"restricted":["L055","L074","L028","L029"],"lot":"13","tract":"B"},"L076":{"restricted":["L091","L063"],"lot":"22","tract":"A"},"L077":{"restricted":["L061","L089","L062","L078"],"lot":"25","tract":"B"},"L078":{"restricted":["L077","L089","L062","L090"],"lot":"5","tract":"E"},"L079":{"restricted":["L080","L118","L119"],"lot":"18","tract":"H"},"L080":{"restricted":["L079","L081","L119","L120"],"lot":"17","tract":"H"},"L081":{"restricted":["L080","L082","L120","L121"],"lot":"16","tract":"H"},"L082":{"restricted":["L081","L083","L122","L121"],"lot":"15","tract":"H"},"L083":{"restricted":["L082","L084","L122","L123"],"lot":"14","tract":"H"},"L084":{"restricted":["L083","L085","L124","L123"],"lot":"13","tract":"H"},"L085":{"restricted":["L084","L086","L125","L124"],"lot":"12","tract":"H"},"L086":{"restricted":["L085","L087","L125"],"lot":"11","tract":"H"},"L087":{"restricted":["L086","L125"],"lot":"10","tract":"H"},"L088":{"restricted":["L144","L110"],"lot":"28","tract":"B"},"L089":{"restricted":["L077","L111","L078","L090"],"lot":"26","tract":"B"},"L090":{"restricted":["L089","L111","L078","L114"],"lot":"6","tract":"E"},"L091":{"restricted":["L112","L076"],"lot":"21","tract":"A"},"L092":{"restricted":["L113","L147"],"lot":"49","tract":"B"},"L093":{"restricted":["L094","L113","L150","L149"],"lot":"47","tract":"B"},"L094":{"restricted":["L095","L093","L150","L129"],"lot":"46","tract":"B"},"L095":{"restricted":["L096","L094","L130","L129"],"lot":"45","tract":"B"},"L096":{"restricted":["L097","L095","L131","L130"],"lot":"44","tract":"B"},"L097":{"restricted":["L098","L096","L132","L131"],"lot":"43","tract":"B"},"L098":{"restricted":["L099","L097","L133","L132"],"lot":"42","tract":"B"},"L099":{"restricted":["L100","L098","L134","L133"],"lot":"41","tract":"B"},"L100":{"restricted":["L101","L099","L135","L134"],"lot":"40","tract":"B"},"L101":{"restricted":["L102","L100","L135"],"lot":"39","tract":"B"},"L102":{"restricted":["L103","L101"],"lot":"38","tract":"B"},"L103":{"restricted":["L136","L137","L104","L102"],"lot":"36","tract":"B"},"L104":{"restricted":["L137","L138","L105","L103"],"lot":"35","tract":"B"},"L105":{"restricted":["L138","L139","L106","L104"],"lot":"34","tract":"B"},"L106":{"restricted":["L139","L140","L107","L105"],"lot":"33","tract":"B"},"L107":{"restricted":["L140","L141","L108","L106"],"lot":"32","tract":"B"},"L108":{"restricted":["L141","L142","L109","L107"],"lot":"31","tract":"B"},"L109":{"restricted":["L142","L143","L110","L108"],"lot":"30","tract":"B"},"L110":{"restricted":["L143","L144","L088","L109"],"lot":"29","tract":"B"},"L111":{"restricted":["L089","L090","L114"],"lot":"27","tract":"B"},"L112":{"restricted":["L115","L091"],"lot":"20","tract":"A"},"L113":{"restricted":["L093","L092","L149","L148"],"lot":"48","tract":"B"},"L114":{"restricted":["L111","L090","L116"],"lot":"7","tract":"E"},"L115":{"restricted":["L126","L112"],"lot":"19","tract":"A"},"L116":{"restricted":["L114","L117"],"lot":"8","tract":"E"},"L117":{"restricted":["L127","L116","L146"],"lot":"9","tract":"E"},"L118":{"restricted":["L079","L119"],"lot":"1","tract":"I"},"L119":{"restricted":["L079","L080","L118","L120"],"lot":"2","tract":"I"},"L120":{"restricted":["L080","L081","L119","L121"],"lot":"3","tract":"I"},"L121":{"restricted":["L081","L082","L120","L122"],"lot":"4","tract":"1"},"L122":{"restricted":["L082","L083","L121","L123"],"lot":"5","tract":"1"},"L123":{"restricted":["L083","L084","L122","L124"],"lot":"6","tract":"1"},"L124":{"restricted":["L084","L085","L123","L125"],"lot":"7","tract":"I"},"L125":{"restricted":["L085","L086","L087","L124"],"lot":"8","tract":"I"},"L126":{"restricted":["L128","L115"],"lot":"18","tract":"A"},"L127":{"restricted":["L117","L146","L145"],"lot":"10","tract":"D"},"L128":{"restricted":["L157","L126"],"lot":"17","tract":"A"},"L129":{"restricted":["L095","L094","L150","L130"],"lot":"5","tract":"C"},"L130":{"restricted":["L095","L096","L131","L129"],"lot":"6","tract":"C"},"L131":{"restricted":["L096","L097","L132","L130"],"lot":"7","tract":"C"},"L132":{"restricted":["L097","L098","L133","L131"],"lot":"8","tract":"C"},"L133":{"restricted":["L098","L099","L134","L132"],"lot":"9","tract":"C"},"L134":{"restricted":["L099","L100","L135","L133"],"lot":"10","tract":"C"},"L135":{"restricted":["L100","L101","L134"],"lot":"11","tract":"C"},"L136":{"restricted":["L103","L137"],"lot":"1","tract":"D"},"L137":{"restricted":["L136","L138","L104","L103"],"lot":"2","tract":"D"},"L138":{"restricted":["L137","L139","L105","L104"],"lot":"3","tract":"D"},"L139":{"restricted":["L138","L140","L106","L105"],"lot":"4","tract":"D"},"L140":{"restricted":["L139","L141","L107","L106"],"lot":"5","tract":"D"},"L141":{"restricted":["L140","L142","L108","L107"],"lot":"6","tract":"D"},"L142":{"restricted":["L141","L143","L109","L108"],"lot":"7","tract":"D"},"L143":{"restricted":["L142","L144","L110","L109"],"lot":"8","tract":"D"},"L144":{"restricted":["L143","L088","L110"],"lot":"9","tract":"D"},"L145":{"restricted":["L127","L158","L146","L151"],"lot":"11","tract":"D"},"L146":{"restricted":["L127","L145","L117","L151"],"lot":"10","tract":"E"},"L147":{"restricted":["L092","L148"],"lot":"1","tract":"C"},"L148":{"restricted":["L113","L147","L149"],"lot":"2","tract":"C"},"L149":{"restricted":["L113","L093","L150","L148"],"lot":"3","tract":"C"},"L150":{"restricted":["L094","L093","L149","L129"],"lot":"4","tract":"C"},"L151":{"restricted":["L145","L158","L146","L168"],"lot":"11","tract":"E"},"L152":{"restricted":["L153","L199"],"lot":"14","tract":"I"},"L153":{"restricted":["L154","L152","L200"],"lot":"13","tract":"I"},"L154":{"restricted":["L155","L153","L201"],"lot":"12","tract":"I"},"L155":{"restricted":["L156","L154","L202","L201"],"lot":"11","tract":"I"},"L156":{"restricted":["L159","L155","L205","L202"],"lot":"10","tract":"I"},"L157":{"restricted":["L128"],"lot":"16","tract":"A"},"L158":{"restricted":["L145","L167","L151","L168"],"lot":"12","tract":"D"},"L159":{"restricted":["L156","L205","L206"],"lot":"9","tract":"I"},"L160":{"restricted":["L161","L228"],"lot":"22","tract":"D"},"L161":{"restricted":["L162","L160","L208"],"lot":"21","tract":"D"},"L162":{"restricted":["L163","L161","L209"],"lot":"20","tract":"D"},"L163":{"restricted":["L164","L162","L229","L209"],"lot":"19","tract":"D"},"L164":{"restricted":["L165","L163","L230","L229"],"lot":"18","tract":"D"},"L165":{"restricted":["L166","L164","L230"],"lot":"17","tract":"D"},"L166":{"restricted":["L165","L231","L230"],"lot":"16","tract":"D"},"L167":{"restricted":["L158","L194","L168","L189","L198"],"lot":"13","tract":"D"},"L168":{"restricted":["L158","L167","L151","L189"],"lot":"12","tract":"E"},"L169":{"restricted":["L190","L233","L210"],"lot":"1","tract":"J"},"L170":{"restricted":["L207","L196","L171","L172","L213"],"lot":"6","tract":"A"},"L171":{"restricted":["L207","L196","L170","L172","L213"],"lot":"7","tract":"A"},"L172":{"restricted":["L207","L196","L170","L171","L173","L213"],"lot":"8","tract":"A"},"L173":{"restricted":["L172","L174","L213"],"lot":"9","tract":"A"},"L174":{"restricted":["L173","L175","L214","L213"],"lot":"10","tract":"A"},"L175":{"restricted":["L174","L176","L235","L214"],"lot":"11","tract":"A"},"L176":{"restricted":["L175","L193","L236","L235"],"lot":"12","tract":"A"},"L177":{"restricted":["L193","L178","L238"],"lot":"14","tract":"A"},"L178":{"restricted":["L177","L216","L215"],"lot":"15","tract":"A"},"L179":{"restricted":["L180","L218","L217"],"lot":"21","tract":"C"},"L180":{"restricted":["L181","L179","L219","L218"],"lot":"20","tract":"C"},"L181":{"restricted":["L182","L180","L220","L219"],"lot":"19","tract":"C"},"L182":{"restricted":["L183","L181","L220","L221"],"lot":"18","tract":"C"},"L183":{"restricted":["L184","L182","L222","L221"],"lot":"17","tract":"C"},"L184":{"restricted":["L185","L183","L223","L222"],"lot":"16","tract":"C"},"L185":{"restricted":["L186","L184","L223","L224"],"lot":"15","tract":"C"},"L186":{"restricted":["L185","L187","L225","L224"],"lot":"14","tract":"C"},"L187":{"restricted":["L188","L186","L225","L226"],"lot":"13","tract":"C"},"L188":{"restricted":["L227","L226","L187"],"lot":"12","tract":"C"},"L189":{"restricted":["L167","L168","L198"],"lot":"13","tract":"E"},"L190":{"restricted":["L169","L191","L233"],"lot":"2","tract":"J"},"L191":{"restricted":["L190","L192","L240","L241"],"lot":"3","tract":"J"},"L192":{"restricted":["L191","L241","L244","L247","L242","L211","L203","L195"],"lot":"4","tract":"J"},"L193":{"restricted":["L176","L177","L237","L236"],"lot":"13","tract":"A"},"L194":{"restricted":["L167","L197","L198","L204","L232"],"lot":"14","tract":"D"},"L195":{"restricted":["L192","L203","L211","L242","L247","L244"],"lot":"5","tract":"J"},"L196":{"restricted":["L207","L170","L171","L172","L213"],"lot":"5","tract":"A"},"L197":{"restricted":["L194","L232"],"lot":"15","tract":"D"},"L198":{"restricted":["L167","L194","L189","L204"],"lot":"14","tract":"E"},"L199":{"restricted":["L152","L200"],"lot":"20","tract":"J"},"L200":{"restricted":["L153","L201","L199"],"lot":"19","tract":"J"},"L201":{"restricted":["L155","L154","L202","L200"],"lot":"18","tract":"J"},"L202":{"restricted":["L156","L155","L205","L201"],"lot":"17","tract":"J"},"L203":{"restricted":["L192","L195","L211","L242","L247","L244"],"lot":"6","tract":"J"},"L204":{"restricted":["L194","L198","L232"],"lot":"15","tract":"E"},"L205":{"restricted":["L159","L156","L206","L202"],"lot":"16","tract":"J"},"L206":{"restricted":["L159","L210","L205"],"lot":"15","tract":"J"},"L207":{"restricted":["L212","L196","L170","L171","L172"],"lot":"4","tract":"A"},"L208":{"restricted":["L228","L209","L161"],"lot":"2","tract":"AA"},"L209":{"restricted":["L162","L163","L229","L208"],"lot":"3","tract":"AA"},"L210":{"restricted":["L169","L233","L206"],"lot":"14","tract":"J"},"L211":{"restricted":["L192","L195","L203","L242","L247","L244"],"lot":"7","tract":"J"},"L212":{"restricted":["L234","L207"],"lot":"3","tract":"A"},"L213":{"restricted":["L172","L173","L174","L214","L171","L170","L196"],"lot":"2","tract":"F"},"L214":{"restricted":["L213","L174","L175","L235"],"lot":"3","tract":"F"},"L215":{"restricted":["L216","L238","L178"],"lot":"8","tract":"F"},"L216":{"restricted":["L178","L215","L217"],"lot":"9","tract":"F"},"L217":{"restricted":["L179","L218","L216"],"lot":"10","tract":"F"},"L218":{"restricted":["L179","L180","L219","L217"],"lot":"11","tract":"F"},"L219":{"restricted":["L181","L180","L218","L220"],"lot":"12","tract":"F"},"L220":{"restricted":["L219","L181","L182","L221"],"lot":"13","tract":"F"},"L221":{"restricted":["L220","L222","L183","L182"],"lot":"14","tract":"F"},"L222":{"restricted":["L183","L184","L223","L221"],"lot":"15","tract":"F"},"L223":{"restricted":["L185","L184","L222","L224"],"lot":"16","tract":"F"},"L224":{"restricted":["L225","L223","L185","L186"],"lot":"17","tract":"F"},"L225":{"restricted":["L187","L186","L224","L226"],"lot":"18","tract":"F"},"L226":{"restricted":["L188","L187","L225","L227"],"lot":"19","tract":"F"},"L227":{"restricted":["L188","L226"],"lot":"20","tract":"F"},"L228":{"restricted":["L160","L208"],"lot":"1","tract":"AA"},"L229":{"restricted":["L163","L164","L230","L209"],"lot":"4","tract":"AA"},"L230":{"restricted":["L231","L229","L165","L166","L164"],"lot":"5","tract":"AA"},"L231":{"restricted":["L239","L230","L166"],"lot":"6","tract":"AA"},"L232":{"restricted":["L194","L197","L204"],"lot":"16","tract":"E"},"L233":{"restricted":["L169","L190","L240","L210"],"lot":"13","tract":"J"},"L234":{"restricted":["L245","L212"],"lot":"2","tract":"A"},"L235":{"restricted":["L175","L176","L236","L214"],"lot":"4","tract":"F"},"L236":{"restricted":["L193","L176","L235","L237"],"lot":"5","tract":"F"},"L237":{"restricted":["L193","L238","L236"],"lot":"6","tract":"F"},"L238":{"restricted":["L177","L215","L237"],"lot":"7","tract":"F"},"L239":{"restricted":["L243","L231"],"lot":"7","tract":"AA"},"L240":{"restricted":["L191","L241","L233"],"lot":"12","tract":"J"},"L241":{"restricted":["L191","L192","L244","L240"],"lot":"11","tract":"J"},"L242":{"restricted":["L192","L195","L203","L211","L247","L244"],"lot":"8","tract":"J"},"L243":{"restricted":["L246","L239"],"lot":"8","tract":"AA"},"L244":{"restricted":["L192","L195","L203","L211","L242","L247","L241"],"lot":"10","tract":"J"},"L245":{"restricted":["L234"],"lot":"1","tract":"A"},"L246":{"restricted":["L248","L243"],"lot":"9","tract":"AA"},"L247":{"restricted":["L192","L195","L203","L211","L242","L244"],"lot":"9","tract":"J"},"L248":{"restricted":["L249","L246"],"lot":"10","tract":"AA"},"L249":{"restricted":["L248"],"lot":"11","tract":"AA"}};

  const freshPlots =
  Object.fromEntries(
    ids.map(id => [
      id,
      STONEY_DEFAULT_PLOTS[id]
        ? {
            restricted:[...(STONEY_DEFAULT_PLOTS[id].restricted || [])],
            lot:STONEY_DEFAULT_PLOTS[id].lot || "",
            tract:STONEY_DEFAULT_PLOTS[id].tract || ""
          }
        : {
            restricted:[],
            lot:"",
            tract:""
          }
    ])
  );


  let state;


  try{

    state =
    JSON.parse(
      localStorage.getItem(
        STORAGE
      )
      ||
      "null"
    );

  }
  catch(_){

    state = null;

  }


  if(
    !state ||
    !state.plots ||
    !state.data
  ){

    state = {

      plots:freshPlots,

      data:{},

      meta:{}

    };

  }


  if(
    !state.meta ||
    typeof state.meta !== "object"
  ){

    state.meta = {};

  }


  ids.forEach(
    id => {

      if(
        !state.plots[id]
      ){

        state.plots[id] = {
          restricted:[],
          lot:"",
          tract:""
        };

      }


      /* =========================================================
         APPLY BAKED STONEY SETUP TO OLDER LOCAL BROWSER DATA
         Older previews may already contain blank plot records in
         localStorage. Fill those blanks from STONEY_DEFAULT_PLOTS
         so the permanent Lot / Block and restriction setup appears.
         Existing non-blank user edits are preserved.
         ========================================================= */
      const bakedPlot = STONEY_DEFAULT_PLOTS[id] || null;

      if(bakedPlot){

        if(!state.plots[id].lot){
          state.plots[id].lot = bakedPlot.lot || "";
        }

        if(!state.plots[id].tract){
          state.plots[id].tract = bakedPlot.tract || "";
        }

        if(
          !Array.isArray(state.plots[id].restricted) ||
          state.plots[id].restricted.length === 0
        ){
          state.plots[id].restricted =
            [...(bakedPlot.restricted || [])];
        }

      } else if(
        !Array.isArray(
          state.plots[id].restricted
        )
      ){

        state.plots[id].restricted = [];

      }


      if(
        !state.meta[id] ||
        typeof state.meta[id] !== "object"
      ){

        state.meta[id] = {
          locked:false,
          lastSavedAt:"",
          overrideReason:"",
          overrideAt:""
        };

      }

    }
  );


  // Snapshot of the last shared state received from Netlify.
  // persist() compares against this so only changed homesites are written.
  let lastSyncedState = null;

  // Shared record version tracking.
  // Used to prevent one person from silently overwriting a homesite
  // that another person saved while it was being edited.
  let sharedEtags = {};
  let openedEtags = {};


  let selected =
  null;


  let unlockedForEdit =
  null;

  // Stage 1 has its own short-lived edit state after Home Information is saved.
  let homeEditingFor =
  null;


  let restrictionMode =
  false;


  let restrictionEditUnlocked =
  false;


  /* =========================================================
     RESTRICTION EDIT PASSWORD
     CHANGE THE PASSWORD HERE
     ========================================================= */

  const RESTRICTION_EDIT_PASSWORD =
  "KBhome123";


  let zoom =
  1.5;


  const BASE_W =
  1477;


  const $ =
  id =>
  document.getElementById(id);


const fields = {
  address:'v2Address',
  plan:'v2Plan',
  elevation:'v2Elevation',
  scheme:'v2Scheme',
  door:'v2Door',
  garage:'v2Garage',
  shutters:'v2Shutters',
  brick:'v2Brick'
};

  const ALL_SIDING_SCHEMES = ["A","B","C","D","E","F","G","H","I","J","K","L"];
  const BRICK_SCHEMES = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14"];

  const DOOR_COLORS_BY_SCHEME = {
    "A":["SW 6258 Tricorn Black","SW 9140 Blustery Sky","SW 7615 Sea Serpent","SW 6866 Heartthrob"],
    "B":["SW 6240 Windy Blue","SW 6237 Dark Night","SW 6606 Corral Reef","SW 9141 Waterloo"],
    "C":["SW 6209 Ripe Olive","SW 9560 Night Out","SW 6069 French Roast","SW 7588 Show Stopper"],
    "D":["SW 6181 Secret Garden","SW 6472 Composed","SW 9570 Ironclad","SW Copper Harbor"],
    "E":["SW 6481 Green Bay","SW 7674 Peppercorn","SW 7600 Bolero","SW 6496 Oceanside"],
    "F":["SW 7622 Homburg Gray","SW 7592 Crabby Apple","SW 7076 Cyberspace","SW Turkish Coffee"],
    "G":["SW 6453 Cilantro","SW 6244 Naval","SW 6202 Cast Iron","SW 9015 They call it Mellow"],
    "H":["SW 6249 Storm Cloud","SW 7041 Van Dyke Brown","SW 6991 Black Swan","SW 6678 Sunflower"],
    "I":["SW 0064 Blue Peacock","SW 6453 Cilantro","SW 7020 Black Fox","SW 6051 Sashay Sand"],
    "J":["SW Red Barn 7591","SW 6193 Privaliged green","SW 7514 Foothills","SW 6103 Tea Chest"],
    "K":["SW 6908 Fun Yellow","SW 6208 Pewter Green","SW 7048 Urban Bronze","SW 7511 Bungalo Brown"],
    "L":["SW 6451 Nurture Green","SW 7069 Iron Ore","SW 9574 Hulett Ore","SW 6222 Riverway"],

    "1":["SW 9140 Blustery Sky","SW 6006 Black Bean","SW 7622 Homburg Gray","SW 7514 Foothills"],
    "2":["SW 6181 Secret Garden","SW 6069 French Roast","SW 0064 Blue Peacock","SW 6258 Tricorn Black"],
    "3":["SW 7048 Urbane Bronze","SW 7600 Bolero","SW 6697 Nugget","SW 6237 Dark Night"],
    "4":["SW 7020 Black Fox","SW 6472 Composed","SW 6222 Riverway","SW 6216 Jasper"],
    "5":["SW 6244 Naval","SW 7069 Iron Ore","SW 6937 Tantalizing Teal","SW 6666 Enjoyable Yellow"],
    "6":["SW 6209 Ripe Olive","SW 7083 Darkroom","SW 7076 Cyberspace","SW 6868 Real Red"],
    "7":["SW 7592 Crabby Apple","SW 6188 Shade-Grown","SW 9148 Smoky Azurite","SW 9130 Evergreen Fog"],
    "8":["SW 7701 Cavern Clay","SW 6389 Butternut","SW 9559 Scattered Showers","SW 7048 Urban Bronze"],
    "9":["SW 2816 Rookwood Dark Green","SW 0048 Bunglehouse Blue","SW Turkish Coffee","SW Red Barn 7591"],
    "10":["SW 7674 Peppercorn","SW 6249 Storm Cloud","SW 6027 Cordovan","SW 9130 Evergreen Fog"],
    "11":["SW 6389 Butternut","SW 7747 Recycled Glass","SW 9030 Limon Fresco","SW 6339 Persimmon"],
    "12":["SW 0064 Blue Peacock","SW 6453 Cilantro","SW 7020 Black Fox","SW 6051 Sashay Sand"],
    "13":["SW 6389 Butternut","SW 7668 March Wind","SW 7076 Cyberspace","SW 6244 Naval"],
    "14":["SW 9148 Smoky Azurite","SW 7514 Foothills","SW 6193 Privaliged green","SW 7592 Crabby Apple"]
  };

  /* =========================================================
     REAL FIXED SCHEME COLORS
     Replace these with the actual scheme colors after approval.
     Siding schemes: primary + secondary + trim + fascia
     Brick schemes: primary + trim + fascia
     ========================================================= */
  const SCHEME_FIXED_COLORS = {
    /* =========================================================
       ALL-SIDING SCHEMES A-L
       ========================================================= */
    "A": {primary:"SW 7006 Extra White", secondary:"SW 7006 Extra White", trim:"SW 6258 Tricorn Black", fascia:"SW 6258 Tricorn Black"},
    "B": {primary:"SW 7008 Alabaster", secondary:"SW 7023 Requisite Gray", trim:"SW 7019 Gauntlet Gray", fascia:"SW 7019 Gauntlet Gray"},
    "C": {primary:"SW 7037 Balanced Beige", secondary:"SW 7622 Homburg Gray", trim:"SW 7022 Natural Choice", fascia:"SW 7020 Black Fox"},
    "D": {primary:"SW 9130 Evergreen Fog", secondary:"SW 7036 Accessible Beige", trim:"SW 7042 Shoji White", fascia:"SW 6988 Bohemian Black"},
    "E": {primary:"SW 9554 Going Grey", secondary:"SW 7076 Cyberspace", trim:"SW Light French Gray", fascia:"SW 6005 Folkstone"},
    "F": {primary:"SW 7622 Homburg Gray", secondary:"SW 9166 Drift of Mist", trim:"SW 7671 On the Rocks", fascia:"SW 6991 Black Magic"},
    "G": {primary:"SW 9559 Scattered Showers", secondary:"SW 7072 Online", trim:"SW Light French Gray", fascia:"SW 6990 Caviar"},
    "H": {primary:"SW 9141 Waterloo", secondary:"SW 9683 Lakeside", trim:"SW 9166 Drift of Mist", fascia:"SW 6989 Domino"},
    "I": {primary:"SW 6177 Softened Green", secondary:"SW 9166 Drift of Mist", trim:"SW 7005 Pure White", fascia:"SW 6208 Pewter Green"},
    "J": {primary:"SW 9015 They call it Mellow", secondary:"SW 9015 They call it Mellow", trim:"SW 7008 Alabaster", fascia:"SW 7008 Alabaster"},
    "K": {primary:"SW Red Barn 7591", secondary:"SW 7036 Accessible Beige", trim:"SW 7008 Alabaster", fascia:"SW 7008 Alabaster"},
    "L": {primary:"SW 7069 Iron Ore", secondary:"SW Light French Gray", trim:"SW 7006 Extra White", fascia:"SW 7674 Peppercorn"},

    /* =========================================================
       BRICK SCHEMES 1-14
       ========================================================= */
    "1": {primary:"SW 9582 White Sand", trim:"SW 9582 White Sand", fascia:"SW 6006 Black Bean"},
    "2": {primary:"SW 7012 Creamy", trim:"SW 9542 Natural White", fascia:"SW 2808 Rockwood Dark Brown"},
    "3": {primary:"SW 7029 Agreeable Gray", trim:"SW 7069 Iron Ore", fascia:"SW 7069 Iron Ore"},
    "4": {primary:"SW 7648 Big Chill", trim:"SW 9624 Winsome Grey", fascia:"SW 7020 Black Fox"},
    "5": {primary:"SW Light French Gray", trim:"SW 9541 White Snow", fascia:"SW 7674 Peppercorn"},
    "6": {primary:"SW 7037 Balanced Beige", trim:"SW 7037 Balanced Beige", fascia:"SW 9175 Deep Forest Brown"},
    "7": {primary:"SW 7689 Row House Tan", trim:"SW 7637 Oyster White", fascia:"SW 7008 Alabaster"},
    "8": {primary:"SW 9130 Evergreen Fog", trim:"SW 7010 White Duck", fascia:"SW 6188 Shade-Grown"},
    "9": {primary:"SW 9138 Stardew", trim:"SW 7011 Natural Choice", fascia:"SW 7008 Alabaster"},
    "10": {primary:"SW 7622 Homburg Gray", trim:"SW 7006 Extra White", fascia:"SW 7006 Extra White"},
    "11": {primary:"SW 6243 Distance", trim:"SW 6253 Olympus White", fascia:"SW 7005 Pure White"},
    "12": {primary:"SW 6177 Softened Green", trim:"SW 9166 Drift of Mist", fascia:"SW 6208 Pewter Green"},
    "13": {primary:"SW 6194 Basil", trim:"SW 7757 High Reflective White", fascia:"SW 7005 Pure White"},
    "14": {primary:"SW 6700 Daybreak", trim:"SW 7551 Greek Villa", fascia:"SW 7551 Greek Villa"}
  };

  function getExteriorType(){
    const checked = document.querySelector('input[name="v2ExteriorType"]:checked');
    return checked ? checked.value : "";
  }

  function setExteriorType(type){
    $("v2AllSiding").checked = type === "all-siding";
    $("v2WithBrick").checked = type === "brick";
  }


  function exteriorTypeFromElevation(elevation){

    const value =
    String(elevation || "")
    .trim()
    .toUpperCase();

    if(value === "X"){
      return "all-siding";
    }

    if(
      value === "B" ||
      value === "S" ||
      value === "V"
    ){
      return "brick";
    }

    return "";

  }


  function updateExteriorTypeFromElevation(
    resetDependentSelections = true
  ){

    const elevation =
    $("v2Elevation").value;

    const type =
    exteriorTypeFromElevation(
      elevation
    );

    setExteriorType(
      type
    );

    const display =
    $("v2ExteriorTypeDisplay");

    if(type === "brick"){
      display.textContent =
      "With Brick";
    }
    else if(type === "all-siding"){
      display.textContent =
      "All Siding / No Brick";
    }
    else{
      display.textContent =
      "Choose Elevation First";
    }

    renderExteriorTypeUI();

    if(resetDependentSelections){

      $("v2Scheme").value = "";
      $("v2Door").value = "";
      $("v2Garage").value = "";
      $("v2Shutters").value = "";

      if(type !== "brick"){
        $("v2Brick").value = "";
      }

      populateSchemeOptions();
      populateDoorOptions();
      populateGarageOptions();
      populateShutterOptions();
      updateSchemeColorSummary();

    }

  }

  function exteriorTypeFromData(d){

    if(
      d &&
      d.elevation
    ){
      const derived =
      exteriorTypeFromElevation(
        d.elevation
      );

      if(derived){
        return derived;
      }
    }

    if(d && d.exteriorType){
      return d.exteriorType;
    }

    if(d && d.scheme){
      const s = String(d.scheme);
      if(ALL_SIDING_SCHEMES.includes(s)) return "all-siding";
      if(BRICK_SCHEMES.includes(s)) return "brick";
    }

    return "";
  }

  function renderExteriorTypeUI(){
    const type = getExteriorType();
    $("v2BrickWrap").style.display = type === "brick" ? "block" : "none";
    $("v2Brick").disabled = type !== "brick";
  }

  function populateSchemeOptions(selectedValue=""){
    const type = getExteriorType();
    const values = type === "all-siding"
      ? ALL_SIDING_SCHEMES
      : type === "brick"
        ? BRICK_SCHEMES
        : [];

    const scheme = $("v2Scheme");
    scheme.innerHTML = '<option value="">' +
      (type ? "Select Scheme" : "Choose Exterior Type First") +
      "</option>";

    values.forEach(value => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = "Scheme " + value;
      scheme.appendChild(opt);
    });

    scheme.disabled = !type;

    if(selectedValue && values.includes(String(selectedValue))){
      scheme.value = String(selectedValue);
    }
  }

  function uniqueColors(values){
    return [...new Set((values || []).filter(Boolean))];
  }

  function fixedColorsForCurrentScheme(){
    return SCHEME_FIXED_COLORS[$("v2Scheme").value] || null;
  }

  function updateSchemeColorSummary(){
    const colors = fixedColorsForCurrentScheme();
    const type = getExteriorType();
    const box = $("v2SchemeSummary");

    if(!colors){
      box.style.display = "none";
      return;
    }

    box.style.display = "block";
    $("v2PrimaryColor").textContent = colors.primary || "—";
    $("v2SecondaryColor").textContent = colors.secondary || "—";
    $("v2TrimColor").textContent = colors.trim || "—";
    $("v2FasciaColor").textContent = colors.fascia || "—";
    $("v2SecondaryColorRow").style.display =
      type === "all-siding" ? "grid" : "none";
  }

  function fillColorSelect(select, values, selectedValue, placeholder){
    select.innerHTML = "";

    const first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.appendChild(first);

    uniqueColors(values).forEach(color => {
      const opt = document.createElement("option");
      opt.value = color;
      opt.textContent = color;
      select.appendChild(opt);
    });

    if(selectedValue && uniqueColors(values).includes(selectedValue)){
      select.value = selectedValue;
    } else {
      select.value = "";
    }
  }

  function populateDoorOptions(selectedValue=""){
    const schemeValue = $("v2Scheme").value;
    const colors = DOOR_COLORS_BY_SCHEME[schemeValue] || [];
    const door = $("v2Door");

    fillColorSelect(
      door,
      colors,
      selectedValue,
      schemeValue ? "Select Front Door Color" : "Choose Scheme First"
    );

    door.disabled = !schemeValue;
  }

  function populateGarageOptions(selectedValue=""){
    const fixed = fixedColorsForCurrentScheme();
    const garage = $("v2Garage");

    if(!$("v2Door").value || !fixed){
      fillColorSelect(
        garage,
        [],
        "",
        $("v2Scheme").value
          ? "Choose Entry Door First"
          : "Choose Scheme First"
      );
      garage.disabled = true;
      return;
    }

    const colors = uniqueColors([
      fixed.fascia,
      fixed.trim,
      fixed.primary
    ]);

    fillColorSelect(
      garage,
      colors,
      selectedValue,
      "Select Garage Door Color"
    );

    garage.disabled = false;
  }

  function populateShutterOptions(selectedValue=""){
    const fixed = fixedColorsForCurrentScheme();
    const shutters = $("v2Shutters");

    if(!$("v2Garage").value || !$("v2Door").value || !fixed){
      fillColorSelect(
        shutters,
        [],
        "",
        $("v2Garage").value
          ? "Select Shutter Color"
          : "Choose Garage Door First"
      );
      shutters.disabled = true;
      return;
    }

    const colors = uniqueColors([
      $("v2Door").value,
      fixed.fascia,
      $("v2Garage").value
    ]);

    fillColorSelect(
      shutters,
      colors,
      selectedValue,
      "Select Shutter Color"
    );

    shutters.disabled = false;
  }



  function cloneState(value){
    return JSON.parse(JSON.stringify(value));
  }


  function recordForState(sourceState, id){
    return {
      plot: (
        sourceState.plots &&
        sourceState.plots[id]
      )
      ? cloneState(sourceState.plots[id])
      : { restricted:[] },

      data: (
        sourceState.data &&
        Object.prototype.hasOwnProperty.call(sourceState.data, id)
      )
      ? cloneState(sourceState.data[id])
      : null,

      meta: (
        sourceState.meta &&
        sourceState.meta[id]
      )
      ? cloneState(sourceState.meta[id])
      : {
          locked:false,
          lastSavedAt:"",
          overrideReason:"",
          overrideAt:""
        }
    };
  }


  function sameRecord(a, b){
    return JSON.stringify(a) === JSON.stringify(b);
  }


  function setSharedStatus(text, color="#6b7280"){
    const el = document.getElementById("sharedDataStatus");
    if(!el) return;
    el.textContent = "• " + text;
    el.style.color = color;
  }


  async function pushChangesToShared(changes){

    if(LOCAL_TEST_MODE){
      localStorage.setItem(STORAGE, JSON.stringify(state));
      lastSyncedState = cloneState(state);
      setSharedStatus("Local Test • Saved", "#2563eb");
      return {ok:true, saved:changes.length, etags:{}};
    }

    if(!changes.length){
      return { ok:true, saved:0, etags:{} };
    }

    setSharedStatus("Saving…", "#8a6b00");

    const response =
    await fetch(
      "/.netlify/functions/stoney-chase-state",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          changes
        })
      }
    );

    const result =
    await response.json()
    .catch(() => ({}));

    if(response.status === 409){
      const error =
      new Error(
        "This homesite changed on another device."
      );
      error.code = "STALE_HOMESITE";
      error.conflictId = result.conflictId || "";
      throw error;
    }

    if(!response.ok){
      throw new Error(
        "Shared save failed: " +
        response.status
      );
    }

    changes.forEach(change => {

      if(!lastSyncedState){
        return;
      }

      lastSyncedState.plots[change.id] =
      cloneState(change.record.plot);

      if(change.record.data === null){
        delete lastSyncedState.data[change.id];
      }
      else{
        lastSyncedState.data[change.id] =
        cloneState(change.record.data);
      }

      lastSyncedState.meta[change.id] =
      cloneState(change.record.meta);

      if(
        result.etags &&
        Object.prototype.hasOwnProperty.call(
          result.etags,
          change.id
        )
      ){
        sharedEtags[change.id] =
        result.etags[change.id];

        openedEtags[change.id] =
        result.etags[change.id];
      }

    });

    setSharedStatus("Shared • Saved", "#15803d");

    return result;

  }

  async function getLiveHomesiteVersion(id){

    const response =
    await fetch(
      "/.netlify/functions/stoney-chase-state?id=" +
      encodeURIComponent(id),
      {
        method:"GET",
        cache:"no-store"
      }
    );

    if(!response.ok){
      throw new Error(
        "Could not verify homesite version."
      );
    }

    return await response.json();

  }


  async function verifyHomesiteIsFresh(id){

    if(LOCAL_TEST_MODE){
      return {
        fresh:true,
        live:{
          exists:!!state.data[id],
          etag:null,
          record:recordForState(state,id)
        }
      };
    }

    const live =
    await getLiveHomesiteVersion(id);

    const opened =
    Object.prototype.hasOwnProperty.call(
      openedEtags,
      id
    )
    ? openedEtags[id]
    : (
        Object.prototype.hasOwnProperty.call(
          sharedEtags,
          id
        )
        ? sharedEtags[id]
        : null
      );

    const liveEtag =
    live && live.exists
    ? live.etag
    : null;

    if(liveEtag !== opened){
      return {
        fresh:false,
        live
      };
    }

    return {
      fresh:true,
      live
    };

  }


  function persist(){

    // Keep a local fallback/cache too.
    localStorage.setItem(
      STORAGE,
      JSON.stringify(state)
    );

    // Before the first shared load finishes, don't push anything.
    if(!lastSyncedState){
      return;
    }

    const changes = [];

    ids.forEach(id => {

      const current =
      recordForState(
        state,
        id
      );

      const previous =
      recordForState(
        lastSyncedState,
        id
      );

      if(
        !sameRecord(
          current,
          previous
        )
      ){
        changes.push({
          id,
          record:current
        });
      }

    });

    if(!changes.length){
      return;
    }

    pushChangesToShared(
      changes
    )
    .catch(error => {
      console.error(error);
      setSharedStatus(
        "Not synced",
        "#dc2626"
      );
      alert(
        "This change was saved on this computer, but Netlify shared storage could not be updated. Check your connection and try saving again."
      );
    });

  }


  async function loadSharedState(){

    if(LOCAL_TEST_MODE){
      lastSyncedState = cloneState(state);
      setSharedStatus("Local Test • No Netlify", "#2563eb");
      updateLabels();
      paint();
      return;
    }

    setSharedStatus(
      "Connecting…"
    );

    try{

      const response =
      await fetch(
        "/.netlify/functions/stoney-chase-state",
        {
          method:"GET",
          cache:"no-store"
        }
      );

      if(!response.ok){
        throw new Error(
          "Shared load failed: " +
          response.status
        );
      }

      const result =
      await response.json();

      if(
        result &&
        result.hasData &&
        result.state
      ){

        state =
        result.state;

        if(
          !state.plots ||
          typeof state.plots !== "object"
        ){
          state.plots = {};
        }

        if(
          !state.data ||
          typeof state.data !== "object"
        ){
          state.data = {};
        }

        if(
          !state.meta ||
          typeof state.meta !== "object"
        ){
          state.meta = {};
        }

        ids.forEach(id => {

          if(!state.plots[id]){
            state.plots[id] = {
              restricted:[]
            };
          }

          if(
            !Array.isArray(
              state.plots[id].restricted
            )
          ){
            state.plots[id].restricted =
            [];
          }

          if(!state.meta[id]){
            state.meta[id] = {
              locked:false,
              lastSavedAt:"",
              overrideReason:"",
              overrideAt:""
            };
          }

        });

        lastSyncedState =
        cloneState(state);

        sharedEtags =
        (
          result.etags &&
          typeof result.etags === "object"
        )
        ? {...result.etags}
        : {};

        openedEtags =
        {...sharedEtags};

        localStorage.setItem(
          STORAGE,
          JSON.stringify(state)
        );

        updateLabels();
        paint();

        if(selected){
          selectPlot(selected);
        }

        setSharedStatus(
          "Shared • Live",
          "#15803d"
        );

        return;
      }

      // First use: no Netlify Blob data exists yet.
      // Keep the current local/default state and make it the initial shared state.
      sharedEtags = {};
      openedEtags = {};

      lastSyncedState = {
        plots:Object.fromEntries(
          ids.map(id => [
            id,
            STONEY_DEFAULT_PLOTS[id]
              ? {
                  restricted:[...(STONEY_DEFAULT_PLOTS[id].restricted || [])],
                  lot:STONEY_DEFAULT_PLOTS[id].lot || "",
                  tract:STONEY_DEFAULT_PLOTS[id].tract || ""
                }
              : { restricted:[], lot:"", tract:"" }
          ])
        ),
        data:{},
        meta:Object.fromEntries(
          ids.map(id => [
            id,
            {
              locked:false,
              lastSavedAt:"",
              overrideReason:"",
              overrideAt:""
            }
          ])
        )
      };

      const initialChanges =
      ids
      .map(id => ({
        id,
        record:recordForState(
          state,
          id
        )
      }))
      .filter(change =>
        !sameRecord(
          change.record,
          recordForState(
            lastSyncedState,
            change.id
          )
        )
      );

      if(initialChanges.length){
        await pushChangesToShared(
          initialChanges
        );
      }
      else{
        setSharedStatus(
          "Shared • Live",
          "#15803d"
        );
      }

    }
    catch(error){

      console.error(error);

      // Keep localStorage as a usable fallback if Netlify is unavailable.
      setSharedStatus(
        "Local only",
        "#dc2626"
      );

    }

  }


  function norm(v){

    return String(
      v || ""
    )
    .trim()
    .toLowerCase();

  }


  function esc(v){

    return String(
      v || ""
    )
    .replace(

      /[&<>"']/g,

      ch => ({

        "&":"&amp;",

        "<":"&lt;",

        ">":"&gt;",

        '"':"&quot;",

        "'":"&#039;"

      })[ch]

    );

  }


  /* =========================================================
     LOT DISPLAY NAME
     ========================================================= */

  function plotName(id){

    const saved = state.data[id] || {};
    const plot = (state.plots && state.plots[id]) || {};
    const address = saved.address || "";

    const lot = plot.lot
      ? "Lot " + plot.lot + (plot.tract ? " / Block " + plot.tract : "")
      : "";

    return [lot, address].filter(Boolean).join(" • ") || id;
  }


  /* =========================================================
     FORM
     ========================================================= */

  function readForm(){

    const out = {};

    Object.entries(
      fields
    )
    .forEach(
      ([key,id]) => {
        out[key] = ($(id).value || "").trim();
      }
    );

    out.exteriorType =
    exteriorTypeFromElevation(
      out.elevation
    );

    if(out.exteriorType === "all-siding"){
      out.brick = "";
    }

    const fixed =
    SCHEME_FIXED_COLORS[out.scheme] || {};

    out.primaryColor = fixed.primary || "";
    out.secondaryColor =
      out.exteriorType === "all-siding"
      ? (fixed.secondary || "")
      : "";
    out.trimColor = fixed.trim || "";
    out.fasciaColor = fixed.fascia || "";

    return out;

  }


  function fillForm(id){

    const d =
    state.data[id] || {};

    const plot =
    (state.plots && state.plots[id]) || {};

    if($("v2EditLot")){
      $("v2EditLot").value = plot.lot || "";
    }

    if($("v2EditBlock")){
      $("v2EditBlock").value = plot.tract || "";
    }

    const type =
    exteriorTypeFromData(d);

    setExteriorType(type);

    const exteriorDisplay =
    $("v2ExteriorTypeDisplay");

    exteriorDisplay.textContent =
    type === "brick"
      ? "With Brick"
      : type === "all-siding"
        ? "All Siding / No Brick"
        : "Choose Elevation First";

    $("v2Address").value = d.address || "";
    $("v2Plan").value = d.plan || "";
    $("v2Elevation").value = d.elevation || "";

    renderExteriorTypeUI();

    if(type === "brick"){
      $("v2Brick").value = d.brick || "";
    } else {
      $("v2Brick").value = "";
    }

    populateSchemeOptions(d.scheme || "");
    updateSchemeColorSummary();
    populateDoorOptions(d.door || "");
    populateGarageOptions(d.garage || "");
    populateShutterOptions(d.shutters || "");
  }


  function metaFor(id){

    if(
      !state.meta[id]
    ){

      state.meta[id] = {
        locked:false,
        lastSavedAt:"",
        overrideReason:"",
        overrideAt:"",
        homeSaved:false,
        homeSavedAt:"",
        exteriorSaved:false,
        exteriorSavedAt:""
      };

    }

    const m = state.meta[id];

    // Existing fully saved records are treated as both stages complete.
    if(m.locked && m.homeSaved === undefined){
      m.homeSaved = true;
    }
    if(m.locked && m.exteriorSaved === undefined){
      m.exteriorSaved = true;
    }

    if(m.homeSaved === undefined) m.homeSaved = false;
    if(m.homeSavedAt === undefined) m.homeSavedAt = "";
    if(m.exteriorSaved === undefined) m.exteriorSaved = !!m.locked;
    if(m.exteriorSavedAt === undefined) m.exteriorSavedAt = m.lastSavedAt || "";

    return m;

  }


  function formIsLocked(){

    if(
      !selected
    ){

      return false;

    }

    const m =
    metaFor(selected);

    return !!m.locked &&
    unlockedForEdit !== selected;

  }


  function renderLockState(){

    if(!selected){
      return;
    }

    const m = metaFor(selected);
    const finalLocked =
      !!m.exteriorSaved &&
      unlockedForEdit !== selected;

    const homeLocked =
      finalLocked ||
      (!!m.homeSaved && homeEditingFor !== selected);

    const homeStage = $("v2StageHome");
    const homeFields = $("v2HomeFields");
    const homeSummary = $("v2HomeSummary");

    const showCompactHome =
      !!m.homeSaved &&
      homeEditingFor !== selected;

    homeStage.classList.toggle(
      "saved-collapsed",
      showCompactHome
    );

    homeFields.classList.toggle(
      "collapsed",
      showCompactHome
    );

    homeSummary.classList.toggle(
      "show",
      showCompactHome
    );

    const savedHomeData =
      state.data[selected] || {};

    $("v2HomeSummaryAddress").textContent =
      savedHomeData.address || "—";

    $("v2HomeSummaryPlanElevation").textContent =
      (savedHomeData.plan || "—") +
      " / " +
      (savedHomeData.elevation || "—");

    const homeIds = [
      "v2Address",
      "v2Plan",
      "v2Elevation"
    ];

    homeIds.forEach(id => {
      $(id).disabled = homeLocked;
    });

    document
    .querySelectorAll('input[name="v2ExteriorType"]')
    .forEach(radio => {
      radio.disabled = homeLocked;
    });

    $("v2SaveHome").disabled =
      finalLocked ||
      (!!m.homeSaved && homeEditingFor !== selected);

    $("v2EditHome").style.display =
      m.homeSaved &&
      !finalLocked &&
      homeEditingFor !== selected
        ? "inline-block"
        : "none";

    const stage2Enabled =
      !!m.homeSaved &&
      !finalLocked;

    $("v2StageExterior").classList.toggle(
      "v2-stage-disabled",
      !m.homeSaved
    );

    // Completed exteriors collapse into a clean read-only summary.
    // Clicking UNLOCK expands the full controls again.
    const exteriorFields = $("v2ExteriorFields");
    const exteriorSummary = $("v2ExteriorSummary");

    const showCompactExterior =
      !!m.exteriorSaved &&
      finalLocked;

    $("v2StageExterior").classList.toggle(
      "saved-collapsed",
      showCompactExterior
    );

    exteriorFields.classList.toggle(
      "collapsed",
      showCompactExterior
    );

    exteriorSummary.classList.toggle(
      "show",
      showCompactExterior
    );

    const savedExteriorData =
      state.data[selected] || {};

    const fixedExteriorColors =
      SCHEME_FIXED_COLORS[savedExteriorData.scheme] || {};

    // Show the friendly brick name instead of only "Brick 1", etc.
    const brickOption =
      Array.from($("v2Brick").options)
      .find(option => option.value === savedExteriorData.brick);

    $("v2ExteriorSummaryBrick").textContent =
      brickOption
        ? brickOption.textContent
        : (savedExteriorData.brick || "—");

    $("v2ExteriorSummaryScheme").textContent =
      savedExteriorData.scheme
        ? "Scheme " + savedExteriorData.scheme
        : "—";

    $("v2ExteriorSummaryPrimary").textContent =
      fixedExteriorColors.primary || "—";

    $("v2ExteriorSummarySecondary").textContent =
      fixedExteriorColors.secondary || "—";

    $("v2ExteriorSummaryTrim").textContent =
      fixedExteriorColors.trim || "—";

    $("v2ExteriorSummaryFascia").textContent =
      fixedExteriorColors.fascia || "—";

    $("v2ExteriorSummaryDoor").textContent =
      savedExteriorData.door || "—";

    $("v2ExteriorSummaryGarage").textContent =
      savedExteriorData.garage || "—";

    $("v2ExteriorSummaryShutters").textContent =
      savedExteriorData.shutters || "—";

    const savedExteriorType =
      savedExteriorData.exteriorType ||
      exteriorTypeFromElevation(savedExteriorData.elevation);

    $("v2ExteriorSummaryBrickItem").style.display =
      savedExteriorType === "brick"
        ? "block"
        : "none";

    $("v2ExteriorSummarySecondaryItem").style.display =
      savedExteriorType === "all-siding"
        ? "block"
        : "none";

    renderExteriorTypeUI();

    // Stage 2 controls.
    $("v2Brick").disabled =
      !stage2Enabled ||
      getExteriorType() !== "brick";

    $("v2Scheme").disabled =
      !stage2Enabled ||
      !getExteriorType();

    $("v2Door").disabled =
      !stage2Enabled ||
      !$("v2Scheme").value;

    $("v2Garage").disabled =
      !stage2Enabled ||
      !$("v2Door").value;

    $("v2Shutters").disabled =
      !stage2Enabled ||
      !$("v2Garage").value;

    $("v2Save").disabled =
      !stage2Enabled;

    $("v2Clear").disabled =
      finalLocked;

    $("v2ClearSavedHome").style.display =
      (m.homeSaved || m.exteriorSaved || m.locked)
        ? "inline-block"
        : "none";

    $("v2Unlock").style.display =
      m.exteriorSaved && finalLocked
        ? "inline-block"
        : "none";

    const homeChip = $("v2HomeStageChip");
    const exteriorChip = $("v2ExteriorStageChip");

    if(m.homeSaved){
      homeChip.textContent = "Saved";
      homeChip.className = "v2-stage-chip saved";
    } else {
      homeChip.textContent = "Not Saved";
      homeChip.className = "v2-stage-chip";
    }

    if(m.exteriorSaved){
      exteriorChip.textContent = "Complete";
      exteriorChip.className = "v2-stage-chip complete";
    } else if(m.homeSaved){
      exteriorChip.textContent = "Ready";
      exteriorChip.className = "v2-stage-chip saved";
    } else {
      exteriorChip.textContent = "Waiting for Home";
      exteriorChip.className = "v2-stage-chip";
    }

    const box = $("v2LockText");

    if(m.exteriorSaved && finalLocked){

      let extra = "";

      if(m.overrideReason){
        extra =
          '<span class="override"><b>Conflict Override:</b> ' +
          esc(m.overrideReason) +
          "</span>";
      }

      box.innerHTML =
        "<strong>✓ Home + Exterior Complete</strong>" +
        "Both stages are saved. This homesite is finalized and protected from accidental changes." +
        extra;

    } else if(m.exteriorSaved && unlockedForEdit === selected){

      box.innerHTML =
        "<strong>⚠ Finalized Home Unlocked</strong>" +
        "Changes are not final until the applicable stage is saved again.";

    } else if(m.homeSaved){

      box.innerHTML =
        "<strong>✓ Home Saved • Exterior Pending</strong>" +
        "The sold home is recorded. Complete Stage 2 when exterior selections are available.";

    } else {

      box.innerHTML =
        "<strong>Stage 1 Not Saved</strong>" +
        "Enter Address, Plan, and Elevation, then click Save Home.";
    }

    updateTopSummary();

  }


  /* =========================================================
     TEXT SHOWN INSIDE EACH LOT
     ========================================================= */

function labelHTML(id, d) {

  const plot = (state.plots && state.plots[id]) || {};
  const saved = state.data[id] || {};

  d = {...saved, ...(d || {})};

  const lines = [];

  if (plot.lot || plot.tract) {
    lines.push(
      esc(plot.lot || "") +
      (plot.tract ? " / " + esc(plot.tract) : "")
    );
  }

  if (d.plan || d.elevation) {
    lines.push(
      esc(d.plan || "") +
      (d.elevation ? " / " + esc(d.elevation) : "")
    );
  }

  return lines.length ? lines.join("<br>") : "";
}



  /* =========================================================
     FIND CENTER OF LOT POLYGON
     ========================================================= */

  function polygonCenter(
    poly
  ){

    const pts =

    poly
    .getAttribute(
      "points"
    )
    .trim()
    .split(/\s+/)
    .map(

      p =>
      p
      .split(",")
      .map(Number)

    );


    let area2 = 0;

    let cx = 0;

    let cy = 0;


    for(
      let i = 0;
      i < pts.length;
      i++
    ){

      const [
        x1,
        y1
      ] =
      pts[i];


      const [
        x2,
        y2
      ] =
      pts[
        (i + 1)
        %
        pts.length
      ];


      const cross =
      x1 * y2 -
      x2 * y1;


      area2 +=
      cross;


      cx +=
      (x1 + x2)
      *
      cross;


      cy +=
      (y1 + y2)
      *
      cross;

    }


    if(
      Math.abs(
        area2
      )
      <
      0.001
    ){

      return {

        x:
        pts.reduce(
          (s,p) =>
          s + p[0],
          0
        )
        /
        pts.length,

        y:
        pts.reduce(
          (s,p) =>
          s + p[1],
          0
        )
        /
        pts.length

      };

    }


    return {

      x:
      cx /
      (
        3 *
        area2
      ),

      y:
      cy /
      (
        3 *
        area2
      )

    };

  }


  /* =========================================================
     CREATE TEXT LABELS OVER LOTS
     ========================================================= */

  function createLabels(){

    const old =
    svg.querySelector(
      "#v2Labels"
    );


    if(
      old
    ){

      old.remove();

    }


    const group =
    document.createElementNS(

      "http://www.w3.org/2000/svg",

      "g"

    );


    group.id =
    "v2Labels";


    lots.forEach(

      poly => {

        const id =
        poly.dataset.id;


        const c =
        polygonCenter(
          poly
        );


        const fo =
        document.createElementNS(

          "http://www.w3.org/2000/svg",

          "foreignObject"

        );


        fo.setAttribute(
          "x",
          c.x - 27
        );


        fo.setAttribute(
          "y",
          c.y - 29
        );


        fo.setAttribute(
          "width",
          54
        );


        fo.setAttribute(
          "height",
          58
        );


        fo.classList.add(
          "v2-label-wrap"
        );


        const div =
        document.createElement(
          "div"
        );


        div.setAttribute(

          "xmlns",

          "http://www.w3.org/1999/xhtml"

        );


        div.className =
        "v2-lot-label";


        div.dataset.id =
        id;


        div.innerHTML =
        labelHTML(
          id
        );


        fo.appendChild(
          div
        );


        group.appendChild(
          fo
        );

      }

    );


    svg.appendChild(
      group
    );

  }


  function updateLabels(
    previewId = null,
    previewData = null
  ){

    svg
    .querySelectorAll(
      ".v2-lot-label"
    )
    .forEach(

      el => {

        const id =
        el.dataset.id;


        el.innerHTML =

        id === previewId

        ?

        labelHTML(
          id,
          previewData
        )

        :

        labelHTML(
          id
        );

      }

    );

  }


  /* =========================================================
     COLOR / HIGHLIGHT LOTS
     ========================================================= */

  function paint(
    conflictIds = []
  ){

    lots.forEach(

      el => {

        const id =
        el.dataset.id;


        el.classList.remove(

          "selected",

          "restricted",

          "blocker",

          "v2-selected",

          "v2-restricted",

          "v2-target",

          "v2-conflict",

          "v2-home-saved",

          "v2-finalized"

        );


        if(
          state.meta &&
          state.meta[id]
        ){
          const mapMeta = metaFor(id);

          if(mapMeta.exteriorSaved || mapMeta.locked){
            el.classList.add("v2-finalized");
          }
          else if(mapMeta.homeSaved){
            el.classList.add("v2-home-saved");
          }
        }


        if(
          id === selected
        ){

          el.classList.add(
            "v2-selected"
          );

        }


        if(

          selected &&

          state
          .plots[selected]
          .restricted
          .includes(id)

        ){

          el.classList.add(

            restrictionMode

            ?

            "v2-target"

            :

            "v2-restricted"

          );

        }


        if(
          conflictIds
          .includes(id)
        ){

          el.classList.add(
            "v2-conflict"
          );

        }

      }

    );

  }


  /* =========================================================
     RESTRICTIONS
     ========================================================= */

  function renderQuickLotEdit(){

    const box =
    $("v2QuickLotEdit");

    if(!box){
      return;
    }

    const shouldShow =
    !!selected &&
    !!restrictionEditUnlocked;

    box.classList.toggle(
      "show",
      shouldShow
    );

    if(!shouldShow){
      return;
    }

    const plot =
    (state.plots && state.plots[selected]) || {
      restricted:[],
      lot:"",
      tract:""
    };

    $("v2EditLot").value =
    plot.lot || "";

    $("v2EditBlock").value =
    plot.tract || "";

    if(
      $("v2QuickTwoWay") &&
      $("v2TwoWay")
    ){
      $("v2QuickTwoWay").checked =
      $("v2TwoWay").checked;
    }

    const chips =
    $("v2QuickChips");

    chips.innerHTML = "";

    const list =
    Array.isArray(plot.restricted)
    ? plot.restricted
    : [];

    if(!list.length){

      chips.innerHTML =
      '<span class="v2-help">No restricted lots selected yet.</span>';

    }
    else{

      list.forEach(id => {

        const chip =
        document.createElement("span");

        chip.className =
        "v2-chip";

        chip.append(
          document.createTextNode(
            plotName(id)
          )
        );

        const remove =
        document.createElement("button");

        remove.type =
        "button";

        remove.textContent =
        "×";

        remove.title =
        "Remove restriction";

        remove.addEventListener(
          "click",
          e => {

            e.stopPropagation();

            toggleRestriction(
              id,
              true
            );

            renderQuickLotEdit();
            paint();

          }
        );

        chip.appendChild(remove);
        chips.appendChild(chip);

      });

    }

    const pickButton =
    $("v2RestrictionPickMode");

    pickButton.classList.toggle(
      "active",
      restrictionMode
    );

    pickButton.textContent =
    restrictionMode
    ? "Done Adding"
    : "Add Restricted Lots";

    $("v2QuickRestrictionHelp")
    .innerHTML =
    restrictionMode
    ? "<b>Restriction selection is ON.</b> Click other lots on the map to add or remove them. Click Done Adding when finished."
    : 'Click <b>Add Restricted Lots</b>, then click the lots on the map that cannot repeat this homesite.';

  }


  function renderRestrictions(){

    const holder =
    $("v2Chips");


    holder.innerHTML =
    "";


    if(
      !selected
    ){

      return;

    }


    const list =
    state
    .plots[selected]
    .restricted;


    if(
      !list.length
    ){

      holder.innerHTML =

      '<span class="v2-help">' +

      "No restricted homesites selected yet." +

      "</span>";

      return;

    }


    list.forEach(

      id => {

        const chip =
        document.createElement(
          "span"
        );


        chip.className =
        "v2-chip";


        chip.append(

          document.createTextNode(
            plotName(id)
          )

        );


        const remove =
        document.createElement(
          "button"
        );


        remove.type =
        "button";


        remove.textContent =
        "×";


        remove.title =
        "Remove restriction";


        remove.addEventListener(

          "click",

          e => {

            e.stopPropagation();

            toggleRestriction(
              id,
              true
            );

          }

        );


        if(
          restrictionEditUnlocked
        ){

          chip.appendChild(
            remove
          );

        }


        holder.appendChild(
          chip
        );

      }

    );

  }


  function toggleRestriction(
    target,
    forceRemove = false
  ){

    if(
      !restrictionEditUnlocked
    ){

      return;

    }


    if(

      !selected ||

      target === selected

    ){

      return;

    }


    const list =
    state
    .plots[selected]
    .restricted;


    const exists =
    list.includes(
      target
    );


    if(
      exists ||
      forceRemove
    ){

      state
      .plots[selected]
      .restricted =

      list.filter(
        x =>
        x !== target
      );


      if(
        $("v2TwoWay")
        .checked
      ){

        state
        .plots[target]
        .restricted =

        state
        .plots[target]
        .restricted
        .filter(
          x =>
          x !== selected
        );

      }

    }

    else{

      state
      .plots[selected]
      .restricted
      .push(
        target
      );


      if(

        $("v2TwoWay")
        .checked &&

        !state
        .plots[target]
        .restricted
        .includes(
          selected
        )

      ){

        state
        .plots[target]
        .restricted
        .push(
          selected
        );

      }

    }


    renderRestrictions();
    renderQuickLotEdit();

    checkConflicts(
      false
    );

    paint();

  }


  /* =========================================================
     CONFLICT RULES
     ========================================================= */

  function conflictsFor(
    d
  ){

    if(
      !selected
    ){

      return [];

    }


    const found = [];
    const currentType = exteriorTypeFromData(d);


    state
    .plots[selected]
    .restricted
    .forEach(

      otherId => {

        const other =
        state.data[
          otherId
        ];


        if(
          !other
        ){

          return;

        }


        const otherType = exteriorTypeFromData(other);

        /* =========================================================
           STONEY CHASE RESTRICTION RULES
           1. Same PLAN + ELEVATION combination is not allowed.
              The same plan IS allowed when the elevation is different.
           2. Same BRICK is not allowed only when BOTH homes are brick.
           3. Same PAINT SCHEME is not allowed only when BOTH homes are
              all-siding homes.
           Door, garage and shutter colors do NOT create conflicts here.
           ========================================================= */

        const samePlanElevation =
          norm(d.plan) &&
          norm(d.elevation) &&
          norm(d.plan) === norm(other.plan) &&
          norm(d.elevation) === norm(other.elevation);

        if(samePlanElevation){
          found.push({
            id:otherId,
            key:"plan",
            label:"Plan / Elevation",
            value:(d.plan || "") + " / " + (d.elevation || "")
          });

          found.push({
            id:otherId,
            key:"elevation",
            label:"Plan / Elevation",
            value:(d.plan || "") + " / " + (d.elevation || "")
          });
        }

        if(
          currentType === "brick" &&
          otherType === "brick" &&
          norm(d.brick) &&
          norm(d.brick) === norm(other.brick)
        ){
          found.push({
            id:otherId,
            key:"brick",
            label:"Brick",
            value:d.brick
          });
        }

        if(
          currentType === "all-siding" &&
          otherType === "all-siding" &&
          norm(d.scheme) &&
          norm(d.scheme) === norm(other.scheme)
        ){
          found.push({
            id:otherId,
            key:"scheme",
            label:"Paint Scheme",
            value:d.scheme
          });
        }

      }

    );


    return found;

  }

  function clearFieldConflictHighlights(){

    const ids = [
      "v2Plan",
      "v2Elevation",
      "v2Brick",
      "v2Scheme",
      "v2Door",
      "v2Garage",
      "v2Shutters"
    ];

    ids.forEach(id => {
      const field = $(id);
      if(!field) return;

      field.classList.remove(
        "v2-field-conflict"
      );

      const label =
        document.querySelector(
          'label[for="' + id + '"]'
        );

      if(label){
        label.classList.remove(
          "v2-label-conflict"
        );
      }
    });
  }


  function highlightConflictField(key){

    const fieldByKey = {
      plan:"v2Plan",
      elevation:"v2Elevation",
      brick:"v2Brick",
      scheme:"v2Scheme",
      door:"v2Door",
      garage:"v2Garage",
      shutters:"v2Shutters"
    };

    const id =
      fieldByKey[key];

    if(!id){
      return;
    }

    const field = $(id);

    if(field){
      field.classList.add(
        "v2-field-conflict"
      );
    }

    const label =
      document.querySelector(
        'label[for="' + id + '"]'
      );

    if(label){
      label.classList.add(
        "v2-label-conflict"
      );
    }
  }


  function checkConflicts(
    useForm = true
  ){

    if(
      !selected
    ){
      return;
    }

    const d =
      useForm
        ? readForm()
        : (
            state.data[
              selected
            ]
            ||
            {}
          );

    const conflicts =
      conflictsFor(
        d
      );

    const conflictIds =
      [
        ...new Set(
          conflicts.map(
            c => c.id
          )
        )
      ];

    paint(
      conflictIds
    );

    clearFieldConflictHighlights();

    conflicts.forEach(
      c => {
        highlightConflictField(
          c.key
        );
      }
    );

    const box =
      $("v2Status");

    if(
      !conflicts.length
    ){

      box.className =
        "v2-status ok";

      box.innerHTML =
        "<b>✓ No conflicts found</b>";

    }

    else{

      box.className =
        "v2-status bad";

      box.innerHTML =
        "<b>✕ Conflicts found</b>";

    }

  }


  function selectPlot(
    id
  ){

    svg.classList.remove(
      "v2-map-idle"
    );

    selected =
    id;


    restrictionMode =
    false;


    // Remember the shared version present when this homesite was opened.
    // The form itself is never auto-replaced during the pre-save check.
    openedEtags[id] =
    Object.prototype.hasOwnProperty.call(
      sharedEtags,
      id
    )
    ? sharedEtags[id]
    : null;


    // Show the floating homesite details panel.
    aside.style.display =
    "block";


    unlockedForEdit =
    null;

    homeEditingFor =
    null;


    $("v2Editor")
    .style.display =
    "block";


    fillForm(
      id
    );


    $("v2PlotTitle")
    .textContent =
    plotName(
      id
    );

    updateTopSummary();


    renderRestrictions();

    // If Edit mode was already unlocked before a homesite was selected,
    // show/populate the Lot / Block + Restricted Lots editor now.
    renderQuickLotEdit();


    renderLockState();


    checkConflicts(
      false
    );

  }


  function handleLotClick(
    id
  ){

    if(
      !ids.includes(id)
    ){

      return;

    }


    if(

      restrictionMode &&

      selected

    ){

      toggleRestriction(
        id
      );

    }

    else{

      selectPlot(
        id
      );

    }

  }


  /* =========================================================
     SAVE / LOCK / CONFLICT OVERRIDE
     ========================================================= */

  function closeConflictModal(){

    $("v2ConflictModal")
    .classList.remove(
      "open"
    );


    $("v2OverrideReason")
    .value =
    "";


    $("v2OverrideSave")
    .disabled =
    true;

  }


  async function commitSave(
    form,
    overrideReason = ""
  ){

    if(
      !selected
    ){
      return;
    }

    const savingId =
    selected;

    let freshness;

    try{
      setSharedStatus(
        "Checking latest…",
        "#8a6b00"
      );

      freshness =
      await verifyHomesiteIsFresh(
        savingId
      );
    }
    catch(error){
      console.error(error);

      setSharedStatus(
        "Could not verify",
        "#dc2626"
      );

      alert(
        "The site could not verify the latest shared information for this homesite, so your save was stopped.\n\nYour typed information is still in the form. Check your connection and try Save again."
      );

      return;
    }

    if(!freshness.fresh){

      setSharedStatus(
        "Update detected",
        "#dc2626"
      );

      if(
        freshness.live &&
        freshness.live.exists
      ){
        sharedEtags[savingId] =
        freshness.live.etag;
      }

      alert(
        "This homesite was updated on another device while you were working on it.\n\nYour typed information has NOT been deleted, but this save was stopped so you do not overwrite the newer saved information.\n\nClose and reopen this homesite to load the current saved information, then make any needed changes."
      );

      return;
    }

    const previousRecord =
    recordForState(
      state,
      savingId
    );

    state.data[
      savingId
    ] =
    form;

    const now =
    new Date()
    .toISOString();

    const m =
    metaFor(
      savingId
    );

    m.homeSaved =
    true;

    if(!m.homeSavedAt){
      m.homeSavedAt = now;
    }

    m.exteriorSaved =
    true;

    m.exteriorSavedAt =
    now;

    m.locked =
    true;

    m.lastSavedAt =
    now;

    m.overrideReason =
    overrideReason
    .trim();

    m.overrideAt =
    m.overrideReason
    ?
    now
    :
    "";

    const currentRecord =
    recordForState(
      state,
      savingId
    );

    // Keep a local fallback/cache, but do not mark the shared snapshot
    // as updated until Netlify confirms the conditional write.
    localStorage.setItem(
      STORAGE,
      JSON.stringify(state)
    );

    try{

      await pushChangesToShared([
        {
          id:savingId,
          record:currentRecord,
          expectedEtag:
          Object.prototype.hasOwnProperty.call(
            openedEtags,
            savingId
          )
          ? openedEtags[savingId]
          : null
        }
      ]);

    }
    catch(error){

      // Restore the actual saved state, but intentionally DO NOT refill
      // the form. The user's typed values remain visible.
      state.plots[savingId] =
      cloneState(previousRecord.plot);

      if(previousRecord.data === null){
        delete state.data[savingId];
      }
      else{
        state.data[savingId] =
        cloneState(previousRecord.data);
      }

      state.meta[savingId] =
      cloneState(previousRecord.meta);

      localStorage.setItem(
        STORAGE,
        JSON.stringify(state)
      );

      updateLabels();
      paint();

      if(
        error &&
        error.code === "STALE_HOMESITE"
      ){
        setSharedStatus(
          "Update detected",
          "#dc2626"
        );

        alert(
          "Someone else saved this homesite just before your save completed.\n\nYour typed information has NOT been deleted, and the newer shared record was protected from being overwritten.\n\nClose and reopen this homesite to load the current saved information."
        );
      }
      else{
        console.error(error);

        setSharedStatus(
          "Not synced",
          "#dc2626"
        );

        alert(
          "Your save could not be completed in shared storage.\n\nYour typed information is still in the form. Please try Save again."
        );
      }

      return;
    }

    unlockedForEdit =
    null;

    homeEditingFor =
    null;

    fillForm(
      savingId
    );

    updateLabels();

    $("v2PlotTitle")
    .textContent =
    plotName(
      savingId
    );

    renderRestrictions();
    renderQuickLotEdit();

    renderLockState();

    checkConflicts(
      false
    );

    closeConflictModal();

  }

  function showConflictOverride(
    conflicts
  ){

    $("v2ConflictModalList")
    .innerHTML =

    conflicts
    .map(

      c =>

      "<div>"

      +

      "<b>"

      +

      esc(
        c.label
      )

      +

      ":</b> “"

      +

      esc(
        c.value
      )

      +

      "” repeats on "

      +

      esc(
        plotName(
          c.id
        )
      )

      +

      ".</div>"

    )
    .join(
      ""
    );


    $("v2OverrideReason")
    .value =
    "";


    $("v2OverrideSave")
    .disabled =
    true;


    $("v2ConflictModal")
    .classList.add(
      "open"
    );


    setTimeout(

      () =>
      $("v2OverrideReason")
      .focus(),

      0

    );

  }


  function missingRequiredFields(form){

    const missing = [];

    [
      ["scheme","Scheme"],
      ["door","Front Door Color"],
      ["garage","Garage Door Color"],
      ["shutters","Shutter Color"]
    ].forEach(([key,label]) => {
      if(!String(form[key] || "").trim()){
        missing.push(label);
      }
    });

    if(
      form.exteriorType === "brick" &&
      !String(form.brick || "").trim()
    ){
      missing.push("Brick");
    }

    return missing;
  }


  function saveCurrent(){

    if(
      !selected
    ){

      return;

    }


    if(
      formIsLocked()
    ){

      alert(
        "This homesite is finalized and locked. Click UNLOCK before making changes."
      );

      return;

    }

    if(!metaFor(selected).homeSaved){
      alert(
        "Save Stage 1 (Address, Plan, and Elevation) before saving exterior selections."
      );
      return;
    }


    const form =
    readForm();


    const missing =
    missingRequiredFields(
      form
    );


    if(
      missing.length
    ){

      alert(
        "Complete all required information before saving:\n\n• "
        +
        missing.join(
          "\n• "
        )
      );

      return;

    }


    const conflicts =
    conflictsFor(
      form
    );


    if(
      conflicts.length
    ){

      clearFieldConflictHighlights();

      conflicts.forEach(c => {
        highlightConflictField(c.key);
      });

      $("v2Status").className =
        "v2-status bad";

      $("v2Status").innerHTML =
        "<b>✕ Conflicts found</b>";

      showConflictOverride(
        conflicts
      );

      return;

    }


    commitSave(
      form
    );

  }


  /* =========================================================
     DESELECT LOT WHEN CLICKING OPEN MAP SPACE
     ========================================================= */

  function deselectPlot(){

    selected = null;

    renderQuickLotEdit();

    // Clear the ORIGINAL prototype's selected lot too.
    // That older script has its own separate `selected` variable and was
    // re-applying the blue border after the newer editor deselected.
    if(
      window.__adeltonOriginalSelection &&
      typeof window.__adeltonOriginalSelection.clear === "function"
    ){
      window.__adeltonOriginalSelection.clear();
    }

    unlockedForEdit = null;
    homeEditingFor = null;
    restrictionMode = false;
    restrictionEditUnlocked = false;
    restrictionBase = null;

    if($("v2RestrictionMode")){
      $("v2RestrictionMode").classList.remove("active");
      $("v2RestrictionMode").textContent = "Edit";
    }

    if($("v2RestrictionAdminControls")){
      $("v2RestrictionAdminControls").style.display = "none";
    }

    if($("v2RestrictionsSection")){
      $("v2RestrictionsSection").style.display = "none";
    }

    if($("v2RestrictionHelp")){
      $("v2RestrictionHelp").innerHTML =
      'Restrictions are view-only. Click <b>Edit</b> above the map and enter the password to make changes.';
    }

    $("v2Editor").style.display = "none";

    // Hide the floating homesite details panel when nothing is selected.
    aside.style.display =
    "none";

    const emptyPanel =
    $("v2Empty");

    if(emptyPanel){
      emptyPanel.style.display = "block";
    }

    // Force a true neutral map view.
    svg.classList.add(
      "v2-map-idle"
    );

    // Clear every selection/restriction/conflict class.
    lots.forEach(el => {
      el.classList.remove(
        "selected",
        "restricted",
        "blocker",
        "v2-selected",
        "v2-restricted",
        "v2-target",
        "v2-conflict"
      );
    });

    paint();

    // Re-apply idle mode after paint so finalized lots stay green
    // and every other lot looks exactly like the untouched map.
    svg.classList.add(
      "v2-map-idle"
    );

    // Remove keyboard focus from a previously clicked lot too.
    if(
      document.activeElement &&
      document.activeElement.classList &&
      document.activeElement.classList.contains("lot")
    ){
      document.activeElement.blur();
    }

  }


  // Listen on the ENTIRE map area rather than only the transparent SVG.
  // This catches clicks on streets, open gray space, the underlying image,
  // and any other non-lot "dead area".
  mapstage.addEventListener("click", e => {

    const lot =
    e.target.closest &&
    e.target.closest(".lot");

    if(
      lot &&
      mapstage.contains(lot)
    ){
      return;
    }

    deselectPlot();

  });


  /* =========================================================
     EXTERIOR TYPE / SCHEME / FRONT DOOR INTERACTIONS
     ========================================================= */


  $("v2Elevation")
  .addEventListener(
    "change",
    () => {

      updateExteriorTypeFromElevation(
        true
      );

      renderLockState();

      if(
        selected &&
        !formIsLocked()
      ){
        previewFromForm();
        checkConflicts(true);
      }

    }
  );


  $("v2Scheme")
  .addEventListener(
    "change",
    () => {

      updateSchemeColorSummary();
      populateDoorOptions();
      populateGarageOptions();
      populateShutterOptions();

      if(
        selected &&
        !formIsLocked()
      ){
        previewFromForm();
        checkConflicts(true);
      }

    }
  );

  $("v2Door")
  .addEventListener(
    "change",
    () => {
      populateGarageOptions();
      populateShutterOptions();

      if(selected && !formIsLocked()){
        previewFromForm();
        checkConflicts(true);
      }
    }
  );

  $("v2Garage")
  .addEventListener(
    "change",
    () => {
      populateShutterOptions();

      if(selected && !formIsLocked()){
        previewFromForm();
        checkConflicts(true);
      }
    }
  );

  $("v2Shutters")
  .addEventListener(
    "change",
    () => {
      if(selected && !formIsLocked()){
        previewFromForm();
        checkConflicts(true);
      }
    }
  );


  /* =========================================================
     ZOOM
     ========================================================= */

  function setZoom(
    value
  ){

    zoom =
    Math.max(

      .75,

      Math.min(

        4,

        Math.round(
          value * 100
        )
        /
        100

      )

    );


    mapstage
    .style.width =

    Math.round(
      BASE_W *
      zoom
    )

    +

    "px";


    mapstage
    .style.minWidth =

    Math.round(
      BASE_W *
      zoom
    )

    +

    "px";


    $("v2ZoomRead")
    .textContent =

    Math.round(
      zoom *
      100
    )

    +

    "%";

  }


  /* =========================================================
     LIVE PREVIEW WHILE TYPING
     ========================================================= */

  Object.values(
    fields
  )
  .forEach(

    id => {

      $(id)
      .addEventListener(

        "input",

        () => {

          if(
            !selected ||
            formIsLocked()
          ){

            return;

          }


          updateLabels(

            selected,

            readForm()

          );


          checkConflicts(
            true
          );

        }

      );

    }

  );


  /* =========================================================
     STAGE 1 — SAVE SOLD HOME
     ========================================================= */

  async function saveHomeStage(){

    if(!selected){
      return;
    }

    const savingId = selected;
    const m = metaFor(savingId);

    if(m.exteriorSaved && formIsLocked()){
      alert(
        "This homesite is finalized and locked. Click UNLOCK before changing the home information."
      );
      return;
    }

    const address = ($("v2Address").value || "").trim();
    const plan = ($("v2Plan").value || "").trim();
    const elevation = ($("v2Elevation").value || "").trim();

    const missing = [];

    if(!address) missing.push("Address");
    if(!plan) missing.push("House Plan");
    if(!elevation) missing.push("Elevation");

    if(missing.length){
      alert(
        "Complete Stage 1 before saving:\n\n• " +
        missing.join("\n• ")
      );
      return;
    }

    const type = exteriorTypeFromElevation(elevation);

    // Check Stage 1 conflicts before anything is written.
    const stage1Candidate = {
      ...(state.data[savingId] || {}),
      address,
      plan,
      elevation,
      exteriorType:type
    };

    const stage1Conflicts =
      conflictsFor(stage1Candidate)
      .filter(c =>
        c.key === "plan" ||
        c.key === "elevation"
      );

    clearFieldConflictHighlights();

    stage1Conflicts.forEach(c => {
      highlightConflictField(c.key);
    });

    if(stage1Conflicts.length){

      const conflictIds = [
        ...new Set(
          stage1Conflicts.map(c => c.id)
        )
      ];

      paint(conflictIds);

      const statusBox = $("v2Status");
      statusBox.className = "v2-status bad";
      statusBox.innerHTML = "<b>✕ Conflicts found</b>";

      alert(
        "This home cannot be saved because the Plan / Elevation combination matches a restricted homesite.\n\nThe Plan and Elevation fields are highlighted in red."
      );

      return;
    }

    // Verify that nobody else changed this homesite after it was opened.
    let freshness;

    try{
      setSharedStatus(
        "Checking latest…",
        "#8a6b00"
      );

      freshness =
        await verifyHomesiteIsFresh(
          savingId
        );
    }
    catch(error){
      console.error(error);

      setSharedStatus(
        "Could not verify",
        "#dc2626"
      );

      alert(
        "The site could not verify the latest shared information for this homesite, so your Save Home action was stopped.\n\nYour typed information is still in the form. Check your connection and try again."
      );

      return;
    }

    if(!freshness.fresh){

      setSharedStatus(
        "Update detected",
        "#dc2626"
      );

      if(
        freshness.live &&
        freshness.live.exists
      ){
        sharedEtags[savingId] =
          freshness.live.etag;
      }

      alert(
        "This homesite was updated on another device while you were working on it.\n\nYour typed information has NOT been deleted, but Save Home was stopped so you do not overwrite the newer information.\n\nClose and reopen this homesite to load the current saved information."
      );

      return;
    }

    const previousRecord =
      recordForState(
        state,
        savingId
      );

    const current =
      state.data[savingId] || {};

    state.data[savingId] = {
      ...current,
      address,
      plan,
      elevation,
      exteriorType:type
    };

    if(type === "all-siding"){
      state.data[savingId].brick = "";
    }

    const now =
      new Date()
      .toISOString();

    m.homeSaved = true;
    m.homeSavedAt = now;

    // If Stage 1 changes after exterior completion, Stage 2 becomes pending.
    if(m.exteriorSaved && unlockedForEdit === savingId){
      m.exteriorSaved = false;
      m.exteriorSavedAt = "";
      m.locked = false;
      m.lastSavedAt = "";
      m.overrideReason = "";
      m.overrideAt = "";
    }

    const currentRecord =
      recordForState(
        state,
        savingId
      );

    // Keep the browser cache current, but only consider the save complete
    // after Netlify accepts the conditional write.
    localStorage.setItem(
      STORAGE,
      JSON.stringify(state)
    );

    try{

      await pushChangesToShared([
        {
          id:savingId,
          record:currentRecord,
          expectedEtag:
          Object.prototype.hasOwnProperty.call(
            openedEtags,
            savingId
          )
          ? openedEtags[savingId]
          : null
        }
      ]);

    }
    catch(error){

      // Restore the real saved state without replacing the user's typed form.
      state.plots[savingId] =
        cloneState(previousRecord.plot);

      if(previousRecord.data === null){
        delete state.data[savingId];
      }
      else{
        state.data[savingId] =
          cloneState(previousRecord.data);
      }

      state.meta[savingId] =
        cloneState(previousRecord.meta);

      localStorage.setItem(
        STORAGE,
        JSON.stringify(state)
      );

      updateLabels();
      paint();

      if(
        error &&
        error.code === "STALE_HOMESITE"
      ){
        setSharedStatus(
          "Update detected",
          "#dc2626"
        );

        alert(
          "Someone else saved this homesite just before your Save Home action completed.\n\nYour typed information has NOT been deleted, and the newer shared record was protected from being overwritten.\n\nClose and reopen this homesite to load the current information."
        );
      }
      else{
        console.error(error);

        setSharedStatus(
          "Not synced",
          "#dc2626"
        );

        alert(
          "Save Home could not be completed in shared storage.\n\nYour typed information is still in the form. Please try again."
        );
      }

      return;
    }

    clearFieldConflictHighlights();

    $("v2Status").className =
      "v2-status ok";

    $("v2Status").innerHTML =
      "<b>✓ No conflicts found</b>";

    homeEditingFor = null;

    updateLabels();
    fillForm(savingId);
    renderRestrictions();
    renderLockState();
    checkConflicts(false);
    paint();

    alert(
      "Home saved. This lot is now marked as Home Saved / Exterior Pending."
    );
  }




  /* =========================================================
     MOVABLE FLOATING HOMESITE PANEL
     The handle lives inside the rebuilt v2 panel.
     ========================================================= */

  (function initDraggablePanel(){

    const handle =
    $("v2DragHandle");

    if(
      !aside ||
      !handle
    ){
      return;
    }

    let dragging = false;
    let pointerId = null;
    let offsetX = 0;
    let offsetY = 0;


    function clampPosition(left, top){

      const pad = 8;

      const maxLeft =
      Math.max(
        pad,
        window.innerWidth -
        aside.offsetWidth -
        pad
      );

      // Keep at least the top/drag bar reachable even when the panel
      // is taller than the viewport.
      const maxTop =
      Math.max(
        pad,
        window.innerHeight -
        Math.min(80, aside.offsetHeight) -
        pad
      );

      return {
        left:
        Math.min(
          Math.max(pad, left),
          maxLeft
        ),

        top:
        Math.min(
          Math.max(pad, top),
          maxTop
        )
      };

    }


    handle.addEventListener(
      "pointerdown",
      e => {

        if(
          e.pointerType === "mouse" &&
          e.button !== 0
        ){
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const rect =
        aside.getBoundingClientRect();

        dragging = true;
        pointerId = e.pointerId;

        offsetX =
        e.clientX - rect.left;

        offsetY =
        e.clientY - rect.top;

        // Override the default fixed top/right placement with explicit
        // fixed top/left coordinates while keeping the panel itself fixed.
        aside.style.setProperty(
          "position",
          "fixed",
          "important"
        );

        aside.style.setProperty(
          "left",
          rect.left + "px",
          "important"
        );

        aside.style.setProperty(
          "top",
          rect.top + "px",
          "important"
        );

        aside.style.setProperty(
          "right",
          "auto",
          "important"
        );

        aside.style.setProperty(
          "bottom",
          "auto",
          "important"
        );

        aside.style.setProperty(
          "z-index",
          "200",
          "important"
        );

        aside.classList.add(
          "v2-dragging"
        );

        try{
          handle.setPointerCapture(
            e.pointerId
          );
        }
        catch(_){}

      }
    );


    handle.addEventListener(
      "pointermove",
      e => {

        if(
          !dragging ||
          e.pointerId !== pointerId
        ){
          return;
        }

        e.preventDefault();

        const next =
        clampPosition(
          e.clientX - offsetX,
          e.clientY - offsetY
        );

        aside.style.setProperty(
          "left",
          next.left + "px",
          "important"
        );

        aside.style.setProperty(
          "top",
          next.top + "px",
          "important"
        );

      }
    );


    function finishDrag(e){

      if(!dragging){
        return;
      }

      if(
        e &&
        e.pointerId !== undefined &&
        pointerId !== null &&
        e.pointerId !== pointerId
      ){
        return;
      }

      dragging = false;

      aside.classList.remove(
        "v2-dragging"
      );

      try{
        if(
          pointerId !== null &&
          handle.hasPointerCapture(pointerId)
        ){
          handle.releasePointerCapture(
            pointerId
          );
        }
      }
      catch(_){}

      pointerId = null;

    }


    handle.addEventListener(
      "pointerup",
      finishDrag
    );

    handle.addEventListener(
      "pointercancel",
      finishDrag
    );

    handle.addEventListener(
      "lostpointercapture",
      finishDrag
    );


    window.addEventListener(
      "resize",
      () => {

        if(
          !aside.style.left
        ){
          return;
        }

        const rect =
        aside.getBoundingClientRect();

        const next =
        clampPosition(
          rect.left,
          rect.top
        );

        aside.style.setProperty(
          "left",
          next.left + "px",
          "important"
        );

        aside.style.setProperty(
          "top",
          next.top + "px",
          "important"
        );

      }
    );

  })();


  /* =========================================================
     BUTTONS
     ========================================================= */

  $("v2RestrictionPickMode")
  .addEventListener(
    "click",
    () => {

      if(
        !restrictionEditUnlocked ||
        !selected
      ){
        return;
      }

      restrictionMode =
      !restrictionMode;

      if(
        $("v2QuickTwoWay") &&
        $("v2TwoWay")
      ){
        $("v2TwoWay").checked =
        $("v2QuickTwoWay").checked;
      }

      renderQuickLotEdit();
      paint();

    }
  );


  $("v2QuickTwoWay")
  .addEventListener(
    "change",
    () => {

      if($("v2TwoWay")){
        $("v2TwoWay").checked =
        $("v2QuickTwoWay").checked;
      }

    }
  );


  $("v2SaveLotBlock")
  .addEventListener(
    "click",
    () => {

      if(!selected){
        alert("Click a homesite on the map first.");
        return;
      }

      if(!restrictionEditUnlocked){
        alert("Click Edit and enter the password before making setup changes.");
        return;
      }

      const savingId =
      selected;

      const lot =
      ($("v2EditLot").value || "").trim();

      const tract =
      ($("v2EditBlock").value || "").trim();

      if(!state.plots[savingId]){
        state.plots[savingId] = {
          restricted:[],
          lot:"",
          tract:""
        };
      }

      state.plots[savingId].lot =
      lot;

      state.plots[savingId].tract =
      tract;

      persist();

      restrictionMode =
      false;

      updateLabels();

      $("v2PlotTitle").textContent =
      plotName(savingId);

      renderRestrictions();
      renderQuickLotEdit();
      paint();

      const saveButton =
      $("v2SaveLotBlock");

      saveButton.textContent =
      "Saved ✓";

      setTimeout(
        () => {

          if(
            restrictionEditUnlocked &&
            selected === savingId
          ){
            saveButton.textContent =
            "Save Homesite";
          }

        },
        700
      );

      // Remain in Edit mode so the next lot can be clicked immediately.
    }
  );


  $("v2SaveHome")
  .addEventListener(
    "click",
    saveHomeStage
  );

  $("v2EditHome")
  .addEventListener(
    "click",
    () => {
      if(!selected || !metaFor(selected).homeSaved){
        return;
      }

      homeEditingFor = selected;
      renderLockState();
      $("v2Address").focus();
    }
  );

  $("v2Save")
  .addEventListener(

    "click",

    saveCurrent

  );


  $("v2Unlock")
  .addEventListener(

    "click",

    () => {

      if(
        !selected ||
        !metaFor(selected).locked
      ){

        return;

      }


      const ok =
      confirm(
        "You are about to edit a saved homesite's information.\n\n" +
        "Be sure any changes reflect the true, approved information for this homesite.\n\n" +
        "Continue editing?"
      );


      if(
        !ok
      ){

        return;

      }


      unlockedForEdit =
      selected;

      homeEditingFor =
      selected;


      renderLockState();

    }

  );


  $("v2OverrideReason")
  .addEventListener(

    "input",

    () => {

      $("v2OverrideSave")
      .disabled =

      $("v2OverrideReason")
      .value
      .trim()
      .length
      <
      3;

    }

  );


  $("v2CancelOverride")
  .addEventListener(

    "click",

    closeConflictModal

  );


  $("v2ConflictModal")
  .addEventListener(

    "click",

    e => {

      if(
        e.target ===
        $("v2ConflictModal")
      ){

        closeConflictModal();

      }

    }

  );


  $("v2OverrideSave")
  .addEventListener(

    "click",

    () => {

      const reason =
      $("v2OverrideReason")
      .value
      .trim();


      if(
        reason.length
        <
        3
      ){

        alert(
          "Enter an approved override reason before saving."
        );

        return;

      }


      const form =
      readForm();


      const missing =
      missingRequiredFields(
        form
      );


      if(
        missing.length
      ){

        alert(
          "Complete all required information before saving:\n\n• "
          +
          missing.join(
            "\n• "
          )
        );

        closeConflictModal();

        return;

      }


      const conflicts =
      conflictsFor(
        form
      );


      if(
        !conflicts.length
      ){

        commitSave(
          form
        );

        return;

      }


      commitSave(
        form,
        reason
      );

    }

  );


  $("v2ClearSavedHome")
  .addEventListener(

    "click",

    () => {

      if(
        !selected
      ){

        return;

      }


      const m =
      metaFor(
        selected
      );


      if(
        !m.locked
      ){

        return;

      }


      const ok =
      confirm(
        "WARNING: This homesite already has finalized selections saved.\n\n"
        +
        "Clearing this home will permanently remove both Stage 1 and Stage 2 information, including Address, Plan, Elevation, Brick, Scheme, Entry Door, Garage, and Shutters. The lot will return to the unsaved color.\n\n"
        +
        "This should only be used when the home is no longer moving forward, such as after a buyer cancellation.\n\n"
        +
        "Lot / Block information and Manual Restrictions will NOT be removed.\n\n"
        +
        "Are you sure you want to CLEAR THE SAVED HOME?"
      );


      if(
        !ok
      ){

        return;

      }


      delete state.data[
        selected
      ];


      state.meta[
        selected
      ] = {
        locked:false,
        lastSavedAt:"",
        overrideReason:"",
        overrideAt:"",
        homeSaved:false,
        homeSavedAt:"",
        exteriorSaved:false,
        exteriorSavedAt:""
      };


      unlockedForEdit =
      null;


      persist();


      fillForm(
        selected
      );


      updateLabels();



      renderRestrictions();


      renderLockState();


      checkConflicts(
        false
      );


      paint();


      alert(
        "Saved home selections have been cleared from this lot."
      );

    }

  );


  $("v2Clear")
  .addEventListener(

    "click",

    () => {

      if(
        !selected
      ){

        return;

      }


      if(
        formIsLocked()
      ){

        alert(
          "This homesite is saved and locked. Click UNLOCK before making changes."
        );

        return;

      }


      Object.values(
        fields
      )
      .forEach(

        id => {

          $(id).value =
          "";

        }

      );


      setExteriorType("");
      renderExteriorTypeUI();
      populateSchemeOptions();
      populateDoorOptions();
      populateGarageOptions();
      populateShutterOptions();
      updateSchemeColorSummary();

      updateLabels(

        selected,

        readForm()

      );


      checkConflicts(
        true
      );

    }

  );


  $("v2RestrictionMode")
  .addEventListener(

    "click",

    () => {

      if(
        restrictionEditUnlocked
      ){

        persist();

        restrictionEditUnlocked =
        false;

        restrictionMode =
        false;

        $("v2RestrictionMode")
        .classList.remove(
          "active"
        );

        $("v2RestrictionMode")
        .textContent =
        "Edit";

        $("v2RestrictionAdminControls")
        .style.display =
        "none";


        $("v2RestrictionsSection")
        .style.display =
        "none";

        renderQuickLotEdit();



        $("v2RestrictionHelp")
        .innerHTML =
        'Restrictions are view-only. Click <b>Edit</b> above the map and enter the password to make changes.';

        $("v2ModeNote")
        .style.display =
        "none";

        renderRestrictions();

        paint();

        return;

      }


      const entered =
      prompt(
        "Enter the password to edit Lot / Block assignments and Manual Restrictions:"
      );


      if(
        entered === null
      ){

        return;

      }


      if(
        entered !==
        RESTRICTION_EDIT_PASSWORD
      ){

        alert(
          "Incorrect password."
        );

        return;

      }


      restrictionEditUnlocked =
      true;


      restrictionMode =
      false;

      renderQuickLotEdit();


      $("v2RestrictionsSection")
      .style.display =
      "none";


      $("v2RestrictionMode")
      .classList.add(
        "active"
      );


      $("v2RestrictionMode")
      .textContent =
      "Done Editing";


      $("v2RestrictionAdminControls")
      .style.display =
      "none";


      $("v2RestrictionHelp")
      .innerHTML =
      "<b>Edit mode is unlocked.</b> Click a homesite, enter Lot / Block, add any Restricted Lots, then click Save Homesite. You will remain in Edit mode so you can click the next lot. Click Done Editing only when you are finished.";


      $("v2ModeNote")
      .style.display =
      "block";


      renderRestrictions();

      paint();

    }

  );


  $("v2GenerateSchemePdf")
  .addEventListener(
    "click",
    generateSchemePdf
  );


  $("v2ZoomIn")
  .addEventListener(

    "click",

    () =>
    setZoom(
      zoom + .25
    )

  );


  $("v2ZoomOut")
  .addEventListener(

    "click",

    () =>
    setZoom(
      zoom - .25
    )

  );


  $("v2ZoomReset")
  .addEventListener(

    "click",

    () =>
    setZoom(
      1.5
    )

  );


  $("v2Fit")
  .addEventListener(

    "click",

    () =>
    setZoom(
      1
    )

  );




  /* =========================================================
     TOP SUMMARY BAR + PRINT-TO-PDF SCHEME SHEET
     ========================================================= */

  function updateTopSummary(){
    const bar = $("v2TopSummary");
    if(!bar) return;

    if(!selected){
      bar.classList.remove("show");
      return;
    }

    bar.classList.add("show");

    const d = state.data[selected] || {};
    const plot = (state.plots && state.plots[selected]) || {};
    const m = metaFor(selected);

    $("v2TopHomesite").textContent =
      plot.lot
        ? "Lot " + plot.lot + (plot.tract ? " / Block " + plot.tract : "")
        : selected;

    $("v2TopAddress").textContent = d.address || "—";

    $("v2TopPlanElevation").textContent =
      [d.plan, d.elevation].filter(Boolean).join(" / ") || "—";

    $("v2TopScheme").textContent =
      d.scheme ? "Scheme " + d.scheme : "—";

    const status = $("v2TopStatus");
    const dot = $("v2TopStatusDot");
    const pdfButton = $("v2GenerateSchemePdf");

    dot.className = "v2-top-status-dot";

    if(m.exteriorSaved){
      status.textContent = "Complete";
      dot.classList.add("complete");
    } else if(m.homeSaved){
      status.textContent = "Exterior Pending";
      dot.classList.add("pending");
    } else {
      status.textContent = "Not Saved";
    }

    pdfButton.disabled = !selected;
  }


  /* Screen/PDF swatches are representative only.
     Add or refine hex values here as desired. */
  const PDF_COLOR_HEX = {
    "SW 7006 Extra White":"#EEEDE7",
    "SW 6258 Tricorn Black":"#2F2F30",
    "SW 9140 Blustery Sky":"#6F8793",
    "SW 7615 Sea Serpent":"#3E4B50",
    "SW 6866 Heartthrob":"#AD3938",
    "SW 7008 Alabaster":"#EDEAE0",
    "SW 7023 Requisite Gray":"#B9B2A9",
    "SW 7019 Gauntlet Gray":"#78736E",
    "SW 7037 Balanced Beige":"#C1B2A0",
    "SW 7622 Homburg Gray":"#666B64",
    "SW 7022 Natural Choice":"#E3DED0",
    "SW 7020 Black Fox":"#4F4842",
    "SW 9130 Evergreen Fog":"#95978A",
    "SW 7036 Accessible Beige":"#D1C7B8",
    "SW 7042 Shoji White":"#E6DFD3",
    "SW 7069 Iron Ore":"#434341",
    "SW 7674 Peppercorn":"#585858",
    "SW Light French Gray":"#C2C0BB",
    "SW 9166 Drift of Mist":"#DCD8D0",
    "SW 7005 Pure White":"#EDECE6",
    "SW 6208 Pewter Green":"#5E6259",
    "SW Red Barn 7591":"#7C453D",
    "SW 6244 Naval":"#2F3D4C",
    "SW 6209 Ripe Olive":"#44483D",
    "SW 7048 Urbane Bronze":"#54504A",
    "SW 7048 Urban Bronze":"#54504A",
    "SW 7600 Bolero":"#903934",
    "SW 6237 Dark Night":"#23383E",
    "SW 6188 Shade-Grown":"#4C5147",
    "SW Turkish Coffee":"#4A382B"
  };

  function pdfSwatchHex(color){
    return PDF_COLOR_HEX[color] || "#D7D5D0";
  }

  function splitSwColor(value){
    const raw = String(value || "").trim();
    let m = raw.match(/^SW\s+(\d+)\s+(.+)$/i);
    if(m){
      return {name:m[2], code:"SW " + m[1]};
    }
    m = raw.match(/^SW\s+(.+?)\s+(\d+)$/i);
    if(m){
      return {name:m[1], code:"SW " + m[2]};
    }
    if(/^SW\s+/i.test(raw)){
      return {name:raw.replace(/^SW\s+/i, ""), code:"SW"};
    }
    return {name:raw || "—", code:""};
  }

  function pdfColorCard(label, value){
    const parsed = splitSwColor(value);
    const hex = pdfSwatchHex(value);
    return `
      <div class="pdf-color-card" style="background:${hex}">
        <div class="pdf-color-overlay">
          <div class="pdf-color-label">${esc(label)}</div>
          <div class="pdf-color-name">${esc(parsed.name)}</div>
          <div class="pdf-color-code">${esc(parsed.code)}</div>
        </div>
      </div>`;
  }

  function generateSchemePdf(){
    if(!selected){
      alert("Select a homesite first.");
      return;
    }

    const d = state.data[selected] || {};
    const m = metaFor(selected);
    const plot = (state.plots && state.plots[selected]) || {};

    /* PDF is only available after the exterior has been saved. */
    if(!m.exteriorSaved){
      alert("Save the exterior selections before generating the PDF.");
      return;
    }

    if(!d.scheme){
      alert("Choose a scheme for this homesite before generating the PDF.");
      return;
    }

    const fixed = SCHEME_FIXED_COLORS[d.scheme] || {};
    const type = exteriorTypeFromData(d);

    const missing = [];
    if(!d.door) missing.push("Entry Door");
    if(!d.garage) missing.push("Garage Door");
    if(!d.shutters) missing.push("Shutters");
    if(missing.length){
      alert("Choose the following before generating the PDF: " + missing.join(", ") + ".");
      return;
    }

    const cards = [];
    cards.push(pdfColorCard("Primary Siding", fixed.primary || d.primaryColor || ""));

    if(type === "all-siding"){
      cards.push(pdfColorCard("Secondary Siding", fixed.secondary || d.secondaryColor || ""));
    }

    cards.push(pdfColorCard("Fascia", fixed.fascia || d.fasciaColor || ""));
    cards.push(pdfColorCard("Trim / Soffits / Columns", fixed.trim || d.trimColor || ""));
    cards.push(pdfColorCard("Shutters", d.shutters || ""));
    cards.push(pdfColorCard("Garage Door", d.garage || ""));
    cards.push(pdfColorCard("Entry Door", d.door || ""));

    let brickName = "";
    if(type === "brick" && d.brick){
      const option = Array.from($("v2Brick").options).find(o => o.value === d.brick);
      brickName = option ? option.textContent : d.brick;
    }

    const lotBlock = plot.lot
      ? "Lot " + plot.lot + (plot.tract ? " / Block " + plot.tract : "")
      : selected;

    const printWindow = window.open("", "_blank");
    if(!printWindow){
      alert("Your browser blocked the PDF window. Allow pop-ups for this site and try again.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${esc(lotBlock)} - Scheme ${esc(d.scheme || "")}</title>
<style>
  @page{size:letter portrait;margin:.32in}
  *{box-sizing:border-box}
  html,body{
    margin:0;
    padding:0;
    background:#f7f4ef;
    color:#242424;
    font-family:Arial,Helvetica,sans-serif;
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
  }
  body{padding:28px 30px 22px}

  .pdf-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:18px;
    margin-bottom:18px;
  }
  .pdf-title{
    font-family:Georgia,'Times New Roman',serif;
    font-size:25px;
    font-weight:700;
    letter-spacing:.03em;
  }
  .pdf-subtitle{
    margin-top:4px;
    font-size:8px;
    font-weight:700;
    letter-spacing:.14em;
    color:#7b756f;
    text-transform:uppercase;
  }
  .pdf-community{
    padding:8px 13px;
    border-radius:999px;
    background:#e9e4dc;
    color:#403c37;
    font-size:9px;
    font-weight:800;
    letter-spacing:.06em;
    text-transform:uppercase;
    white-space:nowrap;
  }

  .pdf-home-info{
    display:grid;
    grid-template-columns:2fr 1.15fr .65fr .75fr;
    gap:0;
    background:#fff;
    border:1px solid #e1dbd4;
    border-radius:14px;
    overflow:hidden;
    margin-bottom:20px;
  }
  .pdf-info-cell{
    min-height:68px;
    padding:14px 15px 12px;
    border-right:1px solid #e9e3dc;
  }
  .pdf-info-cell:last-child{border-right:0}
  .pdf-info-label{
    font-size:7px;
    font-weight:800;
    color:#8a837b;
    letter-spacing:.08em;
    text-transform:uppercase;
    margin-bottom:7px;
  }
  .pdf-info-value{
    font-size:12px;
    line-height:1.25;
    font-weight:800;
    color:#242424;
  }
  .pdf-info-value.large{font-size:14px}

  .pdf-section-head{
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    gap:20px;
    margin:0 1px 10px;
  }
  .pdf-section-title{
    font-size:11px;
    font-weight:900;
    letter-spacing:.04em;
    text-transform:uppercase;
  }
  .pdf-section-note{
    font-size:7px;
    color:#817b74;
  }

  .pdf-color-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
  }
  .pdf-color-card{
    position:relative;
    height:122px;
    border:1px solid rgba(80,74,68,.16);
    border-radius:13px;
    overflow:hidden;
    box-shadow:0 2px 6px rgba(0,0,0,.06);
  }
  .pdf-color-overlay{
    position:absolute;
    left:8px;
    right:8px;
    bottom:8px;
    padding:8px 10px 9px;
    border-radius:9px;
    background:rgba(255,255,255,.82);
    box-shadow:0 1px 4px rgba(0,0,0,.08);
  }
  .pdf-color-label{
    font-size:6.5px;
    line-height:1.15;
    font-weight:900;
    letter-spacing:.045em;
    text-transform:uppercase;
    color:#6f6962;
    margin-bottom:3px;
  }
  .pdf-color-name{
    font-size:11px;
    line-height:1.15;
    font-weight:900;
    color:#1f1f1f;
  }
  .pdf-color-code{
    margin-top:2px;
    font-size:7px;
    color:#5f5a55;
  }

  .pdf-brick{
    margin-top:12px;
    padding:10px 12px;
    border:1px solid #dfd8d0;
    border-radius:10px;
    background:#eee9e2;
    font-size:9px;
    line-height:1.4;
  }
  .pdf-brick b{
    font-size:7px;
    letter-spacing:.055em;
    text-transform:uppercase;
    margin-right:7px;
  }

  .pdf-footer{
    margin-top:14px;
    padding-top:9px;
    border-top:1px solid #ddd6ce;
    display:flex;
    justify-content:space-between;
    gap:18px;
    align-items:flex-end;
    color:#77716a;
    font-size:6.5px;
    line-height:1.4;
  }
  .pdf-disclaimer{max-width:420px}
  .pdf-record{
    font-weight:800;
    letter-spacing:.04em;
    text-transform:uppercase;
    white-space:nowrap;
  }

  @media print{
    body{padding:0}
    .pdf-color-card{box-shadow:none}
  }
</style>
</head>
<body>

  <div class="pdf-header">
    <div>
      <div class="pdf-title">Exterior Color Selections</div>
      <div class="pdf-subtitle">Approved Exterior Palette</div>
    </div>
    <div class="pdf-community">Stoney Chase</div>
  </div>

  <div class="pdf-home-info">
    <div class="pdf-info-cell">
      <div class="pdf-info-label">Address</div>
      <div class="pdf-info-value">${esc(d.address || "—")}</div>
    </div>
    <div class="pdf-info-cell">
      <div class="pdf-info-label">Lot / Block</div>
      <div class="pdf-info-value">${esc(lotBlock)}</div>
    </div>
    <div class="pdf-info-cell">
      <div class="pdf-info-label">Plan</div>
      <div class="pdf-info-value large">${esc(d.plan || "—")}</div>
    </div>
    <div class="pdf-info-cell">
      <div class="pdf-info-label">Elevation</div>
      <div class="pdf-info-value large">${esc(d.elevation || "—")}</div>
    </div>
  </div>

  <div class="pdf-section-head">
    <div class="pdf-section-title">Selected Colors</div>
    <div class="pdf-section-note">Color blocks are representative only.</div>
  </div>

  <div class="pdf-color-grid">
    ${cards.join("")}
  </div>

  ${brickName ? `
    <div class="pdf-brick">
      <b>Brick / Stone</b>${esc(brickName)}
    </div>` : ""}

  <div class="pdf-footer">
    <div class="pdf-disclaimer">
      Screen and printed colors are representative only and may vary from approved physical samples. The written color names and codes shown on this sheet are the approved selections and should be used for final exterior color reference.
    </div>
    <div class="pdf-record">Exterior Color Record</div>
  </div>

  <script>
    window.addEventListener('load',()=>setTimeout(()=>window.print(),250));
  <\/script>
</body>
</html>`);

    printWindow.document.close();
  }


  /* =========================================================
     START
     ========================================================= */

  createLabels();

  setZoom(
    1.5
  );

  paint();

  // Load the shared Netlify Blob data for everyone using this site.
  loadSharedState();


  // Start the map automatically in Fit view.
  // The hidden Fit button is retained internally so the existing fit logic stays reusable.
  setTimeout(() => {
    $("v2Fit").click();
  }, 0);

})();

</script>
</body>
</html>
