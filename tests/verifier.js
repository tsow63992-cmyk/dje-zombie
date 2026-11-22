#!/usr/bin/env node
/* Dje_zombie — vérification automatique de toutes les histoires.
   Lancement : node tests/verifier.js
   Pour chaque combinaison zombie × lieu et chaque sac de 3 objets possible, explore
   tous les chemins et vérifie :
   - qu'aucun choix ne mène à une scène inexistante ;
   - qu'il n'y a aucune impasse (scène sans sortie, ou dont tous les choix sont bloqués) ;
   - que la partie peut toujours être jouée jusqu'à une fin ;
   - que chaque fin déclarée est atteignable dans chaque lieu où elle existe ;
   - qu'au moins une survie est possible quel que soit le sac d'objets choisi ;
   - jamais plus de 4 choix à l'écran, aucun {mot} non remplacé, aucun son inconnu. */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var racine = path.join(__dirname, '..');
var ctx = { console: console };
ctx.globalThis = ctx;
vm.createContext(ctx);
function charger(f) { vm.runInContext(fs.readFileSync(path.join(racine, f), 'utf8'), ctx, { filename: f }); }
charger('js/core.js');
charger('data/zombies.js');
charger('data/lieux.js');
var dossier = path.join(racine, 'data/scenes');
fs.readdirSync(dossier).filter(function (f) { return /\.js$/.test(f); }).sort().forEach(function (f) { charger('data/scenes/' + f); });

var DJE = ctx.DJE, C = DJE.core;
var SONS = ['siffle', 'pas', 'coeur', 'cloche', 'phare', 'corne', 'ventilation', 'sifflet', 'bateau', 'helico', 'train', 'metal',
  'vague', 'grince', 'eau', 'pierre', 'porte', 'feu', 'souffle', 'vent', 'craque', 'chute', 'cri', 'boum', 'vitre', 'rampe',
  'goutte', 'flash', 'brume', 'thermique', 'ecoute', 'geant', 'braise', 'cascade', 'extincteur', 'fusee', 'pluie', 'tonnerre'];

var erreurs = [], avert = [];
function err(m) { if (erreurs.indexOf(m) < 0) erreurs.push(m); }
function warn(m) { if (avert.indexOf(m) < 0) avert.push(m); }

function combinaisons(arr, k) {
  var res = [];
  (function rec(start, acc) {
    if (acc.length === k) { res.push(acc.slice()); return; }
    for (var i = start; i < arr.length; i++) { acc.push(arr[i]); rec(i + 1, acc); acc.pop(); }
  })(0, []);
  return res;
}

function verifTexte(s, ou) {
  if (typeof s !== 'string' || !s.trim()) { err(ou + ' : ligne vide'); return; }
  if (/\{\w+\}/.test(s)) err(ou + ' : mot non remplacé dans « ' + s + ' »');
  var m, re = /\[\[([^\]]+)\]\]/g;
  while ((m = re.exec(s))) {
    var nom = m[1].split(':')[0];
    if (SONS.indexOf(nom) < 0) err(ou + ' : son inconnu [[' + m[1] + ']]');
  }
  if ((s.match(/\*/g) || []).length % 2) err(ou + ' : astérisque orphelin dans « ' + s + ' »');
  var nu = s.replace(/\[\[[^\]]+\]\]/g, '').replace(/\*/g, '');
  if (nu.length > 120) warn(ou + ' : ligne longue (' + nu.length + ' car.)');
}

var bilan = [];
var totalEtats = 0;

