/* Dje_zombie — écrans (titre, accroche, résultat, bestiaire, menu) et enchaînement d'une partie. */
(function () {
  'use strict';
  var DJE = window.DJE, U = DJE.u, C = DJE.core, R = DJE.rendu, S = DJE.save, RO = DJE.roulette;
  var APP = DJE.app = { attenteTouche: null, ecranCourant: null };
  var q = new URLSearchParams(window.location.search);
  DJE.jeu.rapide = q.has('vite');

  function ecran() { return document.getElementById('ecran'); }
  function panneau(cls, html) {
    var p = U.el('section', 'panneau ' + cls, html);
    ecran().appendChild(p);
    return p;
  }
  APP.vider = function () {
    ecran().innerHTML = '';
    document.getElementById('choix').innerHTML = '';
    DJE.st.effacer();
    R.message(null);
    APP.attenteTouche = null;
  };

  /* ── Réglages ── */
  function majBoutons() {
    var bs = document.getElementById('b-son'), bv = document.getElementById('b-voix');
    var son = S.opt('son') !== false, voix = !!S.opt('voix');
    bs.innerHTML = DJE.icones.son(son); bs.classList.toggle('off', !son); bs.setAttribute('aria-label', son ? 'Couper le son' : 'Activer le son');
    bv.innerHTML = DJE.icones.voix(voix && DJE.voix.dispo); bv.classList.toggle('off', !voix || !DJE.voix.dispo);
    bv.setAttribute('aria-label', !DJE.voix.dispo ? 'Aucune voix française disponible' : voix ? 'Couper la voix' : 'Activer la voix');
    bv.title = DJE.voix.dispo ? 'Voix (V)' : 'Aucune voix française sur cet appareil';
    document.getElementById('b-menu').innerHTML = DJE.icones.menu;
    document.querySelectorAll('[data-opt]').forEach(function (b) { b.innerHTML = libelleOpt(b.dataset.opt); });
  }
  function libelleOpt(k) {
    if (k === 'son') return 'Son : <b>' + (S.opt('son') !== false ? 'oui' : 'non') + '</b>';
    if (k === 'voix') return 'Voix : <b>' + (!DJE.voix.dispo ? 'indisponible' : S.opt('voix') ? 'oui' : 'non') + '</b>';
    if (k === 'reduit') return 'Animations : <b>' + (document.body.classList.contains('reduit') ? 'réduites' : 'normales') + '</b>';
    return k;
  }
  APP.basculer = function (k) {
    DJE.audio.init();
    if (k === 'son') { var s = !(S.opt('son') !== false); S.opt('son', s); DJE.audio.setMuet(!s); }
    if (k === 'voix') { if (!DJE.voix.dispo) { R.toast('', 'Aucune voix française n\'est installée sur cet appareil. Les sous-titres suffisent.', 3000); return; } var v = !S.opt('voix'); S.opt('voix', v); DJE.voix.actif = v; if (!v) DJE.voix.stop(); }
    if (k === 'reduit') { var r = !document.body.classList.contains('reduit'); S.opt('reduit', r); document.body.classList.toggle('reduit', r); }
    majBoutons();
  };
  function options() {
    return '<div class="rangee">' + ['son', 'voix', 'reduit'].map(function (k) { return '<button type="button" class="option" data-opt="' + k + '">' + libelleOpt(k) + '</button>'; }).join('') + '</div>';
  }
  function brancherOptions(p) { p.querySelectorAll('[data-opt]').forEach(function (b) { U.surClic(b, function () { APP.basculer(b.dataset.opt); }); }); }

  /* ── Écran titre ── */
  function sceneTitre() {
    var P = DJE.portraits, s = '<svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><linearGradient id="tcone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>';
    [[120, 'vitreux', 0.8], [300, 'siffleur', 1.05], [480, 'braise', 0.8]].forEach(function (z) {
      var k = z[2], x = z[0];
      s += '<polygon points="' + (x - 14) + ',0 ' + (x + 14) + ',0 ' + (x + 120) + ',410 ' + (x - 120) + ',410" fill="url(#tcone)"/>';
      s += '<ellipse cx="' + x + '" cy="404" rx="' + 90 * k + '" ry="10" fill="#fff" opacity=".1"/>';
      s += '<g transform="translate(' + (x - 100 * k) + ' ' + (405 - 296 * k) + ') scale(' + k + ')">' + P.dessiner(z[1], { pose: z[1] === 'siffleur' ? 'siffle' : undefined, ondes: z[1] === 'siffleur' ? 1 : 0 }) + '</g>';
    });
    return s + '</svg>';
  }
  APP.titre = function () {
    DJE.jeu.annuler();
    APP.vider(); R.vider(); R.cacherHud();
    DJE.audio.ambiance('titre');
    var cle = C.cleJour(), deja = S.jour(cle), connus = DJE.data.zombies.filter(function (z) { return S.connu(z.id); }).length;
    var p = panneau('titre', '<div class="logo"><span class="saison">' + DJE.data.saison + '</span><h1>DJE<span>_</span>ZOMBIE</h1><p>Tourne la roue. Tiens trois nuits.</p></div>' +
      '<div class="scene-titre">' + sceneTitre() + '</div>' +
      '<div class="pile">' +
      '<button type="button" class="bouton or col" data-a="jour">' + (deja ? 'TON RÉSULTAT DU JOUR' : 'ROULETTE DU JOUR') + '<small>' + (deja ? 'Nouveau tirage demain' : 'Le même tirage pour tout le monde') + '</small></button>' +
      '<button type="button" class="bouton" data-a="libre">MODE LIBRE</button>' +
      '<button type="button" class="bouton discret" data-a="bestiaire">BESTIAIRE · ' + connus + '/' + DJE.data.zombies.length + '</button>' +
      options() + '</div>');
    p.querySelectorAll('[data-a]').forEach(function (b) { U.surClic(b, function () { DJE.audio.init(); DJE.audio.jouer('clic'); APP[b.dataset.a](); }); });
    brancherOptions(p);
    if (!S.dispo) R.toast('', 'Sauvegarde indisponible ici (navigation privée ?). Le bestiaire ne sera pas gardé.', 3500);
    APP.attenteTouche = function () { APP.jour(); };
  };

  /* ── Accroche ── */
  APP.accroche = async function () {
    var p = panneau('noir', '');
    p.style.background = 'radial-gradient(ellipse at 50% 20%, #0c1426, #000 70%)';
    var lignes = S.dejaVu('accroche') ? ['Cette nuit, quelque chose va te *chasser*.', 'Tourne la *roue*.'] :
      ['Le monde s\'est *éteint*.', 'Les villes se taisent. Les *ombres* marchent.', 'Cette nuit, quelque chose va te *chasser*.', 'Tourne la *roue*.'];
    DJE.audio.jouer('nuit');
    for (var i = 0; i < lignes.length; i++) { if (DJE.jeu.annule) break; await DJE.st.dire(lignes[i]); }
    S.marquer('accroche');
    DJE.st.effacer();
    p.remove();
  };

  /* ── Une partie complète : roulette → fiche → lieu → nuits → résultat ── */
  APP.sequence = async function (mode) {
    DJE.jeu.annule = false;
    APP.vider(); R.vider(); R.cacherHud();
    var rng = mode.rng;
    var tire = C.tirer(rng, DJE.data.zombies, function (z) { return z.poids; });
    var lieu = DJE.data.lieux[Math.floor(rng() * DJE.data.lieux.length)];
    var presque = !tire.jackpot && rng() < 0.3;
    if (mode.forceZ) { tire = C.zombie(mode.forceZ); presque = false; }
    if (mode.forceL) lieu = C.lieu(mode.forceL);
    var pool = DJE.data.zombies.filter(function (z) { return !z.jackpot; }).map(function (z) { return z.id; }).concat(['jackpot']);
    await APP.accroche();
    if (DJE.jeu.annule) return;
    var r = await RO.tourner({ type: 'zombie', gagnant: tire.jackpot ? 'jackpot' : tire.id, pool: pool, rng: rng, presque: presque, question: 'Qui va te *chasser* cette nuit ?', passable: S.dejaVu('roulette') });
    S.marquer('roulette');
    var zid = tire.id;
    if (tire.jackpot) {
      R.flash(true); DJE.audio.jouer('jackpot');
      r.panneau.remove();
      if (!mode.jour && S.connu('sansyeux')) zid = await APP.choixZombie();
      else {
        var pj = panneau('noir', '<h2 class="titre-ecran" style="margin-top:30vh">JACKPOT !</h2><p class="sous">Un <span style="color:var(--or)">LÉGENDAIRE</span> se réveille.</p>');
        await U.attendre(DJE.jeu.rapide ? 100 : 2000); pj.remove();
      }
    } else { R.flash(); r.panneau.remove(); }
    if (DJE.jeu.annule) return;
    S.vu(zid);
    await DJE.fiche.montrer(C.zombie(zid));
    if (DJE.jeu.annule) return;
    var r2 = await RO.tourner({ type: 'lieu', gagnant: lieu.id, pool: DJE.data.lieux.map(function (l) { return l.id; }), rng: rng, question: 'Où te *caches*-tu ?', passable: true });
    R.flash(); r2.panneau.remove();
    if (DJE.jeu.annule) return;
    var res = await DJE.jeu.lancer(zid, lieu.id, mode);
    if (res) APP.resultat(res);
  };

  APP.jour = function () {
    var cle = C.cleJour(), deja = S.jour(cle);
    if (deja) { APP.resultat(deja, { dejaJoue: true }); return; }
    APP.sequence({ jour: cle, rng: C.rng(C.hash('dje-s1-' + cle)) });
  };
  APP.rejouerJour = function () {
    var cle = C.cleJour();
    APP.sequence({ jour: null, rejeu: true, rng: C.rng(C.hash('dje-s1-' + cle)) });
  };
  APP.libre = function () { APP.sequence({ jour: null, rng: Math.random }); };

  /* Jackpot débloqué : on choisit son zombie */
  APP.choixZombie = function () {
    return new Promise(function (res) {
      var p = panneau('noir defile', '<h2 class="titre-ecran" style="color:var(--or)">JACKPOT !</h2><p class="sous">Tu as déjà croisé le Sans-Yeux. Cette fois, choisis qui te chasse.</p><div class="choix-z">' +
        DJE.data.zombies.map(function (z) { return '<button type="button" data-z="' + z.id + '">' + DJE.portraits.svg(z.id) + '<span>' + U.echap(z.court) + '</span></button>'; }).join('') + '</div>');
      p.querySelectorAll('[data-z]').forEach(function (b) { U.surClic(b, function () { DJE.audio.jouer('clic'); p.remove(); res(b.dataset.z); }); });
    });
  };

  /* ── Résultat partageable ── */
  APP.resultat = async function (res, o) {
    o = o || {};
    APP.vider(); R.vider(); R.cacherHud();
    DJE.audio.ambiance('titre');
    var p = panneau('resultat-p', (o.dejaJoue ? '<h2 class="titre-ecran">Déjà joué <span class="k">aujourd\'hui</span></h2><p class="sous">Nouveau tirage demain. En attendant, le mode libre est illimité.</p>' : '') +
      '<div class="apercu"><span class="sous">Génération de l\'image…</span></div><div class="notif" aria-live="polite"></div>' +
      '<div class="pile"><div class="rangee" style="width:100%"><button type="button" class="bouton or" data-a="dl" style="flex:1">TÉLÉCHARGER L\'IMAGE</button><button type="button" class="bouton" data-a="partager" style="flex:1">PARTAGER</button></div>' +
      (o.dejaJoue ? '<button type="button" class="bouton discret" data-a="rejeu">REJOUER CE TIRAGE <small>(non compté)</small></button>' : '') +
      '<div class="rangee" style="width:100%"><button type="button" class="bouton" data-a="libre" style="flex:1">REJOUER</button><button type="button" class="bouton discret" data-a="titre" style="flex:1">ACCUEIL</button></div></div>');
    var cv = await DJE.partage.generer(res);
    var url = cv.toDataURL('image/png');
    p.querySelector('.apercu').innerHTML = '<img alt="Ton résultat : ' + U.echap(C.zombie(res.z).nom) + ', ' + (res.survie ? 'survécu' : 'mort à la nuit ' + res.nuit) + '" src="' + url + '">';
    APP.dernierCanvas = cv;
    var notif = p.querySelector('.notif');
    p.querySelectorAll('[data-a]').forEach(function (b) {
      U.surClic(b, async function () {
        DJE.audio.jouer('clic');
        var a = b.dataset.a;
        if (a === 'dl') { var ok = await DJE.partage.telecharger(cv); notif.textContent = ok ? 'Image enregistrée dans tes téléchargements.' : 'Impossible de créer l\'image.'; }
        else if (a === 'partager') {
          var r = await DJE.partage.partager(cv, res);
          notif.textContent = { partage: 'Partagé !', copie: 'Texte copié : colle-le où tu veux.', annule: '', echec: 'Partage impossible ici : télécharge l\'image.' }[r] || '';
        }
        else if (a === 'rejeu') APP.rejouerJour();
        else APP[a]();
      });
    });
    APP.attenteTouche = function () { APP.libre(); };
  };

  /* ── Bestiaire ── */
  APP.bestiaire = function () {
    APP.vider(); R.vider(); R.cacherHud();
    var zs = DJE.data.zombies, connus = zs.filter(function (z) { return S.connu(z.id); }).length, faibles = zs.filter(function (z) { return S.faibleTrouve(z.id); }).length;
    var p = panneau('bestiaire-p defile', '<h2 class="titre-ecran">BESTIAIRE</h2><p class="compteur">Fiches : <b>' + connus + '/' + zs.length + '</b> · Points faibles : <b>' + faibles + '/' + zs.length + '</b></p>' +
      '<div class="grille-b">' + zs.map(function (z) {
        var c = S.connu(z.id), f = S.faibleTrouve(z.id), rar = DJE.data.raretes[z.rarete];
        return '<button type="button" class="carte-b' + (c ? '' : ' inconnu') + '" data-z="' + z.id + '" style="border-color:' + (c ? rar.couleur : 'rgba(255,255,255,.12)') + '" aria-label="' + (c ? U.echap(z.nom) : 'Fiche inconnue') + '">' +
          DJE.portraits.svg(z.id) + '<span class="nb">' + (c ? U.echap(z.court) : '???') + '</span><span class="st" style="color:' + (f ? 'var(--or)' : 'var(--gris)') + '">' + (c ? (f ? 'Faible : trouvé' : 'Faible : ???') : 'N° ' + z.num) + '</span></button>';
      }).join('') + '</div><button type="button" class="bouton discret" data-a="titre">RETOUR</button>');
    p.querySelectorAll('[data-z]').forEach(function (b) {
      U.surClic(b, function () {
        var z = C.zombie(b.dataset.z);
        if (!S.connu(z.id)) { R.toast('', 'Pas encore tiré. Fais tourner la roulette !', 2000); return; }
        DJE.audio.jouer('clic');
        var d = panneau('fiche-p noir defile', DJE.fiche.html(z, { faible: S.faibleTrouve(z.id), stats: S.fiche(z.id) }) + '<div class="pile" style="margin-top:14px"><button type="button" class="bouton discret">RETOUR</button></div>');
        U.surClic(d.querySelector('button'), function () { d.remove(); APP.attenteTouche = APP.titre; });
        APP.attenteTouche = function () { d.remove(); APP.attenteTouche = APP.titre; };
      });
    });
    U.surClic(p.querySelector('[data-a="titre"]'), APP.titre);
    APP.attenteTouche = APP.titre;
  };

  /* ── Menu ── */
  APP.menu = function () {
    if (document.querySelector('.menu-p')) { fermerMenu(); return; }
    DJE.audio.init();
    DJE.jeu.pause = true;
    try { window.speechSynthesis && window.speechSynthesis.pause(); } catch (e) { /* rien */ }
    var p = panneau('menu-p', '<h2 class="titre-ecran">PAUSE</h2><div class="pile"><button type="button" class="bouton or" data-a="reprendre">REPRENDRE</button>' +
      '<button type="button" class="bouton discret" data-a="quitter">QUITTER VERS L\'ACCUEIL</button>' + options() +
      '<p class="sous" style="margin-top:10px">Raccourcis : <b>1-4</b> choisir · <b>Espace</b> passer · <b>M</b> son · <b>V</b> voix · <b>Échap</b> menu</p></div>');
    p.style.zIndex = 40;
    brancherOptions(p);
    U.surClic(p.querySelector('[data-a="reprendre"]'), fermerMenu);
    U.surClic(p.querySelector('[data-a="quitter"]'), function () { DJE.jeu.pause = false; APP.titre(); });
  };
  function fermerMenu() {
    var m = document.querySelector('.menu-p');
    if (m) m.remove();
    DJE.jeu.pause = false;
    try { window.speechSynthesis && window.speechSynthesis.resume(); } catch (e) { /* rien */ }
  }

  /* ── Entrées ── */
  function tap(ev) {
    DJE.audio.init();
    if (ev && ev.target && ev.target.closest && ev.target.closest('button')) return;
    if (document.querySelector('.menu-p')) return;
    DJE.st.tap();
  }
  function clavier(ev) {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    DJE.audio.init();
    var k = ev.key;
    if (k === 'Escape') { ev.preventDefault(); APP.menu(); return; }
    if (document.querySelector('.menu-p')) return;
    if (k === 'm' || k === 'M') { APP.basculer('son'); return; }
    if (k === 'v' || k === 'V') { APP.basculer('voix'); return; }
    if (/^[1-6]$/.test(k)) {
      var n = +k;
      if (DJE.jeu.toucheObjet) { ev.preventDefault(); DJE.jeu.toucheObjet(n - 1); return; }
      if (DJE.jeu.toucheChoix && n <= 4) { ev.preventDefault(); DJE.jeu.toucheChoix(n); return; }
    }
    if (k === ' ' || k === 'Enter') {
      var focus = document.activeElement;
      if (focus && focus.tagName === 'BUTTON' && k === 'Enter') return;
      ev.preventDefault();
      if (DJE.st.phase !== 'repos') { DJE.st.tap(); return; }
      if (RO.passer) RO.passer();
      if (APP.attenteTouche) APP.attenteTouche();
    }
  }

  APP.init = function () {
    S.charger();
    var red = S.opt('reduit');
    if (red == null) red = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.toggle('reduit', !!red);
    DJE.audio.muet = S.opt('son') === false;
    DJE.voix.init();
    DJE.voix.actif = !!S.opt('voix');
    DJE.voix.surChange = majBoutons;
    DJE.fx.init();
    U.taille();
    window.addEventListener('resize', U.taille);
    document.getElementById('stage').addEventListener('pointerdown', tap);
    document.addEventListener('keydown', clavier);
    U.surClic(document.getElementById('b-son'), function () { APP.basculer('son'); });
    U.surClic(document.getElementById('b-voix'), function () { APP.basculer('voix'); });
    U.surClic(document.getElementById('b-menu'), APP.menu);
    majBoutons();
    if (q.get('z') && q.get('l')) {
      APP.sequence({ jour: null, rng: Math.random, forceZ: q.get('z'), forceL: q.get('l') });
      return;
    }
    APP.titre();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', APP.init); else APP.init();
})();
