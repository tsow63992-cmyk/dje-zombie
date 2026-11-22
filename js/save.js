/* Dje_zombie — sauvegarde locale (bestiaire, roulette du jour, réglages).
   Tout passe par try/catch : en navigation privée ou sans localStorage, le jeu marche quand même. */
(function () {
  'use strict';
  var DJE = window.DJE;
  var CLE = 'dje_zombie_s1';
  var defaut = function () { return { v: 1, bestiaire: {}, jours: {}, opts: { son: true, voix: false, reduit: null }, vus: {} }; };

  var S = DJE.save = { data: defaut(), dispo: false };

  S.charger = function () {
    try {
      var brut = window.localStorage.getItem(CLE);
      S.dispo = true;
      if (brut) {
        var d = JSON.parse(brut), base = defaut();
        Object.keys(base).forEach(function (k) { if (d[k] == null) d[k] = base[k]; });
        S.data = d;
      }
    } catch (e) { S.dispo = false; }
    return S.data;
  };
  S.ecrire = function () {
    try { window.localStorage.setItem(CLE, JSON.stringify(S.data)); return true; } catch (e) { return false; }
  };
  S.fiche = function (zid) {
    var b = S.data.bestiaire;
    if (!b[zid]) b[zid] = { vu: false, faible: false, parties: 0, survies: 0, meilleure: 0, fins: {} };
    return b[zid];
  };
  S.vu = function (zid) { S.fiche(zid).vu = true; S.ecrire(); };
  S.connu = function (zid) { var f = S.data.bestiaire[zid]; return !!(f && f.vu); };
  S.faibleTrouve = function (zid) { var f = S.data.bestiaire[zid]; return !!(f && f.faible); };
  /* Enregistre une partie terminée. Retourne true si le point faible vient d'être découvert. */
  S.partie = function (zid, res) {
    var f = S.fiche(zid), nouveau = false;
    f.vu = true;
    f.parties++;
    if (res.survie) f.survies++;
    if (res.nuit > f.meilleure) f.meilleure = res.nuit;
    if (res.fin) f.fins[res.fin] = 1;
    if (res.faible && !f.faible) { f.faible = true; nouveau = true; }
    S.ecrire();
    return nouveau;
  };
  S.jour = function (cle) { return S.data.jours[cle] || null; };
  S.setJour = function (cle, res) { if (!S.data.jours[cle]) { S.data.jours[cle] = res; S.ecrire(); } };
  S.opt = function (k, v) {
    if (v === undefined) return S.data.opts[k];
    S.data.opts[k] = v; S.ecrire(); return v;
  };
  S.dejaVu = function (k) { return !!S.data.vus[k]; };
  S.marquer = function (k) { if (!S.data.vus[k]) { S.data.vus[k] = 1; S.ecrire(); } };
})();
