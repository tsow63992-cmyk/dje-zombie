/* Dje_zombie — image de résultat 9:16 (PNG) et partage. */
(function () {
  'use strict';
  var DJE = window.DJE, C = DJE.core;
  var PA = DJE.partage = {};
  var POLICE = 'Inter, "DejaVu Sans", "Segoe UI", Arial, sans-serif';

  function charger(svg) {
    return new Promise(function (res) {
      var img = new Image();
      img.onload = function () { res(img); };
      img.onerror = function () { res(null); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }
  function txt(ctx, s, x, y, taille, couleur, o) {
    o = o || {};
    ctx.font = (o.poids || 900) + ' ' + taille + 'px ' + POLICE;
    ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
    if (o.lueur) { ctx.shadowColor = o.lueur; ctx.shadowBlur = 36; } else ctx.shadowBlur = 0;
    ctx.fillStyle = couleur;
    var max = o.max || 960;
    while (ctx.measureText(s).width > max && taille > 20) { taille -= 4; ctx.font = (o.poids || 900) + ' ' + taille + 'px ' + POLICE; }
    ctx.fillText(s, x, y);
    ctx.shadowBlur = 0;
  }
  function pilule(ctx, x, y, w, h, fond, texte, coul, taille) {
    ctx.fillStyle = fond;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); else ctx.rect(x - w / 2, y - h / 2, w, h);
    ctx.fill();
    txt(ctx, texte, x, y + 2, taille || 34, coul);
  }
  function crane(ctx, x, y, s, plein) {
    ctx.fillStyle = plein ? '#ff4545' : 'rgba(255,255,255,.18)';
    ctx.beginPath(); ctx.arc(x, y, 18 * s, Math.PI, 0); ctx.lineTo(x + 18 * s, y + 8 * s); ctx.lineTo(x + 10 * s, y + 14 * s); ctx.lineTo(x + 10 * s, y + 22 * s);
    ctx.lineTo(x - 10 * s, y + 22 * s); ctx.lineTo(x - 10 * s, y + 14 * s); ctx.lineTo(x - 18 * s, y + 8 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#05080f'; ctx.beginPath(); ctx.arc(x - 7 * s, y + 1 * s, 5 * s, 0, 7); ctx.arc(x + 7 * s, y + 1 * s, 5 * s, 0, 7); ctx.fill();
  }

  /* res : { z, l, survie, nuit, faible, titre, jour } */
  PA.dessiner = async function (res, avecPortrait) {
    var W = 1080, H = 1920;
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');
    var z = C.zombie(res.z), l = C.lieu(res.l), rar = DJE.data.raretes[z.rarete];
    var g = ctx.createLinearGradient(0, 0, 0, H);
    if (res.survie) { g.addColorStop(0, '#04070f'); g.addColorStop(0.62, '#101a33'); g.addColorStop(1, '#5a2e1c'); }
    else { g.addColorStop(0, '#05030a'); g.addColorStop(0.6, '#12060a'); g.addColorStop(1, '#2a0508'); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var a = 7;
    for (var i = 0; i < 120; i++) { a = (a * 1664525 + 1013904223) >>> 0; var x = a % W; a = (a * 1664525 + 1013904223) >>> 0; var y = a % 900; ctx.fillStyle = 'rgba(233,238,251,' + (0.2 + (a % 70) / 100) + ')'; ctx.fillRect(x, y, 3, 3); }
    /* en-tête */
    txt(ctx, 'DJE_ZOMBIE', W / 2, 150, 120, '#ffffff', { lueur: '#2ef2e0' });
    pilule(ctx, W / 2, 262, 260, 64, '#ffc93c', DJE.data.saison, '#1d1500', 34);
    if (res.jour) {
      var p = res.jour.split('-');
      txt(ctx, 'ROULETTE DU JOUR · ' + p[2] + '/' + p[1] + '/' + p[0], W / 2, 340, 38, '#ffc93c', { poids: 800 });
    } else txt(ctx, 'MODE LIBRE', W / 2, 340, 38, '#8c97ab', { poids: 800 });
    txt(ctx, 'CETTE NUIT, J\'AI ÉTÉ CHASSÉ PAR', W / 2, 430, 44, '#c7d0de', { poids: 800 });
    txt(ctx, z.nom, W / 2, 520, 110, '#ffffff', { lueur: rar.couleur });
    /* projecteur + portrait */
    var cg = ctx.createLinearGradient(0, 580, 0, 1160);
    cg.addColorStop(0, 'rgba(255,255,255,.22)'); cg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(W / 2 - 70, 590); ctx.lineTo(W / 2 + 70, 590); ctx.lineTo(W / 2 + 330, 1160); ctx.lineTo(W / 2 - 330, 1160); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.ellipse(W / 2, 1150, 260, 30, 0, 0, 7); ctx.fill();
    if (avecPortrait) {
      var img = await charger('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -10 200 310" width="400" height="620">' + DJE.portraits.dessiner(z.id, { pose: z.id === 'siffleur' ? 'siffle' : undefined }) + '</svg>');
      if (img) ctx.drawImage(img, W / 2 - 200, 560, 400, 620);
    }
    /* rareté + difficulté */
    pilule(ctx, W / 2 - 200, 1225, 300, 64, rar.couleur, z.rarete, '#061114', 34);
    for (var k = 0; k < 5; k++) crane(ctx, W / 2 + 60 + k * 62, 1214, 1.25, k < z.diff);
    txt(ctx, 'LIEU : ' + l.nom, W / 2, 1320, 44, '#2ef2e0', { poids: 800 });
    /* verdict */
    if (res.survie) txt(ctx, 'J\'AI SURVÉCU', W / 2, 1440, 120, '#ffc93c', { lueur: '#ffc93c' });
    else txt(ctx, 'MORT · NUIT ' + res.nuit + '/3', W / 2, 1440, 108, '#ff4545', { lueur: '#ff4545' });
    txt(ctx, '« ' + res.titre + ' »', W / 2, 1545, 56, '#ffffff', { poids: 800 });
    ctx.strokeStyle = res.faible ? '#ffc93c' : 'rgba(255,69,69,.8)'; ctx.lineWidth = 4; ctx.setLineDash(res.faible ? [] : [16, 12]);
    ctx.strokeRect(120, 1610, W - 240, 96); ctx.setLineDash([]);
    txt(ctx, res.faible ? 'POINT FAIBLE : TROUVÉ' : 'POINT FAIBLE : ???', W / 2, 1660, 50, res.faible ? '#ffc93c' : '#ff6b6b');
    txt(ctx, 'ET TOI, QUI TE CHASSE ?', W / 2, 1800, 54, '#ffffff', { lueur: '#2ef2e0' });
    txt(ctx, '#DjeZombie', W / 2, 1870, 36, '#8c97ab', { poids: 700 });
    return cv;
  };

  /* Génère l'image ; si le navigateur refuse le portrait, on refait sans */
  PA.generer = async function (res) {
    var cv = await PA.dessiner(res, true);
    try { cv.toDataURL('image/png'); return cv; } catch (e) { return PA.dessiner(res, false); }
  };

  PA.texte = function (res) {
    var z = C.zombie(res.z), l = C.lieu(res.l);
    var s = 'Dje_zombie — ' + DJE.data.saison + '\n';
    if (res.jour) { var p = res.jour.split('-'); s += 'Roulette du jour du ' + p[2] + '/' + p[1] + '/' + p[0] + '\n'; }
    s += 'Cette nuit, c\'est ' + z.nom + ' qui m\'a chassé (' + l.titre.toLowerCase() + ').\n';
    s += res.survie ? 'J\'ai survécu : « ' + res.titre + ' ».\n' : 'Je suis mort à la nuit ' + res.nuit + ' : « ' + res.titre + ' ».\n';
    s += 'Point faible trouvé : ' + (res.faible ? 'oui' : 'non') + '\n';
    s += 'Et toi, qui te chasse ? #DjeZombie';
    return s;
  };

  PA.telecharger = function (cv) {
    return new Promise(function (res) {
      cv.toBlob(function (blob) {
        if (!blob) { res(false); return; }
        var url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = 'dje_zombie_resultat.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        res(true);
      }, 'image/png');
    });
  };

  PA.partager = function (cv, res) {
    var texte = PA.texte(res);
    return new Promise(function (resolve) {
      cv.toBlob(async function (blob) {
        try {
          var fichier = blob && window.File ? new File([blob], 'dje_zombie_resultat.png', { type: 'image/png' }) : null;
          if (fichier && navigator.canShare && navigator.canShare({ files: [fichier] })) {
            await navigator.share({ files: [fichier], text: texte, title: 'Dje_zombie' });
            resolve('partage'); return;
          }
          if (navigator.share) { await navigator.share({ text: texte, title: 'Dje_zombie' }); resolve('partage'); return; }
        } catch (e) { if (e && e.name === 'AbortError') { resolve('annule'); return; } }
        try { await navigator.clipboard.writeText(texte); resolve('copie'); }
        catch (e2) {
          var ta = document.createElement('textarea'); ta.value = texte; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          var ok = false; try { ok = document.execCommand('copy'); } catch (e3) { ok = false; }
          ta.remove(); resolve(ok ? 'copie' : 'echec');
        }
      }, 'image/png');
    });
  };
})();
