/* Dje_zombie — la roulette : défilement horizontal, ralentissement réaliste, tension près du jackpot. */
(function () {
  'use strict';
  var DJE = window.DJE, U = DJE.u, C = DJE.core;
  var RO = DJE.roulette = {};

  function caseZombie(id) {
    if (id === 'jackpot') return { cls: 'jackpot', etiq: 'JACKPOT', svg: DJE.portraits.svg('jackpot') };
    var z = C.zombie(id);
    return { cls: '', etiq: z.court, svg: DJE.portraits.svg(id, { pose: id === 'siffleur' ? 'siffle' : undefined }) };
  }
  function caseLieu(id) {
    var l = C.lieu(id);
    return { cls: 'lieu', etiq: l.titre.toUpperCase(), svg: DJE.decors.vignette(id, 'v' + id + Math.floor(Math.random() * 1e6)) };
  }
  function cone() {
    return '<svg class="spot" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" aria-hidden="true">' +
      '<defs><linearGradient id="spg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<polygon points="44,0 56,0 92,100 8,100" fill="url(#spg)"/><ellipse cx="50" cy="96" rx="38" ry="4" fill="#fff" opacity=".12"/></svg>';
  }

  /* o : { type: 'zombie'|'lieu', gagnant, pool: [ids], rng, presque, duree, question, passable } */
  RO.tourner = function (o) {
    return new Promise(function (resolve) {
      var rng = o.rng || Math.random;
      var lieu = o.type === 'lieu';
      var N = lieu ? 20 : 46, T = lieu ? 15 : 39;
      var seq = [];
      for (var i = 0; i < N; i++) seq.push(o.pool[Math.floor(rng() * o.pool.length)]);
      /* évite deux cases identiques côte à côte */
      for (i = 1; i < N; i++) if (seq[i] === seq[i - 1]) seq[i] = o.pool[(o.pool.indexOf(seq[i]) + 1) % o.pool.length];
      seq[T] = o.gagnant;
      if (!lieu) {
        if (o.presque && o.gagnant !== 'jackpot') seq[T + 1] = 'jackpot';
        else if (seq[T + 1] === 'jackpot' || seq[T - 1] === 'jackpot') seq[T + 1] = o.pool[0] === o.gagnant ? o.pool[1] : o.pool[0];
        if (seq[T - 1] === o.gagnant) seq[T - 1] = o.pool[(o.pool.indexOf(o.gagnant) + 2) % o.pool.length];
        if (seq[T + 1] === o.gagnant) seq[T + 1] = o.pool[(o.pool.indexOf(o.gagnant) + 3) % o.pool.length];
      }
      var p = U.el('section', 'panneau roulette noir');
      p.innerHTML = '<div class="lueur-or"></div><div class="question"><h2 class="titre-ecran">' + U.fmt(o.question) + '</h2></div>' +
        '<div class="r-fenetre"><div class="r-bande"></div><div class="r-curseur"></div></div>' +
        (o.passable ? '<div class="aide">Tape pour passer</div>' : '');
      var bande = p.querySelector('.r-bande');
      bande.innerHTML = seq.map(function (id) {
        var c = lieu ? caseLieu(id) : caseZombie(id);
        return '<div class="r-case ' + c.cls + '" data-id="' + id + '">' + cone() + c.svg + '<span class="etiq">' + U.echap(c.etiq) + '</span></div>';
      }).join('');
      document.getElementById('ecran').appendChild(p);
      var cases = bande.children;
      var fen = p.querySelector('.r-fenetre');
      var tw = cases[0].getBoundingClientRect().width, fw = fen.getBoundingClientRect().width;
      var decal = (o.presque && !lieu) ? 0.4 : (rng() - 0.5) * 0.6;
      var xFin = -(T * tw + tw / 2 + decal * tw - fw / 2);
      var x0 = -(tw * 1.5 - fw / 2);
      var duree = (o.duree || (lieu ? 3000 : 5600)) * (o.presque ? 1.25 : 1) * (DJE.jeu.rapide ? 0.15 : 1);
      if (U.reduit()) duree = Math.min(duree, 1500);
      var debut = performance.now(), dernier = -1, fini = false, tension = false;
      var courbe = o.presque ? function (t) { return 1 - Math.pow(1 - t, 5); } : U.ease.outQuart;
      DJE.audio.ambiance('roulette');
      function placer(x) { bande.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)'; }
      function terminer() {
        if (fini) return;
        fini = true;
        placer(xFin);
        p.classList.remove('tension');
        cases[T].classList.add('gagne');
        p.removeEventListener('pointerdown', passer);
        setTimeout(function () { resolve({ panneau: p, id: o.gagnant }); }, DJE.jeu.rapide ? 60 : 650);
      }
      function passer(ev) { if (o.passable) { ev.stopPropagation(); duree = 0; } }
      p.addEventListener('pointerdown', passer);
      RO.passer = function () { if (o.passable) duree = 0; };
      function image(t) {
        if (fini) return;
        var k = duree ? Math.min(1, (t - debut) / duree) : 1;
        var x = x0 + (xFin - x0) * courbe(k);
        placer(x);
        var idx = Math.floor((fw / 2 - x) / tw);
        if (idx !== dernier) {
          dernier = idx;
          DJE.audio.jouer('tick', k > 0.85);
          if (cases[idx]) { cases[idx].animate && cases[idx].animate([{ transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 160 }); }
        }
        if (!lieu) {
          var pres = cases[idx + 1] && cases[idx + 1].dataset.id === 'jackpot' || (cases[idx] && cases[idx].dataset.id === 'jackpot');
          var veut = pres && k > 0.7;
          if (veut !== tension) { tension = veut; p.classList.toggle('tension', veut); if (veut) { DJE.audio.jouer('tension'); DJE.audio.coeurRapide(); } }
        }
        if (k >= 1) terminer(); else requestAnimationFrame(image);
      }
      requestAnimationFrame(function (t) { debut = t; image(t); });
    });
  };
})();
