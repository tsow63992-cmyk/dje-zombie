/* Dje_zombie — particules sur canvas (brume, pluie, braises, poussière, embruns).
   La boucle d'animation ne tourne que si un effet est actif, et se met en pause quand l'onglet est caché. */
(function () {
  'use strict';
  var DJE = window.DJE;
  var FX = DJE.fx = { modes: {} };
  var cv, cx, W = 0, H = 0, dpr = 1, raf = null, parts = {}, dernier = 0;

  FX.init = function () {
    cv = document.getElementById('fx');
    cx = cv.getContext('2d');
    FX.redim();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) lancer(); });
  };
  FX.redim = function () {
    if (!cv) return;
    var b = cv.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = b.width; H = b.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  };
  function aleatoire(a, b) { return a + Math.random() * (b - a); }
  function creer(mode) {
    var n = { brume: 16, pluie: 140, braises: 46, poussiere: 34, embruns: 26, cendres: 30 }[mode] || 20;
    if (DJE.u.reduit()) n = Math.ceil(n / 3);
    var l = [];
    for (var i = 0; i < n; i++) l.push(nouvelle(mode, true));
    return l;
  }
  function nouvelle(mode, partout) {
    var p = { x: aleatoire(0, W), y: partout ? aleatoire(0, H) : 0 };
    if (mode === 'brume') { p.r = aleatoire(W * 0.25, W * 0.6); p.y = aleatoire(H * 0.35, H * 1.05); p.vx = aleatoire(4, 14); p.a = aleatoire(0.05, 0.11); }
    if (mode === 'pluie') { p.vy = aleatoire(900, 1300); p.l = aleatoire(14, 26); if (!partout) p.y = -20; }
    if (mode === 'braises' || mode === 'cendres') { p.y = partout ? aleatoire(0, H) : H + 10; p.vy = -aleatoire(30, 90); p.r = aleatoire(1.2, 3.2); p.ph = Math.random() * 6; }
    if (mode === 'poussiere') { p.vx = aleatoire(-6, 6); p.vy = aleatoire(-4, 6); p.r = aleatoire(0.8, 2); p.a = aleatoire(0.1, 0.35); }
    if (mode === 'embruns') { p.y = partout ? aleatoire(H * 0.5, H) : H; p.vx = -aleatoire(20, 60); p.vy = -aleatoire(10, 40); p.r = aleatoire(1, 2.4); p.a = aleatoire(0.15, 0.4); }
    return p;
  }
  FX.regler = function (liste) {
    var voulu = {};
    (liste || []).forEach(function (m) { voulu[m] = 1; });
    Object.keys(parts).forEach(function (m) { if (!voulu[m]) delete parts[m]; });
    Object.keys(voulu).forEach(function (m) { if (!parts[m]) parts[m] = creer(m); });
    if (Object.keys(parts).length) lancer(); else { if (cx) cx.clearRect(0, 0, cv.width, cv.height); }
  };
  function lancer() { if (!raf && Object.keys(parts).length && !document.hidden) { dernier = performance.now(); raf = requestAnimationFrame(image); } }
  function image(t) {
    raf = null;
    if (document.hidden || !Object.keys(parts).length) { cx.clearRect(0, 0, cv.width, cv.height); return; }
    var dt = Math.min(0.05, (t - dernier) / 1000); dernier = t;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, W, H);
    Object.keys(parts).forEach(function (m) {
      var l = parts[m];
      for (var i = 0; i < l.length; i++) {
        var p = l[i];
        if (m === 'brume') {
          p.x += p.vx * dt; if (p.x - p.r > W) p.x = -p.r;
          var g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, 'rgba(205,216,230,' + p.a + ')'); g.addColorStop(1, 'rgba(205,216,230,0)');
          cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
        } else if (m === 'pluie') {
          p.y += p.vy * dt; p.x -= p.vy * 0.12 * dt;
          if (p.y > H) { l[i] = nouvelle(m); l[i].x = aleatoire(0, W * 1.2); continue; }
          cx.strokeStyle = 'rgba(170,200,230,.45)'; cx.lineWidth = 1.2;
          cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(p.x + p.l * 0.12, p.y - p.l); cx.stroke();
        } else if (m === 'braises' || m === 'cendres') {
          p.y += p.vy * dt; p.ph += dt * 3; p.x += Math.sin(p.ph) * 0.6;
          if (p.y < -10) { l[i] = nouvelle(m); continue; }
          var a = 0.5 + 0.5 * Math.sin(p.ph * 2);
          cx.fillStyle = m === 'braises' ? 'rgba(255,' + Math.round(120 + 80 * a) + ',40,' + (0.5 + 0.5 * a) + ')' : 'rgba(180,180,180,' + (0.3 * a) + ')';
          cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
        } else if (m === 'poussiere' || m === 'embruns') {
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) { l[i] = nouvelle(m, m === 'poussiere'); if (m === 'embruns') l[i].x = aleatoire(W * 0.3, W * 1.1); continue; }
          cx.fillStyle = 'rgba(230,236,245,' + p.a + ')';
          cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
        }
      }
    });
    raf = requestAnimationFrame(image);
  }
})();
