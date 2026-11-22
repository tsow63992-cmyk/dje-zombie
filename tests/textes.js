#!/usr/bin/env node
/* Dje_zombie — extrait tous les textes affichés (scènes, choix, indices, fins, science, fiches, lieux)
   dans un fichier texte, pour la relecture. Usage : node tests/textes.js > textes.txt */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var racine = path.join(__dirname, '..');
var ctx = { console: console }; ctx.globalThis = ctx; vm.createContext(ctx);
function charger(f) { vm.runInContext(fs.readFileSync(path.join(racine, f), 'utf8'), ctx, { filename: f }); }
['js/core.js', 'data/zombies.js', 'data/lieux.js'].forEach(charger);
fs.readdirSync(path.join(racine, 'data/scenes')).forEach(function (f) { charger('data/scenes/' + f); });
var DJE = ctx.DJE, C = DJE.core, vus = {}, out = [];
function ajoute(s) {
  if (typeof s !== 'string') return;
  s = s.replace(/\[\[[^\]]+\]\]/g, '').replace(/\*/g, '').trim();
  if (s && !vus[s]) { vus[s] = 1; out.push(s); }
}
function parcourir(x) {
  if (x == null) return;
  if (typeof x === 'string') return ajoute(x);
  if (Array.isArray(x)) return x.forEach(parcourir);
  if (typeof x === 'object') Object.keys(x).forEach(function (k) {
    if (['go', 'next', 'fin', 'vue', 'q', 'a', 'pose', 'type', 'id', 'need', 'set', 'flag', 'not', 'lieu', 'lieux', 'decor', 'fx', 'perd', 'gain', 'c', 'si', 'req', 'on'].indexOf(k) >= 0 && k !== 'pourquoi') return;
    if (k === 'acteurs' || k === 'branche' || k === 'dessin') return;
    parcourir(x[k]);
  });
}
DJE.data.zombies.forEach(function (z) { ['nom', 'comportement', 'faible', 'science'].forEach(function (k) { ajoute(z[k]); }); z.jauges.forEach(function (j) { ajoute(j[0]); }); });
DJE.data.lieux.forEach(function (l) {
  ajoute(l.nom); ajoute(l.titre); Object.keys(l.mots).forEach(function (k) { ajoute(l.mots[k]); });
  l.objets.forEach(function (o) { ajoute(o.nom); ajoute(o.desc); });
  parcourir(l.scenes);
  Object.keys(l.scenes).forEach(function (k) { ajoute(l.scenes[k].message); });
});
Object.keys(DJE.data.histoires).forEach(function (zid) {
  var h = DJE.data.histoires[zid];
  parcourir(h.scenes); parcourir(h.fins);
  ajoute(h.science.titre);
  h.science.diapos.forEach(function (d) { parcourir(d.l); });
});
console.log(out.join('\n'));
