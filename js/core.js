/* Dje_zombie — cœur du moteur.
   Aucune dépendance au DOM : ce fichier est aussi chargé par les tests sous Node. */
(function (root) {
  'use strict';
  var DJE = root.DJE = root.DJE || {};
  DJE.data = DJE.data || {};
  DJE.data.zombies = DJE.data.zombies || [];
  DJE.data.lieux = DJE.data.lieux || [];
  DJE.data.histoires = DJE.data.histoires || {};

  /* Enregistrement des contenus (utilisé par les fichiers de data/) */
  DJE.lieu = function (l) { DJE.data.lieux.push(l); };
  DJE.histoire = function (zid, h) { DJE.data.histoires[zid] = h; };

  var C = DJE.core = {};
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var liste = function (x) { return x == null ? [] : [].concat(x); };

  C.zombie = function (id) { return DJE.data.zombies.filter(function (z) { return z.id === id; })[0]; };
  C.lieu = function (id) { return DJE.data.lieux.filter(function (l) { return l.id === id; })[0]; };

  /* État d'une partie */
  C.etat = function (zid, lid) {
    return { z: zid, l: lid, nuit: 0, bruit: 0, peur: 10, visi: 0, inv: [], flags: {}, indices: [], fin: null, faible: false };
  };
  C.clone = function (st) { return JSON.parse(JSON.stringify(st)); };
  C.cle = function (id, st) {
    return id + '|' + st.bruit + '|' + st.peur + '|' + st.visi + '|' + st.inv.slice().sort().join(',') + '|' +
      Object.keys(st.flags).sort().join(',') + '|' + st.indices.slice().sort().join(',');
  };

  /* Variantes par lieu : { village: ..., ile: ..., metro: ..., tous: ... } */
  var clesVariante = { village: 1, ile: 1, metro: 1, tous: 1 };
  C.estVariante = function (x) {
    if (!x || typeof x !== 'object' || Array.isArray(x)) return false;
    var k = Object.keys(x);
    if (!k.length) return false;
    for (var i = 0; i < k.length; i++) if (!clesVariante[k[i]]) return false;
    return true;
  };
  C.v = function (x, lid) {
    if (C.estVariante(x)) return x[lid] !== undefined ? x[lid] : x.tous;
    return x;
  };

  /* Remplace {mot} par le vocabulaire du lieu, {Z} par le nom du zombie */
  C.texte = function (s, st) {
    if (typeof s !== 'string') return s;
    var l = C.lieu(st.l) || { mots: {} }, z = C.zombie(st.z) || {};
    return s.replace(/\{(\w+)\}/g, function (m, k) {
      var maj = k.charAt(0) === k.charAt(0).toUpperCase();
      var cle = k.charAt(0).toLowerCase() + k.slice(1);
      var val;
      if (k === 'Z') return z.art || '';
      if (k === 'ZM') return z.Art || '';
      if (k === 'ZN') return z.nom || '';
      val = l.mots && l.mots[cle];
      if (val == null) return m;
      return maj ? val.charAt(0).toUpperCase() + val.slice(1) : val;
    });
  };

  C.nomObjet = function (lid, oid) {
    var l = C.lieu(lid), o = l && l.objets.filter(function (x) { return x.id === oid; })[0];
    return o ? o.nom : oid;
  };

  /* Conditions */
  C.cond = function (c, st) {
    if (!c) return true;
    if (Array.isArray(c)) return c.every(function (x) { return C.cond(x, st); });
    if (c.lieu && liste(c.lieu).indexOf(st.l) < 0) return false;
    if (c.has && !liste(c.has).every(function (i) { return st.inv.indexOf(i) >= 0; })) return false;
    if (c.hasAny && !liste(c.hasAny).some(function (i) { return st.inv.indexOf(i) >= 0; })) return false;
    if (c.hasNot && liste(c.hasNot).some(function (i) { return st.inv.indexOf(i) >= 0; })) return false;
    if (c.flag && !liste(c.flag).every(function (f) { return st.flags[f]; })) return false;
    if (c.anyFlag && !liste(c.anyFlag).some(function (f) { return st.flags[f]; })) return false;
    if (c.not && liste(c.not).some(function (f) { return st.flags[f]; })) return false;
    if (c.indice && !liste(c.indice).every(function (i) { return st.indices.indexOf(i) >= 0; })) return false;
    if (c.peurMax != null && st.peur > c.peurMax) return false;
    if (c.peurMin != null && st.peur < c.peurMin) return false;
    if (c.bruitMax != null && st.bruit > c.bruitMax) return false;
    if (c.bruitMin != null && st.bruit < c.bruitMin) return false;
    if (c.visiMax != null && st.visi > c.visiMax) return false;
    if (c.visiMin != null && st.visi < c.visiMin) return false;
    if (c.or && !c.or.some(function (x) { return C.cond(x, st); })) return false;
    return true;
  };

  /* Effets : retourne la liste des changements visibles (pour l'interface) */
  C.appliquer = function (e, st, journal) {
    journal = journal || [];
    if (!e) return journal;
    if (Array.isArray(e)) { e.forEach(function (x) { C.appliquer(x, st, journal); }); return journal; }
    if (e.si) { if (C.cond(e.si, st)) C.appliquer(e.alors, st, journal); else C.appliquer(e.sinon, st, journal); return journal; }
    if (e.bruit) { st.bruit = clamp(st.bruit + e.bruit, 0, 100); journal.push({ k: 'bruit', d: e.bruit }); }
    if (e.bruitA != null) st.bruit = clamp(e.bruitA, 0, 100);
    if (e.peur) { st.peur = clamp(st.peur + e.peur, 0, 100); journal.push({ k: 'peur', d: e.peur }); }
    if (e.peurA != null) st.peur = clamp(e.peurA, 0, 100);
    if (e.visi != null) { if (st.visi !== e.visi) journal.push({ k: 'visi', v: e.visi }); st.visi = clamp(e.visi, 0, 2); }
    liste(e.perd).forEach(function (i) {
      var p = st.inv.indexOf(i);
      if (p >= 0) { st.inv.splice(p, 1); journal.push({ k: 'perd', o: i }); }
    });
    liste(e.gain).forEach(function (i) {
      if (st.inv.indexOf(i) < 0 && st.inv.length < 3) { st.inv.push(i); journal.push({ k: 'gain', o: i }); }
    });
    liste(e.set).forEach(function (f) { st.flags[f] = true; });
    liste(e.unset).forEach(function (f) { delete st.flags[f]; });
    return journal;
  };

  /* Assemble l'histoire d'une combinaison zombie × lieu */
  C.histoire = function (zid, lid) {
    var l = C.lieu(lid), h = DJE.data.histoires[zid];
    if (!l) throw new Error('Lieu inconnu : ' + lid);
    if (!h) throw new Error('Histoire inconnue : ' + zid);
    var scenes = {};
    Object.keys(l.scenes).forEach(function (k) { scenes[k] = l.scenes[k]; });
    Object.keys(h.scenes).forEach(function (k) { scenes[k] = h.scenes[k]; });
    return { z: zid, l: lid, scenes: scenes, fins: h.fins, science: h.science, debut: 'debut' };
  };

  /* Suit les aiguillages (branche) jusqu'à la scène réellement jouée */
  C.resoudre = function (hist, id, st) {
    var garde = 0;
    for (;;) {
      var sc = hist.scenes[id];
      if (!sc) throw new Error('Scène inexistante : ' + id + ' (' + hist.z + ' × ' + hist.l + ')');
      if (++garde > 30) throw new Error('Boucle d\'aiguillage vers ' + id);
      var b = liste(C.v(sc.branche, st.l)), suite = null;
      for (var i = 0; i < b.length; i++) if (C.cond(b[i].c, st)) { suite = b[i].go; break; }
      if (!suite) return id;
      id = suite;
    }
  };

  /* Arrivée dans une scène : effets, indice, nuit, fin */
  C.arriver = function (hist, id, st) {
    var sc = hist.scenes[id], journal = [];
    if (sc.nuit && sc.nuit > st.nuit) st.nuit = sc.nuit;
    C.appliquer(C.v(sc.on, st.l), st, journal);
    var ind = C.v(sc.indice, st.l);
    if (ind && st.indices.indexOf(ind.id) < 0) { st.indices.push(ind.id); journal.push({ k: 'indice', id: ind.id, t: C.texte(C.v(ind.t, st.l), st) }); }
    if (sc.fin) {
      var f = C.fin(hist, sc.fin, st);
      st.fin = sc.fin;
      if (f && f.parfait) st.faible = true;
    }
    return journal;
  };

  C.fin = function (hist, id, st) {
    var f = hist.fins[id];
    if (!f) return null;
    var o = {};
    Object.keys(f).forEach(function (k) { o[k] = C.v(f[k], st.l); });
    return o;
  };

  C.lignes = function (sc, st) {
    return liste(C.v(sc.l, st.l)).map(function (s) { return C.texte(s, st); });
  };

  /* Choix proposés dans l'état courant */
  C.choix = function (sc, st) {
    var l = C.v(sc.choix, st.l) || [];
    return l.filter(function (ch) {
      if (ch.lieu && liste(ch.lieu).indexOf(st.l) < 0) return false;
      return C.cond(ch.si, st);
    }).map(function (ch) {
      var ok = true, why = '', need = C.v(ch.need, st.l);
      if (need && !C.cond({ has: need }, st)) {
        ok = false;
        why = 'Il te faut : ' + liste(need).map(function (o) { return C.nomObjet(st.l, o).toLowerCase(); }).join(', ');
      } else if (ch.calme && st.peur > 70) {
        ok = false; why = 'Tu trembles trop pour ça.';
      } else if (ch.req && !C.cond(ch.req, st)) {
        ok = false; why = C.texte(ch.pourquoi || 'Impossible pour l\'instant.', st);
      }
      return { ch: ch, ok: ok, why: why, t: C.texte(C.v(ch.t, st.l), st) };
    });
  };

  /* Après un choix : effets puis id de la scène suivante */
  C.choisir = function (ch, st) {
    var journal = C.appliquer(C.v(ch.fx, st.l), st);
    return { go: ch.go, journal: journal };
  };

  /* Tirage pondéré */
  C.tirer = function (rng, items, poids) {
    var tot = 0, i;
    for (i = 0; i < items.length; i++) tot += poids(items[i]);
    var r = rng() * tot;
    for (i = 0; i < items.length; i++) { r -= poids(items[i]); if (r < 0) return items[i]; }
    return items[items.length - 1];
  };

  /* Générateur pseudo-aléatoire déterministe (pour la roulette du jour) */
  C.rng = function (graine) {
    var a = graine >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  C.hash = function (s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  C.cleJour = function (d) {
    d = d || new Date();
    var m = d.getMonth() + 1, j = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (j < 10 ? '0' : '') + j;
  };
})(typeof window !== 'undefined' ? window : globalThis);
