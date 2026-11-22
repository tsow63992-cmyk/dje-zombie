/* Dje_zombie — déroulé d'une partie : scènes narrées, choix, objets, aubes, fins. */
(function () {
  'use strict';
  var DJE = window.DJE, U = DJE.u, C = DJE.core, R = DJE.rendu;
  var J = DJE.jeu = { rapide: false, annule: false, pause: false, en: false, st: null, hist: null, notes: {} };
  var ANNULE = { annule: true };
  var resoudreAttente = null;
  function verif() { if (J.annule) throw ANNULE; }
  J.attendrePause = async function () { while (J.pause && !J.annule) await U.pause(150); };

  J.annuler = function () {
    J.annule = true; J.pause = false;
    U.passer();
    DJE.voix.stop();
    if (resoudreAttente) { var f = resoudreAttente; resoudreAttente = null; f(null); }
  };
  function attente(fn) { return new Promise(function (res) { resoudreAttente = function (v) { resoudreAttente = null; res(v); }; fn(resoudreAttente); }); }

  var sousNuit = ['', 'TIENS JUSQU\'À L\'AUBE', 'PLUS QUE DEUX', 'LA DERNIÈRE'];

  J.lancer = async function (zid, lid, mode) {
    J.annule = false; J.pause = false; J.en = true; J.mode = mode || {};
    J.st = C.etat(zid, lid); J.hist = C.histoire(zid, lid); J.notes = {};
    R.monter(lid);
    DJE.audio.ambiance(DJE.decors[lid].ambiance);
    R.voile([], J.st); R.hud(J.st);
    var id = J.hist.debut;
    try {
      for (var garde = 0; garde < 500; garde++) {
        verif();
        id = C.resoudre(J.hist, id, J.st);
        var sc = J.hist.scenes[id];
        J.sceneId = id;
        if (sc.nuit && sc.nuit > J.st.nuit) { DJE.st.effacer(); await R.carteNuit(sc.nuit, sousNuit[sc.nuit]); verif(); }
        var journal = C.arriver(J.hist, id, J.st);
        J.afficher(sc);
        R.hud(J.st, journal);
        if (sc.message) { R.message(sc.message, lid); DJE.audio.jouer('craque'); }
        var lignes = C.lignes(sc, J.st);
        for (var i = 0; i < lignes.length; i++) { await J.attendrePause(); verif(); await DJE.st.dire(lignes[i]); }
        verif();
        R.message(null);
        if (sc.type === 'science') { DJE.st.effacer(); await DJE.science.jouer(zid, lid); verif(); }
        for (var k = 0; k < journal.length; k++) {
          if (journal[k].k !== 'indice') continue;
          J.notes[journal[k].id] = journal[k].t;
          DJE.audio.jouer('indice');
          R.toast('INDICE NOTÉ', U.fmt(journal[k].t), 3400);
          await U.attendre(J.rapide ? 80 : 1500); verif();
        }
        if (sc.fin) { DJE.st.effacer(); return await J.finir(sc.fin); }
        if (sc.type === 'objets') { DJE.st.effacer(); await J.objets(); verif(); id = sc.next; continue; }
        if (sc.type === 'aube') { DJE.st.effacer(); await J.aube(); verif(); id = sc.next; continue; }
        if (sc.choix) { var go = await J.choisir(sc); verif(); id = go; continue; }
        id = sc.next;
      }
      throw new Error('Partie trop longue (boucle ?)');
    } catch (e) {
      if (e === ANNULE) return null;
      throw e;
    } finally {
      J.en = false;
      J.toucheChoix = null; J.toucheObjet = null;
    }
  };

  J.afficher = function (sc) {
    var lid = J.st.l, vue = C.v(sc.vue, lid) || 'large';
    R.vue(vue);
    R.acteurs(C.v(sc.acteurs, lid), J.st.z, vue === 'abri');
    R.decor(C.v(sc.decor, lid));
    R.voile(C.v(sc.fx, lid), J.st);
  };

  /* Choix : boutons + touches 1 à 4 */
  J.choisir = function (sc) {
    return attente(function (fin) {
      var liste = C.choix(sc, J.st), zone = document.getElementById('choix'), fait = false;
      zone.innerHTML = '';
      var boutons = liste.map(function (c, i) {
        var b = U.el('button', 'choix-b');
        b.type = 'button'; b.disabled = !c.ok;
        b.innerHTML = '<span class="num">' + (i + 1) + '</span><span class="txt"><span>' + U.fmt(c.t) + '</span>' + (c.ok ? '' : '<span class="why">' + U.echap(c.why) + '</span>') + '</span>';
        U.surClic(b, function () { choisir(i); });
        zone.appendChild(b);
        return b;
      });
      J.toucheChoix = function (n) { choisir(n - 1); };
      var premier = boutons.filter(function (b) { return !b.disabled; })[0];
      if (premier) setTimeout(function () { try { premier.focus({ preventScroll: true }); } catch (e) { /* rien */ } }, 50);
      function choisir(i) {
        var c = liste[i];
        if (!c || !c.ok || fait) return;
        fait = true; J.toucheChoix = null;
        boutons[i].classList.add('choisi');
        DJE.audio.jouer('clic');
        setTimeout(function () {
          zone.innerHTML = '';
          var r = C.choisir(c.ch, J.st);
          R.hud(J.st, r.journal);
          R.voile(C.v(sc.fx, J.st.l), J.st);
          r.journal.forEach(function (j) {
            if (j.k === 'perd') R.toast('', 'Tu n\'as plus : <span class="k">' + U.echap(C.nomObjet(J.st.l, j.o)) + '</span>', 2200);
          });
          DJE.st.effacer();
          fin(r.go);
        }, J.rapide ? 30 : 260);
      }
    });
  };

  /* Choix des 3 objets */
  J.objets = function () {
    return attente(function (fin) {
      var l = C.lieu(J.st.l), z = C.zombie(J.st.z), pris = [];
      var p = U.el('section', 'panneau objets-p');
      p.innerHTML = '<div class="rappel">' + U.echap(z.nom) + ' — ' + z.jauges.map(function (j) { return U.echap(j[0]) + ' ' + j[1]; }).join(' · ') + '</div>' +
        '<h2 class="titre-ecran">Prends <span class="k">3</span> objets</h2>' +
        '<div class="grille-objets">' + l.objets.map(function (o, i) {
          return '<button type="button" class="carte-objet" data-id="' + o.id + '"><span class="haut">' + DJE.icones.objet(o.id) + U.echap(o.nom) + '<span class="n">' + (i + 1) + '</span></span><span class="d">' + U.echap(o.desc) + '</span></button>';
        }).join('') + '</div>' +
        '<button type="button" class="bouton or" disabled>CHOISIS ENCORE 3 OBJETS</button>';
      document.getElementById('ecran').appendChild(p);
      var cartes = p.querySelectorAll('.carte-objet'), ok = p.querySelector('.bouton');
      function maj() {
        cartes.forEach(function (c) { c.classList.toggle('pris', pris.indexOf(c.dataset.id) >= 0); c.setAttribute('aria-pressed', pris.indexOf(c.dataset.id) >= 0); });
        var reste = 3 - pris.length;
        ok.disabled = reste !== 0;
        ok.textContent = reste ? 'CHOISIS ENCORE ' + reste + ' OBJET' + (reste > 1 ? 'S' : '') : 'C\'EST PARTI';
        J.st.inv = pris.slice(); R.hud(J.st);
      }
      function basculer(i) {
        var id = l.objets[i] && l.objets[i].id;
        if (!id) return;
        var k = pris.indexOf(id);
        if (k >= 0) pris.splice(k, 1); else if (pris.length < 3) pris.push(id); else return;
        DJE.audio.jouer('clic'); maj();
      }
      cartes.forEach(function (c, i) { U.surClic(c, function () { basculer(i); }); });
      J.toucheObjet = basculer;
      function valider() {
        if (pris.length !== 3) return;
        J.toucheObjet = null; DJE.app.attenteTouche = null;
        J.st.inv = pris.slice(); R.hud(J.st);
        DJE.audio.jouer('whoosh');
        p.classList.add('sort'); setTimeout(function () { p.remove(); fin(true); }, 300);
      }
      U.surClic(ok, valider);
      DJE.app.attenteTouche = valider;
      maj();
    });
  };

  /* Aube : carnet des indices */
  J.aube = function () {
    return attente(function (fin) {
      var ids = Object.keys(J.notes);
      var p = U.el('section', 'panneau aube-p');
      p.innerHTML = '<h2 class="titre-ecran">Nuit <span class="k">' + J.st.nuit + '/3</span> tenue</h2>' +
        '<p class="sous">' + (J.st.nuit === 1 ? 'Encore deux nuits avant ' + U.echap(C.texte('{secours}', J.st)) + '.' : 'Plus qu\'une nuit avant ' + U.echap(C.texte('{secours}', J.st)) + '.') + '</p>' +
        '<div class="carnet"><h3>CE QUE TU SAIS</h3>' + (ids.length ? '<ul>' + ids.map(function (i) { return '<li>' + U.fmt(J.notes[i]) + '</li>'; }).join('') + '</ul>' : '<p class="vide">Rien encore. Observe mieux la nuit prochaine.</p>') + '</div>' +
        '<button type="button" class="bouton or">LA NUIT TOMBE</button>';
      document.getElementById('ecran').appendChild(p);
      DJE.audio.jouer('survie');
      var b = p.querySelector('.bouton');
      function suite() { DJE.app.attenteTouche = null; p.classList.add('sort'); setTimeout(function () { p.remove(); fin(true); }, 300); }
      U.surClic(b, suite);
      DJE.app.attenteTouche = suite;
      setTimeout(function () { try { b.focus({ preventScroll: true }); } catch (e) { /* rien */ } }, 50);
    });
  };

  /* Fin de partie */
  J.finir = async function (fid) {
    var f = C.fin(J.hist, fid, J.st), z = C.zombie(J.st.z), survie = f.type === 'survie';
    var res = { z: J.st.z, l: J.st.l, survie: survie, nuit: J.st.nuit, faible: !!f.parfait, fin: fid, titre: f.titre, jour: J.mode.jour || null, date: Date.now() };
    var nouveau = J.mode.rejeu ? false : DJE.save.partie(J.st.z, res);
    if (J.mode.jour) DJE.save.setJour(J.mode.jour, res);
    R.cacherHud();
    R.voile(survie ? [] : ['noir']);
    if (survie) { R.decor(['aube', 'bateau']); R.acteurs([]); }
    DJE.audio.jouer(survie ? 'survie' : 'mort');
    await U.pause(J.rapide ? 50 : 700);
    return attente(function (fin) {
      var p = U.el('section', 'panneau defile fin-p ' + (survie ? 'survie' : 'mort'));
      var h = '';
      if (survie) {
        h += '<h2 class="verdict">TU AS SURVÉCU</h2><div class="nomfin">« ' + U.echap(f.titre) + ' »</div>';
        h += '<div class="bloc"><b>CE QUI S\'EST PASSÉ</b><p>' + U.typo(U.echap(f.texte)) + '</p></div>';
        if (f.parfait) h += '<div class="bloc or"><b>POINT FAIBLE DÉCOUVERT' + (nouveau ? ' · NOUVEAU' : '') + '</b><p>' + U.typo(U.echap(z.faible)) + '</p></div>';
        else h += '<div class="bloc rouge"><b>POINT FAIBLE : ???</b><p>Tu t\'en es sorti sans l\'exploiter. Rejoue pour le trouver.</p></div>';
      } else {
        h += '<h2 class="verdict">TU ES MORT</h2><div class="nomfin">NUIT ' + J.st.nuit + '/3 · « ' + U.echap(f.titre) + ' »</div>';
        h += '<div class="bloc rouge"><b>CE QUI T\'A TUÉ</b><p>' + U.typo(U.echap(f.cause)) + '</p></div>';
        h += '<div class="bloc"><b>POURQUOI</b><p>' + U.typo(U.echap(f.pourquoi)) + '</p></div>';
        h += '<div class="bloc or"><b>LA PROCHAINE FOIS</b><p>' + U.typo(U.echap(f.conseil)) + '</p></div>';
      }
      if (J.mode.rejeu) h += '<p class="sous">Rejeu de la roulette du jour : cette partie n\'est pas comptée.</p>';
      h += '<button type="button" class="bouton or">VOIR MON RÉSULTAT</button>';
      p.innerHTML = h;
      document.getElementById('ecran').appendChild(p);
      var b = p.querySelector('.bouton');
      function suite() { DJE.app.attenteTouche = null; p.remove(); fin(res); }
      U.surClic(b, suite);
      DJE.app.attenteTouche = suite;
      setTimeout(function () { try { b.focus({ preventScroll: true }); } catch (e) { /* rien */ } }, 50);
    });
  };
})();
