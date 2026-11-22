/* Dje_zombie — dessins des personnages et des objets (SVG pur, style flat).
   Chaque personnage est dessiné dans une boîte de 200 × 300, pieds en (100, 296). */
(function (root) {
  'use strict';
  var DJE = root.DJE;

  function c(cx, cy, r, f, extra) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"' + (extra || '') + '/>'; }
  function e(cx, cy, rx, ry, f, extra) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (extra || '') + '/>'; }
  function r(x, y, w, h, f, rx, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + f + '"' + (extra || '') + '/>'; }
  function m(pts, col, w, extra) { return '<polyline points="' + pts + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '/>'; }
  function p(d, f, extra) { return '<path d="' + d + '" fill="' + f + '"' + (extra || '') + '/>'; }
  var ombre = e(100, 297, 50, 7, '#000', ' opacity=".35"');

  /* Silhouette de base, de face */
  function base(o) {
    var s = '';
    s += m(o.jambeG || '86,196 83,248 80,292', o.pantalon || o.vet, o.ep || 15);
    s += m(o.jambeD || '114,196 117,248 120,292', o.pantalon || o.vet, o.ep || 15);
    s += '<g class="respire">';
    s += r(o.cx || 66, o.cy || 96, o.cw || 68, o.ch || 106, o.vet, 12);
    s += p('M' + (o.cx || 66) + ',' + ((o.cy || 96) + (o.ch || 106) - 22) + ' l10,16 l12,-10 l12,14 l12,-12 l11,14 l11,-12 v-12 h-' + (o.cw || 68) + 'z', o.vetSombre || 'rgba(0,0,0,.25)');
    s += m(o.brasG || '72,108 55,150 49,192', o.peau, o.epb || 12);
    s += m(o.brasD || '128,108 145,150 151,192', o.peau, o.epb || 12);
    s += o.corps || '';
    s += c(100, o.ty || 62, o.tr || 30, o.peau);
    s += o.tete || '';
    s += '</g>';
    return s;
  }
  function yeux(col, ry, dx) {
    dx = dx || 0;
    return c(88 + dx, ry || 58, 4.5, col) + c(112 + dx, ry || 58, 4.5, col);
  }

  var P = {};

  P.rouille = function (o) {
    var peau = '#a08f7d', rouille = '#c4622d';
    return base({
      peau: peau, vet: '#5c4535', pantalon: '#4a382c',
      brasG: '72,108 58,192', brasD: '128,108 142,192', jambeG: '86,196 82,292', jambeD: '114,196 118,292',
      corps: c(80, 122, 9, rouille) + c(117, 152, 12, rouille) + c(93, 178, 7, rouille) +
        c(65, 150, 7, '#e07b39') + c(135, 150, 7, '#e07b39'),
      tete: c(116, 46, 8, rouille) + c(82, 74, 5, rouille) + yeux('#ffe3b0', 60) + m('90,78 110,77', '#3b2a20', 3)
    }) + c(82, 248, 8, '#e07b39') + c(118, 248, 8, '#e07b39');
  };

  P.ecouteur = function (o) {
    var peau = '#a9b4a6';
    return base({
      peau: peau, vet: '#3d4a5c',
      tete: '<g transform="rotate(-8 100 62)">' +
        e(60, 50, 21, 36, peau) + e(60, 50, 10, 23, '#7e8b7c') +
        e(141, 72, 21, 36, peau) + e(141, 72, 10, 23, '#7e8b7c') +
        c(100, 62, 30, peau) +
        m('84,62 95,62', '#2a3330', 3) + m('105,62 116,62', '#2a3330', 3) + m('92,80 108,80', '#2a3330', 3) + '</g>'
    });
  };

  P.vitreux = function (o) {
    var peau = '#9aa8a6';
    return base({
      peau: peau, vet: '#2f3d4f', cx: 70, cw: 60,
      tete: c(86, 58, 12.5, '#eef5f6') + c(114, 58, 12.5, '#eef5f6') + c(86, 59, 6, '#bcd6e8') + c(114, 59, 6, '#bcd6e8') +
        c(86, 58, 15, '#dff2ff', ' opacity=".25"') + c(114, 58, 15, '#dff2ff', ' opacity=".25"') + m('92,82 108,82', '#33403e', 3)
    });
  };

  P.rampeur = function (o) {
    var peau = '#82978b', vet = '#33414f';
    return e(100, 297, 92, 6, '#000', ' opacity=".35"') +
      m('46,252 16,276 6,292', vet, 13) + m('56,262 34,286 26,294', vet, 13) +
      '<g class="respire">' +
      r(34, 232, 118, 40, vet, 16) +
      m('140,240 166,272 196,292', peau, 11) + m('128,252 152,284 180,296', peau, 11) +
      c(170, 244, 24, peau) + c(178, 238, 4, '#d8e4c8') + c(164, 238, 4, '#d8e4c8') + m('160,256 178,256', '#273330', 3) +
      '</g>';
  };

  P.geant = function (o) {
    var peau = '#8b9a8f', vet = '#3a3530';
    return e(100, 297, 70, 8, '#000', ' opacity=".4"') +
      m('74,200 70,292', '#2b2724', 28) + m('126,200 130,292', '#2b2724', 28) +
      '<g class="respire">' +
      r(38, 54, 124, 152, vet, 20) +
      p('M38,180 l14,18 l16,-12 l16,16 l16,-14 l16,16 l16,-14 l16,14 l14,-12 v-14 h-124z', 'rgba(0,0,0,.3)') +
      m('46,70 24,148 22,204', peau, 26) + m('154,70 176,148 178,204', peau, 26) +
      c(22, 212, 15, peau) + c(178, 212, 15, peau) +
      c(100, 32, 21, peau) + c(93, 31, 3.5, '#e8e2c8') + c(107, 31, 3.5, '#e8e2c8') + m('88,24 112,24', '#3c463f', 4) +
      '</g>';
  };

  P.siffleur = function (o) {
    var peau = '#96a497', vet = '#2d3748', pose = o.pose || 'siffle';
    var brasD = pose === 'siffle' ? m('115,110 140,96 109,76', peau, 10) + m('109,76 103,71', peau, 5) + m('110,79 104,78', peau, 5) : m('115,110 130,156 133,196', peau, 10);
    var regard = pose === 'regarde' ? 4 : 0;
    return ombre + m('93,204 89,292', '#252c38', 11) + m('107,204 111,292', '#252c38', 11) +
      '<g class="respire">' +
      r(82, 96, 36, 112, vet, 10) + p('M82,190 l8,14 l7,-9 l8,12 l7,-10 l6,11 v-18z', 'rgba(0,0,0,.3)') +
      m('85,110 70,160 66,198', peau, 10) +
      m('100,82 100,98', peau, 8) +
      c(100, 58, 26, peau) +
      c(90 + regard, 53, 3.5, '#e9f0dc') + c(108 + regard, 53, 3.5, '#e9f0dc') +
      (pose === 'siffle' ? c(110, 68, 5, '#a9b8aa') : m('94,70 106,70', '#2c3530', 3)) +
      brasD + '</g>';
  };

  P.braise = function (o) {
    var ch = '#2b1e1b', lave = '#ff7b2e';
    return c(100, 160, 96, '#ff6a1a', ' opacity=".10"') + c(100, 150, 60, '#ff8a2a', ' opacity=".10"') +
      ombre + m('86,196 83,248 80,292', ch, 15) + m('114,196 117,248 120,292', ch, 15) +
      m('84,230 82,262', lave, 3) + m('118,224 119,260', lave, 3) +
      '<g class="respire">' +
      r(66, 96, 68, 106, ch, 12) +
      m('76,108 92,134 84,160 100,184', lave, 3.5) + m('124,112 110,140 122,166', lave, 3.5) + m('96,120 108,128', lave, 3) +
      m('72,108 55,150 49,192', ch, 12) + m('128,108 145,150 151,192', ch, 12) +
      m('60,140 55,160', lave, 3) + m('140,140 146,162', lave, 3) +
      c(100, 62, 30, ch) + m('80,52 96,64 88,80', lave, 3) + m('118,46 112,60', lave, 3) +
      c(88, 60, 6, '#ffd36b') + c(112, 60, 6, '#ffd36b') + c(88, 60, 11, '#ffb347', ' opacity=".35"') + c(112, 60, 11, '#ffb347', ' opacity=".35"') +
      '<g>' +
      p('M84,38 L92,6 L100,36 Z', '#ff8a2a', ' class="flamme"') + p('M96,36 L106,-6 L116,36 Z', '#ffb347', ' class="flamme"') +
      p('M108,40 L118,14 L124,42 Z', '#ff8a2a', ' class="flamme"') + p('M60,110 L64,86 L72,108 Z', '#ff8a2a', ' class="flamme"') +
      p('M128,108 L136,82 L142,110 Z', '#ffb347', ' class="flamme"') +
      '</g></g>';
  };

  P.brume = function (o) {
    var col = '#cfd8e3';
    return '<g opacity=".82">' +
      e(70, 280, 60, 16, col, ' opacity=".22" class="oscille"') + e(140, 286, 56, 13, col, ' opacity=".18" class="oscille"') +
      '<g class="respire">' +
      p('M66,100 Q58,180 36,246 Q66,228 78,264 Q94,232 110,268 Q122,234 156,252 Q142,180 134,100 Z', col) +
      m('70,110 50,160 44,200', col, 10, ' opacity=".8"') + m('130,110 150,160 156,200', col, 10, ' opacity=".8"') +
      c(100, 62, 30, col) + e(87, 62, 6.5, 9, '#45556d') + e(113, 62, 6.5, 9, '#45556d') + e(100, 82, 5, 3, '#6b7b92') +
      '</g></g>';
  };

  P.sansyeux = function (o) {
    var peau = '#7d4a4a';
    return c(100, 60, 58, '#ff3b3b', ' opacity=".07"') +
      base({
        peau: peau, vet: '#261c22',
        brasG: '72,108 60,140 58,184', brasD: '128,108 142,140 146,184',
        tete: e(93, 66, 4.5, 3.2, '#140808') + e(107, 66, 4.5, 3.2, '#140808') +
          e(93, 66, 8, 6, 'none', ' stroke="#ff5a5a" stroke-width="1.5" opacity=".7"') + e(107, 66, 8, 6, 'none', ' stroke="#ff5a5a" stroke-width="1.5" opacity=".7"') +
          m('90,84 110,84', '#2b1414', 3) + m('84,40 116,40', '#653636', 3)
      }) +
      '<g class="oscille" opacity=".6">' +
      p('M50,40 q8,-10 0,-20 q-8,-10 0,-20', 'none', ' stroke="#ff5a5a" stroke-width="3"') +
      p('M150,46 q8,-10 0,-20 q-8,-10 0,-20', 'none', ' stroke="#ff5a5a" stroke-width="3"') +
      p('M100,18 q8,-8 0,-16', 'none', ' stroke="#ff5a5a" stroke-width="3"') + '</g>';
  };

  P.joueur = function (o) {
    var peau = '#e2c7a3', vet = '#3d6ea8', pant = '#263042', pose = o.pose || 'debout';
    if (pose === 'cache') {
      return e(100, 297, 46, 6, '#000', ' opacity=".35"') +
        m('86,250 70,274 88,294', pant, 15) + m('114,250 130,274 112,294', pant, 15) +
        '<g class="respire">' + r(68, 170, 64, 84, vet, 14) + m('74,184 66,224 92,244', peau, 11) + m('126,184 134,224 108,244', peau, 11) +
        c(100, 142, 30, '#2f5a8c') + c(100, 146, 24, peau) + c(91, 144, 3.5, '#1d2230') + c(109, 144, 3.5, '#1d2230') + '</g>';
    }
    var jG = '86,196 83,248 80,292', jD = '114,196 117,248 120,292', bG = '72,108 58,150 54,190', bD = '128,108 142,150 146,190';
    if (pose === 'court') { jG = '88,196 62,246 44,288'; jD = '112,196 134,238 152,284'; bG = '72,108 48,138 40,168'; bD = '128,108 152,146 172,136'; }
    return ombre + m(jG, pant, 15) + m(jD, pant, 15) +
      '<g class="respire">' + r(66, 96, 68, 106, vet, 14) + m('80,98 84,150', '#24466e', 5) + m('120,98 116,150', '#24466e', 5) +
      m(bG, vet, 13) + m(bD, vet, 13) +
      c(100, 60, 32, '#2f5a8c') + c(100, 64, 25, peau) + c(91, 62, 3.5, '#1d2230') + c(109, 62, 3.5, '#1d2230') + '</g>';
  };

  /* Ombre de zombie générique (pour la horde) */
  P.ombre = function (o) {
    var col = o.col || '#0a101c', k = o.k || 0;
    var bras = k % 2 ? '72,108 50,128 30,132' : '72,108 55,150 49,192';
    var bras2 = k % 3 ? '128,108 150,128 170,128' : '128,108 145,150 151,192';
    return '<g>' + m('86,196 83,248 80,292', col, 15) + m('114,196 117,248 120,292', col, 15) + r(66, 96, 68, 106, col, 12) +
      m(bras, col, 12) + m(bras2, col, 12) + c(100 + (k % 2 ? 4 : -3), 62, 30, col) + '</g>';
  };

  /* Case JACKPOT */
  P.jackpot = function () {
    return '<g>' + r(30, 70, 140, 200, '#2a1f02', 18, ' stroke="#ffc93c" stroke-width="6"') +
      '<text x="100" y="212" text-anchor="middle" font-size="150" font-weight="900" fill="#ffc93c" font-family="Arial, sans-serif">?</text>' +
      c(48, 88, 5, '#fff3c0') + c(152, 252, 5, '#fff3c0') + c(150, 90, 3, '#fff3c0') + '</g>';
  };

  var tailles = { geant: 1.45, rampeur: 1.05 };

  DJE.portraits = {
    taille: function (id) { return tailles[id] || 1; },
    /* Dessin d'un personnage. o.pose : marche | siffle | regarde | tombe | debout | cache | court */
    dessiner: function (id, o) {
      o = o || {};
      var f = P[id] || P.ombre, s = f(o);
      if (o.ondes) {
        var cx = id === 'siffleur' ? 106 : 100, cy = id === 'siffleur' ? 74 : 62;
        s += '<g class="ondes' + (o.ondes === 2 ? ' vite' : '') + '">' + c(cx, cy, 18, 'none') + c(cx, cy, 18, 'none') + c(cx, cy, 18, 'none') + '</g>';
      }
      if (o.pose === 'tombe') s = '<g transform="rotate(-84 100 292) translate(-40 0)">' + s + '</g>';
      return s;
    },
    /* Une horde de silhouettes autour d'un point */
    horde: function (n, col) {
      var s = '<g class="horde-g">', pos = [[-230, 10, .8], [-150, -20, .7], [-70, 30, .95], [10, -10, .75], [90, 25, .9], [170, -25, .65], [240, 5, .85], [-300, -30, .6], [310, -15, .6]];
      for (var i = 0; i < Math.min(n, pos.length); i++) {
        var q = pos[i];
        s += '<g transform="translate(' + (q[0] - 100 * q[2]) + ' ' + (q[1] - 296 * q[2]) + ') scale(' + q[2] + ')">' + P.ombre({ k: i, col: col }) + '</g>';
      }
      return s + '</g>';
    },
    svg: function (id, o, vb) {
      return '<svg viewBox="' + (vb || '0 -10 200 310') + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + (id === 'jackpot' ? P.jackpot() : DJE.portraits.dessiner(id, o)) + '</svg>';
    }
  };

  /* Icônes d'objets (24 × 24) */
  var I = {
    corde: '<circle cx="12" cy="12" r="8" fill="none" stroke="#d9b77a" stroke-width="2.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="#d9b77a" stroke-width="2.6"/><path d="M19 15 L23 22" stroke="#d9b77a" stroke-width="2.6" stroke-linecap="round"/>',
    allumettes: '<rect x="3" y="11" width="18" height="10" rx="2" fill="#c0392b"/><rect x="5" y="13" width="14" height="6" rx="1" fill="#e8d7a8"/><path d="M8 11 L15 3" stroke="#e8d7a8" stroke-width="2"/><circle cx="15.5" cy="2.8" r="2" fill="#ff5a3a"/>',
    lampe: '<rect x="2" y="9" width="12" height="6" rx="2" fill="#7f8ea6"/><path d="M14 8 L18 6 V18 L14 16 Z" fill="#aab6c8"/><path d="M18 7 L24 3 V21 L18 17 Z" fill="#fff3c0" opacity=".8"/>',
    couverture: '<rect x="3" y="5" width="18" height="14" rx="2" fill="#a0522d"/><path d="M3 9 H21 M3 13 H21 M3 17 H21" stroke="#e1b07e" stroke-width="1.6"/>',
    pierre: '<ellipse cx="8" cy="16" rx="6" ry="4.5" fill="#8f98a3"/><ellipse cx="16" cy="14" rx="5" ry="4" fill="#a9b1bb"/><ellipse cx="12" cy="9" rx="4" ry="3" fill="#7d8692"/>',
    gourde: '<rect x="9" y="1" width="6" height="4" rx="1" fill="#5d6b7a"/><rect x="5" y="5" width="14" height="17" rx="6" fill="#2e8bc0"/><rect x="8" y="9" width="3" height="9" rx="1.5" fill="#9fd3f0"/>',
    fusee: '<rect x="9" y="9" width="6" height="14" rx="1.5" fill="#d63a2f"/><path d="M12 9 C 7 6, 11 3, 12 0 C 13 3, 17 6, 12 9 Z" fill="#ffd24a"/>',
    seau: '<path d="M4 8 H20 L18 22 H6 Z" fill="#9aa7b3"/><path d="M4 8 C 4 1, 20 1, 20 8" fill="none" stroke="#6e7a86" stroke-width="2"/><rect x="4" y="7" width="16" height="2.5" fill="#6e7a86"/>',
    couvsurvie: '<rect x="3" y="4" width="18" height="16" rx="1" fill="#e5b93c"/><path d="M3 9 L9 6 L14 11 L21 7 M3 15 L8 12 L14 17 L21 13" stroke="#fff1b0" stroke-width="1.4" fill="none"/>',
    corne: '<path d="M2 10 L14 6 V18 L2 14 Z" fill="#d1d6dc"/><rect x="14" y="8" width="6" height="8" rx="2" fill="#c0392b"/><circle cx="21" cy="12" r="2.5" fill="#2c3e50"/>',
    extincteur: '<rect x="7" y="6" width="10" height="17" rx="4" fill="#d63a2f"/><rect x="9" y="2" width="6" height="4" fill="#3b3b3b"/><path d="M15 3 H21 L23 7" stroke="#3b3b3b" stroke-width="2" fill="none"/>',
    piedbiche: '<path d="M5 21 L17 5 C 19 2, 23 4, 21 7" fill="none" stroke="#c0392b" stroke-width="3.2" stroke-linecap="round"/><path d="M5 21 L2 19" stroke="#c0392b" stroke-width="3.2" stroke-linecap="round"/>',
    sifflet: '<circle cx="9" cy="14" r="6.5" fill="#d7dde3"/><rect x="11" y="9" width="11" height="5" rx="1.5" fill="#d7dde3"/><circle cx="9" cy="14" r="2.5" fill="#5b6773"/><path d="M3 4 Q 8 1, 10 6" stroke="#c0392b" stroke-width="2" fill="none"/>',
    briquet: '<rect x="7" y="9" width="10" height="14" rx="2" fill="#2e86de"/><rect x="7" y="7" width="10" height="3" fill="#aab6c8"/><path d="M12 7 C 9 5, 11 2, 12 0 C 13 2, 15 5, 12 7 Z" fill="#ffb02e"/>'
  };
  DJE.icones = {
    objet: function (id) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (I[id] || '<circle cx="12" cy="12" r="8" fill="#888"/>') + '</svg>'; },
    crane: function (plein) {
      var col = plein ? '#ff4545' : 'rgba(255,255,255,.2)';
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 C 6 2, 3 6, 3 10 C 3 13, 5 15, 7 15.5 V19 H17 V15.5 C 19 15, 21 13, 21 10 C 21 6, 18 2, 12 2 Z" fill="' + col + '"/><circle cx="8.5" cy="10" r="2.4" fill="#05080f"/><circle cx="15.5" cy="10" r="2.4" fill="#05080f"/><rect x="10" y="19" width="1.6" height="3" fill="' + col + '"/><rect x="12.4" y="19" width="1.6" height="3" fill="' + col + '"/></svg>';
    },
    son: function (on) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="#fff"/>' +
        (on ? '<path d="M16 8 Q 19 12, 16 16 M18.5 5.5 Q 23 12, 18.5 18.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>' : '<path d="M16 9 L22 15 M22 9 L16 15" stroke="#ff6b6b" stroke-width="2.4" stroke-linecap="round"/>') + '</svg>';
    },
    voix: function (on) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="8" r="4.5" fill="#fff"/><path d="M2 21 C 2 15, 18 15, 18 21 Z" fill="#fff"/>' +
        (on ? '<path d="M19 6 Q 22 9, 19 12" stroke="#2ef2e0" stroke-width="2" fill="none" stroke-linecap="round"/>' : '<path d="M17 5 L23 11 M23 5 L17 11" stroke="#ff6b6b" stroke-width="2.2" stroke-linecap="round"/>') + '</svg>';
    },
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7 H20 M4 12 H20 M4 17 H20" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>'
  };
})(typeof window !== 'undefined' ? window : globalThis);
