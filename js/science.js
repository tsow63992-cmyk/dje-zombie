/* Dje_zombie — séquences « Le savais-tu ? » : schémas animés sur canvas.
   Les dessins eux-mêmes sont dans les fichiers de data/scenes/ ; ici, la boîte à outils et le lecteur. */
(function () {
  'use strict';
  var DJE = window.DJE, U = DJE.u, C = DJE.core;
  var SC = DJE.science = {};
  var W = 900, H = 700;

  function kit(ctx, lid) {
    var k = { ctx: ctx, W: W, H: H, lieu: lid };
    k.c = { neon: '#2ef2e0', or: '#ffc93c', rouge: '#ff4545', blanc: '#f1ead8', gris: '#4a5872', nuit: '#070b14', ardoise: '#2b3a55', bleu: '#4f8fd6', orange: '#ff8a2a' };
    k.prog = function (t, debut, duree) { var v = (t - debut) / (duree || 1); v = v < 0 ? 0 : v > 1 ? 1 : v; return U.ease.outCubic(v); };
    k.fond = function () {
      ctx.fillStyle = '#03070e'; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(46,242,224,.06)'; ctx.lineWidth = 1;
      for (var x = 0; x <= W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (var y = 0; y <= H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    };
    k.texte = function (s, x, y, o) {
      o = o || {};
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.fillStyle = o.couleur || k.c.blanc;
      ctx.font = (o.gras === false ? '600 ' : '900 ') + (o.taille || 30) + 'px Inter, "DejaVu Sans", Arial, sans-serif';
      ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(s, x, y);
      ctx.restore();
    };
    k.poly = function (pts, fill, stroke, lw, alpha) {
      ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
      ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 3; ctx.stroke(); }
      ctx.restore();
    };
    k.ligne = function (pts, col, lw, alpha, pointille) {
      ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
      ctx.strokeStyle = col; ctx.lineWidth = lw || 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (pointille) ctx.setLineDash(pointille);
      if (col === k.c.rouge || col === k.c.neon || col === k.c.or) { ctx.shadowColor = col; ctx.shadowBlur = 12; }
      ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke();
      ctx.restore();
    };
    k.cercle = function (x, y, r, col, plein, alpha, lw) {
      ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
      ctx.beginPath(); ctx.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2);
      if (plein) { ctx.fillStyle = col; ctx.fill(); } else { ctx.strokeStyle = col; ctx.lineWidth = lw || 3; ctx.stroke(); }
      ctx.restore();
    };
    k.rect = function (x, y, w, h, col, plein, alpha, lw) {
      ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
      if (plein !== false) { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); } else { ctx.strokeStyle = col; ctx.lineWidth = lw || 3; ctx.strokeRect(x, y, w, h); }
      ctx.restore();
    };
    k.arc = function (x, y, r, a0, a1, col, alpha, lw) {
      ctx.save(); ctx.globalAlpha = Math.max(0, alpha == null ? 1 : alpha);
      ctx.strokeStyle = col; ctx.lineWidth = lw || 4; ctx.shadowColor = col; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(x, y, Math.max(0.1, r), a0, a1); ctx.stroke();
      ctx.restore();
    };
    k.fleche = function (x1, y1, x2, y2, col, label, prog) {
      prog = prog == null ? 1 : prog;
      if (prog <= 0) return;
      var xe = x1 + (x2 - x1) * prog, ye = y1 + (y2 - y1) * prog;
      k.ligne([[x1, y1], [xe, ye]], col, 4, 1, [14, 10]);
      if (prog > 0.95) {
        var a = Math.atan2(y2 - y1, x2 - x1);
        k.poly([[x2, y2], [x2 - 22 * Math.cos(a - 0.4), y2 - 22 * Math.sin(a - 0.4)], [x2 - 22 * Math.cos(a + 0.4), y2 - 22 * Math.sin(a + 0.4)]], col);
        if (label) k.texte(label, (x1 + x2) / 2, (y1 + y2) / 2 - 28, { taille: 28, couleur: col });
      }
    };
    k.bonhomme = function (x, y, s, col, o) {
      o = o || {};
      s = s || 1;
      k.ligne([[x - 10 * s, y], [x, y - 28 * s], [x + 10 * s, y]], col, 5 * s);
      k.ligne([[x, y - 28 * s], [x, y - 56 * s]], col, 6 * s);
      k.ligne(o.bras || [[x - 16 * s, y - 38 * s], [x, y - 50 * s], [x + 16 * s, y - 38 * s]], col, 5 * s);
      k.cercle(x, y - 68 * s, 11 * s, col, true);
    };
    k.axes = function (x0, y0, w, h, lx, ly) {
      k.ligne([[x0, y0 - h], [x0, y0], [x0 + w, y0]], 'rgba(241,234,216,.6)', 3);
      if (lx) k.texte(lx, x0 + w, y0 + 34, { taille: 26, align: 'right', couleur: 'rgba(241,234,216,.75)', gras: false });
      if (ly) k.texte(ly, x0 + 10, y0 - h - 22, { taille: 26, align: 'left', couleur: 'rgba(241,234,216,.75)', gras: false });
    };
    /* courbe y = f(x), x de 0 à 1, dessinée progressivement */
    k.courbe = function (f, x0, y0, w, h, col, prog, lw, label) {
      if (prog <= 0) return;
      var pts = [], n = 240, best = [0, 0];
      for (var i = 0; i <= n * prog; i++) { var xn = i / n, v = Math.min(h, f(xn)); pts.push([x0 + xn * w, y0 - v]); if (v > best[1]) best = [x0 + xn * w, v]; }
      k.ligne(pts, col, lw || 3);
      if (label && prog > 0.9) k.texte(label, best[0], y0 - best[1] - 26, { taille: 26, couleur: col });
    };
    k.remplir = function (f, x0, y0, w, h, fill, prog, label) {
      if (prog <= 0) return;
      var pts = [[x0, y0]], n = 240, best = [0, 0];
      for (var i = 0; i <= n; i++) { var xn = i / n, v = Math.min(h, f(xn) * prog); pts.push([x0 + xn * w, y0 - v]); if (v > best[1]) best = [x0 + xn * w, v]; }
      pts.push([x0 + w, y0]);
      k.poly(pts, fill);
      if (label && prog > 0.6) k.texte(label, best[0], y0 - best[1] - 26, { taille: 26, couleur: '#ffe7a0' });
    };
    k.goutte = function (x, y, s, col) { k.poly([[x, y - 18 * s], [x + 11 * s, y], [x, y + 9 * s], [x - 11 * s, y]], col || k.c.bleu); k.cercle(x, y + 1 * s, 10.5 * s, col || k.c.bleu, true); };
    k.flamme = function (x, y, s, t, alpha) {
      var a = Math.sin(t * 9) * 4 * s;
      k.poly([[x - 26 * s, y], [x + a, y - 80 * s], [x + 26 * s, y]], k.c.orange, null, 0, alpha);
      k.poly([[x - 14 * s, y], [x - a, y - 48 * s], [x + 14 * s, y]], '#ffd24a', null, 0, alpha);
    };
    k.croix = function (x, y, s, col, alpha) { k.ligne([[x - 20 * s, y - 20 * s], [x + 20 * s, y + 20 * s]], col || k.c.rouge, 7 * s, alpha); k.ligne([[x + 20 * s, y - 20 * s], [x - 20 * s, y + 20 * s]], col || k.c.rouge, 7 * s, alpha); };
    k.coche = function (x, y, s, col, alpha) { k.ligne([[x - 20 * s, y], [x - 5 * s, y + 16 * s], [x + 24 * s, y - 20 * s]], col || k.c.neon, 7 * s, alpha); };
    return k;
  }
  SC.kit = kit;

  /* Joue la séquence d'un zombie. Retourne une promesse. */
  SC.jouer = async function (zid, lid) {
    var h = DJE.data.histoires[zid], seq = h && h.science;
    if (!seq) return;
    var z = C.zombie(zid), st = { l: lid, z: zid };
    var p = U.el('section', 'panneau science-p');
    p.innerHTML = '<div class="savais">LE SAVAIS-TU ?</div><div class="sujet">' + U.echap(seq.titre || z.science) + '</div><canvas width="900" height="700" aria-hidden="true"></canvas><div class="points"></div>';
    var ecran = document.getElementById('ecran');
    ecran.appendChild(p);
    var cv = p.querySelector('canvas'), ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var b = cv.getBoundingClientRect();
    var cw = Math.max(300, Math.round(b.width * dpr)), ch = Math.round(cw * 7 / 9);
    cv.width = cw; cv.height = ch;
    var echelle = cw / W, k = kit(ctx, lid);
    p.querySelector('.points').innerHTML = seq.diapos.map(function () { return '<i></i>'; }).join('');
    DJE.audio.jouer('indice');
    var raf = null, debut = 0, diapo = null, actif = true;
    function image(t) {
      if (!actif) return;
      var s = (t - debut) / 1000;
      ctx.setTransform(echelle, 0, 0, echelle, 0, 0);
      try { diapo.dessin(k, DJE.u.reduit() ? 30 : s); } catch (e) { /* un dessin raté ne bloque pas la partie */ }
      raf = requestAnimationFrame(image);
    }
    try {
      for (var i = 0; i < seq.diapos.length; i++) {
        if (DJE.jeu.annule) break;
        diapo = seq.diapos[i];
        p.querySelectorAll('.points i').forEach(function (el, j) { el.classList.toggle('on', j <= i); });
        debut = performance.now();
        cancelAnimationFrame(raf); raf = requestAnimationFrame(image);
        var lignes = C.v(diapo.l, lid) || [];
        for (var j = 0; j < lignes.length; j++) {
          if (DJE.jeu.annule) break;
          await DJE.st.dire(C.texte(lignes[j], st), { petite: true });
        }
        await U.attendre(DJE.jeu.rapide ? 100 : 700);
      }
    } finally {
      actif = false; cancelAnimationFrame(raf);
      DJE.st.effacer();
      p.classList.add('sort');
      await U.pause(300);
      p.remove();
    }
  };
})();
