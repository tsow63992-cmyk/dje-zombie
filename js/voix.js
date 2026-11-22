/* Dje_zombie — narration vocale optionnelle (speechSynthesis, fr-FR).
   Sans voix française installée, le jeu fonctionne avec les sous-titres seuls. */
(function () {
  'use strict';
  var DJE = window.DJE;
  var V = DJE.voix = { actif: false, dispo: false, voix: null, enCours: null };
  var ok = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  function choisir() {
    if (!ok) return;
    var toutes = window.speechSynthesis.getVoices() || [];
    var fr = toutes.filter(function (v) { return /^fr(-|_|$)/i.test(v.lang); });
    fr.sort(function (a, b) { return score(b) - score(a); });
    V.voix = fr[0] || null;
    V.dispo = !!V.voix;
    if (V.surChange) V.surChange();
  }
  function score(v) {
    var s = 0;
    if (/fr-FR/i.test(v.lang)) s += 4;
    if (/google|thomas|amélie|amelie|audrey|marie|denise|henri|natural|neural/i.test(v.name)) s += 3;
    if (/espeak/i.test(v.name)) s -= 3;
    if (v.localService) s += 1;
    return s;
  }
  V.init = function () {
    if (!ok) return;
    choisir();
    window.speechSynthesis.onvoiceschanged = choisir;
  };
  /* Dit une phrase. Résout quand c'est fini (ou tout de suite si la voix est coupée). */
  V.dire = function (texte) {
    if (!ok || !V.actif || !V.dispo || !texte) return null;
    return new Promise(function (res) {
      var fini = false;
      function fin() { if (!fini) { fini = true; clearTimeout(garde); V.enCours = null; res(); } }
      try {
        var u = new window.SpeechSynthesisUtterance(texte);
        u.lang = 'fr-FR'; u.voice = V.voix; u.rate = 1.04; u.pitch = 0.92; u.volume = 1;
        u.onend = fin; u.onerror = fin;
        window.speechSynthesis.speak(u);
        V.enCours = fin;
      } catch (e) { fin(); return; }
      var garde = setTimeout(fin, 1800 + texte.length * 95);
    });
  };
  V.stop = function () {
    if (!ok) return;
    try { window.speechSynthesis.cancel(); } catch (e) { /* rien */ }
    if (V.enCours) V.enCours();
  };
})();
