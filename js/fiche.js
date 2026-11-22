/* Dje_zombie — la fiche du zombie, façon dossier néon turquoise. */
(function () {
  'use strict';
  var DJE = window.DJE, U = DJE.u, C = DJE.core;
  var F = DJE.fiche = {};

  F.html = function (z, o) {
    o = o || {};
    var rar = DJE.data.raretes[z.rarete], diff = DJE.data.difficultes[z.diff];
    var cranes = '';
    for (var i = 1; i <= 5; i++) cranes += DJE.icones.crane(i <= z.diff);
    var jauges = z.jauges.map(function (j, i) {
      return '<div class="f-j' + (i === 3 ? ' speciale' : '') + '" data-v="' + j[1] + '"><span>' + U.echap(j[0]) + '</span><span class="b">' +
        (function () { var h = ''; for (var b = 0; b < 10; b++) h += '<i' + (!o.anime && b < j[1] ? ' class="on"' : '') + '></i>'; return h; })() + '</span><span class="v">' + (o.anime ? 0 : j[1]) + '</span></div>';
    }).join('');
    var faible = o.faible ? '<div class="faible trouve"><span>POINT FAIBLE :</span> ' + U.echap(z.faible) + '</div>' : '<div class="faible"><span>POINT FAIBLE :</span> ???</div>';
    var stats = o.stats ? '<div class="comportement">Parties : <b>' + o.stats.parties + '</b> · Survies : <b>' + o.stats.survies + '</b> · Meilleure nuit : <b>' + (o.stats.meilleure || 0) + '/3</b></div>' : '';
    return '<article class="fiche" aria-label="Fiche ' + U.echap(z.nom) + '">' +
      '<div class="entete">FICHE N° ' + z.num + ' — ' + U.echap(z.nom) + '</div>' +
      '<div class="portrait"><div class="cone"></div>' + DJE.portraits.svg(z.id, { pose: z.id === 'siffleur' ? 'siffle' : undefined }) + '</div>' +
      '<div class="nom">' + U.echap(z.nom) + '</div>' +
      '<div class="badges"><span class="badge" style="background:' + rar.couleur + '">' + z.rarete + '</span><span class="cranes">' + cranes + ' <span>' + diff + '</span></span></div>' +
      '<div class="f-jauges">' + jauges + '</div>' +
      '<div class="comportement">' + U.typo(U.echap(z.comportement)) + '</div>' + faible + stats +
      '</article>';
  };

  F.animer = async function (racine) {
    var lignes = racine.querySelectorAll('.f-j');
    for (var i = 0; i < lignes.length; i++) {
      var el = lignes[i], v = +el.dataset.v, barres = el.querySelectorAll('.b i'), val = el.querySelector('.v');
      DJE.audio.jouer('jauge');
      for (var j = 0; j < v; j++) {
        barres[j].classList.add('on');
        val.textContent = j + 1;
        await U.pause(DJE.jeu.rapide || U.reduit() ? 0 : 35);
      }
      await U.pause(DJE.jeu.rapide ? 0 : 120);
    }
  };

  /* Affiche la fiche et attend « Continuer » */
  F.montrer = function (z, o) {
    o = o || {};
    return new Promise(async function (resolve) {
      var p = U.el('section', 'panneau fiche-p noir');
      p.innerHTML = F.html(z, { faible: DJE.save.faibleTrouve(z.id), anime: true }) +
        '<div class="pile" style="margin-top:16px"><button class="bouton or" type="button">' + (o.bouton || 'CONTINUER') + '</button></div>';
      document.getElementById('ecran').appendChild(p);
      var b = p.querySelector('button');
      var fait = false;
      function fin() { if (fait) return; fait = true; DJE.audio.jouer('clic'); DJE.app.attenteTouche = null; p.classList.add('sort'); setTimeout(function () { p.remove(); resolve(); }, 300); }
      U.surClic(b, fin);
      var entete = p.querySelector('.entete'), texte = entete.textContent;
      entete.textContent = '';
      for (var i = 0; i < texte.length; i++) {
        entete.textContent += texte[i];
        if (i % 2 === 0) DJE.audio.jouer('tape');
        if (!DJE.jeu.rapide && !U.reduit()) await U.pause(22);
      }
      await F.animer(p);
      b.focus({ preventScroll: true });
      DJE.app.attenteTouche = fin;
    });
  };
})();
