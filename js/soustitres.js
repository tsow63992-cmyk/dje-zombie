/* Dje_zombie — sous-titres façon TikTok : gros texte blanc en majuscules,
   affiché groupe de mots par groupe de mots, mots importants en jaune.
   Un tap affiche la phrase entière ; un second tap passe à la suivante. */
(function () {
  'use strict';
  var DJE = window.DJE, U = DJE.u;
  var ST = DJE.st = { phase: 'repos', toutVoir: false };

  /* Découpe en groupes de 1 à 3 mots, coupés après la ponctuation. */
  ST.decouper = function (texte) {
    var mots = texte.split(/\s+/).filter(Boolean), groupes = [], g = [], dansK = false;
    mots.forEach(function (m) {
      var ouvre = m.charAt(0) === '*', ferme = /\*[.,!?;:…»)]*$/.test(m);
      var propre = m.replace(/\*/g, '');
      var k = dansK || ouvre;
      g.push({ m: propre, k: k });
      if (ouvre && !ferme) dansK = true;
      if (ferme) dansK = false;
      var finPhrase = /[.,!?;:…]$/.test(propre);
      if (g.length >= 3 || finPhrase || (g.length >= 2 && propre.length > 8)) { groupes.push(g); g = []; }
    });
    if (g.length) groupes.push(g);
    return groupes;
  };
  function htmlGroupe(g) {
    return g.map(function (w) { var t = U.typo(U.echap(w.m)); return w.k ? '<span class="k">' + t + '</span>' : t; }).join(' ');
  }

  /* Affiche (et dit) une ligne. opts.petite : texte plus petit. */
  ST.dire = async function (ligne, opts) {
    opts = opts || {};
    var zone = document.getElementById('soustitres');
    var sons = U.sons(ligne), texte = U.sansSons(ligne).trim();
    var groupes = ST.decouper(texte);
    var div = U.el('div', 'ligne-st' + (opts.petite || texte.length > 70 ? ' petite' : ''));
    var spans = groupes.map(function (g) { var s = U.el('span', 'g', htmlGroupe(g)); return s; });
    spans.forEach(function (s, i) { div.appendChild(s); if (i < spans.length - 1) div.appendChild(document.createTextNode(' ')); });
    zone.innerHTML = ''; zone.appendChild(div);
    sons.forEach(function (s, i) { setTimeout(function () { DJE.audio.jouer(s.nom, s.arg); }, 120 + i * 250); });

    var nu = U.nu(texte), voix = DJE.voix.dire(nu);
    var total = voix ? Math.max(900, nu.length * 58) : 0;
    ST.phase = 'revele'; ST.toutVoir = false;
    for (var i = 0; i < spans.length; i++) {
      if (DJE.jeu && DJE.jeu.pause) await DJE.jeu.attendrePause();
      spans[i].classList.add('on');
      if (ST.toutVoir) continue;
      var nbMots = groupes[i].length, nbCar = groupes[i].reduce(function (a, w) { return a + w.m.length + 1; }, 0);
      var d = voix ? total * nbCar / Math.max(1, nu.length) : 150 + nbMots * 175 + (/[.!?…]$/.test(groupes[i][nbMots - 1].m) ? 160 : 0);
      if (DJE.jeu && DJE.jeu.rapide) d *= 0.35;
      await U.attendre(d);
    }
    spans.forEach(function (s) { s.classList.add('on'); });
    ST.phase = 'tient';
    if (voix && !ST.toutVoir) await Promise.race([voix, new Promise(function (r) { ST._finVoix = r; })]);
    var tenue = opts.tenue != null ? opts.tenue : 420 + nu.length * 14;
    if (DJE.jeu && DJE.jeu.rapide) tenue *= 0.3;
    if (!opts.sansTenue) await U.attendre(tenue);
    ST.phase = 'repos';
  };
  ST.tap = function () {
    if (ST.phase === 'revele') { ST.toutVoir = true; U.passer(); }
    else if (ST.phase === 'tient') { DJE.voix.stop(); if (ST._finVoix) ST._finVoix(); U.passer(); }
  };
  ST.effacer = function () { var z = document.getElementById('soustitres'); if (z) z.innerHTML = ''; };
  /* Affiche une ligne d'un coup, sans attendre (pour les titres) */
  ST.poser = function (ligne) {
    var z = document.getElementById('soustitres');
    z.innerHTML = '<div class="ligne-st">' + U.fmt(ligne) + '</div>';
  };
})();