var filtre = process.env.ZOMBIES ? process.env.ZOMBIES.split(',') : null;
DJE.data.zombies.forEach(function (z) {
  if (filtre && filtre.indexOf(z.id) < 0) return;
  var h = DJE.data.histoires[z.id];
  if (!h) { err('Pas d\'histoire pour ' + z.id); return; }
  if (!h.science || !h.science.diapos || !h.science.diapos.length) err(z.id + ' : pas de séquence « Le savais-tu ? »');
  ['n1', 'n2', 'n3'].forEach(function (n) { if (!h.scenes[n]) err(z.id + ' : scène ' + n + ' manquante'); });
  var vuesGlobal = {};

  DJE.data.lieux.forEach(function (l) {
    var hist = C.histoire(z.id, l.id);
    var finsAtteintes = {}, scenesVues = {};
    var sacs = combinaisons(l.objets.map(function (o) { return o.id; }), 3);
    var sacsSansSurvie = [];

    sacs.forEach(function (sac) {
      var survie = false, fini = false;
      var vus = {};
      var file = [{ id: 'debut', st: C.etat(z.id, l.id) }];
      while (file.length) {
        var it = file.shift(), id;
        try { id = C.resoudre(hist, it.id, it.st); } catch (e) { err(z.id + ' × ' + l.id + ' : ' + e.message); continue; }
        var st = C.clone(it.st);
        var cle = C.cle(id, st);
        if (vus[cle]) continue;
        vus[cle] = 1; totalEtats++;
        var sc = hist.scenes[id], ou = z.id + ' × ' + l.id + ' / ' + id;
        scenesVues[id] = 1; vuesGlobal[id] = 1;
        C.arriver(hist, id, st);
        C.lignes(sc, st).forEach(function (s) { verifTexte(s, ou); });
        if (sc.message) verifTexte(sc.message, ou);
        var ind = C.v(sc.indice, st.l);
        if (ind) verifTexte(C.texte(C.v(ind.t, st.l), st), ou + ' (indice)');

        if (sc.fin) {
          var f = hist.fins[sc.fin];
          if (!f) { err(ou + ' : fin inconnue « ' + sc.fin + ' »'); continue; }
          if (f.lieux && f.lieux.indexOf(l.id) < 0) err(ou + ' : la fin « ' + sc.fin + ' » n\'est pas prévue pour ce lieu');
          finsAtteintes[sc.fin] = 1; fini = true;
          if (f.type === 'survie') survie = true;
          continue;
        }
        if (sc.type === 'objets') {
          if (it.id !== 'objets' && id !== 'objets') err(ou + ' : scène d\'objets inattendue');
          st.inv = sac.slice();
          file.push({ id: sc.next, st: st });
          continue;
        }
        if (sc.next && !sc.choix) {
          if (!hist.scenes[sc.next]) err(ou + ' : suite inexistante « ' + sc.next + ' »');
          else file.push({ id: sc.next, st: st });
          continue;
        }
        if (!sc.choix) { err(ou + ' : scène sans sortie'); continue; }
        var ch = C.choix(sc, st);
        if (ch.length > 4) err(ou + ' : ' + ch.length + ' choix visibles (max 4)');
        var ok = ch.filter(function (c) { return c.ok; });
        if (!ok.length) { err(ou + ' : impasse (aucun choix possible) avec ' + JSON.stringify({ inv: st.inv, peur: st.peur, flags: st.flags })); continue; }
        if (ch.length < 2 && sc.choix) warn(ou + ' : un seul choix visible');
        ch.forEach(function (c) {
          verifTexte(c.t, ou + ' (choix)');
          if (!c.ok) return;
          var st2 = C.clone(st);
          var r = C.choisir(c.ch, st2);
          if (!hist.scenes[r.go]) { err(ou + ' : le choix « ' + c.t + ' » mène à « ' + r.go + ' » qui n\'existe pas'); return; }
          file.push({ id: r.go, st: st2 });
        });
      }
      if (!fini) err(z.id + ' × ' + l.id + ' : aucune fin atteignable avec ' + sac.join('+'));
      if (!survie) sacsSansSurvie.push(sac.join('+'));
    });

    Object.keys(h.fins).forEach(function (fid) {
      var f = h.fins[fid];
      if (f.lieux && f.lieux.indexOf(l.id) < 0) return;
      if (!finsAtteintes[fid]) err(z.id + ' × ' + l.id + ' : fin « ' + fid + ' » jamais atteinte');
      ['titre', 'texte', 'cause', 'pourquoi', 'conseil'].forEach(function (k) {
        var v = C.v(f[k], l.id);
        if (v != null) verifTexte(v, z.id + ' fin ' + fid + '.' + k);
      });
      if (f.type === 'mort' && !(C.v(f.cause, l.id) && C.v(f.pourquoi, l.id) && C.v(f.conseil, l.id))) err(z.id + ' fin ' + fid + ' : une mort doit expliquer cause, pourquoi et conseil');
    });
    if (sacsSansSurvie.length) err(z.id + ' × ' + l.id + ' : aucune survie possible avec ' + sacsSansSurvie.join(', '));
    var fins = Object.keys(finsAtteintes);
    var nbS = fins.filter(function (f) { return h.fins[f].type === 'survie'; }).length;
    if (nbS < 2) err(z.id + ' × ' + l.id + ' : moins de 2 survies possibles');
    if (fins.length - nbS < 2) err(z.id + ' × ' + l.id + ' : moins de 2 morts possibles');
    bilan.push(z.id + ' × ' + l.id + ' : ' + Object.keys(scenesVues).length + ' scènes, ' + nbS + ' survies, ' + (fins.length - nbS) + ' morts');
  });

  Object.keys(h.scenes).forEach(function (id) { if (!vuesGlobal[id]) warn(z.id + ' : scène « ' + id + ' » jamais atteinte'); });
  (h.science && h.science.diapos || []).forEach(function (d, i) {
    DJE.data.lieux.forEach(function (l) {
      var ls = C.v(d.l, l.id);
      if (!ls || !ls.length) err(z.id + ' science ' + i + ' : pas de texte pour ' + l.id);
      (ls || []).forEach(function (s) { verifTexte(s, z.id + ' science ' + i); });
    });
    if (typeof d.dessin !== 'function') err(z.id + ' science ' + i + ' : pas de dessin');
  });
});

console.log(bilan.join('\n'));
console.log('\n' + totalEtats + ' états explorés.');
if (avert.length) console.log('\nAvertissements (' + avert.length + ') :\n  ' + avert.join('\n  '));
if (erreurs.length) {
  console.log('\nERREURS (' + erreurs.length + ') :\n  ' + erreurs.join('\n  '));
  process.exit(1);
}
console.log('\nOK : toutes les combinaisons sont jouables jusqu\'au bout, aucune impasse.');
