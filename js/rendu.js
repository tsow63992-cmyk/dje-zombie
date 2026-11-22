/* Dje_zombie — rendu de la scène : décor, caméra, personnages, voiles, HUD. */
(function () {
  'use strict';
  var DJE = window.DJE, U = DJE.u, C = DJE.core;
  var R = DJE.rendu = { lieu: null, vueCourante: null };
  var MONDE_W = 1800, MONDE_H = 1600;
  var svg, camExt, camInt, actExt, actInt;

  R.monter = function (lid) {
    R.lieu = lid;
    var d = DJE.decors;
    var html = '<svg viewBox="0 0 900 1600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="derive"><g class="cam" id="cam-ext">' + d[lid].monde('m' + lid) + '<g id="act-ext"></g></g></g>' +
      '<g id="cam-int" style="opacity:0;transition:opacity .8s">' + d.interieur(lid, 'i' + lid) + '<g id="act-int"></g></g>' +
      '</svg>';
    document.getElementById('monde').innerHTML = html;
    svg = document.querySelector('#monde > svg');
    camExt = document.getElementById('cam-ext'); camInt = document.getElementById('cam-int');
    actExt = document.getElementById('act-ext'); actInt = document.getElementById('act-int');
    R.vueCourante = null;
    R.vue('large', true);
  };
  R.vider = function () { document.getElementById('monde').innerHTML = ''; svg = null; R.lieu = null; DJE.fx.regler([]); R.voile([]); };

  R.vue = function (nom, direct) {
    if (!svg) return;
    var l = C.lieu(R.lieu);
    if (nom === 'abri') {
      camInt.style.opacity = '1';
      R.vueCourante = nom;
      return;
    }
    camInt.style.opacity = '0';
    var v = l.vues[nom] || l.vues.large;
    var w = v[2], h = w * 16 / 9;
    if (h > MONDE_H) { h = MONDE_H; w = h * 9 / 16; }
    var x = Math.max(0, Math.min(MONDE_W - w, v[0] - w / 2)), y = Math.max(0, Math.min(MONDE_H - h, v[1] - h / 2));
    var s = 900 / w;
    if (direct) { camExt.style.transition = 'none'; }
    camExt.style.transform = 'translate(' + (-x * s).toFixed(1) + 'px,' + (-y * s).toFixed(1) + 'px) scale(' + s.toFixed(4) + ')';
    if (direct) { camExt.getBoundingClientRect(); camExt.style.transition = ''; }
    R.vueCourante = nom;
  };

  R.acteurs = function (liste, zid, interieur) {
    if (!svg) return;
    var l = C.lieu(R.lieu), P = DJE.portraits;
    var ext = '', int = '';
    (liste || []).forEach(function (a) {
      var anc = interieur ? (DJE.decors.ancresInterieur[a.a] || DJE.decors.ancresInterieur.defaut) : (l.ancres[a.a] || l.ancres.decouvert);
      var x = anc[0], y = anc[1], s = anc[2], out = '';
      if (a.q === 'horde') {
        if (interieur) return;
        out = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + P.horde(a.n || 7) + '</g>';
      } else {
        var id = a.q === 'zombie' ? zid : a.q, k = s * (id === zid ? P.taille(id) : 1);
        out = '<g transform="translate(' + (x - 100 * k).toFixed(1) + ' ' + (y - 296 * k).toFixed(1) + ') scale(' + k.toFixed(3) + ')">' + P.dessiner(id, { pose: a.pose, ondes: a.ondes }) + '</g>';
      }
      if (interieur) int += out; else ext += out;
    });
    actExt.innerHTML = ext; actInt.innerHTML = int;
  };

  R.decor = function (liste) {
    if (!svg) return;
    svg.setAttribute('class', (liste || []).map(function (d) { return 'e-' + d; }).join(' '));
  };

  /* Voiles et particules */
  R.voile = function (fx, st) {
    var v = document.getElementById('voile'), m = document.getElementById('monde');
    fx = fx || [];
    var has = function (k) { return fx.indexOf(k) >= 0; };
    v.classList.toggle('noir', has('noir'));
    v.classList.toggle('danger', has('danger'));
    v.classList.toggle('lampe', has('faisceau') || !!(st && st.visi >= 1 && st.inv.indexOf('lampe') >= 0 && !has('noir')));
    m.classList.toggle('thermique', has('thermique'));
    var parts = R.lieu ? (DJE.decors[R.lieu].fx || []).slice() : [];
    ['brume', 'pluie', 'braises', 'cendres'].forEach(function (p) { if (has(p)) parts.push(p); });
    DJE.fx.regler(parts);
  };

  /* HUD */
  var visiNoms = ['NOIR', 'LAMPE', 'EXPOSÉ'];
  R.hud = function (st, journal) {
    var h = document.getElementById('hud');
    h.hidden = false;
    var z = C.zombie(st.z);
    document.getElementById('hud-nuit').textContent = st.nuit ? 'NUIT ' + st.nuit + '/3' : 'SOIR';
    document.getElementById('hud-zombie').textContent = z.court;
    var jb = document.getElementById('j-bruit'), jp = document.getElementById('j-peur'), jv = document.getElementById('j-visi');
    jb.querySelector('i').style.width = st.bruit + '%';
    jb.classList.toggle('haut', st.bruit >= 60);
    jp.querySelector('i').style.width = st.peur + '%';
    jv.querySelector('.j-nom').textContent = visiNoms[st.visi] || 'NOIR';
    jv.querySelector('.j-oeil').innerHTML = [0, 1, 2].map(function (i) { return '<i class="' + (i < st.visi ? 'on' : '') + '"></i>'; }).join('');
    var sac = document.getElementById('hud-sac');
    sac.innerHTML = st.inv.map(function (o) { return '<span class="objet-puce">' + DJE.icones.objet(o) + U.echap(C.nomObjet(st.l, o)) + '</span>'; }).join('') ||
      '';
    (journal || []).forEach(function (j) {
      var el = j.k === 'bruit' ? jb : j.k === 'peur' ? jp : j.k === 'visi' ? jv : null;
      if (el) { el.classList.remove('bouge'); el.getBoundingClientRect(); el.classList.add('bouge'); }
    });
    DJE.audio.coeur(st.peur);
  };
  R.cacherHud = function () { document.getElementById('hud').hidden = true; DJE.audio.coeur(0); };

  R.message = function (txt, lid) {
    var m = document.getElementById('message');
    if (!txt) { m.hidden = true; m.className = ''; return; }
    m.className = lid || '';
    m.innerHTML = U.echap(txt);
    m.hidden = false;
  };

  var toastT = null;
  R.toast = function (titre, html, ms) {
    var t = document.getElementById('toast');
    t.innerHTML = (titre ? '<b>' + U.echap(titre) + '</b>' : '') + html;
    t.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('on'); }, ms || 2600);
  };

  R.carteNuit = async function (n, sous) {
    var c = document.getElementById('carte-nuit');
    c.innerHTML = '<div class="n">NUIT ' + n + '<small>/3</small></div><div class="s">' + U.echap(sous || '') + '</div>';
    c.classList.add('on');
    DJE.audio.jouer('nuit');
    await U.attendre(DJE.jeu.rapide ? 300 : 2100);
    c.classList.remove('on');
    await U.pause(DJE.jeu.rapide ? 50 : 450);
  };

  R.flash = function (or) {
    var f = document.getElementById('flash');
    f.className = or ? 'or' : '';
    f.getBoundingClientRect();
    f.className = (or ? 'or ' : '') + 'on';
    DJE.audio.jouer('flash');
  };
})();
